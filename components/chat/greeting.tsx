"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";

const FALLBACK_TEXT = "Hello, I'm Evo.";
const STORAGE_KEY = "evo_greeting_played";
const DISMISS_KEY = "evo_guest_welcome_dismissed";
const BLOCK_KEY = "evo_greeting_blocked";
const GUEST_REGEX = /^guest-\d+$/;

function buildGreeting(firstName: string | null): string {
  if (!firstName) {
    return FALLBACK_TEXT;
  }

  const hour = new Date().getHours();
  const alreadyVisited = sessionStorage.getItem("evo_returning_user");

  if (alreadyVisited) {
    return `Back at it, ${firstName}.`;
  }

  if (hour < 12) {
    return `Good morning, ${firstName}.`;
  }
  if (hour < 18) {
    return `Good afternoon, ${firstName}.`;
  }
  return `Good evening, ${firstName}.`;
}

export const Greeting = () => {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [show, setShow] = useState(false);
  const [greetingText, setGreetingText] = useState(FALLBACK_TEXT);
  const [blocked, setBlocked] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const { data: userData } = useSWR("/api/user/profile", fetcher);

  useEffect(() => {
    const handleBlock = () => setBlocked(true);
    const handleDismissed = () => {
      setBlocked(false);
      reveal();
    };
    window.addEventListener("evo-greeting-block", handleBlock);
    window.addEventListener("evo-guest-welcome-dismissed", handleDismissed);
    return () => {
      window.removeEventListener("evo-greeting-block", handleBlock);
      window.removeEventListener(
        "evo-guest-welcome-dismissed",
        handleDismissed
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (revealed || userData === undefined) {
      return;
    }

    const fullName: string | null = userData?.name ?? null;
    const firstName = fullName ? fullName.trim().split(" ")[0] : null;
    setGreetingText(buildGreeting(firstName));
    if (firstName) {
      sessionStorage.setItem("evo_returning_user", "true");
    }

    const email: string | null = userData?.email ?? null;
    const isGuest = email ? GUEST_REGEX.test(email) : false;

    // Real (non-guest) logged-in user: no popup applies to them.
    // Clear any leftover block flag and reveal the greeting normally.
    if (!isGuest) {
      sessionStorage.removeItem(BLOCK_KEY);
      setBlocked(false);
      reveal();
      return;
    }

    // Guest: only hold back if the popup hasn't been dismissed yet.
    const dismissed = sessionStorage.getItem(DISMISS_KEY);
    if (!dismissed) {
      setBlocked(true);
      return;
    }

    reveal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData, revealed]);

  function reveal() {
    setRevealed(true);
    const alreadyPlayed = sessionStorage.getItem(STORAGE_KEY);
    setShow(true);
    if (!alreadyPlayed) {
      setShouldAnimate(true);
      sessionStorage.setItem(STORAGE_KEY, "true");
    }
  }

  if (blocked || !show) {
    return null;
  }

  return (
    <div className="flex flex-col items-center px-4" key="overview">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
      `}</style>
      <motion.div
        initial={{ opacity: shouldAnimate ? 0 : 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          fontFamily: "'Dancing Script', cursive",
          fontSize: "clamp(2rem, 5vw, 3rem)",
          fontWeight: 700,
          color: "#4ade80",
          textShadow: "0 0 12px rgba(74,222,128,0.4)",
          minHeight: "3.5rem",
          textAlign: "center",
          marginBottom: 24,
          letterSpacing: "0.01em",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        {shouldAnimate ? (
          <motion.span
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0% 0 0)" }}
            transition={{
              duration: 2.2,
              ease: [0.25, 0.1, 0.25, 1],
              delay: 0.2,
            }}
            style={{ display: "inline-block" }}
          >
            {greetingText}
          </motion.span>
        ) : (
          greetingText
        )}
      </motion.div>
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="text-center font-semibold text-2xl tracking-tight text-foreground md:text-3xl"
        initial={{ opacity: 0, y: 10 }}
        transition={{
          delay: shouldAnimate ? 2.4 : 0,
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        What can I help with?
      </motion.div>
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="mt-3 text-center text-muted-foreground/80 text-sm"
        initial={{ opacity: 0, y: 10 }}
        transition={{
          delay: shouldAnimate ? 2.6 : 0,
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        Ask a question, write code, or explore ideas.
      </motion.div>
    </div>
  );
};
