// FILE: app/foremanprep/api/tutor/route.ts
import "server-only";
import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { getQuestion } from "@/lib/foremanprep/questions";

// ForemanPrep tutor v1 (Day 8). A question-scoped tutor: the client
// sends a question id plus the short back-and-forth so far, and the
// model answers as a plain-spoken exam coach who always points at
// the book and section. Haiku keeps the cost to fractions of a cent
// per message. Cost fences, not paywalls, for now: a per-visitor
// daily cap and hard limits on thread size and reply length - the
// real gate arrives on paywall day.

const MODEL_ID = "claude-haiku-4-5";
const MAX_TURNS = 12;
const MAX_CHARS_PER_MSG = 1200;
const MAX_OUTPUT_TOKENS = 400;
const DAILY_CAP = 25;

const WINDOW_MS = 24 * 60 * 60 * 1000;
const hits = new Map<string, number[]>();

function isCapped(key: string): boolean {
  const now = Date.now();
  if (hits.size > 2000) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= DAILY_CAP) {
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
    const ip = (request.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
    if (isCapped(ip)) {
      return Response.json(
        { error: "You've hit today's tutor limit. Come back tomorrow." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const q = getQuestion(typeof body?.questionId === "string" ? body.questionId : "");
    if (!q) {
      return Response.json({ error: "Unknown question." }, { status: 400 });
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
      "You are the ForemanPrep tutor: a plain-spoken coach helping a working tradesman pass the NASCLA Commercial General Building Contractor exam.",
      "The student is looking at this practice question:",
      `QUESTION: ${q.q}`,
      `CHOICES: ${q.choices.map((c, i) => `${"ABCD"[i]}) ${c}`).join(" | ")}`,
      `CORRECT ANSWER: ${"ABCD"[q.answer]}) ${q.choices[q.answer]}`,
      `EXPLANATION: ${q.explain}`,
      `REFERENCE: ${q.cite}`,
      "Rules: Explain like a good foreman would - short sentences, no jargon without unpacking it, no talking down. Always anchor answers to the reference book and section so the student learns WHERE to find it (the exam is open book - finding it fast is the skill). Stay on this question and closely related exam topics. If asked about anything unrelated to contractor-exam prep, say you're only here for exam questions and steer back. Keep replies under 150 words unless walking through a calculation.",
    ].join("\n");

    const result = await generateText({
      model: anthropic(MODEL_ID),
      system,
      messages: turns,
      maxOutputTokens: MAX_OUTPUT_TOKENS,
    });

    const reply = result.text?.trim();
    if (!reply) {
      return Response.json({ error: "The tutor came up empty - try again." }, { status: 502 });
    }
    return Response.json({ reply });
  } catch (err) {
    console.error("ForemanPrep tutor error:", err);
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}

// ============================================================
// END OF FILE - app/foremanprep/api/tutor/route.ts (v1)
// If you can see this comment, the paste was not truncated.
// ============================================================
