// src/lib/math/generators/addition.js

import { generateOptions } from "../generateOptions";

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
   Generate Addition Question
-------------------------------------------------- */

export function generateAdditionQuestion({ level, config, symbol = "+" }) {
  const numbers = generateAdditionNumbers(config);

  const answer = numbers.reduce((total, number) => total + number, 0);

  return {
    id: `add_${numbers.join("_")}`,
    operation: "add",
    level,
    numbers,
    symbol,
    question: numbers.map((number) => number.toLocaleString()).join(` ${symbol} `),
    answer,
    options: generateOptions(answer, "add", ...numbers),
  };
}
