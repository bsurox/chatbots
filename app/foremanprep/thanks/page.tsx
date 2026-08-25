// FILE: app/foremanprep/thanks/page.tsx
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fpTrackPurchase } from "../analytics";

// Where buyers land after Stripe says yes. The webhook usually
// grants access before this page finishes loading; we poll the
// access API a few times so the status line flips to confirmed
// without the buyer doing anything. If Stripe's webhook is having
// a slow minute, the copy says so instead of looking broken.
// v3 notes: reports the purchase to Google Ads + Meta exactly once,
// only on a real Stripe redirect (paid=1), guarded by
// sessionStorage against refreshes, with the Stripe session id as
// the transaction id so ad platforms can dedupe on their end too.
// v4: product-aware. Checkout appends &product=bl on Business &
// Law purchases; this page then tracks the $79 value, polls the
// access API's bl flag instead of paid, and swaps the copy and
// buttons to point at the B&L practice room. With no product param
// everything reads exactly as v3 did.

export default function ThanksPage() {
  const [confirmed, setConfirmed] = useState(false);
  const [checks, setChecks] = useState(0);
  const [isBl, setIsBl] = useState(false);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("product") === "bl") setIsBl(true);
      if (params.get("paid") !== "1") return;
      if (window.sessionStorage.getItem("fp-purchase-tracked")) return;
      window.sessionStorage.setItem("fp-purchase-tracked", "1");
      fpTrackPurchase(
        params.get("session_id") || "",
        params.get("product") === "bl" ? "bl" : undefined
      );
    } catch {
      // Tracking must never break the thanks page.
    }
  }, []);

  useEffect(() => {
    if (confirmed || checks >= 5) return;
    const t = setTimeout(() => {
      fetch("/foremanprep/api/access")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          const owned = isBl ? data?.bl : data?.paid;
          if (owned) setConfirmed(true);
          setChecks((c) => c + 1);
        })
        .catch(() => setChecks((c) => c + 1));
    }, checks === 0 ? 400 : 1600);
    return () => clearTimeout(t);
  }, [checks, confirmed, isBl]);

  return (
    <div className="fp-wrap">
      <div className="fp-thanks">
        <div className="fp-thanksmark">
          <svg viewBox="0 0 100 100">
            <circle className="draw c1" cx="50" cy="50" pathLength={100} r="44" />
            <path className="draw c2" d="M29 52 L45 67 L73 35" pathLength={100} />
          </svg>
        </div>
        <p className="fp-thanksh">You're in.</p>
        <p className="fp-thankssub">
          {confirmed
            ? isBl
              ? "Business & Law prep is active on your account. Time to get to work."
              : "Full Access is active on your account. Time to get to work."
            : "Payment received - your access is activating now. If things still look locked in a minute, refresh this page."}
        </p>
        <div className="fp-authrow">
          {isBl ? (
            <Link className="fp-authbtn" href="/foremanprep/bl">
              Start Business & Law practice
            </Link>
          ) : (
            <>
              <Link className="fp-authbtn" href="/foremanprep/practice">
                Start practicing
              </Link>
              <Link className="fp-authbtn exam" href="/foremanprep/exam">
                Take a full exam
              </Link>
            </>
          )}
        </div>
        <p className="fp-buynote">
          A receipt is on its way to your email. Study from any device - just
          sign in with this account.
        </p>
      </div>
    </div>
  );
}

// -----------------------------------------------------------
// END OF FILE - app/foremanprep/thanks/page.tsx (v4 - product-
// aware: B&L purchases confirm, track, and route to /bl)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
