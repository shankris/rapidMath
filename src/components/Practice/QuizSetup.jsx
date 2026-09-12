// src/components/Practice/QuizSetup/QuizSetup.jsx

"use client";

import { useMemo } from "react";

import styles from "./QuizSetup.module.css";
import { OPERATIONS } from "@/lib/math/operations";
import { getQuizAttemptsByLevel } from "@/lib/storage/quizHistory";

/* --------------------------------------------------
   Format Last Attempt
-------------------------------------------------- */

function formatLastAttempt(timestamp) {
  if (!timestamp) {
    return "";
  }

  const lastAttempt = new Date(timestamp);
  const now = new Date();

  const differenceMs = Math.max(0, now.getTime() - lastAttempt.getTime());

  const minutes = Math.floor(differenceMs / (1000 * 60));

  if (minutes < 60) {
    return `${Math.max(1, minutes)}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days}d ago`;
  }

  const weeks = Math.floor(days / 7);

  if (weeks < 4) {
    return `${weeks}w ago`;
  }

  const months = Math.floor(days / 30);

  if (months < 12) {
    return `${months}mo ago`;
  }

  const years = Math.floor(days / 365);

  return `${years}y ago`;
}

/* --------------------------------------------------
   Calculate Attempt Result
-------------------------------------------------- */

function calculateAttemptResult(attempt) {
  const questions = attempt?.questions ?? [];

  const totalAnswered = questions.length;

  if (totalAnswered === 0) {
    return {
      totalAnswered: 0,
      correct: 0,
      accuracy: 0,
      averageTime: 0,
      completed: attempt?.status === "completed",
    };
  }

  const correct = questions.filter((question) => question.correct).length;

  const accuracy = Math.round((correct / totalAnswered) * 100);

  const times = questions.map((question) => question.time).filter((time) => typeof time === "number");

  const averageTime = times.length === 0 ? 0 : Number((times.reduce((sum, time) => sum + time, 0) / times.length).toFixed(2));

  return {
    totalAnswered,
    correct,
    accuracy,
    averageTime,
    completed: attempt?.status === "completed",
  };
}

/* --------------------------------------------------
   Quiz Setup
-------------------------------------------------- */

export default function QuizSetup({ operation, level, onStart }) {
  /* --------------------------------------------------
     Local Quiz History
  -------------------------------------------------- */

  const attempts = useMemo(() => getQuizAttemptsByLevel(operation, level), [operation, level]);

  /* --------------------------------------------------
     Progress Statistics
  -------------------------------------------------- */

  const progress = useMemo(() => {
    if (attempts.length === 0) {
      return {
        hasHistory: false,
        accuracy: 0,
        averageTime: 0,
        attempts: 0,
        lastAttempt: null,
        lastAttemptResult: null,
      };
    }

    const answeredQuestions = attempts.flatMap((attempt) => attempt.questions ?? []);

    const correctAnswers = answeredQuestions.filter((question) => question.correct).length;

    const totalAnswered = answeredQuestions.length;

    const accuracy = totalAnswered === 0 ? 0 : Math.round((correctAnswers / totalAnswered) * 100);

    const times = answeredQuestions.map((question) => question.time).filter((time) => typeof time === "number");

    const averageTime = times.length === 0 ? 0 : Number((times.reduce((sum, time) => sum + time, 0) / times.length).toFixed(2));

    /* --------------------------------------------------
       Most Recent Attempt

       Includes completed and unfinished attempts.
    -------------------------------------------------- */

    const lastAttempt = [...attempts].filter((attempt) => attempt.startedAt).sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())[0];

    return {
      hasHistory: true,
      accuracy,
      averageTime,
      attempts: attempts.length,
      lastAttempt,
      lastAttemptResult: calculateAttemptResult(lastAttempt),
    };
  }, [attempts]);

  return (
    <>
      {/* --------------------------------------------------
         Page Header
      -------------------------------------------------- */}

      <div className={styles.header}>
        <h1>
          {OPERATIONS[operation].name} · Level {level}
        </h1>
      </div>

      {/* --------------------------------------------------
         Progress Preview
      -------------------------------------------------- */}

      <section className={styles.progress}>
        <h2>
          Your progress at - {OPERATIONS[operation].name} Level {level}
        </h2>

        {!progress.hasHistory ? (
          <div className={styles.noHistory}>
            <p>We don't have a record of you taking this test.</p>

            <p>Log in to save your test scores and track your progress.</p>
          </div>
        ) : (
          <>
            <div className={styles.stats}>
              <div>
                <div className={styles.statValue}>{progress.accuracy}%</div>

                <span>Accuracy</span>
              </div>

              <div>
                <div className={styles.statValue}>
                  {progress.averageTime}
                  <span className={styles.statUnit}>s</span>
                </div>

                <span>Avg Reaction Time</span>
              </div>

              <div>
                <div className={styles.statValue}>{progress.attempts}</div>

                <span>Attempts</span>
              </div>
            </div>

            {/* --------------------------------------------------
               Most Recent Attempt
            -------------------------------------------------- */}

            {progress.lastAttempt && (
              <div className={styles.lastAttempt}>
                <p className={styles.lastTaken}>Last time you took this test: {formatLastAttempt(progress.lastAttempt.startedAt)}</p>

                {progress.lastAttemptResult.totalAnswered > 0 && (
                  <p className={styles.lastAttemptResult}>
                    {progress.lastAttemptResult.completed ? (
                      <>
                        {progress.lastAttemptResult.correct} / {progress.lastAttemptResult.totalAnswered} correct · {progress.lastAttemptResult.accuracy}% Accuracy · {progress.lastAttemptResult.averageTime}s average reaction time
                      </>
                    ) : (
                      <>
                        {progress.lastAttemptResult.totalAnswered} questions answered · {progress.lastAttemptResult.accuracy}% · {progress.lastAttemptResult.averageTime}s avg
                      </>
                    )}
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </section>

      {/* --------------------------------------------------
         Start Practice
      -------------------------------------------------- */}

      <div className={styles.startButton}>
        <button
          className={styles.btnPrimary}
          onClick={onStart}
        >
          Start Practice
        </button>
      </div>
    </>
  );
}
