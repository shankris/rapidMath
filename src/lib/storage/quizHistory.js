// src/lib/storage/quizHistory.js

/* --------------------------------------------------
   Storage Configuration
-------------------------------------------------- */

const STORAGE_KEY = "rapidMath.quizAttempts";

/* --------------------------------------------------
   Get Quiz Attempts
-------------------------------------------------- */

export function getQuizAttempts() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const attempts = JSON.parse(stored);

    return Array.isArray(attempts) ? attempts : [];
  } catch (error) {
    console.error("Failed to read quiz attempts:", error);

    return [];
  }
}

/* --------------------------------------------------
   Get Attempts For Operation + Level
-------------------------------------------------- */

export function getQuizAttemptsByLevel(operation, level) {
  const attempts = getQuizAttempts();

  return attempts.filter((attempt) => attempt.operation === operation && Number(attempt.level) === Number(level));
}

/* --------------------------------------------------
   Save Quiz Attempt
-------------------------------------------------- */

export function saveQuizAttempt(attempt) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const attempts = getQuizAttempts();

    attempts.push(attempt);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(attempts));
  } catch (error) {
    console.error("Failed to save quiz attempt:", error);
  }
}

/* --------------------------------------------------
   Update Quiz Attempt
-------------------------------------------------- */

export function updateQuizAttempt(id, updates) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const attempts = getQuizAttempts();

    const updatedAttempts = attempts.map((attempt) =>
      attempt.id === id
        ? {
            ...attempt,
            ...updates,
          }
        : attempt,
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAttempts));
  } catch (error) {
    console.error("Failed to update quiz attempt:", error);
  }
}

/* --------------------------------------------------
   Get Single Quiz Attempt
-------------------------------------------------- */

export function getQuizAttempt(id) {
  const attempts = getQuizAttempts();

  return attempts.find((attempt) => attempt.id === id) ?? null;
}

/* --------------------------------------------------
   Clear Quiz Attempts
-------------------------------------------------- */

export function clearQuizAttempts() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(STORAGE_KEY);
}
