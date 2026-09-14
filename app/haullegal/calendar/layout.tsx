// FILE: app/haullegal/calendar/layout.tsx
import type { Metadata } from "next";

// Metadata wrapper for the Stay Legal calendar (v1). The calendar
// page itself is a client component ("use client"), and a client
// page cannot export metadata - so this tiny server layout carries
// the title, description, canonical and share card for
// haullegal.com/calendar. Why it matters: the calculator is FREE to
// use and is the most shareable thing on the site (someone can post
// it in a Facebook group and it works with no signup), so the URL
// needs to read as a free tool in search results and link previews
// instead of inheriting the site-wide title. Renders children and
// nothing else - no wrapper div, no styles, so the page is
// pixel-identical to before.

export const metadata: Metadata = {
  title: "Free Trucking Deadline Calculator - IFTA, UCR, 2290, MCS-150 | HaulLegal",
  description:
    "Enter your USDOT number and a few dates and see every compliance deadline coming up: the MCS-150 biennial update in your own month, IFTA quarters, UCR, Form 2290, your medical card, annual inspections and the five by-the-mile states. Free, no signup.",
  alternates: { canonical: "https://haullegal.com/calendar" },
  openGraph: {
    title: "Free Trucking Deadline Calculator for Owner-Operators",
    description:
      "Put in your USDOT number and your dates - it works out your biennial update month, IFTA quarters, UCR, Form 2290, medical card and inspections. Free, no signup.",
    url: "https://haullegal.com/calendar",
    siteName: "HaulLegal",
    type: "website",
  },
};

export default function HaulLegalCalendarLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}

// ============================================================
// END OF FILE - app/haullegal/calendar/layout.tsx (v1 - free-tool
// metadata for the deadline calculator URL)
// If you can see this comment, the paste was not truncated.
// ============================================================
