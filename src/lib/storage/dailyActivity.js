// src/lib/storage/dailyActivity.js

import { getQuizAttempts } from "@/lib/storage/quizHistory";

/* --------------------------------------------------
   Date Helpers
-------------------------------------------------- */

function getLocalDateKey(timestamp) {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/* --------------------------------------------------
   Count Correct Answers
-------------------------------------------------- */

function getCorrectAnswers(questions) {
  if (!Array.isArray(questions)) {
    return 0;
  }

  return questions.filter((question) => question && question.selectedAnswer !== undefined && question.selectedAnswer !== null && question.isCorrect === true).length;
}

/* --------------------------------------------------
   Count Answered Questions
-------------------------------------------------- */

function getAnsweredQuestions(questions) {
  if (!Array.isArray(questions)) {
    return 0;
  }

  return questions.filter((question) => question && question.selectedAnswer !== undefined && question.selectedAnswer !== null).length;
}

/* --------------------------------------------------
   Get Daily Activity
-------------------------------------------------- */

export function getDailyActivity() {
  if (typeof window === "undefined") {
    return [];
  }

  const attempts = getQuizAttempts();

  const activityMap = new Map();

  attempts.forEach((attempt) => {
    if (!attempt?.startedAt) {
      return;
    }

    const date = getLocalDateKey(attempt.startedAt);

    if (!date) {
      return;
    }

    const questions = getAnsweredQuestions(attempt.questions);
    const correct = getCorrectAnswers(attempt.questions);

    if (questions === 0) {
      return;
    }

    const existingDay = activityMap.get(date);

    if (existingDay) {
      existingDay.questions += questions;
      existingDay.correct += correct;
      existingDay.tests += 1;
      existingDay.totalTime += Number(attempt.totalTime) || 0;

      return;
    }

    activityMap.set(date, {
      date,
      questions,
      correct,
      tests: 1,
      totalTime: Number(attempt.totalTime) || 0,
    });
  });

  return Array.from(activityMap.values()).sort((a, b) => a.date.localeCompare(b.date));
}

/* --------------------------------------------------
   Legacy Compatibility
-------------------------------------------------- */

/*
   Daily activity is now derived directly from quiz history.

   These functions are kept as no-ops temporarily so that
   any existing imports do not break while the application
   transitions away from the old dailyActivity storage.
*/

export function saveDailyActivity() {
  // Daily activity is derived from quiz history.
}

export function clearDailyActivity() {
  // Daily activity is derived from quiz history.
}
