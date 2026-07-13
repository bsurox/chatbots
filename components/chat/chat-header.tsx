"use client";
import { GemIcon, PanelLeftIcon } from "lucide-react";
import Link from "next/link";
import { memo } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { VisibilitySelector, type VisibilityType } from "./visibility-selector";
import { fetcher } from "@/lib/utils";
function PureChatHeader({
  chatId,
  selectedVisibilityType,
  isReadonly,
}: {
  chatId: string;
  selectedVisibilityType: VisibilityType;
  isReadonly: boolean;
}) {
  const { state, toggleSidebar, isMobile } = useSidebar();
  const { data: creditsData } = useSWR("/api/credits", fetcher, { refreshInterval: 30000 });
  const credits = creditsData?.credits ?? 0;
  const isLow = credits <= 20;
  if (state === "collapsed" && !isMobile) {
    return null;
  }
  return (
    <header className="sticky top-0 flex h-14 items-center gap-2 bg-sidebar px-3">
      <Button
        className="md:hidden"
        onClick={toggleSidebar}
        size="icon-sm"
        variant="ghost"
      >
        <PanelLeftIcon className="size-4" />
      </Button>
      {!isReadonly && (
        <VisibilitySelector
          chatId={chatId}
          selectedVisibilityType={selectedVisibilityType}
        />
      )}
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
        className="hidden items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/15 px-4 py-1.5 font-semibold text-[13px] text-amber-400 transition-all duration-150 hover:border-amber-500/60 hover:bg-amber-500/25 md:ml-auto md:flex"
        href="/credits"
      >
        <GemIcon className="size-3.5" />
        Buy Credits
      </Link>
    </header>
  );
}
export const ChatHeader = memo(PureChatHeader, (prevProps, nextProps) => {
  return (
    prevProps.chatId === nextProps.chatId &&
    prevProps.selectedVisibilityType === nextProps.selectedVisibilityType &&
    prevProps.isReadonly === nextProps.isReadonly
  );
});

// -----------------------------------------------------------
// END OF FILE - components/chat/chat-header.tsx (v2 - rebrand)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
