import type { Metadata, Viewport } from "next";
import "./spotmint.css";
import { BRAND } from "./brand";
import { SpotmintTabs } from "./tabs";

// Server-side wrapper for the Spotmint surface. v3 is no longer a
// passthrough: it mounts the shell - the four-tab bottom bar renders
// here once for every /spotmint/* page (app, web, and the store
// host alike), and .sp-shell pads the pages so content clears the
// fixed bar. Metadata duties unchanged: the browser tab, share
// cards, and the wrapped app say Spotmint, not AskEvo.

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
  return (
    <div className="sp-shell">
      {children}
      <SpotmintTabs />
    </div>
  );
}

// ============================================================
// END OF FILE - app/spotmint/layout.tsx (v3 - shell activation)
// If you can see this comment, the paste was not truncated.
// ============================================================
