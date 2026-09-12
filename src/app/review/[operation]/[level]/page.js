// src/app/review/[operation]/[level]/page.js

"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, CircleX, Clock3 } from "lucide-react";
import { useEffect, useState } from "react";

import { getReviewForLevel } from "@/lib/stats/review";

import styles from "./ReviewLevel.module.css";

/* --------------------------------------------------
   Operation Labels
-------------------------------------------------- */

const OPERATION_LABELS = {
  add: "Addition",
  sub: "Subtraction",
  mul: "Multiplication",
  div: "Division",
};

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
   Review Level Page
-------------------------------------------------- */

export default function ReviewLevelPage() {
  const params = useParams();

  const operation = params.operation;
  const level = Number(params.level);

  const [summary, setSummary] = useState(null);

  /* --------------------------------------------------
     Load Level Review Data
  -------------------------------------------------- */

  useEffect(() => {
    const reviewData = getReviewForLevel(operation, level);

    setSummary(reviewData);
  }, [operation, level]);

  /* --------------------------------------------------
     Missing Review Data
  -------------------------------------------------- */

  if (!summary) {
    return (
      <main className={styles.page}>
        <Link
          href='/review'
          className={styles.backLink}
        >
          <ArrowLeft size={16} />
          Back to Review
        </Link>

        <section className={styles.emptyState}>
          <h1>No review data found</h1>

          <p>There is no answered-question history for this operation and level.</p>
        </section>
      </main>
    );
  }

  const operationLabel = OPERATION_LABELS[summary.operation] || summary.operation;

  return (
    <main className={styles.page}>
      {/* --------------------------------------------------
         Back Link
      -------------------------------------------------- */}

      <Link
        href='/review'
        className={styles.backLink}
      >
        <ArrowLeft size={16} />
        Back to Review
      </Link>

      {/* --------------------------------------------------
         Page Header
      -------------------------------------------------- */}

      <header className={styles.header}>
        <div>
          <span className={styles.eyebrow}>{operationLabel}</span>

          <h1 className={styles.title}>Level {summary.level}</h1>

          <p className={styles.description}>
            Your practice history for {operationLabel.toLowerCase()} Level {summary.level}.
          </p>
        </div>

        <div className={styles.accuracy}>
          <span>Accuracy</span>
          <strong>{summary.accuracy}%</strong>
        </div>
      </header>

      {/* --------------------------------------------------
         Summary Statistics
      -------------------------------------------------- */}

      <section className={styles.statsGrid}>
        <article className={styles.statCard}>
          <CheckCircle2 size={20} />

          <div>
            <span>Questions answered</span>
            <strong>{summary.questions}</strong>
          </div>
        </article>

        <article className={styles.statCard}>
          <CircleX size={20} />

          <div>
            <span>Incorrect</span>
            <strong>{summary.incorrect}</strong>
          </div>
        </article>

        <article className={styles.statCard}>
          <Clock3 size={20} />

          <div>
            <span>Avg. correct time</span>
            <strong>{formatTime(summary.averageCorrectTime)}</strong>
          </div>
        </article>

        <article className={styles.statCard}>
          <Clock3 size={20} />

          <div>
            <span>Total practice time</span>
            <strong>{formatTime(summary.totalTime)}</strong>
          </div>
        </article>
      </section>

      {/* --------------------------------------------------
         Practice History
      -------------------------------------------------- */}

      <section className={styles.historySection}>
        <div className={styles.sectionHeader}>
          <div>
            <h2>Practice history</h2>

            <p>
              {summary.attempts} {summary.attempts === 1 ? "practice session" : "practice sessions"}
            </p>
          </div>
        </div>

        <div className={styles.historyList}>
          {summary.history.map((attempt) => (
            <article
              key={attempt.id}
              className={styles.historyCard}
            >
              <div className={styles.historyMain}>
                <div>
                  <span className={styles.historyDate}>{new Date(attempt.startedAt).toLocaleString()}</span>

                  <strong>{attempt.answered} questions answered</strong>
                </div>

                <span className={`${styles.status} ${attempt.status === "completed" ? styles.completed : styles.incomplete}`}>{attempt.status === "completed" ? "Completed" : "Incomplete"}</span>
              </div>

              <div className={styles.historyStats}>
                <span>
                  Accuracy <strong>{attempt.accuracy}%</strong>
                </span>

                <span>
                  Correct{" "}
                  <strong>
                    {attempt.correct}/{attempt.answered}
                  </strong>
                </span>

                <span>
                  Avg. correct time <strong>{formatTime(attempt.averageCorrectTime)}</strong>
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------
         Recommendation Placeholder
      -------------------------------------------------- */}

      <section className={styles.recommendation}>
        <span>Next step</span>

        <h2>Practice recommendation</h2>

        <p>Recommendations based on your accuracy, speed, and progress will appear here.</p>
      </section>
    </main>
  );
}
