// FILE: app/foremanprep/thanks/page.tsx
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

// Where buyers land after Stripe says yes. The webhook usually
// grants access before this page finishes loading; we poll the
// access API a few times so the status line flips to confirmed
// without the buyer doing anything. If Stripe's webhook is having
// a slow minute, the copy says so instead of looking broken.

export default function ThanksPage() {
  const [confirmed, setConfirmed] = useState(false);
  const [checks, setChecks] = useState(0);

  useEffect(() => {
    if (confirmed || checks >= 5) return;
    const t = setTimeout(() => {
      fetch("/foremanprep/api/access")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.paid) setConfirmed(true);
          setChecks((c) => c + 1);
        })
        .catch(() => setChecks((c) => c + 1));
    }, checks === 0 ? 400 : 1600);
    return () => clearTimeout(t);
  }, [checks, confirmed]);

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
            ? "Full Access is active on your account. Time to get to work."
            : "Payment received - your access is activating now. If things still look locked in a minute, refresh this page."}
        </p>
        <div className="fp-authrow">
          <Link className="fp-authbtn" href="/foremanprep/practice">
            Start practicing
          </Link>
          <Link className="fp-authbtn ghost" href="/foremanprep/exam">
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
// END OF FILE - app/foremanprep/thanks/page.tsx (v1 - welcome)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
