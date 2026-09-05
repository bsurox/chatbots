// FILE: app/foremanprep/bl-prep/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import BlAuthButton from "../bl-auth-button";
import BlOwnerSwap from "../bl-owner-swap";

// Business & Law landing page (v15): BADGE WORDING + CLUSTER
// DRESS, his final calls - the orange pill reads "NASCLA GC prep"
// and the volt pill "NASCLA Electrical prep" (no Master/Unlimited
// on purpose - more electrical exams may join later); hovering
// any pill spells out the full exam via a title tooltip. The
// "OTHER PREP COURSES WE OFFER" label turns white and sits on its
// own line ABOVE the pills, and the cluster is nudged up with
// breathing room below so it clears the gray exam badge at the
// top of the hero.
// v14 notes: SSO JUMP LINK - the
// WiremanPrep badge pill now routes through /api/sso?to=wm, so a
// logged-in user lands on wiremanprep.com already logged in;
// visitors get the same plain redirect as before. The ForemanPrep
// pill stays a direct link (same domain, cookie already shared).
// prefetch off so hovering never mints a pass.
// v13 notes: CROSS-BRAND CLUSTER (his
// call, same round on all three platforms) - a compact row sits
// directly under the header, right-aligned beneath the login
// button: a small gray "OTHER PREP COURSES WE OFFER" label plus
// two pills carrying just the course names - "ForemanPrep" in its
// orange (-> /foremanprep) and "WiremanPrep" in its volt #ceff00
// (-> wiremanprep.com). Colors are inlined on purpose - the blue
// blzone variable would repaint them otherwise. Nothing else
// moved; the header backpill and BlAuthButton stay as they were.
// v12 notes: the VISITOR row's Exam
// simulator button goes back to white (his call - blue is for
// owners only); the owner's full-width Exam simulator door stays
// blue (#38bdf8, black text). v11 notes: sim button went blue in
// both places. v10 notes: owner button layout rework
// (his call). The four owner doors now read: a row of three -
// Start practice / State packs / Audio study - with the Exam
// simulator as the single large full-width button underneath.
// The three top buttons get a smaller inline min-width so they
// sit three-across on phones instead of wrapping; the simulator
// row is its own .fp-try div, so its lone button stretches the
// full width by flexbox.
// v9 notes: the owner try-row gained its
// fourth door - Audio study, linking the new B&L audio room at
// /bl-audio (ten drive-time lessons + the hands-free drill with
// the state-pack selector). Visitors' sell row is unchanged: the
// audio room is paid, so it is not pitched as a free try button;
// the feature grid's "Study with your ears" card already carries
// the ears claim.
// v8 notes: the owner row's State packs
// button now leads to /bl-packs - the packs' own dedicated page
// (his call) - instead of anchor-jumping into the practice page.
// And with blstates v3 live, the packs feature card claims the
// truth: statute packs for ALL 16 B&L states, not just TN/GA/SC.
// v7 notes: OWNERS STOP GETTING PITCHED
// (his report - a B&L owner still saw every $79 buy button). The
// page stays a server component; the sell furniture now sits
// inside BlOwnerSwap islands (bl-owner-swap v1), which render the
// sell variant into the server HTML (crawlers and visitors see it
// unchanged) and swap after one shared access check:
// - hero "Get Business & Law Prep - $79" button + price note:
//   GONE for owners;
// - try-row: visitors keep [Try 10 free questions / Exam
//   simulator]; owners get THREE doors - [Start practice / Exam
//   simulator / State packs] (packs deep-links /bl#packs, anchor
//   added in bl v8);
// - "Free to try right now" line: GONE for owners;
// - the whole "What B&L prep costs today" window: GONE for
//   owners.
// Also (his call): the sim button label is now "Exam simulator"
// for everyone - "See your state's exam" wasn't clear.
// v6 notes: AUDIO is real - Chase ran the
// 240-file ElevenLabs batch - so the "Study with your ears" card
// joins the grid. Claims ship only after the thing exists; it
// exists.
// v5 notes: the 1:1 State Exam Simulator joined the feature grid
// and the hero try-row links it - all 16 B&L states, real
// formats, verified Aug 2026.
// v4 notes (MERGE FIX). An Aug 26 session
// shipped its own v3 of this page mounting BlAuthButton (the
// Log in / Log out pill, blue auth flow); tonight's phase-2 v3
// was built from an older baseline and overwrote it, knocking the
// pill off the page. v4 restores the BlAuthButton mount AND keeps
// phase 2's feature grid (tutor, state-pace timer, TN/GA/SC state
// packs). Nothing else changed from either lineage.
// v3 notes (phase 2): the AI tutor and the 2:48 state-pace exam
// timer went live in the practice room, so the page claims them;
// audio gets its line once the batch is voiced. v2 notes: both
// buy buttons link /foremanprep/buy?product=bl. v1 notes below. - the blue sibling of the
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
    n: "Study with your ears",
    d: "Every question and every explanation voiced - tap Listen and drill hands-free on the drive between jobs.",
  },
  {
    n: "The 1:1 State Exam Simulator",
    d: "Pick your state and sit its Business & Law exam for real: the exact question count, the exact clock, the exact pass bar - all 16 B&L states, every format verified against the testing bulletins.",
  },
  {
    n: "State packs - your state's numbers",
    d: "Every one of the 16 B&L states has its own pack: lien deadlines, license thresholds, retainage caps - verified against your state's actual code and drilled as their own rounds.",
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
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <Link className="fp-backpill" href="/foremanprep">
              NASCLA trade exam prep
            </Link>
            <BlAuthButton />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "6px",
            marginTop: "4px",
            marginBottom: "6px",
          }}
        >
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#fff",
              whiteSpace: "nowrap",
            }}
          >
            Other prep courses we offer
          </span>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "flex-end",
              gap: "8px",
            }}
          >
            <Link
              href="/foremanprep"
              title="ForemanPrep - NASCLA Commercial General Building Contractor exam prep"
              style={{
                fontSize: "12.5px",
                fontWeight: 700,
                color: "#f97316",
                border: "1px solid rgba(249, 115, 22, 0.5)",
                background: "rgba(249, 115, 22, 0.1)",
                borderRadius: "999px",
                padding: "5px 12px",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              NASCLA GC prep
            </Link>
            <Link
              href="/api/sso?to=wm"
              prefetch={false}
              title="WiremanPrep - NASCLA Master/Unlimited Electrical Contractor exam prep"
              style={{
                fontSize: "12.5px",
                fontWeight: 700,
                color: "#ceff00",
                border: "1px solid rgba(206, 255, 0, 0.5)",
                background: "rgba(206, 255, 0, 0.1)",
                borderRadius: "999px",
                padding: "5px 12px",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              NASCLA Electrical prep
            </Link>
          </div>
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
          <BlOwnerSwap
            sell={
              <>
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
              </>
            }
          />
          <BlOwnerSwap
            sell={
              <div className="fp-try">
                <Link className="fp-try-btn" href="/foremanprep/bl">
                  Try 10 free questions
                </Link>
                <Link className="fp-try-btn ghost" href="/foremanprep/bl-exam">
                  Exam simulator
                </Link>
              </div>
            }
            owned={
              <>
                <div className="fp-try">
                  <Link
                    className="fp-try-btn"
                    href="/foremanprep/bl"
                    style={{ minWidth: "96px" }}
                  >
                    Start practice
                  </Link>
                  <Link
                    className="fp-try-btn ghost"
                    href="/foremanprep/bl-packs"
                    style={{ minWidth: "96px" }}
                  >
                    State packs
                  </Link>
                  <Link
                    className="fp-try-btn ghost"
                    href="/foremanprep/bl-audio"
                    style={{ minWidth: "96px" }}
                  >
                    Audio study
                  </Link>
                </div>
                <div className="fp-try" style={{ margin: "10px 0 8px" }}>
                  <Link
                    className="fp-try-btn"
                    href="/foremanprep/bl-exam"
                    style={{ background: "#38bdf8", border: "1px solid #38bdf8" }}
                  >
                    Exam simulator
                  </Link>
                </div>
              </>
            }
          />
          <BlOwnerSwap
            sell={<p className="fp-tryhint">Free to try right now - no sign-up needed.</p>}
          />
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

        <BlOwnerSwap
          sell={
            <>
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
            </>
          }
        />

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
// END OF FILE - app/foremanprep/bl-prep/page.tsx (v15 - NASCLA
// wording on the pills, hover titles, white label above them)
// If you can see this comment, the paste was not truncated.
// ============================================================
