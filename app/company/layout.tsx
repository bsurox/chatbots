// FILE: app/company/layout.tsx
import type { Metadata } from "next";
import "./company.css";

// Server-side wrapper for the AskEvo LLC parent-company hub (v2).
// Owns the css import and the metadata, so browser tabs and share
// cards describe the company - not the retired chat tool the root
// layout still describes. proxy.ts rewrites askevo.ai "/" onto
// /company, so this segment IS the front door of askevo.ai; the
// old app/(chat) root page stays in the repo untouched (never
// delete a page.tsx) but is no longer served to anyone.
// Deliberately lean: no sidebar, no chat shell, no auth call, no
// analytics - a static company page that renders the same for
// everyone.
// v2: the hub gets its own favicon, public/ae-icon.png - the AE
// wordmark in the same five-brand gradient the page's own AskEvo
// LLC text wears. It replaces the old ae-icon.svg / logo.png pair
// for this segment only; the legacy AskEvo pages (credits,
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
  return <div className="ae-page">{children}</div>;
}

// -----------------------------------------------------------
// END OF FILE - app/company/layout.tsx (v2 - gradient favicon)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
