// FILE: app/foremanprep/api/chat/route.ts
import "server-only";
import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db/queries";
import { GUIDES } from "@/lib/foremanprep/guides";
import { STATES } from "@/lib/foremanprep/states";

// ForemanPrep live chat (v3). Two changes this round (his specs):
// 1. PLAIN SPEECH: the assistant kept decorating replies with
//    markdown asterisks, which render as literal * characters in
//    the widget and make replies hard to read. The system prompt
//    now bans markdown outright, and as a hard guarantee every
//    reply is scrubbed of asterisk characters server-side before
//    it leaves this route - even a disobedient reply arrives clean.
// 2. STATE KNOWLEDGE: the chat is now trained on the state
//    library. At module load it compiles every state's verified
//    fact box from lib/foremanprep/states.ts (licensing agency,
//    what NASCLA counts for there, what the state still requires,
//    score windows, board site - verified Aug 2026) plus the five
//    guide article titles from lib/foremanprep/guides.ts into the
//    system prompt. Visitors get real per-state answers on the
//    spot instead of being told to go dig through the guides; the
//    guide and state URLs are offered for the deep detail. One
//    source of truth: edit states.ts and the chat learns it on the
//    next deploy, no edit here.
// v2 notes: the daily cap lives in Postgres (self-creating
// foreman_chat_hits table, upsert per message, 7-day sweep,
// in-memory fallback if the DB hiccups) because Vercel instances
// restart constantly and a refresh was resetting an in-memory
// counter. v1 notes: presales/support assistant behind the
// floating chat button, for ANYONE signed in or not; Haiku; 10
// messages/day per IP; at the cap the widget hands the visitor
// the support form (-> support@askevo.ai). Prices quoted from the
// same PRICE_FLIP_MS clock as checkout: $99 today, $149 after
// Sept 7, no edit needed.

const MODEL_ID = "claude-haiku-4-5";
const MAX_TURNS = 12;
const MAX_CHARS_PER_MSG = 800;
const MAX_OUTPUT_TOKENS = 300;
const DAILY_CAP = 10;

// Sept 7, 2026, 11:59 PM MDT (UTC-6) = Sept 8, 05:59 UTC.
// Month index 8 = September.
const PRICE_FLIP_MS = Date.UTC(2026, 8, 8, 5, 59, 0);

const WINDOW_MS = 24 * 60 * 60 * 1000;
const hits = new Map<string, number[]>();

// Compiled once at module load. One line per state: the verified
// fact box the state pages render, flattened for the model.
const STATE_KNOWLEDGE = STATES.map(
  (s) =>
    "- " +
    s.name.toUpperCase() +
    " (full guide: /states/" +
    s.slug +
    "): " +
    s.facts.map((f) => f.l + ": " + f.v).join("; ")
).join("\n");

const GUIDE_LIST = GUIDES.map((g) => "- " + g.h1 + " -> /guides/" + g.slug).join(
  "\n"
);

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

// Durable daily counter: one upsert returns this visitor's count
// for today; over the cap means capped. Any storage failure falls
// back to the in-memory counter - degraded, never wide open.
async function bumpAndCheck(key: string, cap: number): Promise<boolean> {
  try {
    await ensureTable();
    const res = await db.execute(
      sql`INSERT INTO foreman_chat_hits (key, day, count) VALUES (${key}, current_date, 1) ON CONFLICT (key, day) DO UPDATE SET count = foreman_chat_hits.count + 1 RETURNING count`
    );
    const rows = Array.isArray(res) ? res : (res as { rows: unknown[] }).rows;
    const count = Number((rows[0] as { count?: unknown })?.count ?? 0);
    if (count === 1) {
      // A visitor's first message today is a cheap moment to sweep
      // rows nobody will ever read again.
      await db.execute(sql`DELETE FROM foreman_chat_hits WHERE day < current_date - 7`);
    }
    return count > cap;
  } catch (err) {
    console.error("ForemanPrep chat cap store error, memory fallback:", err);
    return isCapped(key, cap);
  }
}

type Turn = { role: "user" | "assistant"; content: string };

function buildSystem(): string {
  const early = Date.now() < PRICE_FLIP_MS;
  const gcPrice = early ? "$99 (early-bird price until Sept 7, 2026 - then $149)" : "$149";
  const bundlePrice = early ? "$178 ($99 + $79)" : "$228 ($149 + $79)";
  return [
    "You are the ForemanPrep helper - a friendly, plain-spoken assistant answering visitor questions about ForemanPrep's exam prep products. Talk like a helpful person at a supply counter, not a marketer.",
    "",
    "HOW YOU WRITE - NON-NEGOTIABLE:",
    "- Plain conversational sentences only, like a text message from a knowledgeable friend.",
    "- NEVER use markdown or any formatting symbols: no asterisks, no bold, no italics, no bullet points, no numbered lists, no headers, no tables.",
    "- When you need to list things, write them into a sentence separated by commas.",
    "",
    "THE PRODUCTS:",
    `1. ForemanPrep Full Access - ${gcPrice}, one-time, no subscription. Prep for the NASCLA Commercial General Building Contractor exam: 156 practice questions across the real 12-subject outline, a full 115-question exam simulator on the true 5.5-hour clock, an AI tutor (25 messages/day), audio study (every question voiced, 12 drive-time lessons, hands-free drill), book-and-page citations. Pass guarantee: complete the course and fail the real exam, full refund (conditions on the Terms page). Buy at /buy.`,
    "2. Business & Law Prep - $79 flat, one-time. Prep for the separate Business & Law exam most NASCLA states also require: 120 practice questions across 10 domains (licensing and business organization, estimating and bidding, contracts, project management, insurance and bonding, labor law, financial management, taxes, lien law, jobsite safety). It teaches the state-neutral core those exams share; state-specific layers are rolling out. Free 10-question sample at /bl. The pass guarantee applies to the Full Access course, not this one.",
    `3. The bundle - both products in one checkout for ${bundlePrice}, exactly the two prices summed, at /buy.`,
    "Free stuff: a 10-question sample of the trade exam at /practice and a 10-question Business & Law sample at /bl - no signup needed.",
    "",
    "EXAM FACTS you may state:",
    "- NASCLA Commercial General Building Contractor exam: 115 questions, 5.5 hours, open book (about two dozen approved reference books), roughly 70% to pass (81 of 115). Administered by PSI.",
    "- It is accepted for commercial general building licensing in 17 states: Alabama, Arizona, Arkansas, California, Florida, Georgia, Louisiana, Mississippi, Nevada, New Mexico, North Carolina, Oregon, South Carolina, Tennessee, Utah, Virginia, and West Virginia.",
    "- After a pass, the score lands in NASCLA's National Examination Database within about 48 hours; the candidate then requests an electronic transcript to any participating state board they apply to. One exam, seventeen states.",
    "- Business & Law exams are separate STATE exams; format varies by state (for example Tennessee: 50 questions, 140 minutes, open book on the NASCLA Contractors Guide; Georgia: 60 questions, 180 minutes).",
    "",
    "STATE-BY-STATE FACTS (verified August 2026 - answer state questions directly from these):",
    STATE_KNOWLEDGE,
    "Each state has a full guide at the /states/ URL shown - offer it for the deep detail, and /states is the index. Anything not covered by these facts is the state board's call: say so and point at the board site listed.",
    "",
    "FREE GUIDE ARTICLES you can point people to:",
    GUIDE_LIST,
    "",
    "RULES:",
    "- Keep replies under 120 words. Short sentences. No jargon without unpacking it.",
    "- Be honest. If you do not know something, say so and give them support@askevo.ai - never invent facts, prices, dates, or state rules.",
    "- Account, billing, refund, or login problems: send them to support@askevo.ai.",
    "- Never write out practice-bank questions or answers beyond describing the free samples.",
    "- No legal or tax advice - licensing steps are the state board's call; point at the state's board or our /states guides.",
    "- Stay on ForemanPrep topics (our products, the NASCLA exam, Business & Law exams, state licensing basics). Anything else: say you are only here for exam-prep questions and steer back.",
  ].join("\n");
}

export async function POST(request: Request) {
  try {
    const ip = (request.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
    if (await bumpAndCheck(`c:${ip}`, DAILY_CAP)) {
      return Response.json(
        {
          error:
            "That's the chat limit for today. Leave your name and email and we'll get back to you directly.",
          capped: true,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const raw: Turn[] = Array.isArray(body?.messages) ? body.messages : [];
    const turns = raw
      .filter(
        (m) =>
          (m?.role === "user" || m?.role === "assistant") &&
          typeof m?.content === "string" &&
          m.content.trim().length > 0
      )
      .slice(-MAX_TURNS)
      .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS_PER_MSG) }));
    if (turns.length === 0 || turns[turns.length - 1].role !== "user") {
      return Response.json({ error: "Ask a question first." }, { status: 400 });
    }

    const result = await generateText({
      model: anthropic(MODEL_ID),
      system: buildSystem(),
      messages: turns,
      maxOutputTokens: MAX_OUTPUT_TOKENS,
    });

    // Hard plain-text guarantee: markdown asterisks render as
    // literal stars in the widget, so none may leave this route.
    const reply = (result.text ?? "").replace(/\*/g, "").trim();
    if (!reply) {
      return Response.json({ error: "Came up empty - try again." }, { status: 502 });
    }
    return Response.json({ reply });
  } catch (err) {
    console.error("ForemanPrep chat error:", err);
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}

// ============================================================
// END OF FILE - app/foremanprep/api/chat/route.ts (v3 - plain
// speech, no asterisks ever, trained on the state library)
// If you can see this comment, the paste was not truncated.
// ============================================================
