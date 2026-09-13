// FILE: app/haullegal/layout.tsx
import type { Metadata } from "next";
import "../foremanprep/foremanprep.css";
import "./haullegal.css";
import HlChatWidget from "./chat-widget";

// Server-side wrapper for the HaulLegal surface (v2 - the AI HELP
// CHAT arrives: HlChatWidget mounts here once and decides for
// itself where to render (landing, walkthrough, calendar, guides,
// state pages), exactly like the other islands' layouts mount
// theirs. Still no analytics tag.)
// v1 notes - same job as
// the ForemanPrep and WiremanPrep layouts: owns the css imports
// and the metadata so browser tabs and share cards say HaulLegal.
// The wrapper div wears .fp-page for the dark canvas and shared
// component wardrobe, plus .hl-zone from haullegal.css, which
// swaps the brand variables to cleared green for everything
// underneath. The three prep islands are untouched - they never
// wear .hl-zone.
// Pixels ship together with the privacy disclosure, never apart.
// Favicon points at /hl-icon.png.

export const metadata: Metadata = {
  title: "HaulLegal - Get legal to haul. Stay legal.",
  description:
    "The step-by-step walkthrough that gets a new trucking company its USDOT number and operating authority the right way, at the real government prices - then keeps every deadline on your phone.",
  icons: {
    icon: [{ url: "/hl-icon.png", type: "image/png", sizes: "512x512" }],
    shortcut: "/hl-icon.png",
    apple: "/hl-icon.png",
  },
};

export default function HaulLegalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="fp-page hl-zone">
      {children}
      <HlChatWidget />
    </div>
  );
}

// ============================================================
// END OF FILE - app/haullegal/layout.tsx (v2 - help chat widget
// mounted; green zone wrapper, HaulLegal metadata, no pixels)
// If you can see this comment, the paste was not truncated.
// ============================================================
