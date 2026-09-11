// FILE: app/haullegal/layout.tsx
import type { Metadata } from "next";
import "../foremanprep/foremanprep.css";
import "./haullegal.css";

// Server-side wrapper for the HaulLegal surface (v1). Same job as
// the ForemanPrep and WiremanPrep layouts: owns the css imports
// and the metadata so browser tabs and share cards say HaulLegal.
// The wrapper div wears .fp-page for the dark canvas and shared
// component wardrobe, plus .hl-zone from haullegal.css, which
// swaps the brand variables to cleared green for everything
// underneath. The three prep islands are untouched - they never
// wear .hl-zone.
// v1 is lean on purpose: no chat widget, no analytics tag. The
// live chat arrives with its own widget file later (same pattern
// as the other islands); pixels ship together with the privacy
// disclosure, never apart. Favicon points at /hl-icon.png.

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
  return <div className="fp-page hl-zone">{children}</div>;
}

// ============================================================
// END OF FILE - app/haullegal/layout.tsx (v1 - green zone
// wrapper, HaulLegal metadata, lean: no chat, no pixels)
// If you can see this comment, the paste was not truncated.
// ============================================================
