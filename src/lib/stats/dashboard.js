// src/lib/stats/dashboard.js

import { getQuizAttempts } from "@/lib/storage/quizHistory";

/* --------------------------------------------------
   Configuration
-------------------------------------------------- */

const DASHBOARD_DAYS = 30;

/* --------------------------------------------------
   Get Local Date Key
-------------------------------------------------- */

function getLocalDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/* --------------------------------------------------
   Get Date Key For Previous Day
-------------------------------------------------- */

function getDaysAgoDateKey(daysAgo) {
  const date = new Date();

  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - daysAgo);

  return getLocalDateKey(date);
}

/* --------------------------------------------------
   Format Relative Last-Use Time
-------------------------------------------------- */

export function formatLastUse(timestamp) {
  if (!timestamp) {
    return "Play now";
  }

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "Play now";
  }

  const now = new Date();
  const differenceMs = now.getTime() - date.getTime();

  if (differenceMs < 0) {
    return "Used just now";
  }

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const month = 30 * day;
  const year = 365 * day;

  /* ------------------------------------------------
     Less Than One Minute
  ------------------------------------------------ */

  if (differenceMs < minute) {
    return "Used just now";
  }

  /* ------------------------------------------------
     Minutes
  ------------------------------------------------ */

  if (differenceMs < hour) {
    const minutes = Math.floor(differenceMs / minute);

    return `Used ${minutes}m ago`;
  }

  /* ------------------------------------------------
     Hours
  ------------------------------------------------ */

  if (differenceMs < day) {
    const hours = Math.floor(differenceMs / hour);

    return `Used ${hours}h ago`;
  }

  /* ------------------------------------------------
     Calendar Yesterday
  ------------------------------------------------ */

  const yesterday = getDaysAgoDateKey(1);
  const practiceDate = getLocalDateKey(date);

  if (practiceDate === yesterday) {
    return "Used yesterday";
  }

  /* ------------------------------------------------
     Days
  ------------------------------------------------ */

  if (differenceMs < month) {
    const days = Math.floor(differenceMs / day);

    return `Used ${days}d ago`;
  }

  /* ------------------------------------------------
     Months
  ------------------------------------------------ */

  if (differenceMs < year) {
    const months = Math.floor(differenceMs / month);

    return `Used ${months}mo ago`;
  }

  /* ------------------------------------------------
     Years
  ------------------------------------------------ */

  const years = Math.floor(differenceMs / year);

  return `Used ${years}y ago`;
}

/* --------------------------------------------------
   Get Answered Questions
-------------------------------------------------- */

function getAnsweredQuestions(attempts, operation, level) {
  return attempts
    .filter((attempt) => attempt.operation === operation && Number(attempt.level) === Number(level))
    .flatMap((attempt) => attempt.questions ?? [])
    .filter((question) => question && question.selectedAnswer !== undefined && question.selectedAnswer !== null);
}

/* --------------------------------------------------
   Get Last Use Timestamp
-------------------------------------------------- */

function getLastUseTimestamp(attempts, operation, level) {
  const matchingAttempts = attempts.filter((attempt) => attempt.operation === operation && Number(attempt.level) === Number(level) && Array.isArray(attempt.questions) && attempt.questions.length > 0).sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());

  return matchingAttempts[0]?.startedAt ?? null;
}

/* --------------------------------------------------
   Get Level Statistics
-------------------------------------------------- */

export function getDashboardLevelStats(operation, level) {
  const attempts = getQuizAttempts();

  const questions = getAnsweredQuestions(attempts, operation, level);

  const correctQuestions = questions.filter((question) => question.correct === true);

  const reactionTimes = correctQuestions.map((question) => Number(question.time)).filter((time) => Number.isFinite(time) && time >= 0);

  const accuracy = questions.length > 0 ? Math.round((correctQuestions.length / questions.length) * 100) : null;

  const averageReactionTime = reactionTimes.length > 0 ? reactionTimes.reduce((total, time) => total + time, 0) / reactionTimes.length : null;

  const lastUseTimestamp = getLastUseTimestamp(attempts, operation, level);

  return {
    lastUseTimestamp,
    lastUse: formatLastUse(lastUseTimestamp),
    accuracy,
    reactionTime: averageReactionTime,
    questions: questions.length,
  };
}

/* --------------------------------------------------
   Get Thirty-Day Activity
-------------------------------------------------- */

export function getDashboardActivity() {
  const attempts = getQuizAttempts();

  const activity = [];

  for (let daysAgo = DASHBOARD_DAYS - 1; daysAgo >= 0; daysAgo -= 1) {
    const dateKey = getDaysAgoDateKey(daysAgo);

    let questions = 0;
    let correct = 0;

    attempts.forEach((attempt) => {
      if (!attempt.startedAt || !Array.isArray(attempt.questions)) {
        return;
      }

      const attemptDate = getLocalDateKey(new Date(attempt.startedAt));

      if (attemptDate !== dateKey) {
        return;
      }

      attempt.questions.forEach((question) => {
        if (question.selectedAnswer === undefined || question.selectedAnswer === null) {
          return;
        }

        questions += 1;

        if (question.correct === true) {
          correct += 1;
        }
      });
    });

    activity.push({
      date: dateKey,
      questions,
      correct,
    });
  }

  return activity;
}

/* --------------------------------------------------
   Get Practice Distribution
-------------------------------------------------- */

export function getPracticeDistribution() {
  const attempts = getQuizAttempts();

  const distribution = {};

  attempts.forEach((attempt) => {
    if (!attempt.operation || !Array.isArray(attempt.questions)) {
      return;
    }

    const answeredQuestions = attempt.questions.filter((question) => question && question.selectedAnswer !== undefined && question.selectedAnswer !== null).length;

    if (answeredQuestions === 0) {
      return;
    }

    distribution[attempt.operation] = (distribution[attempt.operation] ?? 0) + answeredQuestions;
  });

  return distribution;
}
