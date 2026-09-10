// src/lib/math/levels/subtraction.js

/* --------------------------------------------------
   Subtraction Level Configuration
-------------------------------------------------- */

export const SUBTRACTION_LEVELS = {
  1: {
    operands: [
      { min: 1, max: 9 },
      { min: 1, max: 9 },
    ],
    operators: ["−"],
    minResult: 0,
    maxResult: 8,
    borrowProbability: 0.2,
  },

  2: {
    operands: [
      { min: 10, max: 30 },
      { min: 1, max: 9 },
    ],
    operators: ["−"],
    minResult: 1,
    maxResult: 29,
    borrowProbability: 0.3,
  },

  3: {
    operands: [
      { min: 10, max: 60 },
      { min: 10, max: 59 },
    ],
    operators: ["−"],
    minResult: 1,
    maxResult: 50,
    borrowProbability: 0.4,
  },

  4: {
    operands: [
      { min: 100, max: 200 },
      { min: 10, max: 99 },
    ],
    operators: ["−"],
    minResult: 1,
    maxResult: 190,
    borrowProbability: 0.5,
  },

  5: {
    operands: [
      { min: 100, max: 500 },
      { min: 10, max: 499 },
    ],
    operators: ["−"],
    minResult: 1,
    maxResult: 490,
    borrowProbability: 0.6,
  },

  6: {
    operands: [
      { min: 1, max: 9 },
      { min: 1, max: 9 },
      { min: 1, max: 9 },
    ],
    operators: ["+", "−"],
    minResult: 0,
    maxResult: 17,
    borrowProbability: 0.4,
  },

  7: {
    operands: [
      { min: 10, max: 60 },
      { min: 1, max: 9 },
      { min: 1, max: 9 },
    ],
    operators: ["+", "−"],
    minResult: 0,
    maxResult: 68,
    borrowProbability: 0.5,
  },

  8: {
    operands: [
      { min: 20, max: 90 },
      { min: 10, max: 60 },
      { min: 1, max: 9 },
    ],
    operators: ["+", "−"],
    minResult: 0,
    maxResult: 158,
    borrowProbability: 0.6,
  },

  9: {
    operands: [
      { min: 20, max: 90 },
      { min: 10, max: 90 },
      { min: 10, max: 90 },
    ],
    operators: ["+", "−"],
    minResult: -70,
    maxResult: 170,
    borrowProbability: 0.65,
  },

  10: {
    operands: [
      { min: 100, max: 500 },
      { min: 10, max: 99 },
      { min: 10, max: 99 },
    ],
    operators: ["+", "−"],
    minResult: -98,
    maxResult: 589,
    borrowProbability: 0.7,
  },

  11: {
    operands: [
      { min: 200, max: 999 },
      { min: 100, max: 900 },
      { min: 10, max: 99 },
    ],
    operators: ["+", "−"],
    minResult: -599,
    maxResult: 1889,
    borrowProbability: 0.8,
  },

  12: {
    operands: [
      { min: 1000, max: 9999 },
      { min: 100, max: 999 },
      { min: 100, max: 999 },
    ],
    operators: ["+", "−"],
    minResult: -898,
    maxResult: 10898,
    borrowProbability: 0.9,
  },
};
