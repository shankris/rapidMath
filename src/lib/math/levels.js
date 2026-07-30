// src/lib/math/levels.js

export const LEVEL_CONFIG = {
  1: {
    title: "Single Digit Addition",
    description: "Practice adding single digit numbers and build calculation speed.",

    num1: { min: 1, max: 9 },
    num2: { min: 1, max: 9 },
  },

  2: {
    title: "Single + Double Digit",
    description: "Combine single digit numbers with values up to 30.",

    num1: { min: 1, max: 9 },
    num2: { min: 10, max: 30 },
  },

  3: {
    title: "Double Digit Basics",
    description: "Practice adding two digit numbers up to 30.",

    num1: { min: 10, max: 30 },
    num2: { min: 10, max: 30 },
  },

  4: {
    title: "Double Digit Practice",
    description: "Improve addition speed with numbers up to 60.",

    num1: { min: 10, max: 60 },
    num2: { min: 10, max: 60 },
  },

  5: {
    title: "Double Digit Challenge",
    description: "Master addition with numbers up to 99.",

    num1: { min: 10, max: 99 },
    num2: { min: 10, max: 99 },
  },

  6: {
    title: "Two + Three Digits",
    description: "Practice adding two digit and three digit numbers.",

    num1: { min: 10, max: 99 },
    num2: { min: 100, max: 999 },
  },

  7: {
    title: "Three Digit Addition",
    description: "Build speed with three digit number addition.",

    num1: { min: 100, max: 999 },
    num2: { min: 100, max: 999 },
  },

  8: {
    title: "Four Digit Addition",
    description: "Challenge yourself with four digit calculations.",

    num1: { min: 1000, max: 9999 },
    num2: { min: 1000, max: 9999 },
  },

  9: {
    title: "Five Digit Addition",
    description: "Develop accuracy with large number addition.",

    num1: { min: 10000, max: 99999 },
    num2: { min: 10000, max: 99999 },
  },

  10: {
    title: "Six Digit Addition",
    description: "Master advanced mental addition with six digit numbers.",

    num1: { min: 100000, max: 999999 },
    num2: { min: 100000, max: 999999 },
  },
};
