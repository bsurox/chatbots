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
// v6: the B&L doors wear B&L blue (his screenshot - the Start
// Business & Law practice button was white). Both blue buttons
// carry .fp-blzone directly on the element, which re-points
// var(--fp) to sky blue for the .exam dress: the B&L purchase's
// single button goes solid blue, and the bundle's Business & Law
// room button trades its orange for blue too - anything B&L is
// blue, per the brand doctrine. GC buttons untouched.
// v3 notes: reports the purchase to Google Ads + Meta exactly once,
// only on a real Stripe redirect (paid=1), guarded by
// sessionStorage against refreshes, with the Stripe session id as
// the transaction id so ad platforms can dedupe on their end too.
// v4 notes: product-aware - checkout appends the product param on
// B&L purchases and this page confirms, tracks, and routes
// accordingly.
// v5: the bundle. product=bundle confirms only when BOTH
// entitlements are live, tracks the summed value, and shows both
// doors - practice and Business & Law. Plain Full Access
// purchases still read exactly like v3.

type Product = "gc" | "bl" | "bundle";

export default function ThanksPage() {
  const [confirmed, setConfirmed] = useState(false);
  const [checks, setChecks] = useState(0);
  const [product, setProduct] = useState<Product>("gc");

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const p = params.get("product");
      const bought: Product = p === "bl" ? "bl" : p === "bundle" ? "bundle" : "gc";
      setProduct(bought);
      if (params.get("paid") !== "1") return;
      if (window.sessionStorage.getItem("fp-purchase-tracked")) return;
      window.sessionStorage.setItem("fp-purchase-tracked", "1");
      fpTrackPurchase(
        params.get("session_id") || "",
        bought === "gc" ? undefined : bought
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
          const owned =
            product === "bl"
              ? data?.bl
              : product === "bundle"
                ? data?.paid && data?.bl
                : data?.paid;
          if (owned) setConfirmed(true);
          setChecks((c) => c + 1);
        })
        .catch(() => setChecks((c) => c + 1));
    }, checks === 0 ? 400 : 1600);
    return () => clearTimeout(t);
  }, [checks, confirmed, product]);

  const confirmedLine =
    product === "bl"
      ? "Business & Law prep is active on your account. Time to get to work."
      : product === "bundle"
        ? "Full Access AND Business & Law are both active on your account. Time to get to work."
        : "Full Access is active on your account. Time to get to work.";

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
            ? confirmedLine
            : "Payment received - your access is activating now. If things still look locked in a minute, refresh this page."}
        </p>
        <div className="fp-authrow">
          {product === "bl" ? (
            <Link className="fp-authbtn exam fp-blzone" href="/foremanprep/bl">
              Start Business & Law practice
            </Link>
          ) : product === "bundle" ? (
            <>
              <Link className="fp-authbtn" href="/foremanprep/practice">
                Start practicing
              </Link>
              <Link className="fp-authbtn exam fp-blzone" href="/foremanprep/bl">
                Business & Law room
              </Link>
            </>
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
// END OF FILE - app/foremanprep/thanks/page.tsx (v6 - the B&L
// doors wear B&L blue)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
