// src/lib/stats/activityStats.js

import { getDailyActivity } from "../storage/dailyActivity";

/* --------------------------------------------------
   Configuration
-------------------------------------------------- */

const ACTIVITY_DAYS = {
  "1w": 7,
  "2w": 14,
  "1m": 30,
  "3m": 90,
  "6m": 180,
  "1y": 365,
};

/* --------------------------------------------------
   Get Date Days Ago
-------------------------------------------------- */

function getDateDaysAgo(days) {
  const date = new Date();

  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - days);

  return date;
}

/* --------------------------------------------------
   Format Date
-------------------------------------------------- */

function formatDate(date) {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/* --------------------------------------------------
   Create Empty Day
-------------------------------------------------- */

function createEmptyDay(date) {
  return {
    date,
    questions: 0,
    correct: 0,
    incorrect: 0,
    tests: 0,
    totalTime: 0,
  };
}

/* --------------------------------------------------
   Format Activity Data
-------------------------------------------------- */

function formatActivity(activity) {
  return {
    date: activity.date,

    questions: activity.questions || 0,

    correct: activity.correct || 0,

    incorrect: Math.max((activity.questions || 0) - (activity.correct || 0), 0),

    tests: activity.tests || 0,

    totalTime: Number((activity.totalTime || 0).toFixed(2)),
  };
}

/* --------------------------------------------------
   Create Daily Activity Range
-------------------------------------------------- */

function createActivityRange(days) {
  const activity = getDailyActivity();

  const activityMap = new Map(activity.map((item) => [item.date, item]));

  const results = [];

  const startDate = getDateDaysAgo(days - 1);

  for (let index = 0; index < days; index += 1) {
    const date = new Date(startDate);

    date.setDate(startDate.getDate() + index);

    const dateString = formatDate(date);

    const existingActivity = activityMap.get(dateString);

    if (existingActivity) {
      results.push(formatActivity(existingActivity));
    } else {
      results.push(createEmptyDay(dateString));
    }
  }

  return results;
}

/* --------------------------------------------------
   Get Activity For Period
-------------------------------------------------- */

export function getActivityForPeriod(period = "1m") {
  const days = ACTIVITY_DAYS[period];

  if (!days) {
    return [];
  }

  return createActivityRange(days);
}

/* --------------------------------------------------
   Get Recent 30-Day Activity
-------------------------------------------------- */

export function getRecentActivity() {
  return getActivityForPeriod("1m");
}

/* --------------------------------------------------
   Get Activity For Heat Map
-------------------------------------------------- */

export function getHeatMapActivity(period = "1y") {
  return getActivityForPeriod(period);
}
