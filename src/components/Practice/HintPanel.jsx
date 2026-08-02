"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import PlaceValueHint from "./HintRenderers/PlaceValueHint";
import SplitNumberHint from "./HintRenderers/SplitNumberHint";
import Times10Hint from "./HintRenderers/Times10Hint";
import DoubleHalfHint from "./HintRenderers/DoubleHalfHint";
import NearMultipleHint from "./HintRenderers/NearMultipleHint";

import styles from "./Practice.module.css";

const renderers = {
  "place-values": PlaceValueHint,
  "split-number": SplitNumberHint,
  "double-half": DoubleHalfHint,
  "times-10": Times10Hint,
  "near-multiple": NearMultipleHint,
};

export default function HintPanel({ hints }) {
  const [showHint, setShowHint] = useState(false);
  const [activeHintIndex, setActiveHintIndex] = useState(0);

  if (!hints || hints.length === 0) {
    return <div className={styles.noHints}>No hints available for this question</div>;
  }

  const activeHint = hints[activeHintIndex];
  const HintRenderer = renderers[activeHint.id];

  return (
    <>
      {!showHint && (
        <button
          type='button'
          className={styles.hintButton}
          onClick={() => setShowHint(true)}
        >
          💡 Show Hint
        </button>
      )}

      <AnimatePresence initial={false}>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className={styles.hintContainer}
          >
            <div className={styles.hintTabs}>
              {hints.map((hint, index) => (
                <button
                  key={hint.id}
                  className={index === activeHintIndex ? styles.activeHintTab : styles.hintTab}
                  onClick={() => setActiveHintIndex(index)}
                >
                  {hint.title}
                </button>
              ))}
            </div>

            {HintRenderer && (
              <div className={styles.hintBox}>
                <HintRenderer hint={activeHint} />
              </div>
            )}

            <button
              type='button'
              className={styles.hintButton}
              onClick={() => setShowHint(false)}
            >
              💡 Hide Hint
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
