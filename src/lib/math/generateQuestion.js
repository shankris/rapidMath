// src/lib/math/generateQuestion.js

import { LEVEL_CONFIG } from "./levels";
import { calculateAnswer } from "./operations";
import { generateOptions } from "./generateOptions";
import { OPERATIONS } from "./operations";

/* --------------------------------------------------
   Random Number
-------------------------------------------------- */

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* --------------------------------------------------
   Generate Addition Numbers
-------------------------------------------------- */

function generateAdditionNumbers(config) {
  const { addends, maxResult } = config;

  /*
   * Try to generate a combination that stays within
   * the configured maximum result.
   */
  for (let attempt = 0; attempt < 100; attempt++) {
    const numbers = addends.map(({ min, max }) => randomNumber(min, max));

    const result = numbers.reduce((total, number) => total + number, 0);

    if (result <= maxResult) {
      return numbers;
    }
  }

  /*
   * Fallback.
   *
   * If random generation cannot find a valid combination,
   * use the minimum values from the configured ranges.
   */
  return addends.map(({ min }) => min);
}

/* --------------------------------------------------
   Generate Question
-------------------------------------------------- */

export function generateQuestion(operation, level) {
  const config = LEVEL_CONFIG[level];

  if (!config) {
    throw new Error(`Invalid level: ${level}`);
  }

  /*
   * Addition now has its own configuration because
   * it supports a variable number of addends.
   */
  if (operation === "add") {
    const numbers = generateAdditionNumbers(config.addition);

    const answer = numbers.reduce((total, number) => total + number, 0);

    const symbol = getSymbol(operation);

    return {
      id: `${operation}_${numbers.join("_")}`,
      operation,
      level,
      numbers,
      symbol,
      question: numbers.map((number) => number.toLocaleString()).join(` ${symbol} `),
      answer,
      options: generateOptions(answer, operation, ...numbers),
    };
  }

  /* ------------------------------------------------
     Existing Operations
  ------------------------------------------------ */

  const maxPossibleDifference = Math.max(config.num1.max, config.num2.max) - Math.min(config.num1.min, config.num2.min);

  const subtractionMinDifference = Math.min(config.subtractionMinDifference ?? 1, maxPossibleDifference);

  const range = operation === "mul" ? config.multiplication : config;

  let num1;
  let num2;

  /* ------------------------------------------------
     Division
  ------------------------------------------------ */

  if (operation === "div") {
    const divisor = randomNumber(config.division.divisor.min, config.division.divisor.max);

    const quotient = randomNumber(config.division.quotient.min, config.division.quotient.max);

    num2 = divisor;
    num1 = divisor * quotient;
  } else if (operation === "sub") {
    /* ------------------------------------------------
     Subtraction
  ------------------------------------------------ */
    do {
      num1 = randomNumber(range.num1.min, range.num1.max);

      num2 = randomNumber(range.num2.min, range.num2.max);

      if (num2 > num1) {
        [num1, num2] = [num2, num1];
      }
    } while (num1 - num2 < subtractionMinDifference);
  } else if (operation === "mul") {
    /* ------------------------------------------------
     Multiplication
  ------------------------------------------------ */
    num1 = randomNumber(range.num1.min, range.num1.max);

    num2 = randomNumber(range.num2.min, range.num2.max);
  } else {
    /* ------------------------------------------------
     Invalid Operation
  ------------------------------------------------ */
    throw new Error(`Invalid operation: ${operation}`);
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

/* --------------------------------------------------
   Get Operation Symbol
-------------------------------------------------- */

function getSymbol(operation) {
  return OPERATIONS[operation].symbol;
}
