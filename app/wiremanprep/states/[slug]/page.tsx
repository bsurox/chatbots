// FILE: app/wiremanprep/states/[slug]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import "../../../foremanprep/guides/guides.css";
import { getWmState, WM_STATES } from "@/lib/wiremanprep/states";

// WiremanPrep state-page renderer (v1) - one server-rendered
// template behind all 17 /states/<slug> SEO pages, adapted from
// the ForemanPrep state renderer. Same article dress (the shared
// guides.css, fully var-driven, painted volt by the layout's
// .wm-zone), clean-URL canonicals via proxy v19's /states
// rewrite. The board link is a real anchor tag ON PURPOSE - the
// one standing exception to the no-anchor rule, because it leaves
// the site for the state board. Unknown slugs 404.

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return WM_STATES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const st = getWmState(slug);
  if (!st) return {};
  return {
    title: st.metaTitle,
    description: st.metaDescription,
    alternates: { canonical: `https://wiremanprep.com/states/${st.slug}` },
    openGraph: {
      title: st.metaTitle,
      description: st.metaDescription,
      url: `https://wiremanprep.com/states/${st.slug}`,
      siteName: "WiremanPrep",
      type: "article",
    },
  };
}

export default async function WmStatePage({ params }: Params) {
  const { slug } = await params;
  const st = getWmState(slug);
  if (!st) notFound();

  const related = st.related
    .map((r) => getWmState(r))
    .filter((x): x is NonNullable<typeof x> => x !== null);

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

      <article className="fg-article">
        <p className="fg-eyebrow">State guide</p>
        <h1 className="fg-h1">{st.h1}</h1>
        <p className="fg-updated">{st.updated}</p>

        {st.intro.map((para, i) => (
          <p className="fg-p" key={i}>
            {para}
          </p>
        ))}

        <div className="fg-facts">
          {st.facts.map((f) => (
            <div className="fg-frow" key={f.l}>
              <div className="fg-fl">{f.l}</div>
              <div className="fg-fv">{f.v}</div>
            </div>
          ))}
        </div>

        {st.sections.map((s, i) => (
          <div key={i}>
            {s.h ? <h2 className="fg-h2">{s.h}</h2> : null}
            {s.p
              ? s.p.map((para, j) => (
                  <p className="fg-p" key={j}>
                    {para}
                  </p>
                ))
              : null}
          </div>
        ))}

        <p className="fg-p">
          Official source for current requirements:{" "}
          <a
            className="fg-rellink"
            href={st.boardUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            {st.boardLabel}
          </a>
        </p>

        <div className="fg-cta">
          <p className="fg-ctah">Testing for {st.name}? Train for the real thing.</p>
          <p className="fg-ctap">
            WiremanPrep is built for this exact exam - 153 exam-weighted
            practice questions with Code-section citations, a true 1:1
            simulator (100 questions on the real 4.5-hour clock at the real
            subject weights), timed practice at true exam pace, and an AI
            tutor on every question. Start with 10 free questions, no signup.
          </p>
          <div className="fg-ctarow">
            <Link className="fg-ctabtn" href="/wiremanprep/practice">
              Start free practice
            </Link>
            <Link className="fg-ctabtn ghost" href="/wiremanprep/guides/nascla-electrical-exam-states">
              All 17 boards
            </Link>
          </div>
        </div>

        {related.length > 0 ? (
          <>
            <p className="fg-relh">Nearby state guides</p>
            <div className="fg-rel">
              {related.map((r) => (
                <Link
                  className="fg-rellink"
                  href={`/wiremanprep/states/${r.slug}`}
                  key={r.slug}
                >
                  {r.h1}
                </Link>
              ))}
            </div>
          </>
        ) : null}
      </article>

      <div className="fp-foot">
        <div className="fp-links">
          <Link className="fp-link" href="/wiremanprep/states">
            All states
          </Link>
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
// END OF FILE - app/wiremanprep/states/[slug]/page.tsx (v1 -
// server-rendered state guide template, volt)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
