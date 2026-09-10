// src/lib/math/levels/missingNumber.js

/* --------------------------------------------------
   Missing Number Level Configuration
-------------------------------------------------- */

export const MISSING_NUMBER_LEVELS = {
  1: {
    template: "addition-missing-second",

    known: { min: 1, max: 9 },
    missing: { min: 1, max: 9 },

    minResult: 2,
    maxResult: 18,
  },

  2: {
    template: "addition-missing-second",

    known: { min: 10, max: 50 },
    missing: { min: 1, max: 50 },

    minResult: 11,
    maxResult: 100,
  },

  3: {
    template: "subtraction-missing-second",

    minuend: { min: 10, max: 60 },
    missing: { min: 1, max: 50 },

    minResult: 1,
    maxResult: 59,
  },

  4: {
    template: "subtraction-missing-first",

    missing: { min: 10, max: 60 },
    subtrahend: { min: 1, max: 50 },

    minResult: 1,
    maxResult: 59,
  },

  5: {
    template: "multiplication",

    known: { min: 2, max: 12 },
    missing: { min: 2, max: 12 },

    minResult: 4,
    maxResult: 144,
  },

  6: {
    template: "division",

    divisor: { min: 2, max: 12 },
    quotient: { min: 2, max: 30 },

    minResult: 2,
    maxResult: 30,
  },

  7: {
    template: "mixed-one-step",

    minValue: 10,
    maxValue: 100,
  },

  8: {
    template: "two-step",

    minValue: 1,
    maxValue: 50,

    minResult: 1,
    maxResult: 200,
  },
};
