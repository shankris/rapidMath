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
            <div className={styles.graphs}></div>
            <span>Accuracy</span>
          </div>

          <div>
            <div className={styles.graphs}></div>
            <span>Avg Time</span>
          </div>

          <div>
            <div className={styles.graphs}></div>
            <span>Attempts</span>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className={`card ${styles.settingsCard}`}>
        <h2>Quiz Settings</h2>

        <div className={styles.row}>
          <label className={styles.settingRow}>
            <input
              type='checkbox'
              defaultChecked={false}
            />
          </label>
          <span>Show hints</span>
        </div>

        <div className={styles.row}>
          <label className={styles.settingRow}>
            <input
              type='checkbox'
              defaultChecked={true}
            />
          </label>
          <span>Show timer</span>
        </div>

        <div className={styles.row}>
          <label className={styles.settingRow}>
            <input
              type='checkbox'
              defaultChecked={true}
            />
          </label>
          <span>Keyboard shortcuts</span>
        </div>
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
