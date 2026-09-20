"use client";
/* src/components/Practice/Practice.jsx */

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Check } from "lucide-react";

import styles from "./Practice.module.css";
import practiceData from "./practiceData";
import OperationCard from "./OperationCard";

import dashboardData from "@/app/[locale]/Dashboard/dashboardData.json";
import { getDashboardLevelStats } from "@/lib/stats/dashboard";

/* --------------------------------------------------
Practice Component
-------------------------------------------------- */

export default function Practice() {
  const locale = useLocale();
  const t = useTranslations("Dashboard");

  const [openOperation, setOpenOperation] = useState(null);
  const [activeCategory, setActiveCategory] = useState("basic");
  const [levelStats, setLevelStats] = useState({});

  /* --------------------------------------------------
Practice Accordion
-------------------------------------------------- */

  const handleToggle = (operationId) => {
    setOpenOperation((current) => (current === operationId ? null : operationId));
  };

  /* --------------------------------------------------
Dashboard Level Statistics
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
  }, [locale]);

  /* --------------------------------------------------
Active Rapid Math Category
-------------------------------------------------- */

  const categoryOperations = dashboardData.filter((operation) => operation.category === activeCategory);

  /* --------------------------------------------------
Rapid Math Categories
-------------------------------------------------- */

  const categories = {
    basic: t("categories.basic"),
    intermediate: t("categories.intermediate"),
    advanced: t("categories.advanced"),
    challenge: t("categories.challenge"),
  };

  return (
    <section className={styles.practice}>
      {/* --------------------------------------------------
Practice Heading
-------------------------------------------------- */}

      <div className={styles.heading}>
        <h1>Practice</h1>
        <p>Select an operation and level.</p>
      </div>

      {/* --------------------------------------------------
     Rapid Math Drills
  -------------------------------------------------- */}

      <section className={styles.rapidMathRoadmap}>
        {/* --------------------------------------------------
       Rapid Math Category Tabs
    -------------------------------------------------- */}

        <div
          className={styles.rapidMathTabs}
          role='tablist'
          aria-label={t("roadmap.categoriesLabel")}
        >
          {Object.entries(categories).map(([category, label]) => (
            <button
              key={category}
              type='button'
              role='tab'
              aria-selected={activeCategory === category}
              className={`${styles.rapidMathTab} ${activeCategory === category ? styles.rapidMathTabActive : ""}`}
              onClick={() => setActiveCategory(category)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* --------------------------------------------------
       Rapid Math Exercises
    -------------------------------------------------- */}

        <div
          className={styles.rapidMathGrid}
          role='tabpanel'
          aria-label={t("roadmap.categoryExercises", {
            category: categories[activeCategory],
          })}
        >
          {categoryOperations.map((operation) => {
            const isAvailable = operation.status === "available";

            /* ------------------------------------------------
           Available Operation
        ------------------------------------------------ */

            if (isAvailable) {
              return (
                <article
                  key={operation.operation}
                  className={`card ${styles.rapidMathOperationCard}`}
                >
                  <div className={styles.rapidMathOperationHeader}>
                    <h2>{t(`operations.${operation.operation}.title`)}</h2>

                    <p>{t(`operations.${operation.operation}.description`)}</p>
                  </div>

                  <div className={styles.rapidMathLevels}>
                    {operation.levels.map((level) => {
                      const key = `${operation.operation}-${level.level}`;
                      const stats = levelStats[key];

                      return (
                        <Link
                          key={level.level}
                          href={`/practice/${operation.operation}/${level.level}`}
                          className={styles.rapidMathLevel}
                        >
                          {/* ------------------------------------------
                         Today's Practice
                      ------------------------------------------ */}

                          {stats?.todayUses > 0 && (
                            <span
                              className={styles.rapidMathTodayUsage}
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
                                    className={styles.rapidMathTodayCheck}
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

                          {/* ------------------------------------------
                         Level
                      ------------------------------------------ */}

                          <span className={styles.rapidMathLevelNumber}>L{level.level}</span>

                          {/* ------------------------------------------
                         Last Use / Play Now
                      ------------------------------------------ */}

                          <span className={styles.rapidMathLevelPlaceholder}>
                            {stats?.lastUse
                              ? t(`levels.${stats.lastUse.key}`, {
                                  count: stats.lastUse.count,
                                })
                              : t("levels.playNow")}
                          </span>

                          {/* ------------------------------------------
                         Statistics Tooltip
                      ------------------------------------------ */}

                          <span className={styles.rapidMathTooltip}>
                            <span>
                              <strong>{stats?.accuracy !== null && stats?.accuracy !== undefined ? `${stats.accuracy}%` : "—"}</strong>

                              <small>{t("tooltip.accuracy")}</small>
                            </span>

                            <span>
                              <strong>{stats?.reactionTime !== null && stats?.reactionTime !== undefined ? `${stats.reactionTime.toFixed(2)}s` : "—"}</strong>

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
           Upcoming / Planned Operation
        ------------------------------------------------ */

            return (
              <article
                key={operation.operation}
                className={styles.rapidMathRoadmapCard}
              >
                <div className={styles.rapidMathRoadmapCardHeader}>
                  <h3>{t(`operations.${operation.operation}.title`)}</h3>

                  <span className={`${styles.rapidMathStatus} ${styles[`rapidMathStatus${operation.status}`]}`}>{t(`status.${operation.status}`)}</span>
                </div>

                <p>{t(`operations.${operation.operation}.description`)}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* --------------------------------------------------
     Existing Practice Operations
  -------------------------------------------------- */}

      <div className={styles.grid}>
        {practiceData.map((item) => (
          <OperationCard
            key={item.id}
            operation={item}
            isOpen={openOperation === item.id}
            onToggle={() => handleToggle(item.id)}
          />
        ))}
      </div>
    </section>
  );
}
