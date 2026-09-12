// FILE: app/haullegal/page.tsx
"use client";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import HlLangToggle from "@/app/haullegal/lang-toggle";
import { HL_UI, useHlLang } from "@/lib/haullegal/i18n";

// HaulLegal landing page (v5 - the ACCOUNT door: a logged-in owner
// sees an "Account" pill beside Log out in the top bar, and the
// footer of every product page now carries an "Account" link, so
// the page that manages or cancels Stay Legal is reachable from
// anywhere on the site - it was not linked from anywhere before.)
// v4 notes - SPANISH: every string now comes from
// lib/haullegal/i18n.ts through the hl-lang switch, and the EN / ES
// pill sits in the top bar beside Log in. The English copy is the
// exact v3 copy; the fee and market tables are read from the same
// language file (English values identical to HL_GOV_FEES and
// HL_MARKET in steps.ts). Also says "five" by-the-mile states now
// that Connecticut is in.)
// v3 notes - footer gains the "State guides" link, the crawl door
// into the 50 state pages.
// v2 notes - footer gains the "Guides" link, the crawl door from
// the front page into the SEO library.
// v1 notes - the front door of haullegal.com, modeled on the
// WiremanPrep landing but speaking to a different customer: a
// brand-new owner-operator who needs a USDOT number, operating
// authority, and then has to stay legal every quarter.
// - TWO PRODUCTS, both flat: the launch walkthrough at $249 one
//   time, and the Stay Legal calendar at $39 a month with the first
//   month free for walkthrough buyers. No early-bird clock, no
//   price-flip constant.
// - HONESTY DOCTRINE, load-bearing: every number in the hero, the
//   stats and the fee table is a verified government figure (Sept
//   2026 - see lib/haullegal/steps.ts). We say plainly that we
//   never file anything or touch a government account, that we
//   are not the government and not lawyers, and that some links
//   are partner links. Do not "round up" any claim in later edits.
// - The access fetch points at /haullegal/api/access; the catch
//   swallows any failure and the page treats everyone as a visitor.
// No Date.now()/Math.random() in render (Next 16 prerender rule).

const pill: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: 700,
  fontFamily: "inherit",
  color: "#fff",
  background: "#161616",
  border: "1px solid #333",
  borderRadius: "999px",
  padding: "5px 14px",
  whiteSpace: "nowrap",
  cursor: "pointer",
  textDecoration: "none",
};

export default function HaulLegalPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [paid, setPaid] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [lang] = useHlLang();
  const ui = HL_UI[lang];
  const t = ui.landing;

  useEffect(() => {
    fetch("/haullegal/api/access")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.loggedIn) setLoggedIn(true);
        if (data?.paid) setPaid(true);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="fp-wrap">
      <div className="fp-top" style={{ flexWrap: "wrap", gap: "8px" }}>
        <div className="fp-brand">
          Haul<span>Legal</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <HlLangToggle />
          {loggedIn ? (
            <Link href="/haullegal/account" style={pill}>
              {ui.common.account}
            </Link>
          ) : null}
          {loggedIn ? (
            <button
              disabled={signingOut}
              onClick={() => {
                setSigningOut(true);
                signOut({ redirectTo: "/haullegal" });
              }}
              style={pill}
              type="button"
            >
              {signingOut ? ui.common.signingOut : ui.common.logOut}
            </button>
          ) : (
            <Link href="/login" style={pill}>
              {ui.common.logIn}
            </Link>
          )}
        </div>
      </div>

      <div className="fp-hero">
        <div className="fp-badge">{t.badge}</div>
        <h1 className="fp-h1">
          {t.h1a} <span>{t.h1b}</span>
        </h1>
        <p className="fp-sub">{t.sub}</p>
        {paid ? null : (
          <>
            <Link className="fp-cta" href="/haullegal/buy" style={{ textDecoration: "none" }}>
              {t.ctaBuy}
            </Link>
            <p className="fp-note">
              <b>{t.noteB}</b>
              {t.noteRest}
            </p>
          </>
        )}
        <div className="fp-try">
          <Link className="fp-try-btn" href="/haullegal/start">
            {paid ? t.tryOpen : t.trySee}
          </Link>
          <Link className="fp-try-btn ghost" href="/haullegal/calendar">
            {t.tryCal}
          </Link>
        </div>
        {paid ? null : <p className="fp-tryhint">{t.tryHint}</p>}
      </div>

      <div className="fp-stats">
        {t.stats.map((s) => (
          <div className="fp-stat" key={s.l}>
            <div className="fp-sn">{s.n}</div>
            <div className="fp-sl">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="fp-strip">
        <p className="fp-st">{t.stripT}</p>
        <p className="fp-sd">{t.stripD}</p>
      </div>

      <h2 className="fp-h2">{t.whatYouGet}</h2>
      <div className="fp-grid">
        {t.features.map((f) => (
          <div className="fp-card" key={f.n}>
            <p className="fp-cn">
              <span>+</span>
              {f.n}
            </p>
            <p className="fp-cd">{f.d}</p>
          </div>
        ))}
      </div>

      <h2 className="fp-h2">{t.govTitle}</h2>
      <div className="fp-price">
        {t.govFees.map((f) => (
          <div className="fp-prow" key={f.item}>
            <div>
              <div className="fp-pl" style={{ color: "#ddd" }}>{f.item}</div>
              <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>{f.who}</div>
            </div>
            <div className="fp-pv" style={{ color: "#fff" }}>{f.cost}</div>
          </div>
        ))}
      </div>

      <h2 className="fp-h2">{t.marketTitle}</h2>
      <div className="fp-price">
        {t.market.map((m) => (
          <div className={m.ours ? "fp-prow fp-ours" : "fp-prow"} key={m.label}>
            <div className="fp-pl">{m.label}</div>
            <div className="fp-pv">{m.value}</div>
          </div>
        ))}
      </div>

      <div className="fp-foot">
        <div className="fp-links">
          <Link className="fp-link" href="/haullegal/guides">
            {ui.common.guides}
          </Link>
          <Link className="fp-link" href="/haullegal/states">
            {ui.common.stateGuides}
          </Link>
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
    </div>
  );
}

// ============================================================
// END OF FILE - app/haullegal/page.tsx (v5 - Account pill + footer
// link; Spanish switch via i18n.ts, EN / ES pill; five by-the-mile
// states; $249 walkthrough + $39/mo Stay Legal, fee table, honesty
// footer)
// If you can see this comment, the paste was not truncated.
// ============================================================
