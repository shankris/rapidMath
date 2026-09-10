// src/lib/math/levels/sequences.js

/* --------------------------------------------------
   Sequences & Progressions Level Configuration
-------------------------------------------------- */

export const SEQUENCES_LEVELS = {
  1: {
    template: "addition",
    difficulty: "easy",

    start: {
      min: 1,
      max: 20,
    },

    difference: {
      min: 1,
      max: 5,
    },

    length: 5,
  },

  2: {
    template: "subtraction",
    difficulty: "easy",

    start: {
      min: 20,
      max: 60,
    },

    difference: {
      min: 1,
      max: 7,
    },

    length: 5,
  },

  3: {
    template: "addition",
    difficulty: "moderate",

    start: {
      min: 10,
      max: 50,
    },

    difference: {
      min: 5,
      max: 15,
    },

    length: 5,
  },

  4: {
    template: "multiplication",
    difficulty: "moderate",

    start: {
      min: 1,
      max: 5,
    },

    multiplier: {
      min: 2,
      max: 4,
    },

    length: 5,
  },

  5: {
    template: "division",
    difficulty: "moderate",

    start: {
      min: 32,
      max: 256,
    },

    divisor: {
      min: 2,
      max: 4,
    },

    length: 5,
  },

  6: {
    template: "alternating",
    difficulty: "challenging",

    start: {
      min: 2,
      max: 20,
    },

    operations: [
      {
        operator: "×",
        min: 2,
        max: 3,
      },
      {
        operator: "−",
        min: 1,
        max: 5,
      },
    ],

    length: 6,
  },

  7: {
    template: "increasing-difference",
    difficulty: "challenging",

    start: {
      min: 1,
      max: 10,
    },

    difference: {
      start: 2,
      increment: 1,
    },

    length: 6,
  },

  8: {
    template: "odd-difference",
    difficulty: "challenging",

    start: {
      min: 1,
      max: 10,
    },

    difference: {
      start: 3,
      increment: 2,
    },

    length: 6,
  },

  9: {
    template: "compound",
    difficulty: "hard",

    start: {
      min: 2,
      max: 10,
    },

    operations: [
      {
        operator: "×",
        min: 2,
        max: 3,
      },
      {
        operator: "+",
        min: 1,
        max: 5,
      },
    ],

    length: 7,
  },

  10: {
    template: "compound",
    difficulty: "advanced",

    start: {
      min: 3,
      max: 15,
    },

    operations: [
      {
        operator: "×",
        min: 2,
        max: 4,
      },
      {
        operator: "−",
        min: 1,
        max: 10,
      },
    ],

    length: 7,
  },
};
