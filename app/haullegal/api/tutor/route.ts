// FILE: app/haullegal/api/tutor/route.ts
import "server-only";
import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { auth } from "@/app/(auth)/auth";
import { guestRegex } from "@/lib/constants";
import { hasHaulWalkthrough } from "@/lib/db/haul";
import { HL_STEPS } from "@/lib/haullegal/steps";

// HaulLegal step tutor (v2 - his call: walkthrough owners get 50
// tutor messages a day, about two per step; visitors stay at 3 a
// day on the free steps.)
// v1 notes - the trucking sibling of the prep tutors. Step-scoped: the client sends a step id from
// lib/haullegal/steps.ts plus the short back-and-forth so far, and
// the model answers as a plain-spoken compliance coach who knows
// ONLY that step - its summary, where the click happens, the fee,
// the wait, the FMCSA-flagged mistakes and the rule it comes from -
// and always points back at the official page. Haiku keeps the
// cost to fractions of a cent per message.
// Tiers: walkthrough owners get 50 messages a day keyed to their
// account; everyone else gets 3 a day per IP, and only on the four
// free steps - a locked step answers 403 so the tutor can never
// leak the paid content. The body may carry lang "es" - the model
// then answers in Spanish.
// KNOWN LIMITATION carried from the prep tutors: the daily caps
// live in instance memory, so a redeploy or a fresh serverless
// instance resets them. Fine at launch scale.

const MODEL_ID = "claude-haiku-4-5";
const MAX_TURNS = 12;
const MAX_CHARS_PER_MSG = 1200;
const MAX_OUTPUT_TOKENS = 400;
const PAID_DAILY_CAP = 50;
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
    const stepId = typeof body?.stepId === "string" ? body.stepId : "";
    const step = HL_STEPS.find((s) => s.id === stepId);
    if (!step) {
      return Response.json({ error: "Unknown step." }, { status: 400 });
    }
    const lang = body?.lang === "es" ? "es" : "en";

    const session = await auth();
    const userId = session?.user?.id;
    const email = session?.user?.email ?? "";
    const realUser = Boolean(userId) && !guestRegex.test(email);
    const paid = realUser && userId ? await hasHaulWalkthrough(userId) : false;

    if (!paid && !step.free) {
      return Response.json({ error: "This step is part of the paid walkthrough." }, { status: 403 });
    }

    if (paid && userId) {
      if (isCapped(`u:${userId}`, PAID_DAILY_CAP)) {
        return Response.json({ error: "You've hit today's tutor limit. Come back tomorrow." }, { status: 429 });
      }
    } else {
      const ip = (request.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
      if (isCapped(`ip:${ip}`, FREE_DAILY_CAP)) {
        return Response.json(
          { error: "That's the free tutor limit for today. The walkthrough includes 50 tutor messages a day.", free: true },
          { status: 429 }
        );
      }
    }

    const raw: Turn[] = Array.isArray(body?.messages) ? body.messages : [];
    const turns = raw
      .filter((m) => (m?.role === "user" || m?.role === "assistant") && typeof m?.content === "string" && m.content.trim().length > 0)
      .slice(-MAX_TURNS)
      .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS_PER_MSG) }));
    if (turns.length === 0 || turns[turns.length - 1].role !== "user") {
      return Response.json({ error: "Ask a question first." }, { status: 400 });
    }

    const number = HL_STEPS.indexOf(step) + 1;
    const needs = step.needs.map((id) => HL_STEPS.find((s) => s.id === id)?.title ?? id);
    const system = [
      "You are the HaulLegal step tutor: a plain-spoken compliance coach helping a brand-new owner-operator get their trucking company legal in the United States. The owner is looking at one step of the HaulLegal walkthrough and may ask anything about it.",
      `STEP ${number} OF ${HL_STEPS.length}: ${step.title}`,
      `WHAT IT IS: ${step.summary}`,
      `WHERE THE CLICK HAPPENS: ${step.where}`,
      `OFFICIAL PAGE: ${step.url}`,
      `GOVERNMENT FEE: ${step.fee}`,
      `TYPICAL TIME: ${step.time}`,
      needs.length > 0 ? `DO FIRST (earlier steps this one depends on): ${needs.join("; ")}` : "DO FIRST: nothing - this step has no prerequisites.",
      `WATCH OUT (mistakes that get flagged): ${step.gotchas.join(" | ")}`,
      `THE RULE IT COMES FROM: ${step.citeLabel} - ${step.cite}`,
      "HOW YOU WRITE - NON-NEGOTIABLE: plain conversational sentences only. NEVER use markdown or any formatting symbols: no asterisks, no bold, no italics, no bullet points, no numbered lists, no headers. When you need to list things, write them into a sentence separated by commas.",
      "RULES: Explain like a dispatcher who has done this a hundred times - short sentences, unpack every acronym the first time, no talking down. Anchor answers to the official page and the rule above so the owner learns where the truth lives; tell them to confirm on the agency page because rules and fees change. Stay on this step and the steps it depends on. You are not the government and not a lawyer: explain what the rule says, never give legal, tax or insurance advice, and never offer to file anything - the owner does every filing in their own accounts. Never invent fees, dates, wait times or state rules; if you do not know, say so and point at the official page or support@askevo.ai. If asked about anything unrelated to getting a trucking company legal, say you are only here for this walkthrough and steer back. Keep replies under 150 words.",
      lang === "es" ? "LANGUAGE: the owner is using the site in Spanish. Reply in natural, neutral Latin American Spanish (tu register). Keep program names drivers know in English in English: USDOT, IRP, IFTA, UCR, BOC-3, ELD, Motus, Clearinghouse." : "",
    ].join("\n");

    const result = await generateText({
      model: anthropic(MODEL_ID),
      system,
      messages: turns,
      maxOutputTokens: MAX_OUTPUT_TOKENS,
    });

    const reply = (result.text ?? "").replace(/\*/g, "").trim();
    if (!reply) {
      return Response.json({ error: "The tutor came up empty - try again." }, { status: 502 });
    }
    return Response.json({ reply });
  } catch (err) {
    console.error("HaulLegal tutor error:", err);
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}

// ============================================================
// END OF FILE - app/haullegal/api/tutor/route.ts (v2 - step-scoped
// tutor, paid 50/day per account, free 3/day on free steps, EN/ES)
// If you can see this comment, the paste was not truncated.
// ============================================================
