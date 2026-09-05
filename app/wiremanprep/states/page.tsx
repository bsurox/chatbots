// FILE: app/wiremanprep/states/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import "../../foremanprep/guides/guides.css";
import { WM_STATES } from "@/lib/wiremanprep/states";

// WiremanPrep states index (v1) - the hub at wiremanprep.com/states
// listing all 17 board guides as cards, Google's crawl door into
// each one. Adapted from the ForemanPrep hub, sharing guides.css
// (var-driven, painted volt by the layout's .wm-zone).

export const metadata: Metadata = {
  title: "NASCLA Electrical Exam States - All 17 Board Guides | WiremanPrep",
  description:
    "Board-by-board guides to licensing with the NASCLA Master/Unlimited electrical exam: what it covers with each of the 17 accepting boards, what each still requires, and the transcript caveats.",
  alternates: { canonical: "https://wiremanprep.com/states" },
  openGraph: {
    title: "NASCLA Electrical Exam States - All 17 Board Guides | WiremanPrep",
    description:
      "What the NASCLA electrical exam covers with each accepting board, and what each board still requires.",
    url: "https://wiremanprep.com/states",
    siteName: "WiremanPrep",
    type: "website",
  },
};

export default function WmStatesIndexPage() {
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

      <div className="fg-article">
        <p className="fg-eyebrow">State guides</p>
        <h1 className="fg-h1">NASCLA Electrical Exam - State-by-State Guides</h1>
        <p className="fg-p">
          Seventeen licensing boards recognize the NASCLA Master/Unlimited
          electrical exam - the same standardized 100-question, open-book test
          everywhere. Each guide covers what the exam satisfies with that
          board, what the board still requires on top, and the caveats that
          matter (endorsement-only states, boards that do not accept incoming
          transcripts, score windows) - verified against nascla.org and the
          boards, September 2026.
        </p>

        <div className="fg-cards">
          {WM_STATES.map((s) => (
            <Link
              className="fg-card"
              href={`/wiremanprep/states/${s.slug}`}
              key={s.slug}
            >
              <p className="fg-cardh">{s.name}</p>
              <p className="fg-cardp">{s.metaDescription}</p>
            </Link>
          ))}
        </div>

        <div className="fg-cta">
          <p className="fg-ctah">One exam. Seventeen boards.</p>
          <p className="fg-ctap">
            Whichever board you test for, it is the same 100-question,
            4.5-hour open-book exam. WiremanPrep trains exactly that - start
            with the free 10-question sample.
          </p>
          <div className="fg-ctarow">
            <Link className="fg-ctabtn" href="/wiremanprep/practice">
              Start free practice
            </Link>
          </div>
        </div>
      </div>

      <div className="fp-foot">
        <div className="fp-links">
          <Link className="fp-link" href="/wiremanprep/guides">
            Exam guides
          </Link>
          <Link className="fp-link" href="/wiremanprep/terms">
            Terms
          </Link>
          <Link className="fp-link" href="/wiremanprep/privacy">
            Privacy
          </Link>
        </div>
        <p className="fp-legal">
          WiremanPrep is a product of AskEvo LLC, Boise, Idaho. Not affiliated
          with or endorsed by NASCLA, PSI, the NFPA, or any state licensing
          board. Licensing requirements change - always confirm with the
          board. Questions: support@askevo.ai
        </p>
      </div>
    </div>
  );
}

// -----------------------------------------------------------
// END OF FILE - app/wiremanprep/states/page.tsx (v1 - states
// index hub, volt)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
