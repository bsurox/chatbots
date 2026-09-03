// FILE: app/wiremanprep/exam/page.tsx
"use client";
import "../../foremanprep/exam/exam.css";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { buildWmExamSet, type WmQuestion } from "@/lib/wiremanprep/questions";

// WiremanPrep exam simulator (v1) - the yellow sibling of the GC
// simulator (v9 lineage), sharing exam.css; the layout's .wm-zone
// recolors the fe- wardrobe and the flag glyph by itself.
// This one is a TRUE 1:1 form on day one: buildWmExamSet draws
// 100 questions weighted exactly like the official PSI outline
// (8/9/11/17/17/16/13/8/1 per subject), the clock is the real
// 270 minutes, and grading runs against the real 75-of-100 bar.
// Everything the GC sim earned is carried over: free navigation
// with Previous/Next, flag pills, the review jump grid with
// flagged markers, submit-with-blanks warning, the leave-confirm
// modal that wipes a live attempt (a timed test cannot be paused
// by leaving), and the clock ticking through the review screen -
// review time is exam time, zero auto-submits.
// Paid-gated like the GC sim: the intro checks
// /wiremanprep/api/access (ships later in the chain; until it
// exists the catch treats visitors as unpaid and shows the $149
// gate - correct behavior pre-launch). Finished exams post to
// /wiremanprep/api/attempts and fail silently until that lands.
// No Date.now()/Math.random() in render (Next 16 prerender rule).

const REAL_SECONDS = 270 * 60;
const REAL_QUESTIONS = 100;
const PER_Q = Math.round(REAL_SECONDS / REAL_QUESTIONS);
const PASS_PCT = 75;

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

export default function WiremanExamPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("intro");
  const [qs, setQs] = useState<WmQuestion[]>([]);
  const [idx, setIdx] = useState(0);
  const [picks, setPicks] = useState<Record<string, number>>({});
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [remaining, setRemaining] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [confirmExit, setConfirmExit] = useState(false);
  const [access, setAccess] = useState<{ loggedIn: boolean; paid: boolean } | null>(null);
  const tick = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetch("/wiremanprep/api/access")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setAccess({ loggedIn: Boolean(data.loggedIn), paid: Boolean(data.paid) });
        else setAccess({ loggedIn: false, paid: false });
      })
      .catch(() => setAccess({ loggedIn: false, paid: false }));
  }, []);

  const grade = useCallback(
    (form: WmQuestion[], chosen: Record<string, number>) => {
      if (tick.current) clearInterval(tick.current);
      let correct = 0;
      for (const q of form) {
        if (chosen[q.id] === q.answer) correct += 1;
      }
      setScore({ correct, total: form.length });
      setPhase("graded");
      fetch("/wiremanprep/api/attempts", {
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
    if (phase !== "run" && phase !== "review") return;
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

  // When the clock hits zero mid-exam OR mid-review, auto-submit
  // with what we have - review time is exam time.
  useEffect(() => {
    if ((phase === "run" || phase === "review") && remaining === 0 && qs.length > 0) {
      grade(qs, picks);
    }
  }, [phase, remaining, qs, picks, grade]);

  function begin() {
    const form = buildWmExamSet();
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
    router.push("/wiremanprep");
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
    router.push("/wiremanprep");
  }

  const exitModal = confirmExit ? (
    <div className="fe-overlay">
      <div className="fe-modal">
        <p className="fe-mtitle">Leave the exam?</p>
        <p className="fe-mtext">
          This is a timed test. If you go back to WiremanPrep now, this
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
            onClick={() => router.push("/wiremanprep")}
            type="button"
          >
            <span className="fp-wordmark">
              Wireman<span>Prep</span>
            </span>
          </button>
        </div>
        <p className="fe-title">Exam simulator</p>
        <p className="fe-lead">
          A full dress rehearsal for the real thing. Answer every question,
          flag the ones you want to revisit, and submit when you are ready.
        </p>
        <div className="fe-facts">
          <div className="fe-fact">
            <b>1:1 form</b>
            <span>
              100 questions drawn at the official outline's exact subject
              weights, on the real 4.5-hour clock - the same shape as the
              form PSI hands you.
            </span>
          </div>
          <div className="fe-fact">
            <b>Pass</b>
            <span>75 of 100 is the real bar - tougher than most trade exams.</span>
          </div>
          <div className="fe-fact">
            <b>Open book</b>
            <span>
              On the real exam you may bring your NEC (2020 or 2023), the
              OSHA standards, NFPA 70E, and Ugly's. Practice finding answers
              fast - that is the whole game.
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
              All 100 questions on the true 4.5-hour clock, graded against the
              real 75-to-pass bar - the closest thing to test day you can get.
              Free practice rounds stay open on the practice page.
            </p>
            <Link className="fp-gatebtn" href="/wiremanprep/buy">
              Get Full Access - $149
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
              ? "That clears the 75% bar. Keep stringing these together and test day is just another rep."
              : "Short of the 75% bar this time. Drill the subjects that got you and run it again - closing that gap is the whole job."}
          </p>
          <button className="fe-submit" onClick={begin} type="button">
            Take it again
          </button>
          <button
            className="fe-ghost"
            onClick={() => router.push("/wiremanprep")}
            type="button"
          >
            Back to{" "}
            <span className="fp-wordmark">
              Wireman<span>Prep</span>
            </span>
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
            <span className="fp-wordmark">
              Wireman<span>Prep</span>
            </span>
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
          Tap any number to jump back. A yellow flag marks the ones you
          flagged.
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
          <span>
            <b style={{ color: "var(--fp)" }}>{"\u2691"}</b> = flagged
          </span>
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
          <span className="fp-wordmark">
            Wireman<span>Prep</span>
          </span>
        </button>
      </div>
      <div className="fe-bar">
        <span className={remaining < 300 ? "fe-clock low" : "fe-clock"}>{clock(remaining)}</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
        <span className="fe-count">
          Question {idx + 1} of {qs.length}
        </span>
        <button
          className={flags[q.id] ? "fe-flag on" : "fe-flag"}
          onClick={() => toggleFlag(q.id)}
          type="button"
        >
          {flags[q.id] ? "Flagged" : "Flag"}
        </button>
      </div>
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
// END OF FILE - app/wiremanprep/exam/page.tsx (v1 - true 1:1
// sim: 100 questions at official weights, 270 min, 75 bar)
// If you can see this comment, the paste was not truncated.
// ============================================================
