// src/lib/math/generateQuestion.js

import { LEVEL_CONFIG } from "./levels";
import { calculateAnswer } from "./operations";
import { generateOptions } from "./generateOptions";
import { OPERATIONS } from "./operations";

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateQuestion(operation, level) {
  const config = LEVEL_CONFIG[level];

  const maxPossibleDifference = Math.max(config.num1.max, config.num2.max) - Math.min(config.num1.min, config.num2.min);

  const subtractionMinDifference = Math.min(config.subtractionMinDifference ?? 1, maxPossibleDifference);

  const range = operation === "mul" ? config.multiplication : config;

  let num1;
  let num2;

  // avoid division problems
  if (operation === "div") {
    const divisor = randomNumber(config.division.divisor.min, config.division.divisor.max);

    const quotient = randomNumber(config.division.quotient.min, config.division.quotient.max);

    num2 = divisor;
    num1 = divisor * quotient;
  } else if (operation === "sub") {
    // Prevent negative answers and enforce a minimum difference
    do {
      num1 = randomNumber(range.num1.min, range.num1.max);
      num2 = randomNumber(range.num2.min, range.num2.max);

      if (num2 > num1) {
        [num1, num2] = [num2, num1];
      }
    } while (num1 - num2 < subtractionMinDifference);
  } else {
    num1 = randomNumber(range.num1.min, range.num1.max);
    num2 = randomNumber(range.num2.min, range.num2.max);
  }

  if (!["add", "sub", "mul", "div"].includes(operation)) {
    console.error("Invalid operation received:", operation);
  }

  const answer = calculateAnswer(operation, num1, num2);

  return {
    id: `${operation}_${num1}_${num2}`,
    operation,
    level,
    numbers: [num1, num2],
    symbol: getSymbol(operation),
    question: `${num1.toLocaleString()} ${getSymbol(operation)} ${num2.toLocaleString()}`,
    answer,
    options: generateOptions(answer, operation, num1, num2),
  };
}

function getSymbol(operation) {
  return OPERATIONS[operation].symbol;
}
