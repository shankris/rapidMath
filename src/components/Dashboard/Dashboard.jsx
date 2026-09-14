// src/components/Dashboard/Dashboard.jsx

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";
import dashboardData from "./dashboardData.json";
import { formatLastUse, getDashboardLevelStats } from "@/lib/stats/dashboard";

/* --------------------------------------------------
   Dashboard Component
-------------------------------------------------- */

export default function Dashboard() {
  const [levelStats, setLevelStats] = useState({});

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

  return (
    <section className={styles.dashboard}>
      <header className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>

        <p className={styles.subtitle}>Continue building your mental math skills.</p>
      </header>

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
                    className={`${styles.level} ${level.level === 1 ? styles.recommended : ""}`}
                  >
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
    </section>
  );
}
