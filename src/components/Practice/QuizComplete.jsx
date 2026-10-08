/* src/components/Quiz/QuizComplete.jsx */

"use client";

import Link from "next/link";
import { useLocale } from "next-intl";

import { OPERATIONS } from "@/lib/config";

import styles from "./QuizComplete.module.css";

export default function QuizComplete({ results, performanceMessage, operation, level, attemptId, onRetake, onContinue }) {
  const locale = useLocale();

  const hasPreviousLevel = level > 1;

  const nextLevel = level + 1;

  const nextLevelExists = OPERATIONS[operation]?.maxLevel >= nextLevel;

  const canShowNextLevel = nextLevelExists && (level < 4 || results.accuracy === 100);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Quiz Complete!</h1>
      </div>

      {/* --------------------------------------------------
          Performance Summary
      -------------------------------------------------- */}

      <section className={styles.progress}>
        {performanceMessage && (
          <div className={styles.performanceMessage}>
            <div className={styles.performanceHeading}>{performanceMessage.heading}</div>

            <div className={styles.performanceText}>{performanceMessage.text}</div>
          </div>
        )}

        <div className={styles.headingWithLine}>
          <span>Your Quiz Results</span>
        </div>

        <div className={styles.stats}>
          <div>
            <div className={styles.statValue}>
              {results.correct} / {results.total}
            </div>

            <span>Correct Answers</span>
          </div>

          <div>
            <div className={styles.statValue}>{results.accuracy}%</div>

            <span>Accuracy</span>
          </div>
        </div>

        <div className={styles.stats}>
          <div>
            <div className={styles.statValue}>
              {results.fastestTime}

              <div className={styles.statUnit}>s</div>
            </div>

            <span>Fastest</span>
          </div>

          <div>
            <div className={styles.statValue}>
              {results.averageTime}

              <div className={styles.statUnit}>s</div>
            </div>

            <span>Avg. Time</span>
          </div>

          <div>
            <div className={styles.statValue}>
              {results.slowestTime}

              <div className={styles.statUnit}>s</div>
            </div>

            <span>Slowest</span>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------
          Quiz Actions
      -------------------------------------------------- */}

      <div className={styles.actions}>
        <Link
          href={`/${locale}/practice/review?opp=${operation}&level=${level}&date=${attemptId.slice(0, 8)}`}
          className={styles.btnGhost}
        >
          Review Quiz Performance
        </Link>

        {hasPreviousLevel && (
          <Link
            href={`/${locale}/practice/${operation}/${level - 1}`}
            className={styles.btnSecondary}
          >
            Try Previous Level
          </Link>
        )}

        <button
          className={styles.btnPrimary}
          onClick={onRetake}
        >
          Retake This Quiz
        </button>

        {canShowNextLevel && (
          <Link
            href={`/${locale}/practice/${operation}/${nextLevel}`}
            className={styles.btnSecondary}
          >
            Try Next Level
          </Link>
        )}

        <Link
          href={`/${locale}/practice`}
          className={styles.btnSecondary}
        >
          Take Another Quiz
        </Link>
      </div>
    </div>
  );
}
