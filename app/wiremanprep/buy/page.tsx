// FILE: app/wiremanprep/buy/page.tsx
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

// The WiremanPrep storefront (v2) - THREE cards, three flat
// prices: Master/Full Access $149, Journeyman $99, Residential
// $79. No bundle ON PURPOSE (his call, backed by the acceptance
// research): each state board wants ONE level, so every new card
// carries its verified accepted-by state list instead - the list
// IS the selling tool. A ?product=wj or ?product=wr door reorders
// the cards client-side after hydration so the focused card
// renders first (prerendered HTML always shows Master first -
// same pattern as the ForemanPrep buy page's B&L door). Each card
// buys through checkout v2 with its product key, shows its own
// owned-state doors into its own rooms, and reads its own flag
// from access v2. Doctrine carried over from v1: auth doors for
// signed-out visitors, checkout is the charge authority, no
// early-bird machinery, PASS GUARANTEE deliberately not claimed.
// No Date.now()/Math.random() in render (Next 16 prerender rule).

type WmProduct = "wm" | "wj" | "wr";
type Access = { loggedIn: boolean; paid: boolean; wj: boolean; wr: boolean };

type Card = {
  key: WmProduct;
  name: string;
  sub: string;
  price: string;
  tag: string;
  accepted: string | null;
  feats: string[];
  practiceHref: string;
  examHref: string;
  ownedLine: string;
  buyLabel: string;
};

const CARDS: Card[] = [
  {
    key: "wm",
    name: "WiremanPrep Full Access",
    sub: "Everything you need to walk into the NASCLA Master/Unlimited Electrical Contractor exam ready - built around the real 100-question, open-book test.",
    price: "$149",
    tag: "One-time payment. No subscription. Electrical prep courses charge $195 to $1,900.",
    accepted: null,
    feats: [
      "153 practice questions written to the official 9-subject exam outline - and growing",
      "Full 100-question exam simulator on the true 4.5-hour clock, drawn at the real subject weights",
      "AI tutor on every question - plain answers that point to the exact Code section",
      "Works with YOUR Code book - every question has the same answer in the 2020 and 2023 NEC",
      "Code-section citations that train the open-book look-up skill the exam really tests",
      "1:1 exam-pace practice timer - 2 min 42 sec a question, the real pace",
      "Every subject, every round length, unlimited practice, progress saved to your account",
    ],
    practiceHref: "/wiremanprep/practice",
    examHref: "/wiremanprep/exam",
    ownedLine: "You already own Full Access.",
    buyLabel: "Get Full Access - $149",
  },
  {
    key: "wj",
    name: "Journeyman Prep",
    sub: "The NASCLA Journeyman Electricians exam - 100 questions, open book, five full hours. Built for the electrician testing at journeyman level.",
    price: "$99",
    tag: "One-time payment. No subscription.",
    accepted:
      "Accepted by 11 of the 19 NASCLA electrical boards: AL, DC, ID, KY, MO, NE, NM, TN, UT, VA, and Vanderburgh County IN. A few attach endorsement or score-window conditions - confirm with your board.",
    feats: [
      "150 practice questions written to the official 10-subject Journeyman outline",
      "Full 100-question exam simulator on the true 5-hour clock, drawn at the real subject weights",
      "AI tutor on every question - plain answers that point to the exact Code section",
      "Works with YOUR Code book - every question has the same answer in the 2020 and 2023 NEC",
      "1:1 exam-pace practice timer - 3 minutes a question, the real pace",
    ],
    practiceHref: "/wiremanprep/journeyman",
    examHref: "/wiremanprep/journeyman-exam",
    ownedLine: "You already own Journeyman Prep.",
    buyLabel: "Get Journeyman Prep - $99",
  },
  {
    key: "wr",
    name: "Residential Prep",
    sub: "The NASCLA Residential Electrical Contractors trade exam - 100 questions, open book, 4.5 hours. Built for the residential contractor license path.",
    price: "$79",
    tag: "One-time payment. No subscription.",
    accepted:
      "Accepted by 8 of the 19 NASCLA electrical boards: AZ, FL, MS, NC, NE, NM, SC, and UT. Florida and Utah are endorsement routes - confirm with your board.",
    feats: [
      "153 practice questions written to the official 10-subject Residential outline",
      "Full 100-question exam simulator on the true 4.5-hour clock, drawn at the real subject weights",
      "AI tutor on every question - plain answers that point to the exact Code or IRC reference",
      "Works with YOUR Code book - every question has the same answer in the 2020 and 2023 NEC",
      "1:1 exam-pace practice timer - 2 min 42 sec a question, the real pace",
    ],
    practiceHref: "/wiremanprep/residential",
    examHref: "/wiremanprep/residential-exam",
    ownedLine: "You already own Residential Prep.",
    buyLabel: "Get Residential Prep - $79",
  },
];

export default function WiremanBuyPage() {
  const [access, setAccess] = useState<Access | null>(null);
  const [buying, setBuying] = useState<WmProduct | null>(null);
  const [errFor, setErrFor] = useState<WmProduct | null>(null);
  const [focus, setFocus] = useState<WmProduct>("wm");

  function loadAccess() {
    fetch("/wiremanprep/api/access")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setAccess({
            loggedIn: Boolean(data.loggedIn),
            paid: Boolean(data.paid),
            wj: Boolean(data.wj),
            wr: Boolean(data.wr),
          });
        } else {
          setAccess({ loggedIn: false, paid: false, wj: false, wr: false });
        }
      })
      .catch(() => setAccess({ loggedIn: false, paid: false, wj: false, wr: false }));
  }

  useEffect(() => {
    loadAccess();
    const p = new URLSearchParams(window.location.search).get("product");
    if (p === "wj" || p === "wr") setFocus(p);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function buy(product: WmProduct) {
    if (buying) return;
    setBuying(product);
    setErrFor(null);
    try {
      const res = await fetch("/wiremanprep/api/checkout", {
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
        loadAccess();
        setBuying(null);
        return;
      }
      if (res.status === 401 || res.status === 403) {
        setAccess({ loggedIn: false, paid: false, wj: false, wr: false });
        setBuying(null);
        return;
      }
      setErrFor(product);
      setBuying(null);
    } catch {
      setErrFor(product);
      setBuying(null);
    }
  }

  function owns(card: Card): boolean {
    if (!access) return false;
    if (card.key === "wj") return access.wj;
    if (card.key === "wr") return access.wr;
    return access.paid;
  }

  const ordered = [
    ...CARDS.filter((c) => c.key === focus),
    ...CARDS.filter((c) => c.key !== focus),
  ];

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

      <p className="fp-buysub" style={{ margin: "0 0 14px" }}>
        Three NASCLA electrical exams, three preps. Your state board decides
        which exam you need - each card lists the boards that accept it.
      </p>

      {ordered.map((card) => (
        <div className="fp-buycard" key={card.key} style={{ marginBottom: "18px" }}>
          <p className="fp-buyh">{card.name}</p>
          <p className="fp-buysub">{card.sub}</p>
          <div className="fp-pricebig">
            <span className="fp-pricenow">{card.price}</span>
          </div>
          <p className="fp-pricetag">{card.tag}</p>
          {card.accepted ? <p className="fp-buysub">{card.accepted}</p> : null}
          <div className="fp-feats">
            {card.feats.map((f) => (
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
          ) : owns(card) ? (
            <div className="fp-owned">
              <p className="fp-ownedh">{card.ownedLine}</p>
              <div className="fp-authrow">
                <Link className="fp-authbtn" href={card.practiceHref}>
                  Go practice
                </Link>
                <Link className="fp-authbtn exam" href={card.examHref}>
                  Take the exam simulator
                </Link>
              </div>
            </div>
          ) : access.loggedIn ? (
            <>
              <button
                className="fp-buybtn"
                disabled={buying !== null}
                onClick={() => buy(card.key)}
                type="button"
              >
                {buying === card.key ? "Opening secure checkout..." : card.buyLabel}
              </button>
              {errFor === card.key ? (
                <p className="fp-buyerr">Could not start checkout - please try again.</p>
              ) : null}
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
      ))}

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
// END OF FILE - app/wiremanprep/buy/page.tsx (v2 - three cards
// wm $149 / wj $99 / wr $79, per-card accepted-state lists,
// ?product door reorders, no bundle on purpose)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
