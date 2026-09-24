/* src/components/Quiz/QuizComplete.jsx */

"use client";

import Link from "next/link";
import styles from "./QuizComplete.module.css";

export default function QuizComplete({ results, operation, level, hasNextLevel, onRetake, onContinue }) {
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
        <h2>
          Great work - You have improved your average score
          <br />
          <br />
          Your Quiz Results
        </h2>

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

        <button
          className={styles.btnSecondary}
          onClick={onContinue}
        >
          Review Quiz Performance
        </button>
      </section>

      {/* --------------------------------------------------
          Quiz Actions
      -------------------------------------------------- */}

      <div className={styles.actions}>
        {hasPreviousLevel && (
          <Link
            href={`/practice/${operation}/${level - 1}`}
            className={styles.btnSecondary}
          >
            Try Previous Level Quiz
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
            Try Next Level Quiz
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
