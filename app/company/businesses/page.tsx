// FILE: app/company/businesses/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { type Brand, BRANDS, type Door, type Social } from "../brands";
import { AppleIcon, InstagramIcon, PlayStoreIcon, YoutubeIcon } from "../icons";

// The full businesses page (v1). Every brand gets a real section -
// what it is, who it is for, what you actually get - instead of the
// card-sized summary on the landing page. Each section's id is the
// brand's slug, so a card click on the landing page lands straight
// on that brand here (/businesses#haullegal).
// A server component on purpose: nothing here is interactive, so
// this page renders on the server and can own its own metadata.
// Reached at askevo.ai/businesses - proxy.ts rewrites that clean
// URL onto this route.

export const metadata: Metadata = {
  title: "Our businesses - AskEvo LLC",
  description:
    "The four businesses AskEvo LLC builds and runs: ForemanPrep and WiremanPrep for trade licensing exams, HaulLegal for new trucking authority, and Spotmint for AI video ads.",
};

function DoorButton({ door }: { door: Door }) {
  if (!door.href) return null;
  const style = { ["--btn" as string]: door.color } as React.CSSProperties;
  const glyph = door.icon === "play" ? <PlayStoreIcon /> : door.icon === "apple" ? <AppleIcon /> : null;
  const cls = glyph ? "ae-store" : door.ghost ? "ae-btn ghost" : "ae-btn";
  return (
    <Link
      aria-label={glyph ? door.label : undefined}
      className={cls}
      href={door.href}
      prefetch={false}
      style={style}
      target={door.external ? "_blank" : undefined}
      title={glyph ? door.label : undefined}
      rel={door.external ? "noopener noreferrer" : undefined}
    >
      {glyph || door.label}
    </Link>
  );
}

function SocialLink({ s, gid }: { s: Social; gid: string }) {
  return (
    <Link
      aria-label={s.label}
      className="ae-soc"
      href={s.href}
      prefetch={false}
      rel="noopener noreferrer"
      target="_blank"
      title={s.label}
    >
      {s.kind === "yt" ? <YoutubeIcon /> : <InstagramIcon gid={gid} />}
    </Link>
  );
}

function Section({ b }: { b: Brand }) {
  const style = { ["--brand" as string]: b.color } as React.CSSProperties;
  return (
    <section className="ae-biz" id={b.slug} style={style}>
      <div className="ae-bizhead">
        <h2 className="ae-bizname">{b.name}</h2>
        <span className="ae-tag">{b.tag}</span>
      </div>
      <p className="ae-domain">{b.domain}</p>
      <div className="ae-bizbody">
        <div className="ae-prose">
          {b.long.map((para) => (
            <p key={para.slice(0, 32)}>{para}</p>
          ))}
          <p className="ae-who">{b.who}</p>
        </div>
        <div className="ae-gets">
          <p className="ae-getsk">What you get</p>
          <ul className="ae-getslist">
            {b.gets.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="ae-cardfoot">
        <div className="ae-btns">
          {b.doors.filter((d) => !d.icon).map((d) => (
            <DoorButton door={d} key={d.label} />
          ))}
        </div>
        <div className="ae-socials">
          {b.doors.filter((d) => d.icon).map((d) => (
            <DoorButton door={d} key={d.label} />
          ))}
          {b.socials.map((s) => (
            <SocialLink gid={"biz-" + b.slug + "-" + s.kind} key={s.label} s={s} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function BusinessesPage() {
  return (
    <>
      <section className="ae-pagehead">
        <p className="ae-kicker">AskEvo LLC</p>
        <h1 className="ae-h1 small">Our businesses</h1>
        <p className="ae-lead">
          Four brands, one company. Each was built for one group of people with one problem worth solving properly, and each runs on its own site under its own name.
        </p>
        <div className="ae-jump">
          {BRANDS.map((b) => (
            <Link
              className="ae-jumpbtn"
              href={"#" + b.slug}
              key={b.slug}
              prefetch={false}
              style={{ ["--brand" as string]: b.color } as React.CSSProperties}
            >
              {b.name}
            </Link>
          ))}
        </div>
      </section>

      {BRANDS.map((b) => (
        <Section b={b} key={b.slug} />
      ))}

      <section className="ae-section">
        <div className="ae-aboutdoors">
          <Link className="ae-navbtn" href="/contact" prefetch={false}>Get in touch</Link>
        </div>
      </section>
    </>
  );
}

// -----------------------------------------------------------
// END OF FILE - app/company/businesses/page.tsx (v1 - full detail)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
