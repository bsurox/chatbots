// FILE: app/haullegal/guides/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import "../../foremanprep/guides/guides.css";
import { HL_GUIDES } from "@/lib/haullegal/guides";

// HaulLegal guides index (v1) - the front door of the SEO library
// at haullegal.com/guides, adapted from the WiremanPrep hub and
// sharing the ForemanPrep guides.css (var-driven, so the layout's
// .hl-zone paints it green). Server component: lists every guide
// as a card so visitors browse and Google crawls its way into each
// article from one hub. Canonical points at the clean
// haullegal.com/guides address (proxy v23 rewrite).

export const metadata: Metadata = {
  title: "Trucking Authority Guides for New Owner-Operators | HaulLegal",
  description:
    "Free plain-English guides on getting your trucking authority in 2026: USDOT vs MC number, what it really costs, the BOC-3, Motus, the New Entrant audit, IFTA, Form 2290, and the by-the-mile states.",
  alternates: { canonical: "https://haullegal.com/guides" },
  openGraph: {
    title: "Trucking Authority Guides for New Owner-Operators | HaulLegal",
    description:
      "Free plain-English guides on getting your trucking authority and staying legal - verified against FMCSA, the IRS, UCR and IFTA.",
    url: "https://haullegal.com/guides",
    siteName: "HaulLegal",
    type: "website",
  },
};

export default function HlGuidesIndexPage() {
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
        <p className="fg-eyebrow">Free resources</p>
        <h1 className="fg-h1">Trucking Authority Guides</h1>
        <p className="fg-p">
          Straight answers for a new owner-operator - what the government
          actually charges, the order things happen in, the new Motus
          system, and the deadlines that follow once you are active. Every
          fact checked against FMCSA, the federal regulations, the IRS, UCR
          and IFTA, September 2026.
        </p>

        <div className="fg-cards">
          {HL_GUIDES.map((g) => (
            <Link
              className="fg-card"
              href={`/haullegal/guides/${g.slug}`}
              key={g.slug}
            >
              <p className="fg-cardh">{g.h1}</p>
              <p className="fg-cardp">{g.metaDescription}</p>
            </Link>
          ))}
        </div>

        <div className="fg-cta">
          <p className="fg-ctah">Rather just see the steps?</p>
          <p className="fg-ctap">
            The HaulLegal walkthrough lays out all 23 steps in order with the
            real fee beside each one. The first four are free, no signup.
          </p>
          <div className="fg-ctarow">
            <Link className="fg-ctabtn" href="/haullegal/start">
              See the steps free
            </Link>
            <Link className="fg-ctabtn ghost" href="/haullegal/calendar">
              Try the deadline calendar
            </Link>
          </div>
        </div>
      </div>

      <div className="fp-foot">
        <div className="fp-links">
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
          state agency. Not a law firm; not legal advice. Questions:
          support@askevo.ai
        </p>
      </div>
    </div>
  );
}

// -----------------------------------------------------------
// END OF FILE - app/haullegal/guides/page.tsx (v1 - guides
// index hub, green)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
