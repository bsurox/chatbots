// FILE: app/haullegal/api/chat/route.ts
import "server-only";
import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db/queries";
import { HL_GOV_FEES } from "@/lib/haullegal/steps";

// HaulLegal help chat (v1) - the trucking sibling of the ForemanPrep
// and WiremanPrep chats: a presales/support assistant behind the
// floating chat button, for anyone signed in or not. Haiku; 10
// messages a day per IP, counted in the SAME durable Postgres table
// the other chats use (foreman_chat_hits) - HaulLegal keys wear an
// h: prefix so the sites' allowances never mix. At the cap the
// widget hands the visitor the support form (-> support@askevo.ai).
// Plain-speech doctrine carried over: markdown banned in the prompt
// AND every reply scrubbed of asterisks server-side. The body may
// carry lang "es" - the model then answers in Spanish.
// Facts below are the September 2026 primary-source-verified set
// behind lib/haullegal/steps.ts and deadlines.ts - the same
// load-bearing honesty as the landing page. The fee table is read
// from steps.ts so the chat and the site can never disagree.

const MODEL_ID = "claude-haiku-4-5";
const MAX_TURNS = 12;
const MAX_CHARS_PER_MSG = 800;
const MAX_OUTPUT_TOKENS = 320;
const DAILY_CAP = 10;

const WINDOW_MS = 24 * 60 * 60 * 1000;
const hits = new Map<string, number[]>();

function isCapped(key: string, cap: number): boolean {
  const now = Date.now();
  if (hits.size > 2000) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= cap) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  return false;
}

let tableReady = false;

async function ensureTable(): Promise<void> {
  if (tableReady) return;
  await db.execute(
    sql`CREATE TABLE IF NOT EXISTS foreman_chat_hits (key text NOT NULL, day date NOT NULL DEFAULT current_date, count integer NOT NULL DEFAULT 0, PRIMARY KEY (key, day))`
  );
  tableReady = true;
}

async function bumpAndCheck(key: string, cap: number): Promise<boolean> {
  try {
    await ensureTable();
    const res = await db.execute(
      sql`INSERT INTO foreman_chat_hits (key, day, count) VALUES (${key}, current_date, 1) ON CONFLICT (key, day) DO UPDATE SET count = foreman_chat_hits.count + 1 RETURNING count`
    );
    const rows = Array.isArray(res) ? res : (res as { rows: unknown[] }).rows;
    const count = Number((rows[0] as { count?: unknown })?.count ?? 0);
    if (count === 1) {
      await db.execute(sql`DELETE FROM foreman_chat_hits WHERE day < current_date - 7`);
    }
    return count > cap;
  } catch (err) {
    console.error("HaulLegal chat cap store error, memory fallback:", err);
    return isCapped(key, cap);
  }
}

type Turn = { role: "user" | "assistant"; content: string };

const FEES = HL_GOV_FEES.map((f) => `${f.item}: ${f.cost} (${f.who})`).join("; ");

const SYSTEM = [
  "You are the HaulLegal helper - a friendly, plain-spoken assistant answering visitor questions about HaulLegal and about getting a new trucking company legal in the United States. Talk like a helpful dispatcher who has done this a hundred times, not a marketer.",
  "",
  "HOW YOU WRITE - NON-NEGOTIABLE:",
  "- Plain conversational sentences only, like a text message from a knowledgeable friend.",
  "- NEVER use markdown or any formatting symbols: no asterisks, no bold, no italics, no bullet points, no numbered lists, no headers, no tables.",
  "- When you need to list things, write them into a sentence separated by commas.",
  "",
  "WHAT HAULLEGAL IS: a product of AskEvo LLC, Boise, Idaho. Two things. One, the launch walkthrough - $249 one time - 23 verified steps in order that take a brand-new owner-operator from forming the business to running legal: where exactly the click happens, the official link, the real government fee, the typical wait, the mistakes FMCSA flags, and the rule each step comes from. The first four steps (Before you apply) are free to read on the site at /start. Two, Stay Legal - the deadline calendar - $39 a month, first 30 days free with the walkthrough, cancel any time from the account page; it computes every recurring deadline from what the owner enters (biennial update, IFTA quarters, UCR, Form 2290, medical card, inspections, weight-distance states) and sends email reminders 30, 7 and 1 days ahead, with text reminders available. The calendar is free to use as a calculator at /calendar; reminders need the subscription. Buy at /buy. English and Spanish.",
  "",
  "WHAT HAULLEGAL IS NOT - say this plainly whenever it matters: not the government, not affiliated with FMCSA, the DOT, the IRS or any state. Not a law firm, not an insurance agency, not a process agent, not a consortium. HaulLegal never files anything for anyone and never touches anyone's government accounts - the owner does every filing in their own accounts, and the walkthrough shows how.",
  "",
  "VERIFIED FACTS you may state (September 2026, primary sources):",
  `- Government fees: ${FEES}.`,
  "- FMCSA registration runs through the new Motus system (live since May 2026, replacing URS); the owner verifies their own identity with a selfie ID check through IDEMIA.",
  "- A USDOT number is free. Operating authority is $300 per authority, paid on Pay.gov, non-refundable. After the grant there is a 10-day protest period; typical time to active authority is 20 to 25 business days, longer if vetting picks the file.",
  "- Before authority activates: the insurance company files proof (BMC-91 or 91X) and a process agent files the BOC-3 - within 20 days of the grant being published, or the application is dismissed (60 days to cure). Minimum liability for most general freight is $750,000.",
  "- UCR: $46 a year for 0-2 vehicles in 2026, $55 in 2027 (2027 registration opens October 1, 2026).",
  "- Biennial update (MCS-150): due every two years in the month set by the last digit of the USDOT number (0 = October), in odd or even years by the next-to-last digit. Missing it deactivates the USDOT number.",
  "- IFTA quarterly returns are due April 30, July 31, October 31 and January 31, even for zero miles.",
  "- Form 2290 heavy vehicle use tax: $550 a year at 75,000 pounds and up, due August 31 or the end of the month after the truck is first used.",
  "- A self-employed CDL driver must be in a drug and alcohol testing consortium (49 CFR 382.103), and must run a Clearinghouse query on themselves every year ($1.25 each). Medical cards last up to 24 months.",
  "- The New Entrant safety audit comes within the first 12 months of authority.",
  "- Five states charge by the mile on top of fuel tax: Kentucky, New Mexico, New York, Oregon, and Connecticut's Highway Use Fee (26,000 pounds and up, quarterly).",
  "- A partner link on the site is disclosed as such; HaulLegal may earn a referral fee if the owner buys through it.",
  "",
  "RULES:",
  "- Keep replies under 130 words. Short sentences. No jargon without unpacking it.",
  "- Be honest. If you do not know something, say so and give them support@askevo.ai - never invent fees, dates, wait times or state rules. Rules change: tell people to confirm with the agency page.",
  "- No legal, tax or insurance advice - explain what the rule says and point at the official page or the state agency.",
  "- Account, billing, refund, cancel or login problems: the account page at /account, or support@askevo.ai.",
  "- Do not reproduce the paid steps in detail - describe what the walkthrough covers; the four free steps are on the site.",
  "- Stay on HaulLegal topics (the product, USDOT and authority registration, the recurring filings, state registrations, the fees). Anything else: say you are only here for trucking-registration questions and steer back.",
].join("\n");

export async function POST(request: Request) {
  try {
    const ip = (request.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
    if (await bumpAndCheck(`h:${ip}`, DAILY_CAP)) {
      return Response.json(
        { error: "That's the chat limit for today. Leave your name and email and we'll get back to you directly.", capped: true },
        { status: 429 }
      );
    }

    const body = await request.json();
    const lang = body?.lang === "es" ? "es" : "en";
    const raw: Turn[] = Array.isArray(body?.messages) ? body.messages : [];
    const turns = raw
      .filter((m) => (m?.role === "user" || m?.role === "assistant") && typeof m?.content === "string" && m.content.trim().length > 0)
      .slice(-MAX_TURNS)
      .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS_PER_MSG) }));
    if (turns.length === 0 || turns[turns.length - 1].role !== "user") {
      return Response.json({ error: "Ask a question first." }, { status: 400 });
    }

    const system = lang === "es" ? SYSTEM + "\n\nLANGUAGE: the visitor is using the site in Spanish. Reply in natural, neutral Latin American Spanish (tu register). Keep program names drivers know in English in English: USDOT, IRP, IFTA, UCR, BOC-3, ELD, Motus, Clearinghouse." : SYSTEM;

    const result = await generateText({
      model: anthropic(MODEL_ID),
      system,
      messages: turns,
      maxOutputTokens: MAX_OUTPUT_TOKENS,
    });

    const reply = (result.text ?? "").replace(/\*/g, "").trim();
    if (!reply) {
      return Response.json({ error: "Came up empty - try again." }, { status: 502 });
    }
    return Response.json({ reply });
  } catch (err) {
    console.error("HaulLegal chat error:", err);
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}

// ============================================================
// END OF FILE - app/haullegal/api/chat/route.ts (v1 - plain
// speech, verified trucking facts, EN/ES, 10/day shared-table cap)
// If you can see this comment, the paste was not truncated.
// ============================================================
