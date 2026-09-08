// src/lib/stats/dashboardStats.js

import { getQuizAttempts } from "../storage/quizHistory";
import { getDailyActivity } from "../storage/dailyActivity";
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
   Date Helpers
-------------------------------------------------- */

function getDateDaysAgo(days) {
  const date = new Date();

  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - days);

  return date;
}

/* --------------------------------------------------
   Get First Practice Date
-------------------------------------------------- */

function getFirstPracticeDate() {
  const attempts = getQuizAttempts();
  const dailyActivity = getDailyActivity();
  const monthlyStats = getMonthlyStats();

  const dates = [];

  attempts.forEach((attempt) => {
    if (attempt.startedAt) {
      dates.push(new Date(attempt.startedAt));
    }
  });

  dailyActivity.forEach((day) => {
    if (day.date) {
      dates.push(new Date(`${day.date}T12:00:00`));
    }
  });

  monthlyStats.forEach((month) => {
    if (month.month) {
      dates.push(new Date(`${month.month}-01T12:00:00`));
    }
  });

  if (dates.length === 0) {
    return null;
  }

  return new Date(Math.min(...dates.map((date) => date.getTime())));
}

/* --------------------------------------------------
   Get History Age
-------------------------------------------------- */

function getHistoryDays() {
  const firstPracticeDate = getFirstPracticeDate();

  if (!firstPracticeDate) {
    return 0;
  }

  const today = new Date();

  today.setHours(0, 0, 0, 0);
  firstPracticeDate.setHours(0, 0, 0, 0);

  const difference = today.getTime() - firstPracticeDate.getTime();

  return Math.floor(difference / (1000 * 60 * 60 * 24)) + 1;
}

/* --------------------------------------------------
   Get Available Periods
-------------------------------------------------- */

export function getAvailablePeriods() {
  const historyDays = getHistoryDays();

  if (historyDays < 7) {
    return [];
  }

  const periods = [];

  Object.entries(PERIOD_DAYS).forEach(([period, days]) => {
    if (historyDays >= days) {
      periods.push(period);
    }
  });

  periods.push("all");

  return periods;
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
  let questionsAnswered = 0;
  let correctAnswers = 0;
  let totalTime = 0;

  attempts.forEach((attempt) => {
    attempt.questions.forEach((question) => {
      questionsAnswered += 1;

      if (question.correct) {
        correctAnswers += 1;
      }

      totalTime += question.time;
    });
  });

  const accuracy = questionsAnswered > 0 ? (correctAnswers / questionsAnswered) * 100 : 0;

  const averageTime = questionsAnswered > 0 ? totalTime / questionsAnswered : 0;

  return {
    accuracy: Number(accuracy.toFixed(1)),

    averageTime: Number(averageTime.toFixed(2)),

    testsCompleted: attempts.length,

    questionsAnswered,

    correctAnswers,

    totalTime,
  };
}

/* --------------------------------------------------
   Calculate Statistics From Daily Activity
-------------------------------------------------- */

function calculateDailyActivityStats(activity) {
  let questionsAnswered = 0;
  let correctAnswers = 0;
  let totalTime = 0;
  let testsCompleted = 0;

  activity.forEach((day) => {
    questionsAnswered += day.questions || 0;

    correctAnswers += day.correct || 0;

    totalTime += day.totalTime || 0;

    testsCompleted += day.tests || 0;
  });

  return {
    questionsAnswered,
    correctAnswers,
    totalTime,
    testsCompleted,
  };
}

/* --------------------------------------------------
   Get Daily Activity Before Date
-------------------------------------------------- */

function getDailyActivityBefore(activity, date) {
  return activity.filter((day) => {
    const dayDate = new Date(`${day.date}T12:00:00`);

    return dayDate < date;
  });
}

/* --------------------------------------------------
   Combine Statistics
-------------------------------------------------- */

function combineStats(recentStats, olderStats) {
  const questionsAnswered = recentStats.questionsAnswered + olderStats.questionsAnswered;

  const correctAnswers = recentStats.correctAnswers + olderStats.correctAnswers;

  const totalTime = recentStats.totalTime + olderStats.totalTime;

  return {
    accuracy: questionsAnswered > 0 ? Number(((correctAnswers / questionsAnswered) * 100).toFixed(1)) : 0,

    averageTime: questionsAnswered > 0 ? Number((totalTime / questionsAnswered).toFixed(2)) : 0,

    testsCompleted: recentStats.testsCompleted + olderStats.testsCompleted,

    questionsAnswered,
  };
}

/* --------------------------------------------------
   Calculate Long-Period Statistics
-------------------------------------------------- */

function calculateLongPeriodStats(period) {
  const attempts = getQuizAttempts();

  const dailyActivity = getDailyActivity();

  /*
    Recent detailed attempts are retained
    for 30 days.
  */

  const recentAttempts = getAttemptsForPeriod(attempts, "1m");

  /*
    Anything before the detailed-attempt
    retention window comes from daily activity.
  */

  const retentionStart = getDateDaysAgo(29);

  const periodStart = getDateDaysAgo(PERIOD_DAYS[period] - 1);

  const olderActivity = getDailyActivityBefore(dailyActivity, retentionStart).filter((day) => {
    const dayDate = new Date(`${day.date}T12:00:00`);

    return dayDate >= periodStart;
  });

  const recentStats = calculateAttemptStats(recentAttempts);

  const olderStats = calculateDailyActivityStats(olderActivity);

  return combineStats(recentStats, olderStats);
}

/* --------------------------------------------------
   Calculate All-Time Statistics
-------------------------------------------------- */

function calculateAllTimeStats() {
  const monthlyStats = getMonthlyStats();

  let testsCompleted = 0;
  let questionsAnswered = 0;
  let correctAnswers = 0;
  let totalTime = 0;

  monthlyStats.forEach((month) => {
    testsCompleted += month.testsCompleted || 0;

    questionsAnswered += month.questionsAnswered || 0;

    correctAnswers += month.correctAnswers || 0;

    Object.values(month.operations || {}).forEach((operation) => {
      totalTime += operation.totalTime || 0;
    });
  });

  const accuracy = questionsAnswered > 0 ? (correctAnswers / questionsAnswered) * 100 : 0;

  const averageTime = questionsAnswered > 0 ? totalTime / questionsAnswered : 0;

  return {
    accuracy: Number(accuracy.toFixed(1)),

    averageTime: Number(averageTime.toFixed(2)),

    testsCompleted,

    questionsAnswered,
  };
}

/* --------------------------------------------------
   Get Dashboard Statistics
-------------------------------------------------- */

export function getDashboardStats(period = "1m") {
  const availablePeriods = getAvailablePeriods();

  /*
    If the requested period isn't available,
    fall back to the longest available period.
  */

  if (period !== "all" && !availablePeriods.includes(period)) {
    period = availablePeriods[availablePeriods.length - 2] ?? "all";
  }

  /* ------------------------------------------------
     All-Time Statistics
  ------------------------------------------------ */

  if (period === "all") {
    return {
      ...calculateAllTimeStats(),
      period,
    };
  }

  /* ------------------------------------------------
     Short Periods
     Use detailed quiz attempts.
  ------------------------------------------------ */

  if (PERIOD_DAYS[period] <= 30) {
    const attempts = getQuizAttempts();

    const filteredAttempts = getAttemptsForPeriod(attempts, period);

    const stats = calculateAttemptStats(filteredAttempts);

    return {
      accuracy: stats.accuracy,

      averageTime: stats.averageTime,

      testsCompleted: stats.testsCompleted,

      questionsAnswered: stats.questionsAnswered,

      period,
    };
  }

  /* ------------------------------------------------
     Long Periods
     Combine detailed attempts and
     daily activity.
  ------------------------------------------------ */

  const stats = calculateLongPeriodStats(period);

  return {
    accuracy: stats.accuracy,

    averageTime: stats.averageTime,

    testsCompleted: stats.testsCompleted,

    questionsAnswered: stats.questionsAnswered,

    period,
  };
}
