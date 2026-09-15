/* src/components/StreakStats/StreakStats.jsx */

"use client";

import { Flame, Trophy } from "lucide-react";
import styles from "./StreakStats.module.css";

/* --------------------------------------------------
Streak Stats
-------------------------------------------------- */

export default function StreakStats({ currentStreak = 0, bestStreak = 0 }) {
  return (
    <div className={styles.stats}>
      {" "}
      <div className={styles.stat}>
        {" "}
        <div className={styles.icon}>
          {" "}
          <Flame
            size={18}
            strokeWidth={1.8}
          />{" "}
        </div>
        <div className={styles.content}>
          <strong>{currentStreak}</strong>
          <span>Current streak</span>
        </div>
      </div>
      <div className={styles.stat}>
        <div className={styles.icon}>
          <Trophy
            size={18}
            strokeWidth={1.8}
          />
        </div>

        <div className={styles.content}>
          <strong>{bestStreak}</strong>
          <span>Longest streak</span>
        </div>
      </div>
    </div>
  );
}
