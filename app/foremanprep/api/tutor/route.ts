// FILE: app/foremanprep/api/tutor/route.ts
import "server-only";
import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { auth } from "@/app/(auth)/auth";
import { guestRegex } from "@/lib/constants";
import { hasBlAccess, hasForemanAccess } from "@/lib/db/foreman";
import { getBlQuestion } from "@/lib/foremanprep/blquestions";
import { getQuestion } from "@/lib/foremanprep/questions";

// ForemanPrep tutor v5 - two fixes in one (v4 never landed: its
// chip went into the WiremanPrep folder during the same-name
// scramble, so this file jumps v3 -> v5):
// 1. THE TUTOR SEES YOUR PICK (both rooms): the GC practice page
// and the B&L room now send which choice the student selected,
// and the system prompt tells the model "the student answered B,
// which is wrong" before it reads their message - so a bare "why"
// gets a real answer instead of "which option do you mean?".
// picked is optional and backward compatible: -1 means the timer
// ran out, absent means not answered yet.
// 2. PLAIN SPEECH: markdown banned in the prompt, and every reply
// scrubbed of asterisk characters server-side - same fix the live
// chat got in its v3.
// v2 notes (paywall). A question-scoped tutor: the
// client sends a question id plus the short back-and-forth so far,
// and the model answers as a plain-spoken exam coach who always
// points at the book and section. Haiku keeps the cost to fractions
// of a cent per message. Tiers: paid owners get 25 messages a day
// keyed to their account; everyone else gets 3 a day per IP -
// enough to taste the tutor, not enough to live off it.
// v3: Business & Law questions. Ids starting bl- resolve against
// the B&L bank, the coach persona switches to the Business & Law
// exam (state rules vary - it teaches the principle and flags
// state-specific numbers instead of universalizing one state's),
// and the paid tier keys on the RIGHT product: B&L owners get the
// full allowance on B&L questions even without Full Access, and
// vice versa. The 25/day pool is shared across both products -
// one tutor, one allowance.

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
    // Which question? Parsed first because the paid tier depends on
    // WHICH product the question belongs to.
    const body = await request.json();
    const qid = typeof body?.questionId === "string" ? body.questionId : "";
    const isBl = qid.startsWith("bl-");
    const q = isBl ? getBlQuestion(qid) : getQuestion(qid);
    if (!q) {
      return Response.json({ error: "Unknown question." }, { status: 400 });
    }
    const picked = typeof body?.picked === "number" ? Math.trunc(body.picked) : null;
    const pickedLine =
      picked !== null && picked >= 0 && picked < q.choices.length
        ? picked === q.answer
          ? `THE STUDENT'S ANSWER: they picked ${"ABCD"[picked]}) ${q.choices[picked]} - CORRECT. If they ask why, confirm their reasoning and reinforce where the answer lives in the reference.`
          : `THE STUDENT'S ANSWER: they picked ${"ABCD"[picked]}) ${q.choices[picked]} - WRONG. If they ask why (even just the word "why"), explain why their pick is wrong and why the correct answer is right, without asking which option they mean.`
        : picked === -1
          ? "THE STUDENT'S ANSWER: they ran out of time on this question and it auto-revealed unanswered. If they ask why, walk through why the correct answer is right."
          : "THE STUDENT'S ANSWER: not recorded - if they ask about 'my answer', ask which choice they mean.";

    // Tier check: paid owners are capped per account, everyone else
    // per IP. Guests count as free - a throwaway guest row never
    // owns a purchase. B&L questions check B&L ownership; GC
    // questions check Full Access.
    const session = await auth();
    const userId = session?.user?.id;
    const email = session?.user?.email ?? "";
    const realUser = Boolean(userId) && !guestRegex.test(email);
    const paid =
      realUser && userId
        ? isBl
          ? await hasBlAccess(userId)
          : await hasForemanAccess(userId)
        : false;

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
            error: isBl
              ? "That's the free tutor limit for today. Business & Law prep includes 25 tutor messages a day."
              : "That's the free tutor limit for today. Full Access includes 25 tutor messages a day.",
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

    const intro = isBl
      ? "You are the ForemanPrep Business & Law tutor: a plain-spoken coach helping a working contractor pass their state's Business & Law contractor exam."
      : "You are the ForemanPrep tutor: a plain-spoken coach helping a working tradesman pass the NASCLA Commercial General Building Contractor exam.";
    const speech =
      "HOW YOU WRITE - NON-NEGOTIABLE: plain conversational sentences only. NEVER use markdown or any formatting symbols: no asterisks, no bold, no italics, no bullet points, no numbered lists, no headers. When you need to list things, write them into a sentence separated by commas.";
    const rules = isBl
      ? "Rules: Explain like a good foreman would - short sentences, no jargon without unpacking it, no talking down. Anchor answers to the cited reference so the student learns WHERE it lives. IMPORTANT: state rules vary - lien deadlines, license thresholds, and retainage caps differ by state. Teach the general principle, and when a number is state-specific say so plainly instead of presenting one state's rule as universal. Stay on this question and closely related Business & Law topics. If asked about anything unrelated to contractor-exam prep, say you're only here for exam questions and steer back. Keep replies under 150 words unless walking through a calculation."
      : "Rules: Explain like a good foreman would - short sentences, no jargon without unpacking it, no talking down. Always anchor answers to the reference book and section so the student learns WHERE to find it (the exam is open book - finding it fast is the skill). Stay on this question and closely related exam topics. If asked about anything unrelated to contractor-exam prep, say you're only here for exam questions and steer back. Keep replies under 150 words unless walking through a calculation.";
    const system = [
      intro,
      "The student is looking at this practice question:",
      `QUESTION: ${q.q}`,
      `CHOICES: ${q.choices.map((c, i) => `${"ABCD"[i]}) ${c}`).join(" | ")}`,
      `CORRECT ANSWER: ${"ABCD"[q.answer]}) ${q.choices[q.answer]}`,
      `EXPLANATION: ${q.explain}`,
      `REFERENCE: ${q.cite}`,
      pickedLine,
      speech,
      rules,
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
    console.error("ForemanPrep tutor error:", err);
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}

// ============================================================
// END OF FILE - app/foremanprep/api/tutor/route.ts (v5 - the
// tutor knows the student's pick + plain speech, both rooms)
// If you can see this comment, the paste was not truncated.
// ============================================================
