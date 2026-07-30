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

  let num1 = randomNumber(config.min, config.max);

  let num2 = randomNumber(config.min, config.max);

  // avoid division problems
  if (operation === "div") {
    num1 = num1 * num2;
  }

  const answer = calculateAnswer(operation, num1, num2);

  return {
    id: `${operation}_${num1}_${num2}`,

    operation,

    level,

    numbers: [num1, num2],

    question: `${num1} ${getSymbol(operation)} ${num2}`,

    answer,

    options: generateOptions(answer, operation),
  };
}

function getSymbol(operation) {
  return OPERATIONS[operation].symbol;
}
