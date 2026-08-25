// FILE: app/foremanprep/buy/page.tsx
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fpTrackBeginCheckout } from "../analytics";

// The ForemanPrep storefront v12 - context-aware order + themes
// (his calls): (1) arriving with ?product=bl in the URL - every
// B&L buy button now links that way - puts the B&L card FIRST;
// plain arrivals keep Full Access first. (2) The B&L card wears
// the blue theme (.fp-blzone - border, price, and buy button all
// go sky blue). (3) The bundle card wears BOTH brands: a border,
// price, and button fading orange into blue (.fp-bundlecard).
// v11 notes: the BUNDLE card. Visitors who
// own NEITHER product get a third card: both courses in one
// checkout at exactly the two prices summed - $99 + $79 = $178
// until the Sept 7 flip, $149 + $79 = $228 after (no discount, no
// separate price to maintain; the card's numbers ride the same
// clock as everything else). It posts {"product":"bundle"} and
// checkout v7 builds a two-line-item Stripe session. The card
// hides itself the moment an account owns either piece - partial
// owners buy the missing half alone.
// v10 notes: the card you can still BUY rides on top (his catch:
// a Full Access owner clicking "Get Business & Law" landed on a
// card shouting "You already own Full Access"). Whichever product
// the account already owns sinks to the bottom; owns-neither and
// owns-both keep the normal order.
// v9 notes: two products, two cards. Card 1 is Full Access
// exactly as v8 built it: $99 early bird until Sept 7, 2026,
// 11:59 PM Mountain, $149 from that moment, clock read in an
// effect (Next 16 prerender rule), checkout is the charge
// authority. Card 2: Business & Law Prep at a flat $79. Each
// card's buy button posts {"product":"bl"} for B&L and nothing
// for Full Access, so checkout v6 charges the right thing.
// Owning one product never hides the other card (the webhook
// merges a second purchase into a bundle).
// v8 and earlier notes preserved: signed-out visitors get the
// auth doors first (a purchase must attach to a real account),
// the checkout route guards double-buying per product, the
// guarantee note links the Terms, buy clicks ping Meta
// (InitiateCheckout) with the right value before Stripe.

type Access = { loggedIn: boolean; paid: boolean; bl: boolean };

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

const BL_FEATURES = [
  "120 practice questions across all 10 Business & Law domains",
  "Contracts, lien law, payroll and taxes, insurance and bonding, estimating math, OSHA - the core every state's B&L exam draws from",
  "Instant explanations with citations on every question",
  "Unlimited rounds, fresh shuffles, progress saved to your account",
  "One-time $79 - no subscription, yours for good",
  "Already have the NASCLA GC course? This stacks onto the same account.",
];

export default function BuyPage() {
  const [access, setAccess] = useState<Access | null>(null);
  const [buying, setBuying] = useState<"gc" | "bl" | "bundle" | null>(null);
  const [err, setErr] = useState("");
  const [earlyBird, setEarlyBird] = useState(true);
  const [blFocus, setBlFocus] = useState(false);

  useEffect(() => {
    if (Date.now() >= PRICE_FLIP_MS) setEarlyBird(false);
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("product") === "bl") setBlFocus(true);
    } catch {
      // A bad URL should never break the store.
    }
  }, []);

  function loadAccess() {
    fetch("/foremanprep/api/access")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setAccess({
            loggedIn: Boolean(data.loggedIn),
            paid: Boolean(data.paid),
            bl: Boolean(data.bl),
          });
        } else {
          setAccess({ loggedIn: false, paid: false, bl: false });
        }
      })
      .catch(() => setAccess({ loggedIn: false, paid: false, bl: false }));
  }

  useEffect(() => {
    loadAccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function buy(product: "gc" | "bl" | "bundle") {
    if (buying !== null) return;
    setBuying(product);
    setErr("");
    fpTrackBeginCheckout(product === "gc" ? undefined : product);
    try {
      const res = await fetch("/foremanprep/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product === "gc" ? {} : { product }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.url) {
        window.location.href = data.url;
        return;
      }
      if (res.ok && data?.already) {
        // For a single product we know exactly what they own; for a
        // blocked bundle we re-ask the server rather than guess.
        if (product === "bundle") {
          loadAccess();
        } else {
          setAccess((a) =>
            a
              ? product === "bl"
                ? { ...a, loggedIn: true, bl: true }
                : { ...a, loggedIn: true, paid: true }
              : a
          );
        }
        setBuying(null);
        return;
      }
      if (res.status === 401 || res.status === 403) {
        setAccess({ loggedIn: false, paid: false, bl: false });
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

  // The buyable card renders first, and context wins: arriving
  // through any B&L door (?product=bl) puts the B&L card on top
  // immediately - so does being a Full Access owner who has not
  // bought B&L. Someone who already owns B&L never gets it first.
  const blFirst = blFocus
    ? !access?.bl
    : access !== null && access.paid && !access.bl;

  const gcCard = (
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
          <button
            className="fp-buybtn"
            disabled={buying !== null}
            onClick={() => buy("gc")}
            type="button"
          >
            {buying === "gc"
              ? "Opening secure checkout..."
              : earlyBird
                ? "Get Full Access - $99"
                : "Get Full Access - $149"}
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
  );

  const blCard = (
    <div className="fp-buycard fp-blzone">
      <p className="fp-buyh">Business &amp; Law Prep</p>
      <p className="fp-buysub">
        The trade exam is only half the license: most NASCLA states
        also require a separate Business &amp; Law exam. This is the
        drill room for it - the state-neutral core those exams are
        built on, with state-specific layers rolling out.
      </p>
      <div className="fp-pricebig">
        <span className="fp-pricenow">$79</span>
      </div>
      <p className="fp-pricetag">
        One-time payment. No subscription. B&amp;L courses run $195 to
        $295 - or $79 for practice questions that expire in 3 months.
        Ours don't expire.
      </p>
      <div className="fp-feats">
        {BL_FEATURES.map((f) => (
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
      ) : access.bl ? (
        <div className="fp-owned">
          <p className="fp-ownedh">You already own Business &amp; Law prep.</p>
          <div className="fp-authrow">
            <Link className="fp-authbtn" href="/foremanprep/bl">
              Go practice Business &amp; Law
            </Link>
          </div>
        </div>
      ) : access.loggedIn ? (
        <>
          <button
            className="fp-buybtn"
            disabled={buying !== null}
            onClick={() => buy("bl")}
            type="button"
          >
            {buying === "bl"
              ? "Opening secure checkout..."
              : "Get Business & Law Prep - $79"}
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
        Same secure Stripe checkout, same account, statement reads
        ASKEVO* FOREMANPREP. Want to look first? Try the free
        10-question sample on the{" "}
        <Link className="fp-link" href="/foremanprep/bl">
          Business &amp; Law practice page
        </Link>
        .
      </p>
    </div>
  );

  // The bundle card shows while access is still loading (most
  // visitors own nothing) and disappears the moment the account
  // owns either piece.
  const showBundle = access === null || (!access.paid && !access.bl);

  const bundleCard = (
    <div className="fp-buycard fp-bundlecard">
      <p className="fp-buyh">Get Both - Full Access + Business &amp; Law</p>
      <p className="fp-buysub">
        Most NASCLA states make you pass both exams. Buy the whole
        license in one checkout - the trade course and the Business
        &amp; Law course, on one account, one receipt.
      </p>
      <div className="fp-pricebig">
        <span className="fp-pricenow">{earlyBird ? "$178" : "$228"}</span>
      </div>
      <p className="fp-pricetag">
        {earlyBird
          ? "That's the $99 early bird plus the $79 - same price as buying separately, one less checkout."
          : "That's $149 plus $79 - same price as buying separately, one less checkout."}
      </p>
      {earlyBird ? (
        <p className="fp-deadnote">
          The Full Access half jumps to $149 after Monday, Sept 7
        </p>
      ) : null}
      <div className="fp-feats">
        <div className="fp-feat">
          <b>+</b>
          <span>Everything in Full Access - 156 questions, exam simulator, AI tutor, audio study, pass guarantee</span>
        </div>
        <div className="fp-feat">
          <b>+</b>
          <span>Everything in Business &amp; Law Prep - 120 questions across all 10 B&amp;L domains</span>
        </div>
        <div className="fp-feat">
          <b>+</b>
          <span>One-time payment, no subscription, both courses yours for good</span>
        </div>
      </div>

      {access === null ? (
        <button className="fp-buybtn" disabled type="button">
          Loading...
        </button>
      ) : access.loggedIn ? (
        <>
          <button
            className="fp-buybtn fp-bundlebtn"
            disabled={buying !== null}
            onClick={() => buy("bundle")}
            type="button"
          >
            {buying === "bundle"
              ? "Opening secure checkout..."
              : earlyBird
                ? "Get Both - $178"
                : "Get Both - $228"}
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
        One secure Stripe checkout, statement reads ASKEVO* FOREMANPREP,
        receipt itemizes both courses. The pass guarantee covers the
        Full Access course, same terms as buying it alone.
      </p>
    </div>
  );

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

      {blFirst ? (
        <>
          {blCard}
          {gcCard}
        </>
      ) : (
        <>
          {gcCard}
          {blCard}
        </>
      )}
      {showBundle ? bundleCard : null}

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
// END OF FILE - app/foremanprep/buy/page.tsx (v12 - B&L doors
// land B&L-first, blue B&L card, two-brand bundle card)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
