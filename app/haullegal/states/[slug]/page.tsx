// FILE: app/haullegal/states/[slug]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import "../../../foremanprep/guides/guides.css";
import { getHlGuide } from "@/lib/haullegal/guides";
import { getHlState, HL_STATES, type HlStateSection } from "@/lib/haullegal/states";

// HaulLegal state-page renderer (v1) - one server-rendered
// template behind all 50 haullegal.com/states/<slug> SEO pages,
// adapted from the WiremanPrep state renderer and the HaulLegal
// guide renderer. Same article dress (the shared guides.css, fully
// var-driven, painted green by the layout's .hl-zone; the CTA
// border catch lives in haullegal.css v2). Content comes from
// lib/haullegal/states.ts; this file only dresses it. Canonicals
// point at the CLEAN address (haullegal.com/states/<slug>) that
// proxy v23 already rewrites onto this island. The official state
// links are real anchor tags ON PURPOSE - the standing exception
// to the no-anchor rule, because they leave the site for the state
// office. Unknown slugs 404.

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return HL_STATES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const st = getHlState(slug);
  if (!st) return {};
  return {
    title: st.metaTitle,
    description: st.metaDescription,
    alternates: { canonical: `https://haullegal.com/states/${st.slug}` },
    openGraph: {
      title: st.metaTitle,
      description: st.metaDescription,
      url: `https://haullegal.com/states/${st.slug}`,
      siteName: "HaulLegal",
      type: "article",
    },
  };
}

function Section({ s }: { s: HlStateSection }) {
  return (
    <>
      {s.h ? <h2 className="fg-h2">{s.h}</h2> : null}
      {s.p
        ? s.p.map((para, i) => (
            <p className="fg-p" key={i}>
              {para}
            </p>
          ))
        : null}
      {s.list ? (
        <ul className="fg-list">
          {s.list.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      ) : null}
    </>
  );
}

export default async function HlStatePage({ params }: Params) {
  const { slug } = await params;
  const st = getHlState(slug);
  if (!st) notFound();

  const related = st.related
    .map((r) => getHlState(r))
    .filter((x): x is NonNullable<typeof x> => x !== null);
  const guides = st.guides
    .map((g) => getHlGuide(g))
    .filter((x): x is NonNullable<typeof x> => x !== null);

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
          <Section key={i} s={s} />
        ))}

        {st.links.length > 0 ? (
          <>
            <p className="fg-relh">Official {st.name} pages</p>
            <div className="fg-rel">
              {st.links.map((l) => (
                <a
                  className="fg-rellink"
                  href={l.url}
                  key={l.url}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </>
        ) : null}

        <div className="fg-cta">
          <p className="fg-ctah">Based in {st.name}? The walkthrough puts all of this in order.</p>
          <p className="fg-ctap">
            The HaulLegal walkthrough lays out every step from the business
            filing to your first safety audit, federal and state, with the
            real government fee beside each one - and the Stay Legal calendar
            turns your USDOT number and dates into a deadline list that
            emails you before each one. The first four steps are free, no
            signup.
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

        {guides.length > 0 ? (
          <>
            <p className="fg-relh">Keep reading</p>
            <div className="fg-rel">
              {guides.map((g) => (
                <Link
                  className="fg-rellink"
                  href={`/haullegal/guides/${g.slug}`}
                  key={g.slug}
                >
                  {g.h1}
                </Link>
              ))}
            </div>
          </>
        ) : null}

        {related.length > 0 ? (
          <>
            <p className="fg-relh">Nearby state guides</p>
            <div className="fg-rel">
              {related.map((r) => (
                <Link
                  className="fg-rellink"
                  href={`/haullegal/states/${r.slug}`}
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
          <Link className="fp-link" href="/haullegal/states">
            All states
          </Link>
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
          - always confirm with the state office. You complete every filing
          yourself. Questions: support@askevo.ai
        </p>
      </div>
    </div>
  );
}

// -----------------------------------------------------------
// END OF FILE - app/haullegal/states/[slug]/page.tsx (v1 -
// server-rendered state guide template, green)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
