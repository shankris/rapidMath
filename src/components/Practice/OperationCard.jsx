// src/components/Practice/OperationCard.jsx

"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Timer, CalendarDays, ChevronDown, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { LEVEL_CONFIG } from "@/lib/math/levels";

import styles from "./OperationCard.module.css";

/* --------------------------------------------------
   Local Storage Configuration
-------------------------------------------------- */

const STORAGE_KEY = "rapidMath.quizAttempts";

/* --------------------------------------------------
   Category Configuration
-------------------------------------------------- */

function getCategoryConfig(operation) {
  switch (operation) {
    case "add":
      return "addition";

    case "sub":
      return "subtraction";

    case "mul":
      return "multiplication";

    case "div":
      return "division";

    case "mixedOperations":
      return "mixedOperations";

    case "missingNumber":
      return "missingNumber";

    case "comparison":
      return "comparison";

    case "estimation":
      return "estimation";

    case "sequences":
      return "sequences";

    case "fractions":
      return "fractions";

    case "percentages":
      return "percentages";

    case "powersRoots":
      return "powersRoots";

    case "combinations":
      return "combinations";

    case "probability":
      return "probability";

    default:
      return null;
  }
}

/* --------------------------------------------------
   Relative Time
-------------------------------------------------- */

function getRelativeTime(timestamp) {
  if (!timestamp) {
    return null;
  }

  const completedAt = new Date(timestamp);
  const now = new Date();

  const difference = now.getTime() - completedAt.getTime();

  if (difference < 0) {
    return "just now";
  }

  const minutes = Math.floor(difference / (1000 * 60));

  if (minutes < 1) {
    return "just now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days}d ago`;
  }

  const weeks = Math.floor(days / 7);

  if (weeks < 5) {
    return `${weeks}w ago`;
  }

  const months = Math.floor(days / 30);

  if (months < 12) {
    return `${months}mo ago`;
  }

  const years = Math.floor(days / 365);

  return `${years}y ago`;
}

/* --------------------------------------------------
   Level Statistics
-------------------------------------------------- */

function getLevelStatistics(attempts, operation, level) {
  const levelAttempts = attempts.filter((attempt) => attempt.operation === operation && String(attempt.level) === String(level) && attempt.status === "completed");

  if (levelAttempts.length === 0) {
    return null;
  }

  const latestAttempt = levelAttempts.reduce((latest, attempt) => {
    if (!latest) {
      return attempt;
    }

    return new Date(attempt.completedAt) > new Date(latest.completedAt) ? attempt : latest;
  }, null);

  const questions = levelAttempts.flatMap((attempt) => attempt.questions || []);

  if (questions.length === 0) {
    return null;
  }

  const correctAnswers = questions.filter((question) => question.correct === true).length;

  const accuracy = Math.round((correctAnswers / questions.length) * 100);

  const timedQuestions = questions.filter((question) => typeof question.time === "number");

  const averageTime = timedQuestions.length > 0 ? timedQuestions.reduce((total, question) => total + question.time, 0) / timedQuestions.length : null;

  return {
    accuracy,
    averageTime,
    completedAt: latestAttempt?.completedAt || null,
    relativeTime: getRelativeTime(latestAttempt?.completedAt),
  };
}

/* --------------------------------------------------
   Operation Card
-------------------------------------------------- */

export default function OperationCard({ operation, isOpen, onToggle }) {
  const Icon = operation.icon;

  const [attempts, setAttempts] = useState([]);

  /* --------------------------------------------------
     Load Quiz Attempts
  -------------------------------------------------- */

  useEffect(() => {
    try {
      const storedAttempts = localStorage.getItem(STORAGE_KEY);

      if (!storedAttempts) {
        setAttempts([]);
        return;
      }

      const parsedAttempts = JSON.parse(storedAttempts);

      setAttempts(Array.isArray(parsedAttempts) ? parsedAttempts : []);
    } catch (error) {
      console.error("Unable to load quiz attempts:", error);
      setAttempts([]);
    }
  }, []);

  const categoryKey = getCategoryConfig(operation.operation);

  const categoryConfig = categoryKey ? Object.fromEntries(Object.entries(LEVEL_CONFIG).filter(([, config]) => config[categoryKey])) : {};

  const levels = Object.entries(categoryConfig);

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
          <Icon
            size={22}
            className={styles.operationIcon}
          />

          <h2>{operation.title}</h2>
        </div>

        <motion.div
          animate={{
            rotate: isOpen ? 180 : 0,
          }}
          transition={{
            duration: 0.25,
          }}
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
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            transition={{
              height: {
                duration: 0.45,
                ease: "easeInOut",
              },
              opacity: {
                duration: 0.25,
              },
            }}
            style={{
              overflow: "hidden",
            }}
          >
            {/* --------------------------------------------------
               Level Grid
            -------------------------------------------------- */}

            <div className={styles.levelGrid}>
              {levels.map(([level, config]) => {
                const statistics = getLevelStatistics(attempts, operation.operation, level);

                return (
                  <Link
                    href={`/practice/${operation.operation}/${level}`}
                    className={styles.levelCard}
                    key={level}
                  >
                    <span className={styles.levelNumber}>Level {level}</span>

                    <span className={styles.levelTitle}>{config.title}</span>

                    {/* --------------------------------------------------
                       Level Tooltip
                    -------------------------------------------------- */}

                    <span className={styles.tooltip}>{config.details?.[operation.operation]}</span>

                    {/* --------------------------------------------------
                       Level Statistics
                    -------------------------------------------------- */}

                    <div className={styles.levelStats}>
                      {statistics ? (
                        <>
                          <span className={styles.correctAnswers}>
                            <Check
                              size={15}
                              strokeWidth={2}
                            />

                            <span>{statistics.accuracy}%</span>
                          </span>

                          <span className={styles.reactionTime}>
                            <Timer
                              size={16}
                              strokeWidth={1.8}
                            />

                            <span>{statistics.averageTime != null ? `${statistics.averageTime.toFixed(3)}s` : "—"}</span>
                          </span>

                          <span className={styles.testTime}>
                            <CalendarDays
                              size={15}
                              strokeWidth={1.8}
                            />

                            <span>{statistics.relativeTime || "—"}</span>
                          </span>
                        </>
                      ) : (
                        <span className={styles.notAttempted}>Not attempted</span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
