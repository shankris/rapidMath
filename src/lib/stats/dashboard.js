/* src/lib/stats/dashboard.js */

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
    return {
      key: "playNow",
    };
  }

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return {
      key: "playNow",
    };
  }

  const now = new Date();
  const differenceMs = now.getTime() - date.getTime();

  if (differenceMs < 0) {
    return {
      key: "justNow",
    };
  }

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const month = 30 * day;
  const year = 365 * day;

  if (differenceMs < minute) {
    return {
      key: "justNow",
    };
  }

  if (differenceMs < hour) {
    const minutes = Math.floor(differenceMs / minute);

    return {
      key: "minutesAgo",
      count: minutes,
    };
  }

  if (differenceMs < day) {
    const hours = Math.floor(differenceMs / hour);

    return {
      key: "hoursAgo",
      count: hours,
    };
  }

  const yesterday = getDaysAgoDateKey(1);
  const practiceDate = getLocalDateKey(date);

  if (practiceDate === yesterday) {
    return {
      key: "yesterday",
    };
  }

  if (differenceMs < month) {
    const days = Math.floor(differenceMs / day);

    return {
      key: "daysAgo",
      count: days,
    };
  }

  if (differenceMs < year) {
    const months = Math.floor(differenceMs / month);

    return {
      key: "monthsAgo",
      count: months,
    };
  }

  const years = Math.floor(differenceMs / year);

  return {
    key: "yearsAgo",
    count: years,
  };
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
  const matchingAttempts = attempts.filter((attempt) => attempt.operation === operation && Number(attempt.level) === Number(level) && Array.isArray(attempt.questions) && attempt.questions.some((question) => question && question.selectedAnswer !== undefined && question.selectedAnswer !== null)).sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());

  return matchingAttempts[0]?.startedAt ?? null;
}

/* --------------------------------------------------
Get Recently Used Practice
-------------------------------------------------- */

export function getRecentlyUsedPractice() {
  const attempts = getQuizAttempts();

  const sortedAttempts = attempts.filter((attempt) => attempt.operation && attempt.level !== undefined && attempt.startedAt && Array.isArray(attempt.questions) && attempt.questions.some((question) => question && question.selectedAnswer !== undefined && question.selectedAnswer !== null)).sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());

  const seen = new Set();
  const recentPractice = [];

  for (const attempt of sortedAttempts) {
    const level = Number(attempt.level);
    const key = `${attempt.operation}-${level}`;

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);

    recentPractice.push({
      operation: attempt.operation,
      level,
      practiceUrl: attempt.practiceUrl ?? null,
      lastUsed: attempt.startedAt,
    });

    if (recentPractice.length === 20) {
      break;
    }
  }

  return recentPractice;
}

/* --------------------------------------------------
Get Today's Level Usage
-------------------------------------------------- */

function getTodayLevelUsage(attempts, operation, level) {
  const today = getDaysAgoDateKey(0);

  return attempts.filter((attempt) => {
    if (attempt.operation !== operation || Number(attempt.level) !== Number(level) || !attempt.startedAt || !Array.isArray(attempt.questions)) {
      return false;
    }

    const attemptDate = getLocalDateKey(new Date(attempt.startedAt));

    if (attemptDate !== today) {
      return false;
    }

    /*
   Count the attempt once it has at least one
   answered question.

   An abandoned attempt with zero answers therefore
   does not count as a level use.
*/

    return attempt.questions.some((question) => question && question.selectedAnswer !== undefined && question.selectedAnswer !== null);
  }).length;
}

/* --------------------------------------------------
Get Level Statistics
-------------------------------------------------- */

export function getDashboardLevelStats(operation, level, translate) {
  const attempts = getQuizAttempts();

  const questions = getAnsweredQuestions(attempts, operation, level);

  const correctQuestions = questions.filter((question) => question.correct === true);

  const reactionTimes = correctQuestions.map((question) => Number(question.time)).filter((time) => Number.isFinite(time) && time >= 0);

  const accuracy = questions.length > 0 ? Math.round((correctQuestions.length / questions.length) * 100) : null;

  const averageReactionTime = reactionTimes.length > 0 ? reactionTimes.reduce((total, time) => total + time, 0) / reactionTimes.length : null;

  const lastUseTimestamp = getLastUseTimestamp(attempts, operation, level);

  const todayUses = getTodayLevelUsage(attempts, operation, level);

  return {
    lastUseTimestamp,
    lastUse: formatLastUse(lastUseTimestamp, translate),
    accuracy,
    reactionTime: averageReactionTime,
    questions: questions.length,
    todayUses,
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
Get Thirty-Day Activity Details
-------------------------------------------------- */

export function getDashboardActivityDetails() {
  const attempts = getQuizAttempts();
  const details = {};

  const firstDate = getDaysAgoDateKey(DASHBOARD_DAYS - 1);
  const lastDate = getDaysAgoDateKey(0);

  attempts.forEach((attempt) => {
    if (!attempt.startedAt || !Array.isArray(attempt.questions) || !attempt.operation) {
      return;
    }

    const attemptDate = getLocalDateKey(new Date(attempt.startedAt));

    if (attemptDate < firstDate || attemptDate > lastDate) {
      return;
    }

    /* ----------------------------------------------
Only include answered questions
---------------------------------------------- */

    const answeredQuestions = attempt.questions.filter((question) => question && question.selectedAnswer !== undefined && question.selectedAnswer !== null);

    if (answeredQuestions.length === 0) {
      return;
    }

    if (!details[attemptDate]) {
      details[attemptDate] = {};
    }

    const levelKey = Number(attempt.level);
    const groupKey = `${attempt.operation}-${levelKey}`;

    if (!details[attemptDate][groupKey]) {
      details[attemptDate][groupKey] = { operation: attempt.operation, level: levelKey, practiceUrl: attempt.practiceUrl, questions: 0, correct: 0, reactionTimes: [] };
    }

    const group = details[attemptDate][groupKey];

    answeredQuestions.forEach((question) => {
      group.questions += 1;

      if (question.correct === true) {
        group.correct += 1;

        const time = Number(question.time);

        if (Number.isFinite(time) && time >= 0) {
          group.reactionTimes.push(time);
        }
      }
    });
  });

  const formattedDetails = {};

  Object.entries(details).forEach(([date, groups]) => {
    formattedDetails[date] = Object.values(groups).map((group) => {
      const reactionTimes = group.reactionTimes;

      const averageReactionTime = reactionTimes.length > 0 ? reactionTimes.reduce((total, time) => total + time, 0) / reactionTimes.length : null;

      return { operation: getDashboardOperationName(group.operation), level: group.level, practiceUrl: group.practiceUrl, questions: group.questions, accuracy: group.questions > 0 ? Math.round((group.correct / group.questions) * 100) : null, reactionTime: averageReactionTime };
    });
  });

  return formattedDetails;
}

/* --------------------------------------------------
Operation Display Names
-------------------------------------------------- */

function getDashboardOperationName(operation) {
  const names = {
    add: "Addition",
    sub: "Subtraction",
    mul: "Multiplication",
    div: "Division",
    mixedOperations: "Mixed Operations",
    missingNumber: "Missing Number",
    comparison: "Comparison",
    estimation: "Estimation",
    sequences: "Sequences & Progressions",
    fractions: "Fractions",
    percentages: "Percentages",
    powersRoots: "Power & Roots",
  };

  return names[operation] ?? operation;
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

/* --------------------------------------------------
Get Practice Time Distribution
-------------------------------------------------- */

export function getPracticeTimeDistribution() {
  const attempts = getQuizAttempts();

  const distribution = {};

  attempts.forEach((attempt) => {
    if (!attempt.operation || !Array.isArray(attempt.questions)) {
      return;
    }

    attempt.questions.forEach((question) => {
      if (!question || question.selectedAnswer === undefined || question.selectedAnswer === null) {
        return;
      }

      const time = Number(question.time);

      if (!Number.isFinite(time) || time < 0) {
        return;
      }

      distribution[attempt.operation] = (distribution[attempt.operation] ?? 0) + time;
    });
  });

  return distribution;
}
