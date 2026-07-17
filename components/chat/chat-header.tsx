"use client";
import { PanelLeftIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { memo, useEffect, useState } from "react";
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
  const { toggleSidebar } = useSidebar();
  const { data: creditsData } = useSWR("/api/credits", fetcher, { refreshInterval: 30000 });
  const credits = creditsData?.credits ?? 0;
  const freeRemaining = creditsData?.freeRemaining ?? 0;
  const isLow = credits <= 20;
  const [showPopup, setShowPopup] = useState(false);
  useEffect(() => {
    if (!creditsData) {
      return;
    }
    if (creditsData.freeRemaining === 0 && creditsData.credits < 1 && !sessionStorage.getItem("evo_free_popup_shown")) {
      setShowPopup(true);
    }
  }, [creditsData]);
  const dismissPopup = () => {
    setShowPopup(false);
    sessionStorage.setItem("evo_free_popup_shown", "true");
  };
  return (
    <header className="sticky top-0 flex min-h-14 items-center gap-2 bg-background px-3 py-2">
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
      <div className="ml-auto flex flex-col items-end gap-1">
        <Link
          className={isLow ? "flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-500/10 px-3.5 py-1.5 font-semibold text-[13px]" : "flex items-center gap-1.5 rounded-full border border-green-500/40 bg-green-500/10 px-3.5 py-1.5 font-semibold text-[13px] transition-colors hover:border-green-500/60"}
          href="/credits"
        >
          <GemIcon className="size-4 text-amber-400" />
          <span className={isLow ? "text-red-400" : "text-green-500"}>
            {credits.toLocaleString()} credits
          </span>
        </Link>
        {freeRemaining > 0 && (
          <span className="rounded-full border border-blue-500/40 bg-blue-500/10 px-3 py-1 font-medium text-[12px] text-blue-400">
            {freeRemaining} free {freeRemaining === 1 ? "message" : "messages"} today
          </span>
        )}
      </div>
      {showPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4"
          onClick={dismissPopup}
        >
          <div
            className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-6 text-center shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button aria-label="Close" className="absolute top-3 right-3 text-muted-foreground transition-colors hover:text-foreground" onClick={dismissPopup} type="button">
              <XIcon className="size-4" />
            </button>
            <GemIcon className="mx-auto mb-3 size-8 text-amber-400" />
            <h2 className="mb-2 font-semibold text-foreground text-lg">Out of free messages</h2>
            <p className="mb-4 text-muted-foreground text-sm">
              You have used all your free messages for the day. Come back tomorrow or purchase credits to continue.
            </p>
            <Link className="inline-block rounded-lg bg-primary px-5 py-2 font-semibold text-primary-foreground text-sm transition-opacity hover:opacity-85" href="/credits" onClick={dismissPopup}>
              Buy Credits
            </Link>
          </div>
        </div>
      )}
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
// END OF FILE - components/chat/chat-header.tsx (v8 - tap to close)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
