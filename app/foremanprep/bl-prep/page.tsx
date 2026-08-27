// FILE: app/foremanprep/bl-prep/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

// Business & Law landing page (v3 - phase 2 features join the
// grid: the AI tutor on every question and the 2:48 state-pace
// exam timer are live in the practice room, so the page may now
// honestly claim them; audio gets its line once the batch is
// voiced). v2 notes: both buy buttons link
// /foremanprep/buy?product=bl. Original v1 notes below. - the blue sibling of the
// ForemanPrep front door. Same skeleton as the main landing (hero,
// stats, open-book strip, features grid, price table, footer) but
// everything is about the state Business & Law exam, and the whole
// page sits inside .fp-blzone so every fp- component wears the
// B&L sky blue instead of safety orange. DELIBERATELY absent (his
// spec): the email remind-me box - there is no deadline deal on
// B&L, so there is nothing to remind anyone about. A server
// component on purpose: no clocks, no access checks, nothing
// interactive beyond links - so it prerenders whole, carries real
// metadata for Google, and can never trip the Date.now() rule.
// The live chat widget appears here via layout.tsx v5's
// allowlist. Served clean at foremanprep.com/bl-prep (proxy v14).

export const metadata: Metadata = {
  title: "Business & Law Exam Prep - ForemanPrep",
  description:
    "Prep for the state Business & Law contractor exam - 120 practice questions across all 10 domains with instant explanations and citations. One-time $79, free 10-question sample.",
  alternates: { canonical: "https://foremanprep.com/bl-prep" },
};

const STATS = [
  { n: "120", l: "questions in the bank" },
  { n: "10", l: "domains covered" },
  { n: "$79", l: "once - no subscription" },
  { n: "2nd", l: "exam most states require" },
];

const FEATURES = [
  {
    n: "AI tutor, on call 24/7",
    d: "Miss a question and ask why. The tutor coaches in plain language, anchored to the cited reference - and it knows state rules vary, so it teaches the principle instead of guessing your state's numbers.",
  },
  {
    n: "Every answer explained",
    d: "Miss one and the why appears instantly - plus a citation pointing at the guide chapter or regulation it lives in.",
  },
  {
    n: "The state-pace exam timer",
    d: "Put every question on a 2:48 clock - the tightest common state pace (Tennessee's 50 questions in 140 minutes). Train under pressure; sit the real thing with margin.",
  },
  {
    n: "All 10 domains",
    d: "Licensing and business structures, estimating and bidding, contracts, project management, insurance and bonding, labor law, financial management, taxes, lien law, and jobsite safety.",
  },
  {
    n: "The math, drilled",
    d: "Markup versus margin, labor burden, overhead recovery, break-even, pay applications with retainage - the calculations B&L exams love, with the arithmetic walked through.",
  },
  {
    n: "State packs - your state's numbers",
    d: "Tennessee, Georgia, and South Carolina packs are live: lien deadlines, license thresholds, retainage caps - statute-verified, drilled as their own rounds. More states rolling out.",
  },
  {
    n: "Built for the job site",
    d: "Runs on any phone. Drill a 10-question round in the truck at lunch - no desk, no classroom.",
  },
  {
    n: "Stacks with the trade course",
    d: "Same account as the NASCLA GC prep. Own both and everything lives behind one login - or grab the two together in one checkout on the buy page.",
  },
];

const PRICES = [
  { l: "Live B&L prep courses", v: "$195 - $295" },
  { l: "Question banks that expire in 3 months", v: "$79" },
];

export default function BlPrepLandingPage() {
  return (
    <div className="fp-blzone">
      <div className="fp-wrap">
        <div className="fp-top" style={{ flexWrap: "wrap", gap: "8px" }}>
          <div className="fp-brand">
            Foreman<span>Prep</span>
          </div>
          <Link className="fp-backpill" href="/foremanprep">
            NASCLA trade exam prep
          </Link>
        </div>

        <div className="fp-hero">
          <div className="fp-badge">State Business &amp; Law Contractor Exam</div>
          <h1 className="fp-h1">
            The trade exam was half. <span>Finish the license.</span>
          </h1>
          <p className="fp-sub">
            Most NASCLA states make you pass a second exam - Business &amp;
            Law - before the license is yours. This is the drill room for
            it: contracts, liens, payroll, insurance, and the money math,
            explained in plain language.
          </p>
          <Link
            className="fp-cta"
            href="/foremanprep/buy?product=bl"
            style={{ textDecoration: "none" }}
          >
            Get Business &amp; Law Prep - $79
          </Link>
          <p className="fp-note">
            <b>One-time $79.</b> No subscription. B&amp;L courses charge $195
            to $295 for less.
          </p>
          <div className="fp-try">
            <Link className="fp-try-btn" href="/foremanprep/bl">
              Try 10 free questions
            </Link>
            <Link className="fp-try-btn ghost" href="/foremanprep/states">
              Check your state's rules
            </Link>
          </div>
          <p className="fp-tryhint">Free to try right now - no sign-up needed.</p>
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
          <p className="fp-st">Passing the trade exam doesn't finish your license.</p>
          <p className="fp-sd">
            In most NASCLA states the board also wants a passing score on
            its Business &amp; Law exam - a separate test on running the
            business legally: contracts, mechanics liens, payroll taxes,
            insurance, bonding, and estimating math. Formats vary by state
            (Tennessee runs 50 questions in 140 minutes, Georgia 60 in
            180), but they are all built from the same core body of
            material. That core is exactly what this course drills.
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

        <h2 className="fp-h2">What B&amp;L prep costs today</h2>
        <div className="fp-price">
          {PRICES.map((p) => (
            <div className="fp-prow" key={p.l}>
              <div className="fp-pl">{p.l}</div>
              <div className="fp-pv">{p.v}</div>
            </div>
          ))}
          <div className="fp-prow fp-ours">
            <div className="fp-pl">ForemanPrep B&amp;L - full bank, never expires</div>
            <div className="fp-pv">$79</div>
          </div>
          <Link
            className="fp-cta"
            href="/foremanprep/buy?product=bl"
            style={{ display: "block", marginTop: "14px", textAlign: "center", textDecoration: "none" }}
          >
            Get Business &amp; Law Prep
          </Link>
        </div>

        <div className="fp-foot">
          <div className="fp-links">
            <Link className="fp-link" href="/foremanprep/bl">
              Free B&amp;L sample
            </Link>
            <Link className="fp-link" href="/foremanprep">
              NASCLA trade prep
            </Link>
            <Link className="fp-link" href="/foremanprep/states">
              State guides
            </Link>
            <Link className="fp-link" href="/foremanprep/terms">
              Terms
            </Link>
            <Link className="fp-link" href="/foremanprep/privacy">
              Privacy
            </Link>
          </div>
          <p className="fp-legal">
            ForemanPrep is a product of AskEvo LLC, Boise, Idaho. Not
            affiliated with or endorsed by NASCLA or PSI. NASCLA is a
            registered trademark of the National Association of State
            Contractors Licensing Agencies. Questions: support@askevo.ai
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// END OF FILE - app/foremanprep/bl-prep/page.tsx (v3 - tutor
// and timer join the feature grid)
// If you can see this comment, the paste was not truncated.
// ============================================================
