// FILE: app/foremanprep/audio/page.tsx
"use client";
import "./audio.css";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  buildDemoSet,
  buildPracticeSet,
  DOMAINS,
  type DomainKey,
  type ForemanQuestion,
} from "@/lib/foremanprep/questions";
import { LESSONS } from "@/lib/foremanprep/lessons";
import { AUDIO_BASE, audioUrl } from "@/lib/foremanprep/audio-config";

// ForemanPrep Audio study (v5) - the hands-free room. v5: the
// Play all button rides a touch higher - the header row aligns
// flex-start instead of center, so the pill tops out level with
// the "Drive-time lessons" heading and clears the subtext below
// it. v4: lessons
// can PAUSE, not just stop - a Pause/Resume pill appears beside
// Stop on the playing lesson row and beside Play all while the
// chain runs. Pausing holds the spot in the current lesson;
// resuming picks up mid-sentence; the chain still rolls on after. v3 adds
// Play all: one tap at the top of the lesson list chains all
// twelve lessons back to back - each one ends, the next begins -
// through the same persistent gesture-blessed element, skipping
// any missing file. Tapping a single lesson or Stop breaks the
// chain. v2 fix: the
// drill runs through ONE persistent audio element created inside
// the Start tap. Mobile browsers block new players that start
// without a fresh gesture, which froze the auto-chain after the
// first question; reusing the gesture-blessed element keeps the
// question -> think -> answer -> next chain rolling untouched. Two things
// live here. Drive-time lessons: twelve narrated subject recaps
// (Full Access only), one tap to play. Audio drill: a continuous
// no-hands quiz - Adam reads the question, a think-gap of silence
// runs, then the answer and explanation play, then the next
// question rolls, until the round is done. Free accounts drill on
// the fixed 10-question sample (same doctrine as practice); Full
// Access drills any subject with fresh shuffles. Nothing here
// records answers - it is studying for ears, built so a driver
// never needs to touch the screen after Start.

type Access = { loggedIn: boolean; paid: boolean };
type Stage = "q" | "think" | "e";

const GAPS = [5, 10, 15];

export default function AudioStudyPage() {
  const [access, setAccess] = useState<Access | null>(null);

  // ----- lessons -----
  const [lessonPlaying, setLessonPlaying] = useState<string | null>(null);
  const [lessonDead, setLessonDead] = useState<Record<string, boolean>>({});
  const [playAll, setPlayAll] = useState(false);
  const [lessonPaused, setLessonPaused] = useState(false);
  const lessonAudio = useRef<HTMLAudioElement | null>(null);
  const playAllRef = useRef(false);

  // ----- drill -----
  const [subject, setSubject] = useState<DomainKey | "all">("all");
  const [gap, setGap] = useState(10);
  const [drillQs, setDrillQs] = useState<ForemanQuestion[] | null>(null);
  const [dIdx, setDIdx] = useState(0);
  const [stage, setStage] = useState<Stage>("q");
  const [thinkLeft, setThinkLeft] = useState(0);
  const [paused, setPaused] = useState(false);
  const [drillDone, setDrillDone] = useState(false);
  const drillAudio = useRef<HTMLAudioElement | null>(null);
  const thinkTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const advTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    fetch("/foremanprep/api/access")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setAccess({ loggedIn: Boolean(data.loggedIn), paid: Boolean(data.paid) });
        else setAccess({ loggedIn: false, paid: false });
      })
      .catch(() => setAccess({ loggedIn: false, paid: false }));
  }, []);

  function clearTimers() {
    if (thinkTimer.current) {
      clearInterval(thinkTimer.current);
      thinkTimer.current = null;
    }
    if (advTimer.current) {
      clearTimeout(advTimer.current);
      advTimer.current = null;
    }
  }

  function stopEverything() {
    clearTimers();
    if (lessonAudio.current) {
      lessonAudio.current.pause();
      lessonAudio.current = null;
    }
    if (drillAudio.current) {
      drillAudio.current.pause();
      drillAudio.current = null;
    }
    setLessonPlaying(null);
    setPlayAll(false);
    setLessonPaused(false);
    playAllRef.current = false;
  }

  // Audio never outlives the page.
  useEffect(() => {
    return () => {
      clearTimers();
      if (lessonAudio.current) lessonAudio.current.pause();
      if (drillAudio.current) drillAudio.current.pause();
    };
  }, []);

  // ----- lesson playback -----
  // One persistent element for lessons too, created inside the tap
  // that starts playback, so the Play all chain never gets blocked
  // by mobile autoplay rules between lessons.
  function playLessonAt(i: number) {
    if (i >= LESSONS.length) {
      setLessonPlaying(null);
      setPlayAll(false);
      playAllRef.current = false;
      return;
    }
    const l = LESSONS[i];
    if (!lessonAudio.current) lessonAudio.current = new Audio();
    const a = lessonAudio.current;
    const roll = () => {
      if (playAllRef.current) playLessonAt(i + 1);
      else setLessonPlaying(null);
    };
    a.onended = roll;
    a.onerror = () => {
      setLessonDead((d) => ({ ...d, [l.key]: true }));
      roll();
    };
    a.src = `${AUDIO_BASE}/foremanprep-audio/lesson-${l.key}.mp3`;
    a.play().catch(() => {
      setLessonDead((d) => ({ ...d, [l.key]: true }));
      roll();
    });
    setLessonPlaying(l.key);
    setLessonPaused(false);
  }

  function pauseResumeLesson() {
    const a = lessonAudio.current;
    if (!a || lessonPlaying === null) return;
    if (lessonPaused) {
      a.play().catch(() => {});
      setLessonPaused(false);
    } else {
      a.pause();
      setLessonPaused(true);
    }
  }

  function toggleLesson(key: string) {
    if (!AUDIO_BASE) return;
    if (lessonPlaying === key) {
      stopEverything();
      return;
    }
    stopEverything();
    setDrillQs(null);
    setDrillDone(false);
    const idx = LESSONS.findIndex((l) => l.key === key);
    if (idx < 0) return;
    playLessonAt(idx);
  }

  function togglePlayAll() {
    if (!AUDIO_BASE) return;
    if (playAll) {
      stopEverything();
      return;
    }
    stopEverything();
    setDrillQs(null);
    setDrillDone(false);
    setPlayAll(true);
    playAllRef.current = true;
    playLessonAt(0);
  }

  // ----- drill machine -----
  function startDrill() {
    stopEverything();
    setDrillDone(false);
    const qs = access?.paid
      ? buildPracticeSet(subject, Number.MAX_SAFE_INTEGER)
      : buildDemoSet();
    if (qs.length === 0) return;
    // One persistent element, created inside the user's tap - the
    // whole drill reuses it so phones never block the auto-chain.
    drillAudio.current = new Audio();
    setDrillQs(qs);
    setDIdx(0);
    setPaused(false);
    pausedRef.current = false;
    playStage(qs, 0, "q");
  }

  function playStage(qs: ForemanQuestion[], i: number, st: Stage) {
    clearTimers();
    setDIdx(i);
    setStage(st);
    if (st === "think") {
      startThink(qs, i);
      return;
    }
    const a = drillAudio.current;
    if (!a) return;
    a.onended = () => {
      if (st === "q") playStage(qs, i, "think");
      else queueNext(qs, i);
    };
    a.onerror = () => {
      // Missing file: never stall a driver - roll forward.
      if (st === "q") playStage(qs, i, "think");
      else queueNext(qs, i);
    };
    a.src = audioUrl(st, qs[i].id);
    a.play().catch(() => queueNext(qs, i));
  }

  function startThink(qs: ForemanQuestion[], i: number) {
    setThinkLeft(gap);
    let left = gap;
    thinkTimer.current = setInterval(() => {
      if (pausedRef.current) return;
      left -= 1;
      setThinkLeft(left);
      if (left <= 0) {
        clearTimers();
        playStage(qs, i, "e");
      }
    }, 1000);
  }

  function queueNext(qs: ForemanQuestion[], i: number) {
    if (i + 1 >= qs.length) {
      setDrillQs(null);
      setDrillDone(true);
      return;
    }
    advTimer.current = setTimeout(() => playStage(qs, i + 1, "q"), 1500);
  }

  function togglePause() {
    if (!drillQs) return;
    const next = !paused;
    setPaused(next);
    pausedRef.current = next;
    if (stage === "q" || stage === "e") {
      if (next) drillAudio.current?.pause();
      else drillAudio.current?.play().catch(() => {});
    }
  }

  function skipQuestion() {
    if (!drillQs) return;
    if (drillAudio.current) drillAudio.current.pause();
    setPaused(false);
    pausedRef.current = false;
    clearTimers();
    queueNext(drillQs, dIdx);
  }

  function stopDrill() {
    stopEverything();
    setDrillQs(null);
    setDrillDone(false);
    setPaused(false);
    pausedRef.current = false;
  }

  const q = drillQs ? drillQs[dIdx] : null;

  return (
    <div className="fp-wrap">
      <div className="fp-top">
        <Link className="fp-backpill" href="/foremanprep">
          Back to{" "}
          <span className="fp-wordmark">
            Foreman<span>Prep</span>
          </span>
        </Link>
      </div>

      <p className="fa-h">Audio study</p>
      <p className="fa-sub">
        Study with your ears - on the drive, on the treadmill, on the tailgate
        at lunch. Keep the screen on and unlocked while audio plays.
      </p>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px", marginTop: "26px" }}>
        <p className="fa-sec" style={{ margin: 0 }}>Drive-time lessons</p>
        {access !== null && access.paid ? (
          playAll ? (
            <div style={{ display: "flex", gap: "6px" }}>
              <button className="fa-lbtn playing" onClick={pauseResumeLesson} type="button">
                {lessonPaused ? "Resume" : "Pause"}
              </button>
              <button className="fa-lbtn" onClick={togglePlayAll} type="button">
                Stop
              </button>
            </div>
          ) : (
            <button className="fa-lbtn" onClick={togglePlayAll} type="button">
              Play all
            </button>
          )
        ) : null}
      </div>
      <p className="fa-secsub">
        Twelve spoken recaps, one per exam subject - every fact pulled straight
        from the question bank.
      </p>
      {access !== null && !access.paid ? (
        <div className="fp-gate">
          <p className="fp-gateh">Drive-time lessons are a Full Access feature.</p>
          <p className="fp-gated">
            Unlock all twelve narrated lessons, every practice question with
            audio, and the full exam simulator - one payment, no subscription.
          </p>
          <Link className="fp-gatebtn" href="/foremanprep/buy">
            Get Full Access - $99 early bird
          </Link>
        </div>
      ) : (
        <div className="fa-list">
          {LESSONS.map((l) => (
            <div className="fa-lrow" key={l.key}>
              <div>
                <span className="fa-lname">{l.title}</span>
                <span className="fa-lmeta">about {l.minutes} min</span>
              </div>
              {lessonDead[l.key] ? (
                <button className="fa-lbtn" disabled type="button">
                  Coming soon
                </button>
              ) : lessonPlaying === l.key ? (
                <div style={{ display: "flex", gap: "6px" }}>
                  <button className="fa-lbtn playing" onClick={pauseResumeLesson} type="button">
                    {lessonPaused ? "Resume" : "Pause"}
                  </button>
                  <button className="fa-lbtn" onClick={() => toggleLesson(l.key)} type="button">
                    Stop
                  </button>
                </div>
              ) : (
                <button className="fa-lbtn" onClick={() => toggleLesson(l.key)} type="button">
                  Play
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <p className="fa-sec">Audio drill</p>
      <p className="fa-secsub">
        Hands-free quiz: hear the question, answer in your head during the
        silence, then hear the answer and why. Rolls question to question until
        the round is done.
      </p>
      <div className="fa-drillbox">
        {drillDone ? <p className="fa-done">Drill complete. Nice work.</p> : null}
        {drillQs && q ? (
          <div className="fa-run">
            <p className="fa-count">
              Question {dIdx + 1} of {drillQs.length}
            </p>
            <p className={stage === "think" ? "fa-stage think" : "fa-stage"}>
              {stage === "q"
                ? paused
                  ? "Paused"
                  : "Reading the question..."
                : stage === "think"
                  ? `Your answer? ${thinkLeft}`
                  : paused
                    ? "Paused"
                    : "The answer..."}
            </p>
            <p className="fa-qpeek">{q.q}</p>
            <div className="fa-controls">
              <button className="fa-ctl" onClick={togglePause} type="button">
                {paused ? "Resume" : "Pause"}
              </button>
              <button className="fa-ctl" onClick={skipQuestion} type="button">
                Skip
              </button>
              <button className="fa-ctl stop" onClick={stopDrill} type="button">
                Stop
              </button>
            </div>
          </div>
        ) : (
          <>
            <span className="fa-label">Subject</span>
            <select
              className="fa-sel"
              onChange={(e) => setSubject(e.target.value as DomainKey | "all")}
              value={subject}
            >
              <option value="all">All subjects - the way the exam mixes them</option>
              {DOMAINS.map((d) => (
                <option key={d.key} value={d.key}>
                  {d.name}
                </option>
              ))}
            </select>
            <span className="fa-label">Think time between question and answer</span>
            <div className="fa-gapseg">
              {GAPS.map((g) => (
                <button
                  className={gap === g ? "on" : ""}
                  key={g}
                  onClick={() => setGap(g)}
                  type="button"
                >
                  {g} seconds
                </button>
              ))}
            </div>
            <button className="fa-start" onClick={startDrill} type="button">
              Start the drill
            </button>
            {access !== null && !access.paid ? (
              <p className="fa-hint">
                Free accounts drill the fixed 10-question sample. Full Access
                drills every subject with fresh shuffles each round.
              </p>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

// -----------------------------------------------------------
// END OF FILE - app/foremanprep/audio/page.tsx (v5 - Play all
// button raised off the subtext)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
