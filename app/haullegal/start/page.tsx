// FILE: app/haullegal/start/page.tsx
"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import HlLangToggle from "@/app/haullegal/lang-toggle";
import { fill, HL_UI, useHlLang } from "@/lib/haullegal/i18n";
import { HL_PARTNER_LINKS, HL_PHASES, HL_STEPS, type HlStep } from "@/lib/haullegal/steps";
import { HL_PHASES_ES, HL_STEPS_ES } from "@/lib/haullegal/steps-es";

// HaulLegal walkthrough room (v3 - three things:
// 1. SPANISH: the EN / ES pill in the top bar; page furniture comes
//    from lib/haullegal/i18n.ts and the step content is overlaid
//    from lib/haullegal/steps-es.ts by step id. Fees, links, order
//    and the free/paid split still come from steps.ts.
// 2. ACCOUNT SYNC (the reminder-job fix): when the owner is logged
//    in, progress loads from /haullegal/api/profile and every
//    check-off saves back to it (debounced), carrying the saved
//    calendar profile and reminder flag along untouched so this
//    page never blanks what the calendar wrote. Signed-out owners
//    keep the on-device copy exactly as before. A status line under
//    the progress bar says which one is in effect.
// 3. PARTNER BUTTONS: a step whose partner slot has an entry in
//    HL_PARTNER_LINKS (steps.ts) shows that link in its detail
//    block with the referral disclosure; the table ships empty, so
//    nothing shows until a tracked link is added there.)
// v2 notes - TIGHTER PREVIEW, his call: locked steps show ONLY
// their title and a Locked tag - the free view is a table of
// contents, not the content. The four "Before you apply" steps
// stay fully open as the free sample; the gate card spells out what
// the paid 19 contain.
// v1 notes - the product itself: the 23 verified steps in their
// four phases as a checklist worked through on a phone: number,
// title, plain summary, the official fee chip and the typical
// time, and an expandable detail block with what to do first, the
// FMCSA-flagged mistakes, the citation, and a button to the
// official page. Access comes from /haullegal/api/access.
// All storage reads happen in useEffect (hydration rule); no
// Date.now()/Math.random() in render (Next 16 prerender rule).
// External official links use real anchors with rel=noopener -
// the standing no-anchor exception for off-site pages.

const STORE_KEY = "hl-progress";
const PROFILE_KEY = "hl-profile";

type Saved = { profile: Record<string, unknown>; progress: string[]; reminders: boolean };

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

function loadLocalProfile(): Record<string, unknown> {
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

export default function HaulLegalStartPage() {
  const [paid, setPaid] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [synced, setSynced] = useState(false);
  const [done, setDone] = useState<string[]>([]);
  const [open, setOpen] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [lang] = useHlLang();
  const ui = HL_UI[lang];
  const t = ui.start;

  // What the account holds (only meaningful once synced is true).
  const server = useRef<Saved | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const local = loadDone();
    setDone(local);
    setLoaded(true);
    fetch("/haullegal/api/access")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.paid) setPaid(true);
        if (!data?.loggedIn) return;
        setLoggedIn(true);
        return fetch("/haullegal/api/profile")
          .then((res) => (res.ok ? res.json() : null))
          .then((p) => {
            const saved = p?.saved;
            const profile = saved?.profile && typeof saved.profile === "object" ? (saved.profile as Record<string, unknown>) : loadLocalProfile();
            const progress: string[] = Array.isArray(saved?.progress) ? saved.progress.filter((x: unknown) => typeof x === "string") : [];
            const reminders = saved?.reminders === undefined ? true : Boolean(saved.reminders);
            server.current = { profile, progress, reminders };
            setSynced(true);
            if (progress.length > 0) {
              setDone(progress);
              saveDone(progress);
            } else if (local.length > 0) {
              push(local);
            }
          });
      })
      .catch(() => {});
  }, []);

  function push(ids: string[]) {
    const s = server.current;
    if (!s) return;
    s.progress = ids;
    fetch("/haullegal/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile: s.profile, progress: ids, reminders: s.reminders }),
    }).catch(() => {});
  }

  function schedulePush(ids: string[]) {
    if (!server.current) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => push(ids), 800);
  }

  function toggleDone(id: string) {
    setDone((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      saveDone(next);
      schedulePush(next);
      return next;
    });
  }

  function toggleOpen(id: string) {
    setOpen((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function resetAll() {
    if (!window.confirm(t.resetConfirm)) return;
    setDone([]);
    saveDone([]);
    schedulePush([]);
  }

  function view(step: HlStep): HlStep {
    if (lang !== "es") return step;
    const es = HL_STEPS_ES[step.id];
    return es ? { ...step, ...es } : step;
  }

  function titleOf(id: string): string {
    const s = HL_STEPS.find((x) => x.id === id);
    return s ? view(s).title : id;
  }

  const total = HL_STEPS.length;
  const doneCount = HL_STEPS.filter((s) => done.includes(s.id)).length;
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;
  const firstLockedId = paid ? null : HL_STEPS.find((s) => !s.free)?.id ?? null;
  let number = 0;

  return (
    <div className="fp-wrap">
      <div className="fp-top" style={{ flexWrap: "wrap", gap: "8px" }}>
        <div className="fp-brand">
          Haul<span>Legal</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <HlLangToggle />
          <Link className="fp-backpill" href="/haullegal">
            {ui.common.backTo}{" "}
            <span className="fp-wordmark">
              Haul<span>Legal</span>
            </span>
          </Link>
        </div>
      </div>

      <div className="fp-badge">{fill(t.badge, { n: total })}</div>
      <h1 className="fp-h1" style={{ fontSize: "30px" }}>
        {t.h1a} <span>{t.h1b}</span>
      </h1>
      <p className="fp-sub">{t.sub}</p>

      <div className="hl-prog">
        <div className="hl-progrow">
          <span>
            <b>{loaded ? doneCount : 0}</b> {t.progOf} {total} {t.progDone}
          </span>
          <span>{loaded ? pct : 0}%</span>
        </div>
        <div className="hl-bar">
          <div className="hl-fill" style={{ width: `${loaded ? pct : 0}%` }} />
        </div>
        {loaded ? (
          <p className="hl-fh" style={{ marginTop: "8px" }}>
            {synced ? t.syncAccount : t.syncDevice}
            {!loggedIn ? (
              <>
                {" "}
                <Link href="/login" style={{ color: "var(--fp)", fontWeight: 700 }}>
                  {t.syncLogin}
                </Link>
              </>
            ) : null}
          </p>
        ) : null}
      </div>

      {HL_PHASES.map((phase) => {
        const ph = lang === "es" ? HL_PHASES_ES[phase.id] : phase;
        return (
          <div key={phase.id}>
            <p className="hl-phase">{ph.title}</p>
            <p className="fp-cd" style={{ margin: "0 0 12px" }}>
              {ph.blurb}
            </p>
            <div className="hl-steps">
              {HL_STEPS.filter((s) => s.phase === phase.id).map((raw: HlStep) => {
                const step = view(raw);
                number += 1;
                const unlocked = step.free || paid;
                const isDone = done.includes(step.id);
                const isOpen = open.includes(step.id);
                const cls = "hl-step" + (isDone ? " done" : "") + (unlocked ? "" : " locked");
                const partner = step.partner ? HL_PARTNER_LINKS[step.partner] : undefined;
                return (
                  <div key={step.id}>
                    {!unlocked && step.id === firstLockedId ? (
                      <div className="fp-gate" style={{ margin: "0 0 10px" }}>
                        <p className="fp-gateh">{t.gateH}</p>
                        <p className="fp-gated">{t.gateP}</p>
                        <Link className="fp-gatebtn" href="/haullegal/buy">
                          {t.gateBtn}
                        </Link>
                      </div>
                    ) : null}
                    <div className={cls}>
                      <div className="hl-num">{isDone ? "\u2713" : number}</div>
                      <p className="hl-steph">{step.title}</p>
                      {unlocked ? <p className="hl-stepd">{step.summary}</p> : null}
                      <div className="hl-meta">
                        {unlocked ? <span className="hl-fee">{step.fee}</span> : null}
                        {unlocked ? <span className="hl-tag">{step.time}</span> : <span className="hl-tag">{t.locked}</span>}
                      </div>
                      {unlocked ? (
                        <>
                          <button className="hl-more" onClick={() => toggleOpen(step.id)} type="button">
                            {isOpen ? t.hideDetails : t.showDetails}
                          </button>
                          {isOpen ? (
                            <div className="hl-detail">
                              <p className="hl-label">{t.where}</p>
                              <p className="hl-stepd">{step.where}</p>
                              {step.needs.length > 0 ? (
                                <>
                                  <p className="hl-label">{t.doFirst}</p>
                                  <ul className="hl-list">
                                    {step.needs.map((n) => (
                                      <li key={n}>
                                        {titleOf(n)}
                                        {done.includes(n) ? t.doneMark : ""}
                                      </li>
                                    ))}
                                  </ul>
                                </>
                              ) : null}
                              <p className="hl-label">{t.watchOut}</p>
                              {step.gotchas.map((g) => (
                                <div className="hl-gotcha" key={g}>
                                  {g}
                                </div>
                              ))}
                              <p className="hl-cite">
                                <b>{t.source}</b> {step.citeLabel}
                              </p>
                              <div className="hl-actions">
                                <a className="hl-go" href={step.url} rel="noopener noreferrer" target="_blank">
                                  {t.openOfficial}
                                </a>
                                <a className="hl-check" href={step.cite} rel="noopener noreferrer" target="_blank">
                                  {t.readRule}
                                </a>
                                {partner ? (
                                  <a className="hl-check" href={partner.url} rel="noopener noreferrer sponsored" target="_blank">
                                    {partner.label}
                                  </a>
                                ) : null}
                              </div>
                              {partner ? <p className="hl-cite">{t.partnerNote}</p> : null}
                            </div>
                          ) : null}
                          <div className="hl-actions">
                            <button
                              className={"hl-check" + (isDone ? " on" : "")}
                              onClick={() => toggleDone(step.id)}
                              type="button"
                            >
                              {isDone ? t.done : t.markDone}
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
        );
      })}

      <div className="fp-strip" style={{ marginTop: "36px" }}>
        <p className="fp-st">{t.nextT}</p>
        <p className="fp-sd">{t.nextP}</p>
        <div className="fp-try" style={{ margin: "14px 0 0" }}>
          <Link className="fp-try-btn" href="/haullegal/calendar">
            {t.nextBtn}
          </Link>
        </div>
      </div>

      <div className="fp-foot">
        <div className="fp-links">
          <button className="fp-link" onClick={resetAll} type="button">
            {t.reset}
          </button>
          <Link className="fp-link" href="/haullegal/terms">
            {ui.common.terms}
          </Link>
          <Link className="fp-link" href="/haullegal/privacy">
            {ui.common.privacy}
          </Link>
        </div>
        <p className="fp-legal">{t.legal}</p>
      </div>
    </div>
  );
}

// ============================================================
// END OF FILE - app/haullegal/start/page.tsx (v3 - Spanish switch,
// account progress sync, partner buttons; 23-step checklist, free
// "Before you apply" phase, gate card)
// If you can see this comment, the paste was not truncated.
// ============================================================
