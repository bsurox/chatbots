// FILE: app/foremanprep/practice/page.tsx
"use client";
import "./practice.css";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  buildDemoSet,
  buildPracticeSet,
  DOMAINS,
  getDomain,
  type DomainKey,
  type ForemanQuestion,
} from "@/lib/foremanprep/questions";
import { AUDIO_BASE, audioUrl } from "@/lib/foremanprep/audio-config";

// Practice player v18: the EXAM TIMER, per question. A pick-
// screen toggle (default OFF, paid-only - free taps open the
// gate card) puts each question on the real exam's pace: 330
// minutes / 115 questions = 2 min 52 sec. The clock starts when
// a question appears, STOPS the moment an answer is clicked (so
// explanations and the tutor cost nothing), and resets fresh on
// Next. If it hits zero the question auto-reveals unanswered -
// marked wrong in the recap, not posted as a pick - and the
// student reads the why like any other reveal. Styles:
// practice.css v13. Also: the gate card's buy button now reads
// the clock like landing v16, so it stops saying $99 after the
// Sept 7 flip (clock read in an effect - Next 16 prerender rule).
// v17 notes: leaving a round for the subjects list now
// kills the audio instantly - backToPicker() stops any playing
// Listen / explanation clip before switching screens (his catch:
// audio kept talking over the picker). Next-question and unmount
// already stopped it; the picker door was the one leak.
// v16 notes: every answer choice wears an A/B/C/D
// letter chip, same look as the exam simulator - the chip rides
// at the left of the choice and tints green/red with the reveal
// (styles in practice.css v12). Nicer and more authentic.
// v15: the Listen pills wear a small headphone
// glyph (inline SVG, inherits the pill's orange) so the audio
// door is obvious at a glance - his ask for an ear/listen symbol
// in the badge. v14: Listen pills. Every question can speak -
// one pill reads the question and choices, and after the reveal a
// second reads the answer and explanation (pre-generated
// ElevenLabs audio from blob storage; see audio-config). Buttons
// self-hide if AUDIO_BASE is unset or a file is missing, audio
// stops on next question / new round / leaving the page.
// v13: every revealed question grows a quiet
// "Report this question" door at the bottom of the card - a
// student who has contradicting book info can send it (plus an
// optional reply email) straight to support through the existing
// /api/support mail pipe, with the question id, our answer key,
// and our citation attached automatically for the review desk.
// v12: on the free tier, tapping a locked length
// (25/Full) now DESELECTS the 10-question highlight while the gate
// card shows - nothing paid can ever appear selected; tapping 10
// re-highlights it. v11: the ForemanPrep back button wears the
// two-tone wordmark (.fp-wordmark - Foreman white, Prep orange).
// v10 notes (paywall): the free tier serves ONE fixed
// 10-question sample round (buildDemoSet) - same questions every
// time, so the free door never leaks the bank. Paid rounds draw
// shuffled sets from all 156. 25 and Full subject are Full Access
// perks; tapping them unpaid opens the gate card with the $99 button.
// v8 notes: the round-length picker starts
// UNSELECTED - picking a subject before a length blocks with a red
// "Select a round length first." error, the same pattern as the
// Spotmint format picker. Labels read "10 questions / 25 questions /
// Full subject", and the exam-weight text wears ForemanPrep orange.

type Len = 10 | 25 | "all";

// Real exam pace: 115 scored questions in 330 minutes = 172
// seconds a question, rounded.
const QUESTION_SECONDS = Math.round((330 * 60) / 115);
// Sept 7, 2026, 11:59 PM MDT (UTC-6) = Sept 8, 05:59 UTC.
const PRICE_FLIP_MS = Date.UTC(2026, 8, 8, 5, 59, 0);

function fmtClock(total: number): string {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const sec = total % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(sec).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${m}:${ss}`;
}
type Sel = DomainKey | "all";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

// Small headphone glyph for the Listen pills - inherits the pill
// color, so it stays brand-orange without any css changes.
const LISTEN_ICON = (
  <svg
    aria-hidden="true"
    fill="none"
    height="14"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width="14"
  >
    <path d="M4 14a8 8 0 0 1 16 0" />
    <rect height="6" rx="2" width="4" x="3" y="14" />
    <rect height="6" rx="2" width="4" x="17" y="14" />
  </svg>
);
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
  const [roundLen, setRoundLen] = useState<Len | null>(null);
  const [lenErr, setLenErr] = useState(false);
  const [access, setAccess] = useState<{ loggedIn: boolean; paid: boolean } | null>(null);
  const [showGate, setShowGate] = useState(false);
  const [timerOn, setTimerOn] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [earlyBird, setEarlyBird] = useState(true);

  useEffect(() => {
    if (Date.now() >= PRICE_FLIP_MS) setEarlyBird(false);
  }, []);

  useEffect(() => {
    fetch("/foremanprep/api/access")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setAccess({ loggedIn: Boolean(data.loggedIn), paid: Boolean(data.paid) });
        else setAccess({ loggedIn: false, paid: false });
      })
      .catch(() => setAccess({ loggedIn: false, paid: false }));
  }, []);

  function pickLen(l: Len) {
    if (l !== 10 && !access?.paid) {
      // Free tier: a locked length can never LOOK selected. Tapping
      // 25/Full clears the highlight entirely and shows the gate;
      // tapping 10 again re-selects it and the gate goes away.
      setRoundLen(null);
      setShowGate(true);
      return;
    }
    setRoundLen(l);
    setLenErr(false);
    setShowGate(false);
  }

  function toggleTimer() {
    if (!access?.paid) {
      setShowGate(true);
      return;
    }
    setTimerOn((t) => !t);
  }
  const [qs, setQs] = useState<ForemanQuestion[] | null>(null);
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

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingKind, setPlayingKind] = useState<"q" | "e" | null>(null);
  const [audioDead, setAudioDead] = useState<Record<string, boolean>>({});

  function stopAudio() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setPlayingKind(null);
  }

  // Never let audio outlive the page.
  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

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

  function playAudio(kind: "q" | "e", questionId: string) {
    if (!AUDIO_BASE) return;
    if (playingKind === kind) {
      stopAudio();
      return;
    }
    stopAudio();
    const key = `${kind}-${questionId}`;
    const a = new Audio(audioUrl(kind, questionId));
    a.onended = () => setPlayingKind(null);
    a.onerror = () => {
      setAudioDead((d) => ({ ...d, [key]: true }));
      setPlayingKind(null);
    };
    audioRef.current = a;
    a.play().catch(() => {
      setAudioDead((d) => ({ ...d, [key]: true }));
      setPlayingKind(null);
    });
    setPlayingKind(kind);
  }

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
          name: "ForemanPrep Question Report",
          email: reportEmail.trim() || "reports@foremanprep.com",
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
      const res = await fetch("/foremanprep/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId, messages: nextThread }),
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

  function startRound(key: Sel) {
    if (roundLen === null) {
      setLenErr(true);
      return;
    }
    setSel(key);
    let set: ForemanQuestion[];
    if (!access?.paid) {
      // Free tier: always the same fixed sample round, whatever
      // subject was tapped. Rotating draws would leak the whole
      // bank ten questions at a time.
      set = buildDemoSet();
    } else {
      const count = roundLen === "all" ? Number.MAX_SAFE_INTEGER : roundLen;
      set = buildPracticeSet(key === "all" ? "all" : key, count);
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
    stopAudio();
    setPhase("quiz");
  }

  function backToPicker() {
    stopAudio();
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
    if (timeLeft !== null) setTimeLeft(QUESTION_SECONDS);
    resetTutor();
    resetReport();
    stopAudio();
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
            <span className="fp-wordmark">
              Foreman<span>Prep</span>
            </span>
          </button>
        </div>
        <p className="fq-title">Practice</p>
        <p className="fq-hint">
          Drill one subject or run the whole mix.{" "}
          <span className="fq-hint-hl">
            The counts are each subject's real weight on the 115-question
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
                ? "Scaled 1:1 to the real exam - 2 min 52 sec per question, the same pace as 115 questions in 5.5 hours. The clock stops when you answer and resets fresh on every question."
                : "Put every question on the real exam clock - 2 min 52 sec each, scaled 1:1 to the actual test. Stops while you read explanations."}
          </p>
          {access !== null && !access.paid ? (
            <p className="fp-tryhint">
              The free round is a fixed 10-question sample. Full Access
              unlocks all 156 questions with fresh shuffles every round.
            </p>
          ) : null}
          {showGate ? (
            <div className="fp-gate">
              <p className="fp-gateh">Longer rounds are a Full Access feature.</p>
              <p className="fp-gated">
                Unlock 25-question rounds, full-subject runs, and the complete
                115-question exam simulator - one payment, no subscription.
              </p>
              <Link className="fp-gatebtn" href="/foremanprep/buy">
                {earlyBird ? "Get Full Access - $99 early bird" : "Get Full Access - $149"}
              </Link>
            </div>
          ) : null}
        </div>
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
        <p className="fq-load">Loading your questions...</p>
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

      <span className="fq-chip">{getDomain(question.domain)?.name ?? question.domain}</span>
      <p className="fq-q">{question.q}</p>

      {AUDIO_BASE ? (
        <div className="fq-listenrow">
          {!audioDead[`q-${question.id}`] ? (
            <button
              className={playingKind === "q" ? "fq-listen playing" : "fq-listen"}
              onClick={() => playAudio("q", question.id)}
              type="button"
            >
              {LISTEN_ICON}
              {playingKind === "q" ? "Stop" : "Listen"}
            </button>
          ) : null}
          {picked !== null && !audioDead[`e-${question.id}`] ? (
            <button
              className={playingKind === "e" ? "fq-listen playing" : "fq-listen"}
              onClick={() => playAudio("e", question.id)}
              type="button"
            >
              {LISTEN_ICON}
              {playingKind === "e" ? "Stop" : "Hear the explanation"}
            </button>
          ) : null}
        </div>
      ) : null}

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
            <p className="fq-timeout">Out of time on this one - 2:52 is the real pace. Read the why, then keep rolling.</p>
          ) : null}
          <p className="fq-explain">{question.explain}</p>
          <p className="fq-cite">Where it lives: {question.cite}</p>
          {tutorOpen ? (
            <div className="fq-tutor">
              <div className="fq-thread">
                {thread.length === 0 && !tutorBusy ? (
                  <div className="fq-msg tut">
                    Ask me anything about this one - why the answer is right, what a
                    term means, or where to find it in the books.
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
                placeholder="Tell us what's off. A book and page number that contradicts us is gold."
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
// END OF FILE - app/foremanprep/practice/page.tsx (v18 - per-
// question 1:1 exam timer, paid-only, off by default)
// If you can see this comment, the paste was not truncated.
// ============================================================
