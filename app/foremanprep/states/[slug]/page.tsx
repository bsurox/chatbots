// FILE: app/foremanprep/states/[slug]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import "../../guides/guides.css";
import { STATES, getState } from "@/lib/foremanprep/states";

// ForemanPrep state-page renderer (v1) - one server-rendered
// template behind all 17 /states/<slug> SEO pages. Same article
// dress as the guides (guides.css, imported across folders), same
// clean-URL canonicals via proxy v11's /states rewrite. The board
// link is a real anchor tag ON PURPOSE - Next's Link is for
// in-app routes, and this one leaves the site for the state
// board. Unknown slugs 404.

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return STATES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const st = getState(slug);
  if (!st) return {};
  return {
    title: st.metaTitle,
    description: st.metaDescription,
    alternates: { canonical: `https://foremanprep.com/states/${st.slug}` },
    openGraph: {
      title: st.metaTitle,
      description: st.metaDescription,
      url: `https://foremanprep.com/states/${st.slug}`,
      siteName: "ForemanPrep",
      type: "article",
    },
  };
}

export default async function StatePage({ params }: Params) {
  const { slug } = await params;
  const st = getState(slug);
  if (!st) notFound();

  const related = st.related
    .map((r) => getState(r))
    .filter((x): x is NonNullable<typeof x> => x !== null);

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
          <p className="fg-ctah">Testing in {st.name}? Train for the real thing.</p>
          <p className="fg-ctap">
            ForemanPrep is built for this exact exam - 156 exam-weighted
            practice questions with book-and-page citations, a full
            115-question simulator on the real 5.5-hour clock, timed practice
            rounds at true exam pace, and audio study for the drive between
            jobs. Start with 10 free questions, no signup.
          </p>
          <div className="fg-ctarow">
            <Link className="fg-ctabtn" href="/foremanprep/practice">
              Start free practice
            </Link>
            <Link className="fg-ctabtn ghost" href="/foremanprep/guides/nascla-exam-states">
              All 17 NASCLA states
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
                  href={`/foremanprep/states/${r.slug}`}
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
          <Link className="fp-link" href="/foremanprep/states">
            All states
          </Link>
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
// END OF FILE - app/foremanprep/states/[slug]/page.tsx (v1 -
// server-rendered state guide template)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
