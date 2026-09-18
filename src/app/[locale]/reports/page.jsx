"use client";

import { useEffect, useState } from "react";
import { getDashboardStats } from "@/lib/stats/dashboardStats";
import Activity from "@/components/Reports/Activity/Activity";
import PerformanceTrend from "@/components/Reports/PerformanceTrend/PerformanceTrend";
import OperationPerformance from "@/components/Reports/OperationPerformance/OperationPerformance";
import AnimatedNumber from "@/components/UI/AnimatedNumber/AnimatedNumber";
import ActivityHeatMap from "@/components/Reports/ActivityHeatMap/ActivityHeatMap";
import styles from "./page.module.css";

/* --------------------------------------------------
   Period Configuration
-------------------------------------------------- */

const PERIODS = ["1w", "2w", "1m", "3m", "6m", "1y", "all"];

/* --------------------------------------------------
   Reports Page
-------------------------------------------------- */

export default function ReportsPage() {
  const [period, setPeriod] = useState("1m");
  const [stats, setStats] = useState(null);

  /* ------------------------------------------------
     Load Statistics
  ------------------------------------------------ */

  useEffect(() => {
    const data = getDashboardStats(period);

    setStats(data);
  }, [period]);

  /* ------------------------------------------------
     Render
  ------------------------------------------------ */

  return (
    <main className={styles.page}>
      {/* Page Header */}

      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Reports</h1>
        <p className={styles.pageDescription}>Review your performance and progress over time.</p>
      </div>

      {/* ------------------------------------------
        Performance Overview
    ------------------------------------------ */}

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Performance Overview</h2>

            <p className={styles.sectionDescription}>Your overall performance for the selected period.</p>
          </div>

          {/* Period Selector */}

          <div
            className={styles.periodSelector}
            role='group'
            aria-label='Performance period'
          >
            {PERIODS.map((item) => (
              <button
                key={item}
                type='button'
                className={`${styles.periodButton} ${period === item ? styles.periodButtonActive : ""}`}
                onClick={() => setPeriod(item)}
                aria-pressed={period === item}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Statistics */}

        {stats && (
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Accuracy</span>
              <strong className={styles.statValue}>
                <AnimatedNumber
                  value={stats.accuracy}
                  duration={850}
                  decimals={1}
                />
                <span className={styles.unit}>%</span>
              </strong>
            </div>

            <div className={styles.statCard}>
              <span className={styles.statLabel}>Average Time</span>
              <strong className={styles.statValue}>
                <AnimatedNumber
                  value={stats.averageTime}
                  duration={700}
                  decimals={2}
                />
                <span className={styles.unit}>s</span>
              </strong>
            </div>

            <div className={styles.statCard}>
              <span className={styles.statLabel}>Tests Completed</span>
              <strong className={styles.statValue}>
                <AnimatedNumber
                  value={stats.testsCompleted}
                  duration={1000}
                />
              </strong>
            </div>

            <div className={styles.statCard}>
              <span className={styles.statLabel}>Questions Answered</span>
              <strong className={styles.statValue}>
                <AnimatedNumber
                  value={stats.questionsAnswered}
                  duration={800}
                />
              </strong>
            </div>
          </div>
        )}
      </section>

      {/* ------------------------------------------
        Performance Trend
    ------------------------------------------ */}

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Performance Trend</h2>

            <p className={styles.sectionDescription}>Your daily performance for the selected period.</p>
          </div>
        </div>

        {/* Performance Chart */}

        <div className={styles.chartCard}>
          <PerformanceTrend period={period} />
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Performance by Operation</h2>

            <p className={styles.sectionDescription}>Compare your performance across operations and difficulty levels.</p>
          </div>
        </div>

        <div className={styles.chartCard}>
          <OperationPerformance period={period} />
        </div>
      </section>

      {/* ------------------------------------------
        Activity
    ------------------------------------------ */}

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Activity</h2>

            <p className={styles.sectionDescription}>Your completed practice sessions from the last 30 days.</p>
          </div>
        </div>

        <div className={styles.chartCard}>
          <Activity />
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Activity</h2>
            <p className={styles.sectionDescription}>Your practice activity over the past year.</p>
          </div>
        </div>

        <div className={styles.chartCard}>
          <ActivityHeatMap />
        </div>
      </section>
    </main>
  );
}
