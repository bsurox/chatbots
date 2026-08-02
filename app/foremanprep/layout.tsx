// FILE: app/foremanprep/layout.tsx
import type { Metadata } from "next";
import "./foremanprep.css";

// Server-side wrapper for the ForemanPrep surface. Owns the css
// import and the metadata: browser tabs and share cards say
// ForemanPrep, not AskEvo. The .fp-page div paints the dark canvas
// and carries the brand's safety-orange variables for every page
// that will live under /foremanprep as the product grows.

export const metadata: Metadata = {
  title: "ForemanPrep - Pass the NASCLA Contractor Exam",
  description:
    "AI-powered prep for the NASCLA Commercial General Building Contractor exam. Unlimited practice questions, a tutor that explains every answer, and a full 115-question exam simulator.",
};

export default function ForemanPrepLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="fp-page">{children}</div>;
}

// ============================================================
// END OF FILE - app/foremanprep/layout.tsx (v1 - landing shell)
// If you can see this comment, the paste was not truncated.
// ============================================================
