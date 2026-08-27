// FILE: app/foremanprep/bl-exam/page.tsx
"use client";
import "../practice/practice.css";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BL_QUESTIONS,
  type BlQuestion,
} from "@/lib/foremanprep/blquestions";
import {
  BL_STATE_PACKS,
  getBlStatePack,
  type BlStatePack,
} from "@/lib/foremanprep/blstates";

// B&L STATE EXAM SIMULATOR (v4) - no state click ever leaves the
// simulator. His find: Arizona (second cell in the grid) was a
// silent Link to the practice room - tap it and you were dumped
// out of the sim, which reads as "selecting a state took me to
// the practice page". Arizona has no exam to mirror (its SRE is
// an online course with no published format), but now it opens
// a briefing INSIDE the simulator like every other state: the
// explanation, a "Drill the material instead" door to practice,
// and Pick a different state. The deep link ?state=az lands on
// the same briefing. Real states are unchanged: click -> their
// briefing -> Start (the clock starts on Start, on purpose -
// never on the state click).
// v3 notes: review-legend wording follows
// css v17: the flagged marker on the grid is now the same \2691
// flag glyph as the GC sim (was a dot), so the legend says Flag.
// v2 notes: real testing-center flow.
// v1's one-pass rule is gone: real PSI/Prov computer exams let you
// skip, change answers, flag questions, and review the whole form
// before you submit - so the sim does too (his call).
// 1. FREE NAVIGATION - Previous / Next move anywhere; tapping a
//    choice records it (tap another to change it); Next without
//    answering just skips. Nothing grades until submit.
// 2. FLAG FOR REVIEW - a pill on every question, blue when set.
// 3. REVIEW SCREEN - a numbered grid of the whole form: filled =
//    answered, dot = flagged, tap a number to jump back. Submit
//    lives here and on the last question's Next; submitting with
//    unanswered questions asks first (they count wrong).
// 4. LEAVE DOOR - a back pill during the exam opens the same kind
//    of confirm the GC sim uses: leaving resets the clock and
//    every answer. The picker's own back pill now leads to
//    /bl-prep, the B&L landing (his back rule).
// The clock is unchanged: one full-form countdown, auto-submits
// at zero with whatever is answered. Grading, the state pass bar,
// the attempts pipe (mode "exam", domain "bl-exam-<state>"), the
// deep link, and the $79 gate all carry over from v1.
// v1 notes: pick your state, sit its exam 1:1. Every state's
// format comes from blstates v2 (verified Aug 2026 against
// PSI/Prov bulletins and the boards): the sim runs the state's
// real question count on the state's real clock and grades
// against the state's real pass bar. The oddballs are handled
// honestly: Louisiana runs untimed (its portal exam has no clock),
// California shows its closed-book warning and grades at a 70%
// training bar (the CSLB reports pass/fail only), Virginia's sim
// is the 50-question General part of its 3-part exam, and Arizona
// gets no sim at all (its SRE is an online course with no
// published format) - the picker says so and points at practice.
// Forms draw from the 120-question core bank, with the state's
// statute pack (TN/GA/SC so far) guaranteed into the mix when one
// exists. Paid-only: the free tier sees the picker and gets the
// $79 gate on start. Whole page wears the B&L blue. Deep-linkable:
// /bl-exam?state=tn preselects a state. Clean URL via proxy v15.

const LETTERS = ["A", "B", "C", "D", "E", "F"];

function fmtClock(total: number): string {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const sec = total % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(sec).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${m}:${ss}`;
}

function shuffleQs(items: BlQuestion[]): BlQuestion[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// The state's real count, from the core bank plus its statute pack
// (pack questions guaranteed in, never duplicated, capped at what
// the bank holds).
function buildStateForm(pack: BlStatePack): BlQuestion[] {
  const target = Math.min(pack.simQuestions ?? 50, BL_QUESTIONS.length + pack.questions.length);
  const fromCore = shuffleQs(BL_QUESTIONS).slice(0, Math.max(target - pack.questions.length, 0));
  return shuffleQs([...pack.questions, ...fromCore]).slice(0, target);
}

export default function BlExamPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<"pick" | "brief" | "exam" | "done">("pick");
  const [view, setView] = useState<"q" | "review">("q");
  const [access, setAccess] = useState<{ loggedIn: boolean; bl: boolean } | null>(null);
  const [showGate, setShowGate] = useState(false);
  const [state, setState] = useState<BlStatePack | null>(null);
  const [qs, setQs] = useState<BlQuestion[]>([]);
  const [idx, setIdx] = useState(0);
  const [answerMap, setAnswerMap] = useState<Record<string, number>>({});
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [outOfTime, setOutOfTime] = useState(false);
  const [saved, setSaved] = useState(false);

  // Ref mirrors of the answer map and the submitted latch: the
  // timer's auto-submit fires from a timeout closure, and the ref
  // guarantees it grades the very latest answers exactly once.
  const answersRef = useRef<Record<string, number>>({});
  const submittedRef = useRef(false);

  useEffect(() => {
    fetch("/foremanprep/api/access")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setAccess({ loggedIn: Boolean(data.loggedIn), bl: Boolean(data.bl) });
        else setAccess({ loggedIn: false, bl: false });
      })
      .catch(() => setAccess({ loggedIn: false, bl: false }));
  }, []);

  // Deep link: /bl-exam?state=tn opens that state's briefing.
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const key = params.get("state");
      if (key) {
        const pack = getBlStatePack(key);
        if (pack) {
          setState(pack);
          setPhase("brief");
        }
      }
    } catch {
      // A bad URL never breaks the picker.
    }
  }, []);

  // The exam clock. Ticks only during a timed exam; at zero the
  // form submits itself with whatever is answered - like the real
  // thing, unanswered means wrong.
  useEffect(() => {
    if (phase !== "exam" || timeLeft === null) return;
    if (timeLeft <= 0) {
      setOutOfTime(true);
      finishExam();
      return;
    }
    const t = setTimeout(() => {
      setTimeLeft((s) => (s === null ? null : s - 1));
    }, 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, timeLeft]);

  function chooseState(pack: BlStatePack) {
    setState(pack);
    setPhase("brief");
    setShowGate(false);
  }

  function startExam() {
    if (!state || state.sim === "none") return;
    if (!access?.bl) {
      setShowGate(true);
      return;
    }
    const form = buildStateForm(state);
    setQs(form);
    setIdx(0);
    setView("q");
    setAnswerMap({});
    setFlags({});
    setConfirmLeave(false);
    setConfirmSubmit(false);
    setSaved(false);
    setOutOfTime(false);
    answersRef.current = {};
    submittedRef.current = false;
    setTimeLeft(state.sim === "timed" && state.minutes ? state.minutes * 60 : null);
    setPhase("exam");
  }

  function finishExam() {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setConfirmSubmit(false);
    setConfirmLeave(false);
    setPhase("done");
    setTimeLeft(null);
    const finalAnswers = qs
      .filter((q) => answersRef.current[q.id] !== undefined)
      .map((q) => ({ questionId: q.id, picked: answersRef.current[q.id] }));
    if (state && finalAnswers.length > 0) {
      fetch("/foremanprep/api/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "exam",
          domain: "bl-exam-" + state.key,
          answers: finalAnswers,
        }),
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.saved) setSaved(true);
        })
        .catch(() => {});
    }
  }

  function pickChoice(i: number) {
    if (qs.length === 0) return;
    const q = qs[idx];
    answersRef.current = { ...answersRef.current, [q.id]: i };
    setAnswerMap(answersRef.current);
  }

  function toggleFlag() {
    if (qs.length === 0) return;
    const q = qs[idx];
    setFlags((f) => ({ ...f, [q.id]: !f[q.id] }));
  }

  function prevQ() {
    if (idx > 0) setIdx(idx - 1);
  }

  function nextQ() {
    if (idx + 1 >= qs.length) {
      setView("review");
      return;
    }
    setIdx(idx + 1);
  }

  function jumpTo(i: number) {
    setIdx(i);
    setView("q");
  }

  function requestSubmit() {
    const unanswered = qs.filter((q) => answerMap[q.id] === undefined).length;
    if (unanswered > 0) {
      setConfirmSubmit(true);
      return;
    }
    finishExam();
  }

  function backToPicker() {
    setPhase("pick");
    setView("q");
    setState(null);
    setQs([]);
    setIdx(0);
    setAnswerMap({});
    setFlags({});
    setConfirmLeave(false);
    setConfirmSubmit(false);
    setTimeLeft(null);
    setShowGate(false);
    answersRef.current = {};
    submittedRef.current = false;
  }

  function leaveExam() {
    setConfirmLeave(false);
    backToPicker();
  }

  // ---- PICKER ----
  if (phase === "pick") {
    return (
      <div className="fq-wrap fp-blzone">
        <div className="fq-head">
          <button
            className="fq-back"
            onClick={() => router.push("/foremanprep/bl-prep")}
            type="button"
          >
            <span className="fp-wordmark">
              Business &amp; <span>Law</span>
            </span>
          </button>
        </div>
        <p className="fq-title">State Exam Simulator</p>
        <p className="fq-hint">
          Pick your state and sit its Business &amp; Law exam 1:1 - the
          real question count, the real clock, the real pass bar.{" "}
          <span className="fq-hint-hl">
            Every format verified Aug 2026 against the testing bulletins.
          </span>
        </p>
        <div className="fq-pick">
          {BL_STATE_PACKS.map((p) => (
            <button
              className="fq-sub"
              key={p.key}
              onClick={() => chooseState(p)}
              type="button"
            >
              <span className="fq-sn">{p.name}</span>
              <span className="fq-sw">
                {p.sim === "none" ? p.examLine + " - no exam to simulate" : p.examLine}
              </span>
            </button>
          ))}
        </div>
        <p className="fq-hint" style={{ marginTop: "16px" }}>
          North Carolina has no separate Business &amp; Law exam - the
          NASCLA trade exam and license application carry it. Not seeing
          your state? Formats vary; check your board's bulletin.
        </p>
      </div>
    );
  }

  // ---- BRIEFING ----
  if (phase === "brief" && state) {
    return (
      <div className="fq-wrap fp-blzone">
        <div className="fq-head">
          <button className="fq-back" onClick={backToPicker} type="button">
            States
          </button>
        </div>
        <p className="fq-title">{state.name}</p>
        <span className="fq-chip">{state.blName}</span>
        {state.sim === "none" ? (
          <>
            <p className="fq-hint" style={{ marginTop: "10px" }}>{state.note}</p>
            <p className="fq-hint">
              <span className="fq-hint-hl">
                No exam to simulate: {state.name}'s requirement is
                course-based, so there is no published question count,
                clock, or pass bar to mirror 1:1.
              </span>{" "}
              Reference: {state.reference}. {state.verified}.
            </p>
            <Link
              className="fq-all"
              href="/foremanprep/bl"
              style={{ display: "block", textDecoration: "none", boxSizing: "border-box", width: "100%" }}
            >
              <span className="fq-sn">Drill the material instead</span>
              <span className="fq-sw">
                The practice room covers the same Business &amp; Law core
                the {state.name} course teaches.
              </span>
            </Link>
            <button className="fq-home" onClick={backToPicker} type="button">
              Pick a different state
            </button>
          </>
        ) : (
        <>
        <p className="fq-hint" style={{ marginTop: "10px" }}>
          {state.simQuestions ?? "?"} questions
          {state.sim === "timed" && state.minutes
            ? ` - ${state.minutes} minutes on one clock`
            : " - untimed, like the real thing"}
          {state.passPct
            ? ` - ${state.passPct}% to pass`
            : " - graded at a 70% training bar"}
          {" - "}
          {state.book === "closed"
            ? "CLOSED book on the real exam"
            : state.book === "open"
              ? "open book on the real exam"
              : "course-based"}
          {" - administered by "}
          {state.admin}.
        </p>
        <p className="fq-hint">{state.note}</p>
        <p className="fq-hint">
          <span className="fq-hint-hl">
            How the sim works: move freely - skip questions, change
            answers, flag any for review, and check the review screen
            before you submit. Answers and explanations wait until the
            end, exactly like test day.
          </span>{" "}
          Reference: {state.reference}. {state.verified}.
        </p>
        {showGate ? (
          <div className="fp-gate">
            <p className="fp-gateh">The state exam simulator comes with Business &amp; Law prep.</p>
            <p className="fp-gated">
              Sit any state's exam 1:1 - real count, real clock, real
              pass bar - plus all 120 practice questions, the AI tutor,
              and the state packs. One payment, no subscription.
            </p>
            <Link className="fp-gatebtn" href="/foremanprep/buy?product=bl">
              Get Business &amp; Law prep - $79
            </Link>
          </div>
        ) : null}
        <button className="fq-all" onClick={startExam} type="button">
          <span className="fq-sn">Start the {state.name} exam</span>
          <span className="fq-sw">
            {state.sim === "timed" && state.minutes
              ? `The clock starts immediately - ${fmtClock(state.minutes * 60)} on it`
              : "Untimed - take what you need"}
          </span>
        </button>
        <button className="fq-home" onClick={backToPicker} type="button">
          Pick a different state
        </button>
        </>
        )}
      </div>
    );
  }

  // ---- DONE ----
  if (phase === "done" && state) {
    const total = qs.length;
    const correct = qs.filter((q) => answerMap[q.id] === q.answer).length;
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
    const bar = state.passPct ?? 70;
    const passed = pct >= bar;
    const misses = qs.filter((q) => answerMap[q.id] !== q.answer);
    return (
      <div className="fq-wrap fp-blzone">
        <div className="fq-done">
          <p className="fq-score">
            {correct}
            <span> / {total}</span>
          </p>
          <p className="fq-msg">
            {pct}% - {state.name}'s bar is {bar}%
            {state.passPct === null ? " (training bar - the CSLB reports pass/fail only)" : ""}.{" "}
            {outOfTime ? <b>Time ran out - unanswered counts wrong, same as test day. </b> : null}
            {passed ? (
              <b>You would have passed today.</b>
            ) : (
              <b>Not yet - every miss below shows you exactly where the points went.</b>
            )}
          </p>
          {saved ? <p className="fq-saved">Saved to your account.</p> : null}
          <div className="fq-list">
            {misses.map((q) => (
              <div key={q.id} style={{ textAlign: "left", marginBottom: "14px" }}>
                <p className="fq-rq" style={{ fontWeight: 700 }}>{q.q}</p>
                <p className="fq-rq">
                  Correct: {LETTERS[q.answer]}) {q.choices[q.answer]}
                  {answerMap[q.id] === undefined ? " (left unanswered)" : ""}
                </p>
                <p className="fq-explain">{q.explain}</p>
                <p className="fq-cite">Where it lives: {q.cite}</p>
              </div>
            ))}
            {misses.length === 0 ? (
              <p className="fq-rq">A clean sheet - nothing missed.</p>
            ) : null}
          </div>
          <button className="fq-again" onClick={startExam} type="button">
            Sit it again - fresh draw
          </button>
          <button className="fq-home" onClick={backToPicker} type="button">
            Pick another state
          </button>
        </div>
      </div>
    );
  }

  // ---- EXAM (question view + review view + confirm modals) ----
  if (phase === "exam" && qs.length > 0) {
    const question = qs[idx];
    const answeredCount = qs.filter((q) => answerMap[q.id] !== undefined).length;
    const flaggedCount = qs.filter((q) => flags[q.id]).length;
    const unanswered = qs.length - answeredCount;
    return (
      <div className="fq-wrap fp-blzone">
        <div className="fq-head">
          <button
            className="fq-back"
            onClick={() => setConfirmLeave(true)}
            type="button"
          >
            Leave
          </button>
          <span className="fq-prog">
            {timeLeft !== null ? (
              <span className={timeLeft <= 300 ? "fq-clock low" : "fq-clock"}>
                {fmtClock(timeLeft)}
              </span>
            ) : null}
            {view === "review" ? "Review" : `Question ${idx + 1} / ${qs.length}`}
          </span>
        </div>

        {view === "q" ? (
          <>
            <div className="fx-row">
              <span className="fq-chip">{state?.name} - {state?.blName}</span>
              <button
                className={flags[question.id] ? "fx-flag on" : "fx-flag"}
                onClick={toggleFlag}
                type="button"
              >
                {flags[question.id] ? "Flagged" : "Flag for review"}
              </button>
            </div>
            <p className="fq-q">{question.q}</p>
            <div className="fq-choices">
              {question.choices.map((c, i) => (
                <button
                  className={answerMap[question.id] === i ? "fq-choice sel" : "fq-choice"}
                  key={c}
                  onClick={() => pickChoice(i)}
                  type="button"
                >
                  <span className="fq-letter">{LETTERS[i]}</span>
                  <span className="fq-ct">{c}</span>
                </button>
              ))}
            </div>
            <button className="fq-next" onClick={nextQ} type="button">
              {idx + 1 >= qs.length ? "Review and submit" : "Next question"}
            </button>
            <div className="fx-navrow">
              <button
                className="fx-navbtn"
                disabled={idx === 0}
                onClick={prevQ}
                type="button"
              >
                Previous
              </button>
              <button
                className="fx-navbtn"
                onClick={() => setView("review")}
                type="button"
              >
                Review all questions
              </button>
            </div>
            <p className="fq-hint" style={{ marginTop: "10px" }}>
              Move freely - skip, change answers, flag for review. Answers
              and explanations come after you submit.
            </p>
          </>
        ) : (
          <>
            <p className="fq-title">Review</p>
            <p className="fq-hint">
              {answeredCount} of {qs.length} answered
              {flaggedCount > 0 ? ` - ${flaggedCount} flagged` : ""}.
              {unanswered > 0
                ? " Unanswered questions count wrong, same as test day."
                : " Everything answered."}
            </p>
            <p className="fx-legend">
              Filled = answered. Flag = flagged. Tap a number to jump back.
            </p>
            <div className="fx-grid">
              {qs.map((q, i) => (
                <button
                  className={
                    "fx-cell" +
                    (answerMap[q.id] !== undefined ? " done" : "") +
                    (flags[q.id] ? " flag" : "")
                  }
                  key={q.id}
                  onClick={() => jumpTo(i)}
                  type="button"
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button className="fq-next" onClick={requestSubmit} type="button">
              Submit and grade
            </button>
            <div className="fx-navrow">
              <button
                className="fx-navbtn"
                onClick={() => setView("q")}
                type="button"
              >
                Back to the exam
              </button>
            </div>
          </>
        )}

        {confirmLeave ? (
          <div className="fx-overlay">
            <div className="fx-modal">
              <p className="fx-mh">Leave the exam?</p>
              <p className="fx-md">
                This attempt ends here - the clock and every answer reset,
                and nothing gets saved.
              </p>
              <button className="fx-keep" onClick={() => setConfirmLeave(false)} type="button">
                Keep taking the exam
              </button>
              <button className="fx-leave" onClick={leaveExam} type="button">
                Leave and reset
              </button>
            </div>
          </div>
        ) : null}

        {confirmSubmit ? (
          <div className="fx-overlay">
            <div className="fx-modal">
              <p className="fx-mh">
                {unanswered === 1
                  ? "Submit with 1 unanswered question?"
                  : `Submit with ${unanswered} unanswered questions?`}
              </p>
              <p className="fx-md">
                Unanswered counts wrong, same as test day. You still have
                time on the clock.
              </p>
              <button className="fx-keep" onClick={() => setConfirmSubmit(false)} type="button">
                Keep working
              </button>
              <button className="fx-leave" onClick={finishExam} type="button">
                Submit anyway
              </button>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="fq-wrap fp-blzone">
      <p className="fq-load">Loading...</p>
    </div>
  );
}

// ============================================================
// END OF FILE - app/foremanprep/bl-exam/page.tsx (v4 - every
// state click stays inside the simulator; Arizona explains)
// If you can see this comment, the paste was not truncated.
// ============================================================
