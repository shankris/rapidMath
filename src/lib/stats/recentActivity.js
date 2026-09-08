// src/lib/stats/recentActivity.js

import { getQuizAttempts } from "../storage/quizHistory";

/* --------------------------------------------------
   Configuration
-------------------------------------------------- */

const RECENT_ACTIVITY_DAYS = 30;

/* --------------------------------------------------
   Get Date Days Ago
-------------------------------------------------- */

function getDateDaysAgo(days) {
  const date = new Date();

  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - days);

  return date;
}

/* --------------------------------------------------
   Format Date
-------------------------------------------------- */

function formatDate(date) {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/* --------------------------------------------------
   Get Attempt Statistics
-------------------------------------------------- */

function calculateAttemptStats(attempt) {
  const questions = attempt.questions || [];

  const questionsAnswered = questions.length;

  const correct = questions.filter((question) => question.correct).length;

  const incorrect = questionsAnswered - correct;

  const totalTime = questions.reduce((total, question) => total + (question.time || 0), 0);

  const accuracy = questionsAnswered > 0 ? (correct / questionsAnswered) * 100 : 0;

  const averageTime = questionsAnswered > 0 ? totalTime / questionsAnswered : 0;

  return {
    id: attempt.id,

    operation: attempt.operation,

    level: attempt.level,

    questions: questionsAnswered,

    correct,

    incorrect,

    accuracy: Number(accuracy.toFixed(1)),

    averageTime: Number(averageTime.toFixed(2)),

    totalTime: Number(totalTime.toFixed(2)),

    startedAt: attempt.startedAt,

    completedAt: attempt.completedAt,
  };
}

/* --------------------------------------------------
   Get Recent Attempts
-------------------------------------------------- */

export function getRecentAttempts() {
  const attempts = getQuizAttempts();

  const startDate = getDateDaysAgo(RECENT_ACTIVITY_DAYS - 1);

  return attempts
    .filter((attempt) => {
      if (attempt.status !== "completed") {
        return false;
      }

      if (!attempt.startedAt) {
        return false;
      }

      return new Date(attempt.startedAt) >= startDate;
    })
    .map(calculateAttemptStats)
    .sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));
}

/* --------------------------------------------------
   Group Attempts By Date
-------------------------------------------------- */

export function getRecentActivity() {
  const attempts = getRecentAttempts();

  const activityMap = new Map();

  attempts.forEach((attempt) => {
    const date = formatDate(new Date(attempt.startedAt));

    if (!activityMap.has(date)) {
      activityMap.set(date, {
        date,
        tests: [],
      });
    }

    activityMap.get(date).tests.push(attempt);
  });

  return Array.from(activityMap.values()).sort((a, b) => new Date(b.date) - new Date(a.date));
}
