"use client";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
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

  const { data: session, status } = useSession();
  const { data: userData } = useSWR("/api/user/profile", fetcher);

  // Listen for the popup dismiss (guest path)
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

  // Keep the greeting text in sync with the name whenever it arrives
  useEffect(() => {
    const fullName: string | null = userData?.name ?? null;
    const firstName = fullName ? fullName.trim().split(" ")[0] : null;
    setGreetingText(buildGreeting(firstName));
    if (firstName) {
      sessionStorage.setItem("evo_returning_user", "true");
    }
  }, [userData]);

  // Decide whether to reveal, based on session (reliable)
  useEffect(() => {
    if (revealed || status === "loading") {
      return;
    }

    const email: string | null = session?.user?.email ?? null;
    const isGuest = email ? GUEST_REGEX.test(email) : false;

    if (!isGuest) {
      sessionStorage.removeItem(BLOCK_KEY);
      setBlocked(false);
      reveal();
      return;
    }

    const dismissed = sessionStorage.getItem(DISMISS_KEY);
    if (!dismissed) {
      setBlocked(true);
      return;
    }

    reveal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status, revealed]);

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
