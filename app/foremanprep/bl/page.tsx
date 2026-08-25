// FILE: app/foremanprep/bl/page.tsx
"use client";
import "../practice/practice.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BL_DOMAINS,
  buildBlDemoSet,
  buildBlPracticeSet,
  getBlDomain,
  type BlDomainKey,
  type BlQuestion,
} from "@/lib/foremanprep/blquestions";

// Business & Law practice room (v1). The second exam most NASCLA
// states require gets the same player the trade exam has: pick a
// domain or the whole mix, letter-chip choices, instant reveal
// with the why and the citation, recap and score at the end,
// rounds saved to the account. Free tier = one fixed 10-question
// sample (same leak-proof doctrine as the GC demo set); the $79
// product unlocks all 120 with fresh shuffles. Wears
// practice.css wholesale - same fq-/fp- dress, zero new styles.
// DELIBERATELY absent in v1 (phase 2, after launch): the exam
// timer (B&L paces vary by state), the Listen pills (no B&L
// audio recorded yet), and the AI tutor (its API resolves GC ids
// only). The Report door stays - the support pipe is generic.
// Gating rides the access API's new bl flag: Full Access owners
// WITHOUT B&L see the sample and the $79 gate exactly like free
// users - that is the upsell working as designed.

type Len = 10 | 25 | "all";
type Sel = BlDomainKey | "all";

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

export default function BlPracticePage() {
  const router = useRouter();
  const [phase, setPhase] = useState<"pick" | "quiz">("pick");
  const [sel, setSel] = useState<Sel>("all");
  const [roundLen, setRoundLen] = useState<Len | null>(null);
  const [lenErr, setLenErr] = useState(false);
  const [access, setAccess] = useState<{ loggedIn: boolean; bl: boolean } | null>(null);
  const [showGate, setShowGate] = useState(false);

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
      // Free tier: a locked length can never LOOK selected. Tapping
      // 25/Full snaps the highlight back to 10 (the only legal
      // choice) and shows the gate.
      setRoundLen(10);
      setShowGate(true);
      return;
    }
    setRoundLen(l);
    setLenErr(false);
    setShowGate(false);
  }

  const [qs, setQs] = useState<BlQuestion[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [recap, setRecap] = useState<RecapRow[]>([]);
  const [answers, setAnswers] = useState<PickedAnswer[]>([]);
  const [done, setDone] = useState(false);
  const [saved, setSaved] = useState(false);

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
    setQs(set);
    setIdx(0);
    setPicked(null);
    setCorrect(0);
    setRecap([]);
    setAnswers([]);
    setDone(false);
    setSaved(false);
    resetReport();
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
        domain: sel === "all" ? "bl" : "bl-" + sel,
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
    resetReport();
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
          {access !== null && !access.bl ? (
            <p className="fp-tryhint">
              The free round is a fixed 10-question sample. Business &amp;
              Law prep unlocks all 120 questions with fresh shuffles -
              $79 once, yours for good.
            </p>
          ) : null}
          {showGate ? (
            <div className="fp-gate">
              <p className="fp-gateh">Longer rounds come with Business &amp; Law prep.</p>
              <p className="fp-gated">
                Unlock all 120 questions across 10 domains - contracts,
                liens, payroll, insurance, estimating math, and the rest
                of the Business &amp; Law body - with fresh shuffles every
                round. One payment, no subscription. Full Access owners:
                this is a separate add-on, and it stacks onto your
                account.
              </p>
              <Link className="fp-gatebtn" href="/foremanprep/buy">
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
          <button className="fq-again" onClick={() => startRound(sel)} type="button">
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
    <div className="fq-wrap">
      <div className="fq-head">
        <button className="fq-back" onClick={backToPicker} type="button">
          Domains
        </button>
        <span className="fq-prog">
          Question {idx + 1} / {qs.length}
        </span>
      </div>

      <span className="fq-chip">{getBlDomain(question.domain)?.name ?? question.domain}</span>
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
          <p className="fq-explain">{question.explain}</p>
          <p className="fq-cite">Where it lives: {question.cite}</p>
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
// END OF FILE - app/foremanprep/bl/page.tsx (v1 - B&L practice
// room: 10 domains, fixed free sample, $79 gate)
// If you can see this comment, the paste was not truncated.
// ============================================================
