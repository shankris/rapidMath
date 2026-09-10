// src/lib/math/generators/missingNumber.js

import { generateOptions } from "../generateOptions";

/* --------------------------------------------------
   Random Number
-------------------------------------------------- */

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* --------------------------------------------------
   Generate From Range
-------------------------------------------------- */

function generateFromRange(range) {
  return randomNumber(range.min, range.max);
}

/* --------------------------------------------------
   Validate Result
-------------------------------------------------- */

function isValidResult(result, config) {
  if (config.minResult !== undefined && result < config.minResult) {
    return false;
  }

  if (config.maxResult !== undefined && result > config.maxResult) {
    return false;
  }

  return true;
}

/* --------------------------------------------------
   Level 1
   A + □ = C
-------------------------------------------------- */

function generateAdditionMissingSecond(config) {
  for (let attempt = 0; attempt < 100; attempt++) {
    const known = generateFromRange(config.known);
    const missing = generateFromRange(config.missing);

    const result = known + missing;

    if (!isValidResult(result, config)) {
      continue;
    }

    return {
      numbers: [known, missing, result],
      answer: missing,
      question: `${known} + □ = ${result}`,
    };
  }

  throw new Error("Unable to generate Missing Number addition question.");
}

/* --------------------------------------------------
   Level 3
   A − □ = C
-------------------------------------------------- */

function generateSubtractionMissingSecond(config) {
  for (let attempt = 0; attempt < 100; attempt++) {
    const minuend = generateFromRange(config.minuend);

    const missing = generateFromRange(config.missing);

    const result = minuend - missing;

    if (!isValidResult(result, config)) {
      continue;
    }

    return {
      numbers: [minuend, missing, result],
      answer: missing,
      question: `${minuend} − □ = ${result}`,
    };
  }

  throw new Error("Unable to generate Missing Number subtraction question.");
}

/* --------------------------------------------------
   Level 4
   □ − A = C
-------------------------------------------------- */

function generateSubtractionMissingFirst(config) {
  for (let attempt = 0; attempt < 100; attempt++) {
    const missing = generateFromRange(config.missing);

    const subtrahend = generateFromRange(config.subtrahend);

    const result = missing - subtrahend;

    if (!isValidResult(result, config)) {
      continue;
    }

    return {
      numbers: [missing, subtrahend, result],
      answer: missing,
      question: `□ − ${subtrahend} = ${result}`,
    };
  }

  throw new Error("Unable to generate Missing Number reverse subtraction question.");
}

/* --------------------------------------------------
   Level 5
   A × □ = C
-------------------------------------------------- */

function generateMultiplication(config) {
  for (let attempt = 0; attempt < 100; attempt++) {
    const known = generateFromRange(config.known);

    const missing = generateFromRange(config.missing);

    const result = known * missing;

    if (!isValidResult(result, config)) {
      continue;
    }

    return {
      numbers: [known, missing, result],
      answer: missing,
      question: `${known} × □ = ${result}`,
    };
  }

  throw new Error("Unable to generate Missing Number multiplication question.");
}

/* --------------------------------------------------
   Level 6
   □ ÷ A = C
-------------------------------------------------- */

function generateDivision(config) {
  for (let attempt = 0; attempt < 100; attempt++) {
    const divisor = generateFromRange(config.divisor);

    const quotient = generateFromRange(config.quotient);

    const dividend = divisor * quotient;

    return {
      numbers: [dividend, divisor, quotient],
      answer: dividend,
      question: `□ ÷ ${divisor} = ${quotient}`,
    };
  }

  throw new Error("Unable to generate Missing Number division question.");
}

/* --------------------------------------------------
   Level 7
   Mixed One-Step
-------------------------------------------------- */

function generateMixedOneStep(config) {
  for (let attempt = 0; attempt < 100; attempt++) {
    const type = randomNumber(1, 4);

    const first = randomNumber(config.minValue, config.maxValue);

    const second = randomNumber(config.minValue, config.maxValue);

    /* ------------------------------------------------
       Addition
    ------------------------------------------------ */

    if (type === 1) {
      const result = first + second;

      if (result >= config.minValue && result <= config.maxValue) {
        return {
          numbers: [first, second, result],
          answer: second,
          question: `${first} + □ = ${result}`,
        };
      }
    }

    /* ------------------------------------------------
       Reverse Addition
    ------------------------------------------------ */

    if (type === 2) {
      const result = first + second;

      if (result >= config.minValue && result <= config.maxValue) {
        return {
          numbers: [first, second, result],
          answer: first,
          question: `□ + ${second} = ${result}`,
        };
      }
    }

    /* ------------------------------------------------
       Subtraction
    ------------------------------------------------ */

    if (type === 3 && first > second) {
      const result = first - second;

      if (result >= config.minValue && result <= config.maxValue) {
        return {
          numbers: [first, second, result],
          answer: second,
          question: `${first} − □ = ${result}`,
        };
      }
    }

    /* ------------------------------------------------
       Reverse Subtraction
    ------------------------------------------------ */

    if (type === 4) {
      const result = first + second;

      if (result >= config.minValue && result <= config.maxValue) {
        return {
          numbers: [result, first, second],
          answer: result,
          question: `□ − ${first} = ${second}`,
        };
      }
    }
  }

  throw new Error("Unable to generate Missing Number mixed question.");
}

/* --------------------------------------------------
   Level 8
   Two-Step
-------------------------------------------------- */

function generateTwoStep(config) {
  for (let attempt = 0; attempt < 100; attempt++) {
    const multiplier = randomNumber(2, 5);
    const addend = randomNumber(1, 20);
    const missing = randomNumber(config.minValue, config.maxValue);

    const result = missing * multiplier + addend;

    if (!isValidResult(result, config)) {
      continue;
    }

    return {
      numbers: [missing, multiplier, addend, result],
      answer: missing,
      question: `□ × ${multiplier} + ${addend} = ${result}`,
    };
  }

  throw new Error("Unable to generate Missing Number two-step question.");
}

/* --------------------------------------------------
   Generate Missing Number Question
-------------------------------------------------- */

export function generateMissingNumberQuestion({ level, config }) {
  if (!config) {
    throw new Error(`Missing Number configuration is missing for level ${level}.`);
  }

  let generated;

  switch (config.template) {
    case "addition-missing-second":
      generated = generateAdditionMissingSecond(config);
      break;

    case "subtraction-missing-second":
      generated = generateSubtractionMissingSecond(config);
      break;

    case "subtraction-missing-first":
      generated = generateSubtractionMissingFirst(config);
      break;

    case "multiplication":
      generated = generateMultiplication(config);
      break;

    case "division":
      generated = generateDivision(config);
      break;

    case "mixed-one-step":
      generated = generateMixedOneStep(config);
      break;

    case "two-step":
      generated = generateTwoStep(config);
      break;

    default:
      throw new Error(`Unknown Missing Number template: ${config.template}`);
  }

  return {
    id: `missing_${level}_${generated.numbers.join("_")}`,
    operation: "missingNumber",
    level,
    numbers: generated.numbers,
    answer: generated.answer,
    question: generated.question,
    options: generateOptions(generated.answer, "missingNumber", ...generated.numbers),
  };
}
