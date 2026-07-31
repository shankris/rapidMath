"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { getHints } from "@/lib/math/hints";

import styles from "./Practice.module.css";

export default function QuestionCard({ question }) {
  const [showHint, setShowHint] = useState(false);

  const hints = getHints(question);

  return (
    <div className={styles.questionCard}>
      <div className={styles.question}>{question.question}</div>

      {hints.length > 0 && (
        <button
          className={styles.hintButton}
          onClick={() => setShowHint((prev) => !prev)}
        >
          {showHint ? "Hide Hint ▲" : "Show Hint ▼"}
        </button>
      )}

      <AnimatePresence>
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
          >
            <div className={styles.hintTitle}>{hints[0].title}</div>

            {hints[0].lines.map((line, index) => (
              <div
                key={index}
                className={styles.hintLine}
              >
                {line}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
