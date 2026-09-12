import { getQuizAttempts } from "../storage/quizHistory";

/* --------------------------------------------------
   Review Configuration
-------------------------------------------------- */

const MINIMUM_QUESTIONS = 50;
const MAX_LEVELS_PER_OPERATION = 4;

/* --------------------------------------------------
   Calculate Attempt Statistics
-------------------------------------------------- */

function calculateAttemptStats(attempt) {
  const questions = Array.isArray(attempt.questions) ? attempt.questions : [];

  const answered = questions.length;

  // An attempt with no answered questions is not learning data.
  if (answered === 0) {
    return null;
  }

  const correctQuestions = questions.filter((question) => question.correct === true);

  const incorrect = answered - correctQuestions.length;

  const totalTime = questions.reduce((total, question) => total + (Number(question.time) || 0), 0);

  const correctTime = correctQuestions.reduce((total, question) => total + (Number(question.time) || 0), 0);

  const correct = correctQuestions.length;

  const accuracy = (correct / answered) * 100;

  const averageTime = totalTime / answered;

  const averageCorrectTime = correct > 0 ? correctTime / correct : 0;

  return {
    id: attempt.id,
    operation: attempt.operation,
    level: Number(attempt.level),
    status: attempt.status ?? "unknown",

    startedAt: attempt.startedAt,
    completedAt: attempt.completedAt ?? null,

    answered,
    correct,
    incorrect,

    accuracy: Number(accuracy.toFixed(1)),

    // All answered questions.
    averageTime: Number(averageTime.toFixed(2)),
    totalTime: Number(totalTime.toFixed(2)),

    // Correct answers only.
    averageCorrectTime: Number(averageCorrectTime.toFixed(2)),
    correctTime: Number(correctTime.toFixed(2)),

    questions,
  };
}

/* --------------------------------------------------
   Group Attempts By Operation + Level
-------------------------------------------------- */

function groupAttempts(attempts) {
  const groups = new Map();

  attempts.forEach((attempt) => {
    const stats = calculateAttemptStats(attempt);

    if (!stats) {
      return;
    }

    const key = `${stats.operation}-${stats.level}`;

    if (!groups.has(key)) {
      groups.set(key, {
        operation: stats.operation,
        level: stats.level,

        attempts: [],

        completedAttempts: 0,
        incompleteAttempts: 0,

        questions: 0,
        correct: 0,
        incorrect: 0,

        totalTime: 0,
        correctTime: 0,
      });
    }

    const group = groups.get(key);

    group.attempts.push(stats);

    if (stats.status === "completed") {
      group.completedAttempts += 1;
    } else if (stats.status === "in_progress") {
      group.incompleteAttempts += 1;
    }

    group.questions += stats.answered;
    group.correct += stats.correct;
    group.incorrect += stats.incorrect;

    group.totalTime += stats.totalTime;
    group.correctTime += stats.correctTime;
  });

  return groups;
}

/* --------------------------------------------------
   Build Review Summary
-------------------------------------------------- */

function buildReviewSummary(group) {
  const history = [...group.attempts].sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));

  const accuracy = group.questions > 0 ? (group.correct / group.questions) * 100 : 0;

  const averageTime = group.questions > 0 ? group.totalTime / group.questions : 0;

  const averageCorrectTime = group.correct > 0 ? group.correctTime / group.correct : 0;

  return {
    operation: group.operation,
    level: group.level,

    /* --------------------------------------------------
       Activity Counts
    -------------------------------------------------- */

    attempts: group.attempts.length,
    completedAttempts: group.completedAttempts,
    incompleteAttempts: group.incompleteAttempts,

    /* --------------------------------------------------
       Learning Totals
    -------------------------------------------------- */

    questions: group.questions,
    correct: group.correct,
    incorrect: group.incorrect,

    accuracy: Number(accuracy.toFixed(1)),

    /* --------------------------------------------------
       Timing
    -------------------------------------------------- */

    // Average across every answered question.
    averageTime: Number(averageTime.toFixed(2)),

    // Average across correct answers only.
    averageCorrectTime: Number(averageCorrectTime.toFixed(2)),

    totalTime: Number(group.totalTime.toFixed(2)),
    correctTime: Number(group.correctTime.toFixed(2)),

    /* --------------------------------------------------
       Latest Activity
    -------------------------------------------------- */

    latestAttempt: history[0] ?? null,
    latestActivity: history[0]?.startedAt ?? null,

    /* --------------------------------------------------
       History
    -------------------------------------------------- */

    history,
  };
}

/* --------------------------------------------------
   Build All Review Summaries
-------------------------------------------------- */

function getAllReviewSummaries() {
  const attempts = getQuizAttempts();

  const groups = groupAttempts(attempts);

  return Array.from(groups.values()).map(buildReviewSummary);
}

/* --------------------------------------------------
   Filter Review Levels For Overview
-------------------------------------------------- */

function filterReviewLevels(summaries) {
  const operationGroups = new Map();

  summaries.forEach((summary) => {
    // Levels with fewer than 50 answered questions
    // are not yet strong enough to appear in Review.
    if (summary.questions < MINIMUM_QUESTIONS) {
      return;
    }

    if (!operationGroups.has(summary.operation)) {
      operationGroups.set(summary.operation, []);
    }

    operationGroups.get(summary.operation).push(summary);
  });

  const filtered = [];

  operationGroups.forEach((levels) => {
    levels
      .sort((a, b) => new Date(b.latestActivity) - new Date(a.latestActivity))
      .slice(0, MAX_LEVELS_PER_OPERATION)
      .forEach((level) => {
        filtered.push(level);
      });
  });

  return filtered;
}

/* --------------------------------------------------
   Get Review Summary
-------------------------------------------------- */

export function getReviewSummary() {
  const summaries = getAllReviewSummaries();

  return filterReviewLevels(summaries).sort((a, b) => {
    if (a.operation !== b.operation) {
      return a.operation.localeCompare(b.operation);
    }

    return a.level - b.level;
  });
}

/* --------------------------------------------------
   Get Review For Operation + Level
-------------------------------------------------- */

export function getReviewForLevel(operation, level) {
  const summaries = getAllReviewSummaries();

  return summaries.find((summary) => summary.operation === operation && Number(summary.level) === Number(level)) ?? null;
}
