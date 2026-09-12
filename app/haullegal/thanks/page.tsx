// FILE: app/haullegal/thanks/page.tsx
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HL_UI, useHlLang } from "@/lib/haullegal/i18n";

// Where HaulLegal buyers land after Stripe says yes (v4 - a "Your
// account (manage or cancel)" button under the receipt line, so the
// buyer sees where to cancel the moment the trial starts.)
// v3 notes - SPANISH:
// every string comes from lib/haullegal/i18n.ts through the
// hl-lang switch the buyer set before checkout; no pill here, the
// page is a receipt screen.)
// v2 notes - the BUNDLE: checkout v2 sends ?product=bundle when the
// walkthrough came with the free month attached; that lands as
// "You're in" plus "Stay Legal is on, free for 30 days" with doors
// to the walkthrough and the calendar - no trial button needed.
// ?product=walkthrough (the walkthrough alone, only for accounts
// already subscribed) and ?product=staylegal keep their v1 screens.
// v1 notes - same doctrine as the prep thanks pages: the webhook
// usually records the purchase before this page finishes loading,
// so we poll the access API a few times and the status line flips
// to confirmed without the buyer doing anything; if Stripe's
// webhook is having a slow minute, the copy says so instead of
// looking broken. PRODUCT-AWARE: a walkthrough buyer is confirmed
// by "paid" and offered the free 30 days of Stay Legal right here;
// a Stay Legal buyer is confirmed by "sub" and sent to the
// calendar. The product is read from the URL inside useEffect,
// never during render (Next 16 prerender rule). No pixels yet.

type Product = "bundle" | "walkthrough" | "staylegal";

export default function HaulLegalThanksPage() {
  const [product, setProduct] = useState<Product>("bundle");
  const [confirmed, setConfirmed] = useState(false);
  const [alreadySub, setAlreadySub] = useState(false);
  const [checks, setChecks] = useState(0);
  const [starting, setStarting] = useState(false);
  const [err, setErr] = useState("");
  const [lang] = useHlLang();
  const t = HL_UI[lang].thanks;

  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search).get("product");
      if (p === "staylegal") setProduct("staylegal");
      else if (p === "walkthrough") setProduct("walkthrough");
    } catch {
      // no query string - default is the bundle
    }
  }, []);

  useEffect(() => {
    if (confirmed || checks >= 5) return;
    const timer = setTimeout(() => {
      fetch("/haullegal/api/access")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.sub) setAlreadySub(true);
          if (product === "staylegal" ? data?.sub : data?.paid) setConfirmed(true);
          setChecks((c) => c + 1);
        })
        .catch(() => setChecks((c) => c + 1));
    }, checks === 0 ? 400 : 1600);
    return () => clearTimeout(timer);
  }, [checks, confirmed, product]);

  async function startTrial() {
    if (starting) return;
    setStarting(true);
    setErr("");
    try {
      const res = await fetch("/haullegal/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: "staylegal", lang }),
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
      setErr(t.err);
      setStarting(false);
    } catch {
      setErr(t.err);
      setStarting(false);
    }
  }

  const isStay = product === "staylegal";
  const isBundle = product === "bundle";

  return (
    <div className="fp-wrap">
      <div className="fp-thanks">
        <div className="fp-thanksmark">
          <svg viewBox="0 0 100 100">
            <circle className="draw c1" cx="50" cy="50" pathLength={100} r="44" />
            <path className="draw c2" d="M29 52 L45 67 L73 35" pathLength={100} />
          </svg>
        </div>
        <p className="fp-thanksh">{isStay ? t.remindersOn : t.youreIn}</p>
        <p className="fp-thankssub">
          {confirmed ? (isStay ? t.subActive : isBundle ? t.bundleActive : t.walkUnlocked) : t.activating}
        </p>
        <div className="fp-authrow">
          {isStay ? (
            <>
              <Link className="fp-authbtn" href="/haullegal/calendar">
                {t.openMyCal}
              </Link>
              <Link className="fp-authbtn ghost" href="/haullegal/start">
                {t.backToWalk}
              </Link>
            </>
          ) : (
            <>
              <Link className="fp-authbtn" href="/haullegal/start">
                {t.openWalk}
              </Link>
              {alreadySub || isBundle ? (
                <Link className="fp-authbtn exam" href="/haullegal/calendar">
                  {t.openMyCal}
                </Link>
              ) : (
                <button className="fp-authbtn exam" disabled={starting} onClick={startTrial} type="button">
                  {starting ? t.openingCheckout : t.startTrial}
                </button>
              )}
            </>
          )}
        </div>
        {err ? <p className="fp-buyerr">{err}</p> : null}
        <p className="fp-buynote">{isStay || isBundle ? t.receiptStay : t.receiptWalk}</p>
        <div className="fp-authrow">
          <Link className="fp-authbtn ghost" href="/haullegal/account">
            {t.accountBtn}
          </Link>
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------
// END OF FILE - app/haullegal/thanks/page.tsx (v4 - account
// button; Spanish switch; bundle screen: walkthrough + Stay Legal
// trial confirmed together)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
