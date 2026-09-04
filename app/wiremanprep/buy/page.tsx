// FILE: app/wiremanprep/buy/page.tsx
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

// The WiremanPrep storefront (v1) - one product, one card, $149
// flat. Modeled on the ForemanPrep storefront's buy flow but with
// none of the early-bird clock machinery (no flip constant, no
// strike-through price) and no second card - Journeyman and
// Residential become cards here when those products exist.
// Doctrine carried over: signed-out visitors get the auth doors
// first (a purchase must attach to a real account), the checkout
// route is the charge authority and guards double-buying, owners
// see their doors instead of a buy button. No ad-pixel call yet -
// there is no WiremanPrep analytics island to ping (that arrives
// with the pixels).
// The PASS GUARANTEE is deliberately NOT claimed on this card or
// in the fine print - his call pending, same as B&L v1's silence.
// No Date.now()/Math.random() in render (Next 16 prerender rule).

type Access = { loggedIn: boolean; paid: boolean };

const FEATURES = [
  "153 practice questions written to the official 9-subject exam outline - and growing",
  "Full 100-question exam simulator on the true 4.5-hour clock, drawn at the real subject weights",
  "AI tutor on every question - plain answers that point to the exact Code section",
  "Works with YOUR Code book - every question has the same answer in the 2020 and 2023 NEC",
  "Code-section citations that train the open-book look-up skill the exam really tests",
  "1:1 exam-pace practice timer - 2 min 42 sec a question, the real pace",
  "Every subject, every round length, unlimited practice, progress saved to your account",
];

export default function WiremanBuyPage() {
  const [access, setAccess] = useState<Access | null>(null);
  const [buying, setBuying] = useState(false);
  const [err, setErr] = useState("");

  function loadAccess() {
    fetch("/wiremanprep/api/access")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setAccess({
            loggedIn: Boolean(data.loggedIn),
            paid: Boolean(data.paid),
          });
        } else {
          setAccess({ loggedIn: false, paid: false });
        }
      })
      .catch(() => setAccess({ loggedIn: false, paid: false }));
  }

  useEffect(() => {
    loadAccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function buy() {
    if (buying) return;
    setBuying(true);
    setErr("");
    try {
      const res = await fetch("/wiremanprep/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.url) {
        window.location.href = data.url;
        return;
      }
      if (res.ok && data?.already) {
        setAccess((a) => (a ? { ...a, loggedIn: true, paid: true } : a));
        setBuying(false);
        return;
      }
      if (res.status === 401 || res.status === 403) {
        setAccess({ loggedIn: false, paid: false });
        setBuying(false);
        return;
      }
      setErr("Could not start checkout - please try again.");
      setBuying(false);
    } catch {
      setErr("Could not start checkout - please try again.");
      setBuying(false);
    }
  }

  return (
    <div className="fp-wrap">
      <div className="fp-top">
        <Link className="fp-backpill" href="/wiremanprep">
          Back to{" "}
          <span className="fp-wordmark">
            Wireman<span>Prep</span>
          </span>
        </Link>
      </div>

      <div className="fp-buycard">
        <p className="fp-buyh">WiremanPrep Full Access</p>
        <p className="fp-buysub">
          Everything you need to walk into the NASCLA Master/Unlimited
          Electrical Contractor exam ready - built around the real
          100-question, open-book test.
        </p>
        <div className="fp-pricebig">
          <span className="fp-pricenow">$149</span>
        </div>
        <p className="fp-pricetag">
          One-time payment. No subscription. Electrical prep courses charge
          $195 to $1,900.
        </p>
        <div className="fp-feats">
          {FEATURES.map((f) => (
            <div className="fp-feat" key={f}>
              <b>+</b>
              <span>{f}</span>
            </div>
          ))}
        </div>

        {access === null ? (
          <button className="fp-buybtn" disabled type="button">
            Loading...
          </button>
        ) : access.paid ? (
          <div className="fp-owned">
            <p className="fp-ownedh">You already own Full Access.</p>
            <div className="fp-authrow">
              <Link className="fp-authbtn" href="/wiremanprep/practice">
                Go practice
              </Link>
              <Link className="fp-authbtn exam" href="/wiremanprep/exam">
                Take the exam simulator
              </Link>
            </div>
          </div>
        ) : access.loggedIn ? (
          <>
            <button
              className="fp-buybtn"
              disabled={buying}
              onClick={buy}
              type="button"
            >
              {buying ? "Opening secure checkout..." : "Get Full Access - $149"}
            </button>
            {err ? <p className="fp-buyerr">{err}</p> : null}
          </>
        ) : (
          <div className="fp-authrow">
            <Link className="fp-authbtn" href="/register">
              Create your account to buy
            </Link>
            <Link className="fp-authbtn ghost" href="/login">
              I already have an account
            </Link>
          </div>
        )}

        <p className="fp-buynote">
          Secure checkout by Stripe - your card statement will read
          ASKEVO* WIREMANPREP. Your purchase attaches to your account, so
          you can study from any device. Questions: support@askevo.ai
        </p>
      </div>

      <div className="fp-foot">
        <div className="fp-links">
          <Link className="fp-link" href="/wiremanprep/terms">
            Terms
          </Link>
          <Link className="fp-link" href="/wiremanprep/privacy">
            Privacy
          </Link>
        </div>
        <p className="fp-legal">
          WiremanPrep is a product of AskEvo LLC, Boise, Idaho. Not
          affiliated with or endorsed by NASCLA or PSI. Questions:
          support@askevo.ai
        </p>
      </div>
    </div>
  );
}

// -----------------------------------------------------------
// END OF FILE - app/wiremanprep/buy/page.tsx (v1 - one card,
// $149 flat, auth doors, no guarantee claimed yet)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
