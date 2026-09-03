// FILE: app/wiremanprep/layout.tsx
import type { Metadata } from "next";
import "../foremanprep/foremanprep.css";
import "./wiremanprep.css";

// Server-side wrapper for the WiremanPrep surface (v1). Same job
// as the ForemanPrep layout: owns the css imports and the
// metadata so browser tabs and share cards say WiremanPrep. The
// wrapper div wears .fp-page for the dark canvas and shared
// component wardrobe, plus .wm-zone from wiremanprep.css, which
// swaps the brand variables to electric yellow for everything
// underneath. The ForemanPrep island is untouched - it never
// wears .wm-zone.
// Lean v1 on purpose: no analytics tag and no chat widget yet -
// those mount here in later versions once the pixels and the
// widget's page rules exist for this brand. Favicon points at
// /wm-icon.png (the yellow icon ships as its own file; until it
// lands, tabs just show no icon - harmless).

export const metadata: Metadata = {
  title: "WiremanPrep - Pass the NASCLA Electrical Exam",
  description:
    "AI-powered prep for the NASCLA Master/Unlimited Electrical Contractor exam. 153 practice questions written to the official outline, a tutor that explains every answer, and a full 100-question exam simulator on the real 4.5-hour clock.",
  icons: {
    icon: [{ url: "/wm-icon.png", type: "image/png", sizes: "512x512" }],
    shortcut: "/wm-icon.png",
    apple: "/wm-icon.png",
  },
};

export default function WiremanPrepLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="fp-page wm-zone">{children}</div>;
}

// ============================================================
// END OF FILE - app/wiremanprep/layout.tsx (v1 - yellow zone
// wrapper, WiremanPrep metadata, lean: no chat/analytics yet)
// If you can see this comment, the paste was not truncated.
// ============================================================
