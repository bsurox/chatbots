// FILE: app/wiremanprep/practice/page.tsx
"use client";
import "../../foremanprep/practice/practice.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  buildWmDemoSet,
  buildWmPracticeSet,
  getWmDomain,
  WM_DOMAINS,
  type WmDomainKey,
  type WmQuestion,
} from "@/lib/wiremanprep/questions";

// WiremanPrep practice room (v3):
// PICKER LAYOUT (his spec): the Start practice button now sits
// directly under the All subjects tile - no scrolling past the
// grid to launch - and an "Individual subjects" header labels the
// grid below it. The select-a-subject error line rides with the
// button. Pure reorder, no logic changes.
// v2 - THE TUTOR SEES YOUR PICK: the
// tutor call now sends which choice was selected (or -1 for a
// timeout), so with tutor route v3 a bare "why" gets a real
// answer about YOUR answer - his catch.)
// v1 notes: the yellow sibling of the GC
// practice player (v21 lineage), sharing practice.css; the
// layout's .wm-zone recolors every fq- component by itself.
// Carried over: the deliberate picker (nothing selected on open,
// taps highlight, Start practice launches, red error lines on a
// missing pick), free tier = ONE fixed 10-question sample
// (buildWmDemoSet - a rotating draw would leak the bank), paid
// rounds shuffle from all 153, A-D letter chips, the per-question
// exam timer, the tutor thread, and the report-question door.
// Sized for THIS exam: the timer runs 2 min 42 sec per question
// (270 minutes / 100 questions), the pass bar reads 75%, and the
// subject tiles show each domain's real weight out of 100.
// Deliberately absent in v1: audio (no Listen pills - no voiced
// bank yet). The tutor and attempts endpoints
// (/wiremanprep/api/tutor, /wiremanprep/api/attempts) ship later
// in the chain; until they exist the tutor shows its normal
// "unavailable" line and rounds simply don't record - both safe.
// Gate card is $149 FLAT - no clock, no early-bird machinery.
// No Date.now()/Math.random() in render (Next 16 prerender rule).

type Len = 10 | 25 | "all";

// Real exam pace: 100 scored questions in 270 minutes = 162
// seconds a question.
const QUESTION_SECONDS = Math.round((270 * 60) / 100);

function fmtClock(total: number): string {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const sec = total % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(sec).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${m}:${ss}`;
}
type Sel = WmDomainKey | "all";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

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

export default function WiremanPracticePage() {
  const router = useRouter();
  const [phase, setPhase] = useState<"pick" | "quiz">("pick");
  const [sel, setSel] = useState<Sel | null>(null);
  const [roundLen, setRoundLen] = useState<Len | null>(null);
  const [lenErr, setLenErr] = useState(false);
  const [domErr, setDomErr] = useState(false);
  const [access, setAccess] = useState<{ loggedIn: boolean; paid: boolean } | null>(null);
  const [showGate, setShowGate] = useState(false);
  const [timerOn, setTimerOn] = useState(false);
  const [gateSrc, setGateSrc] = useState<"len" | "timer">("len");
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    fetch("/wiremanprep/api/access")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setAccess({ loggedIn: Boolean(data.loggedIn), paid: Boolean(data.paid) });
        else setAccess({ loggedIn: false, paid: false });
      })
      .catch(() => setAccess({ loggedIn: false, paid: false }));
  }, []);

  function pickLen(l: Len) {
    if (l !== 10 && !access?.paid) {
      // Free tier: a locked length can never LOOK selected. The
      // tap deselects everything while the gate shows; 10 is the
      // only length that will take a highlight.
      setRoundLen(null);
      setGateSrc("len");
      setShowGate(true);
      return;
    }
    setRoundLen(l);
    setLenErr(false);
    setShowGate(false);
  }

  function toggleTimer() {
    if (!access?.paid) {
      setGateSrc("timer");
      setShowGate(true);
      return;
    }
    setTimerOn((t) => !t);
  }
  const [qs, setQs] = useState<WmQuestion[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [recap, setRecap] = useState<RecapRow[]>([]);
  const [answers, setAnswers] = useState<PickedAnswer[]>([]);
  const [done, setDone] = useState(false);
  const [saved, setSaved] = useState(false);
  const [tutorOpen, setTutorOpen] = useState(false);
  const [thread, setThread] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [tutorInput, setTutorInput] = useState("");
  const [tutorBusy, setTutorBusy] = useState(false);
  const [tutorErr, setTutorErr] = useState("");

  // Exam timer heartbeat: ticks only while a question is open in
  // an active round. Pauses during the reveal (explanations are
  // study time, not exam time) and never runs on pick/results.
  useEffect(() => {
    if (phase !== "quiz" || done || timeLeft === null) return;
    if (picked !== null || timeLeft <= 0) return;
    const t = setTimeout(() => {
      setTimeLeft((sLeft) => (sLeft === null ? null : sLeft - 1));
    }, 1000);
    return () => clearTimeout(t);
  }, [phase, done, timeLeft, picked]);

  // Zero on the clock: the question auto-reveals unanswered -
  // recap marks it wrong, nothing is posted as a pick, and the
  // student reads the explanation like any other reveal.
  useEffect(() => {
    if (phase !== "quiz" || done || timeLeft !== 0) return;
    if (!qs || picked !== null) return;
    const question = qs[idx];
    setPicked(-1);
    setRecap((r) => [...r, { id: question.id, q: question.q, ok: false }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, done, timeLeft, picked]);

  const [reportOpen, setReportOpen] = useState(false);
  const [reportText, setReportText] = useState("");
  const [reportEmail, setReportEmail] = useState("");
  const [reportPhase, setReportPhase] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [reportErr, setReportErr] = useState("");

  function resetReport() {
    setReportOpen(false);
    setReportText("");
    setReportPhase("idle");
    setReportErr("");
  }

  async function sendReport() {
    if (!qs || reportPhase === "sending") return;
    const question = qs[idx];
    const text = reportText.trim();
    if (!text) return;
    setReportPhase("sending");
    setReportErr("");
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "WiremanPrep Question Report",
          email: reportEmail.trim() || "reports@wiremanprep.com",
          comment:
            "QUESTION REPORT - " + question.id + "\n\n" +
            "Q: " + question.q + "\n\n" +
            "Our answer key: " + question.choices[question.answer] + "\n" +
            "Our citation: " + question.cite + "\n\n" +
            "What the student says:\n" + text,
        }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        setReportPhase("done");
        return;
      }
      setReportPhase("error");
      setReportErr(data?.error ?? "Could not send - please try again.");
    } catch {
      setReportPhase("error");
      setReportErr("Could not send - please try again.");
    }
  }

  function resetTutor() {
    setTutorOpen(false);
    setThread([]);
    setTutorInput("");
    setTutorBusy(false);
    setTutorErr("");
  }

  async function askTutor(questionId: string) {
    const text = tutorInput.trim();
    if (!text || tutorBusy) return;
    const nextThread = [...thread, { role: "user" as const, content: text }];
    setThread(nextThread);
    setTutorInput("");
    setTutorErr("");
    setTutorBusy(true);
    try {
      const res = await fetch("/wiremanprep/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId, picked, messages: nextThread }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.reply) {
        setThread((t) => [...t, { role: "assistant", content: data.reply }]);
      } else {
        setTutorErr(data?.error ?? "The tutor is unavailable - try again.");
      }
    } catch {
      setTutorErr("The tutor is unavailable - try again.");
    } finally {
      setTutorBusy(false);
    }
  }

  // Tapping a subject SELECTS it (the tile highlights); only the
  // Start practice button actually begins a round.
  function pickDomain(key: Sel) {
    setSel(key);
    setDomErr(false);
  }

  function startRound() {
    if (roundLen === null || sel === null) {
      setLenErr(roundLen === null);
      setDomErr(sel === null);
      return;
    }
    let set: WmQuestion[];
    if (!access?.paid) {
      // Free tier: always the same fixed sample round, whatever
      // subject was selected. Rotating draws would leak the whole
      // bank ten questions at a time.
      set = buildWmDemoSet();
    } else {
      const count = roundLen === "all" ? Number.MAX_SAFE_INTEGER : roundLen;
      set = buildWmPracticeSet(sel === "all" ? "all" : sel, count);
    }
    setQs(set);
    setTimeLeft(timerOn && access?.paid ? QUESTION_SECONDS : null);
    setIdx(0);
    setPicked(null);
    setCorrect(0);
    setRecap([]);
    setAnswers([]);
    setDone(false);
    setSaved(false);
    resetTutor();
    resetReport();
    setPhase("quiz");
  }

  function backToPicker() {
    setPhase("pick");
    setQs(null);
    setDone(false);
    setTimeLeft(null);
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
    fetch("/wiremanprep/api/attempts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "practice",
        domain: sel === "all" || sel === null ? null : sel,
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
    if (timeLeft !== null) setTimeLeft(QUESTION_SECONDS);
    resetTutor();
    resetReport();
  }

  if (phase === "pick") {
    return (
      <div className="fq-wrap">
        <div className="fq-head">
          <button
            className="fq-back"
            onClick={() => router.push("/wiremanprep")}
            type="button"
          >
            <span className="fp-wordmark">
              Wireman<span>Prep</span>
            </span>
          </button>
        </div>
        <p className="fq-title">Practice</p>
        <p className="fq-hint">
          Drill one subject or run the whole mix.{" "}
          <span className="fq-hint-hl">
            The counts are each subject's real weight on the 100-question
            exam.
          </span>
        </p>
        <div className="fq-lenrow">
          <span className="fq-lenlabel">Round length</span>
          <div className={lenErr ? "fq-lenseg err" : "fq-lenseg"}>
            <button
              className={roundLen === 10 ? "on" : ""}
              onClick={() => pickLen(10)}
              type="button"
            >
              10 questions
            </button>
            <button
              className={roundLen === 25 ? "on" : ""}
              onClick={() => pickLen(25)}
              type="button"
            >
              25 questions
            </button>
            <button
              className={roundLen === "all" ? "on" : ""}
              onClick={() => pickLen("all")}
              type="button"
            >
              Full subject
            </button>
          </div>
          {lenErr ? <p className="fq-lenerr">Select a round length first.</p> : null}
          <div className="fq-timerrow">
            <span className="fq-lenlabel">Exam timer</span>
            <button
              className={timerOn && access?.paid ? "fq-timertoggle on" : "fq-timertoggle"}
              onClick={toggleTimer}
              type="button"
            >
              <span className="fq-knob" />
              {timerOn && access?.paid ? "On" : "Off"}
            </button>
          </div>
          <p className="fq-timernote">
            {access !== null && !access.paid
              ? "Full Access feature - the 1:1 exam-pace clock comes with the full course."
              : timerOn
                ? "Scaled 1:1 to the real exam - 2 min 42 sec per question, the same pace as 100 questions in 4.5 hours. The clock stops when you answer and resets fresh on every question."
                : "Put every question on the real exam clock - 2 min 42 sec each, scaled 1:1 to the actual test. Stops while you read explanations."}
          </p>
          {access !== null && !access.paid ? (
            <p className="fp-tryhint">
              The free round is a fixed 10-question sample. Full Access
              unlocks all 153 questions with fresh shuffles every round.
            </p>
          ) : null}
          {showGate ? (
            <div className="fp-gate">
              <p className="fp-gateh">
                {gateSrc === "timer"
                  ? "The exam timer is a Full Access feature."
                  : "Longer rounds are a Full Access feature."}
              </p>
              <p className="fp-gated">
                Unlock the 1:1 exam-pace timer, 25-question rounds,
                full-subject runs, and the complete 100-question exam
                simulator - one payment, no subscription.
              </p>
              <Link className="fp-gatebtn" href="/wiremanprep/buy">
                Get Full Access - $149
              </Link>
            </div>
          ) : null}
        </div>
        <button
          className={sel === "all" ? "fq-all" : "fq-all off"}
          onClick={() => pickDomain("all")}
          type="button"
        >
          <span className="fq-sn">All subjects</span>
          <span className="fq-sw">A mixed round, the way the exam feels</span>
        </button>
        {domErr ? <p className="fq-lenerr">Select a subject first.</p> : null}
        <button className="fq-startbtn" onClick={startRound} type="button">
          Start practice
        </button>
        <span className="fq-lenlabel" style={{ display: "block", margin: "18px 0 8px" }}>
          Individual subjects
        </span>
        <div className="fq-pick">
          {WM_DOMAINS.map((d) => (
            <button
              className={sel === d.key ? "fq-sub sel" : "fq-sub"}
              key={d.key}
              onClick={() => pickDomain(d.key)}
              type="button"
            >
              <span className="fq-sn">{d.name}</span>
              <span className="fq-sw">{d.examCount} of 100 on the exam</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (!qs) {
    return (
      <div className="fq-wrap">
        <p className="fq-load">Loading your questions...</p>
      </div>
    );
  }

  if (done) {
    const pct = Math.round((correct / qs.length) * 100);
    const passed = pct >= 75;
    return (
      <div className="fq-wrap">
        <div className="fq-done">
          <p className="fq-score">
            {correct}
            <span> / {qs.length}</span>
          </p>
          <p className="fq-msg">
            {pct}% - the real exam bar is 75%.{" "}
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
          <button className="fq-again" onClick={startRound} type="button">
            {access?.paid ? "Go again - fresh shuffle" : "Run the sample again"}
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
          {timeLeft !== null ? (
            <span className={timeLeft <= 30 ? "fq-clock low" : "fq-clock"}>
              {fmtClock(timeLeft)}
            </span>
          ) : null}
          Question {idx + 1} / {qs.length}
        </span>
      </div>

      <span className="fq-chip">{getWmDomain(question.domain)?.name ?? question.domain}</span>
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
            <span className="fq-letter">{LETTERS[i]}</span>
            <span className="fq-ct">{c}</span>
            {revealed && i === picked ? (
              <span className="fq-icon">{gotIt ? <CheckMark /> : <XMark />}</span>
            ) : null}
          </button>
        ))}
      </div>

      {revealed ? (
        <div className="fq-reveal">
          {picked === -1 ? (
            <p className="fq-timeout">Out of time on this one - 2:42 is the real pace. Read the why, then keep rolling.</p>
          ) : null}
          <p className="fq-explain">{question.explain}</p>
          <p className="fq-cite">Where it lives: {question.cite}</p>
          {tutorOpen ? (
            <div className="fq-tutor">
              <div className="fq-thread">
                {thread.length === 0 && !tutorBusy ? (
                  <div className="fq-msg tut">
                    Ask me anything about this one - why the answer is right, what a
                    term means, or where to find it in the Code.
                  </div>
                ) : null}
                {thread.map((m, i) => (
                  <div
                    className={m.role === "user" ? "fq-msg me" : "fq-msg tut"}
                    key={`${m.role}-${i}`}
                  >
                    {m.content}
                  </div>
                ))}
                {tutorBusy ? <div className="fq-msg tut thinking">Thinking...</div> : null}
              </div>
              {tutorErr ? <p className="fq-terr">{tutorErr}</p> : null}
              <div className="fq-ask">
                <input
                  className="fq-askin"
                  disabled={tutorBusy}
                  onChange={(e) => setTutorInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") askTutor(question.id);
                  }}
                  placeholder="Ask the tutor..."
                  value={tutorInput}
                />
                <button
                  className="fq-asksend"
                  disabled={tutorBusy || tutorInput.trim().length === 0}
                  onClick={() => askTutor(question.id)}
                  type="button"
                >
                  Send
                </button>
              </div>
            </div>
          ) : (
            <button
              className="fq-asktut"
              onClick={() => setTutorOpen(true)}
              type="button"
            >
              Ask the tutor why
            </button>
          )}
          <button className="fq-next" onClick={next} type="button">
            {idx + 1 >= qs.length ? "See my score" : "Next question"}
          </button>
          {reportPhase === "done" ? (
            <p className="fq-repok">Thanks - your report went straight to our review desk.</p>
          ) : reportOpen ? (
            <div className="fq-repbox">
              <p className="fq-reph">What looks wrong with this question?</p>
              <textarea
                className="fq-repta"
                disabled={reportPhase === "sending"}
                maxLength={1200}
                onChange={(e) => setReportText(e.target.value)}
                placeholder="Tell us what's off. A Code section that contradicts us is gold."
                value={reportText}
              />
              <input
                className="fq-repin"
                disabled={reportPhase === "sending"}
                inputMode="email"
                maxLength={200}
                onChange={(e) => setReportEmail(e.target.value)}
                placeholder="Your email (optional - only if you want a reply)"
                type="email"
                value={reportEmail}
              />
              {reportPhase === "error" ? <p className="fq-reperr">{reportErr}</p> : null}
              <div className="fq-repacts">
                <button
                  className="fq-repsend"
                  disabled={reportPhase === "sending" || reportText.trim().length === 0}
                  onClick={sendReport}
                  type="button"
                >
                  {reportPhase === "sending" ? "Sending..." : "Send report"}
                </button>
                <button
                  className="fq-repcancel"
                  disabled={reportPhase === "sending"}
                  onClick={() => setReportOpen(false)}
                  type="button"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button className="fq-repbtn" onClick={() => setReportOpen(true)} type="button">
              Report this question
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}

// ============================================================
// END OF FILE - app/wiremanprep/practice/page.tsx (v3 - Start
// button above the subject grid + Individual subjects header)
// If you can see this comment, the paste was not truncated.
// ============================================================
