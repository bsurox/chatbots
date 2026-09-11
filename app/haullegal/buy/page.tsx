// FILE: app/haullegal/buy/page.tsx
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

// The HaulLegal storefront (v2 - THE FREE MONTH IS IN THE CARD, his
// spec: the walkthrough card now says outright that it includes the
// first 30 days of Stay Legal, then $39 a month until canceled, and
// the fine print under the button repeats it. Checkout v2 charges
// exactly that in one Stripe session. Card 2 (Stay Legal alone, $39
// a month, no trial) stays for people who only want the calendar or
// who canceled and want back in.)
// v1 notes: two cards, both flat, no clock.
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
  "Includes your first 30 days of Stay Legal free - the deadline calendar with email reminders",
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
          One-time payment, plus your first month of Stay Legal free (then
          $39 a month, cancel any time). Filing services charge $300 to $995
          to do these same clicks for you - and since Motus, you still have
          to do the ID check yourself.
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
          <>
            <button className="fp-buybtn" disabled={buying !== null} onClick={() => buy("walkthrough")} type="button">
              {buying === "walkthrough" ? "Opening secure checkout..." : "Get the walkthrough - $249"}
            </button>
            <p className="fp-buynote">
              {access.sub
                ? "Stay Legal is already running on your account, so this charges the $249 walkthrough only."
                : "$249 today. Stay Legal starts free and bills $39 a month after 30 days until you cancel - one click from your account page, any time before then and you pay nothing more."}
            </p>
          </>
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
          Cancel any time. Included free for 30 days with the walkthrough
          above; on its own it starts today. Monthly compliance services
          charge $49.50 to $247.
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
            {buying === "staylegal" ? "Opening secure checkout..." : "Get Stay Legal - $39 / month"}
          </button>
        ) : (
          doors
        )}
        {err ? <p className="fp-buyerr">{err}</p> : null}
        <p className="fp-buynote">
          Secure checkout by Stripe - charges read ASKEVO on your card
          statement. Purchases attach to your account, so you can use them
          from any device. Questions: support@askevo.ai
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
// END OF FILE - app/haullegal/buy/page.tsx (v2 - walkthrough card
// carries the free first month + auto-renew fine print; Stay Legal
// alone card; auth doors; owned states)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
