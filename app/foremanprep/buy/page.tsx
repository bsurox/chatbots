// FILE: app/foremanprep/buy/page.tsx
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fpTrackBeginCheckout } from "../analytics";

// The ForemanPrep storefront v8. BUILD FIX: same Next 16 rule as
// landing v16 - no Date.now() during client render, so the clock
// read moved into a useEffect (earlyBird starts true, corrects
// after hydration once Sept 7 has passed). The charge itself was
// always server-side in checkout v5. One product, one price: Full
// Access - $99 early bird until Sept 7, 2026, 11:59 PM Mountain,
// $149 from that moment on. v7 makes the page read the clock
// (PRICE_FLIP_MS, same constant as checkout v5 and landing v14):
// the big price, the buy button, the header chip, and a new
// deadline line under the price all flip themselves at 11:59 PM -
// no midnight commit. Checkout v5 is the charge authority.
// Earlier notes: Signed-out visitors get
// the auth doors first - the purchase must attach to a real
// account. The checkout route guards against double-buying. v2:
// the guarantee note links the full conditions in the Terms, and
// the footer carries the branded Terms/Privacy links - a buyer can
// never say the conditions were hidden. v3: the back link wears
// the two-tone wordmark, and the refund note names the support
// email so a claim always has somewhere to go. v4: the back link
// rides in the .fp-backpill chevron pill, matching the practice
// and exam back buttons. v6: the buy click pings Meta
// (InitiateCheckout) before handing off to Stripe, so the ad
// platform learns from shoppers, not just completed buyers.

type Access = { loggedIn: boolean; paid: boolean };

// Sept 7, 2026, 11:59 PM MDT (UTC-6) = Sept 8, 05:59 UTC.
// Month index 8 = September.
const PRICE_FLIP_MS = Date.UTC(2026, 8, 8, 5, 59, 0);

const FEATURES = [
  "156 practice questions written to the real 12-subject exam outline - and growing",
  "Full 115-question exam simulator on the true 5.5-hour clock",
  "AI tutor on every question - plain answers that point to the exact book and page",
  "Every subject, every round length, unlimited practice",
  "Book-and-page citations that train the open-book skill the exam really tests",
  "Pass guarantee: finish the course and fail the real exam? Full refund.",
];

export default function BuyPage() {
  const [access, setAccess] = useState<Access | null>(null);
  const [buying, setBuying] = useState(false);
  const [err, setErr] = useState("");
  const [earlyBird, setEarlyBird] = useState(true);

  useEffect(() => {
    if (Date.now() >= PRICE_FLIP_MS) setEarlyBird(false);
  }, []);

  useEffect(() => {
    fetch("/foremanprep/api/access")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setAccess({ loggedIn: Boolean(data.loggedIn), paid: Boolean(data.paid) });
        else setAccess({ loggedIn: false, paid: false });
      })
      .catch(() => setAccess({ loggedIn: false, paid: false }));
  }, []);

  async function buy() {
    if (buying) return;
    setBuying(true);
    setErr("");
    fpTrackBeginCheckout();
    try {
      const res = await fetch("/foremanprep/api/checkout", { method: "POST" });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.url) {
        window.location.href = data.url;
        return;
      }
      if (res.ok && data?.already) {
        setAccess({ loggedIn: true, paid: true });
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
        <Link className="fp-backpill" href="/foremanprep">
          Back to{" "}
          <span className="fp-wordmark">
            Foreman<span>Prep</span>
          </span>
        </Link>
        {earlyBird ? <div className="fp-chip">Early bird ends Sept 7</div> : null}
      </div>

      <div className="fp-buycard">
        <p className="fp-buyh">ForemanPrep Full Access</p>
        <p className="fp-buysub">
          Everything you need to walk into the NASCLA Commercial General
          Building Contractor exam ready - built around the real 115-question,
          open-book test.
        </p>
        <div className="fp-pricebig">
          {earlyBird ? (
            <>
              <span className="fp-pricenow">$99</span>
              <span className="fp-pricewas">$149</span>
            </>
          ) : (
            <span className="fp-pricenow">$149</span>
          )}
        </div>
        <p className="fp-pricetag">
          One-time payment. No subscription. Prep courses charge $349 to
          $1,490.
        </p>
        {earlyBird ? (
          <p className="fp-deadnote">
            Early-bird price ends Monday, Sept 7 - then it's $149
          </p>
        ) : null}
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
              <Link className="fp-authbtn" href="/foremanprep/practice">
                Go practice
              </Link>
              <Link className="fp-authbtn exam" href="/foremanprep/exam">
                Take the exam simulator
              </Link>
            </div>
          </div>
        ) : access.loggedIn ? (
          <>
            <button className="fp-buybtn" disabled={buying} onClick={buy} type="button">
              {buying ? "Opening secure checkout..." : earlyBird ? "Get Full Access - $99" : "Get Full Access - $149"}
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
          ASKEVO* FOREMANPREP. Your purchase attaches to your account, so
          you can study from any device. Pass guarantee: complete the
          course, and if you fail the real exam, email support for a full
          refund at support@askevo.ai. Conditions apply - see the{" "}
          <Link className="fp-link" href="/foremanprep/terms">
            full pass guarantee terms
          </Link>
          .
        </p>
      </div>

      <div className="fp-foot">
        <div className="fp-links">
          <Link className="fp-link" href="/foremanprep/terms">
            Terms
          </Link>
          <Link className="fp-link" href="/foremanprep/privacy">
            Privacy
          </Link>
        </div>
        <p className="fp-legal">
          ForemanPrep is a product of AskEvo LLC, Boise, Idaho. Not affiliated
          with or endorsed by NASCLA or PSI. Questions: support@askevo.ai
        </p>
      </div>
    </div>
  );
}

// -----------------------------------------------------------
// END OF FILE - app/foremanprep/buy/page.tsx (v8 - clock read
// moved into an effect so the Next 16 prerender passes)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
