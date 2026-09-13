// FILE: app/haullegal/start/page.tsx
"use client";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import HlAccountButton from "@/app/haullegal/account-button";
import HlLangToggle from "@/app/haullegal/lang-toggle";
import { fill, HL_UI, useHlLang } from "@/lib/haullegal/i18n";
import { HL_PARTNER_LINKS, HL_PHASES, HL_STEPS, type HlStep } from "@/lib/haullegal/steps";
import { HL_PHASES_ES, HL_STEPS_ES } from "@/lib/haullegal/steps-es";

// HaulLegal walkthrough room (v7 - FULL-WIDTH GRID, his spec: in
// Grid view the page drops the 660px centered column every other
// page uses (inline maxWidth none on .fp-wrap) and runs edge to
// edge, so the rows of cards use the whole screen left to right
// and far more of the walkthrough is visible at once. Card columns
// are at least 260px wide. List view keeps the centered column.)
// v6 notes - COLLAPSED STEPS + LIST / GRID VIEW, his spec:
// - Every step now starts CLOSED: the card shows only its number
//   and title (locked steps add the Locked tag). Tapping the title
//   opens the whole walkthrough for that step - summary, fee and
//   time chips, where, do-first, watch-out, source, the official
//   buttons, the partner button and Mark done - and tapping it
//   again (or "Hide details" at the bottom) closes it. The old
//   "Show details" button is gone; the title is the switch.
// - A View switch (List / Grid) sits above the first phase. List
//   is the stacked layout as before. Grid lays the closed cards
//   side by side in rows (as many as fit the screen, one column on
//   a narrow phone) so the whole list is visible with far less
//   scrolling; an opened card stretches across the full row so
//   its walkthrough reads at full width, and the gate card does
//   the same. The choice is kept on the device (localStorage key
//   hl-view) and read after mount, hydration-safe. The grid is
//   inline styles on the existing .hl-steps grid, so haullegal.css
//   is untouched.)
// v5 notes - the floating account circle
// (account-button.tsx) joins the page.
// v4 notes - footer gains the "Account" link, the door to managing
// Stay Legal.
// v3 notes - SPANISH via i18n.ts and steps-es.ts; ACCOUNT SYNC
// (progress loads from and saves to /haullegal/api/profile when
// logged in, debounced, carrying the calendar profile and reminder
// flag along untouched); PARTNER BUTTONS from HL_PARTNER_LINKS.
// v2 notes - locked steps show only their title and a Locked tag;
// the four "Before you apply" steps are the free sample; the gate
// card spells out what the paid 19 contain.
// v1 notes - the 23 verified steps in four phases as a checklist.
// All storage reads happen in useEffect (hydration rule); no
// Date.now()/Math.random() in render (Next 16 prerender rule).
// External official links use real anchors with rel=noopener -
// the standing no-anchor exception for off-site pages.

const STORE_KEY = "hl-progress";
const PROFILE_KEY = "hl-profile";
const VIEW_KEY = "hl-view";

type Saved = { profile: Record<string, unknown>; progress: string[]; reminders: boolean };
type View = "list" | "grid";

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

function loadView(): View {
  try {
    return window.localStorage.getItem(VIEW_KEY) === "grid" ? "grid" : "list";
  } catch {
    return "list";
  }
}

function saveView(v: View) {
  try {
    window.localStorage.setItem(VIEW_KEY, v);
  } catch {
    // storage unavailable - the choice lasts for this page view only
  }
}

const headBtn: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: "10px",
  width: "100%",
  background: "none",
  border: "none",
  padding: 0,
  margin: 0,
  textAlign: "left",
  cursor: "pointer",
  fontFamily: "inherit",
  color: "inherit",
};

const gridStyle: React.CSSProperties = {
  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
  alignItems: "start",
};

const fullRow: React.CSSProperties = { gridColumn: "1 / -1" };

export default function HaulLegalStartPage() {
  const [paid, setPaid] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [synced, setSynced] = useState(false);
  const [done, setDone] = useState<string[]>([]);
  const [open, setOpen] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [viewMode, setViewMode] = useState<View>("list");
  const [lang] = useHlLang();
  const ui = HL_UI[lang];
  const t = ui.start;

  // What the account holds (only meaningful once synced is true).
  const server = useRef<Saved | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const local = loadDone();
    setDone(local);
    setViewMode(loadView());
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

  function pickView(v: View) {
    setViewMode(v);
    saveView(v);
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
  const grid = viewMode === "grid";
  let number = 0;

  return (
    <div className="fp-wrap" style={grid ? { maxWidth: "none" } : undefined}>
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

      <div className="hl-toggles" style={{ alignItems: "center", marginTop: "18px" }}>
        <span className="hl-fl">{t.viewLabel}</span>
        <button className={"hl-tog" + (grid ? "" : " on")} onClick={() => pickView("list")} type="button">
          {t.viewList}
        </button>
        <button className={"hl-tog" + (grid ? " on" : "")} onClick={() => pickView("grid")} type="button">
          {t.viewGrid}
        </button>
      </div>
      <p className="hl-fh" style={{ marginTop: "8px" }}>
        {t.viewHint}
      </p>

      {HL_PHASES.map((phase) => {
        const ph = lang === "es" ? HL_PHASES_ES[phase.id] : phase;
        return (
          <div key={phase.id}>
            <p className="hl-phase">{ph.title}</p>
            <p className="fp-cd" style={{ margin: "0 0 12px" }}>
              {ph.blurb}
            </p>
            <div className="hl-steps" style={grid ? gridStyle : undefined}>
              {HL_STEPS.filter((s) => s.phase === phase.id).map((raw: HlStep) => {
                const step = view(raw);
                number += 1;
                const unlocked = step.free || paid;
                const isDone = done.includes(step.id);
                const isOpen = unlocked && open.includes(step.id);
                const cls = "hl-step" + (isDone ? " done" : "") + (unlocked ? "" : " locked");
                const partner = step.partner ? HL_PARTNER_LINKS[step.partner] : undefined;
                const gate =
                  !unlocked && step.id === firstLockedId ? (
                    <div className="fp-gate" style={grid ? { ...fullRow, margin: 0 } : { margin: 0 }}>
                      <p className="fp-gateh">{t.gateH}</p>
                      <p className="fp-gated">{t.gateP}</p>
                      <Link className="fp-gatebtn" href="/haullegal/buy">
                        {t.gateBtn}
                      </Link>
                    </div>
                  ) : null;
                return (
                  <Fragment key={step.id}>
                    {gate}
                    <div className={cls} style={grid && isOpen ? fullRow : undefined}>
                      <div className="hl-num">{isDone ? "\u2713" : number}</div>
                      {unlocked ? (
                        <button aria-expanded={isOpen} onClick={() => toggleOpen(step.id)} style={headBtn} type="button">
                          <span className="hl-steph" style={{ margin: 0 }}>
                            {step.title}
                          </span>
                          <span style={{ color: "var(--fp)", fontSize: "12px", fontWeight: 800, flexShrink: 0, paddingTop: "3px" }}>
                            {isOpen ? "\u25B4" : "\u25BE"}
                          </span>
                        </button>
                      ) : (
                        <p className="hl-steph" style={{ margin: 0 }}>
                          {step.title}
                        </p>
                      )}
                      {!unlocked ? (
                        <div className="hl-meta">
                          <span className="hl-tag">{t.locked}</span>
                        </div>
                      ) : null}
                      {isOpen ? (
                        <>
                          <p className="hl-stepd" style={{ marginTop: "6px" }}>
                            {step.summary}
                          </p>
                          <div className="hl-meta">
                            <span className="hl-fee">{step.fee}</span>
                            <span className="hl-tag">{step.time}</span>
                          </div>
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
                          <div className="hl-actions">
                            <button
                              className={"hl-check" + (isDone ? " on" : "")}
                              onClick={() => toggleDone(step.id)}
                              type="button"
                            >
                              {isDone ? t.done : t.markDone}
                            </button>
                          </div>
                          <button className="hl-more" onClick={() => toggleOpen(step.id)} type="button">
                            {t.hideDetails}
                          </button>
                        </>
                      ) : null}
                    </div>
                  </Fragment>
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
          <Link className="fp-link" href="/haullegal/account">
            {ui.common.account}
          </Link>
          <Link className="fp-link" href="/haullegal/terms">
            {ui.common.terms}
          </Link>
          <Link className="fp-link" href="/haullegal/privacy">
            {ui.common.privacy}
          </Link>
        </div>
        <p className="fp-legal">{t.legal}</p>
      </div>
      <HlAccountButton />
    </div>
  );
}

// ============================================================
// END OF FILE - app/haullegal/start/page.tsx (v7 - Grid view runs
// full width edge to edge; steps start closed, tap the title to
// open; List / Grid view switch kept on the device; account circle, footer Account link; Spanish switch,
// account progress sync, partner buttons; 23-step checklist, free
// "Before you apply" phase, gate card)
// If you can see this comment, the paste was not truncated.
// ============================================================
