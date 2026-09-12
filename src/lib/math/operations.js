// src/lib/math/operations.js

/* --------------------------------------------------
   Operation Definitions
-------------------------------------------------- */

export const OPERATIONS = {
  add: {
    name: "Addition",
    symbol: "+",
  },

  sub: {
    name: "Subtraction",
    symbol: "−",
  },

  mul: {
    name: "Multiplication",
    symbol: "×",
  },

  div: {
    name: "Division",
    symbol: "÷",
  },

  mixedOperations: {
    name: "Mixed Operations",
    symbol: "",
  },

  missingNumber: {
    name: "Missing Number",
    symbol: "",
  },

  comparison: {
    name: "Comparison",
    symbol: "",
  },

  estimation: {
    name: "Estimation",
    symbol: "",
  },

  sequences: {
    name: "Sequences & Progressions",
    symbol: "",
  },

  fractions: {
    name: "Fractions",
    symbol: "",
  },

  percentages: {
    name: "Percentages",
    symbol: "%",
  },

  powersRoots: {
    name: "Powers & Roots",
    symbol: "",
  },

  combinations: {
    name: "Factorials, Permutations & Combinations",
    symbol: "",
  },

  probability: {
    name: "Probability",
    symbol: "",
  },
};

/* --------------------------------------------------
   Calculate Answer
-------------------------------------------------- */

export function calculateAnswer(operation, num1, num2) {
  switch (operation) {
    case "add":
      return num1 + num2;

    case "sub":
      return num1 - num2;

    case "mul":
      return num1 * num2;

    case "div":
      return num1 / num2;

    default:
      throw new Error("Invalid operation");
  }
}
