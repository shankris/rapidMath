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
   A practice day counts when at least one question
   has actually been answered.

   In-progress attempts with zero answered questions
   therefore do not create a practice day.
*/

function getPracticeDates() {
  const attempts = getQuizAttempts();
  const dates = new Set();

  attempts.forEach((attempt) => {
    if (!Array.isArray(attempt?.questions)) {
      return;
    }

    const answeredQuestions = attempt.questions.filter((question) => question && question.selectedAnswer !== undefined && question.selectedAnswer !== null);

    if (answeredQuestions.length === 0 || !attempt.startedAt) {
      return;
    }

    /*
       Use the attempt start date for the practice day.

       This matches the Dashboard activity calculation
       and keeps the same quiz assigned to the day on
       which it was started.
    */

    const date = new Date(attempt.startedAt);
    const dateKey = getLocalDateKey(date);

    if (dateKey) {
      dates.add(dateKey);
    }
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

  /* --------------------------------------------------
     Check Final Streak
  -------------------------------------------------- */

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

  /* --------------------------------------------------
     Check Whether Streak Is Still Active
  -------------------------------------------------- */

  const daysSinceLatest = Math.round((todayObject.getTime() - latestDateObject.getTime()) / (24 * 60 * 60 * 1000));

  /*
     A current streak remains active when the user
     practiced either today or yesterday.
  */

  if (daysSinceLatest > 1) {
    return {
      count: 0,
      startDate: null,
      endDate: null,
    };
  }

  /* --------------------------------------------------
     Walk Back Through Consecutive Practice Days
  -------------------------------------------------- */

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

  /* --------------------------------------------------
     Remove Current Streak From Previous History
  -------------------------------------------------- */

  let previousDates = practiceDates;

  if (current.count > 0) {
    previousDates = practiceDates.filter((dateKey) => dateKey < current.startDate || dateKey > current.endDate);
  }

  const previousLongest = calculateLongestStreak(previousDates);

  return {
    currentStreak: current.count,
    currentStartDate: current.startDate,
    currentEndDate: current.endDate,

    previousLongestStreak: previousLongest.count,
    previousLongestStartDate: previousLongest.startDate,
    previousLongestEndDate: previousLongest.endDate,
  };
}
