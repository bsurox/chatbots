"use client";
import { PanelLeftIcon } from "lucide-react";
import Link from "next/link";
import { memo } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { GemIcon } from "./gem-icon";
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
    <header className="sticky top-0 flex h-14 items-center gap-2 bg-background px-3">
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
export const ChatHeader = memo(PureChatHeader, (prevProps, nextProps) => {
  return (
    prevProps.chatId === nextProps.chatId &&
    prevProps.selectedVisibilityType === nextProps.selectedVisibilityType &&
    prevProps.isReadonly === nextProps.isReadonly
  );
});

// -----------------------------------------------------------
// END OF FILE - components/chat/chat-header.tsx (v4 - black canvas)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
