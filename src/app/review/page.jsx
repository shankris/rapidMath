// src/app/review/page.js

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock3 } from "lucide-react";

import RadialProgress from "@/components/UI/Progress/RadialProgress";
import { getReviewSummary } from "@/lib/stats/review";

import styles from "./Review.module.css";

/* --------------------------------------------------
   Operation Configuration
-------------------------------------------------- */

const OPERATIONS = [
  {
    key: "add",
    label: "Addition",
  },
  {
    key: "sub",
    label: "Subtraction",
  },
  {
    key: "mul",
    label: "Multiplication",
  },
  {
    key: "div",
    label: "Division",
  },
];

/* --------------------------------------------------
   Format Time
-------------------------------------------------- */

function formatTime(seconds) {
  if (!seconds) {
    return "—";
  }

  return `${Number(seconds).toFixed(2)}s`;
}

/* --------------------------------------------------
   Review Page
-------------------------------------------------- */

export default function ReviewPage() {
  const [summaries, setSummaries] = useState([]);

  /* --------------------------------------------------
     Load Review Data
  -------------------------------------------------- */

  useEffect(() => {
    setSummaries(getReviewSummary());
  }, []);

  /* --------------------------------------------------
     Group Summaries By Operation
  -------------------------------------------------- */

  const operationGroups = useMemo(() => {
    return OPERATIONS.map((operation) => ({
      ...operation,
      levels: summaries.filter((summary) => summary.operation === operation.key).sort((a, b) => a.level - b.level),
    })).filter((operation) => operation.levels.length > 0);
  }, [summaries]);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Review</h1>

          <p className={styles.description}>Review your practice history and see how you are progressing across each level.</p>
        </div>
      </header>

      {operationGroups.length === 0 ? (
        <section className={styles.emptyState}>
          <h2>No practice activity yet</h2>

          <p>Complete some practice questions and your learning history will appear here.</p>
        </section>
      ) : (
        <div className={styles.operations}>
          {operationGroups.map((operation) => (
            <section
              key={operation.key}
              className={styles.operationSection}
            >
              <div className={styles.operationHeader}>
                <h2 className={styles.operationTitle}>{operation.label}</h2>

                {/* <span className={styles.levelCount}>
                  {operation.levels.length} {operation.levels.length === 1 ? "level" : "levels"}
                </span> */}
              </div>

              <div className={styles.levelGrid}>
                {operation.levels.map((summary) => (
                  <Link
                    key={`${summary.operation}-${summary.level}`}
                    href={`/review/${summary.operation}/${summary.level}`}
                    className={styles.levelCard}
                  >
                    <div className={styles.cardHeader}>
                      <div>
                        <span className={styles.levelLabel}>Level</span>

                        <h3 className={styles.levelNumber}>{summary.level}</h3>
                      </div>

                      <RadialProgress
                        value={summary.accuracy}
                        size={64}
                      />
                    </div>

                    <div className={styles.stats}>
                      <div className={styles.stat}>
                        <CheckCircle2
                          size={16}
                          strokeWidth={1.8}
                        />

                        <strong>{summary.questions}</strong>
                      </div>

                      <div className={styles.statDivider}>·</div>

                      <div className={styles.stat}>
                        <Clock3
                          size={16}
                          strokeWidth={1.8}
                        />

                        <strong>{formatTime(summary.averageCorrectTime)}</strong>
                      </div>
                    </div>

                    <p className={styles.reviewText}>Keep practicing — you're making good progress.</p>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
