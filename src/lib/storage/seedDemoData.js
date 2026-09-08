// src/lib/storage/seedDemoData.js

import { saveQuizAttempt } from "./quizHistory";
import { saveDailyActivity } from "./dailyActivity";
import { saveMonthlyStats } from "./monthlyStats";

/* --------------------------------------------------
   Seed Configuration
-------------------------------------------------- */

const DAYS_OF_HISTORY = 365;
const DETAILED_ATTEMPT_DAYS = 30;

const QUESTIONS_PER_TEST = 20;

const OPERATIONS = ["add", "sub", "mul", "div"];

const LEVELS = [1, 2, 3, 4];

/* --------------------------------------------------
   Random Helpers
-------------------------------------------------- */

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem(items) {
  return items[randomNumber(0, items.length - 1)];
}

/* --------------------------------------------------
   Date Helpers
-------------------------------------------------- */

function getDateKey(date) {
  return date.toISOString().slice(0, 10);
}

function getMonthKey(date) {
  return date.toISOString().slice(0, 7);
}

function getDateDaysAgo(days) {
  const date = new Date();

  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() - days);

  return date;
}

/* --------------------------------------------------
   Generate Attempt ID
-------------------------------------------------- */

function generateAttemptId(timestamp) {
  const date = new Date(timestamp);

  const datePart = date.toISOString().slice(0, 10).replace(/-/g, "");

  const timePart = date.toTimeString().slice(0, 8).replace(/:/g, "");

  const randomPart = Math.random().toString(36).substring(2, 5);

  return `${datePart}-${timePart}-${randomPart}`;
}

/* --------------------------------------------------
   Generate Question ID
-------------------------------------------------- */

function generateQuestionId(operation, dayIndex, testIndex, questionIndex) {
  return ["demo", operation, dayIndex, testIndex, questionIndex].join("_");
}

/* --------------------------------------------------
   Generate Quiz Attempt
-------------------------------------------------- */

function generateQuizAttempt({ date, operation, level, dayIndex, testIndex, accuracy }) {
  const startedAt = new Date(date);

  startedAt.setHours(randomNumber(8, 20), randomNumber(0, 59), randomNumber(0, 59), 0);

  const questions = [];

  for (let questionIndex = 0; questionIndex < QUESTIONS_PER_TEST; questionIndex += 1) {
    const correct = Math.random() < accuracy;

    const time = Number((randomNumber(15, 45) / 10).toFixed(2));

    questions.push({
      id: generateQuestionId(operation, dayIndex, testIndex, questionIndex),
      correct,
      time,
    });
  }

  const totalTime = questions.reduce((sum, question) => sum + question.time, 0);

  const completedAt = startedAt.getTime() + totalTime * 1000;

  return {
    id: generateAttemptId(startedAt.getTime()),

    operation,
    level,

    startedAt: startedAt.getTime(),
    completedAt,

    status: "completed",

    questions,
  };
}

/* --------------------------------------------------
   Generate Daily Activity
-------------------------------------------------- */

function generateDailyActivity({ date, tests, questions, correct, totalTime }) {
  return {
    date: getDateKey(date),
    tests,
    questions,
    correct,
    totalTime,
  };
}

/* --------------------------------------------------
   Generate Monthly Statistics
-------------------------------------------------- */

function createEmptyMonth(month) {
  return {
    month,

    testsCompleted: 0,
    questionsAnswered: 0,
    correctAnswers: 0,

    operations: {
      add: {
        testsCompleted: 0,
        questionsAnswered: 0,
        correctAnswers: 0,
        totalTime: 0,
      },

      sub: {
        testsCompleted: 0,
        questionsAnswered: 0,
        correctAnswers: 0,
        totalTime: 0,
      },

      mul: {
        testsCompleted: 0,
        questionsAnswered: 0,
        correctAnswers: 0,
        totalTime: 0,
      },

      div: {
        testsCompleted: 0,
        questionsAnswered: 0,
        correctAnswers: 0,
        totalTime: 0,
      },
    },
  };
}

/* --------------------------------------------------
   Add Attempt To Monthly Statistics
-------------------------------------------------- */

function addAttemptToMonth(monthStats, attempt) {
  const questions = attempt.questions;

  const correct = questions.filter((question) => question.correct).length;

  const totalTime = questions.reduce((sum, question) => sum + question.time, 0);

  monthStats.testsCompleted += 1;

  monthStats.questionsAnswered += questions.length;

  monthStats.correctAnswers += correct;

  /* ----------------------------------------------
     Operation Statistics
  ---------------------------------------------- */

  const operationStats = monthStats.operations[attempt.operation];

  if (!operationStats) {
    return;
  }

  operationStats.testsCompleted += 1;

  operationStats.questionsAnswered += questions.length;

  operationStats.correctAnswers += correct;

  operationStats.totalTime += totalTime;
}

/* --------------------------------------------------
   Seed Demo Data
-------------------------------------------------- */

export function seedDemoData() {
  /* ----------------------------------------------
     Prevent Accidental Server Execution
  ---------------------------------------------- */

  if (typeof window === "undefined") {
    return;
  }

  /* ----------------------------------------------
     Clear Existing Demo Data
     
     This makes repeated seeding predictable.
  ---------------------------------------------- */

  clearDemoData();

  /* ----------------------------------------------
     Storage Collections
  ---------------------------------------------- */

  const dailyActivity = [];
  const monthlyStatsMap = new Map();

  /* ----------------------------------------------
     Generate History
  ---------------------------------------------- */

  for (let dayIndex = DAYS_OF_HISTORY - 1; dayIndex >= 0; dayIndex -= 1) {
    const date = getDateDaysAgo(dayIndex);

    const month = getMonthKey(date);

    if (!monthlyStatsMap.has(month)) {
      monthlyStatsMap.set(month, createEmptyMonth(month));
    }

    const monthStats = monthlyStatsMap.get(month);

    /* --------------------------------------------
       Determine Whether User Practiced
    -------------------------------------------- */

    const recent = dayIndex < DETAILED_ATTEMPT_DAYS;

    const practiceProbability = recent ? 0.72 : 0.58;

    /* --------------------------------------------
       Occasional No-Activity Days
    -------------------------------------------- */

    if (Math.random() > practiceProbability) {
      continue;
    }

    /* --------------------------------------------
       Number Of Tests
    -------------------------------------------- */

    const tests = randomNumber(1, 3);

    let totalQuestions = 0;
    let totalCorrect = 0;
    let totalTime = 0;

    /* --------------------------------------------
       Generate Tests
    -------------------------------------------- */

    for (let testIndex = 0; testIndex < tests; testIndex += 1) {
      const operation = randomItem(OPERATIONS);

      const level = randomItem(LEVELS);

      /* ------------------------------------------
         Gradual Improvement
         
         More recent activity has slightly
         better accuracy.
      ------------------------------------------ */

      const improvement = (DAYS_OF_HISTORY - dayIndex) / DAYS_OF_HISTORY;

      const accuracy = Math.min(0.95, 0.68 + improvement * 0.2);

      /* ------------------------------------------
         Generate Attempt
      ------------------------------------------ */

      const attempt = generateQuizAttempt({
        date,
        operation,
        level,
        dayIndex,
        testIndex,
        accuracy,
      });

      /* ------------------------------------------
         Save Detailed Attempts
         
         Only retain detailed attempts for
         the most recent 30 days.
      ------------------------------------------ */

      if (recent) {
        saveQuizAttempt(attempt);
      }

      /* ----------------------------------------------
   Calculate Daily Totals
-------------------------------------------------- */

      const correct = attempt.questions.filter((question) => question.correct).length;

      totalQuestions += attempt.questions.length;

      totalCorrect += correct;

      totalTime += attempt.questions.reduce((sum, question) => sum + question.time, 0);

      /* ------------------------------------------
         Add To Monthly Statistics
      ------------------------------------------ */

      addAttemptToMonth(monthStats, attempt);
    }

    /* ----------------------------------------------
       Save Daily Activity
    ---------------------------------------------- */

    dailyActivity.push(
      generateDailyActivity({
        date,
        tests,
        questions: totalQuestions,
        correct: totalCorrect,
        totalTime: Number(totalTime.toFixed(2)),
      }),
    );
  }

  /* ----------------------------------------------
     Save Daily Activity
  ---------------------------------------------- */

  dailyActivity.forEach((activity) => {
    saveDailyActivity(activity);
  });

  /* ----------------------------------------------
     Save Monthly Statistics
  ---------------------------------------------- */

  Array.from(monthlyStatsMap.values()).forEach((stats) => {
    saveMonthlyStats(stats);
  });

  console.log("Rapid Fire Math demo data seeded successfully.");
}

/* --------------------------------------------------
   Clear Demo Data
-------------------------------------------------- */

export function clearDemoData() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem("rapidMath.quizAttempts");

  localStorage.removeItem("rapidMath.dailyActivity");

  localStorage.removeItem("rapidMath.monthlyStats");

  console.log("Rapid Fire Math demo data cleared.");
}
