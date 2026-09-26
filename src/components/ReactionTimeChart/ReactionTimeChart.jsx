"use client";

/* src/components/ReactionTimeChart/ReactionTimeChart.jsx */

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { getQuizAttempts } from "@/lib/storage/quizHistory";
import { getReactionTimeTrend } from "@/lib/stats/reactionTime";

import styles from "@/components/Dashboard/Dashboard.module.css";

/* --------------------------------------------------
   Operation Names
-------------------------------------------------- */

const OPERATION_NAMES = {
  add: "Addition",
  sub: "Subtraction",
  mul: "Multiplication",
  div: "Division",
  mixedOperations: "Mixed Operations",
  missingNumber: "Missing Number",
  comparison: "Comparison",
  estimation: "Estimation",
  sequences: "Sequences & Progressions",
  fractions: "Fractions",
  percentages: "Percentages",
  powersRoots: "Powers & Roots",
};

/* --------------------------------------------------
   Get Local Date Key
-------------------------------------------------- */

function getLocalDateKey(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return null;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/* --------------------------------------------------
   Get Last 30 Days
-------------------------------------------------- */

function getLast30Days() {
  const dates = [];

  for (let index = 29; index >= 0; index -= 1) {
    const date = new Date();

    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - index);

    const dateKey = getLocalDateKey(date);

    if (dateKey) {
      dates.push(dateKey);
    }
  }

  return dates;
}

/* --------------------------------------------------
   Get Available Operations
-------------------------------------------------- */

function getAvailableOperations(attempts) {
  const last30Days = new Set(getLast30Days());
  const operations = new Set();

  attempts.forEach((attempt) => {
    if (!attempt?.operation || !attempt.startedAt || !Array.isArray(attempt.questions)) {
      return;
    }

    const dateKey = getLocalDateKey(new Date(attempt.startedAt));

    if (!last30Days.has(dateKey)) {
      return;
    }

    const hasAnsweredQuestion = attempt.questions.some((question) => question && question.selectedAnswer !== undefined && question.selectedAnswer !== null);

    if (hasAnsweredQuestion) {
      operations.add(attempt.operation);
    }
  });

  return Array.from(operations).sort((a, b) => {
    const nameA = OPERATION_NAMES[a] ?? a;
    const nameB = OPERATION_NAMES[b] ?? b;

    return nameA.localeCompare(nameB);
  });
}

/* --------------------------------------------------
   Get Available Levels
-------------------------------------------------- */

function getAvailableLevels(attempts, operation) {
  const last30Days = new Set(getLast30Days());
  const levels = new Set();

  attempts.forEach((attempt) => {
    if (!attempt?.operation || attempt.operation !== operation || attempt.level === undefined || !attempt.startedAt || !Array.isArray(attempt.questions)) {
      return;
    }

    const dateKey = getLocalDateKey(new Date(attempt.startedAt));

    if (!last30Days.has(dateKey)) {
      return;
    }

    const hasAnsweredQuestion = attempt.questions.some((question) => question && question.selectedAnswer !== undefined && question.selectedAnswer !== null);

    if (hasAnsweredQuestion) {
      levels.add(Number(attempt.level));
    }
  });

  return Array.from(levels).sort((a, b) => a - b);
}

/* --------------------------------------------------
   Format Date Label
-------------------------------------------------- */

function formatDateLabel(dateKey, locale) {
  const date = new Date(`${dateKey}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateKey;
  }

  return date.toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
  });
}

/* --------------------------------------------------
   Format Reaction Time
-------------------------------------------------- */

function formatReactionTime(value) {
  if (!Number.isFinite(value)) {
    return "—";
  }

  return `${value.toFixed(2)}s`;
}

/* --------------------------------------------------
   Get Level Line Color
-------------------------------------------------- */

function getLevelColor(level) {
  const colors = ["var(--accentColor)", "#0891b2", "#16a34a", "#d97706", "#9333ea", "#dc2626", "#0f766e", "#7c3aed", "#be123c", "#475569"];

  return colors[(Number(level) - 1) % colors.length];
}

/* --------------------------------------------------
   Custom Tooltip
-------------------------------------------------- */

function ReactionTimeTooltip({ active, payload, label, translate, locale, levels, operation }) {
  if (!active || !payload?.length) {
    return null;
  }

  const visiblePayload = payload.filter((item) => levels.includes(Number(item.dataKey.replace("level", ""))) && Number.isFinite(item.value)).sort((a, b) => Number(a.dataKey.replace("level", "")) - Number(b.dataKey.replace("level", "")));

  if (visiblePayload.length === 0) {
    return null;
  }

  return (
    <div className={styles.chartTooltip}>
      <strong>{formatDateLabel(label, locale)}</strong>

      <div className={styles.chartTooltipOperation}>{OPERATION_NAMES[operation] ?? operation}</div>

      <div className={styles.chartTooltipLevels}>
        {visiblePayload.map((item) => {
          const level = Number(item.dataKey.replace("level", ""));

          return (
            <div
              key={item.dataKey}
              className={styles.chartTooltipLevel}
            >
              <span className={styles.chartTooltipLabel}>{translate("levels.level", { level })}</span>

              <span className={styles.chartTooltipValue}>{formatReactionTime(item.value)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* --------------------------------------------------
   Get Y Axis Domain
-------------------------------------------------- */

function getReactionTimeDomain(data) {
  const values = [];

  data.forEach((day) => {
    Object.keys(day).forEach((key) => {
      if (key.startsWith("level") && Number.isFinite(day[key])) {
        values.push(day[key]);
      }
    });
  });

  if (values.length === 0) {
    return ["auto", "auto"];
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;

  /* Keep a small amount of breathing room around the data. */
  const padding = Math.max(range * 0.1, 0.25);

  return [Math.max(0, min - padding), max + padding];
}

/* --------------------------------------------------
   Reaction Time Chart
-------------------------------------------------- */

export default function ReactionTimeChart({ operation: selectedOperation = "", onSelectionChange, onActiveDayCountChange }) {
  const t = useTranslations("Graphs");
  const locale = useLocale();

  const [attempts, setAttempts] = useState([]);
  const [operation, setOperation] = useState(selectedOperation);
  const [levels, setLevels] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [overallAverage, setOverallAverage] = useState(null);

  /* ------------------------------------------------
     Load Attempts
  ------------------------------------------------ */

  useEffect(() => {
    setAttempts(getQuizAttempts());
  }, []);

  /* ------------------------------------------------
     Available Operations
  ------------------------------------------------ */

  const operations = useMemo(() => getAvailableOperations(attempts), [attempts]);

  /* ------------------------------------------------
     Sync Selected Operation From Dashboard
  ------------------------------------------------ */

  useEffect(() => {
    if (selectedOperation && operations.includes(selectedOperation)) {
      setOperation(selectedOperation);
    }
  }, [selectedOperation, operations]);

  /* ------------------------------------------------
     Set Initial Operation
  ------------------------------------------------ */

  useEffect(() => {
    if (operations.length === 0) {
      setOperation("");
      return;
    }

    if (!operations.includes(operation)) {
      setOperation(operations[0]);
    }
  }, [operations, operation]);

  /* ------------------------------------------------
     Available Levels
  ------------------------------------------------ */

  useEffect(() => {
    setLevels(getAvailableLevels(attempts, operation));
  }, [attempts, operation]);

  /* ------------------------------------------------
     Report Operation Selection
  ------------------------------------------------ */

  useEffect(() => {
    if (!operation || !onSelectionChange) {
      return;
    }

    onSelectionChange({
      operation,
    });
  }, [operation, onSelectionChange]);

  /* ------------------------------------------------
     Build Chart Data
  ------------------------------------------------ */

  useEffect(() => {
    if (!operation || levels.length === 0) {
      setChartData([]);
      setOverallAverage(null);

      if (onActiveDayCountChange) {
        onActiveDayCountChange(0);
      }

      return;
    }

    const days = getLast30Days();

    const levelResults = levels
      .map((level) => ({
        level,
        result: getReactionTimeTrend(operation, level),
      }))
      .filter(({ result }) => result && result.startDate && result.endDate && Array.isArray(result.days));

    if (levelResults.length === 0) {
      setChartData([]);
      setOverallAverage(null);

      if (onActiveDayCountChange) {
        onActiveDayCountChange(0);
      }

      return;
    }

    /* ----------------------------------------------
       Build Combined Daily Data

       Every date in the last 30 days gets one row.
       Each available level contributes its own value.
    ---------------------------------------------- */

    const combinedDays = days.map((date) => {
      const day = {
        date,
      };

      levelResults.forEach(({ level, result }) => {
        const resultDay = result.days.find((item) => item.date === date);

        day[`level${level}`] = resultDay?.average ?? null;
      });

      return day;
    });

    /* ----------------------------------------------
       Remove Leading Empty Days

       Find the first day containing any reaction-time
       value across all levels.
    ---------------------------------------------- */

    const firstActiveIndex = combinedDays.findIndex((day) => levels.some((level) => Number.isFinite(day[`level${level}`])));

    /* ----------------------------------------------
       Remove Trailing Empty Days
    ---------------------------------------------- */

    let lastActiveIndex = -1;

    for (let index = combinedDays.length - 1; index >= 0; index -= 1) {
      const hasActivity = levels.some((level) => Number.isFinite(combinedDays[index][`level${level}`]));

      if (hasActivity) {
        lastActiveIndex = index;
        break;
      }
    }

    if (firstActiveIndex === -1 || lastActiveIndex === -1) {
      setChartData([]);
      setOverallAverage(null);

      if (onActiveDayCountChange) {
        onActiveDayCountChange(0);
      }

      return;
    }

    const visibleDays = combinedDays.slice(firstActiveIndex, lastActiveIndex + 1);

    setChartData(visibleDays);

    /* ----------------------------------------------
       Overall Operation Average

       Calculate from all available level data points.
    ---------------------------------------------- */

    const allValues = [];

    visibleDays.forEach((day) => {
      levels.forEach((level) => {
        const value = day[`level${level}`];

        if (Number.isFinite(value)) {
          allValues.push(value);
        }
      });
    });

    const average = allValues.length > 0 ? allValues.reduce((sum, value) => sum + value, 0) / allValues.length : null;

    setOverallAverage(average);

    /* ----------------------------------------------
       Report Calendar-Day Range
    ---------------------------------------------- */

    if (onActiveDayCountChange) {
      onActiveDayCountChange(visibleDays.length);
    }
  }, [operation, levels, onActiveDayCountChange]);

  /* ------------------------------------------------
     Chart Data With Display Date
  ------------------------------------------------ */

  const formattedChartData = useMemo(
    () =>
      chartData.map((day) => ({
        ...day,
        displayDate: formatDateLabel(day.date, locale),
      })),
    [chartData, locale],
  );

  const reactionTimeDomain = useMemo(() => getReactionTimeDomain(formattedChartData), [formattedChartData]);

  /* ------------------------------------------------
     Empty State
  ------------------------------------------------ */

  if (operations.length === 0) {
    return (
      <section className={styles.chartCard}>
        <header className={styles.chartHeader}>
          <div>
            <h2>{t("reactionTime.title")}</h2>

            <p>{t("reactionTime.noData")}</p>
          </div>
        </header>

        <div className={styles.chartEmpty}>{t("reactionTime.noData")}</div>
      </section>
    );
  }

  return (
    <section className={styles.chartCard}>
      {/* ------------------------------------------------
         Header
      ------------------------------------------------ */}

      <div className={styles.performanceChartHeader}>
        <div className={styles.performanceChartHeading}>
          <h2>{t("reactionTime.title")}</h2>

          <p>{t("reactionTime.description")}</p>
        </div>

        <div className={styles.performanceChartControls}>
          <label className={styles.filter}>
            <span>{t("reactionTime.operation")}</span>

            <select
              value={operation}
              onChange={(event) => {
                const nextOperation = event.target.value;

                setOperation(nextOperation);

                if (onSelectionChange) {
                  onSelectionChange({
                    operation: nextOperation,
                  });
                }
              }}
            >
              {operations.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {t(`operations.${item}.title`)}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* ------------------------------------------------
         Chart
      ------------------------------------------------ */}

      {formattedChartData.length > 0 ? (
        <div className={styles.chartArea}>
          <ResponsiveContainer
            width='100%'
            height={280}
          >
            <LineChart
              data={formattedChartData}
              margin={{
                top: 12,
                right: 16,
                left: 4,
                bottom: 4,
              }}
            >
              <CartesianGrid
                stroke='var(--borderColor)'
                strokeDasharray='3 3'
                vertical={false}
              />

              {/* ------------------------------------------------
                 X Axis
              ------------------------------------------------ */}

              <XAxis
                dataKey='displayDate'
                padding={{
                  left: 24,
                  right: 24,
                }}
                tick={{
                  fill: "var(--mutedColor)",
                  fontSize: 10,
                }}
                tickLine={false}
                axisLine={{
                  stroke: "var(--borderColor)",
                }}
                minTickGap={20}
              />

              {/* ------------------------------------------------
                 Y Axis
              ------------------------------------------------ */}

              <YAxis
                domain={reactionTimeDomain}
                tick={{
                  fill: "var(--mutedColor)",
                  fontSize: 10,
                }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value.toFixed(1)}s`}
                width={42}
              />

              {/* ------------------------------------------------
                 Tooltip
              ------------------------------------------------ */}

              <Tooltip
                content={
                  <ReactionTimeTooltip
                    translate={t}
                    locale={locale}
                    levels={levels}
                  />
                }
              />

              {/* ------------------------------------------------
                 Overall Average
              ------------------------------------------------ */}

              {Number.isFinite(overallAverage) && (
                <ReferenceLine
                  y={overallAverage}
                  stroke='var(--mutedColor)'
                  strokeDasharray='5 5'
                  ifOverflow='extendDomain'
                  label={{
                    value: t("reactionTime.averageLabel", {
                      value: formatReactionTime(overallAverage),
                    }),
                    position: "insideTopRight",
                    fill: "var(--mutedColor)",
                    fontSize: 10,
                  }}
                />
              )}

              {/* ------------------------------------------------
                 Level Lines
              ------------------------------------------------ */}

              {levels.map((level) => {
                const lineKey = `level${level}`;
                const lineColor = getLevelColor(level);

                return (
                  <Line
                    key={lineKey}
                    type='monotone'
                    dataKey={lineKey}
                    stroke={lineColor}
                    strokeWidth={2}
                    dot={{
                      r: 3,
                      fill: lineColor,
                      strokeWidth: 0,
                    }}
                    activeDot={{
                      r: 5,
                      fill: lineColor,
                      stroke: "var(--surfaceColor)",
                      strokeWidth: 2,
                    }}
                    connectNulls={true}
                    name={t("levels.level", {
                      level,
                    })}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className={styles.chartEmpty}>{t("reactionTime.noLevelData")}</div>
      )}
    </section>
  );
}
