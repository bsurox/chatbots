// FILE: app/foremanprep/practice/page.tsx
"use client";
import "./practice.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  buildPracticeSet,
  DOMAINS,
  getDomain,
  type DomainKey,
  type ForemanQuestion,
} from "@/lib/foremanprep/questions";

// Practice player v5 (Day 5): the subject picker. Drill one subject
// or run the whole mix; every card shows the subject's real weight
// on the 115-question exam. Finished rounds now post to the
// attempts API - the server re-grades and stores them for
// signed-in users, which is the raw material of the readiness
// score. Anonymous rounds still play fine and just aren't saved.

const ROUND_SIZE = 10;

type Sel = DomainKey | "all";
type RecapRow = { id: string; q: string; ok: boolean };
type PickedAnswer = { questionId: string; picked: number };

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
  const [phase, setPhase] = useState<"pick" | "quiz">("pick");
  const [sel, setSel] = useState<Sel>("all");
  const [qs, setQs] = useState<ForemanQuestion[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [recap, setRecap] = useState<RecapRow[]>([]);
  const [answers, setAnswers] = useState<PickedAnswer[]>([]);
  const [done, setDone] = useState(false);
  const [saved, setSaved] = useState(false);

  function startRound(key: Sel) {
    setSel(key);
    setQs(buildPracticeSet(key === "all" ? "all" : key, ROUND_SIZE));
    setIdx(0);
    setPicked(null);
    setCorrect(0);
    setRecap([]);
    setAnswers([]);
    setDone(false);
    setSaved(false);
    setPhase("quiz");
  }

  function backToPicker() {
    setPhase("pick");
    setQs(null);
    setDone(false);
  }

  function pick(i: number) {
    if (!qs || picked !== null) return;
    const question = qs[idx];
    const ok = i === question.answer;
    setPicked(i);
    if (ok) setCorrect((c) => c + 1);
    setRecap((r) => [...r, { id: question.id, q: question.q, ok }]);
    setAnswers((a) => [...a, { questionId: question.id, picked: i }]);
  }

  function postRound(finalAnswers: PickedAnswer[]) {
    fetch("/foremanprep/api/attempts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "practice",
        domain: sel === "all" ? null : sel,
        answers: finalAnswers,
      }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.saved) setSaved(true);
      })
      .catch(() => {});
  }

  function next() {
    if (!qs) return;
    if (idx + 1 >= qs.length) {
      postRound(answers);
      setDone(true);
      return;
    }
    setIdx(idx + 1);
    setPicked(null);
  }

  if (phase === "pick") {
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
        </div>
        <p className="fq-title">Practice</p>
        <p className="fq-hint">
          Drill one subject or run the whole mix. The counts are each
          subject's real weight on the 115-question exam.
        </p>
        <button className="fq-all" onClick={() => startRound("all")} type="button">
          <span className="fq-sn">All subjects</span>
          <span className="fq-sw">A mixed round, the way the exam feels</span>
        </button>
        <div className="fq-pick">
          {DOMAINS.map((d) => (
            <button
              className="fq-sub"
              key={d.key}
              onClick={() => startRound(d.key)}
              type="button"
            >
              <span className="fq-sn">{d.name}</span>
              <span className="fq-sw">{d.examCount} of 115 on the exam</span>
            </button>
          ))}
        </div>
      </div>
    );
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
          {saved ? <p className="fq-saved">Saved to your account.</p> : null}
          <div className="fq-list">
            {recap.map((r) => (
              <div className="fq-row" key={r.id}>
                <span className="fq-icon">
                  {r.ok ? <CheckMark /> : <XMark />}
                </span>
                <p className="fq-rq">{r.q}</p>
              </div>
            ))}
          </div>
          <button className="fq-again" onClick={() => startRound(sel)} type="button">
            Go again - fresh shuffle
          </button>
          <button className="fq-home" onClick={backToPicker} type="button">
            Pick another subject
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
        <button className="fq-back" onClick={backToPicker} type="button">
          Subjects
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
            {revealed && i === picked ? (
              <span className="fq-icon">{gotIt ? <CheckMark /> : <XMark />}</span>
            ) : null}
            <span className="fq-ct">{c}</span>
          </button>
        ))}
      </div>

      {revealed ? (
        <div className="fq-reveal">
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
// END OF FILE - app/foremanprep/practice/page.tsx (v5 - subject
// picker + rounds saved to the database)
// If you can see this comment, the paste was not truncated.
// ============================================================
