// src/lib/math/levels/powersRoots.js

/* --------------------------------------------------
   Powers & Roots Level Configuration

   Each level defines the types of questions that can
   be generated and the ranges used by those types.

   Root interval questions progress from simple,
   familiar perfect-square boundaries to one-decimal
   estimation in Level 4.
-------------------------------------------------- */

export const POWERS_ROOTS_LEVELS = {
  /* --------------------------------------------------
     Level 1 — Fundamentals & Easy Patterns

     Can I recognize it?

     Focus:
     - Single-digit squares
     - Squares of multiples of 10
     - Numbers ending in 5
     - Small cubes
     - Perfect square roots
     - Perfect cube roots
     - Simple root intervals
  -------------------------------------------------- */

  1: {
    difficulty: "easy",

    questionTypes: ["single-digit-square", "multiple-of-10-square", "ending-in-5-square", "cube", "square-root", "cube-root", "square-root-interval"],

    singleDigitSquare: {
      min: 1,
      max: 9,
    },

    multipleOf10Square: {
      min: 10,
      max: 200,
      step: 10,
    },

    endingIn5Square: {
      min: 15,
      max: 95,
      step: 10,
    },

    cube: {
      min: 1,
      max: 10,
    },

    squareRoot: {
      min: 1,
      max: 10,
    },

    cubeRoot: {
      min: 1,
      max: 10,
    },

    /*
      Simple intervals between familiar perfect squares.

      Example:
      √64 and √81 → 8 and 9
    */
    squareRootInterval: {
      min: 1,
      max: 9,
    },
  },

  /* --------------------------------------------------
     Level 2 — Shortcuts & Larger Numbers

     Do I know the shortcut?

     Focus:
     - Three-digit squares ending in 5
     - Larger multiples of 10
     - Cubes 11–20
     - Larger perfect square roots
     - Larger perfect cube roots
     - Root intervals with closer boundaries
  -------------------------------------------------- */

  2: {
    difficulty: "moderate",

    questionTypes: ["three-digit-ending-in-5-square", "multiple-of-10-square", "cube", "square-root", "cube-root", "square-root-interval"],

    threeDigitEndingIn5Square: {
      min: 105,
      max: 995,
      step: 10,
    },

    multipleOf10Square: {
      min: 210,
      max: 1000,
      step: 10,
    },

    cube: {
      min: 11,
      max: 20,
    },

    squareRoot: {
      min: 11,
      max: 31,
    },

    cubeRoot: {
      min: 11,
      max: 20,
    },

    /*
      Boundaries are still perfect squares, but the
      numbers are larger and the interval is narrower.
    */
    squareRootInterval: {
      min: 10,
      max: 20,
    },
  },

  /* --------------------------------------------------
     Level 3 — Mental Calculation

     Can I calculate it mentally?

     Focus:
     - General two-digit squares
     - Cubes
     - Perfect square roots
     - Perfect cube roots
     - Finding the two integers around a root
     - Root interval reasoning
  -------------------------------------------------- */

  3: {
    difficulty: "challenging",

    questionTypes: ["square", "cube", "square-root", "cube-root", "square-root-interval", "square-root-between-integers"],

    square: {
      min: 11,
      max: 40,
    },

    cube: {
      min: 11,
      max: 25,
    },

    squareRoot: {
      min: 11,
      max: 40,
    },

    cubeRoot: {
      min: 11,
      max: 25,
    },

    /*
      Non-perfect-square roots become the focus here.
    */
    squareRootInterval: {
      min: 32,
      max: 100,
    },

    squareRootBetweenIntegers: {
      min: 21,
      max: 40,
    },
  },

  /* --------------------------------------------------
     Level 4 — Advanced Mental Calculation

     Can I calculate it mentally under time pressure?

     Focus:
     - Larger two-digit squares
     - Larger cubes
     - Larger perfect square roots
     - Larger perfect cube roots
     - One-decimal square-root estimation
     - Mixed powers and roots
  -------------------------------------------------- */

  4: {
    difficulty: "advanced",

    questionTypes: ["square", "cube", "square-root", "cube-root", "square-root-interval", "square-root-between-integers", "mixed-powers-roots"],

    square: {
      min: 41,
      max: 99,
    },

    cube: {
      min: 21,
      max: 25,
    },

    squareRoot: {
      min: 41,
      max: 99,
    },

    cubeRoot: {
      min: 21,
      max: 25,
    },

    /*
      The generator will only select a pair of
      consecutive radicands when a one-decimal value
      exists strictly between their square roots.

      Example:
      √80 < 8.9 < √81

      But:
      √97 < 9.9 is false because 9.9 > √98,
      so √97 / √98 will not be generated.
    */
    squareRootInterval: {
      min: 41,
      max: 99,
      decimalPlaces: 1,
    },

    squareRootBetweenIntegers: {
      min: 50,
      max: 500,
    },

    mixedPowersRoots: {
      min: 1,
      max: 25,
    },
  },
};
