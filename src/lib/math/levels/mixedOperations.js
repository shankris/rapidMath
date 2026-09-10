// src/lib/math/levels/mixedOperations.js

/* --------------------------------------------------
   Mixed Operations Level Configuration
-------------------------------------------------- */

export const MIXED_OPERATIONS_LEVELS = {
  1: {
    template: "precedence-basic",

    operands: [
      { min: 1, max: 9 },
      { min: 1, max: 9 },
      { min: 1, max: 9 },
    ],

    operators: ["+", "×"],

    minResult: 1,
    maxResult: 50,
    allowNegative: false,
    exactDivision: true,
  },

  2: {
    template: "precedence-extended",

    division: {
      divisor: { min: 2, max: 6 },
      quotient: { min: 2, max: 10 },
    },

    multiplication: {
      multiplier: { min: 2, max: 6 },
      multiplicand: { min: 1, max: 9 },
    },

    addend: { min: 1, max: 9 },

    minResult: 1,
    maxResult: 100,
    allowNegative: false,
    exactDivision: true,
  },

  3: {
    template: "brackets-simple-subtraction",

    operands: [
      { min: 1, max: 9 },
      { min: 1, max: 9 },
      { min: 1, max: 9 },
    ],

    operators: ["+", "−"],

    minResult: 1,
    maxResult: 50,
    allowNegative: false,
    exactDivision: true,
  },

  4: {
    template: "brackets-multiplication",

    addends: [
      { min: 1, max: 9 },
      { min: 1, max: 9 },
    ],

    multiplier: { min: 2, max: 9 },

    minResult: 1,
    maxResult: 200,
    allowNegative: false,
    exactDivision: true,
  },

  5: {
    template: "brackets-division",

    divisor: { min: 2, max: 9 },
    quotient: { min: 2, max: 12 },

    addends: [
      { min: 1, max: 9 },
      { min: 1, max: 9 },
    ],

    minResult: 1,
    maxResult: 100,
    allowNegative: false,
    exactDivision: true,
  },

  6: {
    template: "multiple-brackets",

    firstBracket: {
      operands: [
        { min: 1, max: 20 },
        { min: 1, max: 20 },
      ],
      operator: "+",
    },

    multiplier: { min: 2, max: 9 },

    secondBracket: {
      operands: [
        { min: 1, max: 20 },
        { min: 1, max: 9 },
      ],
      operator: "−",
    },

    finalOperator: "−",

    minResult: 1,
    maxResult: 500,
    allowNegative: false,
    exactDivision: true,
  },

  7: {
    template: "nested-brackets",

    multiplier: { min: 2, max: 9 },

    outerDifference: {
      min: 5,
      max: 30,
    },

    innerAddition: {
      operands: [
        { min: 1, max: 9 },
        { min: 1, max: 9 },
      ],
    },

    middleValue: { min: 5, max: 30 },

    minResult: -100,
    maxResult: 500,
    allowNegative: true,
    exactDivision: true,
  },

  8: {
    template: "advanced-mixed",

    numerator: {
      addends: [
        { min: 10, max: 90 },
        { min: 10, max: 90 },
      ],
    },

    denominator: {
      factors: [
        { min: 2, max: 6 },
        { min: 2, max: 6 },
      ],
    },

    finalAddend: { min: 1, max: 20 },

    minResult: -500,
    maxResult: 2000,
    allowNegative: true,
    exactDivision: true,
  },
};
