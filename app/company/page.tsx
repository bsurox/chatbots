// FILE: app/company/page.tsx
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type Brand, BRANDS, type Door, type Social } from "./brands";
import { AppleIcon, PlayStoreIcon, SocialGlyph } from "./icons";

// AskEvo LLC parent-company landing page (v6). The front door of
// askevo.ai: who the company is, a card per business, and the
// about section. The header and footer live in layout.tsx now.
// v5 (his call): Contact moved off this page onto /contact, the
// businesses CTA and the Businesses nav item open the full
// /businesses page instead of scrolling, and a click anywhere on a
// business card - anywhere that is not one of its own links -
// opens that brand's section on /businesses. The hero line reads
// "building focused software businesses." His later call: the two
// store glyphs sit in the BOTTOM-RIGHT cluster beside Instagram,
// so the left of the footer row only carries text buttons.
// Brand copy, colors and links all come from ./brands so the four
// pages can never disagree; the glyphs come from ./icons.

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
      <SocialGlyph gid={gid} kind={s.kind} />
    </Link>
  );
}

function BrandCard({ b }: { b: Brand }) {
  const router = useRouter();
  const style = { ["--brand" as string]: b.color } as React.CSSProperties;
  const target = "/businesses#" + b.slug;

  // A click anywhere on the card opens this brand's section on the
  // businesses page - unless it landed on one of the card's own
  // links, which have their own destinations. The card cannot BE a
  // link, because a link cannot be nested inside another link.
  function open(e: React.MouseEvent<HTMLDivElement>) {
    if ((e.target as HTMLElement).closest("a")) return;
    router.push(target);
  }
  function key(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "Enter" && e.key !== " ") return;
    if ((e.target as HTMLElement).closest("a")) return;
    e.preventDefault();
    router.push(target);
  }

  return (
    <div
      aria-label={"Read more about " + b.name}
      className="ae-card click"
      onClick={open}
      onKeyDown={key}
      role="link"
      style={style}
      tabIndex={0}
    >
      <div className="ae-cardtop">
        <h3 className="ae-brandname">{b.name}</h3>
        <span className="ae-tag">{b.tag}</span>
      </div>
      <p className="ae-domain">{b.domain}</p>
      <p className="ae-desc">{b.desc}</p>
      <p className="ae-who">{b.who}</p>
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
            <SocialLink gid={b.slug + "-" + s.kind} key={s.label} s={s} />
          ))}
        </div>
      </div>
      <p className="ae-more">Read more</p>
    </div>
  );
}

export default function CompanyPage() {
  return (
    <>
      <section className="ae-hero">
        <p className="ae-kicker">Boise, Idaho</p>
        <h2 className="ae-h1">
          <span className="ae-grad">AskEvo LLC</span>
          <br />
          building focused software businesses.
        </h2>
        <p className="ae-lead">
          One company, several brands. Each one solves a single problem for a single group of people - contractors getting licensed, electricians testing, truckers going independent, small businesses that need a video ad - and does it end to end.
        </p>
        <Link className="ae-cta" href="/businesses" prefetch={false}>
          See our businesses
        </Link>
      </section>

      <section className="ae-section" id="businesses">
        <h2 className="ae-h2">Our businesses</h2>
        <p className="ae-sub">Every brand below is owned and operated by AskEvo LLC. Each runs on its own site, in its own colors. Tap a card for the full story.</p>
        <div className="ae-grid">
          {BRANDS.map((b) => (
            <BrandCard b={b} key={b.slug} />
          ))}
        </div>
      </section>

      <section className="ae-section" id="about">
        <h2 className="ae-h2">Who we are</h2>
        <p className="ae-sub">A small Idaho company that would rather build four useful things than one generic one.</p>
        <div className="ae-about">
          <div className="ae-prose">
            <p>
              AskEvo LLC was formed in Boise, Idaho in 2026. It started as an AI chat assistant - the AskEvo name comes from there. Building that tool taught us the lesson the company now runs on: the technology is the easy part. The value is in taking one specific problem for one specific group of people and solving it completely.
            </p>
            <p>
              So that is what we do. We find work that is confusing, expensive or slow - passing a licensing exam, getting a truck legally on the road, producing a video ad - and we build a product that walks a person through it from start to finish. Each product gets its own brand, its own site and its own colors. The company behind all of them is the same.
            </p>
            <p>
              AskEvo LLC is founded and run by Chase Lindsay. Questions about any of our businesses, partnerships, or the company itself are welcome on the contact page.
            </p>
          </div>
          <div className="ae-facts">
            <div className="ae-fact"><p className="ae-factk">Company</p><p className="ae-factv">AskEvo LLC, an Idaho limited liability company</p></div>
            <div className="ae-fact"><p className="ae-factk">Based in</p><p className="ae-factv">Boise, Idaho</p></div>
            <div className="ae-fact"><p className="ae-factk">Founded</p><p className="ae-factv">2026</p></div>
            <div className="ae-fact"><p className="ae-factk">Brands</p><p className="ae-factv">ForemanPrep, WiremanPrep, HaulLegal, Spotmint</p></div>
          </div>
        </div>
        <div className="ae-aboutdoors">
          <Link className="ae-navbtn" href="/businesses" prefetch={false}>See what we build</Link>
          <Link className="ae-navbtn" href="/contact" prefetch={false}>Get in touch</Link>
        </div>
      </section>
    </>
  );
}

// -----------------------------------------------------------
// END OF FILE - app/company/page.tsx (v6 - facebook glyphs)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
