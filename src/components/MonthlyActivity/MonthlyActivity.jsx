/* src/components/MonthlyActivity/MonthlyActivity.jsx */

"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import styles from "./MonthlyActivity.module.css";

/* --------------------------------------------------
Configuration
-------------------------------------------------- */

const DAY_LABELS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

const ACTIVITY_DOTS = [
  { max: 4, dots: 1 },
  { max: 8, dots: 2 },
  { max: 12, dots: 3 },
  { max: 16, dots: 4 },
];

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
Parse Date Key
-------------------------------------------------- */

function parseDateKey(dateString) {
  if (!dateString) {
    return null;
  }

  const date = new Date(`${dateString}T00:00:00`);

  return Number.isNaN(date.getTime()) ? null : date;
}

/* --------------------------------------------------
Format Date
-------------------------------------------------- */

function formatDate(dateString, locale) {
  const date = parseDateKey(dateString);

  if (!date) {
    return dateString;
  }

  return date.toLocaleDateString(locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* --------------------------------------------------
Format Month
-------------------------------------------------- */

function formatMonth(date, locale) {
  return date.toLocaleDateString(locale, {
    month: "long",
    year: "numeric",
  });
}

/* --------------------------------------------------
Get Month Key
-------------------------------------------------- */

function getMonthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

/* --------------------------------------------------
Get Month Start
-------------------------------------------------- */

function getMonthStart(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/* --------------------------------------------------
Get Month End
-------------------------------------------------- */

function getMonthEnd(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

/* --------------------------------------------------
Move Month
-------------------------------------------------- */

function moveMonth(date, amount) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
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
Get Activity Dots
-------------------------------------------------- */

function getActivityDots(questions) {
  const count = Number(questions);

  if (!Number.isFinite(count) || count <= 0) {
    return 0;
  }

  const threshold = ACTIVITY_DOTS.find((item) => count <= item.max);

  return threshold?.dots ?? 5;
}

/* --------------------------------------------------
Build Calendar Grid
-------------------------------------------------- */

function buildCalendarGrid(monthDate, activityMap) {
  const firstDate = getMonthStart(monthDate);
  const lastDate = getMonthEnd(monthDate);

  /* ----------------------------------------------
     Monday = 0 ... Sunday = 6
  ---------------------------------------------- */

  const startDay = (firstDate.getDay() + 6) % 7;

  const cells = [];

  for (let index = 0; index < startDay; index += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= lastDate.getDate(); day += 1) {
    const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const dayNumber = String(date.getDate()).padStart(2, "0");

    const dateKey = `${year}-${month}-${dayNumber}`;

    cells.push(
      activityMap.get(dateKey) ?? {
        date: dateKey,
        questions: 0,
        correct: 0,
      },
    );
  }

  return cells;
}

/* --------------------------------------------------
Group Selected Day Details
-------------------------------------------------- */

function groupDetails(details, translate) {
  if (!Array.isArray(details)) {
    return [];
  }

  const groups = new Map();

  details.forEach((item) => {
    const operation = item.operation ?? translate("monthlyActivity.other");

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
   Get 30-Day Average Reaction Time

   Excludes the current date.

   The average is weighted by the number of
   questions answered on each day.
-------------------------------------------------- */

function get30DayAverage(details, operation, level, today) {
  if (!details || typeof details !== "object") {
    return null;
  }

  const todayDate = parseDateKey(today);

  if (!todayDate) {
    return null;
  }

  const startDate = new Date(todayDate);
  startDate.setDate(startDate.getDate() - 30);

  let totalTime = 0;
  let totalQuestions = 0;

  Object.entries(details).forEach(([date, dayDetails]) => {
    const dateValue = parseDateKey(date);

    if (!dateValue || date === today) {
      return;
    }

    if (dateValue < startDate || dateValue >= todayDate) {
      return;
    }

    if (!Array.isArray(dayDetails)) {
      return;
    }

    dayDetails.forEach((item) => {
      if (item.operation !== operation || Number(item.level) !== Number(level)) {
        return;
      }

      const reactionTime = Number(item.reactionTime);
      const questions = Number(item.questions);

      if (!Number.isFinite(reactionTime) || reactionTime <= 0 || !Number.isFinite(questions) || questions <= 0) {
        return;
      }

      totalTime += reactionTime * questions;
      totalQuestions += questions;
    });
  });

  if (totalQuestions === 0) {
    return null;
  }

  return Number((totalTime / totalQuestions).toFixed(1));
}

/* --------------------------------------------------
Monthly Activity
-------------------------------------------------- */

export default function MonthlyActivity({ data = [], details = {} }) {
  const t = useTranslations("Graphs");
  const locale = useLocale();

  const today = getTodayDateKey();

  const activityMap = useMemo(() => new Map(data.map((item) => [item.date, item])), [data]);

  const earliestDate = data[0]?.date ?? null;
  const earliestMonth = earliestDate ? getMonthStart(parseDateKey(earliestDate)) : null;

  const currentMonth = getMonthStart(parseDateKey(today));

  const [visibleMonth, setVisibleMonth] = useState(currentMonth);

  const [selectedDate, setSelectedDate] = useState(today);

  const cells = useMemo(() => buildCalendarGrid(visibleMonth, activityMap), [visibleMonth, activityMap]);

  const earliestMonthKey = earliestMonth ? getMonthKey(earliestMonth) : null;

  const visibleMonthKey = getMonthKey(visibleMonth);
  const currentMonthKey = getMonthKey(currentMonth);

  const isFirstAvailableMonth = earliestMonthKey === visibleMonthKey;

  const isCurrentMonth = currentMonthKey === visibleMonthKey;

  const selectedActivity = activityMap.get(selectedDate) ?? null;

  const selectedDetails = selectedDate && details[selectedDate] ? details[selectedDate] : [];

  const groupedDetails = groupDetails(selectedDetails, t);

  const selectedDateLabel = selectedDate ? formatDate(selectedDate, locale) : t("monthlyActivity.selectDay");

  if (!earliestDate) {
    return <div className={styles.empty}>{t("monthlyActivity.noActivity")}</div>;
  }

  /* --------------------------------------------------
  Month Navigation
  -------------------------------------------------- */

  function handlePreviousMonth() {
    if (isFirstAvailableMonth) {
      return;
    }

    const previousMonth = moveMonth(visibleMonth, -1);

    setVisibleMonth(previousMonth);

    const previousMonthKey = getMonthKey(previousMonth);

    const firstAvailableDate = data.find((item) => item.date.startsWith(previousMonthKey));

    if (firstAvailableDate) {
      setSelectedDate(firstAvailableDate.date);
    }
  }

  function handleNextMonth() {
    if (isCurrentMonth) {
      return;
    }

    const nextMonth = moveMonth(visibleMonth, 1);

    setVisibleMonth(nextMonth);

    const nextMonthKey = getMonthKey(nextMonth);

    const nextMonthData = data.filter((item) => item.date.startsWith(nextMonthKey));

    const selectedNextDate = nextMonthData.find((item) => item.questions > 0) ?? nextMonthData[0];

    if (selectedNextDate) {
      setSelectedDate(selectedNextDate.date);
    }
  }

  return (
    <div className={styles.activity}>
      {/* ------------------------------------------------
      Calendar
      ------------------------------------------------ */}

      <div className={styles.calendar}>
        <div className={styles.calendarHeader}>
          <button
            type='button'
            className={styles.monthButton}
            onClick={handlePreviousMonth}
            disabled={isFirstAvailableMonth}
            aria-label={t("monthlyActivity.previousMonth")}
          >
            <ChevronLeft
              size={18}
              strokeWidth={1.8}
              aria-hidden='true'
            />
          </button>

          <h3 className={styles.monthTitle}>{formatMonth(visibleMonth, locale)}</h3>

          <button
            type='button'
            className={styles.monthButton}
            onClick={handleNextMonth}
            disabled={isCurrentMonth}
            aria-label={t("monthlyActivity.nextMonth")}
          >
            <ChevronRight
              size={18}
              strokeWidth={1.8}
              aria-hidden='true'
            />
          </button>
        </div>

        <div className={styles.dayLabels}>
          {DAY_LABELS.map((day) => (
            <span key={day}>{t(`monthlyActivity.days.${day}`)}</span>
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

            const dots = getActivityDots(item.questions);

            const isSelected = item.date === selectedDate;

            const isToday = item.date === today;

            return (
              <button
                key={item.date}
                type='button'
                className={`${styles.cell} ${isSelected ? styles.selected : ""} ${isToday ? styles.today : ""}`}
                onClick={() => setSelectedDate(item.date)}
                aria-label={`${formatDate(item.date, locale)} — ${item.questions} ${t("monthlyActivity.questions")}`}
                aria-pressed={isSelected}
              >
                <span className={styles.dayNumber}>{getDayNumber(item.date)}</span>

                {item.questions > 0 && (
                  <span
                    className={styles.activityDots}
                    aria-hidden='true'
                  >
                    {item.questions <= 12 ? (
                      Array.from(
                        {
                          length: Math.ceil(item.questions / 4),
                        },
                        (_, dotIndex) => (
                          <span
                            key={dotIndex}
                            className={styles.dot}
                          />
                        ),
                      )
                    ) : (
                      <>
                        <span className={styles.dot} />
                        <span className={styles.activityCount}>{item.questions}</span>
                      </>
                    )}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {isFirstAvailableMonth && (
          <div className={styles.availabilityNote}>
            {t("monthlyActivity.earliestAvailable", {
              date: formatDate(earliestDate, locale),
            })}
          </div>
        )}
      </div>

      {/* ------------------------------------------------
      Selected Day Details
      ------------------------------------------------ */}

      <div className={styles.details}>
        <div className={styles.detailsHeader}>
          <div>
            <h3>{selectedDateLabel}</h3>
          </div>

          {selectedActivity && selectedActivity.questions > 0 && (
            <span className={styles.questionCount}>
              {selectedActivity.questions} {t("monthlyActivity.questionsShort")}
            </span>
          )}
        </div>

        {groupedDetails.length > 0 ? (
          <>
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
                        <th scope='col'>{t("monthlyActivity.level")}</th>
                        <th scope='col'>{t("monthlyActivity.questionsShort")}</th>
                        <th scope='col'>{t("monthlyActivity.accuracy")}</th>
                        <th scope='col'>Day Avg.</th>
                        <th scope='col'>30 Day Avg.</th>
                      </tr>
                    </thead>

                    <tbody>
                      {group.levels.map((item, index) => {
                        const thirtyDayAverage = get30DayAverage(details, item.operation, item.level, today);

                        return (
                          <tr key={`${item.operation}-${item.level}-${index}`}>
                            <td>
                              {item.practiceUrl ? (
                                <Link
                                  href={`/${locale}/${item.practiceUrl}`}
                                  className={styles.levelLink}
                                >
                                  {t("monthlyActivity.levelValue", {
                                    level: item.level,
                                  })}
                                </Link>
                              ) : (
                                t("monthlyActivity.levelValue", {
                                  level: item.level,
                                })
                              )}
                            </td>

                            <td>{item.questions}</td>

                            <td>{item.accuracy !== undefined && item.accuracy !== null ? `${item.accuracy}%` : "—"}</td>

                            <td>{item.reactionTime !== undefined && item.reactionTime !== null ? `${Number(item.reactionTime).toFixed(1)}s` : "—"}</td>

                            <td>{thirtyDayAverage !== null ? `${Number(thirtyDayAverage).toFixed(1)}s` : "—"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </section>
              ))}
            </div>

            <div className={styles.averageNote}>30 Day Avg. shows the trailing 30 day Avg., including today.</div>
          </>
        ) : (
          <div className={styles.noActivity}>{t("monthlyActivity.noPractice")}</div>
        )}
      </div>
    </div>
  );
}
