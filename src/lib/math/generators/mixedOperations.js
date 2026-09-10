// src/lib/math/generators/mixedOperations.js

import { generateOptions } from "../generateOptions";

/* --------------------------------------------------
   Random Number
-------------------------------------------------- */

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* --------------------------------------------------
   Generate Number From Range
-------------------------------------------------- */

function generateFromRange(range) {
  return randomNumber(range.min, range.max);
}

/* --------------------------------------------------
   Validate Result
-------------------------------------------------- */

function isValidResult(result, config) {
  if (result < config.minResult || result > config.maxResult) {
    return false;
  }

  if (!config.allowNegative && result < 0) {
    return false;
  }

  return true;
}

/* --------------------------------------------------
   Level 1
   A + B × C
-------------------------------------------------- */

function generatePrecedenceBasic(config) {
  for (let attempt = 0; attempt < 100; attempt++) {
    const a = generateFromRange(config.operands[0]);
    const b = generateFromRange(config.operands[1]);
    const c = generateFromRange(config.operands[2]);

    const answer = a + b * c;

    if (isValidResult(answer, config)) {
      return {
        numbers: [a, b, c],
        operators: ["+", "×"],
        answer,
        question: `${a} + ${b} × ${c}`,
      };
    }
  }

  throw new Error("Unable to generate Mixed Operations Level 1 question.");
}

/* --------------------------------------------------
   Level 2
   A ÷ B + C × D
-------------------------------------------------- */

function generatePrecedenceExtended(config) {
  for (let attempt = 0; attempt < 100; attempt++) {
    const divisor = generateFromRange(config.division.divisor);

    const quotient = generateFromRange(config.division.quotient);

    const dividend = divisor * quotient;

    const multiplier = generateFromRange(config.multiplication.multiplier);

    const multiplicand = generateFromRange(config.multiplication.multiplicand);

    const addend = generateFromRange(config.addend);

    const answer = quotient + addend * 1 + multiplier * multiplicand;

    if (isValidResult(answer, config)) {
      return {
        numbers: [dividend, divisor, addend, multiplier, multiplicand],
        operators: ["÷", "+", "×"],
        answer,
        question: `${dividend} ÷ ${divisor} + ${addend} × ${multiplicand}`,
      };
    }
  }

  throw new Error("Unable to generate Mixed Operations Level 2 question.");
}

/* --------------------------------------------------
   Level 3
   (A + B) − C
-------------------------------------------------- */

function generateBracketsSimpleSubtraction(config) {
  for (let attempt = 0; attempt < 100; attempt++) {
    const a = generateFromRange(config.operands[0]);
    const b = generateFromRange(config.operands[1]);
    const c = generateFromRange(config.operands[2]);

    const answer = a + b - c;

    if (isValidResult(answer, config)) {
      return {
        numbers: [a, b, c],
        operators: ["+", "−"],
        answer,
        question: `(${a} + ${b}) − ${c}`,
      };
    }
  }

  throw new Error("Unable to generate Mixed Operations Level 3 question.");
}

/* --------------------------------------------------
   Level 4
   (A + B) × C
-------------------------------------------------- */

function generateBracketsMultiplication(config) {
  for (let attempt = 0; attempt < 100; attempt++) {
    const a = generateFromRange(config.addends[0]);
    const b = generateFromRange(config.addends[1]);
    const multiplier = generateFromRange(config.multiplier);

    const answer = (a + b) * multiplier;

    if (isValidResult(answer, config)) {
      return {
        numbers: [a, b, multiplier],
        operators: ["+", "×"],
        answer,
        question: `(${a} + ${b}) × ${multiplier}`,
      };
    }
  }

  throw new Error("Unable to generate Mixed Operations Level 4 question.");
}

/* --------------------------------------------------
   Level 5
   A ÷ (B + C)
-------------------------------------------------- */

function generateBracketsDivision(config) {
  for (let attempt = 0; attempt < 100; attempt++) {
    const divisor = generateFromRange(config.divisor);

    const quotient = generateFromRange(config.quotient);

    const dividend = divisor * quotient;

    const a = generateFromRange(config.addends[0]);

    const b = generateFromRange(config.addends[1]);

    const bracketValue = a + b;

    /*
     * The bracket must be the divisor so that
     * the division remains exact.
     */
    if (bracketValue < config.divisor.min) {
      continue;
    }

    if (bracketValue > config.divisor.max) {
      continue;
    }

    const finalDividend = bracketValue * quotient;

    const answer = finalDividend / bracketValue;

    if (isValidResult(answer, config)) {
      return {
        numbers: [finalDividend, a, b],
        operators: ["÷", "+"],
        answer,
        question: `${finalDividend} ÷ (${a} + ${b})`,
      };
    }
  }

  throw new Error("Unable to generate Mixed Operations Level 5 question.");
}

/* --------------------------------------------------
   Level 6
   (A + B) × C − (D − E)
-------------------------------------------------- */

function generateMultipleBrackets(config) {
  for (let attempt = 0; attempt < 100; attempt++) {
    const a = generateFromRange(config.firstBracket.operands[0]);

    const b = generateFromRange(config.firstBracket.operands[1]);

    const multiplier = generateFromRange(config.multiplier);

    const d = generateFromRange(config.secondBracket.operands[0]);

    const e = generateFromRange(config.secondBracket.operands[1]);

    const answer = (a + b) * multiplier - (d - e);

    if (isValidResult(answer, config)) {
      return {
        numbers: [a, b, multiplier, d, e],
        operators: ["+", "×", "−", "−"],
        answer,
        question: `(${a} + ${b}) × ${multiplier} − (${d} − ${e})`,
      };
    }
  }

  throw new Error("Unable to generate Mixed Operations Level 6 question.");
}

/* --------------------------------------------------
   Level 7
   A × (B − (C + D))
-------------------------------------------------- */

function generateNestedBrackets(config) {
  for (let attempt = 0; attempt < 100; attempt++) {
    const multiplier = generateFromRange(config.multiplier);

    const middleValue = generateFromRange(config.middleValue);

    const c = generateFromRange(config.innerAddition.operands[0]);

    const d = generateFromRange(config.innerAddition.operands[1]);

    const answer = multiplier * (middleValue - (c + d));

    if (isValidResult(answer, config)) {
      return {
        numbers: [multiplier, middleValue, c, d],
        operators: ["×", "−", "+"],
        answer,
        question: `${multiplier} × (${middleValue} − (${c} + ${d}))`,
      };
    }
  }

  throw new Error("Unable to generate Mixed Operations Level 7 question.");
}

/* --------------------------------------------------
   Level 8
   (A + B) ÷ (C × D) + E
-------------------------------------------------- */

function generateAdvancedMixed(config) {
  for (let attempt = 0; attempt < 100; attempt++) {
    const a = generateFromRange(config.numerator.addends[0]);

    const b = generateFromRange(config.numerator.addends[1]);

    const c = generateFromRange(config.denominator.factors[0]);

    const d = generateFromRange(config.denominator.factors[1]);

    const e = generateFromRange(config.finalAddend);

    const numerator = a + b;
    const denominator = c * d;

    /*
     * Division must be exact.
     */
    if (numerator % denominator !== 0) {
      continue;
    }

    const answer = numerator / denominator + e;

    if (isValidResult(answer, config)) {
      return {
        numbers: [a, b, c, d, e],
        operators: ["+", "÷", "×", "+"],
        answer,
        question: `(${a} + ${b}) ÷ (${c} × ${d}) + ${e}`,
      };
    }
  }

  throw new Error("Unable to generate Mixed Operations Level 8 question.");
}

/* --------------------------------------------------
   Generate Mixed Operations Question
-------------------------------------------------- */

export function generateMixedOperationsQuestion({ level, config }) {
  if (!config) {
    throw new Error(`Mixed Operations configuration is missing for level ${level}.`);
  }

  let generated;

  switch (config.template) {
    case "precedence-basic":
      generated = generatePrecedenceBasic(config);
      break;

    case "precedence-extended":
      generated = generatePrecedenceExtended(config);
      break;

    case "brackets-simple-subtraction":
      generated = generateBracketsSimpleSubtraction(config);
      break;

    case "brackets-multiplication":
      generated = generateBracketsMultiplication(config);
      break;

    case "brackets-division":
      generated = generateBracketsDivision(config);
      break;

    case "multiple-brackets":
      generated = generateMultipleBrackets(config);
      break;

    case "nested-brackets":
      generated = generateNestedBrackets(config);
      break;

    case "advanced-mixed":
      generated = generateAdvancedMixed(config);
      break;

    default:
      throw new Error(`Unknown Mixed Operations template: ${config.template}`);
  }

  return {
    id: `mixed_${level}_${generated.numbers.join("_")}`,
    operation: "mixedOperations",
    level,
    numbers: generated.numbers,
    operators: generated.operators,
    symbol: "mixed",
    question: generated.question,
    answer: generated.answer,
    options: generateOptions(generated.answer, "mixedOperations", ...generated.numbers),
  };
}
