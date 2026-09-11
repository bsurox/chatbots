// FILE: app/haullegal/start/page.tsx
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HL_PHASES, HL_STEPS, type HlStep } from "@/lib/haullegal/steps";

// HaulLegal walkthrough room (v2 - TIGHTER PREVIEW, his call: locked
// steps now show ONLY their title and a Locked tag - no summary, no
// fee chip - so the free view is a table of contents, not the
// content. The four "Before you apply" steps stay fully open as the
// free sample; the gate card spells out what the paid 19 contain.)
// v1 notes: the product itself. Renders the
// 23 verified steps in their four phases as a checklist the owner
// works through on his phone: number, title, plain summary, the
// official fee chip and the typical time, and an expandable detail
// block with what to do first, the FMCSA-flagged mistakes, the
// citation, and a button to the official page.
// FREE vs PAID: the four "Before you apply" steps are open to
// everyone (that is the free sample, like ForemanPrep's fixed
// 10-question round). The other 19 show their title and one-line
// summary as a table of contents but keep their details, links and
// check-off locked until the account owns the walkthrough. A gate
// card sits at the first locked step and sends visitors to
// /haullegal/buy. Access comes from /haullegal/api/access (ships
// with the money loop); until it exists the catch swallows the 404
// and everyone is a visitor.
// PROGRESS lives in localStorage (key hl-progress) for now - v2
// syncs it to the account for paid users. All storage reads happen
// in useEffect (hydration rule); no Date.now()/Math.random() in
// render (Next 16 prerender rule).
// External official links use real anchors with rel=noopener -
// the standing no-anchor exception for off-site government pages.

const STORE_KEY = "hl-progress";

function loadDone(): string[] {
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function saveDone(ids: string[]) {
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(ids));
  } catch {
    // storage unavailable - progress simply does not persist
  }
}

function titleOf(id: string): string {
  return HL_STEPS.find((s) => s.id === id)?.title ?? id;
}

export default function HaulLegalStartPage() {
  const [paid, setPaid] = useState(false);
  const [done, setDone] = useState<string[]>([]);
  const [open, setOpen] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setDone(loadDone());
    setLoaded(true);
    fetch("/haullegal/api/access")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.paid) setPaid(true);
      })
      .catch(() => {});
  }, []);

  function toggleDone(id: string) {
    setDone((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      saveDone(next);
      return next;
    });
  }

  function toggleOpen(id: string) {
    setOpen((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function resetAll() {
    if (!window.confirm("Clear every check mark and start the walkthrough over?")) return;
    setDone([]);
    saveDone([]);
  }

  const total = HL_STEPS.length;
  const doneCount = HL_STEPS.filter((s) => done.includes(s.id)).length;
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;
  const firstLockedId = paid ? null : HL_STEPS.find((s) => !s.free)?.id ?? null;
  let number = 0;

  return (
    <div className="fp-wrap">
      <div className="fp-top">
        <div className="fp-brand">
          Haul<span>Legal</span>
        </div>
        <Link className="fp-backpill" href="/haullegal">
          Back to{" "}
          <span className="fp-wordmark">
            Haul<span>Legal</span>
          </span>
        </Link>
      </div>

      <div className="fp-badge">The walkthrough - {total} steps, in order</div>
      <h1 className="fp-h1" style={{ fontSize: "30px" }}>
        Get legal, <span>one step at a time.</span>
      </h1>
      <p className="fp-sub">
        Work down the list. Every step shows the real government fee, where
        the click happens, what you need first, and the mistakes FMCSA warns
        about. Check each one off as you go - your progress is saved on this
        device.
      </p>

      <div className="hl-prog">
        <div className="hl-progrow">
          <span>
            <b>{loaded ? doneCount : 0}</b> of {total} done
          </span>
          <span>{loaded ? pct : 0}%</span>
        </div>
        <div className="hl-bar">
          <div className="hl-fill" style={{ width: `${loaded ? pct : 0}%` }} />
        </div>
      </div>

      {HL_PHASES.map((phase) => (
        <div key={phase.id}>
          <p className="hl-phase">{phase.title}</p>
          <p className="fp-cd" style={{ margin: "0 0 12px" }}>
            {phase.blurb}
          </p>
          <div className="hl-steps">
            {HL_STEPS.filter((s) => s.phase === phase.id).map((step: HlStep) => {
              number += 1;
              const unlocked = step.free || paid;
              const isDone = done.includes(step.id);
              const isOpen = open.includes(step.id);
              const cls = "hl-step" + (isDone ? " done" : "") + (unlocked ? "" : " locked");
              return (
                <div key={step.id}>
                  {!unlocked && step.id === firstLockedId ? (
                    <div className="fp-gate" style={{ margin: "0 0 10px" }}>
                      <p className="fp-gateh">The next 19 steps are the walkthrough.</p>
                      <p className="fp-gated">
                        For every one of them: exactly where the click happens and the
                        official link, the real fee, what has to be done first, the
                        mistakes FMCSA itself warns about, the rule it comes from, and a
                        check-off that saves your place. Federal registration on Motus,
                        taxes and plates, and staying legal on the road. One payment,
                        $249, plus a free first month of Stay Legal reminders.
                      </p>
                      <Link className="fp-gatebtn" href="/haullegal/buy">
                        Get the full walkthrough - $249
                      </Link>
                    </div>
                  ) : null}
                  <div className={cls}>
                    <div className="hl-num">{isDone ? "\u2713" : number}</div>
                    <p className="hl-steph">{step.title}</p>
                    {unlocked ? <p className="hl-stepd">{step.summary}</p> : null}
                    <div className="hl-meta">
                      {unlocked ? <span className="hl-fee">{step.fee}</span> : null}
                      {unlocked ? <span className="hl-tag">{step.time}</span> : <span className="hl-tag">Locked - part of the walkthrough</span>}
                    </div>
                    {unlocked ? (
                      <>
                        <button className="hl-more" onClick={() => toggleOpen(step.id)} type="button">
                          {isOpen ? "Hide details" : "Show details"}
                        </button>
                        {isOpen ? (
                          <div className="hl-detail">
                            <p className="hl-label">Where</p>
                            <p className="hl-stepd">{step.where}</p>
                            {step.needs.length > 0 ? (
                              <>
                                <p className="hl-label">Do first</p>
                                <ul className="hl-list">
                                  {step.needs.map((n) => (
                                    <li key={n}>
                                      {titleOf(n)}
                                      {done.includes(n) ? " (done)" : ""}
                                    </li>
                                  ))}
                                </ul>
                              </>
                            ) : null}
                            <p className="hl-label">Watch out</p>
                            {step.gotchas.map((g) => (
                              <div className="hl-gotcha" key={g}>
                                {g}
                              </div>
                            ))}
                            <p className="hl-cite">
                              <b>Source:</b> {step.citeLabel}
                            </p>
                            <div className="hl-actions">
                              <a className="hl-go" href={step.url} rel="noopener noreferrer" target="_blank">
                                Open the official page
                              </a>
                              <a className="hl-check" href={step.cite} rel="noopener noreferrer" target="_blank">
                                Read the rule
                              </a>
                            </div>
                          </div>
                        ) : null}
                        <div className="hl-actions">
                          <button
                            className={"hl-check" + (isDone ? " on" : "")}
                            onClick={() => toggleDone(step.id)}
                            type="button"
                          >
                            {isDone ? "\u2713 Done" : "Mark done"}
                          </button>
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="fp-strip" style={{ marginTop: "36px" }}>
        <p className="fp-st">Next: the Stay Legal calendar</p>
        <p className="fp-sd">
          Once your authority is active the deadlines start - the biennial
          update, IFTA every quarter, UCR every year, Form 2290, your medical
          card, the annual inspections. Put your dates in once and the
          calendar works them all out.
        </p>
        <div className="fp-try" style={{ margin: "14px 0 0" }}>
          <Link className="fp-try-btn" href="/haullegal/calendar">
            Open the calendar
          </Link>
        </div>
      </div>

      <div className="fp-foot">
        <div className="fp-links">
          <button className="fp-link" onClick={resetAll} type="button">
            Reset progress
          </button>
          <Link className="fp-link" href="/haullegal/terms">
            Terms
          </Link>
          <Link className="fp-link" href="/haullegal/privacy">
            Privacy
          </Link>
        </div>
        <p className="fp-legal">
          HaulLegal explains the steps; you complete every filing yourself in
          your own accounts. Not a government agency, not a law firm, not
          legal advice. Fees and rules verified September 2026 - confirm
          current requirements with the agency before you act.
        </p>
      </div>
    </div>
  );
}

// ============================================================
// END OF FILE - app/haullegal/start/page.tsx (v2 - locked steps
// show title only; 23-step checklist, free "Before you apply"
// phase, gate card, local progress)
// If you can see this comment, the paste was not truncated.
// ============================================================
