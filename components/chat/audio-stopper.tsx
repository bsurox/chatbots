"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// Mounted once in the layout. Whenever the route changes, every audio
// element on the page is paused and a stop signal is broadcast for
// players that live outside the page (like the voice sample preview).
// This works even when Next keeps the previous page alive during
// navigation, which is why per-page unmount cleanup was not enough.
export function AudioStopper() {
  const pathname = usePathname();
  const previousPath = useRef(pathname);

  useEffect(() => {
    if (previousPath.current === pathname) {
      return;
    }
    previousPath.current = pathname;
    for (const el of Array.from(document.querySelectorAll("audio"))) {
      el.pause();
    }
    window.dispatchEvent(new Event("evo-stop-audio"));
  }, [pathname]);

  return null;
}

// ============================================================
// END OF FILE - components/chat/audio-stopper.tsx (v1)
// If you can see this comment, the paste was not truncated.
// ============================================================
