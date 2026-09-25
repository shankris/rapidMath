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
   Calculate Binary Operation
-------------------------------------------------- */

function calculateOperation(left, operator, right) {
  switch (operator) {
    case "+":
      return left + right;

    case "−":
      return left - right;

    case "×":
      return left * right;

    case "÷":
      return left / right;

    default:
      throw new Error(`Unknown Mixed Operations operator: ${operator}`);
  }
}

/* --------------------------------------------------
   Level 1
   Basic precedence — 3 numbers

   One ×/÷ operation and one +/− operation.

   The ×/÷ operation is randomly placed either
   before or after the +/− operation.
-------------------------------------------------- */

function generatePrecedenceBasic(config) {
  for (let attempt = 0; attempt < 100; attempt++) {
    const a = generateFromRange(config.operands[0]);
    const b = generateFromRange(config.operands[1]);
    const c = generateFromRange(config.operands[2]);

    const precedenceOperator = Math.random() < 0.5 ? "×" : "÷";

    const additiveOperator = Math.random() < 0.5 ? "+" : "−";

    const precedenceFirst = Math.random() < 0.5;

    let answer;
    let question;
    let operators;

    if (precedenceFirst) {
      /*
       * A ×/÷ B +/− C
       */
      if (precedenceOperator === "÷" && a % b !== 0) {
        continue;
      }

      const firstResult = calculateOperation(a, precedenceOperator, b);

      answer = calculateOperation(firstResult, additiveOperator, c);

      operators = [precedenceOperator, additiveOperator];

      question = `${a} ${precedenceOperator} ${b} ${additiveOperator} ${c}`;
    } else {
      /*
       * A +/− B ×/÷ C
       */
      if (precedenceOperator === "÷" && b % c !== 0) {
        continue;
      }

      const secondResult = calculateOperation(b, precedenceOperator, c);

      answer = calculateOperation(a, additiveOperator, secondResult);

      operators = [additiveOperator, precedenceOperator];

      question = `${a} ${additiveOperator} ${b} ${precedenceOperator} ${c}`;
    }

    if (isValidResult(answer, config)) {
      return {
        numbers: [a, b, c],
        operators,
        answer,
        question,
      };
    }
  }

  throw new Error("Unable to generate Mixed Operations Level 1 question.");
}

/* --------------------------------------------------
   Level 2
   Simple brackets — 3 numbers

   One pair of brackets.

   Examples:
   (A + B) × C
   A + (B − C)
   (A − B) + C
   A ÷ (B + C)
-------------------------------------------------- */

function generateBracketsSimple(config) {
  for (let attempt = 0; attempt < 100; attempt++) {
    const a = generateFromRange(config.operands[0]);
    const b = generateFromRange(config.operands[1]);
    const c = generateFromRange(config.operands[2]);

    const pattern = randomNumber(1, 4);

    let answer;
    let question;
    let operators;

    switch (pattern) {
      case 1: {
        const operator = Math.random() < 0.5 ? "+" : "−";
        const outerOperator = Math.random() < 0.5 ? "×" : "÷";

        const bracketValue = calculateOperation(a, operator, b);

        if (outerOperator === "÷" && bracketValue === 0) {
          continue;
        }

        if (outerOperator === "÷" && c !== 0 && bracketValue % c !== 0) {
          /*
           * Use C as the dividend instead.
           * This pattern will be retried if exact division
           * is not possible.
           */
          continue;
        }

        answer = calculateOperation(bracketValue, outerOperator, c);

        operators = [operator, outerOperator];

        question = `(${a} ${operator} ${b}) ${outerOperator} ${c}`;

        break;
      }

      case 2: {
        const operator = Math.random() < 0.5 ? "+" : "−";
        const outerOperator = Math.random() < 0.5 ? "+" : "−";

        const bracketValue = calculateOperation(b, operator, c);

        answer = calculateOperation(a, outerOperator, bracketValue);

        operators = [outerOperator, operator];

        question = `${a} ${outerOperator} (${b} ${operator} ${c})`;

        break;
      }

      case 3: {
        const operator = Math.random() < 0.5 ? "+" : "−";
        const outerOperator = "×";

        const bracketValue = calculateOperation(a, operator, b);

        answer = bracketValue * c;

        operators = [operator, outerOperator];

        question = `(${a} ${operator} ${b}) × ${c}`;

        break;
      }

      default: {
        const operator = Math.random() < 0.5 ? "+" : "−";
        const outerOperator = "×";

        const bracketValue = calculateOperation(b, operator, c);

        answer = a + outerOperator === "×" ? a + bracketValue * 1 : a;

        /*
         * Keep this pattern simple and explicit.
         */
        answer = a + bracketValue;

        operators = ["+", operator];

        question = `${a} + (${b} ${operator} ${c})`;

        break;
      }
    }

    if (!Number.isInteger(answer) || !isValidResult(answer, config)) {
      continue;
    }

    return {
      numbers: [a, b, c],
      operators,
      answer,
      question,
    };
  }

  throw new Error("Unable to generate Mixed Operations Level 2 question.");
}

/* --------------------------------------------------
   Level 3
   Four numbers + brackets

   The player now handles one additional operation
   while retaining the Level 2 bracket concept.
-------------------------------------------------- */

function generateBracketsFourNumber(config) {
  for (let attempt = 0; attempt < 100; attempt++) {
    const a = generateFromRange(config.operands[0]);
    const b = generateFromRange(config.operands[1]);
    const c = generateFromRange(config.operands[2]);
    const d = generateFromRange(config.operands[3]);

    const pattern = randomNumber(1, 4);

    let answer;
    let question;
    let operators;

    switch (pattern) {
      case 1: {
        const bracketOperator = Math.random() < 0.5 ? "+" : "−";

        const secondOperator = Math.random() < 0.5 ? "×" : "÷";

        const finalOperator = Math.random() < 0.5 ? "+" : "−";

        const bracketValue = calculateOperation(a, bracketOperator, b);

        if (secondOperator === "÷" && c === 0) {
          continue;
        }

        const middleValue = calculateOperation(bracketValue, secondOperator, c);

        if (secondOperator === "÷" && !Number.isInteger(middleValue)) {
          continue;
        }

        answer = calculateOperation(middleValue, finalOperator, d);

        operators = [bracketOperator, secondOperator, finalOperator];

        question = `(${a} ${bracketOperator} ${b}) ${secondOperator} ${c} ${finalOperator} ${d}`;

        break;
      }

      case 2: {
        const firstOperator = Math.random() < 0.5 ? "+" : "−";

        const precedenceOperator = Math.random() < 0.5 ? "×" : "÷";

        const finalOperator = Math.random() < 0.5 ? "+" : "−";

        if (precedenceOperator === "÷" && c % d !== 0) {
          continue;
        }

        const precedenceValue = calculateOperation(c, precedenceOperator, d);

        const bracketValue = calculateOperation(a, firstOperator, b);

        answer = calculateOperation(bracketValue, finalOperator, precedenceValue);

        operators = [firstOperator, precedenceOperator, finalOperator];

        question = `(${a} ${firstOperator} ${b}) ${finalOperator} ${c} ${precedenceOperator} ${d}`;

        break;
      }

      case 3: {
        const precedenceOperator = Math.random() < 0.5 ? "×" : "÷";

        const firstOperator = Math.random() < 0.5 ? "+" : "−";

        const bracketOperator = Math.random() < 0.5 ? "+" : "−";

        if (precedenceOperator === "÷" && b % c !== 0) {
          continue;
        }

        const precedenceValue = calculateOperation(b, precedenceOperator, c);

        const bracketValue = calculateOperation(a, firstOperator, precedenceValue);

        answer = calculateOperation(bracketValue, bracketOperator, d);

        operators = [firstOperator, precedenceOperator, bracketOperator];

        question = `${a} ${firstOperator} ${b} ${precedenceOperator} ${c} ${bracketOperator} ${d}`;

        break;
      }

      default: {
        const bracketOperator = Math.random() < 0.5 ? "+" : "−";

        const finalOperator = Math.random() < 0.5 ? "×" : "÷";

        const bracketValue = calculateOperation(c, bracketOperator, d);

        if (finalOperator === "÷" && bracketValue === 0) {
          continue;
        }

        if (finalOperator === "÷" && a % bracketValue !== 0) {
          continue;
        }

        const leftValue = a + b;

        answer = calculateOperation(leftValue, finalOperator, bracketValue);

        operators = ["+", finalOperator, bracketOperator];

        question = `${a} + ${b} ${finalOperator} (${c} ${bracketOperator} ${d})`;

        break;
      }
    }

    if (!Number.isInteger(answer) || !isValidResult(answer, config)) {
      continue;
    }

    return {
      numbers: [a, b, c, d],
      operators,
      answer,
      question,
    };
  }

  throw new Error("Unable to generate Mixed Operations Level 3 question.");
}

/* --------------------------------------------------
   Level 4
   Four numbers + varied brackets

   Same concepts as Level 3, but with more varied
   placement of the bracketed expression.
-------------------------------------------------- */

function generateBracketsVaried(config) {
  for (let attempt = 0; attempt < 100; attempt++) {
    const a = generateFromRange(config.operands[0]);
    const b = generateFromRange(config.operands[1]);
    const c = generateFromRange(config.operands[2]);
    const d = generateFromRange(config.operands[3]);

    const bracketOperator = Math.random() < 0.5 ? "+" : "−";

    const precedenceOperator = Math.random() < 0.5 ? "×" : "÷";

    const finalOperator = Math.random() < 0.5 ? "+" : "−";

    const bracketValue = calculateOperation(b, bracketOperator, c);

    if (precedenceOperator === "÷" && bracketValue === 0) {
      continue;
    }

    if (precedenceOperator === "÷" && a % bracketValue !== 0) {
      continue;
    }

    const firstValue = calculateOperation(a, precedenceOperator, bracketValue);

    const answer = calculateOperation(firstValue, finalOperator, d);

    if (!Number.isInteger(answer) || !isValidResult(answer, config)) {
      continue;
    }

    return {
      numbers: [a, b, c, d],
      operators: [precedenceOperator, bracketOperator, finalOperator],
      answer,
      question: `${a} ${precedenceOperator} (${b} ${bracketOperator} ${c}) ${finalOperator} ${d}`,
    };
  }

  throw new Error("Unable to generate Mixed Operations Level 4 question.");
}

/* --------------------------------------------------
   Level 5
   Two independent bracket groups

   Examples:
   (A + B) × (C − D)
   (A − B) + (C × D)
-------------------------------------------------- */

function generateMultipleBrackets(config) {
  for (let attempt = 0; attempt < 100; attempt++) {
    const a = generateFromRange(config.firstBracket.operands[0]);
    const b = generateFromRange(config.firstBracket.operands[1]);

    const c = generateFromRange(config.secondBracket.operands[0]);
    const d = generateFromRange(config.secondBracket.operands[1]);

    const firstOperator = Math.random() < 0.5 ? "+" : "−";

    const secondOperator = Math.random() < 0.5 ? "+" : "−";

    const outerOperator = Math.random() < 0.5 ? "×" : "+";

    const firstValue = calculateOperation(a, firstOperator, b);

    const secondValue = calculateOperation(c, secondOperator, d);

    const answer = calculateOperation(firstValue, outerOperator, secondValue);

    if (!isValidResult(answer, config)) {
      continue;
    }

    return {
      numbers: [a, b, c, d],
      operators: [firstOperator, outerOperator, secondOperator],
      answer,
      question: `(${a} ${firstOperator} ${b}) ${outerOperator} (${c} ${secondOperator} ${d})`,
    };
  }

  throw new Error("Unable to generate Mixed Operations Level 5 question.");
}

/* --------------------------------------------------
   Level 6
   Multiple operations + brackets

   Five numbers with one bracketed expression.
-------------------------------------------------- */

function generateAdvancedBrackets(config) {
  for (let attempt = 0; attempt < 100; attempt++) {
    const a = generateFromRange(config.operands[0]);
    const b = generateFromRange(config.operands[1]);
    const c = generateFromRange(config.operands[2]);
    const d = generateFromRange(config.operands[3]);
    const e = generateFromRange(config.operands[4]);

    const bracketOperator = Math.random() < 0.5 ? "+" : "−";

    const precedenceOperator = Math.random() < 0.5 ? "×" : "÷";

    const finalOperator = Math.random() < 0.5 ? "+" : "−";

    const bracketValue = calculateOperation(b, bracketOperator, c);

    if (precedenceOperator === "÷" && bracketValue === 0) {
      continue;
    }

    if (precedenceOperator === "÷" && a % bracketValue !== 0) {
      continue;
    }

    const firstValue = calculateOperation(a, precedenceOperator, bracketValue);

    const secondValue = calculateOperation(d, "×", e);

    const answer = calculateOperation(firstValue, finalOperator, secondValue);

    if (!Number.isInteger(answer) || !isValidResult(answer, config)) {
      continue;
    }

    return {
      numbers: [a, b, c, d, e],
      operators: [precedenceOperator, bracketOperator, "×", finalOperator],
      answer,
      question: `${a} ${precedenceOperator} (${b} ${bracketOperator} ${c}) ${finalOperator} ${d} × ${e}`,
    };
  }

  throw new Error("Unable to generate Mixed Operations Level 6 question.");
}

/* --------------------------------------------------
   Level 7
   Nested brackets

   Examples:
   (A + (B × C)) − D
   (A − (B + C)) × D
-------------------------------------------------- */

function generateNestedBrackets(config) {
  for (let attempt = 0; attempt < 100; attempt++) {
    const a = generateFromRange(config.operands[0]);
    const b = generateFromRange(config.operands[1]);
    const c = generateFromRange(config.operands[2]);
    const d = generateFromRange(config.operands[3]);
    const e = generateFromRange(config.operands[4]);

    const innerOperator = Math.random() < 0.5 ? "+" : "−";

    const middleOperator = Math.random() < 0.5 ? "×" : "÷";

    const outerOperator = Math.random() < 0.5 ? "+" : "−";

    const innerValue = calculateOperation(c, innerOperator, d);

    if (middleOperator === "÷" && innerValue === 0) {
      continue;
    }

    if (middleOperator === "÷" && b % innerValue !== 0) {
      continue;
    }

    const middleValue = calculateOperation(b, middleOperator, innerValue);

    const outerValue = calculateOperation(a, "+", middleValue);

    const answer = calculateOperation(outerValue, outerOperator, e);

    if (!Number.isInteger(answer) || !isValidResult(answer, config)) {
      continue;
    }

    return {
      numbers: [a, b, c, d, e],
      operators: ["+", middleOperator, innerOperator, outerOperator],
      answer,
      question: `${a} + (${b} ${middleOperator} (${c} ${innerOperator} ${d})) ${outerOperator} ${e}`,
    };
  }

  throw new Error("Unable to generate Mixed Operations Level 7 question.");
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

    case "brackets-simple":
      generated = generateBracketsSimple(config);
      break;

    case "brackets-four-number":
      generated = generateBracketsFourNumber(config);
      break;

    case "brackets-varied":
      generated = generateBracketsVaried(config);
      break;

    case "multiple-brackets":
      generated = generateMultipleBrackets(config);
      break;

    case "advanced-brackets":
      generated = generateAdvancedBrackets(config);
      break;

    case "nested-brackets":
      generated = generateNestedBrackets(config);
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
