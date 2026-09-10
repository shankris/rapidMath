// src/lib/math/levels/estimation.js

/* --------------------------------------------------
   Estimation Level Configuration
-------------------------------------------------- */

export const ESTIMATION_LEVELS = {
  1: {
    template: "addition",
    difficulty: "easy",

    left: {
      operands: [{ min: 20, max: 99 }],
    },

    right: {
      operands: [{ min: 10, max: 99 }],
    },

    rounding: "nearest-10",
  },

  2: {
    template: "addition",
    difficulty: "hard",

    left: {
      operands: [{ min: 100, max: 999 }],
    },

    right: {
      operands: [{ min: 100, max: 999 }],
    },

    rounding: "nearest-100",
  },

  3: {
    template: "subtraction",
    difficulty: "easy",

    left: {
      operands: [{ min: 50, max: 199 }],
    },

    right: {
      operands: [{ min: 20, max: 99 }],
    },

    rounding: "nearest-10",
    positiveResult: true,
  },

  4: {
    template: "subtraction",
    difficulty: "hard",

    left: {
      operands: [{ min: 200, max: 999 }],
    },

    right: {
      operands: [{ min: 100, max: 999 }],
    },

    rounding: "nearest-100",
    positiveResult: true,
  },

  5: {
    template: "multiplication",
    difficulty: "easy",

    left: {
      operands: [{ min: 10, max: 49 }],
    },

    right: {
      operands: [{ min: 2, max: 9 }],
    },

    rounding: "nearest-10",
  },

  6: {
    template: "multiplication",
    difficulty: "hard",

    left: {
      operands: [{ min: 20, max: 99 }],
    },

    right: {
      operands: [{ min: 10, max: 49 }],
    },

    rounding: "nearest-10",
  },

  7: {
    template: "mixed",
    difficulty: "easy",

    left: {
      operands: [
        { min: 50, max: 299 },
        { min: 10, max: 99 },
      ],
      operators: ["+"],
    },

    right: {
      operands: [{ min: 2, max: 5 }],
      operators: ["×"],
    },

    rounding: "nearest-10",
  },

  8: {
    template: "mixed",
    difficulty: "hard",

    left: {
      operands: [
        { min: 200, max: 999 },
        { min: 20, max: 99 },
      ],
      operators: ["+"],
    },

    right: {
      operands: [{ min: 2, max: 9 }],
      operators: ["×"],
    },

    rounding: "nearest-100",
  },
};
