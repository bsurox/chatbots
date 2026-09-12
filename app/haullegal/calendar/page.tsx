// FILE: app/haullegal/calendar/page.tsx
"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import HlLangToggle from "@/app/haullegal/lang-toggle";
import {
  buildCalendar,
  daysUntil,
  formatYmd,
  HL_EMPTY_PROFILE,
  HL_OBLIGATIONS,
  mcs150Slot,
  type HlDue,
  type HlProfile,
} from "@/lib/haullegal/deadlines";
import { HL_DUE_DETAILS_ES, HL_DUE_TITLES_ES, HL_FREQ_ES, HL_MISSING_ES, HL_OBLIGATIONS_ES } from "@/lib/haullegal/deadlines-es";
import { fill, HL_UI, useHlLang } from "@/lib/haullegal/i18n";

// HaulLegal Stay Legal calendar (v3 - three things:
// 1. ACCOUNT SYNC - the reminder-job fix. Until now the profile
//    lived only in this browser (hl-profile), so the daily reminder
//    job at /haullegal/api/remind had no profiles to read and no
//    subscriber ever got an email. Now: logged in, the page loads
//    the account copy from /haullegal/api/profile (falling back to
//    the device copy, which it then pushes up), and every change
//    saves back (debounced) with the walkthrough progress and the
//    reminder flag carried along. Signed out, everything works as
//    before on the device, with a line inviting the owner to log
//    in. Subscribers get an "Email reminders: ON / OFF" switch -
//    the setting the reminder email already tells people to use.
// 2. CONNECTICUT: a ninth switch, "Runs Connecticut (26,000 lb+)",
//    adds the quarterly Highway Use Fee return (deadlines.ts v3).
// 3. SPANISH: the EN / ES pill; furniture from i18n.ts, obligation
//    text and due-date lines from deadlines-es.ts. The date math
//    never changes language.)
// v2 notes - BLANK BY DEFAULT, his spec: no switch is pre-selected;
// a "select all that apply" header sits above the switches.
// v1 notes - the deadline engine, free to use as a calculator: the
// owner types his USDOT number, flips the switches that describe
// his operation and enters the dates he knows; the page computes
// every upcoming due date from the verified rules in deadlines.ts
// and lists them soonest first, orange inside 30 days and red once
// past. Dates not entered show up as a "to see more, add" list.
// The clock is read ONLY inside useEffect (today state) so the
// prerender never sees Date.now(); buildCalendar takes the date as
// an argument. External rule links are real anchors with
// rel=noopener - the standing no-anchor exception for off-site
// government pages.

const STORE_KEY = "hl-profile";
const PROGRESS_KEY = "hl-progress";

type DateKey =
  | "authorityActive"
  | "medCardIssued"
  | "lastMvr"
  | "lastQuery"
  | "consortiumEnrolled"
  | "tractorInspected"
  | "trailerInspected"
  | "insuranceRenews"
  | "irpRenews";

const DATE_KEYS: DateKey[] = [
  "authorityActive",
  "medCardIssued",
  "insuranceRenews",
  "consortiumEnrolled",
  "lastQuery",
  "lastMvr",
  "tractorInspected",
  "trailerInspected",
  "irpRenews",
];

type ToggleKey = "hvut" | "ifta" | "irp" | "eld" | "ky" | "nm" | "ny" | "or" | "ct";

const TOGGLE_KEYS: ToggleKey[] = ["hvut", "ifta", "irp", "eld", "ky", "nm", "ny", "or", "ct"];

type Access = { loggedIn: boolean; sub: boolean };

function loadProfile(): HlProfile {
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    if (!raw) return HL_EMPTY_PROFILE;
    const parsed = JSON.parse(raw);
    return { ...HL_EMPTY_PROFILE, ...(parsed && typeof parsed === "object" ? parsed : {}) };
  } catch {
    return HL_EMPTY_PROFILE;
  }
}

function saveProfile(p: HlProfile) {
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(p));
  } catch {
    // storage unavailable - the calculator still works for this visit
  }
}

function loadLocalProgress(): string[] {
  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function hasAnything(p: HlProfile): boolean {
  return Object.values(p).some((v) => v === true || (typeof v === "string" && v.length > 0) || typeof v === "number");
}

export default function HaulLegalCalendarPage() {
  const [profile, setProfile] = useState<HlProfile>(HL_EMPTY_PROFILE);
  const [today, setToday] = useState<Date | null>(null);
  const [showRules, setShowRules] = useState(false);
  const [access, setAccess] = useState<Access>({ loggedIn: false, sub: false });
  const [synced, setSynced] = useState(false);
  const [reminders, setReminders] = useState(true);
  const [lang] = useHlLang();
  const ui = HL_UI[lang];
  const t = ui.calendar;

  const progress = useRef<string[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ready = useRef(false);

  useEffect(() => {
    const local = loadProfile();
    setProfile(local);
    setToday(new Date());
    progress.current = loadLocalProgress();
    fetch("/haullegal/api/access")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data?.loggedIn) return;
        setAccess({ loggedIn: true, sub: Boolean(data.sub) });
        return fetch("/haullegal/api/profile")
          .then((res) => (res.ok ? res.json() : null))
          .then((p) => {
            const saved = p?.saved;
            if (Array.isArray(saved?.progress)) {
              progress.current = saved.progress.filter((x: unknown) => typeof x === "string");
            }
            if (saved?.reminders !== undefined) setReminders(Boolean(saved.reminders));
            ready.current = true;
            setSynced(true);
            if (saved?.profile && typeof saved.profile === "object") {
              const merged: HlProfile = { ...HL_EMPTY_PROFILE, ...saved.profile };
              setProfile(merged);
              saveProfile(merged);
            } else if (hasAnything(local)) {
              push(local, saved?.reminders === undefined ? true : Boolean(saved.reminders));
            }
          });
      })
      .catch(() => {});
  }, []);

  function push(p: HlProfile, rem: boolean) {
    if (!ready.current) return;
    fetch("/haullegal/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile: p, progress: progress.current, reminders: rem }),
    }).catch(() => {});
  }

  function schedulePush(p: HlProfile) {
    if (!ready.current) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => push(p, reminders), 800);
  }

  function update(patch: Partial<HlProfile>) {
    setProfile((prev) => {
      const next = { ...prev, ...patch };
      saveProfile(next);
      schedulePush(next);
      return next;
    });
  }

  function clearAll() {
    const cleared: HlProfile = { ...HL_EMPTY_PROFILE };
    setProfile(cleared);
    saveProfile(cleared);
    schedulePush(cleared);
  }

  function toggleReminders() {
    const next = !reminders;
    setReminders(next);
    push(profile, next);
  }

  const result = today ? buildCalendar(profile, today) : { dues: [] as HlDue[], missing: [] as string[], missingKeys: [] as string[] };

  function badge(days: number): string {
    if (days < 0) return fill(t.pastDue, { n: Math.abs(days) });
    if (days === 0) return t.dueToday;
    if (days === 1) return t.dueTomorrow;
    return fill(t.inDays, { n: days });
  }

  function dueTitle(d: HlDue): string {
    if (lang !== "es") return d.title;
    return HL_DUE_TITLES_ES[d.id] ?? HL_OBLIGATIONS_ES[d.obligationId]?.title ?? d.title;
  }

  function dueDetail(d: HlDue): string {
    if (lang !== "es") return d.detail;
    if (d.id === "mcs150") {
      const slot = mcs150Slot(profile.usdot);
      return fill(t.mcsDetail, { month: slot?.month ?? "", parity: slot?.parity === "odd" ? t.odd : t.even });
    }
    return HL_DUE_DETAILS_ES[d.id] ?? d.detail;
  }

  const missingList = lang === "es" ? result.missingKeys.map((k) => HL_MISSING_ES[k] ?? k) : result.missing;

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

      <div className="fp-badge">{t.badge}</div>
      <h1 className="fp-h1" style={{ fontSize: "30px" }}>
        {t.h1a} <span>{t.h1b}</span>
      </h1>
      <p className="fp-sub">{t.sub}</p>

      <div className="hl-form">
        <div className="hl-field hl-wide">
          <label className="hl-fl" htmlFor="hl-usdot">{t.usdotLabel}</label>
          <input
            className="fp-in"
            id="hl-usdot"
            inputMode="numeric"
            onChange={(e) => update({ usdot: e.target.value.replace(/\D/g, "") })}
            placeholder={t.usdotPh}
            value={profile.usdot ?? ""}
          />
          <p className="hl-fh">{t.usdotHelp}</p>
        </div>

        <div className="hl-field hl-wide">
          <p className="hl-fl">{t.opT}</p>
          <p className="hl-fh">{t.opHelp}</p>
          <div className="hl-toggles">
            {TOGGLE_KEYS.map((k) => {
              const on = Boolean(profile[k]);
              return (
                <button
                  className={"hl-tog" + (on ? " on" : "")}
                  key={k}
                  onClick={() => update({ [k]: !on } as Partial<HlProfile>)}
                  type="button"
                >
                  {t.toggles[k]}
                </button>
              );
            })}
          </div>
          <div className="hl-actions">
            <button className="hl-check" onClick={clearAll} type="button">
              {t.clear}
            </button>
          </div>
        </div>

        {profile.hvut ? (
          <>
            <div className="hl-field">
              <label className="hl-fl" htmlFor="hl-fum">{t.fumLabel}</label>
              <select
                className="fp-in"
                id="hl-fum"
                onChange={(e) => update({ firstUseMonth: e.target.value ? Number(e.target.value) : undefined })}
                value={profile.firstUseMonth ?? ""}
              >
                <option value="">{t.fumDefault}</option>
                {t.months.map((m, i) => (
                  <option key={m} value={i + 1}>
                    {m}
                  </option>
                ))}
              </select>
              <p className="hl-fh">{t.fumHelp}</p>
            </div>
            <div className="hl-field">
              <label className="hl-fl" htmlFor="hl-fuy">{t.fuyLabel}</label>
              <input
                className="fp-in"
                id="hl-fuy"
                inputMode="numeric"
                onChange={(e) => update({ firstUseYear: e.target.value ? Number(e.target.value) : undefined })}
                placeholder={t.fuyPh}
                value={profile.firstUseYear ?? ""}
              />
            </div>
          </>
        ) : null}

        {DATE_KEYS.filter((k) => k !== "irpRenews" || profile.irp).map((k) => (
          <div className="hl-field" key={k}>
            <label className="hl-fl" htmlFor={`hl-${k}`}>{t.dateFields[k].label}</label>
            <input
              className="fp-in"
              id={`hl-${k}`}
              onChange={(e) => update({ [k]: e.target.value || undefined } as Partial<HlProfile>)}
              type="date"
              value={profile[k] ?? ""}
            />
            <p className="hl-fh">{t.dateFields[k].help}</p>
          </div>
        ))}

        <div className="hl-field hl-wide">
          <p className="hl-fh">
            {synced ? t.savedAccount : t.savedDevice}
            {!access.loggedIn ? (
              <>
                {" "}
                <Link href="/login" style={{ color: "var(--fp)", fontWeight: 700 }}>
                  {t.logInToSync}
                </Link>
              </>
            ) : null}
          </p>
          {access.sub && synced ? (
            <div className="hl-actions">
              <button className={"hl-check" + (reminders ? " on" : "")} onClick={toggleReminders} type="button">
                {reminders ? t.remindersOn : t.remindersOff}
              </button>
              <p className="hl-fh" style={{ margin: "6px 0 0" }}>{t.remindersHelp}</p>
            </div>
          ) : null}
        </div>
      </div>

      <h2 className="fp-h2">{t.coming}</h2>
      {today && result.dues.length > 0 ? (
        <div className="hl-steps">
          {result.dues.map((d) => {
            const days = daysUntil(d.due, today);
            const cls = "hl-due" + (days < 0 ? " late" : days <= 30 ? " soon" : "");
            return (
              <div className={cls} key={d.id}>
                <div className="hl-date">
                  {formatYmd(d.due)}
                  <small>{badge(days)}</small>
                </div>
                <div>
                  <p className="hl-dueh">{dueTitle(d)}</p>
                  <p className="hl-dued">{dueDetail(d)}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="hl-empty">{t.empty}</p>
      )}

      {today && missingList.length > 0 ? (
        <div className="fp-card" style={{ marginTop: "14px" }}>
          <p className="fp-cn">
            <span>+</span>{t.toSeeMore}
          </p>
          <ul className="hl-list">
            {missingList.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {access.sub ? null : (
        <div className="fp-strip" style={{ marginTop: "36px" }}>
          <p className="fp-st">{t.pitchT}</p>
          <p className="fp-sd">{t.pitchP}</p>
          <div className="fp-try" style={{ margin: "14px 0 0" }}>
            <Link className="fp-try-btn" href="/haullegal/buy">
              {t.pitchBtn}
            </Link>
          </div>
        </div>
      )}

      <button className="hl-more" onClick={() => setShowRules((v) => !v)} type="button">
        {showRules ? t.hideComputed : t.howComputed}
      </button>
      {showRules ? (
        <div className="hl-steps" style={{ marginTop: "12px" }}>
          {HL_OBLIGATIONS.map((raw) => {
            const es = lang === "es" ? HL_OBLIGATIONS_ES[raw.id] : undefined;
            const o = es ? { ...raw, ...es } : raw;
            return (
              <div className="fp-card" key={o.id}>
                <p className="fp-cn">
                  <span>+</span>
                  {o.title}
                </p>
                <p className="fp-cd">{o.summary}</p>
                <div className="hl-meta">
                  <span className="hl-tag">{lang === "es" ? HL_FREQ_ES[o.freq] : o.freq}</span>
                  <span className="hl-fee">{o.cost}</span>
                </div>
                <p className="hl-cite" style={{ marginTop: "8px" }}>
                  <b>{t.ruleLabel}</b> {o.rule}
                </p>
                <p className="hl-cite">
                  <b>{t.missedLabel}</b> {o.missed}
                </p>
                <div className="hl-actions">
                  <a className="hl-check" href={o.cite} rel="noopener noreferrer" target="_blank">
                    {o.citeLabel}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      <div className="fp-foot">
        <div className="fp-links">
          <Link className="fp-link" href="/haullegal/start">
            {t.walkLink}
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
    </div>
  );
}

// ============================================================
// END OF FILE - app/haullegal/calendar/page.tsx (v3 - account
// sync + reminders switch, Connecticut switch, Spanish switch;
// profile form, due-date list, rules reference, Stay Legal pitch)
// If you can see this comment, the paste was not truncated.
// ============================================================
