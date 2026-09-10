// src/lib/math/generators/percentages.js

/* --------------------------------------------------
   Percentage Utilities
-------------------------------------------------- */

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(values) {
  const result = [...values];

  for (let index = result.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));

    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }

  return result;
}

function formatNumber(value) {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)));
}

function generateNumericOptions(answer, step = 1) {
  const candidates = [answer - step, answer + step, answer - step * 2, answer + step * 2, answer - step * 3, answer + step * 3];

  const options = [];
  const used = new Set([answer]);

  for (const candidate of candidates) {
    if (candidate >= 0 && Number.isFinite(candidate) && !used.has(candidate)) {
      used.add(candidate);
      options.push(candidate);
    }

    if (options.length === 3) {
      break;
    }
  }

  while (options.length < 3) {
    const candidate = answer + randomInt(-10, 10) * step;

    if (candidate >= 0 && Number.isFinite(candidate) && !used.has(candidate)) {
      used.add(candidate);
      options.push(candidate);
    }
  }

  return shuffle([answer, ...options]);
}

function calculatePercentage(number, percentage) {
  return (number * percentage) / 100;
}

/* --------------------------------------------------
   Level 1 & 2
   Percentage of a Number
-------------------------------------------------- */

function generatePercentOfNumberQuestion(config) {
  const percentage = config.percentages[randomInt(0, config.percentages.length - 1)];

  const number = randomInt(config.number.min, config.number.max);

  const answer = calculatePercentage(number, percentage);

  return {
    numbers: [number, percentage],
    operators: ["%"],
    question: `${percentage}% of ${number} = ?`,
    answer,
    options: generateNumericOptions(answer, percentage === 5 ? 5 : 1),
  };
}

/* --------------------------------------------------
   Level 3
   Percentage Increase
-------------------------------------------------- */

function generatePercentageIncreaseQuestion(config) {
  const percentage = config.percentages[randomInt(0, config.percentages.length - 1)];

  const number = randomInt(config.number.min, config.number.max);

  const increase = calculatePercentage(number, percentage);

  const answer = number + increase;

  return {
    numbers: [number, percentage],
    operators: ["+"],
    question: `Increase ${number} by ${percentage}% = ?`,
    answer,
    options: generateNumericOptions(answer, 1),
  };
}

/* --------------------------------------------------
   Level 4
   Percentage Decrease
-------------------------------------------------- */

function generatePercentageDecreaseQuestion(config) {
  const percentage = config.percentages[randomInt(0, config.percentages.length - 1)];

  const number = randomInt(config.number.min, config.number.max);

  const decrease = calculatePercentage(number, percentage);

  const answer = number - decrease;

  return {
    numbers: [number, percentage],
    operators: ["−"],
    question: `Decrease ${number} by ${percentage}% = ?`,
    answer,
    options: generateNumericOptions(answer, 1),
  };
}

/* --------------------------------------------------
   Level 5
   Find the Original Amount
-------------------------------------------------- */

function generateFindOriginalQuestion(config) {
  const percentage = config.percentages[randomInt(0, config.percentages.length - 1)];

  const original = randomInt(config.original.min, config.original.max);

  const result = calculatePercentage(original, 100 - percentage);

  if (!Number.isInteger(result)) {
    return generateFindOriginalQuestion(config);
  }

  return {
    numbers: [result, percentage],
    operators: ["%"],
    question: `${formatNumber(result)} is ${100 - percentage}% of what number?`,
    answer: original,
    options: generateNumericOptions(original, 1),
  };
}

/* --------------------------------------------------
   Level 6
   What Percentage?
-------------------------------------------------- */

function generateWhatPercentQuestion(config) {
  let number;
  let percentage;
  let part;

  do {
    number = randomInt(config.number.min, config.number.max);

    percentage = randomInt(config.percentage.min, config.percentage.max);

    part = calculatePercentage(number, percentage);
  } while (!Number.isInteger(part) || part <= 0);

  return {
    numbers: [part, number],
    operators: ["%"],
    question: `${part} is what percentage of ${number}?`,
    answer: percentage,
    options: generateNumericOptions(percentage, 1),
  };
}

/* --------------------------------------------------
   Level 7
   Multi-Step Percentage
-------------------------------------------------- */

function generateMultiStepQuestion(config) {
  const percentage1 = config.percentages[randomInt(0, config.percentages.length - 1)];

  const percentage2 = config.percentages[randomInt(0, config.percentages.length - 1)];

  const number = randomInt(config.number.min, config.number.max);

  const firstChange = calculatePercentage(number, percentage1);

  const afterIncrease = number + firstChange;

  const secondChange = calculatePercentage(afterIncrease, percentage2);

  const answer = afterIncrease - secondChange;

  if (!Number.isInteger(answer)) {
    return generateMultiStepQuestion(config);
  }

  return {
    numbers: [number, percentage1, percentage2],
    operators: ["+", "−"],
    question: `${number} increased by ${percentage1}% and then decreased by ${percentage2}% = ?`,
    answer,
    options: generateNumericOptions(answer, 1),
  };
}

/* --------------------------------------------------
   Level 8
   Mixed Percentage
-------------------------------------------------- */

function generateMixedQuestion(config) {
  const number = randomInt(config.number.min, config.number.max);

  const percentage = config.percentages[randomInt(0, config.percentages.length - 1)];

  const mode = Math.random() < 0.5 ? "increase" : "decrease";

  const change = calculatePercentage(number, percentage);

  const answer = mode === "increase" ? number + change : number - change;

  if (!Number.isInteger(answer)) {
    return generateMixedQuestion(config);
  }

  const question = mode === "increase" ? `Increase ${number} by ${percentage}% = ?` : `Decrease ${number} by ${percentage}% = ?`;

  return {
    numbers: [number, percentage],
    operators: [mode === "increase" ? "+" : "−"],
    question,
    answer,
    options: generateNumericOptions(answer, 1),
  };
}

/* --------------------------------------------------
   Template Generators
-------------------------------------------------- */

const TEMPLATE_GENERATORS = {
  "percent-of-number": generatePercentOfNumberQuestion,
  "percentage-increase": generatePercentageIncreaseQuestion,
  "percentage-decrease": generatePercentageDecreaseQuestion,
  "find-original": generateFindOriginalQuestion,
  "what-percent": generateWhatPercentQuestion,
  "multi-step": generateMultiStepQuestion,
  mixed: generateMixedQuestion,
};

/* --------------------------------------------------
   Generate Percentage Question
-------------------------------------------------- */

export function generatePercentageQuestion({ level, config }) {
  if (!config) {
    throw new Error(`Percentage configuration is missing for level ${level}.`);
  }

  const generator = TEMPLATE_GENERATORS[config.template];

  if (!generator) {
    throw new Error(`Unknown percentage template "${config.template}" for level ${level}.`);
  }

  const generated = generator(config);

  return {
    id: `percentages_${level}_${generated.question}_${generated.answer}`,
    operation: "percentages",
    level,
    numbers: generated.numbers,
    operators: generated.operators,
    question: generated.question,
    answer: generated.answer,
    options: generated.options,
  };
}
