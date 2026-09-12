// FILE: app/haullegal/page.tsx
"use client";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { HL_GOV_FEES, HL_MARKET } from "@/lib/haullegal/steps";

// HaulLegal landing page (v3 - footer gains the "State guides" link,
// the crawl door into the 50 state pages.)
// v2 notes - footer gains the "Guides" link, the
// crawl door from the front page into the SEO library.
// v1 notes - the front door of haullegal.com,
// modeled on the WiremanPrep landing but speaking to a different
// customer: a brand-new owner-operator who needs a USDOT number,
// operating authority, and then has to stay legal every quarter.
// - TWO PRODUCTS, both flat: the launch walkthrough at $249 one
//   time, and the Stay Legal calendar at $39 a month with the first
//   month free for walkthrough buyers. No early-bird clock, no
//   price-flip constant.
// - HONESTY DOCTRINE, load-bearing: every number in the hero, the
//   stats and the fee table is a verified government figure (Sept
//   2026 - see lib/haullegal/steps.ts). We say plainly that we
//   never file anything or touch a government account, that we
//   are not the government and not lawyers, and that some links
//   are partner links. Do not "round up" any claim in later edits.
// - The access fetch points at /haullegal/api/access, which ships
//   with the money loop; until it exists the catch swallows the
//   404 and the page treats everyone as a visitor. Nothing breaks.
// - The Stay Legal reminder claim ("emails you before each
//   deadline") requires the reminder job. Ship the job before the
//   domain goes live, or trim that sentence.
// No Date.now()/Math.random() in render (Next 16 prerender rule).

const STATS = [
  { n: "$300", l: "the only federal fee for your authority" },
  { n: "$0", l: "what a USDOT number costs" },
  { n: "20-25", l: "business days, typical wait" },
  { n: "12 mo", l: "until your first safety audit" },
];

const FEATURES = [
  {
    n: "Every step, in order",
    d: "23 steps across four phases - business, federal registration, taxes and plates, legal on the road - each with the real fee, where the click happens, what you need first, and the mistakes FMCSA itself warns about.",
  },
  {
    n: "Real prices next to every step",
    d: "USDOT number $0. Authority $300. Process agent about $50. UCR $46. We put the government's number beside each step so you never pay $500 for a free form.",
  },
  {
    n: "Built for Motus",
    d: "FMCSA replaced its registration system in May 2026. We walk you through Login.gov, the phone ID check, and what every Pending status actually means. You do every click yourself - we never touch your account.",
  },
  {
    n: "The Stay Legal calendar",
    d: "Enter your USDOT number and a few dates. It works out your biennial update month, IFTA quarters, UCR, Form 2290, medical card, inspections and the four by-the-mile states, and emails you before each one.",
  },
  {
    n: "Cited, not guessed",
    d: "Every fee and deadline links to the regulation or agency page it comes from - 49 CFR, FMCSA, the IRS, UCR, IFTA - verified September 2026.",
  },
  {
    n: "Works in the truck",
    d: "Phone-first. No app to install, no classroom, no phone tag with a 'specialist'. Read a step at the fuel island, do it, check it off.",
  },
];

export default function HaulLegalPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [paid, setPaid] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    fetch("/haullegal/api/access")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.loggedIn) setLoggedIn(true);
        if (data?.paid) setPaid(true);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="fp-wrap">
      <div className="fp-top" style={{ flexWrap: "wrap", gap: "8px" }}>
        <div className="fp-brand">
          Haul<span>Legal</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {loggedIn ? (
            <button
              disabled={signingOut}
              onClick={() => {
                setSigningOut(true);
                signOut({ redirectTo: "/haullegal" });
              }}
              style={{
                fontSize: "13px",
                fontWeight: 700,
                fontFamily: "inherit",
                color: "#fff",
                background: "#161616",
                border: "1px solid #333",
                borderRadius: "999px",
                padding: "5px 14px",
                whiteSpace: "nowrap",
                cursor: "pointer",
              }}
              type="button"
            >
              {signingOut ? "Signing out..." : "Log out"}
            </button>
          ) : (
            <Link
              href="/login"
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#fff",
                background: "#161616",
                border: "1px solid #333",
                borderRadius: "999px",
                padding: "5px 14px",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              Log in
            </Link>
          )}
        </div>
      </div>

      <div className="fp-hero">
        <div className="fp-badge">For new owner-operators - USDOT, authority, and staying legal</div>
        <h1 className="fp-h1">
          Get legal to haul. <span>Stay legal.</span>
        </h1>
        <p className="fp-sub">
          The step-by-step walkthrough that gets a new trucking company its
          USDOT number and operating authority the right way, at the real
          government prices - then keeps every deadline on your phone.
        </p>
        {paid ? null : (
          <>
            <Link
              className="fp-cta"
              href="/haullegal/buy"
              style={{ textDecoration: "none" }}
            >
              Start the walkthrough - $249
            </Link>
            <p className="fp-note">
              <b>One payment for the launch walkthrough.</b> Stay Legal
              reminders are $39 a month after your free first month, cancel
              any time.
            </p>
          </>
        )}
        <div className="fp-try">
          <Link className="fp-try-btn" href="/haullegal/start">
            {paid ? "Open the walkthrough" : "See the steps free"}
          </Link>
          <Link className="fp-try-btn ghost" href="/haullegal/calendar">
            Try the deadline calendar
          </Link>
        </div>
        {paid ? null : (
          <p className="fp-tryhint">Free to look around - no sign-up needed.</p>
        )}
      </div>

      <div className="fp-stats">
        {STATS.map((s) => (
          <div className="fp-stat" key={s.l}>
            <div className="fp-sn">{s.n}</div>
            <div className="fp-sl">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="fp-strip">
        <p className="fp-st">Most of this is free from the government. The confusion is what costs money.</p>
        <p className="fp-sd">
          FMCSA charges $300 for your authority and nothing for your USDOT
          number, your updates, or the forms. The $500 to $1,000 "packages"
          are charging you for knowing which button to click - and since
          May 2026 you have to be the one holding the phone for the ID check
          anyway. HaulLegal shows you every button, in order, with the real
          price next to it. We never file for you and never touch your
          government account. You stay in control, and you keep the money.
        </p>
      </div>

      <h2 className="fp-h2">What you get</h2>
      <div className="fp-grid">
        {FEATURES.map((f) => (
          <div className="fp-card" key={f.n}>
            <p className="fp-cn">
              <span>+</span>
              {f.n}
            </p>
            <p className="fp-cd">{f.d}</p>
          </div>
        ))}
      </div>

      <h2 className="fp-h2">What the government actually charges</h2>
      <div className="fp-price">
        {HL_GOV_FEES.map((f) => (
          <div className="fp-prow" key={f.item}>
            <div>
              <div className="fp-pl" style={{ color: "#ddd" }}>{f.item}</div>
              <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>{f.who}</div>
            </div>
            <div className="fp-pv" style={{ color: "#fff" }}>{f.cost}</div>
          </div>
        ))}
      </div>

      <h2 className="fp-h2">What getting help costs today</h2>
      <div className="fp-price">
        {HL_MARKET.map((m) => (
          <div className={m.ours ? "fp-prow fp-ours" : "fp-prow"} key={m.label}>
            <div className="fp-pl">{m.label}</div>
            <div className="fp-pv">{m.value}</div>
          </div>
        ))}
      </div>

      <div className="fp-foot">
        <div className="fp-links">
          <Link className="fp-link" href="/haullegal/guides">
            Guides
          </Link>
          <Link className="fp-link" href="/haullegal/states">
            State guides
          </Link>
          <Link className="fp-link" href="/haullegal/terms">
            Terms
          </Link>
          <Link className="fp-link" href="/haullegal/privacy">
            Privacy
          </Link>
        </div>
        <p className="fp-legal">
          HaulLegal is a product of AskEvo LLC, Boise, Idaho. We are not a
          government agency and are not affiliated with or endorsed by the
          U.S. Department of Transportation, FMCSA, or any state agency. We
          are not a law firm and nothing here is legal advice. We never file
          on your behalf or access your government accounts - you complete
          every filing yourself, with our walkthrough. Some links are
          partner links; if you buy through them we may earn a referral fee
          at no extra cost to you. Questions: support@askevo.ai
        </p>
      </div>
    </div>
  );
}

// ============================================================
// END OF FILE - app/haullegal/page.tsx (v3 - footer State guides
// link; $249 walkthrough + $39/mo Stay Legal, fee table, honesty
// footer)
// If you can see this comment, the paste was not truncated.
// ============================================================
