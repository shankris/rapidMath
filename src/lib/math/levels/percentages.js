// src/lib/math/levels/percentages.js

/* --------------------------------------------------
   Percentages Level Configuration
-------------------------------------------------- */

export const PERCENTAGES_LEVELS = {
  1: {
    template: "percent-of-number",
    difficulty: "easy",
    percentages: [10, 25, 50],
    number: { min: 20, max: 100 },
  },

  2: {
    template: "percent-of-number",
    difficulty: "easy",
    percentages: [5, 10, 20, 25, 50, 75],
    number: { min: 20, max: 200 },
  },

  3: {
    template: "percentage-increase",
    difficulty: "moderate",
    percentages: [5, 10, 20, 25],
    number: { min: 20, max: 200 },
  },

  4: {
    template: "percentage-decrease",
    difficulty: "moderate",
    percentages: [5, 10, 20, 25],
    number: { min: 20, max: 200 },
  },

  5: {
    template: "find-original",
    difficulty: "challenging",
    percentages: [10, 20, 25, 50],
    original: { min: 20, max: 200 },
  },

  6: {
    template: "what-percent",
    difficulty: "challenging",
    percentage: { min: 5, max: 95 },
    number: { min: 20, max: 200 },
  },

  7: {
    template: "multi-step",
    difficulty: "hard",
    percentages: [10, 15, 20, 25, 30],
    number: { min: 50, max: 500 },
  },

  8: {
    template: "mixed",
    difficulty: "advanced",
    percentages: [5, 10, 12, 15, 20, 25, 30, 40, 50, 75],
    number: { min: 50, max: 1000 },
  },
};
