"use client";
/* src/components/Practice/Practice.jsx */

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Check, Sparkles } from "lucide-react";

import styles from "./Practice.module.css";

import ShortcutPanel from "@/components/Shortcuts/ShortcutPanel";
import powerRootsShortcuts from "@/components/Shortcuts/PowerRoots/shortcuts";
import multiplicationShortcuts from "@/components/Shortcuts/Multiplication/shortcuts";
import dashboardData from "@/app/[locale]/Dashboard/dashboardData.json";
import { getDashboardLevelStats } from "@/lib/stats/dashboard";

/* --------------------------------------------------
Practice Component
-------------------------------------------------- */

export default function Practice() {
  const locale = useLocale();
  const t = useTranslations("Dashboard");
  const tExercises = useTranslations("Exercises");
  const [shortcutOperation, setShortcutOperation] = useState(null);

  const [activeCategory, setActiveCategory] = useState("basic");
  const [levelStats, setLevelStats] = useState({});

  /* --------------------------------------------------
  Shortcut Collections
  -------------------------------------------------- */

  const shortcutCollections = {
    powersRoots: powerRootsShortcuts,
    mul: multiplicationShortcuts,
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
  Playable Rapid Math Exercises
  -------------------------------------------------- */

  const playableOperations = categoryOperations.filter((operation) => operation.status === "available" || operation.status === "experimental");

  /* --------------------------------------------------
  Roadmap Exercises
  -------------------------------------------------- */

  const roadmapOperations = categoryOperations.filter((operation) => operation.status === "comingSoon" || operation.status === "planned");

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
      <div className={styles.heading}>
        <h1>Practice</h1>
        <p>Select an operation and level.</p>
      </div>

      <section className={styles.rapidMathRoadmap}>
        {/* --------------------------------------------------
        Category Tabs
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
        Exercise Grid
        -------------------------------------------------- */}

        <div
          className={styles.rapidMathGrid}
          role='tabpanel'
          aria-label={t("roadmap.categoryExercises", {
            category: categories[activeCategory],
          })}
        >
          {/* --------------------------------------------------
          Playable Exercises
          -------------------------------------------------- */}

          {playableOperations.map((operation) => (
            <article
              key={operation.operation}
              className={`card ${styles.rapidMathOperationCard}`}
            >
              <div className={styles.rapidMathOperationHeader}>
                <div className={styles.rapidMathOperationTitle}>
                  <h2>{tExercises(`operations.${operation.operation}.title`)}</h2>

                  {operation.status === "experimental" && <span className={styles.rapidMathExperimental}>{t("status.experimental")}</span>}

                  {operation.shortcuts && (
                    <button
                      type='button'
                      className={styles.rapidMathShortcutsLink}
                      onClick={() => setShortcutOperation(operation.operation)}
                    >
                      <Sparkles
                        size={14}
                        strokeWidth={1.8}
                        aria-hidden='true'
                      />
                      Notes
                    </button>
                  )}
                </div>

                <p>{tExercises(`operations.${operation.operation}.description`)}</p>
              </div>

              {/* --------------------------------------------------
              Levels
              -------------------------------------------------- */}

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
                      {/* Today's Practice */}

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

                      {/* Level */}

                      <span className={styles.rapidMathLevelNumber}>L{level.level}</span>

                      {/* Last Use / Play Now */}

                      <span className={styles.rapidMathLevelPlaceholder}>
                        {stats?.lastUse
                          ? t(`levels.${stats.lastUse.key}`, {
                              count: stats.lastUse.count,
                            })
                          : t("levels.playNow")}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </article>
          ))}

          {/* --------------------------------------------------
          Roadmap Exercises
          -------------------------------------------------- */}

          {roadmapOperations.map((operation) => (
            <article
              key={operation.operation}
              className={styles.rapidMathRoadmapCard}
            >
              <div className={styles.rapidMathRoadmapCardHeader}>
                <h3>{tExercises(`operations.${operation.operation}.title`)}</h3>

                <span className={`${styles.rapidMathStatus} ${styles[`rapidMathStatus${operation.status}`]}`}>{t(`status.${operation.status}`)}</span>
              </div>

              <p>{tExercises(`operations.${operation.operation}.description`)}</p>
            </article>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------
      Shortcut Panel
      -------------------------------------------------- */}

      <ShortcutPanel
        isOpen={Boolean(shortcutOperation)}
        onClose={() => setShortcutOperation(null)}
        data={
          shortcutOperation
            ? {
                ...shortcutCollections[shortcutOperation],
                title: "Notes - Before You Start",
              }
            : null
        }
      />
    </section>
  );
}
