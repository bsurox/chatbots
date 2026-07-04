"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const HELLO_TEXT = "Hello, I'm Evo.";

export const Greeting = () => {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
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
    }, 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center px-4" key="overview">
      <div
        style={{
          fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif",
          fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
          fontWeight: 500,
          fontStyle: "italic",
          letterSpacing: "0.02em",
          color: "inherit",
          minHeight: "2.5rem",
          textAlign: "center",
          marginBottom: 8,
        }}
      >
        {displayed}
        {!done && (
          <span
            style={{
              display: "inline-block",
              width: 2,
              height: "1em",
              background: "currentColor",
              marginLeft: 2,
              verticalAlign: "middle",
              animation: "blink 0.7s step-end infinite",
            }}
          />
        )}
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="text-center font-semibold text-2xl tracking-tight text-foreground md:text-3xl"
        initial={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.9, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        What can I help with?
      </motion.div>
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="mt-3 text-center text-muted-foreground/80 text-sm"
        initial={{ opacity: 0, y: 10 }}
        transition={{ delay: 1.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        Ask a question, write code, or explore ideas.
      </motion.div>
    </div>
  );
};
