// src/lib/stats/targetedScoring.js

import { getQuizAttemptsByLevel } from "../storage/quizHistory";
import { getTargetedPatterns } from "./targetedPatterns";

/* --------------------------------------------------
   Targeting Configuration
-------------------------------------------------- */

const TARGETING_DAYS = 30;

/* --------------------------------------------------
   Date Helpers
-------------------------------------------------- */

function getTargetingStartDate() {
  const date = new Date();
  date.setDate(date.getDate() - TARGETING_DAYS);

  return date;
}

/* --------------------------------------------------
   Statistics Helpers
-------------------------------------------------- */

function calculateAverage(values) {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function calculateStandardDeviation(values, average) {
  if (values.length === 0) {
    return 0;
  }

  const variance = values.reduce((sum, value) => sum + (value - average) ** 2, 0) / values.length;

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
    .flatMap((attempt) => (Array.isArray(attempt.questions) ? attempt.questions : []))
    .filter((question) => question.questionData);
}

/* --------------------------------------------------
   Calculate User Timing Baseline
-------------------------------------------------- */

function getCorrectBaseline(questions) {
  const correctTimes = questions
    .filter((question) => question.correct === true)
    .map((question) => Number(question.time))
    .filter((time) => Number.isFinite(time) && time > 0);

  const average = calculateAverage(correctTimes);
  const standardDeviation = calculateStandardDeviation(correctTimes, average);

  return {
    average,
    standardDeviation,
    count: correctTimes.length,
  };
}

/* --------------------------------------------------
   Calculate Standard Deviations
-------------------------------------------------- */

function getStandardDeviations(time, average, standardDeviation) {
  if (standardDeviation === 0) {
    return time > average ? 1 : 0;
  }

  return (time - average) / standardDeviation;
}

/* --------------------------------------------------
   Determine Pattern Priority
-------------------------------------------------- */

function getPatternPriority(incorrect, slowCorrect) {
  if (incorrect > 0 && slowCorrect > 0) {
    return 1;
  }

  if (incorrect > 0) {
    return 2;
  }

  if (slowCorrect > 0) {
    return 3;
  }

  return 4;
}

/* --------------------------------------------------
   Score Individual Pattern
-------------------------------------------------- */

function scorePattern(pattern, baseline) {
  const records = Array.isArray(pattern.questionRecords) ? pattern.questionRecords : [];

  const incorrectRecords = records.filter((record) => record.correct !== true);

  const correctRecords = records.filter((record) => record.correct === true);

  const slowCorrectRecords = correctRecords.filter((record) => {
    const time = Number(record.time);

    if (!Number.isFinite(time) || time <= 0) {
      return false;
    }

    const standardDeviations = getStandardDeviations(time, baseline.average, baseline.standardDeviation);

    return standardDeviations > 0;
  });

  const correctTimes = correctRecords.map((record) => Number(record.time)).filter((time) => Number.isFinite(time) && time > 0);

  const averageCorrectTime = calculateAverage(correctTimes);

  const standardDeviations = correctRecords.map((record) => {
    const time = Number(record.time);

    if (!Number.isFinite(time) || time <= 0) {
      return 0;
    }

    return getStandardDeviations(time, baseline.average, baseline.standardDeviation);
  });

  const maxStandardDeviations = standardDeviations.length > 0 ? Math.max(...standardDeviations) : 0;

  const incorrectRate = pattern.occurrences > 0 ? incorrectRecords.length / pattern.occurrences : 0;

  const slowCorrectRate = correctRecords.length > 0 ? slowCorrectRecords.length / correctRecords.length : 0;

  const priority = getPatternPriority(incorrectRecords.length, slowCorrectRecords.length);

  return {
    ...pattern,

    incorrect: incorrectRecords.length,
    correct: correctRecords.length,
    slowCorrect: slowCorrectRecords.length,

    incorrectRate: Number(incorrectRate.toFixed(3)),

    slowCorrectRate: Number(slowCorrectRate.toFixed(3)),

    averageCorrectTime: Number(averageCorrectTime.toFixed(2)),

    maxStandardDeviations: Number(maxStandardDeviations.toFixed(2)),

    priority,
  };
}

/* --------------------------------------------------
   Get Targeted Pattern Scores
-------------------------------------------------- */

export function getTargetedPatternScores(operation, level) {
  const questions = getRecentQuestions(operation, level);

  const baseline = getCorrectBaseline(questions);

  const patterns = getTargetedPatterns(operation, level);

  const scoredPatterns = patterns.map((pattern) => scorePattern(pattern, baseline));

  return {
    operation,
    level: Number(level),

    baseline: {
      averageCorrectTime: Number(baseline.average.toFixed(2)),

      standardDeviation: Number(baseline.standardDeviation.toFixed(2)),

      correctQuestions: baseline.count,
    },

    patterns: scoredPatterns.sort((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }

      if (a.incorrectRate !== b.incorrectRate) {
        return b.incorrectRate - a.incorrectRate;
      }

      return b.slowCorrectRate - a.slowCorrectRate;
    }),
  };
}
