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

export function generateOptions(answer, operation) {
  const variations = [-10, -5, 5, 10, -2, 2];

  let options = new Set();

  // correct answer
  options.add(answer);

  while (options.size < 4) {
    const variation = variations[Math.floor(Math.random() * variations.length)];

    let option = answer + variation;

    // avoid negative numbers
    if (option < 0) {
      continue;
    }

    // preserve even/odd pattern
    option = matchParity(answer, option);

    options.add(option);
  }

  return shuffle(Array.from(options));
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}
