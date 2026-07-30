import { shuffle, matchParity, randomFrom } from "./utils";

export function generateAdditionOptions(answer, num1, num2) {
  let options = new Set();

  options.add(answer);

  const smallerNumber = Math.min(num1, num2);

  let attempts = 0;

  while (options.size < 4 && attempts < 100) {
    attempts++;

    const variations = answer < 50 ? [-3, -2, -1, 1, 2, 3] : [-100, -50, -10, 10, 50, 100];

    let option = answer + randomFrom(variations);

    if (option < 0) continue;

    option = matchParity(answer, option);

    if (option < smallerNumber) continue;

    options.add(option);
  }

  let fallback = 1;

  while (options.size < 4) {
    options.add(answer + fallback++);
  }

  return shuffle([...options]);
}
