"use client";

import { XIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { GemIcon } from "./gem-icon";

const DISMISS_KEY = "evo_banner_veo31_dismissed";

export function AnnouncementBanner() {
  const [visible, setVisible] = useState(false);

  // Start hidden and reveal after mount so dismissed users never see a flash.
  useEffect(() => {
    try {
      if (localStorage.getItem(DISMISS_KEY) !== "1") {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  if (!visible) {
    return null;
  }

  function dismiss() {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // localStorage unavailable - banner just hides for this session
    }
  }

  return (
    <div className="relative z-40 flex items-center justify-center gap-2 border-primary/30 border-b bg-primary/10 px-8 py-2.5 text-center sm:px-10">
      <GemIcon className="size-4 shrink-0 text-primary" />
      <p className="text-[12px] text-foreground sm:text-sm">
        <span className="font-semibold text-primary">NEW:</span> Veo 3.1 now
        live for Cinematic tier videos.{" "}
        <Link
          className="font-semibold text-primary underline underline-offset-2 transition-opacity hover:opacity-80"
          href="/video?tier=cinematic"
        >
          Try it
        </Link>
      </p>
      <button
        aria-label="Dismiss announcement"
        className="absolute right-2.5 rounded-md p-1 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground"
        onClick={dismiss}
        type="button"
      >
        <XIcon className="size-4" />
      </button>
    </div>
  );
}

// ============================================================
// END OF FILE - components/chat/announcement-banner.tsx (v2.1 - mobile fit)
// If you can see this comment, the paste was not truncated.
// ============================================================
