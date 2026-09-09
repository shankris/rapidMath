"use client";

import { useId } from "react";
import styles from "./ProgressBar.module.css";

/* --------------------------------------------------
   Progress Bar

   Reusable SVG progress bar.

   The percentage value is rendered twice:
   - The base value uses the primary text colour.
   - The second value uses the surface colour and is
     clipped to the progress area.

   This creates the colour transition effect while
   keeping the percentage perfectly centered.
-------------------------------------------------- */

export default function ProgressBar({ value = 0, height = 14, showValue = true }) {
  const clipId = useId();

  const percentage = Math.min(Math.max(Number(value) || 0, 0), 100);

  return (
    <div
      className={styles.container}
      style={{
        "--progress-height": `${height}px`,
      }}
    >
      <svg
        className={styles.svg}
        viewBox='0 0 100 14'
        preserveAspectRatio='xMidYMid meet'
        role={showValue ? "img" : undefined}
        aria-label={showValue ? `${percentage}%` : undefined}
      >
        {/* --------------------------------------------------
           Track
        -------------------------------------------------- */}

        <rect
          className={styles.track}
          x='0'
          y='0'
          width='100'
          height='14'
          rx='2'
        />

        {/* --------------------------------------------------
           Progress
        -------------------------------------------------- */}

        <rect
          className={styles.progress}
          x='0'
          y='0'
          width={percentage}
          height='14'
          rx='2'
        />

        {showValue && (
          <>
            {/* --------------------------------------------------
               Base Value
            -------------------------------------------------- */}

            <text
              className={styles.value}
              x='50'
              y='7'
              textAnchor='middle'
              dominantBaseline='central'
            >
              {percentage}%
            </text>

            {/* --------------------------------------------------
               Clip Progress Area
            -------------------------------------------------- */}

            <defs>
              <clipPath id={clipId}>
                <rect
                  x='0'
                  y='0'
                  width={percentage}
                  height='14'
                />
              </clipPath>
            </defs>

            {/* --------------------------------------------------
               Filled Value
            -------------------------------------------------- */}

            <text
              className={styles.valueFilled}
              x='50'
              y='7'
              textAnchor='middle'
              dominantBaseline='central'
              clipPath={`url(#${clipId})`}
            >
              {percentage}%
            </text>
          </>
        )}
      </svg>
    </div>
  );
}
