// src/lib/storage/streak.js

/* --------------------------------------------------
   Storage Configuration
-------------------------------------------------- */

const STORAGE_KEY = "rapidMath.streak";

/* --------------------------------------------------
   Get Today's Date
-------------------------------------------------- */

function getTodayDate() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/* --------------------------------------------------
   Get Yesterday's Date
-------------------------------------------------- */

function getYesterdayDate() {
  const yesterday = new Date();

  yesterday.setDate(yesterday.getDate() - 1);

  const year = yesterday.getFullYear();
  const month = String(yesterday.getMonth() + 1).padStart(2, "0");
  const day = String(yesterday.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/* --------------------------------------------------
   Get Streak
-------------------------------------------------- */

export function getStreak() {
  if (typeof window === "undefined") {
    return {
      currentStreak: 0,
      bestStreak: 0,
      lastPracticeDate: null,
    };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return {
        currentStreak: 0,
        bestStreak: 0,
        lastPracticeDate: null,
      };
    }

    const streak = JSON.parse(stored);

    return {
      currentStreak: streak.currentStreak || 0,
      bestStreak: streak.bestStreak || 0,
      lastPracticeDate: streak.lastPracticeDate || null,
    };
  } catch (error) {
    console.error("Failed to read streak:", error);

    return {
      currentStreak: 0,
      bestStreak: 0,
      lastPracticeDate: null,
    };
  }
}

/* --------------------------------------------------
   Update Streak
-------------------------------------------------- */

export function updateStreak() {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const streak = getStreak();

    const today = getTodayDate();
    const yesterday = getYesterdayDate();

    /* ------------------------------------------------
       First Practice
    ------------------------------------------------ */

    if (!streak.lastPracticeDate) {
      const newStreak = {
        currentStreak: 1,
        bestStreak: 1,
        lastPracticeDate: today,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(newStreak));

      return newStreak;
    }

    /* ------------------------------------------------
       Already Practiced Today
    ------------------------------------------------ */

    if (streak.lastPracticeDate === today) {
      return streak;
    }

    /* ------------------------------------------------
       Practiced Yesterday
    ------------------------------------------------ */

    if (streak.lastPracticeDate === yesterday) {
      const currentStreak = streak.currentStreak + 1;

      const updatedStreak = {
        currentStreak,
        bestStreak: Math.max(streak.bestStreak, currentStreak),
        lastPracticeDate: today,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStreak));

      return updatedStreak;
    }

    /* ------------------------------------------------
       Streak Broken
    ------------------------------------------------ */

    const newStreak = {
      currentStreak: 1,
      bestStreak: streak.bestStreak,
      lastPracticeDate: today,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newStreak));

    return newStreak;
  } catch (error) {
    console.error("Failed to update streak:", error);
  }
}

/* --------------------------------------------------
   Clear Streak
-------------------------------------------------- */

export function clearStreak() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(STORAGE_KEY);
}
