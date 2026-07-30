// src/lib/math/operations.js

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
};

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
