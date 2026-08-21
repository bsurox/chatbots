// FILE: app/foremanprep/guides/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import "./guides.css";
import { GUIDES } from "@/lib/foremanprep/guides";

// ForemanPrep guides index (v1) - the front door of the SEO
// library at /guides. Server component: lists every guide as a
// card so visitors browse and Google crawls its way into each
// article from one hub. Canonical points at the clean
// foremanprep.com/guides address (proxy.ts v11 rewrite).

export const metadata: Metadata = {
  title: "NASCLA Exam Guides - Free Study Resources | ForemanPrep",
  description:
    "Free guides for the NASCLA Commercial General Building Contractor exam: how hard it is, which states accept it, the full reference book list, how to study, and a free practice test.",
  alternates: { canonical: "https://foremanprep.com/guides" },
  openGraph: {
    title: "NASCLA Exam Guides - Free Study Resources | ForemanPrep",
    description:
      "Free guides for the NASCLA Commercial General Building Contractor exam - written by the team behind ForemanPrep.",
    url: "https://foremanprep.com/guides",
    siteName: "ForemanPrep",
    type: "website",
  },
};

export default function GuidesIndexPage() {
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
        <p className="fg-eyebrow">Free resources</p>
        <h1 className="fg-h1">NASCLA Exam Guides</h1>
        <p className="fg-p">
          Straight answers about the NASCLA Commercial General Building
          Contractor exam - the format, the states, the books, and how to
          study for it around a working schedule. Every fact checked against
          nascla.org and the official PSI candidate bulletin.
        </p>

        <div className="fg-cards">
          {GUIDES.map((g) => (
            <Link
              className="fg-card"
              href={`/foremanprep/guides/${g.slug}`}
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
            The free ForemanPrep sample is 10 exam-style questions with full
            explanations and book citations. No signup.
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
          <Link className="fp-link" href="/foremanprep/terms">
            Terms
          </Link>
          <Link className="fp-link" href="/foremanprep/privacy">
            Privacy
          </Link>
        </div>
        <p className="fp-legal">
          ForemanPrep is a product of AskEvo LLC, Boise, Idaho. Not affiliated
          with or endorsed by NASCLA or PSI. Questions: support@askevo.ai
        </p>
      </div>
    </div>
  );
}

// -----------------------------------------------------------
// END OF FILE - app/foremanprep/guides/page.tsx (v1 - guides
// index hub)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
