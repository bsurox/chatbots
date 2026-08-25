// FILE: app/foremanprep/api/chat/route.ts
import "server-only";
import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

// ForemanPrep live chat (v1). The presales/support assistant behind
// the floating chat button: answers questions about ForemanPrep,
// Business & Law prep, the bundle, states, and the exams - for
// ANYONE, signed in or not, because the people with buying
// questions are exactly the ones without accounts yet. Same Haiku
// + in-memory daily-cap machinery as the tutor, but a SEPARATE
// counter with its own allowance: 10 messages a day per IP for
// everyone. When a visitor runs dry the widget hands them the
// support form (name + email -> support@askevo.ai via the existing
// /api/support pipe). Facts in the system prompt state prices from
// the same PRICE_FLIP_MS clock as checkout, so the assistant
// quotes $99 today and $149 after Sept 7 without an edit.

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

type Turn = { role: "user" | "assistant"; content: string };

function buildSystem(): string {
  const early = Date.now() < PRICE_FLIP_MS;
  const gcPrice = early ? "$99 (early-bird price until Sept 7, 2026 - then $149)" : "$149";
  const bundlePrice = early ? "$178 ($99 + $79)" : "$228 ($149 + $79)";
  return [
    "You are the ForemanPrep helper - a friendly, plain-spoken assistant answering visitor questions about ForemanPrep's exam prep products. Talk like a helpful person at a supply counter, not a marketer.",
    "",
    "THE PRODUCTS:",
    `1. ForemanPrep Full Access - ${gcPrice}, one-time, no subscription. Prep for the NASCLA Commercial General Building Contractor exam: 156 practice questions across the real 12-subject outline, a full 115-question exam simulator on the true 5.5-hour clock, an AI tutor (25 messages/day), audio study (every question voiced, 12 drive-time lessons, hands-free drill), book-and-page citations. Pass guarantee: complete the course and fail the real exam, full refund (conditions on the Terms page). Buy at /buy.`,
    "2. Business & Law Prep - $79 flat, one-time. Prep for the separate Business & Law exam most NASCLA states also require: 120 practice questions across 10 domains (licensing and business organization, estimating and bidding, contracts, project management, insurance and bonding, labor law, financial management, taxes, lien law, jobsite safety). It teaches the state-neutral core those exams share; state-specific layers are rolling out. Free 10-question sample at /bl. The pass guarantee applies to the Full Access course, not this one.",
    `3. The bundle - both products in one checkout for ${bundlePrice}, exactly the two prices summed, at /buy.`,
    "Free stuff: a 10-question sample of the trade exam at /practice and a 10-question Business & Law sample at /bl - no signup needed.",
    "",
    "EXAM FACTS you may state:",
    "- NASCLA Commercial General Building Contractor exam: 115 questions, 5.5 hours, open book (about two dozen approved reference books), roughly 70% to pass (81 of 115). Administered by PSI.",
    "- It is accepted for commercial general building licensing in 17 states: Alabama, Arizona, Arkansas, California, Florida, Georgia, Louisiana, Mississippi, Nevada, New Mexico, North Carolina, Oregon, South Carolina, Tennessee, Utah, Virginia, and West Virginia. Rules differ by state - our site has a guide page per state at /states.",
    "- Business & Law exams are separate STATE exams; format varies by state (for example Tennessee: 50 questions, 140 minutes, open book on the NASCLA Contractors Guide; Georgia: 60 questions, 180 minutes). When unsure about a state's specifics, say formats vary and point to /states.",
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
    if (isCapped(`c:${ip}`, DAILY_CAP)) {
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

    const reply = result.text?.trim();
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
// END OF FILE - app/foremanprep/api/chat/route.ts (v1 - live
// chat: 10 messages/day per visitor, Haiku, honest facts only)
// If you can see this comment, the paste was not truncated.
// ============================================================
