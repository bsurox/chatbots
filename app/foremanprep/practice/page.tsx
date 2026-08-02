// FILE: app/foremanprep/practice/page.tsx
"use client";
import "./practice.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { buildPracticeSet, getDomain, type ForemanQuestion } from "@/lib/foremanprep/questions";

// Practice player v2 (his feedback round 1): verdict words removed.
// The marks carry the message - a red X draws itself on the wrong
// pick, a green circle-check draws itself on a right pick, and a
// wrong pick also spells out the correct answer above the
// explanation box. Still no login and no database writes.

const ROUND_SIZE = 10;

type RecapRow = { id: string; q: string; ok: boolean };

function CheckMark() {
  return (
    <svg viewBox="0 0 100 100">
      <circle className="draw c1" cx="50" cy="50" pathLength={100} r="42" />
      <path className="draw c2" d="M30 52 L45 66 L72 36" pathLength={100} />
    </svg>
  );
}

function XMark() {
  return (
    <svg viewBox="0 0 100 100">
      <path className="draw x1" d="M32 32 L68 68" pathLength={100} />
      <path className="draw x2" d="M68 32 L32 68" pathLength={100} />
    </svg>
  );
}

export default function PracticePage() {
  const router = useRouter();
  const [qs, setQs] = useState<ForemanQuestion[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [recap, setRecap] = useState<RecapRow[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setQs(buildPracticeSet("all", ROUND_SIZE));
  }, []);

  function startOver() {
    setQs(buildPracticeSet("all", ROUND_SIZE));
    setIdx(0);
    setPicked(null);
    setCorrect(0);
    setRecap([]);
    setDone(false);
  }

  function pick(i: number) {
    if (!qs || picked !== null) return;
    const question = qs[idx];
    const ok = i === question.answer;
    setPicked(i);
    if (ok) setCorrect((c) => c + 1);
    setRecap((r) => [...r, { id: question.id, q: question.q, ok }]);
  }

  function next() {
    if (!qs) return;
    if (idx + 1 >= qs.length) {
      setDone(true);
      return;
    }
    setIdx(idx + 1);
    setPicked(null);
  }

  if (!qs) {
    return (
      <div className="fq-wrap">
        <p className="fq-load">Shuffling your questions...</p>
      </div>
    );
  }

  if (done) {
    const pct = Math.round((correct / qs.length) * 100);
    const passed = pct >= 70;
    return (
      <div className="fq-wrap">
        <div className="fq-done">
          <p className="fq-score">
            {correct}
            <span> / {qs.length}</span>
          </p>
          <p className="fq-msg">
            {pct}% - the real exam bar is 70%.{" "}
            {passed ? (
              <b>You would have cleared it today.</b>
            ) : (
              <b>Keep drilling - closing that gap is the whole job.</b>
            )}
          </p>
          <div className="fq-list">
            {recap.map((r) => (
              <div className="fq-row" key={r.id}>
                <span className={r.ok ? "fq-mark good" : "fq-mark bad"}>
                  {r.ok ? "+" : "x"}
                </span>
                <p className="fq-rq">{r.q}</p>
              </div>
            ))}
          </div>
          <button className="fq-again" onClick={startOver} type="button">
            Go again - fresh shuffle
          </button>
          <button
            className="fq-home"
            onClick={() => router.push("/foremanprep")}
            type="button"
          >
            Back to ForemanPrep
          </button>
        </div>
      </div>
    );
  }

  const question = qs[idx];
  const revealed = picked !== null;
  const gotIt = revealed && picked === question.answer;

  function choiceClass(i: number): string {
    if (!revealed) return "fq-choice";
    if (i === question.answer) return "fq-choice on-right";
    if (i === picked) return "fq-choice on-wrong";
    return "fq-choice dim";
  }

  return (
    <div className="fq-wrap">
      <div className="fq-head">
        <button
          className="fq-back"
          onClick={() => router.push("/foremanprep")}
          type="button"
        >
          ForemanPrep
        </button>
        <span className="fq-prog">
          Question {idx + 1} / {qs.length}
        </span>
      </div>

      <span className="fq-chip">{getDomain(question.domain)?.name ?? question.domain}</span>
      <p className="fq-q">{question.q}</p>

      <div className="fq-choices">
        {question.choices.map((c, i) => (
          <button
            className={choiceClass(i)}
            disabled={revealed}
            key={c}
            onClick={() => pick(i)}
            type="button"
          >
            <span className="fq-ct">{c}</span>
            {revealed && i === picked ? (
              <span className="fq-icon">{gotIt ? <CheckMark /> : <XMark />}</span>
            ) : null}
          </button>
        ))}
      </div>

      {revealed ? (
        <div className="fq-reveal">
          {gotIt ? null : (
            <>
              <p className="fq-ca-label">The correct answer is:</p>
              <p className="fq-ca">{question.choices[question.answer]}</p>
            </>
          )}
          <p className="fq-explain">{question.explain}</p>
          <p className="fq-cite">Where it lives: {question.cite}</p>
          <button className="fq-next" onClick={next} type="button">
            {idx + 1 >= qs.length ? "See my score" : "Next question"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

// ============================================================
// END OF FILE - app/foremanprep/practice/page.tsx (v2 - drawn
// marks + correct-answer callout)
// If you can see this comment, the paste was not truncated.
// ============================================================
