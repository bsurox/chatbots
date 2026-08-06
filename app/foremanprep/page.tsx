// FILE: app/foremanprep/page.tsx
"use client";
import Link from "next/link";
import { useRef, useState } from "react";

// ForemanPrep landing page v2 (Week 1 close). Now the front door
// to a working product: the hero offers real entry into free
// practice and the exam simulator, and still captures launch-list
// emails through the existing support pipe. The paid gate arrives
// on paywall day - today the whole thing is navigable end to end.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const STATS = [
  { n: "115", l: "exam questions" },
  { n: "5.5 hrs", l: "on the clock" },
  { n: "18", l: "states, one exam" },
  { n: "70%", l: "needed to pass" },
];

const FEATURES = [
  {
    n: "AI tutor, on call 24/7",
    d: "Miss a question and ask why. The tutor explains it straight and points you to the exact book and section the answer lives in.",
  },
  {
    n: "900+ practice questions",
    d: "Written to the official 12-subject exam outline and weighted the way the real test is weighted.",
  },
  {
    n: "Full exam simulator",
    d: "115 questions on a 5.5-hour clock. Flag questions, review your misses, and train against the real 81-to-pass bar.",
  },
  {
    n: "Audio lessons",
    d: "Every subject as audio. Study on the drive to the site, not at a desk.",
  },
  {
    n: "Readiness score",
    d: "See your weak subjects and exactly what to drill next. Walk in on test day already knowing you're ready.",
  },
  {
    n: "Pass guarantee",
    d: "Finish the course and fail the real exam? Full refund. That simple.",
  },
];

const PRICES = [
  { l: "Live prep classes", v: "$1,095 - $1,490" },
  { l: "Self-study courses", v: "$349 - $695" },
  { l: "Official practice exams", v: "$99 - $299" },
];

export default function ForemanPrepPage() {
  const formRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [phase, setPhase] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  async function join() {
    const clean = email.trim();
    if (!EMAIL_RE.test(clean)) {
      setPhase("error");
      setErrorMsg("Please enter a valid email.");
      return;
    }
    setPhase("sending");
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "ForemanPrep Launch List",
          email: clean,
          comment:
            "FOREMANPREP LAUNCH LIST signup from the foremanprep.com landing page.",
        }),
      });
      if (res.ok) {
        setPhase("done");
        return;
      }
      const data = await res.json().catch(() => null);
      setPhase("error");
      setErrorMsg(data?.error ?? "Could not sign you up - please try again.");
    } catch {
      setPhase("error");
      setErrorMsg("Could not sign you up - please try again.");
    }
  }

  return (
    <div className="fp-wrap">
      <div className="fp-top">
        <div className="fp-brand">
          Foreman<span>Prep</span>
        </div>
        <div className="fp-chip">Launching this month</div>
      </div>

      <div className="fp-hero">
        <div className="fp-badge">NASCLA Commercial General Building Contractor Exam</div>
        <h1 className="fp-h1">
          Pass your contractor exam. <span>First try.</span>
        </h1>
        <p className="fp-sub">
          The AI tutor that gets working tradesmen through the NASCLA exam -
          unlimited practice, straight answers, and a study plan that fits
          around a job site, not a classroom.
        </p>
        <button className="fp-cta" onClick={scrollToForm} type="button">
          Get the early-bird price
        </button>
        <p className="fp-note">
          <b>$99 early bird</b> at launch - regular $149. Prep courses charge
          $349 to $1,490 for less.
        </p>
        <div className="fp-try">
          <Link className="fp-try-btn" href="/foremanprep/practice">
            Start free practice
          </Link>
          <Link className="fp-try-btn ghost" href="/foremanprep/exam">
            Try the exam simulator
          </Link>
        </div>
        <p className="fp-tryhint">Free to try right now - no sign-up needed.</p>
      </div>

      <div className="fp-stats">
        {STATS.map((s) => (
          <div className="fp-stat" key={s.l}>
            <div className="fp-sn">{s.n}</div>
            <div className="fp-sl">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="fp-strip">
        <p className="fp-st">The exam is open book. That's the trap.</p>
        <p className="fp-sd">
          You can bring 24 approved reference books into the test - thousands
          of pages, with under 3 minutes per question. Nobody fails because
          they can't build. They fail because they can't find the answer fast
          enough. ForemanPrep trains exactly that: every practice question
          teaches you which book, which section, and how to get there fast.
        </p>
      </div>

      <h2 className="fp-h2">What you get</h2>
      <div className="fp-grid">
        {FEATURES.map((f) => (
          <div className="fp-card" key={f.n}>
            <p className="fp-cn">
              <span>+</span>
              {f.n}
            </p>
            <p className="fp-cd">{f.d}</p>
          </div>
        ))}
      </div>

      <h2 className="fp-h2">What prep costs today</h2>
      <div className="fp-price">
        {PRICES.map((p) => (
          <div className="fp-prow" key={p.l}>
            <div className="fp-pl">{p.l}</div>
            <div className="fp-pv">{p.v}</div>
          </div>
        ))}
        <div className="fp-prow fp-ours">
          <div className="fp-pl">ForemanPrep - tutor, questions, simulator, audio</div>
          <div className="fp-pv">
            <span className="fp-strike">$149</span>$99 early bird
          </div>
        </div>
      </div>

      <div className="fp-signup" ref={formRef}>
        <p className="fp-fh">Lock in the $99 early-bird price</p>
        <p className="fp-fs">
          ForemanPrep launches this month. Drop your email and you'll get the
          early-bird link the day the doors open.
        </p>
        {phase === "done" ? (
          <p className="fp-ok">You're on the list. See you at launch.</p>
        ) : (
          <div className="fp-row">
            <input
              className="fp-in"
              disabled={phase === "sending"}
              inputMode="email"
              onChange={(e) => {
                setEmail(e.target.value);
                if (phase === "error") setPhase("idle");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") join();
              }}
              placeholder="you@example.com"
              type="email"
              value={email}
            />
            <button
              className="fp-go"
              disabled={phase === "sending"}
              onClick={join}
              type="button"
            >
              {phase === "sending" ? "Saving..." : "Count me in"}
            </button>
          </div>
        )}
        {phase === "error" ? <p className="fp-err">{errorMsg}</p> : null}
        <p className="fp-fine">
          One email at launch. No spam, ever.
        </p>
      </div>

      <div className="fp-foot">
        <div className="fp-links">
          <Link className="fp-link" href="/terms">
            Terms
          </Link>
          <Link className="fp-link" href="/privacy">
            Privacy
          </Link>
        </div>
        <p className="fp-legal">
          ForemanPrep is a product of AskEvo LLC, Boise, Idaho. Not affiliated
          with or endorsed by NASCLA or PSI. NASCLA is a registered trademark
          of the National Association of State Contractors Licensing Agencies.
          Questions: support@askevo.ai
        </p>
      </div>
    </div>
  );
}

// ============================================================
// END OF FILE - app/foremanprep/page.tsx (v2 - live entry points)
// If you can see this comment, the paste was not truncated.
// ============================================================
