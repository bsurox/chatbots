"use client";
import Link from "next/link";
import useSWR from "swr";
import { GemIcon } from "./gem-icon";
import { fetcher } from "@/lib/utils";
export function ToolHeader() {
  const { data: creditsData } = useSWR("/api/credits", fetcher, { refreshInterval: 30000 });
  const credits = creditsData?.credits ?? 0;
  const isLow = credits <= 20;
  return (
    <header className="pointer-events-none sticky top-0 z-50 h-0">
      <div className="flex justify-end px-3 pt-3">
        <Link
          className={isLow ? "pointer-events-auto flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-500/10 px-3.5 py-1.5 font-semibold text-[13px] backdrop-blur-sm" : "pointer-events-auto flex items-center gap-1.5 rounded-full border border-green-500/40 bg-green-500/10 px-3.5 py-1.5 font-semibold text-[13px] backdrop-blur-sm transition-colors hover:border-green-500/60"}
          href="/credits"
        >
          <GemIcon className="size-4 text-amber-400" />
          <span className={isLow ? "text-red-400" : "text-green-500"}>
            {credits.toLocaleString()} credits
          </span>
        </Link>
      </div>
    </header>
  );
}

// -----------------------------------------------------------
// END OF FILE - components/chat/tool-header.tsx (v5 - floating pill, no bar)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
