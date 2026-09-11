// FILE: app/haullegal/account/page.tsx
"use client";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

// HaulLegal account page (v1) - the one place that answers "what
// do I own and how do I cancel". Shows the walkthrough status, the
// Stay Legal status straight from the access route (trialing /
// active / past_due / canceled and the paid-through date), a
// Manage-subscription button that opens Stripe's Customer Portal
// (card update, invoices, cancel - all self-serve, flowing back
// through the webhook), doors to the product pages, and Log out.
// Signed-out visitors get the auth doors. The portal button asks
// /haullegal/api/portal for a one-time URL; if the portal is not
// switched on in Stripe yet the button explains and points at
// support instead of failing silently.
// Dates are formatted inside the effect-fed state, never from the
// clock during render (Next 16 prerender rule).

type Access = { loggedIn: boolean; paid: boolean; sub: boolean; subStatus: string; periodEnd: string | null };

function statusLine(a: Access): string {
  const end = a.periodEnd ? a.periodEnd.slice(0, 10) : "";
  switch (a.subStatus) {
    case "trialing":
      return end ? `Free trial - your first charge is on ${end}.` : "Free trial.";
    case "active":
      return end ? `Active - renews on ${end}.` : "Active.";
    case "past_due":
      return "Payment failed - update your card to keep reminders going.";
    case "canceled":
      return a.sub && end ? `Canceled - reminders run through ${end}.` : "Canceled.";
    case "unpaid":
      return "Unpaid - update your card to restart reminders.";
    default:
      return "Not subscribed.";
  }
}

export default function HaulLegalAccountPage() {
  const [access, setAccess] = useState<Access | null>(null);
  const [opening, setOpening] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [note, setNote] = useState("");

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
      setNote("The billing page is not available right now - email support@askevo.ai and we will handle it the same day.");
      setOpening(false);
    } catch {
      setNote("The billing page is not available right now - email support@askevo.ai and we will handle it the same day.");
      setOpening(false);
    }
  }

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

      <div className="fp-badge">Your account</div>
      <h1 className="fp-h1" style={{ fontSize: "30px" }}>
        What you own, <span>and the switches.</span>
      </h1>

      {access === null ? (
        <p className="fp-sub">Loading...</p>
      ) : !access.loggedIn ? (
        <div className="fp-buycard">
          <p className="fp-buyh">Sign in to see your account</p>
          <p className="fp-buysub">Your purchases attach to your account, so sign in from any device.</p>
          <div className="fp-authrow">
            <Link className="fp-authbtn" href="/login">
              Log in
            </Link>
            <Link className="fp-authbtn ghost" href="/register">
              Create an account
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="fp-card">
            <p className="fp-cn">
              <span>+</span>Launch walkthrough
            </p>
            <p className="fp-cd">{access.paid ? "Owned. All 23 steps are unlocked." : "Not purchased yet."}</p>
            <div className="fp-try" style={{ margin: "12px 0 0" }}>
              {access.paid ? (
                <Link className="fp-try-btn" href="/haullegal/start">
                  Open the walkthrough
                </Link>
              ) : (
                <Link className="fp-try-btn" href="/haullegal/buy">
                  Get the walkthrough - $249
                </Link>
              )}
            </div>
          </div>

          <div className="fp-card" style={{ marginTop: "10px" }}>
            <p className="fp-cn">
              <span>+</span>Stay Legal
            </p>
            <p className="fp-cd">{statusLine(access)}</p>
            <div className="fp-try" style={{ margin: "12px 0 0" }}>
              {access.sub || access.subStatus !== "none" ? (
                <>
                  <Link className="fp-try-btn" href="/haullegal/calendar">
                    Open the calendar
                  </Link>
                  <button className="fp-try-btn ghost" disabled={opening} onClick={openPortal} type="button">
                    {opening ? "Opening..." : "Manage or cancel"}
                  </button>
                </>
              ) : (
                <Link className="fp-try-btn" href="/haullegal/buy">
                  {access.paid ? "Start my free 30 days" : "Get Stay Legal - $39 / month"}
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
              {signingOut ? "Signing out..." : "Log out"}
            </button>
          </div>
        </>
      )}

      <div className="fp-foot">
        <div className="fp-links">
          <Link className="fp-link" href="/haullegal/terms">
            Terms
          </Link>
          <Link className="fp-link" href="/haullegal/privacy">
            Privacy
          </Link>
        </div>
        <p className="fp-legal">
          Billing questions: support@askevo.ai. Card statements read ASKEVO*
          HAULLEGAL.
        </p>
      </div>
    </div>
  );
}

// -----------------------------------------------------------
// END OF FILE - app/haullegal/account/page.tsx (v1 - ownership
// status, Stripe portal door, log out)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
