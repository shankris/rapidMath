// src/lib/stats/targetedPractice.js

import { getQuizAttemptsByLevel } from "../storage/quizHistory";

/* --------------------------------------------------
   Targeted Practice Configuration
-------------------------------------------------- */

const TARGETING_DAYS = 30;

/* --------------------------------------------------
   Get Targeting Start Date
-------------------------------------------------- */

function getTargetingStartDate() {
  const date = new Date();

  date.setDate(date.getDate() - TARGETING_DAYS);

  return date;
}

/* --------------------------------------------------
   Calculate Average
-------------------------------------------------- */

function calculateAverage(values) {
  if (values.length === 0) {
    return 0;
  }

  const total = values.reduce((sum, value) => sum + value, 0);

  return total / values.length;
}

/* --------------------------------------------------
   Calculate Standard Deviation
-------------------------------------------------- */

function calculateStandardDeviation(values, average) {
  if (values.length === 0) {
    return 0;
  }

  const squaredDifferences = values.map((value) => (value - average) ** 2);

  const variance = squaredDifferences.reduce((sum, value) => sum + value, 0) / values.length;

  return Math.sqrt(variance);
}

/* --------------------------------------------------
   Get Recent Questions
-------------------------------------------------- */

function getRecentQuestions(operation, level) {
  const attempts = getQuizAttemptsByLevel(operation, level);
  const startDate = getTargetingStartDate();

  return attempts
    .filter((attempt) => {
      if (!attempt.startedAt) {
        return false;
      }

      const startedAt = new Date(attempt.startedAt);

      return !Number.isNaN(startedAt.getTime()) && startedAt >= startDate;
    })
    .flatMap((attempt) => (Array.isArray(attempt.questions) ? attempt.questions : []));
}

/* --------------------------------------------------
   Get Targeting Statistics
-------------------------------------------------- */

export function getTargetingStats(operation, level) {
  const questions = getRecentQuestions(operation, level);

  const incorrectQuestions = questions.filter((question) => question.correct !== true);

  const correctQuestions = questions.filter((question) => {
    const time = Number(question.time);

    return question.correct === true && Number.isFinite(time) && time > 0;
  });

  const correctTimes = correctQuestions.map((question) => Number(question.time));

  const averageCorrectTime = calculateAverage(correctTimes);

  const standardDeviation = calculateStandardDeviation(correctTimes, averageCorrectTime);

  const slowCorrectQuestions = correctQuestions
    .filter((question) => Number(question.time) > averageCorrectTime)
    .map((question) => {
      const time = Number(question.time);

      const standardDeviations = standardDeviation > 0 ? (time - averageCorrectTime) / standardDeviation : 0;

      return {
        ...question,
        time,
        standardDeviations,
      };
    })
    .sort((a, b) => b.standardDeviations - a.standardDeviations);

  return {
    questions,
    incorrectQuestions,
    correctQuestions,

    averageCorrectTime,
    standardDeviation,

    slowCorrectQuestions,
  };
}
