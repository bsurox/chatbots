"use client";
import { PanelLeftIcon } from "lucide-react";
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

      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
        <span style={{ color: "#22c55e", fontSize: 18 }}>⚡</span>
        <span style={{ fontSize: 15, fontWeight: 600, color: "#22c55e" }}>
          {credits.toLocaleString()} credits
        </span>
      </div>

      <Link
        href="/credits"
        className="hidden md:ml-auto md:flex"
        style={{
          padding: "6px 16px",
          borderRadius: 8,
          background: "rgba(34,197,94,0.15)",
          color: "#22c55e",
          fontSize: 13,
          fontWeight: 600,
          textDecoration: "none",
          border: "1px solid rgba(34,197,94,0.3)",
        }}
      >
        Buy Credits
      </Link>
    </header>
  );
}

export const ChatHeader = memo(PureChatHeader, (prevProps, nextProps) => {
  return (
    prevProps.chatId === nextProps.chatProps &&
    prevProps.selectedVisibilityType === nextProps.selectedVisibilityType &&
    prevProps.isReadonly === nextProps.isReadonly
  );
});
