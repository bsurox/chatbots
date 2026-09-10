// FILE: app/wiremanprep/thanks/page.tsx
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

// Where WiremanPrep buyers land after Stripe says yes (v1). Same
// doctrine as the ForemanPrep thanks page: the webhook usually
// grants access before this page finishes loading, so we poll the
// access API a few times and the status line flips to confirmed
// without the buyer doing anything; if Stripe's webhook is having
// a slow minute, the copy says so instead of looking broken.
// v2 - PRODUCT-AWARE: checkout v2's success URL carries
// ?product=wm|wj|wr, read from window.location inside an effect
// (never in render, and no useSearchParams - that would demand a
// Suspense boundary at prerender). The poll checks the matching
// access flag and the doors point at the matching rooms. No
// ad-pixel
// purchase ping yet - there is no WiremanPrep analytics island;
// when pixels arrive, this page gains the same
// sessionStorage-guarded, session-id-deduped tracking call the
// ForemanPrep page carries. The doors inherit electric yellow
// from the layout's .wm-zone - no extra dress needed.
// No Date.now()/Math.random() in render (Next 16 prerender rule).

type WmProduct = "wm" | "wj" | "wr";

const ROOMS: Record<WmProduct, { practice: string; exam: string; owned: string }> = {
  wm: {
    practice: "/wiremanprep/practice",
    exam: "/wiremanprep/exam",
    owned: "Full Access is active on your account. Time to get to work.",
  },
  wj: {
    practice: "/wiremanprep/journeyman",
    exam: "/wiremanprep/journeyman-exam",
    owned: "Journeyman prep is active on your account. Time to get to work.",
  },
  wr: {
    practice: "/wiremanprep/residential",
    exam: "/wiremanprep/residential-exam",
    owned: "Residential prep is active on your account. Time to get to work.",
  },
};

export default function WiremanThanksPage() {
  const [confirmed, setConfirmed] = useState(false);
  const [checks, setChecks] = useState(0);
  const [product, setProduct] = useState<WmProduct>("wm");

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("product");
    if (p === "wj" || p === "wr") setProduct(p);
  }, []);

  useEffect(() => {
    if (confirmed || checks >= 5) return;
    const t = setTimeout(() => {
      fetch("/wiremanprep/api/access")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          const owned =
            product === "wj" ? data?.wj : product === "wr" ? data?.wr : data?.paid;
          if (owned) setConfirmed(true);
          setChecks((c) => c + 1);
        })
        .catch(() => setChecks((c) => c + 1));
    }, checks === 0 ? 400 : 1600);
    return () => clearTimeout(t);
  }, [checks, confirmed, product]);

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
            ? ROOMS[product].owned
            : "Payment received - your access is activating now. If things still look locked in a minute, refresh this page."}
        </p>
        <div className="fp-authrow">
          <Link className="fp-authbtn" href={ROOMS[product].practice}>
            Start practicing
          </Link>
          <Link className="fp-authbtn exam" href={ROOMS[product].exam}>
            Take a full exam
          </Link>
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
// END OF FILE - app/wiremanprep/thanks/page.tsx (v2 - product-
// aware: polls the right flag, doors open the right rooms)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
