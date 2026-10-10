/* src/lib/math/generators/simplification.js */

import { generateOptions } from "../generateOptions";

/* --------------------------------------------------
   Random Number
-------------------------------------------------- */

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* --------------------------------------------------
   Generate Square Root Unknown
-------------------------------------------------- */

function generateSquareRootUnknown(config) {
  const unknown = randomNumber(config.minUnknown, config.maxUnknown);
  const factor = randomNumber(config.minFactor, config.maxFactor);
  const result = unknown * factor;

  return {
    id: `simp_root_${unknown}_${factor}`,
    pattern: "squareRootUnknown",
    numbers: [unknown, factor, result],
    question: `√(x² × ${factor}²) = ${result}. Find x (assume x is positive).`,
    answer: unknown,
    hint: "Simplify the square root first, then isolate x.",
    explanation: [`√(x² × ${factor}²) = x × ${factor}, since x is positive.`, `x × ${factor} = ${result}`, `x = ${result} ÷ ${factor}`, `x = ${unknown}`].join("\n"),
  };
}

/* --------------------------------------------------
   Generate Factor Cancellation
-------------------------------------------------- */

function generateFactorCancellation(config) {
  const divisor = randomNumber(2, config.maxFactor);
  const quotient = randomNumber(2, config.maxFactor);
  const multiplier = randomNumber(2, config.maxFactor);

  const numerator = divisor * quotient;
  const answer = quotient * multiplier;

  return {
    id: `simp_cancel_${numerator}_${multiplier}_${divisor}`,
    pattern: "factorCancellation",
    numbers: [numerator, multiplier, divisor],
    question: `(${numerator} × ${multiplier}) ÷ ${divisor} = ?`,
    answer,
    hint: `Try dividing ${numerator} by ${divisor} before multiplying.`,
    explanation: [`(${numerator} × ${multiplier}) ÷ ${divisor}`, `= (${numerator} ÷ ${divisor}) × ${multiplier}`, `= ${quotient} × ${multiplier}`, `= ${answer}`].join("\n"),
  };
}

/* --------------------------------------------------
   Generate Simple Unknown
-------------------------------------------------- */

function generateSimpleUnknown(config) {
  const unknown = randomNumber(config.minUnknown, config.maxUnknown);
  const factor = randomNumber(2, config.maxFactor);
  const result = unknown * factor;

  return {
    id: `simp_unknown_${unknown}_${factor}`,
    pattern: "simpleUnknown",
    numbers: [unknown, factor, result],
    question: `x × ${factor} = ${result}. Find x (assume x is positive).`,
    answer: unknown,
    hint: `What operation reverses multiplication by ${factor}?`,
    explanation: [`x × ${factor} = ${result}`, `x = ${result} ÷ ${factor}`, `x = ${unknown}`].join("\n"),
  };
}

/* --------------------------------------------------
   Generate Simplification Question
-------------------------------------------------- */

export function generateSimplificationQuestion({ level, config }) {
  if (!config?.patterns?.length) {
    throw new Error(`Simplification patterns are missing for level ${level}.`);
  }

  const pattern = config.patterns[randomNumber(0, config.patterns.length - 1)];

  let questionData;

  switch (pattern) {
    case "squareRootUnknown":
      questionData = generateSquareRootUnknown(config);
      break;

    case "factorCancellation":
      questionData = generateFactorCancellation(config);
      break;

    case "simpleUnknown":
      questionData = generateSimpleUnknown(config);
      break;

    default:
      throw new Error(`Unknown simplification pattern: ${pattern}`);
  }

  const { answer, ...data } = questionData;

  return {
    ...data,
    operation: "simplification",
    level,
    answer,
    options: generateOptions(answer, "simplification"),
  };
}
