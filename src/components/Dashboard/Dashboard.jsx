"use client";
/* src/components/Dashboard/Dashboard.jsx */

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";
import dashboardData from "./dashboardData.json";
import DonutChart from "@/components/DonutChart/DonutChart";
import MonthlyActivity from "@/components/MonthlyActivity/MonthlyActivity";
import StreakStats from "@/components/StreakStats/StreakStats";
import ReactionTimeChart from "@/components/ReactionTimeChart/ReactionTimeChart";
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
  missingNumber: "Missing Number",
  comparison: "Comparison",
  estimation: "Estimation",
  sequences: "Sequences & Progressions",
  fractions: "Fractions",
  percentages: "Percentages",
  powersRoots: "Power & Roots",
};

/* --------------------------------------------------
Dashboard Component
-------------------------------------------------- */

export default function Dashboard() {
  const [levelStats, setLevelStats] = useState({});
  const [practiceTime, setPracticeTime] = useState([]);
  const [activity, setActivity] = useState([]);
  const [activityDetails, setActivityDetails] = useState({});

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
Get Donut Chart Data
-------------------------------------------------- */

  const chartData = practiceTime.map((item) => ({
    name: item.name,
    value: item.value,
  }));

  /* --------------------------------------------------
Get Smaller Operations
-------------------------------------------------- */

  const majorOperations = practiceTime.filter((item) => item.percentage >= 10);

  const smallerOperations = practiceTime.filter((item) => item.percentage < 10);

  const othersTime = smallerOperations.reduce((total, item) => total + item.value, 0);

  const othersPercentage = smallerOperations.reduce((total, item) => total + item.percentage, 0);

  return (
    <section className={styles.dashboard}>
      {" "}
      <header className={styles.header}>
        {" "}
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>Continue building your mental math skills.</p>
      </header>
      {/* ------------------------------------------------
  Operation Cards
  ------------------------------------------------ */}
      <div className={styles.operations}>
        {dashboardData.map((operation) => (
          <article
            key={operation.operation}
            className={`card ${styles.operationCard}`}
          >
            <div className={styles.operationHeader}>
              <h2>{operation.title}</h2>

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
        ))}
      </div>
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

          <DonutChart
            data={chartData}
            colors={["#4f46e5", "#0891b2", "#16a34a", "#d97706", "#9333ea", "#dc2626"]}
          />

          <div className={styles.practiceBreakdown}>
            {majorOperations.map((item) => (
              <div
                key={item.operation}
                className={styles.practiceRow}
              >
                <span>{item.name}</span>

                <span>{formatPracticeTime(item.value)}</span>

                <span>{item.percentage.toFixed(1)}%</span>
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
