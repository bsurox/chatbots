// FILE: app/foremanprep/bl-audio/page.tsx
"use client";
import "../audio/audio.css";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BL_DOMAINS,
  buildBlDemoSet,
  buildBlPracticeSet,
  type BlDomainKey,
  type BlQuestion,
} from "@/lib/foremanprep/blquestions";
import { BL_PACKS_LIVE } from "@/lib/foremanprep/blstates";
import { BL_LESSONS } from "@/lib/foremanprep/bllessons";
import { AUDIO_BASE, audioUrl } from "@/lib/foremanprep/audio-config";

// Business & Law AUDIO STUDY (v1) - the blue sibling of the GC
// audio room, built on the same proven machinery (GC audio v8):
// persistent gesture-blessed audio elements so mobile never
// blocks the auto-chain, a sentinel history entry so the browser
// back arrow gets the confirm modal, and full stop-and-reset on
// leave. Two rooms:
// 1. DRIVE-TIME LESSONS - the ten B&L domain scripts from
//    bllessons v1 (lesson-li.mp3 and friends), with Play all,
//    per-lesson Pause/Resume, and Coming soon fallbacks until
//    Chase runs admin-audio Step 6.
// 2. AUDIO DRILL with a STATE SELECTOR (his spec) - the hands-
//    free question -> think-gap -> answer chain, whose source
//    select offers all domains, each single domain, AND every
//    live state pack - so a Tennessee guy can drill Tennessee's
//    statute numbers on the drive. Pack audio already exists
//    (Step 5 batch). Free tier drills the fixed 10-question
//    sample; Business & Law owners get everything with fresh
//    shuffles. Back pill leads to /bl-prep per his back rule.
// Wears .fp-blzone (audio.css v3 catches the hardcoded oranges).
// Chat widget stays off this page by allowlist doctrine.

type Access = { loggedIn: boolean; bl: boolean };
type Stage = "q" | "think" | "e";

const GAPS = [5, 10, 15];

function shuffleQs(items: BlQuestion[]): BlQuestion[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function BlAudioStudyPage() {
  const router = useRouter();
  const [access, setAccess] = useState<Access | null>(null);
  const [confirmExit, setConfirmExit] = useState(false);

  // ----- lessons -----
  const [lessonPlaying, setLessonPlaying] = useState<string | null>(null);
  const [lessonDead, setLessonDead] = useState<Record<string, boolean>>({});
  const [playAll, setPlayAll] = useState(false);
  const [lessonPaused, setLessonPaused] = useState(false);
  const lessonAudio = useRef<HTMLAudioElement | null>(null);
  const playAllRef = useRef(false);

  // ----- drill -----
  const [source, setSource] = useState<string>("all");
  const [gap, setGap] = useState(10);
  const [drillQs, setDrillQs] = useState<BlQuestion[] | null>(null);
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
        if (data) setAccess({ loggedIn: Boolean(data.loggedIn), bl: Boolean(data.bl) });
        else setAccess({ loggedIn: false, bl: false });
      })
      .catch(() => setAccess({ loggedIn: false, bl: false }));
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

  // Audio never outlives the page - and never survives it either:
  // elements are discarded, not just paused, so nothing resumes.
  useEffect(() => {
    return () => {
      clearTimers();
      if (lessonAudio.current) {
        lessonAudio.current.pause();
        lessonAudio.current = null;
      }
      if (drillAudio.current) {
        drillAudio.current.pause();
        drillAudio.current = null;
      }
    };
  }, []);

  // Live-audio test shared by both back doors. A finished drill
  // (results screen) has nothing left to lose - no confirm.
  const activeRef = useRef(false);
  const audioActive =
    lessonPlaying !== null || playAll || (drillQs !== null && !drillDone);
  useEffect(() => {
    activeRef.current = audioActive;
  }, [audioActive]);

  // Browser back arrow: a sentinel history entry absorbs the first
  // back press. Mid-listen, we re-plant the sentinel and open the
  // confirm modal; idle, the handler removes itself and passes the
  // navigation through untouched.
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const onPop = () => {
      if (activeRef.current) {
        window.history.pushState(null, "", window.location.href);
        setConfirmExit(true);
      } else {
        window.removeEventListener("popstate", onPop);
        window.history.back();
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // ----- lesson playback -----
  // One persistent element for lessons too, created inside the tap
  // that starts playback, so the Play all chain never gets blocked
  // by mobile autoplay rules between lessons.
  function playLessonAt(i: number) {
    if (i >= BL_LESSONS.length) {
      setLessonPlaying(null);
      setPlayAll(false);
      playAllRef.current = false;
      return;
    }
    const l = BL_LESSONS[i];
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
    const idx = BL_LESSONS.findIndex((l) => l.key === key);
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
  function buildDrillSet(): BlQuestion[] {
    if (!access?.bl) {
      // Free tier: always the same fixed sample - same doctrine as
      // the practice room.
      return buildBlDemoSet();
    }
    if (source.startsWith("pack:")) {
      const pack = BL_PACKS_LIVE.find((p) => "pack:" + p.key === source) ?? null;
      return pack ? shuffleQs(pack.questions) : [];
    }
    return buildBlPracticeSet(
      source === "all" ? "all" : (source as BlDomainKey),
      Number.MAX_SAFE_INTEGER
    );
  }

  function startDrill() {
    stopEverything();
    setDrillDone(false);
    const qs = buildDrillSet();
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

  function playStage(qs: BlQuestion[], i: number, st: Stage) {
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

  function startThink(qs: BlQuestion[], i: number) {
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

  function queueNext(qs: BlQuestion[], i: number) {
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

  function backToHome() {
    if (audioActive) {
      setConfirmExit(true);
      return;
    }
    stopDrill();
    router.push("/foremanprep/bl-prep");
  }

  function confirmLeave() {
    stopDrill();
    setConfirmExit(false);
    router.push("/foremanprep/bl-prep");
  }

  const q = drillQs ? drillQs[dIdx] : null;

  return (
    <div className="fp-wrap fp-blzone">
      <div className="fp-top">
        <button className="fp-backpill" onClick={backToHome} type="button">
          Back to{" "}
          <span className="fp-wordmark">
            Business &amp; <span>Law</span>
          </span>
        </button>
      </div>

      {confirmExit ? (
        <div className="fa-overlay">
          <div className="fa-modal">
            <p className="fa-mtitle">Leave audio study?</p>
            <p className="fa-mtext">
              Going back stops and resets anything you are listening to -
              lessons, Play all, and the drill start over next time.
            </p>
            <div className="fa-macts">
              <button
                className="fa-mcancel"
                onClick={() => setConfirmExit(false)}
                type="button"
              >
                Keep listening
              </button>
              <button className="fa-myes" onClick={confirmLeave} type="button">
                Leave and reset
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <p className="fa-h">Business &amp; Law audio study</p>
      <p className="fa-sub">
        Study with your ears - on the drive, on the treadmill, on the tailgate
        at lunch. Keep the screen on and unlocked while audio plays.
      </p>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px", marginTop: "26px" }}>
        <p className="fa-sec" style={{ margin: 0 }}>Drive-time lessons</p>
        {access !== null && access.bl ? (
          <div style={{ display: "flex", gap: "6px", transform: "translateY(-7px)" }}>
            {playAll ? (
              <>
                <button className="fa-lbtn playing" onClick={pauseResumeLesson} type="button">
                  {lessonPaused ? "Resume" : "Pause"}
                </button>
                <button className="fa-lbtn" onClick={togglePlayAll} type="button">
                  Stop
                </button>
              </>
            ) : (
              <button className="fa-lbtn" onClick={togglePlayAll} type="button">
                Play all
              </button>
            )}
          </div>
        ) : null}
      </div>
      <p className="fa-secsub">
        Ten spoken recaps, one per Business &amp; Law domain - every fact
        pulled straight from the audited question bank.
      </p>
      {access !== null && !access.bl ? (
        <div className="fp-gate">
          <p className="fp-gateh">Drive-time lessons come with Business &amp; Law prep.</p>
          <p className="fp-gated">
            Unlock all ten narrated lessons, every question and explanation
            with audio, the state packs, and the exam simulator - one
            payment, no subscription.
          </p>
          <Link className="fp-gatebtn" href="/foremanprep/buy?product=bl">
            Get Business &amp; Law prep - $79
          </Link>
        </div>
      ) : (
        <div className="fa-list">
          {BL_LESSONS.map((l) => (
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
        silence, then hear the answer and why. Pick a domain - or pick YOUR
        state to drill its statute pack.
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
            <span className="fa-label">What to drill</span>
            <select
              className="fa-sel"
              onChange={(e) => setSource(e.target.value)}
              value={source}
            >
              <option value="all">All domains - the way the exam mixes them</option>
              <optgroup label="One domain">
                {BL_DOMAINS.map((d) => (
                  <option key={d.key} value={d.key}>
                    {d.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Your state's statute pack">
                {BL_PACKS_LIVE.map((p) => (
                  <option key={p.key} value={"pack:" + p.key}>
                    {p.name} - {p.questions.length} statute questions
                  </option>
                ))}
              </optgroup>
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
            {access !== null && !access.bl ? (
              <p className="fa-hint">
                Free accounts drill the fixed 10-question sample. Business &amp;
                Law prep drills every domain and every state pack with fresh
                shuffles - $79 once.
              </p>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

// ============================================================
// END OF FILE - app/foremanprep/bl-audio/page.tsx (v1 - B&L
// audio study: ten lessons + hands-free drill w/ state packs)
// If you can see this comment, the paste was not truncated.
// ============================================================
