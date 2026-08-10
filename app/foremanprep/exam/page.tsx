// FILE: app/foremanprep/exam/page.tsx
"use client";
import "./exam.css";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { buildExamForm, type ForemanQuestion } from "@/lib/foremanprep/questions";

// Exam simulator v5 (paywall): the full simulator is a Full Access
// feature - the intro checks /api/access and unpaid visitors get a
// locked card pointing at the storefront instead of a Start button.
// v4 notes: the back pill on a live
// test now opens a confirm modal, and confirming ends the attempt
// - answers, flags, and clock all reset - so the timed test can't
// be paused by leaving. On the intro screen the back pill is
// still instant. v1 note: Answer, flag, and jump around all the
// questions, then submit and grade against the real 81/115 (70%)
// bar - no answer is revealed until you turn it in, like PSI test
// day. The clock runs at the real exam's pace (5.5 hours across
// 115 questions) so a partial bank still feels authentic today and
// becomes the true 115-question, 5.5-hour exam as batches land.
// Finished exams post to the same attempts API as practice.

const REAL_SECONDS = 330 * 60;
const REAL_QUESTIONS = 115;
const PER_Q = Math.round(REAL_SECONDS / REAL_QUESTIONS);
const PASS_PCT = 70;

const LETTERS = ["A", "B", "C", "D", "E", "F"];

type Phase = "intro" | "run" | "review" | "graded";

function clock(sec: number): string {
  const s = Math.max(0, sec);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  const mm = String(m).padStart(2, "0");
  const sss = String(ss).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${sss}` : `${mm}:${sss}`;
}

export default function ExamPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("intro");
  const [qs, setQs] = useState<ForemanQuestion[]>([]);
  const [idx, setIdx] = useState(0);
  const [picks, setPicks] = useState<Record<string, number>>({});
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [remaining, setRemaining] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [confirmExit, setConfirmExit] = useState(false);
  const [access, setAccess] = useState<{ loggedIn: boolean; paid: boolean } | null>(null);
  const tick = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetch("/foremanprep/api/access")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setAccess({ loggedIn: Boolean(data.loggedIn), paid: Boolean(data.paid) });
        else setAccess({ loggedIn: false, paid: false });
      })
      .catch(() => setAccess({ loggedIn: false, paid: false }));
  }, []);

  const grade = useCallback(
    (form: ForemanQuestion[], chosen: Record<string, number>) => {
      if (tick.current) clearInterval(tick.current);
      let correct = 0;
      for (const q of form) {
        if (chosen[q.id] === q.answer) correct += 1;
      }
      setScore({ correct, total: form.length });
      setPhase("graded");
      fetch("/foremanprep/api/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "exam",
          domain: null,
          answers: form
            .filter((q) => chosen[q.id] !== undefined)
            .map((q) => ({ questionId: q.id, picked: chosen[q.id] })),
        }),
      }).catch(() => {});
    },
    []
  );

  useEffect(() => {
    if (phase !== "run") return;
    tick.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          if (tick.current) clearInterval(tick.current);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => {
      if (tick.current) clearInterval(tick.current);
    };
  }, [phase]);

  // When the clock hits zero mid-exam, auto-submit with what we have.
  useEffect(() => {
    if (phase === "run" && remaining === 0 && qs.length > 0) {
      grade(qs, picks);
    }
  }, [phase, remaining, qs, picks, grade]);

  function begin() {
    const form = buildExamForm();
    setQs(form);
    setIdx(0);
    setPicks({});
    setFlags({});
    setRemaining(form.length * PER_Q);
    setScore({ correct: 0, total: 0 });
    setPhase("run");
  }

  function choose(qid: string, i: number) {
    setPicks((p) => ({ ...p, [qid]: i }));
  }

  function toggleFlag(qid: string) {
    setFlags((f) => ({ ...f, [qid]: !f[qid] }));
  }

  // A live test can't be paused by leaving. Confirming exit wipes
  // the attempt - answers, flags, and clock - and returns to the
  // intro so the next visit starts a fresh, fully timed run.
  function requestBack() {
    if (phase === "run" || phase === "review") {
      setConfirmExit(true);
      return;
    }
    router.push("/foremanprep");
  }

  function confirmLeave() {
    if (tick.current) clearInterval(tick.current);
    setConfirmExit(false);
    setPhase("intro");
    setQs([]);
    setIdx(0);
    setPicks({});
    setFlags({});
    setRemaining(0);
    router.push("/foremanprep");
  }

  const exitModal = confirmExit ? (
    <div className="fe-overlay">
      <div className="fe-modal">
        <p className="fe-mtitle">Leave the exam?</p>
        <p className="fe-mtext">
          This is a timed test. If you go back to ForemanPrep now, this
          attempt ends and your answers and clock reset.
        </p>
        <div className="fe-macts">
          <button className="fe-mcancel" onClick={() => setConfirmExit(false)} type="button">
            Keep testing
          </button>
          <button className="fe-myes" onClick={confirmLeave} type="button">
            Leave and reset
          </button>
        </div>
      </div>
    </div>
  ) : null;

  if (phase === "intro") {
    return (
      <div className="fe-wrap">
        <div className="fe-top">
          <button
            className="fe-back"
            onClick={() => router.push("/foremanprep")}
            type="button"
          >
            ForemanPrep
          </button>
        </div>
        <p className="fe-title">Exam simulator</p>
        <p className="fe-lead">
          A full dress rehearsal for the real thing. Answer every question,
          flag the ones you want to revisit, and submit when you are ready.
        </p>
        <div className="fe-facts">
          <div className="fe-fact">
            <b>Pace</b>
            <span>
              The clock runs at the real exam's speed - 5.5 hours across a
              full 115 questions. Today's bank is smaller, so your clock is
              sized to match that same pace.
            </span>
          </div>
          <div className="fe-fact">
            <b>Pass</b>
            <span>70% is the real bar - 81 of 115 on exam day.</span>
          </div>
          <div className="fe-fact">
            <b>Open book</b>
            <span>
              On the real exam you may bring the approved references. Practice
              finding answers fast - that is the whole game.
            </span>
          </div>
        </div>
        {access === null ? (
          <button className="fe-start" disabled type="button">
            Checking access...
          </button>
        ) : access.paid ? (
          <button className="fe-start" onClick={begin} type="button">
            Start the exam
          </button>
        ) : (
          <div className="fp-gate">
            <p className="fp-gateh">The full exam simulator is a Full Access feature.</p>
            <p className="fp-gated">
              All 115 questions on the true 5.5-hour clock, graded against the
              real 81-to-pass bar - the closest thing to test day you can get.
              Free practice rounds stay open on the practice page.
            </p>
            <Link className="fp-gatebtn" href="/foremanprep/buy">
              Get Full Access - $99 early bird
            </Link>
          </div>
        )}
      </div>
    );
  }

  if (phase === "graded") {
    const pct = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;
    const passed = pct >= PASS_PCT;
    return (
      <div className="fe-wrap">
        <div className="fe-verdict">
          <p className={passed ? "fe-big fe-pass" : "fe-big fe-fail"}>{pct}%</p>
          <p className="fe-vscore">
            {score.correct} of {score.total} correct
          </p>
          <p className="fe-vmsg">
            {passed
              ? "That clears the 70% bar. Keep stringing these together and test day is just another rep."
              : "Short of the 70% bar this time. The review screen shows every miss - drill those subjects and run it again."}
          </p>
          <button className="fe-submit" onClick={begin} type="button">
            Take it again
          </button>
          <button
            className="fe-ghost"
            onClick={() => router.push("/foremanprep")}
            type="button"
          >
            Back to ForemanPrep
          </button>
        </div>
      </div>
    );
  }

  if (phase === "review") {
    const answered = Object.keys(picks).length;
    const blanks = qs.length - answered;
    return (
      <div className="fe-wrap">
        <div className="fe-top">
          <button className="fe-back" onClick={requestBack} type="button">
            ForemanPrep
          </button>
        </div>
        <div className="fe-bar">
          <span className={remaining < 300 ? "fe-clock low" : "fe-clock"}>{clock(remaining)}</span>
          <span className="fe-count">
            {answered} / {qs.length} answered
          </span>
        </div>
        <p className="fe-title">Review</p>
        <p className="fe-lead">
          Tap any number to jump back. A dot marks a flagged question.
        </p>
        <div className="fe-grid">
          {qs.map((q, i) => {
            const cls =
              "fe-cell" +
              (picks[q.id] !== undefined ? " answered" : "") +
              (flags[q.id] ? " flagged" : "");
            return (
              <button
                className={cls}
                key={q.id}
                onClick={() => {
                  setIdx(i);
                  setPhase("run");
                }}
                type="button"
              >
                {i + 1}
              </button>
            );
          })}
        </div>
        <div className="fe-legend">
          <span>Filled = answered</span>
          <span>Dot = flagged</span>
        </div>
        {blanks > 0 ? (
          <p className="fe-warn">
            {blanks} question{blanks === 1 ? "" : "s"} still blank. Blank
            answers count as wrong on the real exam.
          </p>
        ) : null}
        <button className="fe-submit" onClick={() => grade(qs, picks)} type="button">
          Submit and grade
        </button>
        <button
          className="fe-ghost"
          onClick={() => setPhase("run")}
          type="button"
        >
          Keep working
        </button>
        {exitModal}
      </div>
    );
  }

  // phase === "run"
  const q = qs[idx];
  return (
    <div className="fe-wrap">
      <div className="fe-top">
        <button className="fe-back" onClick={requestBack} type="button">
          ForemanPrep
        </button>
      </div>
      <div className="fe-bar">
        <span className={remaining < 300 ? "fe-clock low" : "fe-clock"}>{clock(remaining)}</span>
        <button
          className={flags[q.id] ? "fe-flag on" : "fe-flag"}
          onClick={() => toggleFlag(q.id)}
          type="button"
        >
          {flags[q.id] ? "Flagged" : "Flag"}
        </button>
      </div>

      <span className="fe-count">
        Question {idx + 1} of {qs.length}
      </span>
      <p className="fe-q">{q.q}</p>

      <div className="fe-choices">
        {q.choices.map((c, i) => (
          <button
            className={picks[q.id] === i ? "fe-choice on" : "fe-choice"}
            key={c}
            onClick={() => choose(q.id, i)}
            type="button"
          >
            <span className="fe-letter">{LETTERS[i]}</span>
            <span>{c}</span>
          </button>
        ))}
      </div>

      <div className="fe-nav">
        <button
          className="fe-navbtn"
          disabled={idx === 0}
          onClick={() => setIdx((n) => Math.max(0, n - 1))}
          type="button"
        >
          Previous
        </button>
        {idx + 1 < qs.length ? (
          <button
            className="fe-navbtn go"
            onClick={() => setIdx((n) => Math.min(qs.length - 1, n + 1))}
            type="button"
          >
            Next
          </button>
        ) : (
          <button className="fe-navbtn go" onClick={() => setPhase("review")} type="button">
            Review
          </button>
        )}
      </div>

      <button className="fe-ghost" onClick={() => setPhase("review")} type="button">
        Review all questions
      </button>
      {exitModal}
    </div>
  );
}

// ============================================================
// END OF FILE - app/foremanprep/exam/page.tsx (v5 - Full Access gate)
// If you can see this comment, the paste was not truncated.
// ============================================================
