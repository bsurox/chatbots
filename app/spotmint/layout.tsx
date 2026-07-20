import type { Metadata } from "next";
import { BRAND } from "./brand";

// Server-side wrapper for the Spotmint surface. Its job is metadata:
// the browser tab, share cards, and the wrapped app say Spotmint,
// not AskEvo. Styling and logic live in page.tsx; this is a passthrough.

export const metadata: Metadata = {
  title: BRAND.name,
  description: BRAND.tagline,
};

export default function SpotmintLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}

// ============================================================
// END OF FILE - app/spotmint/layout.tsx (v1)
// If you can see this comment, the paste was not truncated.
// ============================================================
