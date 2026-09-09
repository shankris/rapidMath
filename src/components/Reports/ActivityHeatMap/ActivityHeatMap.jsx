"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { getDailyActivity } from "@/lib/storage/dailyActivity";
import styles from "./ActivityHeatMap.module.css";

/* --------------------------------------------------
Constants
-------------------------------------------------- */

const DAYS_IN_WEEK = 7;
const WEEKS_IN_YEAR = 53;

/* --------------------------------------------------
Date Helpers
-------------------------------------------------- */

function startOfDay(date) {
  const result = new Date(date);

  result.setHours(0, 0, 0, 0);

  return result;
}

function startOfWeek(date) {
  const result = startOfDay(date);

  result.setDate(result.getDate() - result.getDay());

  return result;
}

function addDays(date, days) {
  const result = new Date(date);

  result.setDate(result.getDate() + days);

  return result;
}

function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/* --------------------------------------------------
Activity Level
-------------------------------------------------- */

function getActivityLevel(questions) {
  if (!questions) {
    return 0;
  }

  if (questions <= 20) {
    return 1;
  }

  if (questions <= 40) {
    return 2;
  }

  if (questions <= 60) {
    return 3;
  }

  return 4;
}

/* --------------------------------------------------
Build Heat Map
-------------------------------------------------- */

function buildHeatMap(activity) {
  const today = startOfDay(new Date());
  const currentWeekStart = startOfWeek(today);

  const firstWeekStart = addDays(currentWeekStart, -(WEEKS_IN_YEAR - 1) * DAYS_IN_WEEK);

  const activityMap = new Map(activity.map((item) => [item.date, item]));

  return Array.from({ length: WEEKS_IN_YEAR }, (_, weekIndex) => {
    const weekStart = addDays(firstWeekStart, weekIndex * DAYS_IN_WEEK);

    return Array.from({ length: DAYS_IN_WEEK }, (_, dayIndex) => {
      const date = addDays(weekStart, dayIndex);
      const dateKey = getDateKey(date);
      const dayActivity = activityMap.get(dateKey);

      return {
        date,
        dateKey,
        activity: dayActivity || null,
        level: getActivityLevel(dayActivity?.questions),
      };
    });
  });
}

/* --------------------------------------------------
Build Month Labels
-------------------------------------------------- */

function buildMonthLabels(heatMap) {
  let previousMonth = null;

  return heatMap.map((week, weekIndex) => {
    const weekStart = week[0].date;

    const month = weekStart.toLocaleString("en-US", {
      month: "short",
    });

    const monthNumber = weekStart.getMonth();

    const showLabel = weekIndex === 0 || monthNumber !== previousMonth;

    previousMonth = monthNumber;

    return {
      weekIndex,
      label: showLabel ? month : "",
    };
  });
}

/* --------------------------------------------------
Format Tooltip Date
-------------------------------------------------- */

function formatTooltipDate(date) {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/* --------------------------------------------------
Calculate Accuracy
-------------------------------------------------- */

function getAccuracy(activity) {
  if (!activity?.questions) {
    return 0;
  }

  return (activity.correct / activity.questions) * 100;
}

/* --------------------------------------------------
Activity Tooltip
-------------------------------------------------- */

function ActivityTooltip({ day, position }) {
  const activity = day.activity;
  const accuracy = getAccuracy(activity);

  return (
    <motion.div
      className={styles.tooltip}
      style={{
        left: position.x,
        top: position.y,
      }}
      initial={{
        opacity: 0,
        y: 4,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: 4,
      }}
      transition={{
        duration: 0.12,
      }}
    >
      {" "}
      <div className={styles.tooltipDate}>{formatTooltipDate(day.date)} </div>
      {activity ? (
        <div className={styles.tooltipStats}>
          <div className={styles.tooltipRow}>
            <span>Questions</span>
            <strong>{activity.questions}</strong>
          </div>

          <div className={styles.tooltipRow}>
            <span>Correct</span>
            <strong>{activity.correct}</strong>
          </div>

          <div className={styles.tooltipRow}>
            <span>Accuracy</span>
            <strong>{accuracy.toFixed(1)}%</strong>
          </div>

          <div className={styles.tooltipRow}>
            <span>Tests</span>
            <strong>{activity.tests}</strong>
          </div>
        </div>
      ) : (
        <div className={styles.tooltipEmpty}>No activity</div>
      )}
    </motion.div>
  );
}

/* --------------------------------------------------
Activity Heat Map
-------------------------------------------------- */

export default function ActivityHeatMap() {
  const [heatMap, setHeatMap] = useState([]);
  const [hoveredDay, setHoveredDay] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({
    x: 0,
    y: 0,
  });

  /* ------------------------------------------------
Load Activity
------------------------------------------------ */

  useEffect(() => {
    const activity = getDailyActivity();

    setHeatMap(buildHeatMap(activity));
  }, []);

  /* ------------------------------------------------
Handle Day Hover
------------------------------------------------ */

  function handleDayEnter(event, day) {
    const rect = event.currentTarget.getBoundingClientRect();

    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
    });

    setHoveredDay(day);
  }

  function handleDayLeave() {
    setHoveredDay(null);
  }

  /* ------------------------------------------------
Render
------------------------------------------------ */

  if (!heatMap.length) {
    return (
      <div className={styles.container}>
        {" "}
        <div className={styles.grid} />{" "}
      </div>
    );
  }

  const monthLabels = buildMonthLabels(heatMap);

  return (
    <div className={styles.container}>
      {" "}
      <div className={styles.heatMap}>
        {/* ------------------------------------------------
Month Labels
------------------------------------------------ */}

        <div className={styles.monthLabels}>
          <div className={styles.labelSpacer} />

          <div className={styles.monthGrid}>
            {monthLabels.map((item) => (
              <span
                key={`month-${item.weekIndex}`}
                className={styles.monthLabel}
              >
                {item.label}
              </span>
            ))}
          </div>
        </div>

        {/* ------------------------------------------------
        Map Body
    ------------------------------------------------ */}

        <div className={styles.mapBody}>
          <div className={styles.dayLabels}>
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
          </div>

          <div className={styles.grid}>
            {heatMap.map((week, weekIndex) => (
              <div
                key={`week-${weekIndex}`}
                className={styles.week}
              >
                {week.map((day) => (
                  <div
                    key={day.dateKey}
                    className={`${styles.day} ${styles[`level${day.level}`]}`}
                    onMouseEnter={(event) => handleDayEnter(event, day)}
                    onMouseLeave={handleDayLeave}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* --------------------------------------------------
      Tooltip
  -------------------------------------------------- */}
      <AnimatePresence>
        {hoveredDay && (
          <ActivityTooltip
            key={hoveredDay.dateKey}
            day={hoveredDay}
            position={tooltipPosition}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
