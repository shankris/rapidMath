// src/lib/math/generateOptions.js

import { shuffle, matchParity, randomFrom } from "./options/utils";

/* --------------------------------------------------
   Generate Options
-------------------------------------------------- */

export function generateOptions(answer, operation) {
  if (operation === "div") {
    return generateDivisionOptions(answer);
  }

  const options = new Set();

  options.add(answer);

  let attempts = 0;

  while (options.size < 4 && attempts < 100) {
    attempts++;

    const variations = Math.abs(answer) < 50 ? [-3, -2, -1, 1, 2, 3] : [-100, -50, -10, 10, 50, 100];

    let option = answer + randomFrom(variations);

    /*
     * Addition and multiplication should not produce
     * negative answer choices.
     *
     * Subtraction is different because negative answers
     * are valid from the appropriate levels.
     */
    if (operation !== "sub" && option < 0) {
      continue;
    }

    option = matchParity(answer, option);

    /*
     * Keep negative options for Subtraction.
     * Other operations continue to reject them.
     */
    if (operation !== "sub" && option < 0) {
      continue;
    }

    options.add(option);
  }

  /* ------------------------------------------------
     Fallback Options
  ------------------------------------------------ */

  let fallback = 1;

  while (options.size < 4) {
    const option = answer + fallback;

    if (operation === "sub" || option >= 0) {
      options.add(option);
    }

    fallback++;
  }

  return shuffle([...options]);
}

/* --------------------------------------------------
   Division Options
-------------------------------------------------- */

function generateDivisionOptions(answer) {
  const options = new Set();

  options.add(answer);

  const variations = [-10, -5, -2, -1, 1, 2, 5, 10];

  while (options.size < 4) {
    const variation = randomFrom(variations);

    const option = answer + variation;

    if (option > 0) {
      options.add(option);
    }
  }

  return shuffle([...options]);
}
