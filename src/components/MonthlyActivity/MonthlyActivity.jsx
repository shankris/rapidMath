/* src/components/MonthlyActivity/MonthlyActivity.jsx */

"use client";

import { useMemo, useState } from "react";
import styles from "./MonthlyActivity.module.css";

/* --------------------------------------------------
Configuration
-------------------------------------------------- */

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const ACTIVITY_THRESHOLDS = [40, 80, 120, 160];

/* --------------------------------------------------
Get Today Date Key
-------------------------------------------------- */

function getTodayDateKey() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/* --------------------------------------------------
Get Activity Level
-------------------------------------------------- */

function getActivityLevel(questions) {
  const count = Number(questions);

  if (!Number.isFinite(count) || count <= 0) {
    return 0;
  }

  if (count <= ACTIVITY_THRESHOLDS[0]) {
    return 1;
  }

  if (count <= ACTIVITY_THRESHOLDS[1]) {
    return 2;
  }

  if (count <= ACTIVITY_THRESHOLDS[2]) {
    return 3;
  }

  if (count <= ACTIVITY_THRESHOLDS[3]) {
    return 4;
  }

  return 5;
}

/* --------------------------------------------------
Parse Date Key
-------------------------------------------------- */

function parseDateKey(dateString) {
  const date = new Date(`${dateString}T00:00:00`);

  return Number.isNaN(date.getTime()) ? null : date;
}

/* --------------------------------------------------
Format Date
-------------------------------------------------- */

/* src/components/MonthlyActivity/MonthlyActivity.jsx */

/* --------------------------------------------------
Format Date
-------------------------------------------------- */

function formatDate(dateString) {
  const date = parseDateKey(dateString);

  if (!date) {
    return dateString;
  }

  return date.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* --------------------------------------------------
Get Day Number
-------------------------------------------------- */

function getDayNumber(dateString) {
  const date = parseDateKey(dateString);

  if (!date) {
    return "";
  }

  return date.getDate();
}

/* --------------------------------------------------
Get Date Difference
-------------------------------------------------- */

function getDateDifference(dateString) {
  const date = parseDateKey(dateString);
  const today = parseDateKey(getTodayDateKey());

  if (!date || !today) {
    return null;
  }

  const difference = today.getTime() - date.getTime();

  return Math.round(difference / (24 * 60 * 60 * 1000));
}

/* --------------------------------------------------
Get Relative Date Label
-------------------------------------------------- */

function getRelativeDateLabel(dateString) {
  const difference = getDateDifference(dateString);

  if (difference === null) {
    return "";
  }

  if (difference === 0) {
    return "Today";
  }

  if (difference === 1) {
    return "Yesterday";
  }

  if (difference === 2) {
    return "2 days ago";
  }

  if (difference < 7) {
    return `${difference} days ago`;
  }

  if (difference < 14) {
    return "Last week";
  }

  const weeks = Math.floor(difference / 7);

  if (weeks === 2) {
    return "2 weeks ago";
  }

  if (weeks < 5) {
    return `${weeks} weeks ago`;
  }

  const months = Math.floor(difference / 30);

  if (months <= 1) {
    return "1 month ago";
  }

  return `${months} months ago`;
}

/* --------------------------------------------------
Build Calendar Grid
-------------------------------------------------- */

function buildCalendarGrid(data) {
  if (!Array.isArray(data) || data.length === 0) {
    return [];
  }

  const firstDate = parseDateKey(data[0].date);

  if (!firstDate) {
    return [];
  }

  /* ----------------------------------------------
Monday = 0 ... Sunday = 6
---------------------------------------------- */

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
Group Selected Day Details
-------------------------------------------------- */

function groupDetails(details) {
  if (!Array.isArray(details)) {
    return [];
  }

  const groups = new Map();

  details.forEach((item) => {
    const operation = item.operation ?? "Other";

    if (!groups.has(operation)) {
      groups.set(operation, []);
    }

    groups.get(operation).push(item);
  });

  return Array.from(groups.entries()).map(([operation, levels]) => ({
    operation,
    levels,
  }));
}

/* --------------------------------------------------
Monthly Activity
-------------------------------------------------- */

export default function MonthlyActivity({ data = [], details = {} }) {
  const cells = useMemo(() => buildCalendarGrid(data), [data]);

  const today = getTodayDateKey();

  const [selectedDate, setSelectedDate] = useState(today);

  if (cells.length === 0) {
    return <div className={styles.empty}>No activity yet </div>;
  }

  const selectedDetails = selectedDate && details[selectedDate] ? details[selectedDate] : [];

  const groupedDetails = groupDetails(selectedDetails);

  const selectedActivity = data.find((item) => item.date === selectedDate) ?? null;

  const selectedDateLabel = selectedDate ? formatDate(selectedDate) : "Select a day";

  const relativeDateLabel = selectedDate ? getRelativeDateLabel(selectedDate) : "";

  return (
    <div className={styles.activity}>
      {/* ------------------------------------------------
Calendar
------------------------------------------------ */}

      <div className={styles.calendar}>
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

            const isSelected = item.date === selectedDate;

            return (
              <button
                key={item.date}
                type='button'
                className={`${styles.cell} ${isSelected ? styles.selected : ""}`}
                data-level={level}
                onClick={() => setSelectedDate(item.date)}
                aria-label={`${formatDate(item.date)} — ${item.questions} questions`}
                aria-pressed={isSelected}
              >
                <span className={styles.dayNumber}>{getDayNumber(item.date)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------
     Selected Day Details
  ------------------------------------------------ */}

      <div className={styles.details}>
        <div className={styles.detailsHeader}>
          <h3>
            {selectedDateLabel}

            {relativeDateLabel && <span className={styles.relativeDate}>{relativeDateLabel}</span>}
          </h3>

          {selectedActivity && <span className={styles.questionCount}>{selectedActivity.questions} Qs</span>}
        </div>

        {groupedDetails.length > 0 ? (
          <div className={styles.detailList}>
            {groupedDetails.map((group) => (
              <section
                key={group.operation}
                className={styles.operationGroup}
              >
                <h4 className={styles.operationName}>{group.operation}</h4>

                <table className={styles.detailTable}>
                  <thead>
                    <tr>
                      <th scope='col'>Level</th>
                      <th scope='col'>Qs</th>
                      <th scope='col'>Accuracy</th>
                      <th scope='col'>Avg.</th>
                    </tr>
                  </thead>

                  <tbody>
                    {group.levels.map((item, index) => (
                      <tr key={`${item.operation}-${item.level}-${index}`}>
                        <td>Level {item.level}</td>

                        <td>{item.questions}</td>

                        <td>{item.accuracy !== undefined && item.accuracy !== null ? `${item.accuracy}%` : "—"}</td>

                        <td>{item.reactionTime !== undefined && item.reactionTime !== null ? `${Number(item.reactionTime).toFixed(1)}s` : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            ))}
          </div>
        ) : (
          <div className={styles.noActivity}>No practice on this day.</div>
        )}
      </div>
    </div>
  );
}
