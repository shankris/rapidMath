"use client";
/* src/app/[locale]/Dashboard/Dashboard.jsx */

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import styles from "./Dashboard.module.css";

import MonthlyActivity from "@/components/MonthlyActivity/MonthlyActivity";
import StreakStats from "@/components/StreakStats/StreakStats";
import ReactionTimeChart from "@/components/ReactionTimeChart/ReactionTimeChart";
import AccuracyChart from "@/components/AccuracyChart/AccuracyChart";

import { getDashboardActivity, getDashboardActivityDetails, getPracticeTimeDistribution } from "@/lib/stats/dashboard";

/* --------------------------------------------------
Dashboard Component
-------------------------------------------------- */

export default function Dashboard() {
  const t = useTranslations("Dashboard");
  const locale = useLocale();

  const [practiceTime, setPracticeTime] = useState([]);
  const [activity, setActivity] = useState([]);
  const [activityDetails, setActivityDetails] = useState({});

  const [performanceSelection, setPerformanceSelection] = useState({
    operation: "",
    level: "",
  });

  const [performanceDayCount, setPerformanceDayCount] = useState(0);

  /* --------------------------------------------------
Load Dashboard Statistics
-------------------------------------------------- */

  useEffect(() => {
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
