// src/lib/stats/operationStats.js

import { getQuizAttempts } from "../storage/quizHistory";
import { getMonthlyStats } from "../storage/monthlyStats";

/* --------------------------------------------------
   Period Configuration
-------------------------------------------------- */

const PERIOD_DAYS = {
  "1w": 7,
  "2w": 14,
  "1m": 30,
  "3m": 90,
  "6m": 180,
  "1y": 365,
};

/* --------------------------------------------------
   Operation Configuration
-------------------------------------------------- */

const OPERATIONS = ["add", "sub", "mul", "div"];

/* --------------------------------------------------
   Date Helpers
-------------------------------------------------- */

function getDateDaysAgo(days) {
  const date = new Date();

  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - days);

  return date;
}

/* --------------------------------------------------
   Create Empty Operation Statistics
-------------------------------------------------- */

function createEmptyStats() {
  return {
    testsCompleted: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
    totalTime: 0,
  };
}

/* --------------------------------------------------
   Create Empty Operation Results
-------------------------------------------------- */

function createEmptyOperationStats() {
  return {
    add: createEmptyStats(),
    sub: createEmptyStats(),
    mul: createEmptyStats(),
    div: createEmptyStats(),
  };
}

/* --------------------------------------------------
   Filter Attempts By Period
-------------------------------------------------- */

function getAttemptsForPeriod(attempts, period) {
  const days = PERIOD_DAYS[period];

  if (!days) {
    return attempts;
  }

  const startDate = getDateDaysAgo(days - 1);

  return attempts.filter((attempt) => {
    return new Date(attempt.startedAt) >= startDate;
  });
}

/* --------------------------------------------------
   Calculate Statistics From Attempts
-------------------------------------------------- */

function calculateAttemptStats(attempts) {
  const statistics = createEmptyOperationStats();

  attempts.forEach((attempt) => {
    const operation = attempt.operation;

    if (!statistics[operation]) {
      return;
    }

    statistics[operation].testsCompleted += 1;

    attempt.questions.forEach((question) => {
      statistics[operation].questionsAnswered += 1;

      if (question.correct) {
        statistics[operation].correctAnswers += 1;
      }

      statistics[operation].totalTime += question.time || 0;
    });
  });

  return statistics;
}

/* --------------------------------------------------
   Calculate Statistics From Monthly Summaries
-------------------------------------------------- */

function calculateMonthlyStats(monthlyStats) {
  const statistics = createEmptyOperationStats();

  monthlyStats.forEach((month) => {
    Object.entries(month.operations || {}).forEach(([operation, data]) => {
      if (!statistics[operation]) {
        return;
      }

      statistics[operation].testsCompleted += data.testsCompleted || 0;

      statistics[operation].questionsAnswered += data.questionsAnswered || 0;

      statistics[operation].correctAnswers += data.correctAnswers || 0;

      statistics[operation].totalTime += data.totalTime || 0;
    });
  });

  return statistics;
}

/* --------------------------------------------------
   Combine Operation Statistics
-------------------------------------------------- */

function combineStats(recentStats, olderStats) {
  const combined = createEmptyOperationStats();

  OPERATIONS.forEach((operation) => {
    combined[operation].testsCompleted = recentStats[operation].testsCompleted + olderStats[operation].testsCompleted;

    combined[operation].questionsAnswered = recentStats[operation].questionsAnswered + olderStats[operation].questionsAnswered;

    combined[operation].correctAnswers = recentStats[operation].correctAnswers + olderStats[operation].correctAnswers;

    combined[operation].totalTime = recentStats[operation].totalTime + olderStats[operation].totalTime;
  });

  return combined;
}

/* --------------------------------------------------
   Format Operation Statistics
-------------------------------------------------- */

function formatStats(statistics) {
  const formatted = {};

  OPERATIONS.forEach((operation) => {
    const data = statistics[operation];

    const accuracy = data.questionsAnswered > 0 ? (data.correctAnswers / data.questionsAnswered) * 100 : 0;

    const averageTime = data.questionsAnswered > 0 ? data.totalTime / data.questionsAnswered : 0;

    formatted[operation] = {
      accuracy: Number(accuracy.toFixed(1)),

      averageTime: Number(averageTime.toFixed(2)),

      testsCompleted: data.testsCompleted,

      questionsAnswered: data.questionsAnswered,
    };
  });

  return formatted;
}

/* --------------------------------------------------
   Calculate All-Time Operation Statistics
-------------------------------------------------- */

function calculateAllTimeStats() {
  const monthlyStats = getMonthlyStats();

  const statistics = calculateMonthlyStats(monthlyStats);

  return formatStats(statistics);
}

/* --------------------------------------------------
   Calculate Long-Period Operation Statistics
-------------------------------------------------- */

function calculateLongPeriodStats(period) {
  const attempts = getQuizAttempts();
  const monthlyStats = getMonthlyStats();

  /* ----------------------------------------------
     Recent detailed attempts
     
     Detailed quiz attempts are retained
     for approximately 30 days.
  ---------------------------------------------- */

  const recentAttempts = getAttemptsForPeriod(attempts, "1m");

  const recentStats = calculateAttemptStats(recentAttempts);

  /* ----------------------------------------------
     Older monthly summaries
     
     Use monthly operation summaries for
     history before the detailed-attempt
     retention window.
  ---------------------------------------------- */

  const retentionStart = getDateDaysAgo(29);

  const periodStart = getDateDaysAgo(PERIOD_DAYS[period] - 1);

  const olderMonths = monthlyStats.filter((month) => {
    if (!month.month) {
      return false;
    }

    const monthDate = new Date(`${month.month}-01T12:00:00`);

    return monthDate < retentionStart && monthDate >= periodStart;
  });

  const olderStats = calculateMonthlyStats(olderMonths);

  return combineStats(recentStats, olderStats);
}

/* --------------------------------------------------
   Get Operation Statistics
-------------------------------------------------- */

export function getOperationStats(period = "1m") {
  /* ----------------------------------------------
     All-Time Statistics
  ---------------------------------------------- */

  if (period === "all") {
    return {
      ...calculateAllTimeStats(),
      period,
    };
  }

  /* ----------------------------------------------
     Short Periods
     
     Up to 30 days can use the detailed
     quiz attempts directly.
  ---------------------------------------------- */

  if (PERIOD_DAYS[period] <= 30) {
    const attempts = getQuizAttempts();

    const filteredAttempts = getAttemptsForPeriod(attempts, period);

    const statistics = calculateAttemptStats(filteredAttempts);

    return {
      ...formatStats(statistics),
      period,
    };
  }

  /* ----------------------------------------------
     Long Periods
     
     Combine recent detailed attempts with
     older monthly summaries.
  ---------------------------------------------- */

  const statistics = calculateLongPeriodStats(period);

  return {
    ...formatStats(statistics),
    period,
  };
}
