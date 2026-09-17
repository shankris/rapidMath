// src/lib/stats/reactionTime.js

import { getQuizAttempts } from "@/lib/storage/quizHistory";

/* --------------------------------------------------
   Date Helpers
-------------------------------------------------- */

function getLocalDateKey(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return null;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getDaysAgoDateKey(daysAgo) {
  const date = new Date();

  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - daysAgo);

  return getLocalDateKey(date);
}

/* --------------------------------------------------
   Create 30-Day Calendar Range
-------------------------------------------------- */

function getLast30Days() {
  return Array.from({ length: 30 }, (_, index) => getDaysAgoDateKey(29 - index));
}

/* --------------------------------------------------
   Determine Shared Active Date Range
-------------------------------------------------- */

export function getPerformanceDateRange(operation, level) {
  const attempts = getQuizAttempts();
  const days = getLast30Days();

  const activeDates = new Set();

  attempts.forEach((attempt) => {
    if (!attempt || attempt.operation !== operation || Number(attempt.level) !== Number(level) || !attempt.startedAt || !Array.isArray(attempt.questions)) {
      return;
    }

    const attemptDate = new Date(attempt.startedAt);
    const dateKey = getLocalDateKey(attemptDate);

    if (!dateKey || !days.includes(dateKey)) {
      return;
    }

    const hasAnsweredQuestion = attempt.questions.some((question) => question && question.selectedAnswer !== undefined && question.selectedAnswer !== null);

    if (hasAnsweredQuestion) {
      activeDates.add(dateKey);
    }
  });

  if (activeDates.size === 0) {
    return {
      startDate: null,
      endDate: null,
      activeDayCount: 0,
    };
  }

  const firstDataIndex = days.findIndex((date) => activeDates.has(date));

  const lastDataIndex = days.map((date) => activeDates.has(date)).lastIndexOf(true);

  if (firstDataIndex === -1 || lastDataIndex === -1) {
    return {
      startDate: null,
      endDate: null,
      activeDayCount: 0,
    };
  }

  return {
    startDate: days[firstDataIndex],
    endDate: days[lastDataIndex],
    activeDayCount: lastDataIndex - firstDataIndex + 1,
  };
}

/* --------------------------------------------------
   Get Reaction Time Trend
-------------------------------------------------- */

export function getReactionTimeTrend(operation, level) {
  const attempts = getQuizAttempts();
  const days = getLast30Days();

  const dayMap = new Map(
    days.map((date) => [
      date,
      {
        date,
        totalTime: 0,
        questionCount: 0,
      },
    ]),
  );

  attempts.forEach((attempt) => {
    if (!attempt || attempt.operation !== operation || Number(attempt.level) !== Number(level) || !attempt.startedAt || !Array.isArray(attempt.questions)) {
      return;
    }

    const attemptDate = new Date(attempt.startedAt);
    const dateKey = getLocalDateKey(attemptDate);

    if (!dateKey) {
      return;
    }

    const day = dayMap.get(dateKey);

    if (!day) {
      return;
    }

    attempt.questions.forEach((question) => {
      if (!question || question.correct !== true || !Number.isFinite(question.time) || question.time < 0) {
        return;
      }

      day.totalTime += question.time;
      day.questionCount += 1;
    });
  });

  const trend = days.map((date) => {
    const day = dayMap.get(date);

    return {
      date,
      average: day.questionCount > 0 ? day.totalTime / day.questionCount : null,
    };
  });

  /* ------------------------------------------------
     Shared Active Date Range
  ------------------------------------------------ */

  const dateRange = getPerformanceDateRange(operation, level);

  const totalTime = days.reduce((total, date) => total + (dayMap.get(date)?.totalTime ?? 0), 0);

  const totalQuestions = days.reduce((total, date) => total + (dayMap.get(date)?.questionCount ?? 0), 0);

  const overallAverage = totalQuestions > 0 ? totalTime / totalQuestions : null;

  return {
    operation,
    level: Number(level),
    days: trend,
    overallAverage,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    activeDayCount: dateRange.activeDayCount,
  };
}
