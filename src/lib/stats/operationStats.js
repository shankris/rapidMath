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

const LEVELS = [1, 2, 3, 4];

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
   Create Empty Statistics
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
   Create Empty Level Statistics
-------------------------------------------------- */

function createEmptyLevelStats() {
  return {
    testsCompleted: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
    totalTime: 0,
  };
}

/* --------------------------------------------------
   Create Empty Operation Statistics
-------------------------------------------------- */

function createEmptyOperationStats() {
  return {
    add: {
      ...createEmptyStats(),
      levels: {
        1: createEmptyLevelStats(),
        2: createEmptyLevelStats(),
        3: createEmptyLevelStats(),
        4: createEmptyLevelStats(),
      },
    },

    sub: {
      ...createEmptyStats(),
      levels: {
        1: createEmptyLevelStats(),
        2: createEmptyLevelStats(),
        3: createEmptyLevelStats(),
        4: createEmptyLevelStats(),
      },
    },

    mul: {
      ...createEmptyStats(),
      levels: {
        1: createEmptyLevelStats(),
        2: createEmptyLevelStats(),
        3: createEmptyLevelStats(),
        4: createEmptyLevelStats(),
      },
    },

    div: {
      ...createEmptyStats(),
      levels: {
        1: createEmptyLevelStats(),
        2: createEmptyLevelStats(),
        3: createEmptyLevelStats(),
        4: createEmptyLevelStats(),
      },
    },
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
    if (!attempt.startedAt) {
      return false;
    }

    return new Date(attempt.startedAt) >= startDate;
  });
}

/* --------------------------------------------------
   Calculate Statistics From Detailed Attempts
-------------------------------------------------- */

function calculateAttemptStats(attempts) {
  const statistics = createEmptyOperationStats();

  attempts.forEach((attempt) => {
    const operation = attempt.operation;
    const level = Number(attempt.level);

    if (!statistics[operation]) {
      return;
    }

    statistics[operation].testsCompleted += 1;

    const levelStats = statistics[operation].levels[level];

    attempt.questions.forEach((question) => {
      const time = question.time || 0;

      /* ----------------------------------------------
         Operation Statistics
      -------------------------------------------------- */

      statistics[operation].questionsAnswered += 1;

      if (question.correct) {
        statistics[operation].correctAnswers += 1;
      }

      statistics[operation].totalTime += time;

      /* ----------------------------------------------
         Level Statistics
      -------------------------------------------------- */

      if (!levelStats) {
        return;
      }

      levelStats.questionsAnswered += 1;

      if (question.correct) {
        levelStats.correctAnswers += 1;
      }

      levelStats.totalTime += time;
    });

    /* ----------------------------------------------
       Level Test Count
    -------------------------------------------------- */

    if (levelStats) {
      levelStats.testsCompleted += 1;
    }
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

      /* --------------------------------------------
           Operation Totals
        -------------------------------------------- */

      statistics[operation].testsCompleted += data.testsCompleted || 0;

      statistics[operation].questionsAnswered += data.questionsAnswered || 0;

      statistics[operation].correctAnswers += data.correctAnswers || 0;

      statistics[operation].totalTime += data.totalTime || 0;

      /* --------------------------------------------
           Level Totals
           
           Older monthly data may not contain
           level statistics. In that case we
           simply skip the level data.
        -------------------------------------------- */

      Object.entries(data.levels || {}).forEach(([level, levelData]) => {
        const numericLevel = Number(level);

        if (!statistics[operation].levels[numericLevel]) {
          return;
        }

        statistics[operation].levels[numericLevel].testsCompleted += levelData.testsCompleted || 0;

        statistics[operation].levels[numericLevel].questionsAnswered += levelData.questionsAnswered || 0;

        statistics[operation].levels[numericLevel].correctAnswers += levelData.correctAnswers || 0;

        statistics[operation].levels[numericLevel].totalTime += levelData.totalTime || 0;
      });
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
    /* ----------------------------------------------
       Operation Totals
    -------------------------------------------------- */

    combined[operation].testsCompleted = recentStats[operation].testsCompleted + olderStats[operation].testsCompleted;

    combined[operation].questionsAnswered = recentStats[operation].questionsAnswered + olderStats[operation].questionsAnswered;

    combined[operation].correctAnswers = recentStats[operation].correctAnswers + olderStats[operation].correctAnswers;

    combined[operation].totalTime = recentStats[operation].totalTime + olderStats[operation].totalTime;

    /* ----------------------------------------------
       Level Totals
    -------------------------------------------------- */

    LEVELS.forEach((level) => {
      combined[operation].levels[level].testsCompleted = recentStats[operation].levels[level].testsCompleted + olderStats[operation].levels[level].testsCompleted;

      combined[operation].levels[level].questionsAnswered = recentStats[operation].levels[level].questionsAnswered + olderStats[operation].levels[level].questionsAnswered;

      combined[operation].levels[level].correctAnswers = recentStats[operation].levels[level].correctAnswers + olderStats[operation].levels[level].correctAnswers;

      combined[operation].levels[level].totalTime = recentStats[operation].levels[level].totalTime + olderStats[operation].levels[level].totalTime;
    });
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

    /* ----------------------------------------------
       Operation Accuracy
    -------------------------------------------------- */

    const accuracy = data.questionsAnswered > 0 ? (data.correctAnswers / data.questionsAnswered) * 100 : 0;

    /* ----------------------------------------------
       Operation Average Time
    -------------------------------------------------- */

    const averageTime = data.questionsAnswered > 0 ? data.totalTime / data.questionsAnswered : 0;

    /* ----------------------------------------------
       Level Statistics
    -------------------------------------------------- */

    const levels = {};

    LEVELS.forEach((level) => {
      const levelData = data.levels[level];

      const levelAccuracy = levelData.questionsAnswered > 0 ? (levelData.correctAnswers / levelData.questionsAnswered) * 100 : 0;

      const levelAverageTime = levelData.questionsAnswered > 0 ? levelData.totalTime / levelData.questionsAnswered : 0;

      levels[level] = {
        accuracy: Number(levelAccuracy.toFixed(1)),

        averageTime: Number(levelAverageTime.toFixed(2)),

        testsCompleted: levelData.testsCompleted,

        questionsAnswered: levelData.questionsAnswered,

        correctAnswers: levelData.correctAnswers,
      };
    });

    /* ----------------------------------------------
       Formatted Operation Result
    -------------------------------------------------- */

    formatted[operation] = {
      accuracy: Number(accuracy.toFixed(1)),

      averageTime: Number(averageTime.toFixed(2)),

      testsCompleted: data.testsCompleted,

      questionsAnswered: data.questionsAnswered,

      correctAnswers: data.correctAnswers,

      levels,
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
     Recent Detailed Attempts
     
     Detailed quiz attempts are retained
     for approximately 30 days.
  -------------------------------------------------- */

  const recentAttempts = getAttemptsForPeriod(attempts, "1m");

  const recentStats = calculateAttemptStats(recentAttempts);

  /* ----------------------------------------------
     Older Monthly Summaries
     
     Use monthly summaries for history
     outside the detailed-attempt window.
  -------------------------------------------------- */

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
  -------------------------------------------------- */

  if (period === "all") {
    return {
      ...calculateAllTimeStats(),
      period,
    };
  }

  /* ----------------------------------------------
     Short Periods
     
     Up to 30 days can use detailed
     quiz attempts directly.
  -------------------------------------------------- */

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
     
     Combine recent detailed attempts
     with older monthly summaries.
  -------------------------------------------------- */

  const statistics = calculateLongPeriodStats(period);

  return {
    ...formatStats(statistics),
    period,
  };
}
