// FILE: app/foremanprep/states/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import "../guides/guides.css";
import { STATES } from "@/lib/foremanprep/states";

// ForemanPrep states index (v1) - the hub at /states listing all
// 17 state guides as cards, Google's crawl door into each one.
// Same dress as the guides index (guides.css across folders).

export const metadata: Metadata = {
  title: "NASCLA States - Contractor License Guides for All 17 | ForemanPrep",
  description:
    "State-by-state guides to licensing with the NASCLA Commercial General Building Contractor exam: what it covers in each of the 17 participating states, and what each state still requires.",
  alternates: { canonical: "https://foremanprep.com/states" },
  openGraph: {
    title: "NASCLA States - Contractor License Guides for All 17 | ForemanPrep",
    description:
      "What the NASCLA exam covers in each participating state, and what each state still requires.",
    url: "https://foremanprep.com/states",
    siteName: "ForemanPrep",
    type: "website",
  },
};

export default function StatesIndexPage() {
  return (
    <div className="fp-wrap">
      <div className="fp-top">
        <Link className="fp-backpill" href="/foremanprep">
          Back to{" "}
          <span className="fp-wordmark">
            Foreman<span>Prep</span>
          </span>
        </Link>
      </div>

      <div className="fg-article">
        <p className="fg-eyebrow">State guides</p>
        <h1 className="fg-h1">NASCLA State-by-State License Guides</h1>
        <p className="fg-p">
          Pass the NASCLA Commercial General Building Contractor exam once and
          it counts in all 17 of these states (plus the US Virgin Islands).
          Each guide covers what the exam satisfies in that state, what the
          state still requires on top, and where the official rules live -
          verified against nascla.org and state boards, August 2026.
        </p>

        <div className="fg-cards">
          {STATES.map((s) => (
            <Link
              className="fg-card"
              href={`/foremanprep/states/${s.slug}`}
              key={s.slug}
            >
              <p className="fg-cardh">{s.name}</p>
              <p className="fg-cardp">{s.metaDescription}</p>
            </Link>
          ))}
        </div>

        <div className="fg-cta">
          <p className="fg-ctah">One exam. Seventeen states.</p>
          <p className="fg-ctap">
            Whichever state you test for, it is the same 115-question,
            5.5-hour open-book exam. ForemanPrep trains exactly that - start
            with the free 10-question sample.
          </p>
          <div className="fg-ctarow">
            <Link className="fg-ctabtn" href="/foremanprep/practice">
              Start free practice
            </Link>
          </div>
        </div>
      </div>

      <div className="fp-foot">
        <div className="fp-links">
          <Link className="fp-link" href="/foremanprep/guides">
            Exam guides
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
          with or endorsed by NASCLA, PSI, or any state licensing board.
          Licensing requirements change - always confirm with the board.
          Questions: support@askevo.ai
        </p>
      </div>
    </div>
  );
}

// -----------------------------------------------------------
// END OF FILE - app/foremanprep/states/page.tsx (v1 - states
// index hub)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
