import type { Metadata, Viewport } from "next";
import { BRAND } from "./brand";

// Server-side wrapper for the Spotmint surface. Its job is metadata:
// the browser tab, share cards, and the wrapped app say Spotmint,
// not AskEvo. Styling and logic live in page.tsx; this is a passthrough.

export const metadata: Metadata = {
  title: BRAND.name,
  description: BRAND.tagline,
};

// viewport-fit: cover lets the page see the iPhone's safe-area insets
// (status bar / notch) so the CSS can pad for them; the zoom locks
// make the surface behave like an app instead of a pinchable webpage.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function SpotmintLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}

// ============================================================
// END OF FILE - app/spotmint/layout.tsx (v2 - safe area + zoom lock)
// If you can see this comment, the paste was not truncated.
// ============================================================
