"use client";

/* src/components/StreakStats/StreakStats.jsx */

import { Flame, Trophy } from "lucide-react";
import { getStreakStats } from "@/lib/stats/streak";
import styles from "./StreakStats.module.css";

/* --------------------------------------------------
   Format Streak Date Range
-------------------------------------------------- */

function formatStreakDateRange(startDate, endDate) {
  if (!startDate || !endDate) {
    return "";
  }

  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return "";
  }

  const startYear = start.getFullYear();
  const endYear = end.getFullYear();

  const startFormatter = new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
    year: startYear !== endYear ? "numeric" : undefined,
  });

  const endFormatter = new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return `${startFormatter.format(start)} – ${endFormatter.format(end)}`;
}

/* --------------------------------------------------
   Streak Item
-------------------------------------------------- */

function StreakItem({ icon: Icon, value, label, startDate, endDate }) {
  const dateRange = formatStreakDateRange(startDate, endDate);

  return (
    <div className={styles.stat}>
      <div className={styles.icon}>
        <Icon
          size={18}
          strokeWidth={1.8}
          aria-hidden='true'
        />
      </div>

      <div className={styles.content}>
        <strong>{value} Days</strong>

        <span>{label}</span>

        {dateRange && <small>{dateRange}</small>}
      </div>
    </div>
  );
}

/* --------------------------------------------------
   Streak Stats
-------------------------------------------------- */

export default function StreakStats() {
  const { currentStreak, currentStartDate, currentEndDate, previousLongestStreak, previousLongestStartDate, previousLongestEndDate } = getStreakStats();

  const hasPreviousLongestStreak = Number(previousLongestStreak) > 0 && previousLongestStartDate && previousLongestEndDate;

  return (
    <div className={styles.stats}>
      <StreakItem
        icon={Flame}
        value={currentStreak}
        label='Current streak'
        startDate={currentStartDate}
        endDate={currentEndDate}
      />

      {hasPreviousLongestStreak && (
        <StreakItem
          icon={Trophy}
          value={previousLongestStreak}
          label='Previous longest streak'
          startDate={previousLongestStartDate}
          endDate={previousLongestEndDate}
        />
      )}
    </div>
  );
}
