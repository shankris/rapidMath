// src/components/UI/Progress/RadialProgress.jsx

"use client";

import styles from "./RadialProgress.module.css";

/* --------------------------------------------------
   Determine Accuracy Range
-------------------------------------------------- */

function getAccuracyRange(percentage) {
  if (percentage < 25) {
    return "low";
  }

  if (percentage < 50) {
    return "medium-low";
  }

  if (percentage < 75) {
    return "medium-high";
  }

  return "high";
}

/* --------------------------------------------------
   Radial Progress
-------------------------------------------------- */

export default function RadialProgress({ value = 0, size = 76 }) {
  const percentage = Math.min(100, Math.max(0, Number(value) || 0));

  const range = getAccuracyRange(percentage);

  return (
    <div
      className={styles.progress}
      data-range={range}
      style={{ "--progress-size": `${size}px` }}
      aria-label={`${percentage}%`}
    >
      <svg
        className={styles.svg}
        viewBox='0 0 100 100'
        role='img'
        aria-hidden='true'
      >
        <circle
          className={styles.track}
          cx='50'
          cy='50'
          r='42'
        />

        <circle
          className={styles.indicator}
          cx='50'
          cy='50'
          r='42'
          pathLength='100'
          style={{
            strokeDasharray: `${percentage} 100`,
          }}
        />
      </svg>

      <span className={styles.value}>{Math.round(percentage)}%</span>
    </div>
  );
}
