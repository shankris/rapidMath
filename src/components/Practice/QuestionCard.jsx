"use client";

import { Fragment, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getHints } from "@/lib/math/hints";
import PlaceValueDisplay from "./PlaceValueDisplay";

import styles from "./Practice.module.css";

export default function QuestionCard({ question }) {
  const [showHint, setShowHint] = useState(false);

  const hints = getHints(question);

  return (
    <div className={styles.questionCard}>
      <div className={styles.question}>{question.question}</div>

      {hints.length > 0 && (
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
                <div className={styles.hintTitle}>{hints[0].title}</div>

                {hints[0].lines.map((line, index) => (
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
            aria-expanded={showHint}
          >
            💡 {showHint ? "Hide Hint" : "Show Hint"}
          </button>
        </>
      )}
    </div>
  );
}
