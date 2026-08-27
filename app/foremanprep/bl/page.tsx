// FILE: app/foremanprep/bl/page.tsx
"use client";
import "../practice/practice.css";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AUDIO_BASE, audioUrl } from "@/lib/foremanprep/audio-config";
import {
  BL_DOMAINS,
  buildBlDemoSet,
  buildBlPracticeSet,
  getBlDomain,
  type BlDomainKey,
  type BlQuestion,
} from "@/lib/foremanprep/blquestions";
import {
  BL_PACKS_LIVE,
  BL_STATE_PACKS,
  type BlStatePack,
} from "@/lib/foremanprep/blstates";

// Business & Law practice room (v7): the exam timer learns your
// state, and the back button leads home to Business & Law.
// 1. STATE-PACE SELECT - when the timer is on, a dropdown picks
//    which state's clock to train: every timed state from
//    blstates (its bulletin-verified minutes divided across its
//    real question count - Tennessee 2:48, Georgia 3:00, Florida
//    3:15, California 1:50...). Untimed Louisiana and course-based
//    Arizona have no pace and stay off the list. The pick sticks
//    in localStorage (fp-bl-pace, read after mount only), the
//    timer note and the out-of-time line name the chosen state,
//    and Tennessee stays the default.
// 2. BACK BUTTON - the top-left pill now reads Business & Law and
//    leads to /bl-prep (the B&L landing), not the orange
//    ForemanPrep landing. His rule: anything B&L backs out to the
//    B&L landing page; /bl-prep carries the door onward to
//    ForemanPrep proper.
// v6 notes: the STATE EXAM SIMULATOR
// door joins the picker - a big blue button above the state packs
// linking /foremanprep/bl-exam, where all 16 B&L states sit 1:1
// sims on their real formats (blstates v2). The pack section now
// renders BL_PACKS_LIVE (states with statute questions - TN/GA/SC
// so far) so format-only states never show an empty round.
// v5 notes: STATE PACKS joined phase 2.
// Below the domain grid sits the state-pack section: Tennessee,
// Georgia, and South Carolina rounds of 8 statute-verified
// questions each - lien deadlines, license thresholds, retainage
// caps, the numbers the core bank deliberately hedges. Packs are
// paid-only (a free tap opens the gate), run whole and shuffled,
// and grade/save through the same attempts pipe (route v3
// resolves their ids). During a state round the question chip
// reads "Tennessee - Liens & Payment" so nobody mistakes a state
// number for a universal one.
// v4 notes (phase 2 wave 1) - three features, all paid-gated:
// 1. THE TUTOR - "Ask the tutor why" on every reveal. The tutor
//    API (v3) resolves bl- ids and coaches in Business & Law
//    voice; B&L owners get the full 25/day allowance.
// 2. LISTEN PILLS - every question and explanation can speak.
//    Files come from the same blob store (audio-gen v4 voices
//    bl- ids); until Chase runs the B&L batch on admin-audio the
//    pills self-hide on their first failed load, so shipping this
//    before the audio exists costs nothing.
// 3. EXAM-PACE TIMER - per-question countdown at 2:48 (168s), the
//    tightest common state pace (Tennessee's 50 questions in 140
//    minutes; Georgia allows 3:00). Same mechanics as the GC
//    timer: paid-only, default OFF, clock freezes on answer,
//    resets on next, zero auto-reveals unanswered.
// v3 notes: the whole room wears .fp-blzone (css v15 catches the
// hardcoded borders) and a free tap on a locked length DESELECTS
// the highlight entirely while the gate shows - his spec, and the
// opposite of GC practice v20's snap-back on purpose.
// v2 notes: the gate's buy button links /foremanprep/buy?product=bl.
// v1 notes: same player as the trade exam - pick a domain or the
// whole mix, letter chips, instant reveal with the why and the
// citation, recap and score, rounds saved. Free tier = one fixed
// 10-question sample; $79 unlocks all 120 with fresh shuffles.

type Len = 10 | 25 | "all";
type Sel = BlDomainKey | "all";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

// Fallback pace if the state list ever comes up empty: Tennessee's
// 50 questions in 140 minutes = 168 seconds a question.
const FALLBACK_SECONDS = Math.round((140 * 60) / 50);

// Every timed state is a pace option: its real bulletin clock
// divided across its real question count (blstates v2, verified
// Aug 2026). Untimed Louisiana and course-based Arizona have no
// pace to train and stay off the list.
const PACE_STATES = BL_STATE_PACKS.filter(
  (p) => p.sim === "timed" && p.minutes !== null && p.simQuestions !== null
);

function paceSecondsFor(key: string): number {
  const p = PACE_STATES.find((s) => s.key === key);
  if (!p || p.minutes === null || p.simQuestions === null) return FALLBACK_SECONDS;
  return Math.max(30, Math.round((p.minutes * 60) / p.simQuestions));
}

function fmtClock(total: number): string {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const sec = total % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(sec).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${m}:${ss}`;
}

// Small headphone glyph for the Listen pills - inherits the pill
// color, so it wears the room's blue without any css changes.
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

export default function BlPracticePage() {
  const router = useRouter();
  const [phase, setPhase] = useState<"pick" | "quiz">("pick");
  const [sel, setSel] = useState<Sel>("all");
  const [roundLen, setRoundLen] = useState<Len | null>(null);
  const [lenErr, setLenErr] = useState(false);
  const [access, setAccess] = useState<{ loggedIn: boolean; bl: boolean } | null>(null);
  const [showGate, setShowGate] = useState(false);
  const [gateSrc, setGateSrc] = useState<"len" | "timer" | "state">("len");
  const [timerOn, setTimerOn] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [paceKey, setPaceKey] = useState("tn");

  // The chosen pace state survives visits - read after mount only,
  // never during render (the Date.now doctrine applies to storage
  // reads too: hydration must match the server HTML).
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("fp-bl-pace");
      if (stored && PACE_STATES.some((s) => s.key === stored)) setPaceKey(stored);
    } catch {
      // Storage can be blocked - the Tennessee default is fine.
    }
  }, []);

  useEffect(() => {
    fetch("/foremanprep/api/access")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setAccess({ loggedIn: Boolean(data.loggedIn), bl: Boolean(data.bl) });
        else setAccess({ loggedIn: false, bl: false });
      })
      .catch(() => setAccess({ loggedIn: false, bl: false }));
  }, []);

  // Free tier: 10 questions is the only round length there is, so
  // it arrives pre-selected. B&L owners start blank and pick.
  useEffect(() => {
    if (access !== null && !access.bl) {
      setRoundLen(10);
      setLenErr(false);
    }
  }, [access]);

  function pickLen(l: Len) {
    if (l !== 10 && !access?.bl) {
      // Free tier: tapping a locked length DESELECTS everything
      // while the gate shows (his spec) - the tap visibly landed,
      // nothing paid ever looks selected, and they tap 10 to get
      // the legal round back.
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
    if (!access?.bl) {
      setGateSrc("timer");
      setShowGate(true);
      return;
    }
    setTimerOn((t) => !t);
  }

  function pickPace(key: string) {
    setPaceKey(key);
    try {
      window.localStorage.setItem("fp-bl-pace", key);
    } catch {
      // Best effort - the in-session pick still applies.
    }
  }

  const pacePack = PACE_STATES.find((s) => s.key === paceKey) ?? null;

  const [qs, setQs] = useState<BlQuestion[] | null>(null);
  const [roundTag, setRoundTag] = useState("bl");
  const [activePack, setActivePack] = useState<BlStatePack | null>(null);
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

  function shufflePack(items: BlQuestion[]): BlQuestion[] {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function beginRound(set: BlQuestion[], tag: string, pack: BlStatePack | null) {
    setQs(set);
    setRoundTag(tag);
    setActivePack(pack);
    setTimeLeft(timerOn && access?.bl ? paceSecondsFor(paceKey) : null);
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

  function startStateRound(pack: BlStatePack) {
    if (!access?.bl) {
      setGateSrc("state");
      setShowGate(true);
      return;
    }
    beginRound(shufflePack(pack.questions), "bl-st-" + pack.key, pack);
  }

  function startRound(key: Sel) {
    if (roundLen === null) {
      setLenErr(true);
      return;
    }
    setSel(key);
    let set: BlQuestion[];
    if (!access?.bl) {
      // Free tier: always the same fixed sample round, whatever
      // domain was tapped. Rotating draws would leak the whole
      // bank ten questions at a time.
      set = buildBlDemoSet();
    } else {
      const count = roundLen === "all" ? Number.MAX_SAFE_INTEGER : roundLen;
      set = buildBlPracticeSet(key === "all" ? "all" : key, count);
    }
    beginRound(set, key === "all" ? "bl" : "bl-" + key, null);
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
        domain: roundTag,
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
    if (timeLeft !== null) setTimeLeft(paceSecondsFor(paceKey));
    resetTutor();
    resetReport();
    stopAudio();
  }

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
        <p className="fq-title">Business &amp; Law</p>
        <p className="fq-hint">
          The SECOND exam most NASCLA states require - business
          management, contracts, liens, payroll, and safety law.{" "}
          <span className="fq-hint-hl">
            This is the state-neutral core those exams are built on.
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
              Full domain
            </button>
          </div>
          {lenErr ? <p className="fq-lenerr">Select a round length first.</p> : null}
          <div className="fq-timerrow">
            <span className="fq-lenlabel">Exam timer</span>
            <button
              className={timerOn && access?.bl ? "fq-timertoggle on" : "fq-timertoggle"}
              onClick={toggleTimer}
              type="button"
            >
              <span className="fq-knob" />
              {timerOn && access?.bl ? "On" : "Off"}
            </button>
          </div>
          {access?.bl && timerOn ? (
            <div className="fq-pacerow">
              <select
                aria-label="Pick the state whose exam pace to train"
                className="fq-paceselect"
                onChange={(e) => pickPace(e.target.value)}
                value={paceKey}
              >
                {PACE_STATES.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.name + " - " + fmtClock(paceSecondsFor(s.key)) + " per question"}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
          <p className="fq-timernote">
            {access !== null && !access.bl
              ? "Comes with Business & Law prep - a per-question clock at your state's real exam pace."
              : timerOn
                ? (pacePack ? pacePack.name : "Tennessee") +
                  "'s pace - " +
                  String(pacePack && pacePack.simQuestions !== null ? pacePack.simQuestions : 50) +
                  " questions in " +
                  String(pacePack && pacePack.minutes !== null ? pacePack.minutes : 140) +
                  " minutes, " +
                  fmtClock(paceSecondsFor(paceKey)) +
                  " a question. Stops while you read explanations."
                : "Put every question on your state's exam clock - pick the state, train its real pace. Stops while you read explanations."}
          </p>
          {access !== null && !access.bl ? (
            <p className="fp-tryhint">
              The free round is a fixed 10-question sample. Business &amp;
              Law prep unlocks all 120 questions with fresh shuffles -
              $79 once, yours for good.
            </p>
          ) : null}
          {showGate ? (
            <div className="fp-gate">
              <p className="fp-gateh">
                {gateSrc === "timer"
                  ? "The exam timer comes with Business & Law prep."
                  : gateSrc === "state"
                    ? "State packs come with Business & Law prep."
                    : "Longer rounds come with Business & Law prep."}
              </p>
              <p className="fp-gated">
                Unlock all 120 questions across 10 domains, fresh shuffles
                every round, the AI tutor on every question, and the
                state-pace exam timer. One payment, no subscription.
                Full Access owners: this is a separate add-on, and it
                stacks onto your account.
              </p>
              <Link className="fp-gatebtn" href="/foremanprep/buy?product=bl">
                Get Business &amp; Law prep - $79
              </Link>
            </div>
          ) : null}
        </div>
        <button className="fq-all" onClick={() => startRound("all")} type="button">
          <span className="fq-sn">All domains</span>
          <span className="fq-sw">A mixed round, the way the exam feels</span>
        </button>
        <div className="fq-pick">
          {BL_DOMAINS.map((d) => (
            <button
              className="fq-sub"
              key={d.key}
              onClick={() => startRound(d.key)}
              type="button"
            >
              <span className="fq-sn">{d.name}</span>
              <span className="fq-sw">12 in the core bank</span>
            </button>
          ))}
        </div>
        <Link
          className="fq-all"
          href="/foremanprep/bl-exam"
          style={{ display: "block", marginTop: "28px", textDecoration: "none", boxSizing: "border-box", width: "100%" }}
        >
          <span className="fq-sn">State Exam Simulator - 1:1</span>
          <span className="fq-sw">
            Pick your state, sit its exam: real question count, real
            clock, real pass bar. All 16 B&amp;L states.
          </span>
        </Link>
        <div style={{ marginTop: "28px" }}>
          <span className="fq-lenlabel">State packs</span>
          <p className="fq-hint" style={{ marginTop: "6px" }}>
            Your state's own numbers - lien deadlines, license
            thresholds, retainage caps.{" "}
            <span className="fq-hint-hl">
              Statute-verified Aug 2026. More states on the way.
            </span>
          </p>
          <div className="fq-pick">
            {BL_PACKS_LIVE.map((p) => (
              <button
                className="fq-sub"
                key={p.key}
                onClick={() => startStateRound(p)}
                type="button"
              >
                <span className="fq-sn">{p.name}</span>
                <span className="fq-sw">
                  {p.questions.length} statute questions - {p.examLine}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!qs) {
    return (
      <div className="fq-wrap fp-blzone">
        <p className="fq-load">Loading your questions...</p>
      </div>
    );
  }

  if (done) {
    const pct = Math.round((correct / qs.length) * 100);
    const passed = pct >= 75;
    return (
      <div className="fq-wrap fp-blzone">
        <div className="fq-done">
          <p className="fq-score">
            {correct}
            <span> / {qs.length}</span>
          </p>
          <p className="fq-msg">
            {pct}% - most states set the Business &amp; Law bar between
            70% and 75%.{" "}
            {passed ? (
              <b>You would have cleared the toughest of them today.</b>
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
          <button
            className="fq-again"
            onClick={() => (activePack ? startStateRound(activePack) : startRound(sel))}
            type="button"
          >
            {access?.bl ? "Go again - fresh shuffle" : "Run the sample again"}
          </button>
          <button className="fq-home" onClick={backToPicker} type="button">
            Pick another domain
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
    <div className="fq-wrap fp-blzone">
      <div className="fq-head">
        <button className="fq-back" onClick={backToPicker} type="button">
          Domains
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

      <span className="fq-chip">
        {(activePack ? activePack.name + " - " : "") +
          (getBlDomain(question.domain)?.name ?? question.domain)}
      </span>
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
            <p className="fq-timeout">
              {"Out of time on this one - that was " +
                (pacePack ? pacePack.name : "your state") +
                "'s exam pace. Read the why, then keep rolling."}
            </p>
          ) : null}
          <p className="fq-explain">{question.explain}</p>
          <p className="fq-cite">Where it lives: {question.cite}</p>
          {tutorOpen ? (
            <div className="fq-tutor">
              <div className="fq-thread">
                {thread.length === 0 && !tutorBusy ? (
                  <div className="fq-msg tut">
                    Ask me anything about this one - why the answer is right,
                    what a term means, or how it plays out on a real job.
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
// END OF FILE - app/foremanprep/bl/page.tsx (v7 - state-pace
// timer select + back button leads home to Business & Law)
// If you can see this comment, the paste was not truncated.
// ============================================================
