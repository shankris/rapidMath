// src/lib/storage/dailyActivity.js

/* --------------------------------------------------
   Storage Configuration
-------------------------------------------------- */

const STORAGE_KEY = "rapidMath.dailyActivity";

/* --------------------------------------------------
   Get Daily Activity
-------------------------------------------------- */

export function getDailyActivity() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const activity = JSON.parse(stored);

    return Array.isArray(activity) ? activity : [];
  } catch (error) {
    console.error("Failed to read daily activity:", error);

    return [];
  }
}

/* --------------------------------------------------
   Save Daily Activity
-------------------------------------------------- */

export function saveDailyActivity(activity) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const existingActivity = getDailyActivity();

    /* ------------------------------------------------
       Check For Existing Date
    ------------------------------------------------ */

    const existingIndex = existingActivity.findIndex((item) => item.date === activity.date);

    /* ------------------------------------------------
       Add New Date
    ------------------------------------------------ */

    if (existingIndex === -1) {
      const updatedActivity = [...existingActivity, activity];

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedActivity));

      return;
    }

    /* ------------------------------------------------
       Update Existing Date
    ------------------------------------------------ */

    const existingDay = existingActivity[existingIndex];

    const updatedDay = {
      ...existingDay,

      questions: (existingDay.questions || 0) + (activity.questions || 0),

      correct: (existingDay.correct || 0) + (activity.correct || 0),

      tests: (existingDay.tests || 0) + (activity.tests || 0),

      totalTime: (existingDay.totalTime || 0) + (activity.totalTime || 0),
    };

    const updatedActivity = [...existingActivity];

    updatedActivity[existingIndex] = updatedDay;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedActivity));
  } catch (error) {
    console.error("Failed to save daily activity:", error);
  }
}

/* --------------------------------------------------
   Clear Daily Activity
-------------------------------------------------- */

export function clearDailyActivity() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(STORAGE_KEY);
}
