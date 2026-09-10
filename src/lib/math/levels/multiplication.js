// src/lib/math/levels/multiplication.js

/* --------------------------------------------------
   Multiplication Level Configuration
-------------------------------------------------- */

export const MULTIPLICATION_LEVELS = {
  1: {
    num1: { min: 2, max: 5 },
    num2: { min: 2, max: 5 },
  },

  2: {
    num1: { min: 2, max: 7 },
    num2: { min: 2, max: 7 },
  },

  3: {
    multiplier: { min: 2, max: 6 },
    multiplicand: { min: 1, max: 9 },
  },

  4: {
    num1: { min: 2, max: 9 },
    num2: { min: 2, max: 9 },
  },

  5: {
    num1: { min: 2, max: 12 },
    num2: { min: 2, max: 12 },
  },

  6: {
    num1: { min: 10, max: 30 },
    num2: { min: 2, max: 9 },
  },

  7: {
    num1: { min: 20, max: 50 },
    num2: { min: 2, max: 12 },
  },

  8: {
    num1: { min: 10, max: 50 },
    num2: { min: 10, max: 20 },
  },

  9: {
    num1: { min: 20, max: 99 },
    num2: { min: 10, max: 30 },
  },

  10: {
    num1: { min: 25, max: 99 },
    num2: { min: 10, max: 99 },
  },
};
