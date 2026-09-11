// FILE: app/haullegal/calendar/page.tsx
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  buildCalendar,
  daysUntil,
  formatYmd,
  HL_EMPTY_PROFILE,
  HL_OBLIGATIONS,
  type HlDue,
  type HlProfile,
} from "@/lib/haullegal/deadlines";

// HaulLegal Stay Legal calendar (v2 - BLANK BY DEFAULT, his spec:
// no switch is pre-selected; a "select all that apply" header sits
// above the switches so the owner fills it in accurately. The
// defaults live in lib/haullegal/deadlines.ts v2.)
// v1 notes: the deadline engine, free to
// use as a calculator. The owner types his USDOT number, flips the
// switches that describe his operation (55,000+ lb, IFTA, IRP, ELD,
// and the four by-the-mile states) and enters the dates he knows;
// the page computes every upcoming due date from the verified rules
// in lib/haullegal/deadlines.ts and lists them soonest first, with
// a "due in N days" badge, orange inside 30 days and red once past.
// Dates the owner has not entered show up as a "to see more, add"
// list instead of guesses. The profile is saved on the device
// (localStorage key hl-profile); the paid Stay Legal tier will save
// it to the account and email reminders ahead of each date (that
// job ships with the money loop - the pitch strip at the bottom
// points at /haullegal/buy).
// The clock is read ONLY inside useEffect (today state) so the
// prerender never sees Date.now(); buildCalendar takes the date as
// an argument. External rule links are real anchors with
// rel=noopener - the standing no-anchor exception for off-site
// government pages.

const STORE_KEY = "hl-profile";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

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

const DATE_FIELDS: Array<{ k: DateKey; label: string; help: string }> = [
  { k: "authorityActive", label: "Authority went active", help: "Starts the 12-month New Entrant audit clock." },
  { k: "medCardIssued", label: "Last DOT physical", help: "Medical card must be renewed within 24 months." },
  { k: "insuranceRenews", label: "Insurance policy renews", help: "No gap - a lapse cancels your federal filing." },
  { k: "consortiumEnrolled", label: "Consortium enrolled", help: "Random pool renews yearly." },
  { k: "lastQuery", label: "Last Clearinghouse query", help: "At least one query on yourself every year." },
  { k: "lastMvr", label: "Last MVR review", help: "Driving record pulled and reviewed every 12 months." },
  { k: "tractorInspected", label: "Tractor annual inspection", help: "Every 12 months per vehicle." },
  { k: "trailerInspected", label: "Trailer annual inspection", help: "The trailer needs its own." },
  { k: "irpRenews", label: "IRP plates renew", help: "The month your base state assigned." },
];

const TOGGLES: Array<{ k: keyof HlProfile; label: string }> = [
  { k: "hvut", label: "Truck is 55,000 lb or more (Form 2290)" },
  { k: "ifta", label: "IFTA licensed (over 26,000 lb, 2+ states)" },
  { k: "irp", label: "IRP apportioned plates" },
  { k: "eld", label: "Runs an ELD" },
  { k: "ky", label: "Runs Kentucky" },
  { k: "nm", label: "Runs New Mexico" },
  { k: "ny", label: "Runs New York" },
  { k: "or", label: "Runs Oregon" },
];

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

function badge(days: number): string {
  if (days < 0) return `${Math.abs(days)} days past due`;
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  return `In ${days} days`;
}

export default function HaulLegalCalendarPage() {
  const [profile, setProfile] = useState<HlProfile>(HL_EMPTY_PROFILE);
  const [today, setToday] = useState<Date | null>(null);
  const [showRules, setShowRules] = useState(false);

  useEffect(() => {
    setProfile(loadProfile());
    setToday(new Date());
  }, []);

  function update(patch: Partial<HlProfile>) {
    setProfile((prev) => {
      const next = { ...prev, ...patch };
      saveProfile(next);
      return next;
    });
  }

  const result = today ? buildCalendar(profile, today) : { dues: [] as HlDue[], missing: [] as string[] };

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

      <div className="fp-badge">Stay Legal calendar</div>
      <h1 className="fp-h1" style={{ fontSize: "30px" }}>
        Every deadline, <span>worked out for you.</span>
      </h1>
      <p className="fp-sub">
        Type in your USDOT number, flip the switches that match your truck,
        and add the dates you know. The calendar computes what is due and
        when, from the actual rules - soonest first. Saved on this device.
      </p>

      <div className="hl-form">
        <div className="hl-field hl-wide">
          <label className="hl-fl" htmlFor="hl-usdot">USDOT number</label>
          <input
            className="fp-in"
            id="hl-usdot"
            inputMode="numeric"
            onChange={(e) => update({ usdot: e.target.value.replace(/\D/g, "") })}
            placeholder="e.g. 4123457"
            value={profile.usdot ?? ""}
          />
          <p className="hl-fh">The last two digits set your biennial update month and year.</p>
        </div>

        <div className="hl-field hl-wide">
          <p className="hl-fl">Your operation - select all that apply</p>
          <p className="hl-fh">Nothing is picked for you. Tap each one that is true for your truck; leave the rest alone.</p>
          <div className="hl-toggles">
            {TOGGLES.map((t) => {
              const on = Boolean(profile[t.k]);
              return (
                <button
                  className={"hl-tog" + (on ? " on" : "")}
                  key={t.k}
                  onClick={() => update({ [t.k]: !on } as Partial<HlProfile>)}
                  type="button"
                >
                  {t.label}
                </button>
              );
            })}
          </div>
          <div className="hl-actions">
            <button
              className="hl-check"
              onClick={() => {
                const cleared: HlProfile = { ...HL_EMPTY_PROFILE };
                setProfile(cleared);
                saveProfile(cleared);
              }}
              type="button"
            >
              Clear everything
            </button>
          </div>
        </div>

        {profile.hvut ? (
          <>
            <div className="hl-field">
              <label className="hl-fl" htmlFor="hl-fum">Month the truck first hit the road (this tax year)</label>
              <select
                className="fp-in"
                id="hl-fum"
                onChange={(e) => update({ firstUseMonth: e.target.value ? Number(e.target.value) : undefined })}
                value={profile.firstUseMonth ?? ""}
              >
                <option value="">Not sure / July (standard)</option>
                {MONTHS.map((m, i) => (
                  <option key={m} value={i + 1}>
                    {m}
                  </option>
                ))}
              </select>
              <p className="hl-fh">Form 2290 is due the last day of the month after first use.</p>
            </div>
            <div className="hl-field">
              <label className="hl-fl" htmlFor="hl-fuy">First-use year</label>
              <input
                className="fp-in"
                id="hl-fuy"
                inputMode="numeric"
                onChange={(e) => update({ firstUseYear: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="e.g. 2026"
                value={profile.firstUseYear ?? ""}
              />
            </div>
          </>
        ) : null}

        {DATE_FIELDS.filter((f) => f.k !== "irpRenews" || profile.irp).map((f) => (
          <div className="hl-field" key={f.k}>
            <label className="hl-fl" htmlFor={`hl-${f.k}`}>{f.label}</label>
            <input
              className="fp-in"
              id={`hl-${f.k}`}
              onChange={(e) => update({ [f.k]: e.target.value || undefined } as Partial<HlProfile>)}
              type="date"
              value={profile[f.k] ?? ""}
            />
            <p className="hl-fh">{f.help}</p>
          </div>
        ))}
      </div>

      <h2 className="fp-h2">What is coming up</h2>
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
                  <p className="hl-dueh">{d.title}</p>
                  <p className="hl-dued">{d.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="hl-empty">Add your USDOT number and a few dates above and the calendar fills in here.</p>
      )}

      {today && result.missing.length > 0 ? (
        <div className="fp-card" style={{ marginTop: "14px" }}>
          <p className="fp-cn">
            <span>+</span>To see more, add
          </p>
          <ul className="hl-list">
            {result.missing.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="fp-strip" style={{ marginTop: "36px" }}>
        <p className="fp-st">Want these on your phone before they are due?</p>
        <p className="fp-sd">
          Stay Legal saves this calendar to your account and emails you 30
          days, 7 days and 1 day before every deadline - $39 a month, cancel
          any time, first month free with the launch walkthrough.
        </p>
        <div className="fp-try" style={{ margin: "14px 0 0" }}>
          <Link className="fp-try-btn" href="/haullegal/buy">
            Get Stay Legal
          </Link>
        </div>
      </div>

      <button className="hl-more" onClick={() => setShowRules((v) => !v)} type="button">
        {showRules ? "Hide how each date is computed" : "How is each date computed?"}
      </button>
      {showRules ? (
        <div className="hl-steps" style={{ marginTop: "12px" }}>
          {HL_OBLIGATIONS.map((o) => (
            <div className="fp-card" key={o.id}>
              <p className="fp-cn">
                <span>+</span>
                {o.title}
              </p>
              <p className="fp-cd">{o.summary}</p>
              <div className="hl-meta">
                <span className="hl-tag">{o.freq}</span>
                <span className="hl-fee">{o.cost}</span>
              </div>
              <p className="hl-cite" style={{ marginTop: "8px" }}>
                <b>Rule:</b> {o.rule}
              </p>
              <p className="hl-cite">
                <b>If missed:</b> {o.missed}
              </p>
              <div className="hl-actions">
                <a className="hl-check" href={o.cite} rel="noopener noreferrer" target="_blank">
                  {o.citeLabel}
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <div className="fp-foot">
        <div className="fp-links">
          <Link className="fp-link" href="/haullegal/start">
            The walkthrough
          </Link>
          <Link className="fp-link" href="/haullegal/terms">
            Terms
          </Link>
          <Link className="fp-link" href="/haullegal/privacy">
            Privacy
          </Link>
        </div>
        <p className="fp-legal">
          Dates are computed from the information you enter and the rules as
          verified in September 2026. They are a convenience, not a
          guarantee - keep your own record and confirm with the agency.
        </p>
      </div>
    </div>
  );
}

// ============================================================
// END OF FILE - app/haullegal/calendar/page.tsx (v2 - blank
// switches + select-all-that-apply header; profile form, due-date
// list, rules reference, Stay Legal pitch)
// If you can see this comment, the paste was not truncated.
// ============================================================
