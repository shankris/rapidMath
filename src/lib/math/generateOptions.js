// src/lib/math/generateOptions.js

function getParity(number) {
  return number % 2 === 0 ? "even" : "odd";
}

function matchParity(answer, value) {
  if (getParity(answer) === getParity(value)) {
    return value;
  }

  return value + 1;
}

export function generateOptions(answer, operation, num1, num2) {
  let options = new Set();

  options.add(answer);

  const smallerNumber = Math.min(num1, num2);

  let attempts = 0;

  while (options.size < 4 && attempts < 100) {
    attempts++;

    let variation;

    if (answer < 50) {
      const variations = [-3, -2, -1, 1, 2, 3];

      variation = variations[Math.floor(Math.random() * variations.length)];
    } else {
      const variations = [-100, -50, -10, 10, 50, 100];

      variation = variations[Math.floor(Math.random() * variations.length)];
    }

    let option = answer + variation;

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

  // fallback
  let fallback = 1;

  while (options.size < 4 && fallback < 100) {
    const option = answer + fallback;

    if (!options.has(option)) {
      options.add(option);
    }

    fallback++;
  }

  return shuffle(Array.from(options));
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}
