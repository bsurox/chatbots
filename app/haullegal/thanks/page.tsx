// FILE: app/haullegal/thanks/page.tsx
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

// Where HaulLegal buyers land after Stripe says yes (v1). Same
// doctrine as the prep thanks pages: the webhook usually records
// the purchase before this page finishes loading, so we poll the
// access API a few times and the status line flips to confirmed
// without the buyer doing anything; if Stripe's webhook is having
// a slow minute, the copy says so instead of looking broken.
// PRODUCT-AWARE: the checkout route sends ?product=walkthrough or
// ?product=staylegal. A walkthrough buyer is confirmed by "paid",
// sent to the walkthrough, and offered the free 30 days of Stay
// Legal right here (one click into the subscription checkout with
// the trial the checkout route grants to walkthrough owners). A
// Stay Legal buyer is confirmed by "sub" and sent to the calendar.
// The product is read from the URL inside useEffect, never during
// render (Next 16 prerender rule). No pixels yet.

type Product = "walkthrough" | "staylegal";

export default function HaulLegalThanksPage() {
  const [product, setProduct] = useState<Product>("walkthrough");
  const [confirmed, setConfirmed] = useState(false);
  const [alreadySub, setAlreadySub] = useState(false);
  const [checks, setChecks] = useState(0);
  const [starting, setStarting] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search).get("product");
      if (p === "staylegal") setProduct("staylegal");
    } catch {
      // no query string - default is the walkthrough
    }
  }, []);

  useEffect(() => {
    if (confirmed || checks >= 5) return;
    const t = setTimeout(() => {
      fetch("/haullegal/api/access")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.sub) setAlreadySub(true);
          if (product === "staylegal" ? data?.sub : data?.paid) setConfirmed(true);
          setChecks((c) => c + 1);
        })
        .catch(() => setChecks((c) => c + 1));
    }, checks === 0 ? 400 : 1600);
    return () => clearTimeout(t);
  }, [checks, confirmed, product]);

  async function startTrial() {
    if (starting) return;
    setStarting(true);
    setErr("");
    try {
      const res = await fetch("/haullegal/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: "staylegal" }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.url) {
        window.location.href = data.url;
        return;
      }
      if (res.ok && data?.already) {
        setAlreadySub(true);
        setStarting(false);
        return;
      }
      setErr("Could not open checkout - try again from the buy page.");
      setStarting(false);
    } catch {
      setErr("Could not open checkout - try again from the buy page.");
      setStarting(false);
    }
  }

  const isStay = product === "staylegal";

  return (
    <div className="fp-wrap">
      <div className="fp-thanks">
        <div className="fp-thanksmark">
          <svg viewBox="0 0 100 100">
            <circle className="draw c1" cx="50" cy="50" pathLength={100} r="44" />
            <path className="draw c2" d="M29 52 L45 67 L73 35" pathLength={100} />
          </svg>
        </div>
        <p className="fp-thanksh">{isStay ? "Reminders are on." : "You're in."}</p>
        <p className="fp-thankssub">
          {confirmed
            ? isStay
              ? "Stay Legal is active on your account. Put your dates in and the calendar takes it from here."
              : "The full walkthrough is unlocked on your account. Time to get legal."
            : "Payment received - your access is activating now. If things still look locked in a minute, refresh this page."}
        </p>
        <div className="fp-authrow">
          {isStay ? (
            <>
              <Link className="fp-authbtn" href="/haullegal/calendar">
                Open my calendar
              </Link>
              <Link className="fp-authbtn ghost" href="/haullegal/start">
                Back to the walkthrough
              </Link>
            </>
          ) : (
            <>
              <Link className="fp-authbtn" href="/haullegal/start">
                Open the walkthrough
              </Link>
              {alreadySub ? (
                <Link className="fp-authbtn exam" href="/haullegal/calendar">
                  Open my calendar
                </Link>
              ) : (
                <button className="fp-authbtn exam" disabled={starting} onClick={startTrial} type="button">
                  {starting ? "Opening secure checkout..." : "Start my free 30 days of Stay Legal"}
                </button>
              )}
            </>
          )}
        </div>
        {err ? <p className="fp-buyerr">{err}</p> : null}
        <p className="fp-buynote">
          {isStay
            ? "A receipt is on its way to your email. Manage or cancel any time from your account page."
            : "A receipt is on its way to your email. The free 30 days needs a card on file and bills $39 a month after - cancel any time from your account page."}
        </p>
      </div>
    </div>
  );
}

// -----------------------------------------------------------
// END OF FILE - app/haullegal/thanks/page.tsx (v1 - product-
// aware confirmation, free-trial door for walkthrough buyers)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
