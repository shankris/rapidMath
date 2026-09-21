"use client";

/* src/components/AccuracyChart/AccuracyChart.jsx */

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { getQuizAttempts } from "@/lib/storage/quizHistory";
import { getPerformanceDateRange } from "@/lib/stats/reactionTime";

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
   Date Helpers
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
   Available Operations
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
   Available Levels
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
   Date Formatting
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
   Accuracy Formatting
-------------------------------------------------- */

function formatAccuracy(value) {
  if (!Number.isFinite(value)) {
    return "—";
  }

  return `${value.toFixed(0)}%`;
}

/* --------------------------------------------------
   Accuracy Y-Axis Range
-------------------------------------------------- */

function getAccuracyAxisRange(chartData) {
  const values = chartData.map((item) => item.accuracy).filter((value) => Number.isFinite(value));

  if (values.length === 0) {
    return {
      min: 0,
      max: 100,
    };
  }

  const minimum = Math.min(...values);
  const maximum = Math.max(...values);

  /*
  Keep the full 0–100 scale when the data has
  substantial variation. Otherwise zoom in around
  the actual accuracy range.
  */

  if (minimum <= 70) {
    return {
      min: 0,
      max: 100,
    };
  }

  const range = maximum - minimum;

  if (range >= 30) {
    return {
      min: 60,
      max: 100,
    };
  }

  if (range >= 20) {
    return {
      min: 70,
      max: 100,
    };
  }

  if (range >= 10) {
    return {
      min: 80,
      max: 100,
    };
  }

  /*
  For very small differences, use a rounded lower
  boundary while never exceeding 90%.
  */

  const lowerBoundary = Math.floor(minimum / 5) * 5 - 5;

  return {
    min: Math.max(90, lowerBoundary),
    max: 100,
  };
}

/* --------------------------------------------------
   Accuracy Tooltip
-------------------------------------------------- */

function AccuracyTooltip({ active, payload, label, translate, locale }) {
  if (!active || !payload?.length) {
    return null;
  }

  const accuracy = payload.find((item) => item.dataKey === "accuracy");

  if (!accuracy || !Number.isFinite(accuracy.value)) {
    return null;
  }

  return (
    <div className={styles.chartTooltip}>
      <strong>{formatDateLabel(label, locale)}</strong>

      <span>
        <span className={styles.chartTooltipLabel}>{translate("accuracy.label")}</span>

        <span className={styles.chartTooltipValue}>{formatAccuracy(accuracy.value)}</span>
      </span>
    </div>
  );
}

/* --------------------------------------------------
   Accuracy Chart
-------------------------------------------------- */

export default function AccuracyChart({ operation: selectedOperation = "", level: selectedLevel = "", onSelectionChange }) {
  const t = useTranslations("Graphs");
  const tExercises = useTranslations("Exercises");

  const locale = useLocale();
  const [attempts, setAttempts] = useState([]);
  const [operation, setOperation] = useState(selectedOperation);
  const [level, setLevel] = useState(selectedLevel);
  const [chartData, setChartData] = useState([]);
  const [axisRange, setAxisRange] = useState({
    min: 0,
    max: 100,
  });

  /* ------------------------------------------------
     Load Attempts
  ------------------------------------------------ */

  useEffect(() => {
    setAttempts(getQuizAttempts());
  }, []);

  /* ------------------------------------------------
     Available Filters
  ------------------------------------------------ */

  const operations = useMemo(() => getAvailableOperations(attempts), [attempts]);

  const levels = useMemo(() => getAvailableLevels(attempts, operation), [attempts, operation]);

  /* ------------------------------------------------
     Synchronize Selection From Dashboard
  ------------------------------------------------ */

  useEffect(() => {
    if (selectedOperation && operations.includes(selectedOperation) && selectedOperation !== operation) {
      setOperation(selectedOperation);
    }
  }, [selectedOperation, operations, operation]);

  useEffect(() => {
    if (selectedLevel && levels.includes(Number(selectedLevel)) && String(selectedLevel) !== String(level)) {
      setLevel(String(selectedLevel));
    }
  }, [selectedLevel, levels, level]);

  /* ------------------------------------------------
     Initialize Selection
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
     Notify Dashboard Of Selection
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
     Build Accuracy Data
  ------------------------------------------------ */

  useEffect(() => {
    if (!operation || !level) {
      setChartData([]);

      setAxisRange({
        min: 0,
        max: 100,
      });

      return;
    }

    /*
    The shared performance range is determined from
    answered questions for this operation + level.

    Only leading and trailing empty calendar days
    are removed. Empty days inside the range remain.
    */

    const dateRange = getPerformanceDateRange(operation, Number(level));

    if (!dateRange.startDate || !dateRange.endDate) {
      setChartData([]);

      setAxisRange({
        min: 0,
        max: 100,
      });

      return;
    }

    const days = getLast30Days();

    const startIndex = days.indexOf(dateRange.startDate);

    const endIndex = days.indexOf(dateRange.endDate);

    if (startIndex === -1 || endIndex === -1) {
      setChartData([]);

      setAxisRange({
        min: 0,
        max: 100,
      });

      return;
    }

    /*
    This is the exact same calendar-day range used
    by Reaction Time.
    */

    const visibleDays = days.slice(startIndex, endIndex + 1);

    const dayMap = new Map(
      visibleDays.map((date) => [
        date,
        {
          correct: 0,
          answered: 0,
        },
      ]),
    );

    /* ----------------------------------------------
       Collect Daily Accuracy
    ---------------------------------------------- */

    attempts.forEach((attempt) => {
      if (!attempt || attempt.operation !== operation || Number(attempt.level) !== Number(level) || !attempt.startedAt || !Array.isArray(attempt.questions)) {
        return;
      }

      const dateKey = getLocalDateKey(new Date(attempt.startedAt));

      const day = dayMap.get(dateKey);

      if (!day) {
        return;
      }

      attempt.questions.forEach((question) => {
        if (!question || question.selectedAnswer === undefined || question.selectedAnswer === null) {
          return;
        }

        day.answered += 1;

        if (question.correct === true) {
          day.correct += 1;
        }
      });
    });

    /* ----------------------------------------------
       Build Chart Data
    ---------------------------------------------- */

    const data = visibleDays.map((date) => {
      const day = dayMap.get(date);

      return {
        date,
        displayDate: formatDateLabel(date, locale),
        accuracy: day.answered > 0 ? (day.correct / day.answered) * 100 : null,
      };
    });

    const nextAxisRange = getAccuracyAxisRange(data);

    setChartData(data);
    setAxisRange(nextAxisRange);
  }, [attempts, operation, level, locale]);

  /* ------------------------------------------------
     Empty State
  ------------------------------------------------ */

  if (operations.length === 0) {
    return (
      <section className={styles.chartCard}>
        <header className={styles.chartHeader}>
          <div>
            <h2>{t("accuracy.title")}</h2>

            <p>{t("accuracy.description")}</p>
          </div>
        </header>

        <div className={styles.chartEmpty}>{t("accuracy.noData")}</div>
      </section>
    );
  }

  return (
    <section className={styles.chartCard}>
      <div className={styles.performanceChartHeader}>
        <div className={styles.performanceChartHeading}>
          <h2>{t("accuracy.title")}</h2>

          <p>{t("accuracy.description")}</p>
        </div>

        <div className={styles.performanceChartControls}>
          <label className={styles.filter}>
            <span>{t("accuracy.operation")}</span>

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
                  {tExercises(`operations.${item}.title`)}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.filter}>
            <span>{t("accuracy.level")}</span>

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
                  {t("levels.level", { level: item })}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {chartData.length > 0 ? (
        <div className={styles.chartArea}>
          <ResponsiveContainer
            width='100%'
            height={280}
          >
            <BarChart
              data={chartData}
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

              <XAxis
                dataKey='displayDate'
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
                domain={[axisRange.min, axisRange.max]}
                tick={{
                  fill: "var(--mutedColor)",
                  fontSize: 10,
                }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
                width={42}
              />

              <Tooltip
                content={
                  <AccuracyTooltip
                    translate={t}
                    locale={locale}
                  />
                }
              />

              <Bar
                dataKey='accuracy'
                fill='var(--accentColor)'
                radius={[3, 3, 0, 0]}
                maxBarSize={32}
                name={t("accuracy.label")}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className={styles.chartEmpty}>{t("accuracy.noLevelData")}</div>
      )}
    </section>
  );
}
