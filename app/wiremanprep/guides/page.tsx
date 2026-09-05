// FILE: app/wiremanprep/guides/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import "../../foremanprep/guides/guides.css";
import { WM_GUIDES } from "@/lib/wiremanprep/guides";

// WiremanPrep guides index (v1) - the front door of the SEO
// library at wiremanprep.com/guides, adapted from the ForemanPrep
// hub and sharing its guides.css (fully var-driven, so the
// layout's .wm-zone paints it volt). Server component: lists
// every guide as a card so visitors browse and Google crawls its
// way into each article from one hub. Canonical points at the
// clean wiremanprep.com/guides address (proxy v19 rewrite).

export const metadata: Metadata = {
  title: "NASCLA Electrical Exam Guides - Free Study Resources | WiremanPrep",
  description:
    "Free guides for the NASCLA Master/Unlimited Electrical Contractor exam: how hard it is, which states accept it, the reference book list, how to study, and a free practice test.",
  alternates: { canonical: "https://wiremanprep.com/guides" },
  openGraph: {
    title: "NASCLA Electrical Exam Guides - Free Study Resources | WiremanPrep",
    description:
      "Free guides for the NASCLA Master/Unlimited Electrical Contractor exam - written by the team behind WiremanPrep.",
    url: "https://wiremanprep.com/guides",
    siteName: "WiremanPrep",
    type: "website",
  },
};

export default function WmGuidesIndexPage() {
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
        <p className="fg-eyebrow">Free resources</p>
        <h1 className="fg-h1">NASCLA Electrical Exam Guides</h1>
        <p className="fg-p">
          Straight answers about the NASCLA Master/Unlimited Electrical
          Contractor exam - the format, the states, the books, and how to
          study for it around service calls. Every fact checked against
          nascla.org and the official PSI candidate bulletin.
        </p>

        <div className="fg-cards">
          {WM_GUIDES.map((g) => (
            <Link
              className="fg-card"
              href={`/wiremanprep/guides/${g.slug}`}
              key={g.slug}
            >
              <p className="fg-cardh">{g.h1}</p>
              <p className="fg-cardp">{g.metaDescription}</p>
            </Link>
          ))}
        </div>

        <div className="fg-cta">
          <p className="fg-ctah">Rather just start practicing?</p>
          <p className="fg-ctap">
            The free WiremanPrep sample is 10 exam-style questions with full
            explanations and Code citations. No signup.
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
          <Link className="fp-link" href="/wiremanprep/terms">
            Terms
          </Link>
          <Link className="fp-link" href="/wiremanprep/privacy">
            Privacy
          </Link>
        </div>
        <p className="fp-legal">
          WiremanPrep is a product of AskEvo LLC, Boise, Idaho. Not affiliated
          with or endorsed by NASCLA, PSI, or the NFPA. Questions:
          support@askevo.ai
        </p>
      </div>
    </div>
  );
}

// -----------------------------------------------------------
// END OF FILE - app/wiremanprep/guides/page.tsx (v1 - guides
// index hub, volt)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
