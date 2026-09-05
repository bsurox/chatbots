// FILE: app/foremanprep/page.tsx
"use client";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

// ForemanPrep landing page v30. CROSS-BRAND CLUSTER (his call,
// same round on all three platforms): the mid-hero "We prep the
// Business & Law exam too" badge is GONE. In its place a compact
// row sits directly under the header, right-aligned beneath the
// login button: a small gray "OTHER PREP COURSES WE OFFER" label
// plus two pills carrying just the course names - "Business & Law"
// in its sky blue (-> /foremanprep/bl-prep) and "WiremanPrep" in
// its volt #ceff00 (-> wiremanprep.com). Everyone sees the
// cluster, owners included; the B&L owner's full-width gradient
// door under the try-buttons stays exactly as v29 built it.
// Colors are inlined on purpose - each pill wears its own brand.
// ALSO GONE (his call, same round): the "Early bird pricing ends
// Sept 7" chip in the header. The earlyBird state itself stays -
// it still drives the $99 price copy and the reminder box below.
// v29 notes. TWO CHANGES (his call):
// 1. A B&L owner's door is now a FULL-WIDTH button directly under
//    the three try-buttons: "Open your Business & Law prep",
//    wearing an orange-to-blue gradient (#f97316 -> #38bdf8, same
//    pair as the FP icon) - it bridges the orange GC brand and the
//    blue B&L identity without repainting the page. The old blue
//    hero badge is GONE for owners (the button replaces it).
//    Non-owners keep the mid-hero "We prep the Business & Law exam
//    too" badge exactly as it was - focus stays on the GC product.
// 2. The middle try-button label reads "Exam simulator" (was "Try
//    the exam simulator").
// (A v28 that put the owner door in the header was delivered but
// never committed - superseded by this, numbering skips it.)
// v27 notes: B&L OWNERS GET A PERMANENT DOOR:
// his find - once an account owns Business & Law, the marketing
// strip and the hero badge both hide (correct: never pitch what's
// bought), which left an owner with NO visible way back into B&L
// from this page except the small footer link. The hero badge
// slot now flips instead of vanishing: owners see a blue
// "Open your Business & Law prep" pill in the same spot, linking
// /bl-prep. The strip stays owner-hidden as before - it's a
// pitch; the badge is now a door.
// v26 notes: The footer's "Business & Law"
// link now goes to the B&L LANDING page (/foremanprep/bl-prep)
// instead of dropping visitors straight into the /bl practice
// room - the footer should sell before it drills. The hero-area
// "Try Business & Law practice" button still points at /bl on
// purpose: that one is explicitly the free sample. Only the one
// footer href changed.
// v25 notes: The strip's buy button now links
// /foremanprep/buy?product=bl - the B&L door - so the buy page
// opens with the B&L card first and in blue. v24 notes: Business & Law gets its BLUE
// identity + more visibility (his calls): (1) the B&L strip wears
// .fp-blzone - sky blue border, glow, and buttons - so the second
// product reads as its own thing next to the safety orange;
// (2) a striphead row puts a blue "Learn more" pill at the top of
// the box, door to the new B&L landing page at /bl-prep; (3) the
// strip's buy button goes blue (.fp-ctabl); (4) a small blue
// badge sits high in the hero - "We prep the Business & Law exam
// too" - so nobody scrolls to discover the second product (hides
// for B&L owners, like the strip); (5) the remind-me box wears
// .fp-float: on wide screens (1300px+) it becomes a right-side
// rail that follows the scroll, with a dismiss x; phones keep it
// exactly where it was.
// v23 notes: the strip's buy button went orange (superseded by
// the blue in this version). v22 notes: the button label reads
// "Get Business & Law Prep - $79" - the product's actual name,
// matching the buy page card. v21 notes:
// the B&L strip grew a BUY button: solid button buys (links
// /foremanprep/buy, where the B&L card renders first for Full
// Access owners), ghost button tries the free sample. Deliberately
// NOT named anything with "Full Access" - that name belongs to
// the GC product at the top of this page.
// v20 notes: two B&L strip changes (his call):
// 1) COPY - "stacks onto the same account as Full Access" read
// like jargon to a visitor who hasn't bought anything yet, so the
// line now ends "the same account as your NASCLA GC access".
// 2) PLACEMENT - the whole B&L box moves BELOW the "What prep
// costs today" table. The price furniture's paid-gate is split in
// two so the strip can sit between the price table and the
// remind-me box for visitors, while Full Access owners - who
// never see the price furniture at all - still get the strip
// after the features grid. Hide rule unchanged: an account that
// owns B&L never sees the pitch.
// v19 notes: Business & Law joined the page: a
// strip after the features grid pitches the second exam most
// NASCLA states require (120-question drill room, $79 one-time,
// free sample door at /foremanprep/bl), and the footer gained a
// "Business & Law" link. The strip hides for accounts that
// already own B&L - same doctrine as every other pitch on this
// page: never sell someone what they already bought. The access
// fetch now also reads the bl flag.
// v18 notes: footer gained the "State guides" link - the crawl
// door into the 17 state pages at /foremanprep/states.
// v17 notes: Deadline advertising slimmed to
// ONE badge (his spec): the header chip stays and now reads
// "Early bird pricing ends Sept 7" (the word "pricing" added for
// clarity), the orange pill that sat above the Get Full Access
// button is REMOVED, and the price-table deadline line under
// "What prep costs today" stays as-is. The .fp-deadline css class
// goes unused here - left in css v11 on purpose, no css round.
// v16 notes: BUILD FIX: Next 16's prerenderer
// rejects Date.now() during client-component render (the v14/v15
// builds went red on exactly that line - nothing after css v11
// ever deployed). The clock read now lives in a useEffect:
// earlyBird starts true (correct through Sept 7), and after
// hydration the effect flips it false once the deadline has
// passed. Charge correctness never depended on this - the
// checkout route reads the clock server-side per request.
// v15 notes: The footer now links the SEO
// guide library (/foremanprep/guides) so visitors and Google both
// have a crawl path from the front door into the five guide
// articles. One link, no other changes from v14.
// v14 notes: The early-bird deadline is now
// advertised, and the page flips its own prices on the clock. A
// PRICE_FLIP_MS constant marks Sept 7, 2026, 11:59 PM Mountain
// (= Sept 8 05:59 UTC). Before that moment, visitors without Full
// Access see: header chip "Early bird ends Sept 7", a .fp-deadline
// pill above the hero CTA, a .fp-deadnote line in the price table,
// and the remind-me box naming the Sept 8 flip (styles: css v11).
// From 11:59 PM on, every deadline element disappears by itself
// and all price strings read $149 - no midnight commit needed.
// The checkout route (v5) carries the same constant and is the
// authority on what actually gets charged. Owners see none of it.
// v13 notes: The "Free to try right now - no
// sign-up needed." line under the try-buttons also hides for Full
// Access members - nothing on an owner's page should talk like
// they haven't bought yet.
// v12 notes: Full Access owners no longer see
// the hero "Get Full Access - $99 early bird" button or the price
// line under it - a paid member has nothing left to buy, so the
// hero goes straight to the try-buttons. Guests and free accounts
// see the hero exactly as before.
// v11 notes: The hero practice button drops the
// word "free" for Full Access owners: they see "Start practice",
// everyone else (guests and free accounts) keeps "Start free
// practice" - a customer already paid, so nothing they own gets
// pitched as free.
// v10 notes: The audio claim is BACK and this
// time it is true: a "Study with your ears" feature card and a
// third try-button to /foremanprep/audio - every question voiced,
// twelve drive-time lessons, hands-free drill. (The original
// "audio lessons" claim was pulled in the launch honesty pass
// until it was real. It is real now.)
// v9: Full Access owners stop seeing the
// sales furniture: the "What prep costs today" price table and the
// price-reminder email box render only for visitors who have not
// bought - a paying customer gets a landing page, not a pitch.
// v8: The header button tells the
// truth about auth: signed-out visitors get Log in, signed-in
// users get Log out (same next-auth signOut call as the account
// badge, landing back on the home page). The access check treats
// guests as signed out, so throwaway sessions never see Log out.
// v7: The 17-states stat card shows a
// hover/tap tooltip listing every accepting state - proof on the
// spot for the campaign's core claim. v6: stat corrected 18 -> 17
// (NASCLA's list is 17 states + the US Virgin Islands, a territory;
// 17 matches the ad campaigns and is the strictly honest count).
// v5 notes: A Log in button joins the header so
// returning customers can get straight to their account - the top
// row wraps on narrow phones so brand, chip, and button never
// collide. v4 notes: footer links the ForemanPrep-branded legal
// pages. v3 notes: hero and price table point at /foremanprep/buy,
// feature copy claims only what is built today, email form is a
// "remind me" net.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Early-bird end: Sept 7, 2026, 11:59 PM Mountain Daylight Time
// (UTC-6) = Sept 8, 05:59 UTC. Month index 8 = September.
const PRICE_FLIP_MS = Date.UTC(2026, 8, 8, 5, 59, 0);

const STATS = [
  { n: "115", l: "exam questions" },
  { n: "5.5 hrs", l: "on the clock" },
  { n: "17", l: "states, one exam" },
  { n: "70%", l: "needed to pass" },
];

const FEATURES = [
  {
    n: "AI tutor, on call 24/7",
    d: "Miss a question and ask why. The tutor explains it straight and points you to the exact book and section the answer lives in.",
  },
  {
    n: "156 questions and growing",
    d: "Written to the official 12-subject exam outline, weighted the way the real test is weighted, and verified against the actual reference books.",
  },
  {
    n: "Full exam simulator",
    d: "115 questions on a 5.5-hour clock. Flag questions, review your misses, and train against the real 81-to-pass bar.",
  },
  {
    n: "Book-and-page citations",
    d: "Every answer tells you which book and which section it lives in - the open-book skill the exam really tests.",
  },
  {
    n: "Built for the job site",
    d: "Runs on any phone. Drill a 10-question round in the truck at lunch - no desk, no classroom.",
  },
  {
    n: "Study with your ears",
    d: "Every question read aloud, twelve drive-time audio lessons, and a hands-free drill mode - hear the question, answer in your head, hear why. Made for the drive between jobs.",
  },
  {
    n: "Pass guarantee",
    d: "Finish the course and fail the real exam? Full refund. That simple.",
  },
];

const PRICES = [
  { l: "Live prep classes", v: "$1,095 - $1,490" },
  { l: "Self-study courses", v: "$349 - $695" },
  { l: "Official practice exams", v: "$99 - $299" },
];

export default function ForemanPrepPage() {
  const [email, setEmail] = useState("");
  const [phase, setPhase] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [paid, setPaid] = useState(false);
  const [blOwned, setBlOwned] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [earlyBird, setEarlyBird] = useState(true);
  const [signupHidden, setSignupHidden] = useState(false);

  useEffect(() => {
    if (Date.now() >= PRICE_FLIP_MS) setEarlyBird(false);
  }, []);

  useEffect(() => {
    fetch("/foremanprep/api/access")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.loggedIn) setLoggedIn(true);
        if (data?.paid) setPaid(true);
        if (data?.bl) setBlOwned(true);
      })
      .catch(() => {});
  }, []);

  async function join() {
    const clean = email.trim();
    if (!EMAIL_RE.test(clean)) {
      setPhase("error");
      setErrorMsg("Please enter a valid email.");
      return;
    }
    setPhase("sending");
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "ForemanPrep Launch List",
          email: clean,
          comment:
            "FOREMANPREP LAUNCH LIST signup from the foremanprep.com landing page.",
        }),
      });
      if (res.ok) {
        setPhase("done");
        return;
      }
      const data = await res.json().catch(() => null);
      setPhase("error");
      setErrorMsg(data?.error ?? "Could not sign you up - please try again.");
    } catch {
      setPhase("error");
      setErrorMsg("Could not sign you up - please try again.");
    }
  }

  return (
    <div className="fp-wrap">
      <div className="fp-top" style={{ flexWrap: "wrap", gap: "8px" }}>
        <div className="fp-brand">
          Foreman<span>Prep</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {loggedIn ? (
            <button
              disabled={signingOut}
              onClick={() => {
                setSigningOut(true);
                signOut({ redirectTo: "/foremanprep" });
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

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          flexWrap: "wrap",
          gap: "8px",
          marginTop: "8px",
        }}
      >
        <span
          style={{
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#777",
            whiteSpace: "nowrap",
          }}
        >
          Other prep courses we offer
        </span>
        <Link
          href="/foremanprep/bl-prep"
          style={{
            fontSize: "12.5px",
            fontWeight: 700,
            color: "#38bdf8",
            border: "1px solid rgba(56, 189, 248, 0.5)",
            background: "rgba(56, 189, 248, 0.1)",
            borderRadius: "999px",
            padding: "5px 12px",
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          Business &amp; Law
        </Link>
        <Link
          href="https://wiremanprep.com"
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
          WiremanPrep
        </Link>
      </div>

      <div className="fp-hero">
        <div className="fp-badge">NASCLA Commercial General Building Contractor Exam</div>
        <h1 className="fp-h1">
          Pass your contractor exam. <span>First try.</span>
        </h1>
        <p className="fp-sub">
          The AI tutor that gets working tradesmen through the NASCLA exam -
          unlimited practice, straight answers, and a study plan that fits
          around a job site, not a classroom.
        </p>
        {paid ? null : (
          <>
            <Link
              className="fp-cta"
              href="/foremanprep/buy"
              style={{ textDecoration: "none" }}
            >
              {earlyBird ? "Get Full Access - $99 early bird" : "Get Full Access - $149"}
            </Link>
            <p className="fp-note">
              {earlyBird ? (
                <>
                  <b>$99 early bird</b> right now - regular $149. Prep courses
                  charge $349 to $1,490 for less.
                </>
              ) : (
                <>
                  One payment, everything included. Prep courses charge $349
                  to $1,490 for less.
                </>
              )}
            </p>
          </>
        )}
        <div className="fp-try">
          <Link className="fp-try-btn" href="/foremanprep/practice">
            {paid ? "Start practice" : "Start free practice"}
          </Link>
          <Link className="fp-try-btn ghost" href="/foremanprep/exam">
            Exam simulator
          </Link>
          <Link className="fp-try-btn ghost" href="/foremanprep/audio">
            Audio study
          </Link>
        </div>
        {blOwned ? (
          <Link
            href="/foremanprep/bl-prep"
            style={{
              display: "block",
              width: "100%",
              boxSizing: "border-box",
              textAlign: "center",
              padding: "14px 16px",
              borderRadius: "10px",
              fontWeight: 700,
              fontSize: "16px",
              color: "#000",
              background: "linear-gradient(90deg, #f97316, #38bdf8)",
              textDecoration: "none",
              marginTop: "2px",
            }}
          >
            Open your Business &amp; Law prep
          </Link>
        ) : null}
        {paid ? null : (
          <p className="fp-tryhint">Free to try right now - no sign-up needed.</p>
        )}
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
                The NASCLA Commercial General Building exam is accepted for
                licensing in Alabama, Arizona, Arkansas, California, Florida,
                Georgia, Louisiana, Mississippi, Nevada, New Mexico, North
                Carolina, Oregon, South Carolina, Tennessee, Utah, Virginia,
                and West Virginia.
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <div className="fp-strip">
        <p className="fp-st">The exam is open book. That's the trap.</p>
        <p className="fp-sd">
          You can bring 24 approved reference books into the test - thousands
          of pages, with under 3 minutes per question. Nobody fails because
          they can't build. They fail because they can't find the answer fast
          enough. ForemanPrep trains exactly that: every practice question
          teaches you which book, which section, and how to get there fast.
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

      {paid ? null : (
        <>
      <h2 className="fp-h2">What prep costs today</h2>
      <div className="fp-price">
        {PRICES.map((p) => (
          <div className="fp-prow" key={p.l}>
            <div className="fp-pl">{p.l}</div>
            <div className="fp-pv">{p.v}</div>
          </div>
        ))}
        <div className="fp-prow fp-ours">
          <div className="fp-pl">ForemanPrep - tutor, questions, simulator</div>
          <div className="fp-pv">
            {earlyBird ? (
              <>
                <span className="fp-strike">$149</span>$99 early bird
              </>
            ) : (
              "$149"
            )}
          </div>
        </div>
        {earlyBird ? (
          <p className="fp-deadnote">
            Early-bird price ends Sept 7 - then it's $149
          </p>
        ) : null}
        <Link
          className="fp-cta"
          href="/foremanprep/buy"
          style={{ display: "block", marginTop: "14px", textAlign: "center", textDecoration: "none" }}
        >
          Get Full Access
        </Link>
      </div>
        </>
      )}

      {blOwned ? null : (
        <div className="fp-strip fp-blzone">
          <div className="fp-striphead">
            <p className="fp-st">The trade exam is only half the license.</p>
            <Link className="fp-learnpill" href="/foremanprep/bl-prep">
              Learn more
            </Link>
          </div>
          <p className="fp-sd">
            Most NASCLA states also make you pass a separate Business &amp;
            Law exam - contracts, lien law, payroll and taxes, insurance,
            estimating math. We built the drill room for that too: 120
            practice questions with instant explanations, free 10-question
            sample, one-time $79. No subscription, and it stacks onto the
            same account as your NASCLA GC access.
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              marginTop: "12px",
            }}
          >
            <Link className="fp-ctabl" href="/foremanprep/buy?product=bl">
              Get Business &amp; Law Prep - $79
            </Link>
            <Link className="fp-try-btn ghost" href="/foremanprep/bl">
              Try Business &amp; Law practice
            </Link>
          </div>
        </div>
      )}

      {paid || !earlyBird || signupHidden ? null : (
      <div className="fp-signup fp-float">
        <button
          aria-label="Hide this box"
          className="fp-floatx"
          onClick={() => setSignupHidden(true)}
          type="button"
        >
          x
        </button>
        <p className="fp-fh">Not ready to buy today?</p>
        <p className="fp-fs">
          The $99 early-bird price ends Sept 7 - it goes to $149 on Sept 8.
          Drop your email and we'll remind you before it does.
        </p>
        {phase === "done" ? (
          <p className="fp-ok">You're on the list. We'll give you a heads-up.</p>
        ) : (
          <div className="fp-row">
            <input
              className="fp-in"
              disabled={phase === "sending"}
              inputMode="email"
              onChange={(e) => {
                setEmail(e.target.value);
                if (phase === "error") setPhase("idle");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") join();
              }}
              placeholder="you@example.com"
              type="email"
              value={email}
            />
            <button
              className="fp-go"
              disabled={phase === "sending"}
              onClick={join}
              type="button"
            >
              {phase === "sending" ? "Saving..." : "Remind me"}
            </button>
          </div>
        )}
        {phase === "error" ? <p className="fp-err">{errorMsg}</p> : null}
        <p className="fp-fine">
          One reminder email. No spam, ever.
        </p>
      </div>
      )}

      <div className="fp-foot">
        <div className="fp-links">
          <Link className="fp-link" href="/foremanprep/bl-prep">
            Business &amp; Law
          </Link>
          <Link className="fp-link" href="/foremanprep/guides">
            Exam guides
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
          ForemanPrep is a product of AskEvo LLC, Boise, Idaho. Not affiliated
          with or endorsed by NASCLA or PSI. NASCLA is a registered trademark
          of the National Association of State Contractors Licensing Agencies.
          Questions: support@askevo.ai
        </p>
      </div>
    </div>
  );
}

// ============================================================
// END OF FILE - app/foremanprep/page.tsx (v30 - cross-brand
// badge cluster under the login button; mid-hero B&L badge and
// header early-bird chip removed; owner gradient door unchanged)
// If you can see this comment, the paste was not truncated.
// ============================================================
