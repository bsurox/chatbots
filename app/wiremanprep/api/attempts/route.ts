// FILE: app/wiremanprep/api/attempts/route.ts
import "server-only";
import { auth } from "@/app/(auth)/auth";
import { guestRegex } from "@/lib/constants";
import {
  finishForemanAttempt,
  recordForemanAnswer,
  startForemanAttempt,
} from "@/lib/db/foreman";
import { getWmQuestion } from "@/lib/wiremanprep/questions";

// WiremanPrep round recording (v1) - the electrical sibling of the
// ForemanPrep attempts route, riding the SAME database tables
// (foreman_attempts / foreman_answers, zero SQL changes). Records
// a finished practice round or exam for signed-in, non-guest
// users. The client sends only what was picked; correctness is
// re-graded HERE against the bank, so readiness data can never be
// polluted by a buggy or dishonest client. Anonymous visitors get
// {saved: false} and lose nothing - practice stays public,
// progress-saving is the account perk.
// Separation doctrine (same as B&L's bl- prefix): only wm- ids
// grade here, and every stored domain wears a wm- prefix
// ("wm-gc", "wm-th", ...), so electrical accuracy never mixes
// into the GC or B&L readiness stats and theirs never mix into
// ours.

type RawAnswer = { questionId?: unknown; picked?: unknown };

export async function POST(request: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const email = session?.user?.email ?? "";
    if (!userId || guestRegex.test(email)) {
      return Response.json({ saved: false });
    }

    const body = await request.json();
    const mode = body?.mode === "exam" ? "exam" : "practice";
    const rawDomain = typeof body?.domain === "string" ? body.domain : null;
    const domain = rawDomain ? "wm-" + rawDomain : null;
    const raw: RawAnswer[] = Array.isArray(body?.answers) ? body.answers : [];
    if (raw.length === 0 || raw.length > 130) {
      return Response.json({ error: "Bad round." }, { status: 400 });
    }

    // Re-grade server-side; silently drop anything malformed,
    // unknown, or not a WiremanPrep id, and dedupe repeat question
    // ids (the answers table keys on attempt + question).
    const seen = new Set<string>();
    const verified: {
      questionId: string;
      domain: string;
      picked: number;
      isCorrect: boolean;
    }[] = [];
    for (const a of raw) {
      if (typeof a?.questionId !== "string" || typeof a?.picked !== "number") {
        continue;
      }
      if (!a.questionId.startsWith("wm-")) continue;
      if (seen.has(a.questionId)) continue;
      const q = getWmQuestion(a.questionId);
      if (!q) continue;
      const picked = Math.trunc(a.picked);
      if (picked < 0 || picked >= q.choices.length) continue;
      seen.add(a.questionId);
      verified.push({
        questionId: q.id,
        domain: "wm-" + q.domain,
        picked,
        isCorrect: picked === q.answer,
      });
    }
    if (verified.length === 0) {
      return Response.json({ error: "Bad round." }, { status: 400 });
    }

    const correct = verified.filter((v) => v.isCorrect).length;
    const attemptId = await startForemanAttempt({ userId, mode, domain });
    for (const v of verified) {
      await recordForemanAnswer({ attemptId, userId, ...v });
    }
    await finishForemanAttempt({
      attemptId,
      userId,
      total: verified.length,
      correct,
    });

    return Response.json({ saved: true, total: verified.length, correct });
  } catch (err) {
    console.error("WiremanPrep attempts error:", err);
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}

// ============================================================
// END OF FILE - app/wiremanprep/api/attempts/route.ts (v1 -
// wm- ids re-graded server-side, wm- prefixed stat domains)
// If you can see this comment, the paste was not truncated.
// ============================================================
