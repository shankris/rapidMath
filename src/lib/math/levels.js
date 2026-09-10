// src/lib/math/levels.js

/* --------------------------------------------------
   Level Configuration
-------------------------------------------------- */

export const LEVEL_CONFIG = {
  /* ------------------------------------------------
     Level 1
  ------------------------------------------------ */

  1: {
    title: "Single Digits",
    description: "Practice basic arithmetic with single digit numbers.",

    details: {
      add: "Add numbers up to 18",
      sub: "Subtract numbers up to 9",
      mul: "Multiply numbers up to 25",
      div: "Divide numbers up to 5",
    },

    addition: {
      addends: [
        { min: 1, max: 9 },
        { min: 1, max: 9 },
      ],
      maxResult: 18,
      carryProbability: 0.25,
    },

    num1: { min: 1, max: 9 },
    num2: { min: 1, max: 9 },
    subtractionMinDifference: 5,

    multiplication: {
      num1: { min: 2, max: 5 },
      num2: { min: 2, max: 5 },
    },

    division: {
      divisor: { min: 2, max: 5 },
      quotient: { min: 2, max: 5 },
    },
  },

  /* ------------------------------------------------
     Level 2
  ------------------------------------------------ */

  2: {
    title: "Single + Double Digit",
    description: "Combine single digit numbers with larger values.",

    details: {
      add: "Add numbers up to 60",
      sub: "Subtract numbers up to 30",
      mul: "Multiply numbers up to 49",
      div: "Divide numbers up to 10",
    },

    addition: {
      addends: [
        { min: 10, max: 59 },
        { min: 1, max: 9 },
      ],
      maxResult: 60,
      carryProbability: 0.35,
    },

    num1: { min: 1, max: 9 },
    num2: { min: 10, max: 30 },
    subtractionMinDifference: 10,

    multiplication: {
      num1: { min: 2, max: 7 },
      num2: { min: 2, max: 7 },
    },

    division: {
      divisor: { min: 2, max: 7 },
      quotient: { min: 2, max: 10 },
    },
  },

  /* ------------------------------------------------
     Level 3
  ------------------------------------------------ */

  3: {
    title: "Double Digit Basics",
    description: "Practice working with two digit numbers.",

    details: {
      add: "Add numbers up to 120",
      sub: "Subtract numbers up to 30",
      mul: "Multiply numbers up to 81",
      div: "Divide numbers up to 12",
    },

    addition: {
      addends: [
        { min: 10, max: 99 },
        { min: 10, max: 99 },
      ],
      maxResult: 120,
      carryProbability: 0.45,
    },

    num1: { min: 10, max: 30 },
    num2: { min: 10, max: 30 },
    subtractionMinDifference: 10,

    multiplication: {
      num1: { min: 2, max: 9 },
      num2: { min: 2, max: 9 },
    },

    division: {
      divisor: { min: 2, max: 9 },
      quotient: { min: 2, max: 12 },
    },
  },

  /* ------------------------------------------------
     Level 4
  ------------------------------------------------ */

  4: {
    title: "Double Digit Practice",
    description: "Improve calculation speed with larger numbers.",

    details: {
      add: "Add numbers up to 200",
      sub: "Subtract numbers up to 60",
      mul: "Multiply numbers up to 144",
      div: "Divide numbers up to 20",
    },

    addition: {
      addends: [
        { min: 10, max: 99 },
        { min: 10, max: 99 },
      ],
      maxResult: 200,
      carryProbability: 0.55,
    },

    num1: { min: 10, max: 60 },
    num2: { min: 10, max: 60 },
    subtractionMinDifference: 20,

    multiplication: {
      num1: { min: 2, max: 12 },
      num2: { min: 2, max: 12 },
    },

    division: {
      divisor: { min: 2, max: 12 },
      quotient: { min: 5, max: 20 },
    },
  },

  /* ------------------------------------------------
     Level 5
  ------------------------------------------------ */

  5: {
    title: "Three + Two Digit",
    description: "Add a three digit number and a two digit number.",

    details: {
      add: "Add numbers up to 300",
      sub: "Subtract numbers up to 99",
      mul: "Multiply numbers up to 270",
      div: "Divide numbers up to 20",
    },

    addition: {
      addends: [
        { min: 100, max: 299 },
        { min: 10, max: 99 },
      ],
      maxResult: 300,
      carryProbability: 0.6,
    },

    num1: { min: 10, max: 99 },
    num2: { min: 10, max: 99 },
    subtractionMinDifference: 30,

    multiplication: {
      num1: { min: 10, max: 30 },
      num2: { min: 2, max: 9 },
    },

    division: {
      divisor: { min: 2, max: 9 },
      quotient: { min: 10, max: 20 },
    },
  },

  /* ------------------------------------------------
     Level 6
  ------------------------------------------------ */

  6: {
    title: "Three Number Addition",
    description: "Add three single digit numbers.",

    details: {
      add: "Add three numbers up to 27",
      sub: "Subtract numbers up to 999",
      mul: "Multiply numbers up to 600",
      div: "Divide numbers up to 30",
    },

    addition: {
      addends: [
        { min: 1, max: 9 },
        { min: 1, max: 9 },
        { min: 1, max: 9 },
      ],
      maxResult: 27,
      carryProbability: 0.3,
    },

    num1: { min: 10, max: 99 },
    num2: { min: 100, max: 999 },
    subtractionMinDifference: 100,

    multiplication: {
      num1: { min: 20, max: 50 },
      num2: { min: 2, max: 12 },
    },

    division: {
      divisor: { min: 2, max: 12 },
      quotient: { min: 10, max: 30 },
    },
  },

  /* ------------------------------------------------
     Level 7
  ------------------------------------------------ */

  7: {
    title: "Two + One + One",
    description: "Add one two digit number and two single digit numbers.",

    details: {
      add: "Add three numbers up to 60",
      sub: "Subtract numbers up to 999",
      mul: "Multiply numbers up to 1,000",
      div: "Divide numbers up to 30",
    },

    addition: {
      addends: [
        { min: 10, max: 59 },
        { min: 1, max: 9 },
        { min: 1, max: 9 },
      ],
      maxResult: 60,
      carryProbability: 0.45,
    },

    num1: { min: 100, max: 999 },
    num2: { min: 100, max: 999 },
    subtractionMinDifference: 300,

    multiplication: {
      num1: { min: 10, max: 50 },
      num2: { min: 10, max: 20 },
    },

    division: {
      divisor: { min: 10, max: 20 },
      quotient: { min: 10, max: 30 },
    },
  },

  /* ------------------------------------------------
     Level 8
  ------------------------------------------------ */

  8: {
    title: "Two + Two + One",
    description: "Add two two digit numbers and one single digit number.",

    details: {
      add: "Add three numbers up to 100",
      sub: "Subtract numbers up to 9,999",
      mul: "Multiply numbers up to 2,970",
      div: "Divide numbers up to 50",
    },

    addition: {
      addends: [
        { min: 10, max: 89 },
        { min: 10, max: 89 },
        { min: 1, max: 9 },
      ],
      maxResult: 100,
      carryProbability: 0.55,
    },

    num1: { min: 1000, max: 9999 },
    num2: { min: 1000, max: 9999 },
    subtractionMinDifference: 1000,

    multiplication: {
      num1: { min: 20, max: 99 },
      num2: { min: 10, max: 30 },
    },

    division: {
      divisor: { min: 10, max: 30 },
      quotient: { min: 20, max: 50 },
    },
  },

  /* ------------------------------------------------
     Level 9
  ------------------------------------------------ */

  9: {
    title: "Three Two Digit Numbers",
    description: "Add three two digit numbers.",

    details: {
      add: "Add three numbers up to 150",
      sub: "Subtract numbers up to 99,999",
      mul: "Multiply numbers up to 9,801",
      div: "Divide numbers up to 100",
    },

    addition: {
      addends: [
        { min: 10, max: 99 },
        { min: 10, max: 99 },
        { min: 10, max: 99 },
      ],
      maxResult: 150,
      carryProbability: 0.65,
    },

    num1: { min: 10000, max: 99999 },
    num2: { min: 10000, max: 99999 },
    subtractionMinDifference: 10000,

    multiplication: {
      num1: { min: 25, max: 99 },
      num2: { min: 10, max: 99 },
    },

    division: {
      divisor: { min: 10, max: 50 },
      quotient: { min: 20, max: 100 },
    },
  },

  /* ------------------------------------------------
     Level 10
  ------------------------------------------------ */

  10: {
    title: "Three Digit + Two + Two",
    description: "Add one three digit number and two two digit numbers.",

    details: {
      add: "Add three numbers up to 300",
      sub: "Subtract numbers up to 999,999",
      mul: "Multiply numbers up to 97,902",
      div: "Divide numbers up to 200",
    },

    addition: {
      addends: [
        { min: 100, max: 299 },
        { min: 10, max: 99 },
        { min: 10, max: 99 },
      ],
      maxResult: 300,
      carryProbability: 0.7,
    },

    num1: { min: 100000, max: 999999 },
    num2: { min: 100000, max: 999999 },
    subtractionMinDifference: 100000,

    multiplication: {
      num1: { min: 50, max: 999 },
      num2: { min: 2, max: 99 },
    },

    division: {
      divisor: { min: 10, max: 99 },
      quotient: { min: 50, max: 200 },
    },
  },

  /* ------------------------------------------------
     Level 11
  ------------------------------------------------ */

  11: {
    title: "Four Digit + Two + Two",
    description: "Add one four digit number and two two digit numbers.",

    details: {
      add: "Add three numbers up to 1,500",
      sub: "Advanced subtraction",
      mul: "Advanced multiplication",
      div: "Advanced division",
    },

    addition: {
      addends: [
        { min: 1000, max: 1400 },
        { min: 10, max: 99 },
        { min: 10, max: 99 },
      ],
      maxResult: 1500,
      carryProbability: 0.8,
    },

    /*
     * Existing values below are retained temporarily
     * for the operations that have not yet been redesigned.
     */
    num1: { min: 100000, max: 999999 },
    num2: { min: 100000, max: 999999 },
    subtractionMinDifference: 100000,

    multiplication: {
      num1: { min: 50, max: 999 },
      num2: { min: 2, max: 99 },
    },

    division: {
      divisor: { min: 10, max: 99 },
      quotient: { min: 50, max: 200 },
    },
  },

  /* ------------------------------------------------
     Level 12
  ------------------------------------------------ */

  12: {
    title: "Four + Three + Two Digit",
    description: "Add four, three and two digit numbers with frequent carrying.",

    details: {
      add: "Add three numbers up to 2,000",
      sub: "Advanced subtraction",
      mul: "Advanced multiplication",
      div: "Advanced division",
    },

    addition: {
      addends: [
        { min: 1000, max: 1900 },
        { min: 100, max: 999 },
        { min: 10, max: 99 },
      ],
      maxResult: 2000,
      carryProbability: 0.9,
    },

    /*
     * Existing values below are retained temporarily
     * for the operations that have not yet been redesigned.
     */
    num1: { min: 100000, max: 999999 },
    num2: { min: 100000, max: 999999 },
    subtractionMinDifference: 100000,

    multiplication: {
      num1: { min: 50, max: 999 },
      num2: { min: 2, max: 99 },
    },

    division: {
      divisor: { min: 10, max: 99 },
      quotient: { min: 50, max: 200 },
    },
  },
};
