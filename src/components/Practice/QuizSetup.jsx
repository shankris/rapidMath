"use client";

import styles from "./Practice.module.css";

export default function QuizSetup({ operation, level, onStart }) {
  return (
    <div className={styles.setup}>
      <div className={styles.setupHeader}>
        <h1>
          {operation.toUpperCase()} - Level {level}
        </h1>

        <p>Get ready for your math challenge</p>
      </div>

      {/* Progress Preview */}
      <div className={`card ${styles.progressCard}`}>
        <h2>Your Progress</h2>

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

        <p className={styles.muted}>Your last 30 days performance will appear here.</p>
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
        className='btn-primary'
        onClick={onStart}
      >
        Start Quiz
      </button>
    </div>
  );
}
