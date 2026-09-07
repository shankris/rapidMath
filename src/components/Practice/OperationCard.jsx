"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Timer, ChevronDown, Check } from "lucide-react";
import { LEVEL_CONFIG } from "@/lib/math/levels";

import styles from "./OperationCard.module.css";

export default function OperationCard({ operation, isOpen, onToggle }) {
  const Icon = operation.icon;
  const levels = Object.entries(LEVEL_CONFIG);

  return (
    <motion.div
      layout
      className={styles.card}
    >
      {/* --------------------------------------------------
         Operation Header
      -------------------------------------------------- */}

      <button
        type='button'
        className={styles.header}
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <div className={styles.headerContent}>
          <Icon size={28} />
          <h2>{operation.title}</h2>
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>

      {/* --------------------------------------------------
         Operation Content
      -------------------------------------------------- */}

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: {
                duration: 0.45,
                ease: "easeInOut",
              },
              opacity: {
                duration: 0.25,
              },
            }}
            style={{ overflow: "hidden" }}
          >
            {/* --------------------------------------------------
               Level Grid
            -------------------------------------------------- */}

            <div className={styles.levelGrid}>
              {levels.map(([level, config]) => (
                <Link
                  href={`/practice/${operation.operation}/${level}`}
                  className={styles.levelCard}
                  key={level}
                >
                  <span className={styles.levelNumber}>Level {level}</span>
                  <span className={styles.levelTitle}>{config.title}</span>
                  {/* --------------------------------------------------
   Level Statistics
-------------------------------------------------- */}
                  <div className={styles.levelStats}>
                    {/* --------------------------------------------------
     Correct Answers
  -------------------------------------------------- */}

                    <span className={styles.correctAnswers}>
                      <Check
                        size={15}
                        strokeWidth={2}
                      />
                      <span>94%</span>
                    </span>

                    {/* --------------------------------------------------
     Average Reaction Time
  -------------------------------------------------- */}

                    <span className={styles.reactionTime}>
                      <Timer
                        size={16}
                        strokeWidth={1.8}
                      />

                      <span>3.433s</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
