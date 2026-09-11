// FILE: app/haullegal/api/remind/route.ts
import "server-only";
import { eq } from "drizzle-orm";
import { Resend } from "resend";
import { buildCalendar, daysUntil, formatYmd, HL_EMPTY_PROFILE, type HlProfile } from "@/lib/haullegal/deadlines";
import { claimReminder, listReminderCandidates, sweepReminderLedger } from "@/lib/db/haul";
import { db } from "@/lib/db/queries";
import { user } from "@/lib/db/schema";

// The Stay Legal reminder job (v1). Vercel Cron calls this once a
// day (vercel.json: path /haullegal/api/remind, schedule 0 14 * * *
// = 8am Mountain) with "Authorization: Bearer <CRON_SECRET>", the
// header Vercel adds automatically when the CRON_SECRET env var
// exists. Anything without that header gets 401, so the public
// route pass in the proxy is safe.
// For every account whose Stay Legal is live and reminders are on,
// it rebuilds the calendar from the saved profile with today's
// date (the same pure function the calendar page uses), finds
// every due date exactly 30, 7 or 1 days out, claims each one in
// the haul_reminders_sent ledger (primary key = exactly-once, so a
// re-run or a second cron tick can never double-send), and mails
// one bundled email per account through Resend from the same
// verified askevo.ai sender the password-reset email uses.
// Runs are bounded: 500 accounts per tick, one email per account,
// 60-second function ceiling.

export const maxDuration = 60;

const LEADS = [30, 7, 1];
const FROM = "HaulLegal <noreply@askevo.ai>";

type Item = { date: string; days: number; title: string; detail: string };

function label(days: number): string {
  if (days === 1) return "due tomorrow";
  return `due in ${days} days`;
}

function renderEmail(items: Item[]): { subject: string; html: string; text: string } {
  const subject = items.length === 1 ? `HaulLegal: ${items[0].title} is ${label(items[0].days)}` : `HaulLegal: ${items.length} deadlines coming up`;
  const rows = items
    .map((it) => `<tr><td style="padding:10px 12px;border-bottom:1px solid #eee;white-space:nowrap;font-weight:700;">${it.date}</td><td style="padding:10px 12px;border-bottom:1px solid #eee;"><div style="font-weight:700;">${it.title} <span style="color:#16a34a;font-weight:700;">(${label(it.days)})</span></div><div style="color:#555;font-size:13px;margin-top:3px;">${it.detail}</div></td></tr>`)
    .join("");
  const html = `
    <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 28px; color: #111;">
      <h1 style="font-size: 20px; margin: 0 0 6px;">Stay Legal reminder</h1>
      <p style="font-size: 14px; color: #444; line-height: 1.6; margin: 0 0 18px;">Here is what is coming up on your HaulLegal calendar. Dates come from the information you entered and the rules as we verified them - keep your own record and confirm with the agency.</p>
      <table style="border-collapse: collapse; width: 100%; font-size: 14px;">${rows}</table>
      <a href="https://haullegal.com/calendar" style="display: inline-block; margin: 22px 0 10px; padding: 12px 22px; background: #22c55e; color: #000; text-decoration: none; border-radius: 8px; font-weight: 700;">Open my calendar</a>
      <p style="font-size: 12px; color: #888; line-height: 1.6; margin-top: 18px;">You get these because Stay Legal reminders are on for your HaulLegal account. Turn them off from your calendar settings, or reply to this email and we will do it for you. HaulLegal is a product of AskEvo LLC, Boise, Idaho - not a government agency, not a law firm.</p>
    </div>`;
  const text = `Stay Legal reminder\n\n${items.map((it) => `${it.date} - ${it.title} (${label(it.days)})\n  ${it.detail}`).join("\n\n")}\n\nOpen your calendar: https://haullegal.com/calendar\n\nTurn reminders off in your calendar settings, or reply to this email.`;
  return { subject, html, text };
}

export async function GET(request: Request) {
  const expected = process.env.CRON_SECRET ?? "";
  const header = request.headers.get("authorization") ?? "";
  if (!expected || header !== `Bearer ${expected}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  const apiKey = process.env.RESEND_API_KEY ?? "";
  if (!apiKey) {
    return Response.json({ error: "no-resend-key" }, { status: 500 });
  }
  const resend = new Resend(apiKey);
  const today = new Date();
  const candidates = await listReminderCandidates(500);
  let emails = 0;
  let itemsSent = 0;
  let failures = 0;

  for (const c of candidates) {
    const raw = c.profile && typeof c.profile === "object" && !Array.isArray(c.profile) ? (c.profile as Partial<HlProfile>) : {};
    const profile: HlProfile = { ...HL_EMPTY_PROFILE, ...raw };
    const { dues } = buildCalendar(profile, today);
    const items: Item[] = [];
    for (const d of dues) {
      const days = daysUntil(d.due, today);
      if (!LEADS.includes(days)) continue;
      const dueDate = formatYmd(d.due);
      const first = await claimReminder({ userId: c.userId, dueId: d.id, dueDate, leadDays: days });
      if (first) items.push({ date: dueDate, days, title: d.title, detail: d.detail });
    }
    if (items.length === 0) continue;
    const rows = await db.select({ email: user.email, isAnonymous: user.isAnonymous }).from(user).where(eq(user.id, c.userId));
    const to = rows[0]?.email;
    if (!to || rows[0]?.isAnonymous || !to.includes("@")) continue;
    const mail = renderEmail(items);
    try {
      await resend.emails.send({ from: FROM, to, replyTo: "support@askevo.ai", subject: mail.subject, html: mail.html, text: mail.text });
      emails += 1;
      itemsSent += items.length;
    } catch (err) {
      failures += 1;
      console.error("HaulLegal reminder send failed:", err);
    }
  }

  try {
    await sweepReminderLedger();
  } catch (err) {
    console.error("HaulLegal reminder ledger sweep failed:", err);
  }

  return Response.json({ accounts: candidates.length, emails, items: itemsSent, failures });
}

// -----------------------------------------------------------
// END OF FILE - app/haullegal/api/remind/route.ts (v1 - daily
// cron, 30/7/1-day bundled reminder emails, exactly-once ledger)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
