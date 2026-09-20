"use client";
/* src/components/Dashboard/Dashboard.jsx */

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";
import dashboardData from "./dashboardData.json";

import MonthlyActivity from "@/components/MonthlyActivity/MonthlyActivity";
import StreakStats from "@/components/StreakStats/StreakStats";
import ReactionTimeChart from "@/components/ReactionTimeChart/ReactionTimeChart";
import AccuracyChart from "@/components/AccuracyChart/AccuracyChart";

import { formatLastUse, getDashboardActivity, getDashboardActivityDetails, getDashboardLevelStats, getPracticeTimeDistribution } from "@/lib/stats/dashboard";

import { Check } from "lucide-react";

/* --------------------------------------------------
Operation Names
-------------------------------------------------- */

const OPERATION_NAMES = {
  add: "Addition",
  sub: "Subtraction",
  mul: "Multiplication",
  div: "Division",
  mixedOperations: "Mixed Operations",
  missingNumber: "Find X",
  comparison: "Comparison",
  estimation: "Estimation",
  rounding: "Rounding",
  orderOfOperations: "Order of Operations",
  numberSense: "Number Sense",
  factorsMultiples: "Factors & Multiples",
  divisibility: "Divisibility",
  fractions: "Fractions",
  percentages: "Percentages",
  decimals: "Decimals",
  ratiosProportions: "Ratios & Proportions",
  powersRoots: "Powers & Roots",
  averages: "Averages",
  negativeNumbers: "Negative Numbers",
  simpleEquations: "Simple Equations",
  simpleInequalities: "Simple Inequalities",
  scientificNotation: "Scientific Notation",
  unitConversions: "Unit Conversions",
  basicGeometry: "Basic Geometry",
  basicStatistics: "Basic Statistics",
  algebra: "Algebra",
  linearEquations: "Linear Equations",
  quadraticEquations: "Quadratic Equations",
  polynomials: "Polynomials",
  sequences: "Sequences & Progressions",
  coordinateGeometry: "Coordinate Geometry",
  geometry: "Geometry",
  trigonometry: "Trigonometry",
  statistics: "Statistics",
  probability: "Probability",
  multiStepWordProblems: "Multi-step Word Problems",
  dataInterpretation: "Data Interpretation",
  multiStepAlgebra: "Multi-step Algebra",
  advancedEquations: "Advanced Equations",
  advancedGeometry: "Advanced Geometry",
  advancedTrigonometry: "Advanced Trigonometry",
  complexProbability: "Complex Probability",
  challengingSequences: "Challenging Sequences",
  multiTopicProblems: "Multi-topic Problems",
  satStyleProblems: "SAT-style Problems",
  olympiadStyleProblems: "Olympiad-style Problems",
};

/* --------------------------------------------------
Practice Time Chart Colors
-------------------------------------------------- */

const PRACTICE_TIME_COLORS = ["#4f46e5", "#0891b2", "#16a34a", "#d97706", "#9333ea", "#dc2626"];

/* --------------------------------------------------
Category Labels
-------------------------------------------------- */

const CATEGORY_LABELS = {
  basic: "Basics",
  intermediate: "Intermediate",
  advanced: "Advanced",
  challenge: "Challenge",
};

/* --------------------------------------------------
Status Labels
-------------------------------------------------- */

const STATUS_LABELS = {
  available: "Available",
  comingSoon: "Coming soon",
  planned: "Planned",
};

/* --------------------------------------------------
Dashboard Component
-------------------------------------------------- */

export default function Dashboard() {
  const [levelStats, setLevelStats] = useState({});
  const [practiceTime, setPracticeTime] = useState([]);
  const [activity, setActivity] = useState([]);
  const [activityDetails, setActivityDetails] = useState({});

  const [activeCategory, setActiveCategory] = useState("basic");

  const [performanceSelection, setPerformanceSelection] = useState({
    operation: "",
    level: "",
  });

  const [performanceDayCount, setPerformanceDayCount] = useState(0);

  /* --------------------------------------------------
Load Dashboard Statistics
-------------------------------------------------- */

  useEffect(() => {
    const stats = {};

    dashboardData.forEach((operation) => {
      operation.levels.forEach((level) => {
        const key = `${operation.operation}-${level.level}`;

        stats[key] = getDashboardLevelStats(operation.operation, level.level);
      });
    });

    setLevelStats(stats);

    /* ------------------------------------------------
Practice Time Distribution
------------------------------------------------ */

    const distribution = getPracticeTimeDistribution();

    const totalTime = Object.values(distribution).reduce((total, value) => total + value, 0);

    const timeData = Object.entries(distribution)
      .map(([operation, value]) => ({
        operation,
        name: OPERATION_NAMES[operation] ?? operation,
        value,
        percentage: totalTime > 0 ? (value / totalTime) * 100 : 0,
      }))
      .sort((a, b) => b.value - a.value);

    setPracticeTime(timeData);

    /* ------------------------------------------------
Monthly Activity
------------------------------------------------ */

    setActivity(getDashboardActivity());

    /* ------------------------------------------------
Monthly Activity Details
------------------------------------------------ */

    setActivityDetails(getDashboardActivityDetails());
  }, []);

  /* --------------------------------------------------
Refresh Relative Times
-------------------------------------------------- */

  useEffect(() => {
    const interval = setInterval(() => {
      setLevelStats((currentStats) => {
        const updatedStats = {};

        Object.entries(currentStats).forEach(([key, stats]) => {
          updatedStats[key] = {
            ...stats,
            lastUse: formatLastUse(stats.lastUseTimestamp),
          };
        });

        return updatedStats;
      });
    }, 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  /* --------------------------------------------------
Format Reaction Time
-------------------------------------------------- */

  function formatReactionTime(value) {
    if (value === null || value === undefined) {
      return "—";
    }

    return `${value.toFixed(2)}s`;
  }

  /* --------------------------------------------------
Format Accuracy
-------------------------------------------------- */

  function formatAccuracy(value) {
    if (value === null || value === undefined) {
      return "—";
    }

    return `${value}%`;
  }

  /* --------------------------------------------------
Format Practice Time
-------------------------------------------------- */

  function formatPracticeTime(seconds) {
    if (!Number.isFinite(seconds) || seconds <= 0) {
      return "0m";
    }

    if (seconds < 60) {
      return ">1m";
    }

    return `${Math.round(seconds / 60)}m`;
  }

  /* --------------------------------------------------
Get Smaller Operations
-------------------------------------------------- */

  const majorOperations = practiceTime.filter((item) => item.percentage >= 10);

  const smallerOperations = practiceTime.filter((item) => item.percentage < 10);

  const othersTime = smallerOperations.reduce((total, item) => total + item.value, 0);

  const othersPercentage = smallerOperations.reduce((total, item) => total + item.percentage, 0);

  /* --------------------------------------------------
Get Active Category Operations
-------------------------------------------------- */

  const categoryOperations = dashboardData.filter((operation) => operation.category === activeCategory);

  return (
    <section className={styles.dashboard}>
      {/* ------------------------------------------------
      Dashboard Header
      ------------------------------------------------ */}

      <header className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>

        <p className={styles.subtitle}>Continue building your mental math skills.</p>
      </header>

      {/* ------------------------------------------------
      Rapid Math Drills
      ------------------------------------------------ */}

      <section className={styles.exerciseRoadmap}>
        <div className={styles.roadmapHeader}>
          <div>
            <h2>Rapid Math Drills</h2>

            <p>Explore the exercises available now and what's coming next.</p>
          </div>
        </div>

        {/* ------------------------------------------------
        Difficulty Tabs
        ------------------------------------------------ */}

        <div
          className={styles.roadmapTabs}
          role='tablist'
          aria-label='Practice levels'
        >
          {Object.entries(CATEGORY_LABELS).map(([category, label]) => (
            <button
              key={category}
              type='button'
              role='tab'
              aria-selected={activeCategory === category}
              className={`${styles.roadmapTab} ${activeCategory === category ? styles.roadmapTabActive : ""}`}
              onClick={() => setActiveCategory(category)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ------------------------------------------------
        Exercises
        ------------------------------------------------ */}

        <div
          className={styles.roadmapGrid}
          role='tabpanel'
          aria-label={`${CATEGORY_LABELS[activeCategory]} exercises`}
        >
          {categoryOperations.map((operation) => {
            const isAvailable = operation.status === "available";

            /* ------------------------------------------------
            Available Exercise
            ------------------------------------------------ */

            if (isAvailable) {
              return (
                <article
                  key={operation.operation}
                  className={`card ${styles.operationCard}`}
                >
                  <div className={styles.operationHeader}>
                    <h2>{OPERATION_NAMES[operation.operation] ?? operation.title}</h2>

                    <p>{operation.description}</p>
                  </div>

                  <div className={styles.levels}>
                    {operation.levels.map((level) => {
                      const key = `${operation.operation}-${level.level}`;
                      const stats = levelStats[key];

                      return (
                        <Link
                          key={level.level}
                          href={`/practice/${operation.operation}/${level.level}`}
                          className={styles.level}
                        >
                          {/* --------------------------------------------------
                          Today's Practice Indicator
                          -------------------------------------------------- */}

                          {stats?.todayUses > 0 && (
                            <span
                              className={styles.todayUsage}
                              aria-label={`Practiced ${stats.todayUses} ${stats.todayUses === 1 ? "time" : "times"} today`}
                            >
                              {stats.todayUses < 4 ? (
                                Array.from({
                                  length: stats.todayUses,
                                }).map((_, index) => (
                                  <Check
                                    key={index}
                                    size={11}
                                    strokeWidth={2.5}
                                    className={styles.todayCheck}
                                    style={{
                                      marginLeft: index === 0 ? 0 : -2,
                                    }}
                                    aria-hidden='true'
                                  />
                                ))
                              ) : (
                                <>
                                  <span aria-hidden='true'>✓</span>

                                  <span>{stats.todayUses}</span>
                                </>
                              )}
                            </span>
                          )}

                          <span className={styles.levelNumber}>L{level.level}</span>

                          <span className={styles.levelPlaceholder}>{stats?.lastUse ?? "Play now"}</span>

                          <span className={styles.tooltip}>
                            <span>
                              <strong>{formatAccuracy(stats?.accuracy)}</strong>

                              <small>Accuracy</small>
                            </span>

                            <span>
                              <strong>{formatReactionTime(stats?.reactionTime)}</strong>

                              <small>Reaction time</small>
                            </span>

                            <span>
                              <strong>{stats?.questions ?? 0}</strong>

                              <small>Questions</small>
                            </span>
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </article>
              );
            }

            /* ------------------------------------------------
            Coming Soon / Planned Exercise
            ------------------------------------------------ */

            return (
              <article
                key={operation.operation}
                className={styles.roadmapCard}
              >
                <div className={styles.roadmapCardHeader}>
                  <h3>{OPERATION_NAMES[operation.operation] ?? operation.title}</h3>

                  <span className={`${styles.status} ${styles[`status${operation.status}`]}`}>{STATUS_LABELS[operation.status]}</span>
                </div>

                <p>{operation.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* ------------------------------------------------
      Dashboard Insights
      ------------------------------------------------ */}

      <div className={styles.dashboardInsights}>
        {/* ----------------------------------------------
        Reaction Time
        ---------------------------------------------- */}

        <article className={`card ${styles.chartCard}`}>
          <ReactionTimeChart />
        </article>

        {/* ----------------------------------------------
        Practice Time
        ---------------------------------------------- */}

        <article className={`card ${styles.chartCard}`}>
          <div className={styles.chartHeader}>
            <h2>Practice Time</h2>

            <p>How your practice time is distributed.</p>
          </div>

          <div className={styles.practiceBar}>
            {practiceTime.map((item, index) => (
              <div
                key={item.operation}
                className={styles.practiceBarSegment}
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: PRACTICE_TIME_COLORS[index % PRACTICE_TIME_COLORS.length],
                }}
                title={`${item.name}: ${item.percentage.toFixed(1)}%`}
              />
            ))}
          </div>
          <div className={styles.practiceBreakdown}>
            {majorOperations.map((item) => (
              // <div
              //   key={item.operation}
              //   className={styles.practiceRow}
              // >
              //   <span>{item.name}</span>

              //   <span>{formatPracticeTime(item.value)}</span>

              //   <span>{item.percentage.toFixed(1)}%</span>
              // </div>

              <div
                className={styles.practiceBar}
                style={{
                  height: "50px",
                  background: "red",
                }}
              >
                BAR TEST
              </div>
            ))}

            {smallerOperations.length === 1 && (
              <div
                key={smallerOperations[0].operation}
                className={styles.practiceRow}
              >
                <span>{smallerOperations[0].name}</span>

                <span>{formatPracticeTime(smallerOperations[0].value)}</span>

                <span>{smallerOperations[0].percentage.toFixed(1)}%</span>
              </div>
            )}

            {smallerOperations.length > 1 && (
              <>
                <div className={`${styles.practiceRow} ${styles.othersHeader}`}>
                  <span>Others</span>

                  <span>{formatPracticeTime(othersTime)}</span>

                  <span>{othersPercentage.toFixed(1)}%</span>
                </div>

                <div className={styles.othersItems}>
                  {smallerOperations.map((item) => (
                    <div
                      key={item.operation}
                      className={styles.practiceRow}
                    >
                      <span>{item.name}</span>

                      <span>{formatPracticeTime(item.value)}</span>

                      <span>{item.percentage.toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </article>

        {/* ----------------------------------------------
        Monthly Activity
        ---------------------------------------------- */}

        <article className={`card ${styles.insightCard}`}>
          <div className={styles.insightHeader}>
            <h2 className={styles.OperationHeader}>Quiz Practice</h2>

            <p>Your practice activity over the last 30 days.</p>
          </div>

          <div className={styles.streakStats}>
            <StreakStats />
          </div>

          <div className={styles.activityChart}>
            <MonthlyActivity
              data={activity}
              details={activityDetails}
            />
          </div>
        </article>
      </div>
    </section>
  );
}
