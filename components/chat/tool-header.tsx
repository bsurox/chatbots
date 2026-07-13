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
    <header className="sticky top-0 z-50 flex h-14 items-center gap-2 bg-sidebar px-3">
      <Link
        className={isLow ? "ml-auto flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 font-semibold text-[12px]" : "ml-auto flex items-center gap-1.5 rounded-full border border-green-500/40 bg-green-500/10 px-3 py-1 font-semibold text-[12px] transition-colors hover:border-green-500/60"}
        href="/credits"
      >
        <GemIcon className="size-3.5 text-amber-400" />
        <span className={isLow ? "text-red-400" : "text-green-500"}>
          {credits.toLocaleString()} credits
        </span>
      </Link>
    </header>
  );
}

// -----------------------------------------------------------
// END OF FILE - components/chat/tool-header.tsx (v3 - credits pill)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
