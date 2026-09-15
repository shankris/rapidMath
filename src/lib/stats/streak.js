// src/lib/stats/streak.js

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

function parseDateKey(dateKey) {
  if (!dateKey) {
    return null;
  }

  const date = new Date(`${dateKey}T00:00:00`);

  return Number.isNaN(date.getTime()) ? null : date;
}

function addDays(date, amount) {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
}

/* --------------------------------------------------
   Get Practice Dates
-------------------------------------------------- */

/*
   A practice day only counts when at least one question
   has actually been answered.

   This keeps streak calculation consistent with the
   Monthly Activity calendar and prevents an abandoned
   in-progress quiz from creating a practice day.
*/

function getPracticeDates() {
  const attempts = getQuizAttempts();
  const dates = new Set();

  attempts.forEach((attempt) => {
    if (!Array.isArray(attempt?.questions)) {
      return;
    }

    const answeredQuestions = attempt.questions.filter((question) => question && question.selectedAnswer !== undefined && question.selectedAnswer !== null);

    if (answeredQuestions.length === 0) {
      return;
    }

    answeredQuestions.forEach((question) => {
      /*
         Use the attempt start time for the calendar date.

         A quiz belongs to the day on which it was started,
         matching the existing dashboard activity logic.
      */

      if (!attempt.startedAt) {
        return;
      }

      const date = new Date(attempt.startedAt);
      const dateKey = getLocalDateKey(date);

      if (dateKey) {
        dates.add(dateKey);
      }
    });
  });

  return Array.from(dates).sort();
}

/* --------------------------------------------------
   Calculate Longest Streak
-------------------------------------------------- */

function calculateLongestStreak(dateKeys) {
  if (dateKeys.length === 0) {
    return {
      count: 0,
      startDate: null,
      endDate: null,
    };
  }

  let longestCount = 1;
  let longestStart = dateKeys[0];
  let longestEnd = dateKeys[0];

  let currentCount = 1;
  let currentStart = dateKeys[0];

  for (let index = 1; index < dateKeys.length; index += 1) {
    const previousDate = parseDateKey(dateKeys[index - 1]);
    const currentDate = parseDateKey(dateKeys[index]);

    if (!previousDate || !currentDate) {
      continue;
    }

    const expectedDate = addDays(previousDate, 1);

    const isConsecutive = getLocalDateKey(expectedDate) === dateKeys[index];

    if (isConsecutive) {
      currentCount += 1;
    } else {
      if (currentCount > longestCount) {
        longestCount = currentCount;
        longestStart = currentStart;
        longestEnd = dateKeys[index - 1];
      }

      currentCount = 1;
      currentStart = dateKeys[index];
    }
  }

  /*
     Check the final streak after the loop.
  */

  if (currentCount > longestCount) {
    longestCount = currentCount;
    longestStart = currentStart;
    longestEnd = dateKeys[dateKeys.length - 1];
  }

  return {
    count: longestCount,
    startDate: longestStart,
    endDate: longestEnd,
  };
}

/* --------------------------------------------------
   Calculate Current Streak
-------------------------------------------------- */

function calculateCurrentStreak(dateKeys) {
  if (dateKeys.length === 0) {
    return {
      count: 0,
      startDate: null,
      endDate: null,
    };
  }

  const today = getLocalDateKey(new Date());
  const latestDate = dateKeys[dateKeys.length - 1];

  const latestDateObject = parseDateKey(latestDate);
  const todayObject = parseDateKey(today);

  if (!latestDateObject || !todayObject) {
    return {
      count: 0,
      startDate: null,
      endDate: null,
    };
  }

  /*
     If the most recent practice day was more than
     one day ago, there is no active current streak.
  */

  const daysSinceLatest = Math.round((todayObject.getTime() - latestDateObject.getTime()) / (24 * 60 * 60 * 1000));

  if (daysSinceLatest > 1) {
    return {
      count: 0,
      startDate: null,
      endDate: null,
    };
  }

  let count = 1;
  let startDate = latestDate;

  for (let index = dateKeys.length - 1; index > 0; index -= 1) {
    const currentDate = parseDateKey(dateKeys[index]);
    const previousDate = parseDateKey(dateKeys[index - 1]);

    if (!currentDate || !previousDate) {
      break;
    }

    const expectedDate = addDays(previousDate, 1);

    if (getLocalDateKey(expectedDate) !== dateKeys[index]) {
      break;
    }

    count += 1;
    startDate = dateKeys[index - 1];
  }

  return {
    count,
    startDate,
    endDate: latestDate,
  };
}

/* --------------------------------------------------
   Get Streak Stats
-------------------------------------------------- */

export function getStreakStats() {
  const practiceDates = getPracticeDates();

  const current = calculateCurrentStreak(practiceDates);
  const longest = calculateLongestStreak(practiceDates);

  return {
    currentStreak: current.count,
    currentStartDate: current.startDate,
    currentEndDate: current.endDate,

    bestStreak: longest.count,
    bestStartDate: longest.startDate,
    bestEndDate: longest.endDate,
  };
}
