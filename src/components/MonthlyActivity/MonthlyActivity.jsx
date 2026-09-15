// src/components/MonthlyActivity/MonthlyActivity.jsx

"use client";

import styles from "./MonthlyActivity.module.css";

/* --------------------------------------------------
   Configuration
-------------------------------------------------- */

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/* --------------------------------------------------
   Get Activity Level
-------------------------------------------------- */

function getActivityLevel(questions) {
  if (!questions || questions <= 0) {
    return 0;
  }

  if (questions <= 5) {
    return 1;
  }

  if (questions <= 10) {
    return 2;
  }

  if (questions <= 20) {
    return 3;
  }

  return 4;
}

/* --------------------------------------------------
   Format Date
-------------------------------------------------- */

function formatDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/* --------------------------------------------------
   Build Activity Grid
-------------------------------------------------- */

function buildActivityGrid(data) {
  if (!Array.isArray(data) || data.length === 0) {
    return [];
  }

  const firstDate = new Date(`${data[0].date}T00:00:00`);

  if (Number.isNaN(firstDate.getTime())) {
    return [];
  }

  const startDay = (firstDate.getDay() + 6) % 7;

  const cells = [];

  for (let index = 0; index < startDay; index += 1) {
    cells.push(null);
  }

  data.forEach((item) => {
    cells.push(item);
  });

  return cells;
}

/* --------------------------------------------------
   Monthly Activity
-------------------------------------------------- */

export default function MonthlyActivity({ data = [] }) {
  const cells = buildActivityGrid(data);

  if (cells.length === 0) {
    return <div className={styles.empty}>No activity yet</div>;
  }

  return (
    <div className={styles.activity}>
      <div className={styles.dayLabels}>
        {DAY_LABELS.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className={styles.grid}>
        {cells.map((item, index) => {
          if (!item) {
            return (
              <span
                key={`empty-${index}`}
                className={styles.emptyCell}
                aria-hidden='true'
              />
            );
          }

          const level = getActivityLevel(item.questions);

          return (
            <span
              key={item.date}
              className={styles.cell}
              data-level={level}
              title={`${formatDate(item.date)} — ${item.questions} questions`}
              aria-label={`${formatDate(item.date)} — ${item.questions} questions`}
            />
          );
        })}
      </div>
    </div>
  );
}
