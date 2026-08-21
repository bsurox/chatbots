// FILE: app/foremanprep/guides/[slug]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import "../guides.css";
import { GUIDES, getGuide, type GuideSection } from "@/lib/foremanprep/guides";

// ForemanPrep guide renderer (v1) - the server-rendered article
// template behind every /guides/<slug> SEO page. Pure server
// component: Google gets finished HTML, no client JS beyond the
// layout's usual furniture. Content lives in lib/foremanprep/
// guides.ts; this file only dresses it. Each page carries its own
// title, description, and a canonical URL pointing at the CLEAN
// address (foremanprep.com/guides/<slug>) that proxy.ts v11
// rewrites onto this island - so Google indexes short URLs even
// though the file lives under /foremanprep. Unknown slugs 404.

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return {
    title: guide.metaTitle,
    description: guide.metaDescription,
    alternates: { canonical: `https://foremanprep.com/guides/${guide.slug}` },
    openGraph: {
      title: guide.metaTitle,
      description: guide.metaDescription,
      url: `https://foremanprep.com/guides/${guide.slug}`,
      siteName: "ForemanPrep",
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

function Section({ s }: { s: GuideSection }) {
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

export default async function GuidePage({ params }: Params) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const related = guide.related
    .map((r) => getGuide(r))
    .filter((g): g is NonNullable<typeof g> => g !== null);

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
                  href={`/foremanprep/guides/${r.slug}`}
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
          <Link className="fp-link" href="/foremanprep/guides">
            All guides
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
          with or endorsed by NASCLA or PSI. Questions: support@askevo.ai
        </p>
      </div>
    </div>
  );
}

// -----------------------------------------------------------
// END OF FILE - app/foremanprep/guides/[slug]/page.tsx (v1 -
// server-rendered guide article template)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
