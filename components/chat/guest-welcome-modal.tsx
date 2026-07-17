"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const DISMISS_KEY = "evo_guest_welcome_dismissed";
const GUEST_REGEX = /^guest-\d+$/;

export function GuestWelcomeModal() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (status === "loading") {
      return;
    }
    const email: string | null = session?.user?.email ?? null;
    const isGuest = email ? GUEST_REGEX.test(email) : false;
    if (!isGuest) {
      return;
    }
    const dismissed = sessionStorage.getItem(DISMISS_KEY);
    if (dismissed) {
      return;
    }
    window.dispatchEvent(new Event("evo-greeting-block"));
    setOpen(true);
  }, [session, status]);

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, "true");
    setOpen(false);
    window.dispatchEvent(new Event("evo-guest-welcome-dismissed"));
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-xl">
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 600,
            color: "#4ade80",
            letterSpacing: "-0.02em",
            marginBottom: 8,
          }}
        >
          Welcome to AskEvo
        </h1>
        <p className="mb-6 text-muted-foreground text-sm">
          Sign in or create an account to get started.
        </p>
        <div className="flex flex-col gap-3">
          <button
            className="rounded-lg bg-foreground px-5 py-2.5 font-semibold text-background text-sm transition-opacity hover:opacity-85"
            onClick={() => router.push("/login")}
            type="button"
          >
            Log in
          </button>
          <button
            className="rounded-lg border border-border px-5 py-2.5 font-semibold text-foreground text-sm transition-colors hover:bg-muted"
            onClick={() => router.push("/register")}
            type="button"
          >
            Sign up
          </button>
        </div>
        <button
          className="mt-5 text-[13px] text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
          onClick={dismiss}
          type="button"
        >
          Continue as guest
        </button>
        <p className="mt-2 text-[11px] text-muted-foreground/60">
          AskEvo requires an account to use its service.
        </p>
      </div>
    </div>
  );
}

// -----------------------------------------------------------
// END OF FILE - components/chat/guest-welcome-modal.tsx (v2)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
