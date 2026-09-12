// FILE: app/haullegal/account/page.tsx
"use client";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import HlLangToggle from "@/app/haullegal/lang-toggle";
import { fill, HL_UI, useHlLang } from "@/lib/haullegal/i18n";

// HaulLegal account page (v2 - SPANISH: every string comes from
// lib/haullegal/i18n.ts through the hl-lang switch and the EN / ES
// pill sits in the top bar. Status lines are the same sentences in
// both languages with the paid-through date filled in.)
// v1 notes - the one place that answers "what do I own and how do
// I cancel". Shows the walkthrough status, the Stay Legal status
// straight from the access route (trialing / active / past_due /
// canceled and the paid-through date), a Manage-subscription button
// that opens Stripe's Customer Portal (card update, invoices, cancel
// - all self-serve, flowing back through the webhook), doors to the
// product pages, and Log out. Signed-out visitors get the auth
// doors. The portal button asks /haullegal/api/portal for a
// one-time URL; if the portal is not switched on in Stripe yet the
// button explains and points at support instead of failing
// silently. Dates are formatted inside the effect-fed state, never
// from the clock during render (Next 16 prerender rule).

type Access = { loggedIn: boolean; paid: boolean; sub: boolean; subStatus: string; periodEnd: string | null };

export default function HaulLegalAccountPage() {
  const [access, setAccess] = useState<Access | null>(null);
  const [opening, setOpening] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [note, setNote] = useState("");
  const [lang] = useHlLang();
  const ui = HL_UI[lang];
  const t = ui.account;

  useEffect(() => {
    fetch("/haullegal/api/access")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setAccess({
            loggedIn: Boolean(data.loggedIn),
            paid: Boolean(data.paid),
            sub: Boolean(data.sub),
            subStatus: typeof data.subStatus === "string" ? data.subStatus : "none",
            periodEnd: typeof data.periodEnd === "string" ? data.periodEnd : null,
          });
        } else {
          setAccess({ loggedIn: false, paid: false, sub: false, subStatus: "none", periodEnd: null });
        }
      })
      .catch(() => setAccess({ loggedIn: false, paid: false, sub: false, subStatus: "none", periodEnd: null }));
  }, []);

  function statusLine(a: Access): string {
    const end = a.periodEnd ? a.periodEnd.slice(0, 10) : "";
    switch (a.subStatus) {
      case "trialing":
        return end ? fill(t.trialing, { end }) : t.trialingNoEnd;
      case "active":
        return end ? fill(t.active, { end }) : t.activeNoEnd;
      case "past_due":
        return t.pastDue;
      case "canceled":
        return a.sub && end ? fill(t.canceled, { end }) : t.canceledNoEnd;
      case "unpaid":
        return t.unpaid;
      default:
        return t.none;
    }
  }

  async function openPortal() {
    if (opening) return;
    setOpening(true);
    setNote("");
    try {
      const res = await fetch("/haullegal/api/portal", { method: "POST" });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.url) {
        window.location.href = data.url;
        return;
      }
      setNote(t.portalErr);
      setOpening(false);
    } catch {
      setNote(t.portalErr);
      setOpening(false);
    }
  }

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

      {access === null ? (
        <p className="fp-sub">{ui.common.loading}</p>
      ) : !access.loggedIn ? (
        <div className="fp-buycard">
          <p className="fp-buyh">{t.signInH}</p>
          <p className="fp-buysub">{t.signInP}</p>
          <div className="fp-authrow">
            <Link className="fp-authbtn" href="/login">
              {ui.common.logIn}
            </Link>
            <Link className="fp-authbtn ghost" href="/register">
              {t.createAccount}
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="fp-card">
            <p className="fp-cn">
              <span>+</span>{t.walkT}
            </p>
            <p className="fp-cd">{access.paid ? t.walkOwned : t.walkNot}</p>
            <div className="fp-try" style={{ margin: "12px 0 0" }}>
              {access.paid ? (
                <Link className="fp-try-btn" href="/haullegal/start">
                  {t.openWalk}
                </Link>
              ) : (
                <Link className="fp-try-btn" href="/haullegal/buy">
                  {t.buyWalk}
                </Link>
              )}
            </div>
          </div>

          <div className="fp-card" style={{ marginTop: "10px" }}>
            <p className="fp-cn">
              <span>+</span>{t.stayT}
            </p>
            <p className="fp-cd">{statusLine(access)}</p>
            <div className="fp-try" style={{ margin: "12px 0 0" }}>
              {access.sub || access.subStatus !== "none" ? (
                <>
                  <Link className="fp-try-btn" href="/haullegal/calendar">
                    {t.openCal}
                  </Link>
                  <button className="fp-try-btn ghost" disabled={opening} onClick={openPortal} type="button">
                    {opening ? t.opening : t.manageCancel}
                  </button>
                </>
              ) : (
                <Link className="fp-try-btn" href="/haullegal/buy">
                  {access.paid ? t.startTrial : t.buyStay}
                </Link>
              )}
            </div>
            {note ? <p className="fp-buyerr" style={{ textAlign: "left" }}>{note}</p> : null}
          </div>

          <div className="fp-try" style={{ marginTop: "24px" }}>
            <button
              className="fp-try-btn ghost"
              disabled={signingOut}
              onClick={() => {
                setSigningOut(true);
                signOut({ redirectTo: "/haullegal" });
              }}
              type="button"
            >
              {signingOut ? ui.common.signingOut : ui.common.logOut}
            </button>
          </div>
        </>
      )}

      <div className="fp-foot">
        <div className="fp-links">
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

// -----------------------------------------------------------
// END OF FILE - app/haullegal/account/page.tsx (v2 - Spanish
// switch; ownership status, Stripe portal door, log out)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
