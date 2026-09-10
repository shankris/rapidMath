// src/lib/math/levels/addition.js

/* --------------------------------------------------
   Addition Level Configuration
-------------------------------------------------- */

export const ADDITION_LEVELS = {
  1: {
    addends: [
      { min: 1, max: 9 },
      { min: 1, max: 9 },
    ],
    maxResult: 18,
    carryProbability: 0.25,
  },

  2: {
    addends: [
      { min: 10, max: 59 },
      { min: 1, max: 9 },
    ],
    maxResult: 60,
    carryProbability: 0.35,
  },

  3: {
    addends: [
      { min: 10, max: 99 },
      { min: 10, max: 99 },
    ],
    maxResult: 120,
    carryProbability: 0.45,
  },

  4: {
    addends: [
      { min: 10, max: 99 },
      { min: 10, max: 99 },
    ],
    maxResult: 200,
    carryProbability: 0.55,
  },

  5: {
    addends: [
      { min: 100, max: 299 },
      { min: 10, max: 99 },
    ],
    maxResult: 300,
    carryProbability: 0.6,
  },

  6: {
    addends: [
      { min: 1, max: 9 },
      { min: 1, max: 9 },
      { min: 1, max: 9 },
    ],
    maxResult: 27,
    carryProbability: 0.3,
  },

  7: {
    addends: [
      { min: 10, max: 59 },
      { min: 1, max: 9 },
      { min: 1, max: 9 },
    ],
    maxResult: 60,
    carryProbability: 0.45,
  },

  8: {
    addends: [
      { min: 10, max: 89 },
      { min: 10, max: 89 },
      { min: 1, max: 9 },
    ],
    maxResult: 100,
    carryProbability: 0.55,
  },

  9: {
    addends: [
      { min: 10, max: 99 },
      { min: 10, max: 99 },
      { min: 10, max: 99 },
    ],
    maxResult: 150,
    carryProbability: 0.65,
  },

  10: {
    addends: [
      { min: 100, max: 299 },
      { min: 10, max: 99 },
      { min: 10, max: 99 },
    ],
    maxResult: 300,
    carryProbability: 0.7,
  },

  11: {
    addends: [
      { min: 1000, max: 1400 },
      { min: 10, max: 99 },
      { min: 10, max: 99 },
    ],
    maxResult: 1500,
    carryProbability: 0.8,
  },

  12: {
    addends: [
      { min: 1000, max: 1900 },
      { min: 100, max: 999 },
      { min: 10, max: 99 },
    ],
    maxResult: 2000,
    carryProbability: 0.9,
  },
};
