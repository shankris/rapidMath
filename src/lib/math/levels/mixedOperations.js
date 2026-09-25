// src/lib/math/levels/mixedOperations.js

/* --------------------------------------------------
   Mixed Operations Level Configuration

   Progression:
   Level 1 — 3 numbers, basic precedence
   Level 2 — 3 numbers, simple brackets
   Level 3 — 4 numbers, basic mixed operations
   Level 4 — 4 numbers, varied brackets and precedence
   Level 5 — Two bracket groups
   Level 6 — Multiple operations and brackets
   Level 7 — Nested brackets and advanced combinations
-------------------------------------------------- */

export const MIXED_OPERATIONS_LEVELS = {
  1: {
    template: "precedence-basic",

    operands: [
      { min: 1, max: 9 },
      { min: 1, max: 9 },
      { min: 1, max: 9 },
    ],

    operators: ["+", "−", "×", "÷"],

    minResult: 1,
    maxResult: 50,
    allowNegative: false,
    exactDivision: true,
  },

  2: {
    template: "brackets-simple",

    operands: [
      { min: 1, max: 9 },
      { min: 1, max: 9 },
      { min: 1, max: 9 },
    ],

    operators: ["+", "−", "×", "÷"],

    minResult: 1,
    maxResult: 50,
    allowNegative: false,
    exactDivision: true,
  },

  3: {
    template: "brackets-four-number",

    operands: [
      { min: 1, max: 9 },
      { min: 1, max: 9 },
      { min: 1, max: 9 },
      { min: 1, max: 9 },
    ],

    operators: ["+", "−", "×", "÷"],

    minResult: 1,
    maxResult: 100,
    allowNegative: false,
    exactDivision: true,
  },

  4: {
    template: "brackets-varied",

    operands: [
      { min: 1, max: 9 },
      { min: 1, max: 9 },
      { min: 1, max: 9 },
      { min: 1, max: 9 },
    ],

    operators: ["+", "−", "×", "÷"],

    minResult: 1,
    maxResult: 150,
    allowNegative: false,
    exactDivision: true,
  },

  5: {
    template: "multiple-brackets",

    firstBracket: {
      operands: [
        { min: 1, max: 9 },
        { min: 1, max: 9 },
      ],
    },

    secondBracket: {
      operands: [
        { min: 1, max: 9 },
        { min: 1, max: 9 },
      ],
    },

    operators: ["+", "−", "×", "÷"],

    minResult: 1,
    maxResult: 250,
    allowNegative: false,
    exactDivision: true,
  },

  6: {
    template: "advanced-brackets",

    operands: [
      { min: 1, max: 12 },
      { min: 1, max: 12 },
      { min: 1, max: 9 },
      { min: 1, max: 9 },
      { min: 1, max: 9 },
    ],

    operators: ["+", "−", "×", "÷"],

    minResult: 1,
    maxResult: 500,
    allowNegative: false,
    exactDivision: true,
  },

  7: {
    template: "nested-brackets",

    operands: [
      { min: 1, max: 20 },
      { min: 1, max: 20 },
      { min: 1, max: 12 },
      { min: 1, max: 12 },
      { min: 1, max: 9 },
    ],

    operators: ["+", "−", "×", "÷"],

    minResult: -100,
    maxResult: 1000,
    allowNegative: true,
    exactDivision: true,
  },
};
