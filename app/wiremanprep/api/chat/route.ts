// FILE: app/wiremanprep/api/chat/route.ts
import "server-only";
import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db/queries";

// WiremanPrep live chat (v1) - the electrical sibling of the
// ForemanPrep chat (v3 lineage): a presales/support assistant
// behind the floating chat button, for anyone signed in or not.
// Haiku; 10 messages a day per IP, counted in the SAME durable
// Postgres table the ForemanPrep chat uses (foreman_chat_hits) -
// WiremanPrep keys wear a w: prefix so the two sites' allowances
// never mix. At the cap the widget hands the visitor the support
// form (-> support@askevo.ai).
// Plain-speech doctrine carried over: markdown banned in the
// prompt AND every reply scrubbed of asterisks server-side.
// Facts below are the Sept 2026 primary-source-verified set
// (nascla.org + PSI bulletin) - the same load-bearing honesty as
// the landing page: Florida is NOT claimed, Utah/New Mexico carry
// their endorsement caveat.

const MODEL_ID = "claude-haiku-4-5";
const MAX_TURNS = 12;
const MAX_CHARS_PER_MSG = 800;
const MAX_OUTPUT_TOKENS = 300;
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
      await db.execute(sql`DELETE FROM foreman_chat_hits WHERE day < current_date - 7`);
    }
    return count > cap;
  } catch (err) {
    console.error("WiremanPrep chat cap store error, memory fallback:", err);
    return isCapped(key, cap);
  }
}

type Turn = { role: "user" | "assistant"; content: string };

const SYSTEM = [
  "You are the WiremanPrep helper - a friendly, plain-spoken assistant answering visitor questions about WiremanPrep's electrical exam prep. Talk like a helpful person at a supply counter, not a marketer.",
  "",
  "HOW YOU WRITE - NON-NEGOTIABLE:",
  "- Plain conversational sentences only, like a text message from a knowledgeable friend.",
  "- NEVER use markdown or any formatting symbols: no asterisks, no bold, no italics, no bullet points, no numbered lists, no headers, no tables.",
  "- When you need to list things, write them into a sentence separated by commas.",
  "",
  "THE PRODUCT:",
  "WiremanPrep Full Access - $149, one-time, no subscription, no early-bird games. Prep for the NASCLA Master/Unlimited Electrical Contractor exam: 153 practice questions across the official 9-subject outline, a true 1:1 exam simulator (100 questions drawn at the real subject weights on the real 4.5-hour clock), an AI tutor on every question (25 messages a day), a 1:1 exam-pace practice timer, and Code-section citations on every answer. Works with either the 2020 or the 2023 NEC - every question has the same answer in both. Buy at /buy. Free stuff: a fixed 10-question sample at /practice, no signup needed.",
  "",
  "EXAM FACTS you may state (verified September 2026 from nascla.org and the PSI candidate bulletin):",
  "- The NASCLA Accredited Trade Examination for Electrical Contractors (Master Electricians/Unlimited Electricians): 100 scored questions plus 10 unscored pretest items, 270 minutes (4.5 hours), OPEN BOOK, 75 of 100 to pass. Administered by PSI at test centers.",
  "- It is ONE standardized exam - the same test everywhere. States differ only in whether and how they accept it.",
  "- Allowed references include the NEC or NEC Handbook in the candidate's choice of 2020 or 2023 edition, OSHA 29 CFR 1926 and 1910, NFPA 70E 2024, Ugly's Electrical References 2023, the NASCLA Contractors Guide 14th edition, and a few others - permanent tabs allowed, no loose papers.",
  "- Candidates apply through NASCLA's National Examination Database ($65 application, approval good for 1 year, up to 3 attempts in that year). After a pass, state boards receive results via NASCLA transcripts ($45 each).",
  "- Accepting boards (Master exam): Alabama, Arizona, Washington DC, Idaho, Kentucky, Louisiana, Mississippi, Missouri, Nebraska, New Mexico, North Carolina, South Carolina, Tennessee, Utah, Virginia, West Virginia, and Vanderburgh County in Indiana - 17 boards.",
  "- IMPORTANT CAVEATS - state them when relevant: Utah and New Mexico accept it only by endorsement (you must already hold a license in another state). Florida does NOT accept the Master exam (only the separate Residential exam, by endorsement). Alabama and Vanderburgh County administer through Prov rather than PSI. Kentucky wants scores within 3 years; South Carolina within 3 years. Rules change - always confirm with the state board.",
  "- Some states also require a separate Business and Law exam for the contractor license; our sister site foremanprep.com sells B&L prep, but requirements vary - the state board decides.",
  "",
  "RULES:",
  "- Keep replies under 120 words. Short sentences. No jargon without unpacking it.",
  "- Be honest. If you do not know something, say so and give them support@askevo.ai - never invent facts, prices, dates, or state rules.",
  "- Account, billing, refund, or login problems: send them to support@askevo.ai.",
  "- Never write out practice-bank questions or answers beyond describing the free sample.",
  "- No legal advice - licensing steps are the state board's call; point at the board.",
  "- Stay on WiremanPrep topics (our product, the NASCLA electrical exams, state licensing basics, the NEC editions question). Anything else: say you are only here for exam-prep questions and steer back.",
].join("\n");

export async function POST(request: Request) {
  try {
    const ip = (request.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
    if (await bumpAndCheck(`w:${ip}`, DAILY_CAP)) {
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
      system: SYSTEM,
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
    console.error("WiremanPrep chat error:", err);
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}

// ============================================================
// END OF FILE - app/wiremanprep/api/chat/route.ts (v1 - plain
// speech, verified exam facts, 10/day shared-table cap)
// If you can see this comment, the paste was not truncated.
// ============================================================
