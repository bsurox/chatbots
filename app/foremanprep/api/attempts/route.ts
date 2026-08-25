// FILE: app/foremanprep/api/attempts/route.ts
import "server-only";
import { auth } from "@/app/(auth)/auth";
import { guestRegex } from "@/lib/constants";
import {
  finishForemanAttempt,
  recordForemanAnswer,
  startForemanAttempt,
} from "@/lib/db/foreman";
import { getBlQuestion } from "@/lib/foremanprep/blquestions";
import { getQuestion } from "@/lib/foremanprep/questions";

// Records a finished practice round (and later, mock exams) for
// signed-in, non-guest users. The client sends only what was picked;
// correctness is re-graded HERE against the bank, so the readiness
// data can never be polluted by a buggy or dishonest client.
// Anonymous visitors get {saved: false} and lose nothing - practice
// stays public, progress-saving is the account perk.
// v2: Business & Law rounds. Question ids starting bl- resolve
// against the B&L bank, and their answer rows are stored with a
// bl- prefixed domain ("bl-li", "bl-fm", ...) so B&L accuracy
// never mixes into the GC exam's readiness stats - the GC domain
// keys stay exactly the set the practice page has always read.

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
    const domain = typeof body?.domain === "string" ? body.domain : null;
    const raw: RawAnswer[] = Array.isArray(body?.answers) ? body.answers : [];
    if (raw.length === 0 || raw.length > 130) {
      return Response.json({ error: "Bad round." }, { status: 400 });
    }

    // Re-grade server-side; silently drop anything malformed or
    // unknown, and dedupe repeat question ids (the answers table
    // keys on attempt + question).
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
      if (seen.has(a.questionId)) continue;
      const isBl = a.questionId.startsWith("bl-");
      const q = isBl ? getBlQuestion(a.questionId) : getQuestion(a.questionId);
      if (!q) continue;
      const picked = Math.trunc(a.picked);
      if (picked < 0 || picked >= q.choices.length) continue;
      seen.add(a.questionId);
      verified.push({
        questionId: q.id,
        domain: isBl ? "bl-" + q.domain : q.domain,
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
    console.error("ForemanPrep attempts error:", err);
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}

// ============================================================
// END OF FILE - app/foremanprep/api/attempts/route.ts (v2 -
// bl- ids grade against the B&L bank, stats stay separated)
// If you can see this comment, the paste was not truncated.
// ============================================================
