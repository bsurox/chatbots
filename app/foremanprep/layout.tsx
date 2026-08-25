// FILE: app/foremanprep/layout.tsx
import type { Metadata } from "next";
import "./foremanprep.css";
import FpAnalytics from "./analytics";
import ChatWidget from "./chat-widget";

// Server-side wrapper for the ForemanPrep surface. Owns the css
// import and the metadata: browser tabs and share cards say
// ForemanPrep, not AskEvo. The .fp-page div paints the dark canvas
// and carries the brand's safety-orange variables for every page
// that will live under /foremanprep as the product grows.
// v5 (his call): the floating account badge is RETIRED - the
// landing header's Log in / Log out button covers auth, and the
// bottom-right slot now belongs to the live chat. ChatWidget
// mounts here ONCE and decides for itself where to render: the
// two landing pages and the two practice rooms only - never the
// exam simulator, audio, buy, or content pages.
// v4 set the ForemanPrep favicon (public/fp-icon.png) via the
// icons metadata, so tabs and Google results stop wearing the
// AskEvo icon on this island. v3 mounted FpAnalytics: the Google
// Ads tag + Meta pixel, active only when the visitor is actually
// on foremanprep.com. v2 had mounted the account badge (now
// removed).

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
      <ChatWidget />
      <FpAnalytics />
    </div>
  );
}

// ============================================================
// END OF FILE - app/foremanprep/layout.tsx (v5 - account badge
// retired, live chat widget mounted)
// If you can see this comment, the paste was not truncated.
// ============================================================
