/* src/components/Quiz/QuizComplete.jsx */

"use client";

import Link from "next/link";
import styles from "./QuizComplete.module.css";

export default function QuizComplete({ results, performanceMessage, operation, level, hasNextLevel, onRetake, onContinue }) {
  const hasPreviousLevel = level > 1;

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

        <h2>Your Quiz Results</h2>

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

            <span>Fastest Time</span>
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

            <span>Slowest Time</span>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------
          Quiz Actions
      -------------------------------------------------- */}

      <div className={styles.actions}>
        <button
          className={styles.btnGhost}
          onClick={onContinue}
        >
          Review Quiz Performance
        </button>

        {hasPreviousLevel && (
          <Link
            href={`/practice/${operation}/${level - 1}`}
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

        {hasNextLevel && (
          <Link
            href={`/practice/${operation}/${level + 1}`}
            className={styles.btnSecondary}
          >
            Try Next Level
          </Link>
        )}

        <Link
          href='/practice'
          className={styles.btnSecondary}
        >
          Take Another Quiz
        </Link>
      </div>
    </div>
  );
}
