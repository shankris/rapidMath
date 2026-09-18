"use client";

/* src/components/StreakStats/StreakStats.jsx */

import { useEffect, useState } from "react";
import { Flame, Trophy } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { getStreakStats } from "@/lib/stats/streak";
import styles from "./StreakStats.module.css";

/* --------------------------------------------------
Format Streak Date Range
-------------------------------------------------- */

function formatStreakDateRange(startDate, endDate, locale) {
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

  const startFormatter = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: startYear !== endYear ? "numeric" : undefined,
  });

  const endFormatter = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return `${startFormatter.format(start)} – ${endFormatter.format(end)}`;
}

/* --------------------------------------------------
Streak Item
-------------------------------------------------- */

function StreakItem({ icon: Icon, value, label, startDate, endDate, locale, daysLabel }) {
  const dateRange = formatStreakDateRange(startDate, endDate, locale);

  return (
    <div className={styles.stat}>
      {" "}
      <div className={styles.icon}>
        {" "}
        <Icon
          size={36}
          strokeWidth={1.8}
          aria-hidden='true'
        />{" "}
      </div>
      <div className={styles.content}>
        <strong>
          {value} <span>{daysLabel}</span>
        </strong>

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
  const [streakStats, setStreakStats] = useState(null);

  const t = useTranslations("Graphs");
  const locale = useLocale();

  /* --------------------------------------------------
Load Streak Data After Hydration
-------------------------------------------------- */

  useEffect(() => {
    setStreakStats(getStreakStats());
  }, []);

  /*
Keep the server render and initial client render
identical.


 Streak data is loaded from localStorage only after
 hydration has completed.


*/

  if (!streakStats) {
    return null;
  }

  const { currentStreak, currentStartDate, currentEndDate, previousLongestStreak, previousLongestStartDate, previousLongestEndDate } = streakStats;

  const hasPreviousLongestStreak = Number(previousLongestStreak) > 0 && previousLongestStartDate && previousLongestEndDate;

  return (
    <div className={styles.stats}>
      <StreakItem
        icon={Flame}
        value={currentStreak}
        label={t("streakStats.current")}
        startDate={currentStartDate}
        endDate={currentEndDate}
        locale={locale}
        daysLabel={t("streakStats.days")}
      />

      {hasPreviousLongestStreak && (
        <StreakItem
          icon={Trophy}
          value={previousLongestStreak}
          label={t("streakStats.previousLongest")}
          startDate={previousLongestStartDate}
          endDate={previousLongestEndDate}
          locale={locale}
          daysLabel={t("streakStats.days")}
        />
      )}
    </div>
  );
}
