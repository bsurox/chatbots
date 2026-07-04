"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const HELLO_TEXT = "Hello, I'm Evo.";
const STORAGE_KEY = "evo_greeting_played";

export const Greeting = () => {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    const alreadyPlayed = sessionStorage.getItem(STORAGE_KEY);

    if (alreadyPlayed) {
      setDisplayed(HELLO_TEXT);
      setDone(true);
      setShouldAnimate(false);
      return;
    }

    setShouldAnimate(true);
    sessionStorage.setItem(STORAGE_KEY, "true");

    let i = 0;
    setDisplayed("");
    setDone(false);

    const interval = setInterval(() => {
      i++;
      setDisplayed(HELLO_TEXT.slice(0, i));
      if (i >= HELLO_TEXT.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, 90);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center px-4" key="overview">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>

      <div
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
        }}
      >
        {displayed}
        {!done && (
          <span
            style={{
              display: "inline-block",
              width: 2,
              height: "1em",
              background: "#4ade80",
              marginLeft: 2,
              verticalAlign: "middle",
              animation: "blink 0.7s step-end infinite",
            }}
          />
        )}
      </div>

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="text-center font-semibold text-2xl tracking-tight text-foreground md:text-3xl"
        initial={{ opacity: 0, y: 10 }}
        transition={{
          delay: shouldAnimate ? 1.4 : 0,
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
          delay: shouldAnimate ? 1.6 : 0,
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        Ask a question, write code, or explore ideas.
      </motion.div>
    </div>
  );
};
