// FILE: app/wiremanprep/guides/[slug]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import "../../../foremanprep/guides/guides.css";
import { getWmGuide, WM_GUIDES, type WmGuideSection } from "@/lib/wiremanprep/guides";

// WiremanPrep guide renderer (v1) - the server-rendered article
// template behind every wiremanprep.com/guides/<slug> SEO page,
// adapted from the ForemanPrep renderer and sharing its
// guides.css (the layout's .wm-zone recolors the var-driven fg-
// classes volt by itself - guides.css is fully var(--fp) driven,
// zero hardcoded oranges). Pure server component: Google gets
// finished HTML. Content lives in lib/wiremanprep/guides.ts; this
// file only dresses it. Canonicals point at the CLEAN address
// (wiremanprep.com/guides/<slug>) that proxy v19 rewrites onto
// this island. Unknown slugs 404.

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return WM_GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const guide = getWmGuide(slug);
  if (!guide) return {};
  return {
    title: guide.metaTitle,
    description: guide.metaDescription,
    alternates: { canonical: `https://wiremanprep.com/guides/${guide.slug}` },
    openGraph: {
      title: guide.metaTitle,
      description: guide.metaDescription,
      url: `https://wiremanprep.com/guides/${guide.slug}`,
      siteName: "WiremanPrep",
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

function Section({ s }: { s: WmGuideSection }) {
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

export default async function WmGuidePage({ params }: Params) {
  const { slug } = await params;
  const guide = getWmGuide(slug);
  if (!guide) notFound();

  const related = guide.related
    .map((r) => getWmGuide(r))
    .filter((g): g is NonNullable<typeof g> => g !== null);

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
                  href={`/wiremanprep/guides/${r.slug}`}
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
          <Link className="fp-link" href="/wiremanprep/guides">
            All guides
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
          with or endorsed by NASCLA, PSI, or the NFPA. Questions: support@askevo.ai
        </p>
      </div>
    </div>
  );
}

// -----------------------------------------------------------
// END OF FILE - app/wiremanprep/guides/[slug]/page.tsx (v1 -
// server-rendered guide article template, volt)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
