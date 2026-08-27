// FILE: app/foremanprep/bl-packs/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import "../practice/practice.css";
import { BL_STATE_PACKS } from "@/lib/foremanprep/blstates";

// STATE PACKS - the dedicated page (v1). His call: the landing's
// State packs button used to deep-link the bottom of the practice
// page, which felt like being dumped somewhere generic. This page
// is the packs' own front door: every B&L state as a card. A state
// with a live pack links /foremanprep/bl?pack=<key>, which starts
// that state's statute round directly in the practice player
// (bl v9 reads the param - paid users drop straight into the
// round, free users get the gate). States without a pack yet show
// as coming soon and light up automatically the moment their
// questions land in blstates - this page reads pack status from
// the data, so shipping a new pack state needs zero edits here.
// A server component like bl-prep: real metadata for Google, no
// clocks, no access checks - the practice room downstream owns
// the gate. Wears the B&L blue via .fp-blzone; the grid reuses
// the practice picker's card dress (practice.css). Back pill
// follows his rule: B&L pages back out to /bl-prep. Clean URL
// /bl-packs via proxy v16; sitemap v6 lists it.

export const metadata: Metadata = {
  title: "State Packs - Your State's Contractor Law - ForemanPrep",
  description:
    "Statute-verified Business & Law practice for your state: lien deadlines, license thresholds, retainage caps - the numbers that differ state to state, drilled as their own rounds.",
  alternates: { canonical: "https://foremanprep.com/bl-packs" },
};

export default function BlPacksPage() {
  const live = BL_STATE_PACKS.filter((p) => p.questions.length > 0);
  const coming = BL_STATE_PACKS.filter((p) => p.questions.length === 0);
  return (
    <div className="fp-blzone">
      <div className="fq-wrap">
        <div className="fq-head">
          <Link className="fp-backpill" href="/foremanprep/bl-prep">
            <span className="fp-wordmark">
              Business &amp; <span>Law</span>
            </span>
          </Link>
        </div>
        <p className="fq-title">State packs</p>
        <p className="fq-hint">
          The core Business &amp; Law material is the same everywhere -
          but the NUMBERS are not. Lien deadlines, license thresholds,
          retainage caps, bid limits: every state draws those lines in
          its own statutes.{" "}
          <span className="fq-hint-hl">
            Each pack drills one state's real numbers, verified against
            that state's actual code.
          </span>
        </p>
        <p className="fq-hint">
          Tap your state to start its round. Included with Business &amp;
          Law prep.
        </p>
        <div className="fq-pick">
          {live.map((p) => (
            <Link
              className="fq-sub"
              href={"/foremanprep/bl?pack=" + p.key}
              key={p.key}
            >
              <span className="fq-sn">{p.name}</span>
              <span className="fq-sw">
                {p.questions.length} statute questions - start the round
              </span>
            </Link>
          ))}
        </div>
        {coming.length > 0 ? (
          <div style={{ marginTop: "24px" }}>
            <span className="fq-lenlabel">On the way</span>
            <div className="fq-pick" style={{ marginTop: "8px" }}>
              {coming.map((p) => (
                <div className="fq-sub" key={p.key} style={{ opacity: 0.55, cursor: "default" }}>
                  <span className="fq-sn">{p.name}</span>
                  <span className="fq-sw">pack coming soon</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
        <p className="fq-hint" style={{ marginTop: "20px" }}>
          Packs are focused study rounds, not exam simulators - for your
          state's full 1:1 exam (real question count, real clock, real
          pass bar), use the{" "}
          <Link className="fq-hint-hl" href="/foremanprep/bl-exam" style={{ textDecoration: "none" }}>
            State Exam Simulator
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

// ============================================================
// END OF FILE - app/foremanprep/bl-packs/page.tsx (v1 - the
// state packs' own front door)
// If you can see this comment, the paste was not truncated.
// ============================================================
