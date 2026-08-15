// FILE: app/foremanprep/layout.tsx
import type { Metadata } from "next";
import "./foremanprep.css";
import AccountBadge from "./account-badge";
import FpAnalytics from "./analytics";

// Server-side wrapper for the ForemanPrep surface. Owns the css
// import and the metadata: browser tabs and share cards say
// ForemanPrep, not AskEvo. The .fp-page div paints the dark canvas
// and carries the brand's safety-orange variables for every page
// that will live under /foremanprep as the product grows.
// v2 mounts the floating account badge on every ForemanPrep page:
// invisible to signed-out visitors, a person icon with a Log out
// popover for signed-in users.
// v3 mounts FpAnalytics: the Google Ads tag + Meta pixel, active
// only when the visitor is actually on foremanprep.com.
// v4 sets the ForemanPrep favicon (public/fp-icon.png) via the
// icons metadata, so tabs and Google results stop wearing the
// AskEvo icon on this island. Auth pages (/login, /register) keep
// the shared icon for now - separate host-aware fix if it bites.

export const metadata: Metadata = {
  title: "ForemanPrep - Pass the NASCLA Contractor Exam",
  description:
    "AI-powered prep for the NASCLA Commercial General Building Contractor exam. Unlimited practice questions, a tutor that explains every answer, and a full 115-question exam simulator.",
  icons: {
    icon: [{ url: "/fp-icon.png", type: "image/png", sizes: "512x512" }],
    shortcut: "/fp-icon.png",
    apple: "/fp-icon.png",
  },
};

export default function ForemanPrepLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="fp-page">
      {children}
      <AccountBadge />
      <FpAnalytics />
    </div>
  );
}

// ============================================================
// END OF FILE - app/foremanprep/layout.tsx (v4 - fp favicon)
// If you can see this comment, the paste was not truncated.
// ============================================================
