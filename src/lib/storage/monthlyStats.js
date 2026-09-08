// src/lib/storage/monthlyStats.js

/* --------------------------------------------------
   Storage Configuration
-------------------------------------------------- */

const STORAGE_KEY = "rapidMath.monthlyStats";

/* --------------------------------------------------
   Get Monthly Statistics
-------------------------------------------------- */

export function getMonthlyStats() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const stats = JSON.parse(stored);

    return Array.isArray(stats) ? stats : [];
  } catch (error) {
    console.error("Failed to read monthly statistics:", error);

    return [];
  }
}

/* --------------------------------------------------
   Save Monthly Statistics
-------------------------------------------------- */

export function saveMonthlyStats(stats) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const existingStats = getMonthlyStats();

    const updatedStats = [...existingStats, stats];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStats));
  } catch (error) {
    console.error("Failed to save monthly statistics:", error);
  }
}

/* --------------------------------------------------
   Clear Monthly Statistics
-------------------------------------------------- */

export function clearMonthlyStats() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(STORAGE_KEY);
}
