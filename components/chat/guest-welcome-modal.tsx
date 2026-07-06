"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const GUEST_REGEX = /^guest-\d+$/;
const DISMISS_KEY = "evo_guest_welcome_dismissed";
const BLOCK_KEY = "evo_greeting_blocked";

export function GuestWelcomeModal() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }

    const email = session?.user?.email ?? "";
    const isGuest = GUEST_REGEX.test(email);

    // If this is a real (non-guest) logged-in user, never show the popup.
    // Also clean up any leftover flags and make sure it's closed.
    if (!isGuest) {
      sessionStorage.removeItem(BLOCK_KEY);
      setOpen(false);
      return;
    }

    const alreadyDismissed = sessionStorage.getItem(DISMISS_KEY);
    if (isGuest && !alreadyDismissed) {
      sessionStorage.setItem(BLOCK_KEY, "true");
      window.dispatchEvent(new Event("evo-greeting-block"));
      setOpen(true);
    }
  }, [session, status]);

  const handleContinueAsGuest = () => {
    sessionStorage.setItem(DISMISS_KEY, "true");
    sessionStorage.removeItem(BLOCK_KEY);
    window.dispatchEvent(new Event("evo-guest-welcome-dismissed"));
    setOpen(false);
  };

  if (!open) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
        padding: 20,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
      `}</style>
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          borderRadius: 16,
          border: "1px solid rgba(255,255,255,0.1)",
          background: "var(--background, #1a1a1a)",
          padding: 32,
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "'Dancing Script', cursive",
            fontSize: "2rem",
            fontWeight: 700,
            color: "#4ade80",
            textShadow: "0 0 12px rgba(74,222,128,0.4)",
            marginBottom: 8,
          }}
        >
          Welcome to AskEvo
        </div>

        <p
          style={{
            fontSize: 14,
            color: "var(--muted-foreground, #999)",
            marginBottom: 28,
            lineHeight: 1.5,
          }}
        >
          Sign in or create an account to get started.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <button
            type="button"
            onClick={() => router.push("/login")}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: 10,
              border: "none",
              background: "#fff",
              color: "#000",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Log in
          </button>

          <button
            type="button"
            onClick={() => router.push("/register")}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.2)",
              background: "transparent",
              color: "inherit",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Sign up
          </button>
        </div>

        <div style={{ marginTop: 24 }}>
          <button
            type="button"
            onClick={handleContinueAsGuest}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--muted-foreground, #999)",
              fontSize: 13,
              cursor: "pointer",
              textDecoration: "underline",
              textUnderlineOffset: 3,
            }}
          >
            Continue as guest
          </button>
          <p
            style={{
              fontSize: 11,
              color: "var(--muted-foreground, #777)",
              marginTop: 8,
              opacity: 0.7,
            }}
          >
            AskEvo requires an account to use its service.
          </p>
        </div>
      </div>
    </div>
  );
}
