// FILE: app/haullegal/states/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import "../../foremanprep/guides/guides.css";
import { HL_STATES } from "@/lib/haullegal/states";

// HaulLegal states index (v2 - copy says five by-the-mile charges
// now that Connecticut's Highway Use Fee is in the walkthrough.)
// v1 notes - the hub at haullegal.com/states
// listing all 50 state guides as cards, Google's crawl door into
// each one. Adapted from the WiremanPrep hub, sharing the
// ForemanPrep guides.css (var-driven, painted green by the
// layout's .hl-zone). Server component; canonical points at the
// clean address proxy v23 already rewrites onto this island.

export const metadata: Metadata = {
  title: "Trucking Authority by State - IRP, IFTA and In-State Rules for All 50 | HaulLegal",
  description:
    "State-by-state guides for new owner-operators: where apportioned plates and the IFTA license come from, whether your state requires a USDOT number or its own authority for in-state hauling, the five by-the-mile charges, UCR and permits. Verified September 2026.",
  alternates: { canonical: "https://haullegal.com/states" },
  openGraph: {
    title: "Trucking Authority by State - All 50 State Guides | HaulLegal",
    description:
      "IRP, IFTA, in-state authority, UCR and permits for a new trucking company in every state - verified against the state agencies, September 2026.",
    url: "https://haullegal.com/states",
    siteName: "HaulLegal",
    type: "website",
  },
};

export default function HlStatesIndexPage() {
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

      <div className="fg-article">
        <p className="fg-eyebrow">State guides</p>
        <h1 className="fg-h1">Starting a Trucking Company, State by State</h1>
        <p className="fg-p">
          Your USDOT number and operating authority come from FMCSA and work
          the same everywhere. The state layer does not: where you get
          apportioned plates, who issues your IFTA license, whether the state
          wants its own registration for trucks that never leave it, whether
          it requires a USDOT number for in-state-only trucks, the five
          by-the-mile charges, UCR participation, and who runs roadside
          enforcement. One page per state, checked against the state
          agencies, statutes and FMCSA in September 2026.
        </p>

        <div className="fg-cards">
          {HL_STATES.map((s) => (
            <Link
              className="fg-card"
              href={`/haullegal/states/${s.slug}`}
              key={s.slug}
            >
              <p className="fg-cardh">{s.name}</p>
              <p className="fg-cardp">{s.card}</p>
            </Link>
          ))}
        </div>

        <div className="fg-cta">
          <p className="fg-ctah">The federal steps come first - and they are the same in every state.</p>
          <p className="fg-ctap">
            The HaulLegal walkthrough lays out all 23 steps in order with the
            real fee beside each one, then hands you off to your state for
            plates and fuel tax. The first four steps are free, no signup.
          </p>
          <div className="fg-ctarow">
            <Link className="fg-ctabtn" href="/haullegal/start">
              See the steps free
            </Link>
            <Link className="fg-ctabtn ghost" href="/haullegal/guides">
              Read the guides
            </Link>
          </div>
        </div>
      </div>

      <div className="fp-foot">
        <div className="fp-links">
          <Link className="fp-link" href="/haullegal/guides">
            Guides
          </Link>
          <Link className="fp-link" href="/haullegal/terms">
            Terms
          </Link>
          <Link className="fp-link" href="/haullegal/privacy">
            Privacy
          </Link>
        </div>
        <p className="fp-legal">
          HaulLegal is a product of AskEvo LLC, Boise, Idaho. Not a government
          agency; not affiliated with the U.S. DOT, FMCSA, the IRS, or any
          state agency. Not a law firm; not legal advice. Requirements change
          - always confirm with the state office. Questions: support@askevo.ai
        </p>
      </div>
    </div>
  );
}

// -----------------------------------------------------------
// END OF FILE - app/haullegal/states/page.tsx (v2 - five
// by-the-mile charges; states index hub, green, all 50)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
