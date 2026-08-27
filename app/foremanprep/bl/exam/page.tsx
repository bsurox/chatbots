// FILE: app/foremanprep/bl-exam/page.tsx
"use client";
import "../practice/practice.css";
import Link from "next/link";
import { useEffect, useState } from "react";
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

// B&L STATE EXAM SIMULATOR (v1) - pick your state, sit its exam.
// Every state's format comes from blstates v2 (verified Aug 2026
// against PSI/Prov bulletins and the boards): the sim runs the
// state's real question count on the state's real clock and grades
// against the state's real pass bar. The oddballs are handled
// honestly: Louisiana runs untimed (its portal exam has no clock),
// California shows its closed-book warning and grades at a 70%
// training bar (the CSLB reports pass/fail only), Virginia's sim
// is the 50-question General part of its 3-part exam, and Arizona
// gets no sim at all (its SRE is an online course with no
// published format) - the picker says so and points at practice.
// Forms draw from the 120-question core bank, with the state's
// statute pack (TN/GA/SC so far) guaranteed into the mix when one
// exists. Exam flow: linear, no going back, answers hidden until
// the end - then the score against the state bar and a full review
// of every miss with the explanation and citation. Rounds save via
// the attempts pipe as mode "exam", domain "bl-exam-<state>".
// Paid-only: the free tier sees the picker and gets the $79 gate
// on start. Whole page wears the B&L blue. Deep-linkable:
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

type Picked = { questionId: string; picked: number };

export default function BlExamPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<"pick" | "brief" | "exam" | "done">("pick");
  const [access, setAccess] = useState<{ loggedIn: boolean; bl: boolean } | null>(null);
  const [showGate, setShowGate] = useState(false);
  const [state, setState] = useState<BlStatePack | null>(null);
  const [qs, setQs] = useState<BlQuestion[]>([]);
  const [idx, setIdx] = useState(0);
  const [sel, setSel] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Picked[]>([]);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [outOfTime, setOutOfTime] = useState(false);
  const [saved, setSaved] = useState(false);

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
        if (pack && pack.sim !== "none") {
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
      finishExam(answers);
      return;
    }
    const t = setTimeout(() => {
      setTimeLeft((s) => (s === null ? null : s - 1));
    }, 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, timeLeft]);

  function chooseState(pack: BlStatePack) {
    if (pack.sim === "none") return;
    setState(pack);
    setPhase("brief");
    setShowGate(false);
  }

  function startExam() {
    if (!state) return;
    if (!access?.bl) {
      setShowGate(true);
      return;
    }
    const form = buildStateForm(state);
    setQs(form);
    setIdx(0);
    setSel(null);
    setAnswers([]);
    setSaved(false);
    setOutOfTime(false);
    setTimeLeft(state.sim === "timed" && state.minutes ? state.minutes * 60 : null);
    setPhase("exam");
  }

  function finishExam(finalAnswers: Picked[]) {
    setPhase("done");
    setTimeLeft(null);
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

  function next() {
    if (sel === null || qs.length === 0) return;
    const nextAnswers = [...answers, { questionId: qs[idx].id, picked: sel }];
    setAnswers(nextAnswers);
    setSel(null);
    if (idx + 1 >= qs.length) {
      finishExam(nextAnswers);
      return;
    }
    setIdx(idx + 1);
  }

  function backToPicker() {
    setPhase("pick");
    setState(null);
    setQs([]);
    setTimeLeft(null);
    setShowGate(false);
  }

  // ---- PICKER ----
  if (phase === "pick") {
    return (
      <div className="fq-wrap fp-blzone">
        <div className="fq-head">
          <button
            className="fq-back"
            onClick={() => router.push("/foremanprep/bl")}
            type="button"
          >
            <span className="fp-wordmark">
              Foreman<span>Prep</span>
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
          {BL_STATE_PACKS.map((p) =>
            p.sim === "none" ? (
              <Link className="fq-sub" href="/foremanprep/bl" key={p.key}>
                <span className="fq-sn">{p.name}</span>
                <span className="fq-sw">{p.examLine} - no 1:1 sim, drill practice instead</span>
              </Link>
            ) : (
              <button
                className="fq-sub"
                key={p.key}
                onClick={() => chooseState(p)}
                type="button"
              >
                <span className="fq-sn">{p.name}</span>
                <span className="fq-sw">{p.examLine}</span>
              </button>
            )
          )}
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
            How the sim works: one pass, no going back - answers and
            explanations wait until the end, exactly like test day.
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
      </div>
    );
  }

  // ---- DONE ----
  if (phase === "done" && state) {
    const total = qs.length;
    const key = new Map(qs.map((q) => [q.id, q]));
    const correct = answers.filter((a) => key.get(a.questionId)?.answer === a.picked).length;
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
    const bar = state.passPct ?? 70;
    const passed = pct >= bar;
    const answeredIds = new Set(answers.map((a) => a.questionId));
    const misses = qs.filter((q) => {
      const a = answers.find((x) => x.questionId === q.id);
      return !a || a.picked !== q.answer;
    });
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
                  {!answeredIds.has(q.id) ? " (you ran out of time here)" : ""}
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

  // ---- EXAM ----
  if (phase === "exam" && qs.length > 0) {
    const question = qs[idx];
    return (
      <div className="fq-wrap fp-blzone">
        <div className="fq-head">
          <span className="fq-prog">
            {timeLeft !== null ? (
              <span className={timeLeft <= 300 ? "fq-clock low" : "fq-clock"}>
                {fmtClock(timeLeft)}
              </span>
            ) : null}
            Question {idx + 1} / {qs.length}
          </span>
        </div>
        <span className="fq-chip">{state?.name} - {state?.blName}</span>
        <p className="fq-q">{question.q}</p>
        <div className="fq-choices">
          {question.choices.map((c, i) => (
            <button
              className={sel === i ? "fq-choice on-right" : "fq-choice"}
              key={c}
              onClick={() => setSel(i)}
              type="button"
            >
              <span className="fq-letter">{LETTERS[i]}</span>
              <span className="fq-ct">{c}</span>
            </button>
          ))}
        </div>
        <button
          className="fq-next"
          disabled={sel === null}
          onClick={next}
          style={sel === null ? { opacity: 0.5, cursor: "default" } : undefined}
          type="button"
        >
          {idx + 1 >= qs.length ? "Finish and grade" : "Lock it in - next"}
        </button>
        <p className="fq-hint" style={{ marginTop: "10px" }}>
          One pass, no going back. Answers and explanations come at the end.
        </p>
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
// END OF FILE - app/foremanprep/bl-exam/page.tsx (v1 - pick
// your state, sit its B&L exam 1:1)
// If you can see this comment, the paste was not truncated.
// ============================================================
