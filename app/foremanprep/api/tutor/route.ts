// FILE: app/foremanprep/api/tutor/route.ts
import "server-only";
import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { auth } from "@/app/(auth)/auth";
import { guestRegex } from "@/lib/constants";
import { hasForemanAccess } from "@/lib/db/foreman";
import { getQuestion } from "@/lib/foremanprep/questions";

// ForemanPrep tutor v2 (paywall). A question-scoped tutor: the
// client sends a question id plus the short back-and-forth so far,
// and the model answers as a plain-spoken exam coach who always
// points at the book and section. Haiku keeps the cost to fractions
// of a cent per message. Tiers: Full Access owners get 25 messages
// a day keyed to their account; everyone else gets 3 a day per IP -
// enough to taste the tutor, not enough to live off it.

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
    // Tier check: Full Access owners are capped per account, everyone
    // else per IP. Guests count as free - a throwaway guest row never
    // owns a purchase.
    const session = await auth();
    const userId = session?.user?.id;
    const email = session?.user?.email ?? "";
    const realUser = Boolean(userId) && !guestRegex.test(email);
    const paid = realUser && userId ? await hasForemanAccess(userId) : false;

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
// END OF FILE - app/foremanprep/api/tutor/route.ts (v2 - paid and
// free tiers)
// If you can see this comment, the paste was not truncated.
// ============================================================
