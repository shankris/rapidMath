// src/lib/math/levels/comparison.js

/* --------------------------------------------------
   Comparison Level Configuration
-------------------------------------------------- */

export const COMPARISON_LEVELS = {
  1: {
    template: "addition-single",
    equalityProbability: 0.25,
    closeDifferenceProbability: 0.35,
    maxDifference: 14,
    closeDifference: {
      min: 2,
      max: 5,
    },

    left: {
      operands: [
        { min: 1, max: 10 },
        { min: 1, max: 10 },
      ],
    },

    right: {
      operands: [{ min: 1, max: 20 }],
    },
  },

  2: {
    template: "addition-single",
    equalityProbability: 0.25,
    closeDifferenceProbability: 0.35,
    maxDifference: 14,
    closeDifference: {
      min: 2,
      max: 7,
    },

    left: {
      operands: [
        { min: 10, max: 30 },
        { min: 1, max: 20 },
      ],
    },

    right: {
      operands: [{ min: 10, max: 50 }],
    },
  },

  3: {
    template: "addition-double",
    equalityProbability: 0.25,
    closeDifferenceProbability: 0.35,
    maxDifference: 20,
    closeDifference: {
      min: 3,
      max: 8,
    },

    left: {
      operands: [
        { min: 10, max: 40 },
        { min: 1, max: 30 },
      ],
    },

    right: {
      operands: [
        { min: 10, max: 40 },
        { min: 1, max: 30 },
      ],
    },
  },

  4: {
    template: "addition-double",
    equalityProbability: 0.25,
    closeDifferenceProbability: 0.35,
    maxDifference: 30,
    closeDifference: {
      min: 4,
      max: 10,
    },

    left: {
      operands: [
        { min: 20, max: 70 },
        { min: 10, max: 50 },
      ],
    },

    right: {
      operands: [
        { min: 20, max: 70 },
        { min: 10, max: 50 },
      ],
    },
  },

  5: {
    template: "subtraction-double",
    equalityProbability: 0.25,
    closeDifferenceProbability: 0.35,
    maxDifference: 50,
    closeDifference: {
      min: 4,
      max: 10,
    },

    left: {
      operands: [
        { min: 100, max: 500 },
        { min: 10, max: 200 },
      ],
    },

    right: {
      operands: [
        { min: 100, max: 500 },
        { min: 10, max: 200 },
      ],
    },
  },

  6: {
    template: "mixed",
    equalityProbability: 0.25,
    closeDifferenceProbability: 0.35,
    maxDifference: 50,
    closeDifference: {
      min: 4,
      max: 10,
    },

    left: {
      operands: [
        { min: 10, max: 30 },
        { min: 2, max: 9 },
      ],
      operator: "×",
    },

    right: {
      operands: [
        { min: 100, max: 300 },
        { min: 10, max: 100 },
      ],
      operator: "−",
    },
  },

  7: {
    template: "mixed",
    equalityProbability: 0.25,
    closeDifferenceProbability: 0.35,
    maxDifference: 50,
    closeDifference: {
      min: 4,
      max: 10,
    },

    left: {
      operands: [
        { min: 20, max: 50 },
        { min: 5, max: 20 },
      ],
      operator: "×",
    },

    right: {
      operands: [
        { min: 500, max: 1000 },
        { min: 50, max: 200 },
      ],
      operator: "−",
    },
  },

  8: {
    template: "multiple",
    equalityProbability: 0.3,
    closeDifferenceProbability: 0.35,
    maxDifference: 50,
    closeDifference: {
      min: 4,
      max: 10,
    },

    left: {
      operands: [
        { min: 50, max: 200 },
        { min: 10, max: 50 },
        { min: 2, max: 5 },
      ],
      operators: ["+", "×"],
    },

    right: {
      operands: [
        { min: 200, max: 1000 },
        { min: 10, max: 100 },
      ],
      operators: ["−"],
    },
  },
};
