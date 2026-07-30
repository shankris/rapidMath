// src/lib/math/levels.js

export const LEVEL_CONFIG = {
  1: {
    min: 3,
    max: 20,
    allowNegative: false,
    negativeProbability: 0,
  },

  2: {
    min: 5,
    max: 40,
    allowNegative: false,
    negativeProbability: 0,
  },

  3: {
    min: 10,
    max: 80,
    allowNegative: true,
    negativeProbability: 0.3,
  },

  4: {
    min: 10,
    max: 200,
    allowNegative: true,
    negativeProbability: 0.5,
  },
};
