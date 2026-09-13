// src/app/review/[operation]/[level]/page.js

"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, CircleCheck, CircleQuestionMark, ClockFading, Target, Timer, CircleX, Clock3 } from "lucide-react";
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
   Format Duration
-------------------------------------------------- */

function formatTime(seconds) {
  const value = Number(seconds);

  if (!Number.isFinite(value) || value <= 0) {
    return "—";
  }

  /* --------------------------------------------------
     Less Than 10 Seconds
  -------------------------------------------------- */

  if (value < 10) {
    return `${value.toFixed(2)}s`;
  }

  /* --------------------------------------------------
     Seconds
  -------------------------------------------------- */

  if (value < 60) {
    return `${Math.round(value)}s`;
  }

  const totalSeconds = Math.round(value);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  /* --------------------------------------------------
     Less Than 10 Minutes
  -------------------------------------------------- */

  if (minutes < 10) {
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  }

  /* --------------------------------------------------
     Less Than 1 Hour
  -------------------------------------------------- */

  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  /* --------------------------------------------------
     Less Than 1 Day
  -------------------------------------------------- */

  if (hours < 24) {
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  }

  /* --------------------------------------------------
     Days
  -------------------------------------------------- */

  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
}

/* --------------------------------------------------
   Format Relative Date
-------------------------------------------------- */

function getRelativeDate(date) {
  const now = new Date();

  const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);

  const differenceInDays = Math.floor((todayStart - dateStart) / (1000 * 60 * 60 * 24));

  /* --------------------------------------------------
     Today / Yesterday
  -------------------------------------------------- */

  if (dateStart.getTime() === todayStart.getTime()) {
    return "Today";
  }

  if (dateStart.getTime() === yesterdayStart.getTime()) {
    return "Yesterday";
  }

  /* --------------------------------------------------
     Days
  -------------------------------------------------- */

  if (differenceInDays < 7) {
    return `${differenceInDays}d ago`;
  }

  /* --------------------------------------------------
     Weeks
  -------------------------------------------------- */

  if (differenceInDays < 30) {
    return `${Math.floor(differenceInDays / 7)}w ago`;
  }

  /* --------------------------------------------------
     Months
  -------------------------------------------------- */

  const months = (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());

  if (months < 12) {
    return `${Math.max(1, months)}mo ago`;
  }

  /* --------------------------------------------------
     Years
  -------------------------------------------------- */

  const years = now.getFullYear() - date.getFullYear();

  return `${Math.max(1, years)}y ago`;
}

/* --------------------------------------------------
   Format Practice Date
-------------------------------------------------- */

function formatPracticeDate(timestamp) {
  if (!timestamp) {
    return "—";
  }

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  const relativeDate = getRelativeDate(date);

  const formattedDate = date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const formattedTime = date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${relativeDate} — ${formattedDate} ${formattedTime}`;
}

/* --------------------------------------------------
   Format Attempt Status
-------------------------------------------------- */

function formatAttemptStatus(status) {
  return status === "completed" ? "Completed" : "Timed out";
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
            <span>Questions</span>
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
              {/* --------------------------------------------------
                 Activity Header
              -------------------------------------------------- */}

              <div className={styles.historyMain}>
                <div>
                  <strong className={`${styles.historyStatus} ${attempt.status === "completed" ? styles.completedStatus : styles.timedOutStatus}`}>
                    {attempt.status === "completed" ? (
                      <CircleCheck
                        size={15}
                        strokeWidth={2}
                      />
                    ) : (
                      <ClockFading
                        size={15}
                        strokeWidth={2}
                      />
                    )}

                    {formatAttemptStatus(attempt.status)}
                  </strong>

                  <span className={styles.historyDate}>{formatPracticeDate(attempt.startedAt)}</span>
                </div>
              </div>

              {/* --------------------------------------------------
                 Performance Details
              -------------------------------------------------- */}
              <div className={styles.historyStats}>
                <span title={`Accuracy: ${attempt.accuracy}%`}>
                  <Target
                    size={16}
                    strokeWidth={1.8}
                  />
                  <strong>{attempt.accuracy}%</strong>
                </span>

                <span title={`Correct: ${attempt.correct}/${attempt.answered}`}>
                  <CircleCheck
                    size={16}
                    strokeWidth={1.8}
                  />
                  <strong>
                    {attempt.correct}/{attempt.answered}
                  </strong>
                </span>

                <span title={`Avg. reaction time: ${formatTime(attempt.averageCorrectTime)}`}>
                  <Timer
                    size={16}
                    strokeWidth={1.8}
                  />
                  <strong>{formatTime(attempt.averageCorrectTime)}</strong>
                </span>

                <span title={`Questions answered: ${attempt.answered}`}>
                  <CircleQuestionMark
                    size={16}
                    strokeWidth={1.8}
                  />
                  <strong>{attempt.answered}</strong>
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
