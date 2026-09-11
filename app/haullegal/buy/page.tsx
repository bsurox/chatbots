// FILE: app/haullegal/buy/page.tsx
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

// The HaulLegal storefront (v1) - two cards, both flat, no clock.
// Card 1: the launch walkthrough, $249 one time. Card 2: Stay Legal,
// $39 a month, cancel any time, first 30 days free when the account
// owns the walkthrough (the checkout route decides the trial from
// the account, so the card copy and the charge always agree).
// Doctrine carried over from the prep storefronts: signed-out
// visitors get the auth doors first (a purchase must attach to a
// real account), the checkout route is the charge authority and
// guards double-buying, owners see their doors instead of a buy
// button. No ad-pixel call - there is no HaulLegal analytics
// island yet. ?product=staylegal in the URL scrolls nothing and
// changes nothing in v1 except which button the thanks page points
// people to - kept simple on purpose.
// No Date.now()/Math.random() in render (Next 16 prerender rule).

type Access = { loggedIn: boolean; paid: boolean; sub: boolean };
type Product = "walkthrough" | "staylegal";

const WALK_FEATURES = [
  "All 23 steps, in order, from forming the business to your first paid load",
  "The real government fee beside every step - USDOT $0, authority $300, UCR $46",
  "Motus walkthrough: Login.gov, the phone ID check, what every Pending status means",
  "The mistakes FMCSA itself warns about, and the citation for every rule",
  "One-click links to the official page for each step - you do every filing yourself",
  "Check-off progress that follows you between your phone and your laptop",
];

const STAY_FEATURES = [
  "Your biennial update month, worked out from your USDOT number",
  "IFTA quarters, UCR, Form 2290, medical card, annual inspections, the New Entrant audit",
  "Kentucky, New Mexico, New York and Oregon by-the-mile filings when you run there",
  "Email reminders 30 days, 7 days and 1 day before every deadline",
  "Saved to your account - update a date once, the calendar moves with it",
  "Cancel any time from your account page",
];

export default function HaulLegalBuyPage() {
  const [access, setAccess] = useState<Access | null>(null);
  const [buying, setBuying] = useState<Product | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    fetch("/haullegal/api/access")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setAccess({ loggedIn: Boolean(data.loggedIn), paid: Boolean(data.paid), sub: Boolean(data.sub) });
        } else {
          setAccess({ loggedIn: false, paid: false, sub: false });
        }
      })
      .catch(() => setAccess({ loggedIn: false, paid: false, sub: false }));
  }, []);

  async function buy(product: Product) {
    if (buying) return;
    setBuying(product);
    setErr("");
    try {
      const res = await fetch("/haullegal/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.url) {
        window.location.href = data.url;
        return;
      }
      if (res.ok && data?.already) {
        setAccess((a) =>
          a ? { ...a, loggedIn: true, paid: product === "walkthrough" ? true : a.paid, sub: product === "staylegal" ? true : a.sub } : a
        );
        setBuying(null);
        return;
      }
      if (res.status === 401 || res.status === 403) {
        setAccess({ loggedIn: false, paid: false, sub: false });
        setBuying(null);
        return;
      }
      setErr("Could not start checkout - please try again.");
      setBuying(null);
    } catch {
      setErr("Could not start checkout - please try again.");
      setBuying(null);
    }
  }

  const doors = (
    <div className="fp-authrow">
      <Link className="fp-authbtn" href="/register">
        Create your account to buy
      </Link>
      <Link className="fp-authbtn ghost" href="/login">
        I already have an account
      </Link>
    </div>
  );

  return (
    <div className="fp-wrap">
      <div className="fp-top">
        <Link className="fp-backpill" href="/haullegal">
          Back to{" "}
          <span className="fp-wordmark">
            Haul<span>Legal</span>
          </span>
        </Link>
      </div>

      <div className="fp-buycard">
        <p className="fp-buyh">Launch walkthrough</p>
        <p className="fp-buysub">
          Every registration a new trucking company needs, in the order it
          happens, at the real government prices - built for the Motus
          system FMCSA switched to in May 2026.
        </p>
        <div className="fp-pricebig">
          <span className="fp-pricenow">$249</span>
        </div>
        <p className="fp-pricetag">
          One-time payment. Filing services charge $300 to $995 to do these
          same clicks for you - and since Motus, you still have to do the ID
          check yourself.
        </p>
        <div className="fp-feats">
          {WALK_FEATURES.map((f) => (
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
            <p className="fp-ownedh">You own the walkthrough.</p>
            <div className="fp-authrow">
              <Link className="fp-authbtn" href="/haullegal/start">
                Open the walkthrough
              </Link>
            </div>
          </div>
        ) : access.loggedIn ? (
          <button className="fp-buybtn" disabled={buying !== null} onClick={() => buy("walkthrough")} type="button">
            {buying === "walkthrough" ? "Opening secure checkout..." : "Get the walkthrough - $249"}
          </button>
        ) : (
          doors
        )}
      </div>

      <div className="fp-buycard" style={{ marginTop: "18px" }}>
        <p className="fp-buyh">Stay Legal</p>
        <p className="fp-buysub">
          The deadline calendar that remembers everything after your authority
          goes active - and emails you before each date.
        </p>
        <div className="fp-pricebig">
          <span className="fp-pricenow">$39</span>
          <span className="fp-pricewas" style={{ textDecoration: "none" }}>/ month</span>
        </div>
        <p className="fp-pricetag">
          {access?.paid
            ? "Your first 30 days are free - you own the walkthrough. Cancel any time."
            : "First 30 days free with the walkthrough. Cancel any time. Monthly compliance services charge $49.50 to $247."}
        </p>
        <div className="fp-feats">
          {STAY_FEATURES.map((f) => (
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
        ) : access.sub ? (
          <div className="fp-owned">
            <p className="fp-ownedh">Stay Legal is on.</p>
            <div className="fp-authrow">
              <Link className="fp-authbtn" href="/haullegal/calendar">
                Open the calendar
              </Link>
              <Link className="fp-authbtn ghost" href="/haullegal/account">
                Manage subscription
              </Link>
            </div>
          </div>
        ) : access.loggedIn ? (
          <button className="fp-buybtn" disabled={buying !== null} onClick={() => buy("staylegal")} type="button">
            {buying === "staylegal"
              ? "Opening secure checkout..."
              : access.paid
                ? "Start my free 30 days"
                : "Get Stay Legal - $39 / month"}
          </button>
        ) : (
          doors
        )}
        {err ? <p className="fp-buyerr">{err}</p> : null}
        <p className="fp-buynote">
          Secure checkout by Stripe - the walkthrough charge reads ASKEVO*
          HAULLEGAL on your statement. Purchases attach to your account, so
          you can use them from any device. Questions: support@askevo.ai
        </p>
      </div>

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
          HaulLegal is a product of AskEvo LLC, Boise, Idaho. Not a government
          agency, not a law firm. We never file on your behalf. Questions:
          support@askevo.ai
        </p>
      </div>
    </div>
  );
}

// -----------------------------------------------------------
// END OF FILE - app/haullegal/buy/page.tsx (v1 - two cards:
// walkthrough $249 one-time, Stay Legal $39/mo w/ free first
// month for owners; auth doors; owned states)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
