"use client";

import styles from "./QuizSetup.module.css";
import { OPERATIONS } from "@/lib/math/operations";

export default function QuizSetup({ operation, level, onStart }) {
  return (
    <>
      {/* --------------------------------------------------
         Page Header
      -------------------------------------------------- */}

      <div className={styles.header}>
        <h1>
          {OPERATIONS[operation].name} · Level {level}
        </h1>
      </div>

      {/* --------------------------------------------------
         Progress Preview
      -------------------------------------------------- */}

      <section className={styles.progress}>
        <h2>Your progress in the last 30 days</h2>

        <div className={styles.stats}>
          <div>
            <div className={styles.statValue}>94%</div>
            <span>Accuracy</span>
          </div>

          <div>
            <div className={styles.statValue}>
              3.43<div className={styles.statUnit}>s</div>
            </div>
            <span>Avg Reaction Time</span>
          </div>

          <div>
            <div className={styles.statValue}>42</div>
            <span>Attempts</span>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------
         Start Practice
      -------------------------------------------------- */}

      <div className={styles.startButton}>
        <button
          className={styles.btnPrimary}
          onClick={onStart}
        >
          Start Practice
        </button>
      </div>
    </>
  );
}
