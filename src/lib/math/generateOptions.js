// src/lib/math/generateOptions.js

import { shuffle, matchParity, randomFrom } from "./options/utils";

export function generateOptions(answer, operation, num1, num2) {
  if (operation === "div") {
    return generateDivisionOptions(answer);
  }

  let options = new Set();

  options.add(answer);

  const smallerNumber = Math.min(num1, num2);

  let attempts = 0;

  while (options.size < 4 && attempts < 100) {
    attempts++;

    const variations = answer < 50 ? [-3, -2, -1, 1, 2, 3] : [-100, -50, -10, 10, 50, 100];

    let option = answer + randomFrom(variations);

    if (option < 0) {
      continue;
    }

    if (operation === "add" && option < smallerNumber) {
      continue;
    }

    option = matchParity(answer, option);

    if (operation === "add" && option < smallerNumber) {
      continue;
    }

    options.add(option);
  }

  let fallback = 1;

  while (options.size < 4) {
    options.add(answer + fallback);
    fallback++;
  }

  return shuffle([...options]);
}

function generateDivisionOptions(answer) {
  let options = new Set();

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
