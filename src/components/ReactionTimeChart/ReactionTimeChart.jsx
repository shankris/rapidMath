// src/components/ReactionTimeChart/ReactionTimeChart.jsx

"use client";

import { useEffect, useMemo, useState } from "react";
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
  powersRoots: "Power & Roots",
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

function formatDateLabel(dateKey) {
  const date = new Date(`${dateKey}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateKey;
  }

  return date.toLocaleDateString(undefined, {
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
   Custom Tooltip
-------------------------------------------------- */

function ReactionTimeTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null;
  }

  const reactionTime = payload.find((item) => item.dataKey === "average");

  if (!reactionTime || !Number.isFinite(reactionTime.value)) {
    return null;
  }

  return (
    <div className={styles.chartTooltip}>
      <strong>{formatDateLabel(label)}</strong>

      <span>
        <span className={styles.chartTooltipLabel}>Average reaction time</span>

        <span className={styles.chartTooltipValue}>{formatReactionTime(reactionTime.value)}</span>
      </span>
    </div>
  );
}

/* --------------------------------------------------
   Reaction Time Chart
-------------------------------------------------- */

export default function ReactionTimeChart({ operation: selectedOperation = "", level: selectedLevel = "", onSelectionChange, onActiveDayCountChange }) {
  const [attempts, setAttempts] = useState([]);

  const [operation, setOperation] = useState(selectedOperation);

  const [level, setLevel] = useState(selectedLevel);

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

  const levels = useMemo(() => getAvailableLevels(attempts, operation), [attempts, operation]);

  /* ------------------------------------------------
     Sync Selected Level From Dashboard
  ------------------------------------------------ */

  useEffect(() => {
    if (selectedLevel && levels.includes(Number(selectedLevel))) {
      setLevel(String(selectedLevel));
    }
  }, [selectedLevel, levels]);

  /* ------------------------------------------------
     Set Initial Level
  ------------------------------------------------ */

  useEffect(() => {
    if (levels.length === 0) {
      setLevel("");
      return;
    }

    const numericLevel = Number(level);

    if (!levels.includes(numericLevel)) {
      setLevel(String(levels[0]));
    }
  }, [levels, level]);

  /* ------------------------------------------------
     Report Selection To Dashboard
  ------------------------------------------------ */

  useEffect(() => {
    if (!operation || !level || !onSelectionChange) {
      return;
    }

    onSelectionChange({
      operation,
      level,
    });
  }, [operation, level, onSelectionChange]);

  /* ------------------------------------------------
     Build Chart Data
  ------------------------------------------------ */

  useEffect(() => {
    if (!operation || !level) {
      setChartData([]);
      setOverallAverage(null);

      if (onActiveDayCountChange) {
        onActiveDayCountChange(0);
      }

      return;
    }

    const result = getReactionTimeTrend(operation, Number(level));

    if (!result) {
      setChartData([]);
      setOverallAverage(null);

      if (onActiveDayCountChange) {
        onActiveDayCountChange(0);
      }

      return;
    }

    /* ----------------------------------------------
       Use Shared Performance Date Range

       The shared range is determined by answered
       questions, not by reaction-time values.

       This means:
       - leading empty days are removed
       - trailing empty days are removed
       - internal empty days remain
       - the calendar-day count includes internal gaps
    ---------------------------------------------- */

    if (!result.startDate || !result.endDate) {
      setChartData([]);
      setOverallAverage(null);

      if (onActiveDayCountChange) {
        onActiveDayCountChange(0);
      }

      return;
    }

    const days = getLast30Days();

    const startIndex = days.indexOf(result.startDate);
    const endIndex = days.indexOf(result.endDate);

    if (startIndex === -1 || endIndex === -1) {
      setChartData([]);
      setOverallAverage(null);

      if (onActiveDayCountChange) {
        onActiveDayCountChange(0);
      }

      return;
    }

    const visibleDays = result.days.slice(startIndex, endIndex + 1);

    setChartData(visibleDays);
    setOverallAverage(result.overallAverage);

    /* ----------------------------------------------
       Report Calendar-Day Range To Dashboard
    ---------------------------------------------- */

    if (onActiveDayCountChange) {
      onActiveDayCountChange(result.activeDayCount ?? visibleDays.length);
    }
  }, [operation, level, onActiveDayCountChange]);

  /* ------------------------------------------------
     Chart Data With Display Date
  ------------------------------------------------ */

  const formattedChartData = useMemo(
    () =>
      chartData.map((day) => ({
        ...day,
        displayDate: formatDateLabel(day.date),
      })),
    [chartData],
  );

  /* ------------------------------------------------
     Empty State
  ------------------------------------------------ */

  if (operations.length === 0) {
    return (
      <section className={styles.chartCard}>
        <header className={styles.chartHeader}>
          <div>
            <h2>Reaction Time</h2>

            <p>Your reaction-time progress over the last 30 days.</p>
          </div>
        </header>

        <div className={styles.chartEmpty}>No reaction-time data available yet.</div>
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
          <h2>Reaction Time</h2>
          <p>Track your reaction time over the last 30 days.</p>
        </div>

        <div className={styles.performanceChartControls}>
          <label className={styles.filter}>
            <span>Operation</span>

            <select
              value={operation}
              onChange={(event) => {
                const nextOperation = event.target.value;

                setOperation(nextOperation);
                setLevel("");

                if (onSelectionChange) {
                  onSelectionChange({
                    operation: nextOperation,
                    level: "",
                  });
                }
              }}
            >
              {operations.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {OPERATION_NAMES[item] ?? item}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.filter}>
            <span>Level</span>

            <select
              value={level}
              onChange={(event) => {
                const nextLevel = event.target.value;

                setLevel(nextLevel);

                if (onSelectionChange && operation) {
                  onSelectionChange({
                    operation,
                    level: nextLevel,
                  });
                }
              }}
              disabled={levels.length === 0}
            >
              {levels.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  Level {item}
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
              /* ------------------------------------------------ X Axis ------------------------------------------------ */
              <XAxis
                dataKey='displayDate'
                padding={{
                  left: 88,
                  right: 88,
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
              <YAxis
                tick={{
                  fill: "var(--mutedColor)",
                  fontSize: 10,
                }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value.toFixed(1)}s`}
                width={42}
              />
              <Tooltip content={<ReactionTimeTooltip />} />
              {Number.isFinite(overallAverage) && (
                <ReferenceLine
                  y={overallAverage}
                  stroke='var(--mutedColor)'
                  strokeDasharray='5 5'
                  ifOverflow='extendDomain'
                  label={{
                    value: `Avg ${formatReactionTime(overallAverage)}`,
                    position: "insideTopRight",
                    fill: "var(--mutedColor)",
                    fontSize: 10,
                  }}
                />
              )}
              <Line
                type='monotone'
                dataKey='average'
                stroke='var(--accentColor)'
                strokeWidth={2}
                dot={{
                  r: 3,
                  fill: "var(--accentColor)",
                  strokeWidth: 0,
                }}
                activeDot={{
                  r: 5,
                  fill: "var(--accentColor)",
                  stroke: "var(--surfaceColor)",
                  strokeWidth: 2,
                }}
                connectNulls={true}
                name='Average reaction time'
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className={styles.chartEmpty}>No reaction-time data available for this level.</div>
      )}
    </section>
  );
}
