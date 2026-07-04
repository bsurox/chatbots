"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const HELLO_TEXT = "Hello, I'm Evo.";
const STORAGE_KEY = "evo_greeting_played";

export const Greeting = () => {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const alreadyPlayed = sessionStorage.getItem(STORAGE_KEY);
    setShow(true);
    if (!alreadyPlayed) {
      setShouldAnimate(true);
      sessionStorage.setItem(STORAGE_KEY, "true");
    }
  }, []);

  if (!show) return null;

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
            {HELLO_TEXT}
          </motion.span>
        ) : (
          HELLO_TEXT
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
