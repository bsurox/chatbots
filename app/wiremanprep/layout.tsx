// FILE: app/wiremanprep/layout.tsx
import type { Metadata } from "next";
import "../foremanprep/foremanprep.css";
import "./wiremanprep.css";
import WmChatWidget from "./chat-widget";

// Server-side wrapper for the WiremanPrep surface (v1). Same job
// as the ForemanPrep layout: owns the css imports and the
// metadata so browser tabs and share cards say WiremanPrep. The
// wrapper div wears .fp-page for the dark canvas and shared
// component wardrobe, plus .wm-zone from wiremanprep.css, which
// swaps the brand variables to electric yellow for everything
// underneath. The ForemanPrep island is untouched - it never
// wears .wm-zone.
// v2: the LIVE CHAT arrives - WmChatWidget mounts here once and
// decides for itself where to render (landing + practice only,
// per its own allowlist), exactly like the ForemanPrep layout
// mounts its widget. Still no analytics tag - that waits for the
// pixels and ships together with the privacy disclosure.
// v1 notes: lean on purpose; favicon points at /wm-icon.png.

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
  return (
    <div className="fp-page wm-zone">
      {children}
      <WmChatWidget />
    </div>
  );
}

// ============================================================
// END OF FILE - app/wiremanprep/layout.tsx (v2 - live chat
// widget mounted; volt zone wrapper, WiremanPrep metadata)
// If you can see this comment, the paste was not truncated.
// ============================================================
