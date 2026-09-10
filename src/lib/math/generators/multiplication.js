// src/lib/math/generators/multiplication.js

import { generateOptions } from "../generateOptions";

/* --------------------------------------------------
   Random Number
-------------------------------------------------- */

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* --------------------------------------------------
   Generate Multiplication Question
-------------------------------------------------- */

export function generateMultiplicationQuestion({ level, config, symbol = "×" }) {
  const num1 = randomNumber(config.num1.min, config.num1.max);

  const num2 = randomNumber(config.num2.min, config.num2.max);

  const answer = num1 * num2;

  return {
    id: `mul_${num1}_${num2}`,
    operation: "mul",
    level,
    numbers: [num1, num2],
    symbol,
    question: `${num1.toLocaleString()} ${symbol} ${num2.toLocaleString()}`,
    answer,
    options: generateOptions(answer, "mul", num1, num2),
  };
}
