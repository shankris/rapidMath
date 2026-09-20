"use client";
/* src/app/[locale]/Dashboard/Dashboard.jsx */

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import styles from "./Dashboard.module.css";
import dashboardData from "./dashboardData.json";

import MonthlyActivity from "@/components/MonthlyActivity/MonthlyActivity";
import StreakStats from "@/components/StreakStats/StreakStats";
import ReactionTimeChart from "@/components/ReactionTimeChart/ReactionTimeChart";
import AccuracyChart from "@/components/AccuracyChart/AccuracyChart";

import { formatLastUse, getDashboardActivity, getDashboardActivityDetails, getDashboardLevelStats, getPracticeTimeDistribution } from "@/lib/stats/dashboard";

import { Check } from "lucide-react";

/* --------------------------------------------------
Dashboard Component
-------------------------------------------------- */

export default function Dashboard() {
  const t = useTranslations("Dashboard");
  const locale = useLocale();
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
        name: t(`operations.${operation}.title`),
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
  }, [locale]);

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
Practice Time Chart Colors
-------------------------------------------------- */

  const PRACTICE_TIME_COLORS = ["#4f46e5", "#0891b2", "#16a34a", "#d97706", "#9333ea", "#dc2626"];

  /* --------------------------------------------------
Practice Time Color
-------------------------------------------------- */

  function getPracticeTimeColor(operation) {
    const colorMap = {
      add: PRACTICE_TIME_COLORS[0],
      sub: PRACTICE_TIME_COLORS[1],
      mul: PRACTICE_TIME_COLORS[2],
      div: PRACTICE_TIME_COLORS[3],
      mixedOperations: PRACTICE_TIME_COLORS[4],
      missingNumber: PRACTICE_TIME_COLORS[5],
    };

    return colorMap[operation] ?? "#94a3b8";
  }

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
        <h1 className={styles.title}>{t("title")}</h1>

        <p className={styles.subtitle}>{t("subtitle")}</p>
      </header>

      {/* ------------------------------------------------
      Rapid Math Drills
      ------------------------------------------------ */}

      <section className={styles.exerciseRoadmap}>
        <div className={styles.roadmapHeader}>
          <div>
            <h2>{t("roadmap.title")}</h2>

            <p>{t("roadmap.description")}</p>
          </div>
        </div>

        {/* ------------------------------------------------
        Difficulty Tabs
        ------------------------------------------------ */}

        <div
          className={styles.roadmapTabs}
          role='tablist'
          aria-label={t("roadmap.categoriesLabel")}
        >
          {Object.entries({
            basic: t("categories.basic"),
            intermediate: t("categories.intermediate"),
            advanced: t("categories.advanced"),
            challenge: t("categories.challenge"),
          }).map(([category, label]) => (
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
          aria-label={t("roadmap.categoryExercises", {
            category: t(`categories.${activeCategory}`),
          })}
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
                    <h2>{t(`operations.${operation.operation}.title`)}</h2>

                    <p>{t(`operations.${operation.operation}.description`)}</p>
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
                              aria-label={t("levels.practicedToday", {
                                count: stats.todayUses,
                              })}
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

                          <span className={styles.levelPlaceholder}>
                            {stats?.lastUse
                              ? t(`levels.${stats.lastUse.key}`, {
                                  count: stats.lastUse.count,
                                })
                              : t("levels.playNow")}
                          </span>

                          <span className={styles.tooltip}>
                            <span>
                              <strong>{formatAccuracy(stats?.accuracy)}</strong>

                              <small>{t("tooltip.accuracy")}</small>
                            </span>

                            <span>
                              <strong>{formatReactionTime(stats?.reactionTime)}</strong>

                              <small>{t("tooltip.reactionTime")}</small>
                            </span>

                            <span>
                              <strong>{stats?.questions ?? 0}</strong>

                              <small>{t("tooltip.questions")}</small>
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
                  <h3>{t(`operations.${operation.operation}.title`)}</h3>

                  <span className={`${styles.status} ${styles[`status${operation.status}`]}`}>{t(`status.${operation.status}`)}</span>
                </div>

                <p>{t(`operations.${operation.operation}.description`)}</p>
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
          Accuracy
        ---------------------------------------------- */}
        <article className={`card ${styles.chartCard}`}>
          <AccuracyChart />
        </article>

        {/* ----------------------------------------------
Practice Time
---------------------------------------------- */}

        <article className={`card ${styles.chartCard}`}>
          <div className={styles.chartHeader}>
            <h2>{t("practiceTime.title")}</h2>

            <p>{t("practiceTime.description")}</p>
          </div>

          <div className={styles.practiceBar}>
            {practiceTime.map((item) => (
              <div
                key={item.operation}
                className={styles.practiceBarSegment}
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: getPracticeTimeColor(item.operation),
                }}
              >
                <span className={styles.practiceTooltip}>
                  <strong>{item.name}</strong>

                  <span>{formatPracticeTime(item.value)}</span>

                  <span>{item.percentage.toFixed(1)}%</span>
                </span>
              </div>
            ))}
          </div>

          <div className={styles.practiceBreakdown}>
            <table className={styles.practiceTable}>
              <thead>
                <tr>
                  <th scope='col'>Operation</th>
                  <th scope='col'>Time</th>
                  <th scope='col'>Share</th>
                </tr>
              </thead>

              <tbody>
                {practiceTime.map((item) => (
                  <tr key={item.operation}>
                    <td>
                      <span className={styles.practiceOperation}>
                        <span
                          className={styles.practiceColor}
                          style={{
                            backgroundColor: getPracticeTimeColor(item.operation),
                          }}
                          aria-hidden='true'
                        />

                        <span>{item.name}</span>
                      </span>
                    </td>

                    <td>{formatPracticeTime(item.value)}</td>

                    <td>{item.percentage.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        {/* ----------------------------------------------
Monthly Activity
---------------------------------------------- */}
        <article className={`card ${styles.insightCard}`}>
          <div className={styles.insightHeader}>
            <h2 className={styles.OperationHeader}>{t("quizPractice.title")}</h2>

            <p>{t("quizPractice.description")}</p>
          </div>

          <div className={styles.quizPracticeContent}>
            <div className={styles.quizPracticeLeft}>
              <div className={styles.streakStats}>
                <StreakStats />
              </div>

              <div className={styles.activityChart}>
                <MonthlyActivity
                  data={activity}
                  details={activityDetails}
                />
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
