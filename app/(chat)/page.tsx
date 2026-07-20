"use client";
import { ChatShell } from "@/components/chat/shell";
import { GuestWelcomeModal } from "@/components/chat/guest-welcome-modal";
import { ActiveChatProvider } from "@/hooks/use-active-chat";
import { Suspense } from "react";
export default function Page() {
  return (
    <Suspense fallback={<div className="flex h-dvh" />}>
      <ActiveChatProvider>
        <GuestWelcomeModal />
        <ChatShell />
      </ActiveChatProvider>
    </Suspense>
  );
}
