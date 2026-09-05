// FILE: app/wiremanprep/page.tsx
"use client";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

// WiremanPrep landing page (v3) - two changes in one (the v2
// footer-links chip was never committed, so this carries both):
// 1. CROSS-BRAND BADGES (his ask, placement my call): two small
//    pill badges at the bottom of the hero - the proven spot the
//    ForemanPrep landing uses for its own cross-sell badge. One
//    wears ForemanPrep orange and links foremanprep.com, one
//    wears B&L sky blue and links the B&L landing page. Colors
//    are inlined because the volt zone would otherwise repaint
//    them - each badge wears its own brand on purpose.
// 2. FOOTER SEO LINKS (from the uncommitted v2): "Exam guides"
//    and "State guides" join the footer - Google's crawl doors
//    from the front page into the 24-page SEO library.
// v1 notes: the front door of
// wiremanprep.com, modeled on the ForemanPrep landing but with
// the differences the products earned:
// - PRICE IS $149 FLAT. No early-bird mechanics, no clock, no
//   price-flip constant, no remind-me box - none of that
//   machinery exists on this island on purpose.
// - Yellow brand identity comes free from the layout's .wm-zone.
// - STATE CLAIMS ARE THE VERIFIED ONES (Sept 2026, nascla.org +
//   PSI bulletin): 17 licensing boards accept the Master exam.
//   Florida is deliberately ABSENT (it takes only the Residential
//   exam, by endorsement); Utah and New Mexico appear with their
//   endorsement caveat in the tooltip. Do not "round up" these
//   claims in future edits - they are load-bearing honesty.
// - The pass guarantee is deliberately NOT claimed here (his
//   call pending, same as B&L v1's silence).
// - The access fetch points at /wiremanprep/api/access, which
//   ships later in the build chain; until it exists the catch
//   swallows the 404 and the page simply treats everyone as a
//   visitor. Nothing breaks.
// No Date.now()/Math.random() in render (Next 16 prerender rule).

const STATS = [
  { n: "100", l: "exam questions" },
  { n: "4.5 hrs", l: "on the clock" },
  { n: "17", l: "licensing boards" },
  { n: "75%", l: "needed to pass" },
];

const FEATURES = [
  {
    n: "AI tutor, on call 24/7",
    d: "Miss a question and ask why. The tutor explains it straight and points you to the exact Code section the answer lives in.",
  },
  {
    n: "153 questions and growing",
    d: "Written to the official 9-subject exam outline, weighted the way the real test is weighted, and verified against the Code and the safety standards.",
  },
  {
    n: "Full exam simulator",
    d: "100 questions on a 4.5-hour clock, mixed across subjects exactly like the real draw. Train against the real 75-to-pass bar.",
  },
  {
    n: "Works with YOUR Code book",
    d: "The exam lets you bring the 2020 or the 2023 NEC. Every question here has the same answer in both editions, so your book is the right book.",
  },
  {
    n: "Code-section citations",
    d: "Every answer tells you the exact NEC section or table it lives in - the open-book look-up skill the exam really tests.",
  },
  {
    n: "Built for the job site",
    d: "Runs on any phone. Drill a 10-question round in the van at lunch - no desk, no classroom.",
  },
];

export default function WiremanPrepPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [paid, setPaid] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    fetch("/wiremanprep/api/access")
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
          Wireman<span>Prep</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {loggedIn ? (
            <button
              disabled={signingOut}
              onClick={() => {
                setSigningOut(true);
                signOut({ redirectTo: "/wiremanprep" });
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
        <div className="fp-badge">NASCLA Electrical Contractor Exam - Master/Unlimited</div>
        <h1 className="fp-h1">
          Pass your electrical exam. <span>First try.</span>
        </h1>
        <p className="fp-sub">
          The AI tutor that gets working electricians through the NASCLA
          Master exam - unlimited practice, straight answers, and a study
          plan that fits around service calls, not a classroom.
        </p>
        {paid ? null : (
          <>
            <Link
              className="fp-cta"
              href="/wiremanprep/buy"
              style={{ textDecoration: "none" }}
            >
              Get Full Access - $149
            </Link>
            <p className="fp-note">
              <b>One payment, everything included.</b> Electrical prep
              courses charge $195 to $1,900 for less.
            </p>
          </>
        )}
        <div className="fp-try">
          <Link className="fp-try-btn" href="/wiremanprep/practice">
            {paid ? "Start practice" : "Start free practice"}
          </Link>
          <Link className="fp-try-btn ghost" href="/wiremanprep/exam">
            Exam simulator
          </Link>
        </div>
        {paid ? null : (
          <p className="fp-tryhint">Free to try right now - no sign-up needed.</p>
        )}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "14px" }}>
          <Link
            href="https://foremanprep.com"
            style={{
              display: "inline-block",
              fontSize: "12.5px",
              fontWeight: 700,
              color: "#f97316",
              border: "1px solid rgba(249, 115, 22, 0.5)",
              background: "rgba(249, 115, 22, 0.1)",
              borderRadius: "999px",
              padding: "6px 13px",
              textDecoration: "none",
            }}
          >
            We prep the NASCLA GC exam too
          </Link>
          <Link
            href="https://foremanprep.com/bl-prep"
            style={{
              display: "inline-block",
              fontSize: "12.5px",
              fontWeight: 700,
              color: "#38bdf8",
              border: "1px solid rgba(56, 189, 248, 0.5)",
              background: "rgba(56, 189, 248, 0.1)",
              borderRadius: "999px",
              padding: "6px 13px",
              textDecoration: "none",
            }}
          >
            Business &amp; Law prep too
          </Link>
        </div>
      </div>

      <div className="fp-stats">
        {STATS.map((s) => (
          <div className="fp-stat" key={s.l} tabIndex={s.n === "17" ? 0 : undefined}>
            <div className="fp-sn">
              {s.n === "17" ? <span className="fp-tipcue">17</span> : s.n}
            </div>
            <div className="fp-sl">{s.l}</div>
            {s.n === "17" ? (
              <div className="fp-tip">
                The NASCLA Master/Unlimited electrical exam is accepted by
                licensing boards in Alabama, Arizona, Idaho, Kentucky,
                Louisiana, Mississippi, Missouri, Nebraska, New Mexico,
                North Carolina, South Carolina, Tennessee, Utah, Virginia,
                West Virginia, and Washington DC, plus Vanderburgh County,
                Indiana. Utah and New Mexico accept it by endorsement -
                you must already hold a license in another state. Always
                confirm current rules with your board.
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <div className="fp-strip">
        <p className="fp-st">The exam is open book. That's the trap.</p>
        <p className="fp-sd">
          You can bring your Code book, the OSHA standards, NFPA 70E, and
          Ugly's into the test - thousands of pages, with under 3 minutes
          per question. Nobody fails because they can't bend pipe. They
          fail because they can't find the answer fast enough. WiremanPrep
          trains exactly that: every practice question teaches you which
          book, which section, and how to get there fast.
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

      <div className="fp-foot">
        <div className="fp-links">
          <Link className="fp-link" href="/wiremanprep/guides">
            Exam guides
          </Link>
          <Link className="fp-link" href="/wiremanprep/states">
            State guides
          </Link>
          <Link className="fp-link" href="/wiremanprep/terms">
            Terms
          </Link>
          <Link className="fp-link" href="/wiremanprep/privacy">
            Privacy
          </Link>
        </div>
        <p className="fp-legal">
          WiremanPrep is a product of AskEvo LLC, Boise, Idaho. Not
          affiliated with or endorsed by NASCLA or PSI. NASCLA is a
          registered trademark of the National Association of State
          Contractors Licensing Agencies. NEC and National Electrical Code
          are registered trademarks of the National Fire Protection
          Association. Questions: support@askevo.ai
        </p>
      </div>
    </div>
  );
}

// ============================================================
// END OF FILE - app/wiremanprep/page.tsx (v3 - cross-brand
// badges to ForemanPrep + B&L, footer SEO links)
// If you can see this comment, the paste was not truncated.
// ============================================================
