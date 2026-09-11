// FILE: app/haullegal/guides/[slug]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import "../../../foremanprep/guides/guides.css";
import { getHlGuide, HL_GUIDES, type HlGuideSection } from "@/lib/haullegal/guides";

// HaulLegal guide renderer (v1) - the server-rendered article
// template behind every haullegal.com/guides/<slug> SEO page,
// adapted from the WiremanPrep renderer and sharing the
// ForemanPrep guides.css (the layout's .hl-zone recolors the
// var-driven fg- classes green by itself; the one hardcoded
// orange in that file, the CTA card border, is caught in
// haullegal.css v2). Pure server component: Google gets finished
// HTML. Content lives in lib/haullegal/guides.ts; this file only
// dresses it. Canonicals point at the CLEAN address
// (haullegal.com/guides/<slug>) that proxy v23 rewrites onto this
// island. Unknown slugs 404.

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return HL_GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const guide = getHlGuide(slug);
  if (!guide) return {};
  return {
    title: guide.metaTitle,
    description: guide.metaDescription,
    alternates: { canonical: `https://haullegal.com/guides/${guide.slug}` },
    openGraph: {
      title: guide.metaTitle,
      description: guide.metaDescription,
      url: `https://haullegal.com/guides/${guide.slug}`,
      siteName: "HaulLegal",
      type: "article",
    },
  };
}

// Text wrapped in single asterisks renders bold: "a *key* point".
function bold(text: string): React.ReactNode[] {
  const parts = text.split("*");
  return parts.map((part, i) =>
    i % 2 === 1 ? <b key={i}>{part}</b> : <span key={i}>{part}</span>
  );
}

function Section({ s }: { s: HlGuideSection }) {
  return (
    <>
      {s.h ? <h2 className="fg-h2">{s.h}</h2> : null}
      {s.facts ? (
        <div className="fg-facts">
          {s.facts.map((f) => (
            <div className="fg-frow" key={f.l}>
              <div className="fg-fl">{f.l}</div>
              <div className="fg-fv">{f.v}</div>
            </div>
          ))}
        </div>
      ) : null}
      {s.p
        ? s.p.map((para, i) => (
            <p className="fg-p" key={i}>
              {bold(para)}
            </p>
          ))
        : null}
      {s.list ? (
        <ul className="fg-list">
          {s.list.map((item, i) => (
            <li key={i}>{bold(item)}</li>
          ))}
        </ul>
      ) : null}
    </>
  );
}

export default async function HlGuidePage({ params }: Params) {
  const { slug } = await params;
  const guide = getHlGuide(slug);
  if (!guide) notFound();

  const related = guide.related
    .map((r) => getHlGuide(r))
    .filter((g): g is NonNullable<typeof g> => g !== null);

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
        <p className="fg-eyebrow">{guide.eyebrow}</p>
        <h1 className="fg-h1">{guide.h1}</h1>
        <p className="fg-updated">{guide.updated}</p>

        {guide.intro.map((para, i) => (
          <p className="fg-p" key={i}>
            {bold(para)}
          </p>
        ))}

        {guide.sections.map((s, i) => (
          <Section key={i} s={s} />
        ))}

        <div className="fg-cta">
          <p className="fg-ctah">{guide.ctaH}</p>
          <p className="fg-ctap">{guide.ctaP}</p>
          <div className="fg-ctarow">
            {guide.ctas.map((c) => (
              <Link
                className={c.ghost ? "fg-ctabtn ghost" : "fg-ctabtn"}
                href={c.href}
                key={c.href}
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>

        {related.length > 0 ? (
          <>
            <p className="fg-relh">Keep reading</p>
            <div className="fg-rel">
              {related.map((r) => (
                <Link
                  className="fg-rellink"
                  href={`/haullegal/guides/${r.slug}`}
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
          <Link className="fp-link" href="/haullegal/guides">
            All guides
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
          state agency. Not a law firm; not legal advice. You complete every
          filing yourself. Questions: support@askevo.ai
        </p>
      </div>
    </div>
  );
}

// -----------------------------------------------------------
// END OF FILE - app/haullegal/guides/[slug]/page.tsx (v1 -
// server-rendered guide article template, green)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
