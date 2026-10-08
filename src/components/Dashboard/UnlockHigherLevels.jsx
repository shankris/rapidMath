// src/components/Dashboard/UnlockHigherLevels.jsx

"use client";

import styles from "./UnlockHigherLevels.module.css";

/* --------------------------------------------------
   Unlock Higher Levels
-------------------------------------------------- */

export default function UnlockHigherLevels() {
  return (
    <section className={styles.unlockCard}>
      <div className={styles.heading}>
        <h2>Unlock Higher Levels</h2>
      </div>

      <p className={styles.intro}>
        Score <strong>100% accuracy</strong> to unlock the next level.
      </p>

      <ul className={styles.requirements}>
        <li>
          <span
            className={styles.icon}
            aria-hidden='true'
          >
            ✓
          </span>

          <span>
            Score <strong>100% accuracy</strong> on a quiz at your current highest level.
          </span>
        </li>

        <li>
          <span
            className={styles.icon}
            aria-hidden='true'
          >
            ✓
          </span>

          <span>
            At the end of the quiz, an <strong>Unlock Next Level</strong> button will appear.
          </span>
        </li>

        <li>
          <span
            className={styles.icon}
            aria-hidden='true'
          >
            ✓
          </span>

          <span>
            After you attempt the new level, it will appear in <strong>Recent Practice</strong> on the Dashboard.
          </span>
        </li>
      </ul>
    </section>
  );
}
