// src/lib/math/generators/subtraction.js

import { generateOptions } from "../generateOptions";

/* --------------------------------------------------
   Random Number
-------------------------------------------------- */

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* --------------------------------------------------
   Calculate Subtraction Expression
-------------------------------------------------- */

function calculateSubtractionExpression(numbers, operators) {
  let result = numbers[0];

  for (let index = 0; index < operators.length; index++) {
    const operator = operators[index];
    const number = numbers[index + 1];

    if (operator === "+") {
      result += number;
    } else if (operator === "−") {
      result -= number;
    }
  }

  return result;
}

/* --------------------------------------------------
   Generate Subtraction Numbers
-------------------------------------------------- */

function generateSubtractionNumbers(config) {
  const { operands, operators, minResult, maxResult } = config;

  /*
   * Try to generate a complete expression whose result
   * falls inside the configured range.
   */
  for (let attempt = 0; attempt < 100; attempt++) {
    const numbers = operands.map(({ min, max }) => randomNumber(min, max));

    const result = calculateSubtractionExpression(numbers, operators);

    if (result >= minResult && result <= maxResult) {
      return numbers;
    }
  }

  /*
   * Fallback.
   *
   * Use the minimum configured operands if a valid
   * combination could not be found within the attempt limit.
   */
  return operands.map(({ min }) => min);
}

/* --------------------------------------------------
   Generate Subtraction Question
-------------------------------------------------- */

export function generateSubtractionQuestion({ level, config, symbol = "−" }) {
  const numbers = generateSubtractionNumbers(config);
  const { operators } = config;

  const answer = calculateSubtractionExpression(numbers, operators);

  const questionParts = [numbers[0]];

  for (let index = 0; index < operators.length; index++) {
    questionParts.push(operators[index], numbers[index + 1]);
  }

  const question = questionParts.map((part) => (typeof part === "number" ? part.toLocaleString() : part)).join(" ");

  return {
    id: `sub_${numbers.join("_")}`,
    operation: "sub",
    level,
    numbers,
    operators,
    symbol,
    question,
    answer,
    options: generateOptions(answer, "sub", ...numbers),
  };
}
