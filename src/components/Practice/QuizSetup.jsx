"use client";

import styles from "./Practice.module.css";
import { OPERATIONS } from "@/lib/math/operations";

export default function QuizSetup({ operation, level, onStart }) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>{OPERATIONS[operation].name}</h1>
          <span className={styles.level}>Level {level}</span>
        </div>
      </div>

      {/* Progress Preview */}
      <div className={`card ${styles.progressCard}`}>
        <h2>Your Progress</h2>
        <p className={styles.muted}>Last 30 days</p>

        <div className={styles.stats}>
          <div>
            <strong>--</strong>
            <span>Accuracy</span>
          </div>

          <div>
            <strong>--</strong>
            <span>Avg Time</span>
          </div>

          <div>
            <strong>--</strong>
            <span>Attempts</span>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className={`card ${styles.settingsCard}`}>
        <h2>Quiz Settings</h2>

        <label className={styles.settingRow}>
          <span>Show hints</span>

          <input
            type='checkbox'
            defaultChecked={false}
          />
        </label>

        <label className={styles.settingRow}>
          <span>Show timer</span>

          <input
            type='checkbox'
            defaultChecked={true}
          />
        </label>

        <label className={styles.settingRow}>
          <span>Keyboard shortcuts</span>

          <input
            type='checkbox'
            defaultChecked={true}
          />
        </label>
      </div>

      <button
        className={styles.btnPrimary}
        onClick={onStart}
      >
        Start Quiz
      </button>
    </div>
  );
}
