// src/components/ReactionTimeChart/ReactionTimeChart.jsx

"use client";

import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Minus, Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useLocale } from "next-intl";

import { getMostUsedOperationLast7Days } from "@/lib/stats/dashboard";
import { getQuizAttempts } from "@/lib/storage/quizHistory";
import styles from "./ReactionTimeChart.module.css";

/* --------------------------------------------------
   Constants
-------------------------------------------------- */

const OPERATION_NAMES = {
  add: "Addition",
  sub: "Subtraction",
  mul: "Multiplication",
  div: "Division",
  powersRoots: "Powers & Roots",
};

const OPERATION_ORDER = ["add", "sub", "mul", "div", "powersRoots"];

const PERIOD_OPTIONS = [
  { key: "1w", days: 7, label: "1w" },
  { key: "2w", days: 14, label: "2w" },
  { key: "3w", days: 21, label: "3w" },
  { key: "1m", days: 30, label: "1m" },
  { key: "2m", days: 60, label: "2m" },
  { key: "3m", days: 90, label: "3m" },
  { key: "6m", days: 180, label: "6m" },
  { key: "all", days: null, label: "All" },
];

/* --------------------------------------------------
   Date Helpers
-------------------------------------------------- */

function getLocalDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function parseDateKey(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);

  return new Date(year, month - 1, day);
}

function formatDateLabel(dateKey, locale) {
  const date = parseDateKey(dateKey);

  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
  }).format(date);
}

function formatReactionTime(value) {
  if (!Number.isFinite(value)) {
    return "—";
  }

  return `${Number(value).toFixed(1)}s`;
}

/* --------------------------------------------------
   Period Helpers
-------------------------------------------------- */

function getAvailableDaySpan(dateKeys) {
  if (dateKeys.length === 0) {
    return 0;
  }

  const dates = dateKeys.map(parseDateKey).sort((a, b) => a - b);
  const first = dates[0];
  const last = dates[dates.length - 1];

  return Math.floor((last - first) / 86400000) + 1;
}

function getAvailablePeriods(daySpan) {
  if (daySpan <= 0) {
    return [];
  }

  // Show every period up to and including the first
  // period that can contain all available data.
  const containingPeriodIndex = PERIOD_OPTIONS.findIndex((period) => period.key === "all" || period.days >= daySpan);

  if (containingPeriodIndex === -1) {
    return PERIOD_OPTIONS;
  }

  return PERIOD_OPTIONS.slice(0, containingPeriodIndex + 1);
}

function getDefaultPeriod(periods) {
  if (periods.length === 0) {
    return null;
  }

  // Once 1 month is available, use it as the default.
  if (periods.some((period) => period.key === "1m")) {
    return "1m";
  }

  // Before 1 month, use the largest available period.
  return periods[periods.length - 1].key;
}

/* --------------------------------------------------
   Attempt Data
-------------------------------------------------- */

function getPracticeRecords(attempts) {
  const records = [];

  attempts.forEach((attempt) => {
    if (!attempt?.operation) {
      return;
    }

    const level = Number(attempt.level);

    if (!Number.isFinite(level)) {
      return;
    }

    const questions = Array.isArray(attempt.questions) ? attempt.questions : [];

    questions.forEach((question) => {
      if (!question) {
        return;
      }

      const answered = question.selectedAnswer !== undefined && question.selectedAnswer !== null;

      if (!answered) {
        return;
      }

      const time = Number(question.time);

      const timestamp = attempt.completedAt || attempt.startedAt || question.timestamp || null;

      let dateKey = null;

      if (timestamp) {
        const date = new Date(timestamp);

        if (!Number.isNaN(date.getTime())) {
          dateKey = getLocalDateKey(date);
        }
      }

      records.push({
        operation: attempt.operation,
        level,
        correct: question.correct === true,
        time: Number.isFinite(time) && time > 0 ? time : null,
        dateKey,
      });
    });
  });

  return records;
}

/* --------------------------------------------------
   Practiced Operations
-------------------------------------------------- */

function getPracticedOperations(records) {
  const operationMap = new Map();

  records.forEach((record) => {
    if (!operationMap.has(record.operation)) {
      operationMap.set(record.operation, new Set());
    }

    operationMap.get(record.operation).add(record.level);
  });

  return OPERATION_ORDER.filter((operation) => operationMap.has(operation)).map((operation) => ({
    operation,
    levels: [...operationMap.get(operation)].sort((a, b) => a - b),
  }));
}

/* --------------------------------------------------
   Date Range
-------------------------------------------------- */

function getOperationDateKeys(records, operation, level = null) {
  return [...new Set(records.filter((record) => record.operation === operation && (level === null || record.level === level)).map((record) => record.dateKey))].sort();
}

function getDateRange(periodDays, dateKeys = []) {
  if (periodDays === null) {
    if (dateKeys.length === 0) {
      return [];
    }

    const dates = dateKeys.map(parseDateKey).sort((a, b) => a - b);
    const start = new Date(dates[0]);
    const end = new Date(dates[dates.length - 1]);

    const range = [];

    for (const date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      range.push(getLocalDateKey(date));
    }

    return range;
  }

  const end = new Date();
  end.setHours(0, 0, 0, 0);

  const start = new Date(end);
  start.setDate(start.getDate() - periodDays + 1);

  const dates = [];

  for (const date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    dates.push(getLocalDateKey(date));
  }

  return dates;
}

/* --------------------------------------------------
   Reaction Time Domain
-------------------------------------------------- */

function getReactionTimeDomain(data) {
  const values = [];

  data.forEach((day) => {
    Object.keys(day).forEach((key) => {
      if (key.startsWith("level") && Number.isFinite(day[key])) {
        values.push(day[key]);
      }

      if (key === "reactionTime" && Number.isFinite(day[key])) {
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
  const padding = Math.max(range * 0.1, 0.25);

  return [Math.max(0, min - padding), max + padding];
}

/* --------------------------------------------------
   All-level Line Data
-------------------------------------------------- */

function buildAllLevelData(records, operation, periodDays) {
  const dateKeys = getOperationDateKeys(records, operation);
  const dates = getDateRange(periodDays, dateKeys);

  return dates.map((dateKey) => {
    const row = {
      dateKey,
    };

    const levels = [...new Set(records.filter((record) => record.operation === operation && record.dateKey === dateKey).map((record) => record.level))];

    levels.forEach((level) => {
      const times = records.filter((record) => record.operation === operation && record.level === level && record.dateKey === dateKey).map((record) => record.time);

      if (times.length > 0) {
        row[`level${level}`] = times.reduce((sum, time) => sum + time, 0) / times.length;
      }
    });

    return row;
  });
}

/* --------------------------------------------------
   Level Bar Data
-------------------------------------------------- */

function buildLevelData(records, operation, level, periodDays) {
  const dateKeys = getOperationDateKeys(records, operation, level);
  const dates = getDateRange(periodDays, dateKeys);

  return dates.map((dateKey) => {
    const matchingRecords = records.filter((record) => record.operation === operation && record.level === level && record.dateKey === dateKey);

    if (matchingRecords.length === 0) {
      return {
        dateKey,
        reactionTime: null,
      };
    }

    const average = matchingRecords.reduce((sum, record) => sum + record.time, 0) / matchingRecords.length;

    return {
      dateKey,
      reactionTime: average,
    };
  });
}

/* --------------------------------------------------
   Trim Empty Days
-------------------------------------------------- */

function trimEmptyDays(data) {
  let start = 0;
  let end = data.length - 1;

  while (start <= end && !Object.keys(data[start]).some((key) => key.startsWith("level") && Number.isFinite(data[start][key])) && !Number.isFinite(data[start].reactionTime)) {
    start += 1;
  }

  while (end >= start && !Object.keys(data[end]).some((key) => key.startsWith("level") && Number.isFinite(data[end][key])) && !Number.isFinite(data[end].reactionTime)) {
    end -= 1;
  }

  return start <= end ? data.slice(start, end + 1) : [];
}

/* --------------------------------------------------
   Tooltips
-------------------------------------------------- */

function AllLevelTooltip({ active, payload, label, locale }) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const visiblePayload = payload.filter((entry) => Number.isFinite(entry.value));

  if (visiblePayload.length === 0) {
    return null;
  }

  return (
    <div className={styles.tooltip}>
      <strong>
        {OPERATION_NAMES[visiblePayload[0]?.payload?.operation] || ""} - {formatDateLabel(label, locale)}
      </strong>

      <div className={styles.tooltipLevels}>
        {visiblePayload.map((entry) => (
          <div
            key={entry.dataKey}
            className={styles.tooltipLevel}
          >
            <span className={styles.tooltipLabel}>Level {entry.dataKey.replace("level", "")}</span>

            <span className={styles.tooltipValue}>{formatReactionTime(entry.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LevelTooltip({ active, payload, label, locale, operation, level }) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const value = payload[0]?.value;

  if (!Number.isFinite(value)) {
    return null;
  }

  return (
    <div className={styles.tooltip}>
      <strong>
        {OPERATION_NAMES[operation]} - {formatDateLabel(label, locale)}
      </strong>

      <div className={styles.tooltipLevel}>
        <span className={styles.tooltipLabel}>Level {level}</span>

        <span className={styles.tooltipValue}>{formatReactionTime(value)}</span>
      </div>
    </div>
  );
}

/* --------------------------------------------------
   Period Selector
-------------------------------------------------- */

function PeriodSelector({ periods, selectedPeriod, onChange }) {
  if (periods.length < 2) {
    return null;
  }

  return (
    <div className={styles.periodSelector}>
      {periods.map((period) => (
        <button
          key={period.key}
          type='button'
          className={`${styles.periodButton} ${selectedPeriod === period.key ? styles.periodButtonActive : ""}`}
          onClick={() => onChange(period.key)}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
}

/* --------------------------------------------------
   Main Component
-------------------------------------------------- */

export default function ReactionTimeChart({ onSelectionChange, onActiveDayCountChange }) {
  const locale = useLocale();

  const [attempts, setAttempts] = useState([]);
  const [expandedOperations, setExpandedOperations] = useState([]);
  const [expandedOperation, setExpandedOperation] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(null);

  /* --------------------------------------------------
     Load Attempts
  -------------------------------------------------- */

  useEffect(() => {
    setAttempts(getQuizAttempts());
  }, []);

  /* --------------------------------------------------
     Build Practice Records
  -------------------------------------------------- */

  const records = useMemo(() => getPracticeRecords(attempts), [attempts]);

  console.log("Reaction Time records:", records);

  console.log("Reaction Time operations:", [...new Set(records.map((record) => record.operation))]);

  /* --------------------------------------------------
     Build Navigation
  -------------------------------------------------- */

  const practicedOperations = useMemo(() => getPracticedOperations(records), [records]);

  /* --------------------------------------------------
     Default Operation
  -------------------------------------------------- */

  const defaultOperation = useMemo(() => {
    const mostUsedOperation = getMostUsedOperationLast7Days();

    if (mostUsedOperation && practicedOperations.some((item) => item.operation === mostUsedOperation)) {
      return mostUsedOperation;
    }

    return practicedOperations[0]?.operation ?? null;
  }, [practicedOperations]);

  /* --------------------------------------------------
     Initial Selection
  -------------------------------------------------- */

  useEffect(() => {
    if (practicedOperations.length === 0) {
      setExpandedOperations([]);
      setExpandedOperation(null);
      setSelectedLevel(null);
      setSelectedPeriod(null);
      return;
    }

    const currentOperationExists = practicedOperations.some((item) => item.operation === expandedOperation);

    if (!currentOperationExists) {
      const initialOperation = defaultOperation ?? practicedOperations[0].operation;

      setExpandedOperation(initialOperation);
      setExpandedOperations([initialOperation]);
      setSelectedLevel(null);
    }
  }, [practicedOperations, expandedOperation, defaultOperation]);

  /* --------------------------------------------------
     Available Periods
  -------------------------------------------------- */

  const availablePeriods = useMemo(() => {
    if (!expandedOperation) {
      return [];
    }

    const dateKeys = getOperationDateKeys(records, expandedOperation, selectedLevel);

    return getAvailablePeriods(getAvailableDaySpan(dateKeys));
  }, [records, expandedOperation, selectedLevel]);

  /* --------------------------------------------------
     Default Period
  -------------------------------------------------- */

  useEffect(() => {
    const periodExists = availablePeriods.some((period) => period.key === selectedPeriod);

    if (!periodExists) {
      setSelectedPeriod(getDefaultPeriod(availablePeriods));
    }
  }, [availablePeriods, selectedPeriod]);

  /* --------------------------------------------------
     Current Period
  -------------------------------------------------- */

  const periodDays = selectedPeriod === "all" ? null : (PERIOD_OPTIONS.find((period) => period.key === selectedPeriod)?.days ?? 30);

  /* --------------------------------------------------
     Chart Data
  -------------------------------------------------- */

  const chartData = useMemo(() => {
    if (!expandedOperation || !selectedPeriod) {
      return [];
    }

    if (selectedLevel !== null) {
      return trimEmptyDays(buildLevelData(records, expandedOperation, selectedLevel, periodDays));
    }

    return trimEmptyDays(buildAllLevelData(records, expandedOperation, periodDays));
  }, [records, expandedOperation, selectedLevel, periodDays, selectedPeriod]);

  /* --------------------------------------------------
     Chart Domain
  -------------------------------------------------- */

  const reactionTimeDomain = useMemo(() => getReactionTimeDomain(chartData), [chartData]);

  /* --------------------------------------------------
     Active Day Count
  -------------------------------------------------- */

  useEffect(() => {
    onActiveDayCountChange?.(chartData.length);
  }, [chartData, onActiveDayCountChange]);

  /* --------------------------------------------------
     Selection Callback
  -------------------------------------------------- */

  useEffect(() => {
    onSelectionChange?.({
      operation: expandedOperation || "",
      level: selectedLevel === null ? "" : String(selectedLevel),
    });
  }, [expandedOperation, selectedLevel, onSelectionChange]);

  /* --------------------------------------------------
     Empty State
  -------------------------------------------------- */

  if (practicedOperations.length === 0) {
    return (
      <div className={styles.chart}>
        <div className={styles.empty}>Complete a quiz to see your reaction time.</div>
      </div>
    );
  }

  /* --------------------------------------------------
     Operation Selection
  -------------------------------------------------- */

  function handleOperationClick(operation) {
    const isExpanded = expandedOperations.includes(operation);

    setExpandedOperations((current) => (isExpanded ? current.filter((item) => item !== operation) : [...current, operation]));

    if (expandedOperation === operation) {
      setExpandedOperation(null);
      setSelectedLevel(null);
      return;
    }

    setExpandedOperation(operation);
    setSelectedLevel(null);
  }

  /* --------------------------------------------------
     Mobile Operation Selection
  -------------------------------------------------- */

  function handleMobileOperationChange(event) {
    const operation = event.target.value;

    setExpandedOperation(operation);
    setSelectedLevel(null);

    setExpandedOperations((current) => (current.includes(operation) ? current : [...current, operation]));
  }

  /* --------------------------------------------------
     Level Selection
  -------------------------------------------------- */

  function handleLevelClick(level) {
    setSelectedLevel(level);
  }

  return (
    <div className={styles.chart}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <h2>Reaction Time</h2>

          <select
            className={styles.mobileOperationSelector}
            value={expandedOperation ?? ""}
            onChange={handleMobileOperationChange}
            aria-label='Select operation'
          >
            {practicedOperations.map(({ operation }) => (
              <option
                key={operation}
                value={operation}
              >
                {OPERATION_NAMES[operation] || operation}
              </option>
            ))}
          </select>

          <p>Average time taken to answer each question correctly.</p>
        </div>
      </div>

      <div className={styles.chartContent}>
        <nav
          className={styles.navigation}
          aria-label='Reaction time filters'
        >
          {practicedOperations.map(({ operation, levels }) => {
            const expanded = expandedOperations.includes(operation);

            return (
              <div
                key={operation}
                className={styles.operation}
              >
                <button
                  type='button'
                  className={styles.operationHeader}
                  onClick={() => handleOperationClick(operation)}
                  aria-expanded={expanded}
                >
                  <span className={styles.operationIcon}>
                    {expanded ? (
                      <Minus
                        size={14}
                        strokeWidth={1.8}
                      />
                    ) : (
                      <Plus
                        size={14}
                        strokeWidth={1.8}
                      />
                    )}
                  </span>

                  <span className={styles.operationName}>{OPERATION_NAMES[operation] || operation}</span>
                </button>

                <AnimatePresence initial={false}>
                  {expanded && (
                    <motion.div
                      className={styles.levels}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        height: {
                          duration: 0.22,
                          ease: "easeOut",
                        },
                        opacity: {
                          duration: 0.15,
                          ease: "easeOut",
                        },
                      }}
                    >
                      {levels.map((level) => (
                        <button
                          key={level}
                          type='button'
                          className={`${styles.level} ${selectedLevel === level && expandedOperation === operation ? styles.levelActive : ""}`}
                          data-level={level}
                          onClick={() => handleLevelClick(level)}
                        >
                          <span
                            className={styles.levelColor}
                            aria-hidden='true'
                          />
                          <span>Level {level}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        <div className={styles.chartPanel}>
          <div className={`${styles.chartHeader} ${selectedLevel !== null ? styles.chartHeaderLevel : ""}`}>
            {selectedLevel === null && (
              <div>
                <div className={styles.chartTitle}>{OPERATION_NAMES[expandedOperation]}</div>
              </div>
            )}

            <PeriodSelector
              periods={availablePeriods}
              selectedPeriod={selectedPeriod}
              onChange={setSelectedPeriod}
            />
          </div>

          {chartData.length === 0 ? (
            <div className={styles.empty}>No reaction-time data is available for this period.</div>
          ) : (
            <div className={styles.chartArea}>
              <ResponsiveContainer
                width='100%'
                height='100%'
              >
                {selectedLevel === null ? (
                  <LineChart
                    data={chartData.map((item) => ({
                      ...item,
                      operation: expandedOperation,
                    }))}
                    margin={{
                      top: 8,
                      right: 12,
                      left: 0,
                      bottom: 4,
                    }}
                  >
                    <CartesianGrid
                      stroke='var(--borderColor)'
                      strokeDasharray='3 3'
                      vertical={false}
                    />

                    <XAxis
                      dataKey='dateKey'
                      tickFormatter={(value) => formatDateLabel(value, locale)}
                      tick={{
                        fontSize: 10,
                        fill: "var(--mutedColor)",
                      }}
                      tickLine={false}
                      axisLine={{
                        stroke: "var(--borderColor)",
                      }}
                      minTickGap={24}
                    />

                    <YAxis
                      domain={reactionTimeDomain}
                      tick={{
                        fontSize: 10,
                        fill: "var(--mutedColor)",
                      }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${Number(value).toFixed(1)}s`}
                      width={42}
                    />

                    <Tooltip content={<AllLevelTooltip locale={locale} />} />

                    {practicedOperations
                      .find((item) => item.operation === expandedOperation)
                      ?.levels.map((level) => (
                        <Line
                          key={level}
                          type='monotone'
                          dataKey={`level${level}`}
                          name={`Level ${level}`}
                          connectNulls
                          stroke={`var(--chartLevel${level}, var(--accentColor))`}
                          strokeWidth={2}
                          dot={false}
                          activeDot={{
                            r: 4,
                          }}
                        />
                      ))}
                  </LineChart>
                ) : (
                  <BarChart
                    data={chartData}
                    margin={{
                      top: 8,
                      right: 12,
                      left: 0,
                      bottom: 4,
                    }}
                  >
                    <CartesianGrid
                      stroke='var(--borderColor)'
                      strokeDasharray='3 3'
                      vertical={false}
                    />

                    <XAxis
                      dataKey='dateKey'
                      tickFormatter={(value) => formatDateLabel(value, locale)}
                      tick={{
                        fontSize: 10,
                        fill: "var(--mutedColor)",
                      }}
                      tickLine={false}
                      axisLine={{
                        stroke: "var(--borderColor)",
                      }}
                      minTickGap={24}
                    />

                    <YAxis
                      domain={reactionTimeDomain}
                      tick={{
                        fontSize: 10,
                        fill: "var(--mutedColor)",
                      }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${Number(value).toFixed(1)}s`}
                      width={42}
                    />

                    <Tooltip
                      content={
                        <LevelTooltip
                          locale={locale}
                          operation={expandedOperation}
                          level={selectedLevel}
                        />
                      }
                    />

                    <Bar
                      dataKey='reactionTime'
                      name='Reaction Time'
                      fill='var(--accentColor)'
                      radius={[3, 3, 0, 0]}
                      maxBarSize={28}
                    />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
