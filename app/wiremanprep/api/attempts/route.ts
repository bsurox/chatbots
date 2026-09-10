// FILE: app/wiremanprep/api/attempts/route.ts
import "server-only";
import { auth } from "@/app/(auth)/auth";
import { guestRegex } from "@/lib/constants";
import {
  finishForemanAttempt,
  recordForemanAnswer,
  startForemanAttempt,
} from "@/lib/db/foreman";
import { getWjQuestion } from "@/lib/wiremanprep/jquestions";
import { getWmQuestion } from "@/lib/wiremanprep/questions";
import { getWrQuestion } from "@/lib/wiremanprep/rquestions";

// WiremanPrep round recording (v2 - ALL THREE BANKS: wm-, wj-
// and wr- ids each re-grade against their own bank, and every
// stored domain wears its family prefix ("wm-gc", "wj-wp",
// "wr-gb", ...), so Master, Journeyman and Residential readiness
// stats stay fully separate from each other AND from GC/B&L. The
// round's family is derived server-side from the graded ids -
// the client cannot mislabel a round.)
// (v1) - the electrical sibling of the
// ForemanPrep attempts route, riding the SAME database tables
// (foreman_attempts / foreman_answers, zero SQL changes). Records
// a finished practice round or exam for signed-in, non-guest
// users. The client sends only what was picked; correctness is
// re-graded HERE against the bank, so readiness data can never be
// polluted by a buggy or dishonest client. Anonymous visitors get
// {saved: false} and lose nothing - practice stays public,
// progress-saving is the account perk.
type RawAnswer = { questionId?: unknown; picked?: unknown };

function resolveWmFamily(id: string) {
  if (id.startsWith("wm-")) return { prefix: "wm", q: getWmQuestion(id) };
  if (id.startsWith("wj-")) return { prefix: "wj", q: getWjQuestion(id) };
  if (id.startsWith("wr-")) return { prefix: "wr", q: getWrQuestion(id) };
  return null;
}

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
      if (seen.has(a.questionId)) continue;
      const fam = resolveWmFamily(a.questionId);
      if (!fam || !fam.q) continue;
      const q = fam.q;
      const picked = Math.trunc(a.picked);
      if (picked < 0 || picked >= q.choices.length) continue;
      seen.add(a.questionId);
      verified.push({
        questionId: q.id,
        domain: fam.prefix + "-" + q.domain,
        picked,
        isCorrect: picked === q.answer,
      });
    }
    if (verified.length === 0) {
      return Response.json({ error: "Bad round." }, { status: 400 });
    }

    // The round's family comes from what actually graded, never
    // from anything the client claims.
    const roundPrefix = verified[0].domain.slice(0, 2);
    const domain = rawDomain ? roundPrefix + "-" + rawDomain : null;

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
// END OF FILE - app/wiremanprep/api/attempts/route.ts (v2 -
// wm-/wj-/wr- ids each grade against their own bank; family-
// prefixed stat domains keep all three products separate)
// If you can see this comment, the paste was not truncated.
// ============================================================
