/* src/lib/math/levels/powersRoots.js */

/* --------------------------------------------------
   Powers & Roots Level Configuration

   The progression is cumulative.

   Level 1 — Familiar facts
   Level 2 — Simple shortcuts
   Level 3 — Two-digit mental calculation
   Level 4 — Larger mental calculation
   Level 5 — Square-root intervals
   Level 6 — Decimal square-root estimation

   Quiz generation can combine questions from the
   current level with questions from previous levels
   to provide gradual progression and review.
-------------------------------------------------- */

export const POWERS_ROOTS_LEVELS = {
  /* --------------------------------------------------
     Level 1 — Familiar Facts

     Can I recognize and recall it?

     Focus:
     - Single-digit squares
     - Two-digit numbers ending in 5
     - Squares of multiples of 10 up to 100
     - Small cubes
     - Simple perfect square roots
  -------------------------------------------------- */

  1: {
    difficulty: "easy",

    questionTypes: ["single-digit-square", "ending-in-5-square", "multiple-of-10-square", "cube", "square-root"],

    singleDigitSquare: {
      min: 1,
      max: 9,
    },

    endingIn5Square: {
      min: 15,
      max: 95,
      step: 10,
    },

    /*
      There are exactly 10 possible values:
      10, 20, 30, ... 100.
    */
    multipleOf10Square: {
      min: 10,
      max: 100,
      step: 10,
    },

    cube: {
      min: 1,
      max: 5,
    },

    squareRoot: {
      min: 1,
      max: 10,
    },
  },

  /* --------------------------------------------------
     Level 2 — Simple Shortcuts

     Can I use the patterns I have learned?

     Focus:
     - Two-digit numbers ending in 5
     - Squares of multiples of 10
     - Small cubes
     - Perfect square roots
     - Perfect cube roots

     Previous Level 1 questions can also appear
     during quiz generation as review questions.
  -------------------------------------------------- */

  2: {
    difficulty: "easy",

    questionTypes: ["ending-in-5-square", "multiple-of-10-square", "cube", "square-root", "cube-root"],

    endingIn5Square: {
      min: 15,
      max: 95,
      step: 10,
    },

    multipleOf10Square: {
      min: 10,
      max: 100,
      step: 10,
    },

    cube: {
      min: 1,
      max: 10,
    },

    squareRoot: {
      min: 1,
      max: 15,
    },

    cubeRoot: {
      min: 1,
      max: 10,
    },
  },

  /* --------------------------------------------------
     Level 3 — Two-Digit Mental Calculation

     Can I calculate two-digit squares mentally?

     Focus:
     - General two-digit squares up to 40
     - Cubes up to 15
     - Perfect square roots
     - Perfect cube roots

     Previous levels remain available as review.
  -------------------------------------------------- */

  3: {
    difficulty: "moderate",

    questionTypes: ["square", "cube", "square-root", "cube-root"],

    square: {
      min: 11,
      max: 40,
    },

    cube: {
      min: 11,
      max: 15,
    },

    squareRoot: {
      min: 11,
      max: 40,
    },

    cubeRoot: {
      min: 11,
      max: 15,
    },
  },

  /* --------------------------------------------------
     Level 4 — Larger Mental Calculation

     Can I extend the same techniques to larger
     two-digit numbers?

     Focus:
     - Two-digit squares from 41–99
     - Cubes from 16–20
     - Larger perfect square roots
     - Larger perfect cube roots

     Previous levels remain available as review.
  -------------------------------------------------- */

  4: {
    difficulty: "challenging",

    questionTypes: ["square", "cube", "square-root", "cube-root"],

    square: {
      min: 41,
      max: 99,
    },

    cube: {
      min: 16,
      max: 20,
    },

    squareRoot: {
      min: 41,
      max: 99,
    },

    cubeRoot: {
      min: 16,
      max: 20,
    },
  },

  /* --------------------------------------------------
     Level 5 — Square-Root Intervals

     Can I estimate where a square root lies?

     Focus:
     - Non-perfect square roots
     - Identifying the two consecutive integers
       surrounding a square root

     Examples:
     √50 → between 7 and 8
     √70 → between 8 and 9
     √120 → between 10 and 11

     Decimal estimation is deliberately saved
     for Level 6.
  -------------------------------------------------- */

  5: {
    difficulty: "advanced",

    questionTypes: ["square-root-between-integers"],

    squareRootBetweenIntegers: {
      min: 10,
      max: 200,
    },
  },

  /* --------------------------------------------------
     Level 6 — Decimal Square-Root Estimation

     Can I estimate a square root to one decimal place?

     Focus:
     - One-decimal square-root estimation
     - Non-perfect square roots
     - Gradually more difficult radicands

     Previous levels remain available as review.
  -------------------------------------------------- */

  6: {
    difficulty: "advanced",

    questionTypes: ["square-root-estimate"],

    squareRootEstimate: {
      min: 10,
      max: 200,
      decimalPlaces: 1,
    },
  },
};
