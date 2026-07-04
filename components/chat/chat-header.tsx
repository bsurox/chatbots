"use client";
import { PanelLeftIcon, SparklesIcon } from "lucide-react";
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
        <SparklesIcon
          style={{
            color: isLow ? "#ef4444" : "#d97706",
            width: 16,
            height: 16,
          }}
        />
        <span
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: isLow ? "#ef4444" : (credits === 0 ? "#888" : "#d97706"),
          }}
        >
          {credits.toLocaleString()} credits
        </span>
      </Link>

      <Link
        href="/credits"
        className="hidden md:ml-auto md:flex items-center gap-1.5"
        style={{
          padding: "6px 16px",
          borderRadius: 8,
          background: "rgba(217,119,6,0.15)",
          color: "#d97706",
          fontSize: 13,
          fontWeight: 600,
          textDecoration: "none",
          border: "1px solid rgba(217,119,6,0.3)",
        }}
      >
        <SparklesIcon style={{ width: 13, height: 13 }} />
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
