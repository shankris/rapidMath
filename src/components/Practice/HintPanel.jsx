"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import PlaceValueDisplay from "./PlaceValueDisplay";

import styles from "./Practice.module.css";

export default function HintPanel({ hints }) {
  const [showHint, setShowHint] = useState(false);

  if (hints.length === 0) {
    return null;
  }

  const hint = hints[0];

  return (
    <>
      <AnimatePresence initial={false}>
        {showHint && (
          <motion.div
            className={styles.hintBox}
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            transition={{
              duration: 0.25,
            }}
            style={{ overflow: "hidden" }}
          >
            <div className={styles.hintTitle}>{hint.title}</div>

            {hint.lines.map((line, index) => (
              <PlaceValueDisplay
                key={index}
                line={line}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type='button'
        className={styles.hintButton}
        onClick={() => setShowHint((prev) => !prev)}
      >
        💡 {showHint ? "Hide Hint" : "Show Hint"}
      </button>
    </>
  );
}
