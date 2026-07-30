// src/lib/math/levels.js

export const LEVEL_CONFIG = {
  1: {
    title: "Single Digits",
    description: "...",
    num1: { min: 1, max: 9 },
    num2: { min: 1, max: 9 },
    subtractionMinDifference: 5,

    multiplication: {
      num1: { min: 2, max: 5 },
      num2: { min: 2, max: 5 },
    },

    division: {
      divisor: { min: 2, max: 5 },
      quotient: { min: 2, max: 5 },
    },
  },

  2: {
    title: "Single + Double Digit",
    description: "Combine single digit numbers with values up to 30.",
    num1: { min: 1, max: 9 },
    num2: { min: 10, max: 30 },
    subtractionMinDifference: 10,

    multiplication: {
      num1: { min: 2, max: 7 },
      num2: { min: 2, max: 7 },
    },

    division: {
      divisor: { min: 2, max: 7 },
      quotient: { min: 2, max: 10 },
    },
  },

  3: {
    title: "Double Digit Basics",
    description: "Practice adding two digit numbers up to 30.",

    num1: { min: 10, max: 30 },
    num2: { min: 10, max: 30 },
    subtractionMinDifference: 10,

    multiplication: {
      num1: { min: 2, max: 9 },
      num2: { min: 2, max: 9 },
    },

    division: {
      divisor: { min: 2, max: 9 },
      quotient: { min: 2, max: 12 },
    },
  },

  4: {
    title: "Double Digit Practice",
    description: "Improve addition speed with numbers up to 60.",

    num1: { min: 10, max: 60 },
    num2: { min: 10, max: 60 },
    subtractionMinDifference: 20,

    multiplication: {
      num1: { min: 2, max: 12 },
      num2: { min: 2, max: 12 },
    },

    division: {
      divisor: { min: 2, max: 12 },
      quotient: { min: 5, max: 20 },
    },
  },

  5: {
    title: "Double Digit Challenge",
    description: "Master addition with numbers up to 99.",

    num1: { min: 10, max: 99 },
    num2: { min: 10, max: 99 },
    subtractionMinDifference: 30,

    multiplication: {
      num1: { min: 10, max: 30 },
      num2: { min: 2, max: 9 },
    },

    division: {
      divisor: { min: 2, max: 9 },
      quotient: { min: 10, max: 20 },
    },
  },

  6: {
    title: "Two + Three Digits",
    description: "Practice adding two digit and three digit numbers.",

    num1: { min: 10, max: 99 },
    num2: { min: 100, max: 999 },
    subtractionMinDifference: 100,

    multiplication: {
      num1: { min: 20, max: 50 },
      num2: { min: 2, max: 12 },
    },

    division: {
      divisor: { min: 2, max: 12 },
      quotient: { min: 10, max: 30 },
    },
  },

  7: {
    title: "Three Digit Addition",
    description: "Build speed with three digit number addition.",

    num1: { min: 100, max: 999 },
    num2: { min: 100, max: 999 },
    subtractionMinDifference: 300,

    multiplication: {
      num1: { min: 10, max: 50 },
      num2: { min: 10, max: 20 },
    },

    division: {
      divisor: { min: 10, max: 20 },
      quotient: { min: 10, max: 30 },
    },
  },

  8: {
    title: "Four Digit Addition",
    description: "Challenge yourself with four digit calculations.",

    num1: { min: 1000, max: 9999 },
    num2: { min: 1000, max: 9999 },
    subtractionMinDifference: 1000,

    multiplication: {
      num1: { min: 20, max: 99 },
      num2: { min: 10, max: 30 },
    },

    division: {
      divisor: { min: 10, max: 30 },
      quotient: { min: 20, max: 50 },
    },
  },

  9: {
    title: "Five Digit Addition",
    description: "Develop accuracy with large number addition.",

    num1: { min: 10000, max: 99999 },
    num2: { min: 10000, max: 99999 },
    subtractionMinDifference: 10000,

    multiplication: {
      num1: { min: 25, max: 99 },
      num2: { min: 10, max: 99 },
    },

    division: {
      divisor: { min: 10, max: 50 },
      quotient: { min: 20, max: 100 },
    },
  },

  10: {
    title: "Six Digit Addition",
    description: "Master advanced mental addition with six digit numbers.",

    num1: { min: 100000, max: 999999 },
    num2: { min: 100000, max: 999999 },
    subtractionMinDifference: 100000,

    multiplication: {
      num1: { min: 50, max: 999 },
      num2: { min: 2, max: 99 },
    },

    division: {
      divisor: { min: 10, max: 99 },
      quotient: { min: 50, max: 200 },
    },
  },
};
