// FILE: app/wiremanprep/api/tutor/route.ts
import "server-only";
import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { auth } from "@/app/(auth)/auth";
import { guestRegex } from "@/lib/constants";
import { hasWiremanAccess } from "@/lib/db/foreman";
import { getWmQuestion } from "@/lib/wiremanprep/questions";

// WiremanPrep tutor (v2 - PLAIN SPEECH: the model kept decorating
// replies with markdown asterisks, which render as literal *
// characters in the practice room and make replies hard to read.
// The system prompt now bans markdown outright, and as a hard
// guarantee every reply is scrubbed of asterisk characters
// server-side before it leaves this route - same fix the chat
// got.) v1 notes: the electrical sibling of the
// ForemanPrep tutor. Question-scoped: the client sends a question
// id plus the short back-and-forth so far, and the model answers
// as a plain-spoken master-electrician coach who always points at
// the exact NEC section or table. Haiku keeps the cost to
// fractions of a cent per message.
// Tiers: WiremanPrep owners get 25 messages a day keyed to their
// account (its own pool - separate product, separate allowance);
// everyone else gets 3 a day per IP - enough to taste the tutor,
// not enough to live off it.
// KNOWN LIMITATION carried from the ForemanPrep tutor: the daily
// caps live in instance memory, so a redeploy or a fresh serverless
// instance resets them. Fine at launch scale; move to Postgres
// like the chat cap if abuse ever shows.
// Dual-edition doctrine: the bank only teaches material that is
// identical in the 2020 and 2023 NEC, and the persona is told so -
// it cites sections without pushing the student onto an edition
// they do not own.

const MODEL_ID = "claude-haiku-4-5";
const MAX_TURNS = 12;
const MAX_CHARS_PER_MSG = 1200;
const MAX_OUTPUT_TOKENS = 400;
const PAID_DAILY_CAP = 25;
const FREE_DAILY_CAP = 3;

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const qid = typeof body?.questionId === "string" ? body.questionId : "";
    const q = getWmQuestion(qid);
    if (!q) {
      return Response.json({ error: "Unknown question." }, { status: 400 });
    }

    // Tier check: paid owners are capped per account, everyone else
    // per IP. Guests count as free - a throwaway guest row never
    // owns a purchase.
    const session = await auth();
    const userId = session?.user?.id;
    const email = session?.user?.email ?? "";
    const realUser = Boolean(userId) && !guestRegex.test(email);
    const paid = realUser && userId ? await hasWiremanAccess(userId) : false;

    if (paid && userId) {
      if (isCapped(`u:${userId}`, PAID_DAILY_CAP)) {
        return Response.json(
          { error: "You've hit today's tutor limit. Come back tomorrow." },
          { status: 429 }
        );
      }
    } else {
      const ip = (request.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
      if (isCapped(`ip:${ip}`, FREE_DAILY_CAP)) {
        return Response.json(
          {
            error:
              "That's the free tutor limit for today. Full Access includes 25 tutor messages a day.",
          },
          { status: 429 }
        );
      }
    }

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

    const system = [
      "You are the WiremanPrep tutor: a plain-spoken master-electrician coach helping a working electrician pass the NASCLA Master/Unlimited Electrical Contractor exam.",
      "The student is looking at this practice question:",
      `QUESTION: ${q.q}`,
      `CHOICES: ${q.choices.map((c, i) => `${"ABCD"[i]}) ${c}`).join(" | ")}`,
      `CORRECT ANSWER: ${"ABCD"[q.answer]}) ${q.choices[q.answer]}`,
      `EXPLANATION: ${q.explain}`,
      `REFERENCE: ${q.cite}`,
      "HOW YOU WRITE - NON-NEGOTIABLE: plain conversational sentences only. NEVER use markdown or any formatting symbols: no asterisks, no bold, no italics, no bullet points, no numbered lists, no headers. When you need to list things, write them into a sentence separated by commas.",
      "Rules: Explain like a good journeyman-turned-master would - short sentences, no jargon without unpacking it, no talking down. Always anchor answers to the exact NEC section or table (or OSHA/NFPA 70E reference) so the student learns WHERE to find it - the exam is open book and finding it fast is the skill. The exam allows either the 2020 or the 2023 NEC and this course only teaches material that reads the same in both, so cite sections without telling the student to buy a different edition. Walk calculations step by step and show the arithmetic. Stay on this question and closely related electrical-exam topics. If asked about anything unrelated to electrical-exam prep, say you're only here for exam questions and steer back. Keep replies under 150 words unless walking through a calculation.",
    ].join("\n");

    const result = await generateText({
      model: anthropic(MODEL_ID),
      system,
      messages: turns,
      maxOutputTokens: MAX_OUTPUT_TOKENS,
    });

    // Hard plain-text guarantee: markdown asterisks render as
    // literal stars in the tutor thread, so none may leave here.
    const reply = (result.text ?? "").replace(/\*/g, "").trim();
    if (!reply) {
      return Response.json({ error: "The tutor came up empty - try again." }, { status: 502 });
    }
    return Response.json({ reply });
  } catch (err) {
    console.error("WiremanPrep tutor error:", err);
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}

// ============================================================
// END OF FILE - app/wiremanprep/api/tutor/route.ts (v2 - plain
// speech: markdown banned + asterisks scrubbed server-side)
// If you can see this comment, the paste was not truncated.
// ============================================================
