// src/components/Dashboard/UnlockHigherLevels.jsx

"use client";

import styles from "./UnlockHigherLevels.module.css";

/* --------------------------------------------------
   Unlock Higher Levels
-------------------------------------------------- */

export default function UnlockHigherLevels({ quizzesCompleted = 0, perfectQuizzes = 0, reactionTimeImproved = false }) {
  const quizzesTarget = 20;
  const perfectQuizzesTarget = 10;

  const quizzesComplete = quizzesCompleted >= quizzesTarget;
  const perfectQuizzesComplete = perfectQuizzes >= perfectQuizzesTarget;

  return (
    <section className={styles.unlockCard}>
      <div className={styles.heading}>
        <h2>Unlock Higher Levels</h2>
      </div>

      <p className={styles.intro}>Complete the following requirements within the trailing 30-day period to unlock higher levels (5 and above).</p>

      <ul className={styles.requirements}>
        <li className={quizzesComplete ? styles.complete : ""}>
          <span
            className={styles.icon}
            aria-hidden='true'
          >
            {quizzesComplete ? "✓" : "○"}
          </span>

          <span>
            Complete <strong>{quizzesTarget} quizzes</strong> at your highest enabled level
            {quizzesCompleted > 0 && (
              <span className={styles.progress}>
                {" "}
                ({quizzesCompleted}/{quizzesTarget})
              </span>
            )}
          </span>
        </li>

        <li className={perfectQuizzesComplete ? styles.complete : ""}>
          <span
            className={styles.icon}
            aria-hidden='true'
          >
            {perfectQuizzesComplete ? "✓" : "○"}
          </span>

          <span>
            Achieve <strong>100% accuracy</strong> on at least <strong>{perfectQuizzesTarget} quizzes</strong>
            {perfectQuizzes > 0 && (
              <span className={styles.progress}>
                {" "}
                ({perfectQuizzes}/{perfectQuizzesTarget})
              </span>
            )}
          </span>
        </li>

        <li className={reactionTimeImproved ? styles.complete : ""}>
          <span
            className={styles.icon}
            aria-hidden='true'
          >
            {reactionTimeImproved ? "✓" : "○"}
          </span>

          <span>
            Demonstrate a <strong>significant improvement in reaction time</strong>
          </span>
        </li>
      </ul>
    </section>
  );
}
