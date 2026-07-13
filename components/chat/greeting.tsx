"use client";
import { motion } from "framer-motion";
import { FileAudioIcon, ImageIcon, MicIcon, VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import { GemIcon } from "./gem-icon";

const FALLBACK_TEXT = "Hello, I'm Evo.";
const STORAGE_KEY = "evo_greeting_played";
const DISMISS_KEY = "evo_guest_welcome_dismissed";
const BLOCK_KEY = "evo_greeting_blocked";
const GUEST_REGEX = /^guest-\d+$/;

const CHIP_CLASS =
  "flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-[13px] text-foreground/80 transition-colors duration-150 hover:border-primary/50 hover:text-foreground";

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

  const router = useRouter();
  const { data: session, status } = useSession();
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
    const fullName: string | null = userData?.name ?? null;
    const firstName = fullName ? fullName.trim().split(" ")[0] : null;
    setGreetingText(buildGreeting(firstName));
    if (firstName) {
      sessionStorage.setItem("evo_returning_user", "true");
    }
  }, [userData]);

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
      <motion.div
        animate={{ opacity: 1 }}
        className="mb-4 flex size-11 items-center justify-center rounded-2xl border border-primary/50 bg-primary/10"
        initial={{ opacity: shouldAnimate ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      >
        <GemIcon className="size-5 text-amber-400" />
      </motion.div>
      <motion.div
        initial={{ opacity: shouldAnimate ? 0 : 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          fontSize: "clamp(1.6rem, 4vw, 2.1rem)",
          fontWeight: 600,
          color: "#4ade80",
          minHeight: "3rem",
          textAlign: "center",
          marginBottom: 20,
          letterSpacing: "-0.02em",
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
        className="text-center text-muted-foreground/80 text-sm"
        initial={{ opacity: 0, y: 10 }}
        transition={{
          delay: shouldAnimate ? 2.4 : 0,
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        What are we creating today?
      </motion.div>
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 flex max-w-md flex-wrap items-center justify-center gap-2"
        initial={{ opacity: 0, y: 10 }}
        transition={{
          delay: shouldAnimate ? 2.7 : 0,
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <button className={CHIP_CLASS} onClick={() => router.push("/image")} type="button">
          <ImageIcon className="size-3.5 text-primary" />
          Create an image
        </button>
        <button className={CHIP_CLASS} onClick={() => router.push("/video")} type="button">
          <VideoIcon className="size-3.5 text-primary" />
          Generate a video ad
        </button>
        <button className={CHIP_CLASS} onClick={() => router.push("/voice")} type="button">
          <MicIcon className="size-3.5 text-primary" />
          Clone a voice
        </button>
        <button className={CHIP_CLASS} onClick={() => router.push("/transcribe")} type="button">
          <FileAudioIcon className="size-3.5 text-primary" />
          Transcribe audio
        </button>
      </motion.div>
    </div>
  );
};

// -----------------------------------------------------------
// END OF FILE - components/chat/greeting.tsx (v4 - crisp font)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
