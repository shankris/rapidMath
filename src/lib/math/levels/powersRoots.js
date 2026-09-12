// src/lib/math/levels/powersRoots.js

/* --------------------------------------------------
   Powers & Roots level configuration
-------------------------------------------------- */

export const POWERS_ROOTS_LEVELS = {
  1: {
    template: "powers",
    difficulty: "easy",
    square: {
      min: 2,
      max: 20,
    },
    cube: {
      min: 2,
      max: 20,
    },
  },

  2: {
    template: "roots",
    difficulty: "moderate",
    squareRoot: {
      min: 2,
      max: 20,
    },
    cubeRoot: {
      min: 2,
      max: 20,
    },
  },

  3: {
    template: "mixed-powers-roots",
    difficulty: "challenging",
    square: {
      min: 2,
      max: 15,
    },
    cube: {
      min: 2,
      max: 10,
    },
    squareRoot: {
      min: 2,
      max: 15,
    },
    cubeRoot: {
      min: 2,
      max: 10,
    },
  },

  4: {
    template: "advanced",
    difficulty: "advanced",
    square: {
      min: 2,
      max: 20,
    },
    cube: {
      min: 2,
      max: 12,
    },
    squareRoot: {
      min: 2,
      max: 20,
    },
    cubeRoot: {
      min: 2,
      max: 12,
    },
  },
};
