"use client";

import styles from "./Practice.module.css";

export default function QuizComplete({ results, onRetake, onAnotherTest, onContinue }) {
  return (
    <div className={styles.complete}>
      <div className={styles.completeHeader}>
        <h1>🎉 Quiz Complete!</h1>

        <p>Great work. Here is your performance summary.</p>
      </div>

      <div className={`card ${styles.resultCard}`}>
        <div className={styles.resultItem}>
          <strong>
            {results.correct} / {results.total}
          </strong>
          <span>Correct Answers</span>
        </div>

        <div className={styles.resultItem}>
          <strong>{results.accuracy}%</strong>
          <span>Accuracy</span>
        </div>

        <div className={styles.resultItem}>
          <strong>{results.averageTime}s</strong>
          <span>Average Time</span>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          className='btn-primary'
          onClick={onRetake}
        >
          Retake This Test
        </button>

        <button
          className={styles.secondaryButton}
          onClick={onAnotherTest}
        >
          Take Another Test
        </button>

        <button
          className={styles.secondaryButton}
          onClick={onContinue}
        >
          View Progress
        </button>
      </div>
    </div>
  );
}
