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

  let num1 = randomNumber(config.num1.min, config.num1.max);
  let num2 = randomNumber(config.num2.min, config.num2.max);

  // avoid division problems
  if (operation === "div") {
    num2 = randomNumber(config.num2.min, config.num2.max);

    const quotient = randomNumber(config.num1.min, config.num1.max);
    num1 = quotient * num2;
  } else {
    num1 = randomNumber(config.num1.min, config.num1.max);
    num2 = randomNumber(config.num2.min, config.num2.max);
  }

  const answer = calculateAnswer(operation, num1, num2);

  return {
    id: `${operation}_${num1}_${num2}`,

    operation,

    level,

    numbers: [num1, num2],

    question: `${num1.toLocaleString()} ${getSymbol(operation)} ${num2.toLocaleString()}`,

    answer,

    options: generateOptions(answer, operation, num1, num2),
  };
}

function getSymbol(operation) {
  return OPERATIONS[operation].symbol;
}
