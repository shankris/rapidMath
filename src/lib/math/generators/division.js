// src/lib/math/generators/division.js

import { generateOptions } from "../generateOptions";

/* --------------------------------------------------
   Random Number
-------------------------------------------------- */

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* --------------------------------------------------
   Generate Division Question
-------------------------------------------------- */

export function generateDivisionQuestion({ level, config, symbol = "÷" }) {
  /*
   * Generate the divisor and quotient separately.
   *
   * This guarantees that the resulting dividend is
   * always exactly divisible by the divisor.
   */
  const divisor = randomNumber(config.divisor.min, config.divisor.max);

  const quotient = randomNumber(config.quotient.min, config.quotient.max);

  const dividend = divisor * quotient;

  return {
    id: `div_${dividend}_${divisor}`,
    operation: "div",
    level,
    numbers: [dividend, divisor],
    symbol,
    question: `${dividend.toLocaleString()} ${symbol} ${divisor.toLocaleString()}`,
    answer: quotient,
    options: generateOptions(quotient, "div", dividend, divisor),
  };
}
