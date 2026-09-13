// src/lib/stats/targetedSelection.js

/* --------------------------------------------------
   Select Patterns For Targeted Practice
-------------------------------------------------- */

export function selectTargetedPatterns(patternScores) {
  if (!Array.isArray(patternScores)) {
    return [];
  }

  return patternScores
    .filter((pattern) => pattern.priority <= 3)
    .sort((a, b) => {
      /* ----------------------------------------------
         Strongest priority first
      ---------------------------------------------- */

      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }

      /* ----------------------------------------------
         Higher incorrect rate first
      ---------------------------------------------- */

      if (a.incorrectRate !== b.incorrectRate) {
        return b.incorrectRate - a.incorrectRate;
      }

      /* ----------------------------------------------
         Higher slow-correct rate first
      ---------------------------------------------- */

      return b.slowCorrectRate - a.slowCorrectRate;
    });
}
