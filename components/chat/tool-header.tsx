"use client";
import { GemIcon } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";
export function ToolHeader() {
  const { data: creditsData } = useSWR("/api/credits", fetcher, { refreshInterval: 30000 });
  const credits = creditsData?.credits ?? 0;
  const isLow = credits <= 20;
  return (
    <header className="sticky top-0 z-50 flex h-14 items-center gap-2 bg-sidebar px-3">
      <Link
        href="/credits"
        className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2"
        style={{ textDecoration: "none" }}
      >
        <GemIcon
          className={isLow ? "" : "text-amber-600 dark:text-amber-400"}
          style={{ width: 16, height: 16, color: isLow ? "#ef4444" : undefined }}
        />
        <span style={{ fontSize: 15, fontWeight: 600, color: isLow ? "#ef4444" : "#22c55e" }}>
          {credits.toLocaleString()} credits
        </span>
      </Link>
      <Link
        className="ml-auto flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/15 px-4 py-1.5 font-semibold text-[13px] text-amber-400 transition-all duration-150 hover:border-amber-500/60 hover:bg-amber-500/25"
        href="/credits"
      >
        <GemIcon className="size-3.5" />
        Buy Credits
      </Link>
    </header>
  );
}

// -----------------------------------------------------------
// END OF FILE - components/chat/tool-header.tsx (v2 - gems)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
