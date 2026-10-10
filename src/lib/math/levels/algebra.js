/* src/lib/math/levels/algebra.js */

/* --------------------------------------------------
Algebra Level Configuration
-------------------------------------------------- */

export const ALGEBRA_LEVELS = {
  /* --------------------------------------------------
Level 1 — Basic Equations
-------------------------------------------------- */

  1: {
    patterns: ["additionEquation", "subtractionEquation", "simpleUnknown", "divisionEquation", "squareEquation", "squareRootEquation", "squareRootUnknown", "factorCancellation"],

    minFactor: 2,
    maxFactor: 12,

    minUnknown: 2,
    maxUnknown: 10,

    minConstant: 1,
    maxConstant: 10,

    minCoefficient: 2,
    maxCoefficient: 3,
  },

  /* --------------------------------------------------
Level 2 — Two-Step Equations
-------------------------------------------------- */

  2: {
    patterns: ["additionEquation", "subtractionEquation", "simpleUnknown", "divisionEquation", "bothSidesEquation", "squareEquation", "squareRootEquation", "factorCancellation"],

    minFactor: 2,
    maxFactor: 15,

    minUnknown: 2,
    maxUnknown: 15,

    minConstant: 1,
    maxConstant: 15,

    minCoefficient: 2,
    maxCoefficient: 5,
  },

  /* --------------------------------------------------
Level 3 — Brackets and Fractions
-------------------------------------------------- */

  3: {
    patterns: ["additionEquation", "subtractionEquation", "divisionEquation", "bothSidesEquation", "bracketEquation", "fractionEquation", "squareEquation", "squareRootEquation", "squareRootUnknown", "factorCancellation"],

    minFactor: 2,
    maxFactor: 20,

    minUnknown: 2,
    maxUnknown: 20,

    minConstant: 1,
    maxConstant: 20,

    minCoefficient: 2,
    maxCoefficient: 7,
  },

  /* --------------------------------------------------
Level 4 — Mixed Algebra
-------------------------------------------------- */

  4: {
    patterns: ["additionEquation", "subtractionEquation", "simpleUnknown", "divisionEquation", "bothSidesEquation", "bracketEquation", "fractionEquation", "squareEquation", "squareRootEquation", "squareRootUnknown", "factorCancellation"],

    minFactor: 2,
    maxFactor: 30,

    minUnknown: 2,
    maxUnknown: 30,

    minConstant: 1,
    maxConstant: 30,

    minCoefficient: 2,
    maxCoefficient: 9,
  },
  /* --------------------------------------------------
Level 5 — Advanced Squares and Roots
-------------------------------------------------- */

  5: {
    patterns: ["bothSidesEquation", "bracketEquation", "fractionEquation", "squareEquation", "squareRootEquation", "squareRootUnknown", "squareRootProductEquation", "factorCancellation"],

    minFactor: 2,
    maxFactor: 40,

    minUnknown: 2,
    maxUnknown: 40,

    minConstant: 1,
    maxConstant: 40,

    minCoefficient: 2,
    maxCoefficient: 10,
  },

  /* --------------------------------------------------
Level 6 — Mixed Advanced Algebra
-------------------------------------------------- */

  6: {
    patterns: ["additionEquation", "subtractionEquation", "simpleUnknown", "divisionEquation", "bothSidesEquation", "bracketEquation", "fractionEquation", "squareEquation", "squareRootEquation", "squareRootUnknown", "squareRootProductEquation", "factorCancellation"],

    minFactor: 2,
    maxFactor: 50,

    minUnknown: 2,
    maxUnknown: 50,

    minConstant: 1,
    maxConstant: 50,

    minCoefficient: 2,
    maxCoefficient: 12,
  },
};
