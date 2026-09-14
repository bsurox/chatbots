// FILE: app/company/layout.tsx
import type { Metadata } from "next";
import Link from "next/link";
import "./company.css";
import "./pages.css";
import { ASKEVO_FB, ASKEVO_IG } from "./brands";
import { FacebookIcon, InstagramIcon } from "./icons";

// Server-side wrapper for the AskEvo LLC parent-company hub (v5).
// Owns the css import and the metadata, so browser tabs and share
// cards describe the company - not the retired chat tool the root
// layout still describes. proxy.ts rewrites askevo.ai "/" onto
// /company, so this segment IS the front door of askevo.ai; the
// old app/(chat) root page stays in the repo untouched (never
// delete a page.tsx) but is no longer served to anyone.
// v3: the hub is three pages now - the landing page plus
// /businesses and /contact - so the header and the
// footer moved HERE. Every page under app/company gets them for
// free and they can never drift apart. The nav is plain Links, so
// this layout stays a server component. It imports BOTH
// stylesheets - company.css for the shared furniture and the
// landing page, pages.css for the three inner pages; About points at the
// landing page's anchor, which works from any page. His final
// call on socials: no separate socials page - the AskEvo LLC
// Instagram glyph sits up here in the header, and each brand's
// own accounts ride its card and its section on /businesses.
// v4: the company's Facebook page joins Instagram up here.
// v5 (his call): both company glyphs moved to the LEFT, beside the
// AskEvo LLC wordmark, so they read as the company's own accounts
// instead of blending into the three nav buttons on the right.
// v2: the hub's own favicon, public/ae-icon.png - the AE wordmark
// in the same five-brand gradient the page's AskEvo LLC text
// wears. Scoped to this segment; the legacy AskEvo pages (credits,
// support, updates) still take their icon from app/layout.tsx.

export const metadata: Metadata = {
  title: "AskEvo LLC - Boise, Idaho",
  description:
    "AskEvo LLC is a Boise, Idaho software company. We build and run focused products for tradespeople and small business owners: ForemanPrep, WiremanPrep, HaulLegal and Spotmint.",
  icons: {
    icon: [{ url: "/ae-icon.png", type: "image/png", sizes: "512x512" }],
    shortcut: "/ae-icon.png",
    apple: "/ae-icon.png",
  },
};

export default function CompanyLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="ae-page">
      <div className="ae-wrap">
        <div className="ae-top">
          <div className="ae-brandside">
            <Link className="ae-wordmark ae-grad" href="/" prefetch={false}>
              AskEvo LLC
            </Link>
            <Link
              aria-label="AskEvo LLC on Instagram"
              className="ae-soc top"
              href={ASKEVO_IG}
              prefetch={false}
              rel="noopener noreferrer"
              target="_blank"
              title="AskEvo LLC on Instagram"
            >
              <InstagramIcon gid="header" />
            </Link>
            <Link
              aria-label="AskEvo LLC on Facebook"
              className="ae-soc top"
              href={ASKEVO_FB}
              prefetch={false}
              rel="noopener noreferrer"
              target="_blank"
              title="AskEvo LLC on Facebook"
            >
              <FacebookIcon />
            </Link>
          </div>
          <div className="ae-nav">
            <Link className="ae-navbtn" href="/businesses" prefetch={false}>Businesses</Link>
            <Link className="ae-navbtn" href="/#about" prefetch={false}>About</Link>
            <Link className="ae-navbtn" href="/contact" prefetch={false}>Contact</Link>
          </div>
        </div>
        <div className="ae-rule" />
        {children}
        <div className="ae-foot">
          <div>
            AskEvo LLC, Boise, Idaho. ForemanPrep, WiremanPrep, HaulLegal and Spotmint are trade names of AskEvo LLC.
          </div>
          <div className="ae-footlinks">
            <Link className="ae-footbtn" href="/businesses" prefetch={false}>Businesses</Link>
            <Link className="ae-footbtn" href="/contact" prefetch={false}>Contact</Link>
            <Link className="ae-footbtn" href="/terms" prefetch={false}>Terms</Link>
            <Link className="ae-footbtn" href="/privacy" prefetch={false}>Privacy</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------
// END OF FILE - app/company/layout.tsx (v5 - socials beside wordmark)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
