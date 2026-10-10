/* src/lib/math/generators/algebra.js */

import { generateOptions } from "../generateOptions";

/* --------------------------------------------------
   Random Number
-------------------------------------------------- */

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* --------------------------------------------------
   Generate Addition Equation
   Example: x + 5 = 12
-------------------------------------------------- */

function generateAdditionEquation(config) {
  const answer = randomNumber(config.minUnknown, config.maxUnknown);
  const constant = randomNumber(config.minConstant, config.maxConstant);
  const result = answer + constant;

  return {
    id: `alg_add_${answer}_${constant}`,
    pattern: "additionEquation",
    numbers: [answer, constant, result],
    question: `x + ${constant} = ${result}. Find x.`,
    answer,
    hint: `Subtract ${constant} from both sides.`,
    explanation: [`x + ${constant} = ${result}`, `x = ${result} - ${constant}`, `x = ${answer}`].join("\n"),
  };
}

/* --------------------------------------------------
   Generate Subtraction Equation
   Example: x - 4 = 8
-------------------------------------------------- */

function generateSubtractionEquation(config) {
  const answer = randomNumber(config.minUnknown, config.maxUnknown);
  const constant = randomNumber(1, Math.min(config.maxConstant, answer - 1));
  const result = answer - constant;

  return {
    id: `alg_sub_${answer}_${constant}`,
    pattern: "subtractionEquation",
    numbers: [answer, constant, result],
    question: `x - ${constant} = ${result}. Find x.`,
    answer,
    hint: `Add ${constant} to both sides.`,
    explanation: [`x - ${constant} = ${result}`, `x = ${result} + ${constant}`, `x = ${answer}`].join("\n"),
  };
}

/* --------------------------------------------------
   Generate Multiplication Equation
   Example: 4x = 28
-------------------------------------------------- */

function generateSimpleUnknown(config) {
  const answer = randomNumber(config.minUnknown, config.maxUnknown);
  const factor = randomNumber(2, config.maxFactor);
  const result = answer * factor;

  return {
    id: `alg_mul_${answer}_${factor}`,
    pattern: "simpleUnknown",
    numbers: [answer, factor, result],
    question: `${factor}x = ${result}. Find x.`,
    answer,
    hint: `Divide both sides by ${factor}.`,
    explanation: [`${factor}x = ${result}`, `x = ${result} ÷ ${factor}`, `x = ${answer}`].join("\n"),
  };
}

/* --------------------------------------------------
   Generate Division Equation
   Example: x ÷ 4 = 7
-------------------------------------------------- */

function generateDivisionEquation(config) {
  const answer = randomNumber(config.minUnknown, config.maxUnknown);
  const divisor = randomNumber(2, config.maxFactor);
  const dividend = answer * divisor;

  return {
    id: `alg_div_${answer}_${divisor}`,
    pattern: "divisionEquation",
    numbers: [answer, divisor, dividend],
    question: `x ÷ ${divisor} = ${answer}. Find x.`,
    answer: dividend,
    hint: `Multiply both sides by ${divisor}.`,
    explanation: [`x ÷ ${divisor} = ${answer}`, `x = ${answer} × ${divisor}`, `x = ${dividend}`].join("\n"),
  };
}

/* --------------------------------------------------
   Generate Equation With Unknowns on Both Sides
   Example: 4x + 3 = 2x + 15
-------------------------------------------------- */

function generateBothSidesEquation(config) {
  const answer = randomNumber(config.minUnknown, config.maxUnknown);
  const coefficientA = randomNumber(config.minCoefficient + 1, config.maxCoefficient);
  const coefficientB = randomNumber(config.minCoefficient, coefficientA - 1);
  const constantA = randomNumber(1, config.maxConstant);
  const constantB = constantA + (coefficientA - coefficientB) * answer;

  return {
    id: `alg_both_${answer}_${coefficientA}_${coefficientB}_${constantA}`,
    pattern: "bothSidesEquation",
    numbers: [answer, coefficientA, coefficientB, constantA, constantB],
    question: `${coefficientA}x + ${constantA} = ${coefficientB}x + ${constantB}. Find x.`,
    answer,
    hint: "Move the x terms to one side and the constants to the other.",
    explanation: [`${coefficientA}x + ${constantA} = ${coefficientB}x + ${constantB}`, `${coefficientA}x - ${coefficientB}x = ${constantB} - ${constantA}`, `${coefficientA - coefficientB}x = ${constantB - constantA}`, `x = ${answer}`].join("\n"),
  };
}

/* --------------------------------------------------
   Generate Equation With Brackets
   Example: 4(x + 3) = 2(x + 9)
-------------------------------------------------- */

function generateBracketEquation(config) {
  const answer = randomNumber(config.minUnknown, config.maxUnknown);
  const coefficientA = 4;
  const coefficientB = 2;
  const constantA = randomNumber(1, config.maxConstant);
  const constantB = answer + 2 * constantA;

  return {
    id: `alg_bracket_${answer}_${constantA}`,
    pattern: "bracketEquation",
    numbers: [answer, coefficientA, coefficientB, constantA, constantB],
    question: `${coefficientA}(x + ${constantA}) = ${coefficientB}(x + ${constantB}). Find x.`,
    answer,
    hint: "Expand both brackets, then collect the x terms on one side.",
    explanation: [`${coefficientA}(x + ${constantA}) = ${coefficientB}(x + ${constantB})`, `${coefficientA}x + ${coefficientA * constantA} = ${coefficientB}x + ${coefficientB * constantB}`, `${coefficientA - coefficientB}x = ${coefficientB * constantB - coefficientA * constantA}`, `x = ${answer}`].join("\n"),
  };
}

/* --------------------------------------------------
   Generate Fraction Equation
   Example: x/2 + x/3 = 10
-------------------------------------------------- */

function generateFractionEquation() {
  const multiplier = randomNumber(1, 5);
  const answer = multiplier * 6;
  const result = multiplier * 5;

  return {
    id: `alg_fraction_${answer}`,
    pattern: "fractionEquation",
    numbers: [answer, 2, 3, result],
    question: `x/2 + x/3 = ${result}. Find x.`,
    answer,
    hint: "Combine the fractions using a common denominator of 6.",
    explanation: [`x/2 + x/3 = ${result}`, `3x/6 + 2x/6 = ${result}`, `5x/6 = ${result}`, `5x = ${result * 6}`, `x = ${answer}`].join("\n"),
  };
}

/* --------------------------------------------------
   Generate Square Equation
   Example: x² = 49
-------------------------------------------------- */

function generateSquareEquation(config) {
  const answer = randomNumber(2, config.maxFactor);
  const result = answer ** 2;

  return {
    id: `alg_square_${answer}`,
    pattern: "squareEquation",
    numbers: [answer, result],
    question: `x² = ${result}. Find the positive value of x.`,
    answer,
    hint: `Find the square root of ${result}.`,
    explanation: [`x² = ${result}`, `x = √${result}`, `x = ${answer} (taking the positive root)`].join("\n"),
  };
}

/* --------------------------------------------------
   Generate Square Root Equation
   Example: √x = 7
-------------------------------------------------- */

function generateSquareRootEquation(config) {
  const root = randomNumber(2, config.maxFactor);
  const answer = root ** 2;

  return {
    id: `alg_root_${root}`,
    pattern: "squareRootEquation",
    numbers: [root, answer],
    question: `√x = ${root}. Find x.`,
    answer,
    hint: `Square both sides of the equation.`,
    explanation: [`√x = ${root}`, `x = ${root}²`, `x = ${answer}`].join("\n"),
  };
}

/* --------------------------------------------------
   Generate Square Root With an Unknown
   Example: √(x² × 4²) = 28
-------------------------------------------------- */

function generateSquareRootUnknown(config) {
  const answer = randomNumber(config.minUnknown, config.maxUnknown);
  const factor = randomNumber(config.minFactor, config.maxFactor);
  const result = answer * factor;

  return {
    id: `alg_root_unknown_${answer}_${factor}`,
    pattern: "squareRootUnknown",
    numbers: [answer, factor, result],
    question: `√(x² × ${factor}²) = ${result}. Find x (assume x is positive).`,
    answer,
    hint: "Simplify the square root first, then isolate x.",
    explanation: [`√(x² × ${factor}²) = x × ${factor}, since x is positive.`, `x × ${factor} = ${result}`, `x = ${result} ÷ ${factor}`, `x = ${answer}`].join("\n"),
  };
}

/* --------------------------------------------------
   Generate Factor Cancellation
   Example: (24 × 5) ÷ 6
-------------------------------------------------- */

function generateFactorCancellation(config) {
  const divisor = randomNumber(2, config.maxFactor);
  const quotient = randomNumber(2, config.maxFactor);
  const multiplier = randomNumber(2, config.maxFactor);

  const numerator = divisor * quotient;
  const answer = quotient * multiplier;

  return {
    id: `alg_cancel_${numerator}_${multiplier}_${divisor}`,
    pattern: "factorCancellation",
    numbers: [numerator, multiplier, divisor],
    question: `(${numerator} × ${multiplier}) ÷ ${divisor} = ?`,
    answer,
    hint: `Try dividing ${numerator} by ${divisor} before multiplying.`,
    explanation: [`(${numerator} × ${multiplier}) ÷ ${divisor}`, `= (${numerator} ÷ ${divisor}) × ${multiplier}`, `= ${quotient} × ${multiplier}`, `= ${answer}`].join("\n"),
  };
}

/* --------------------------------------------------
   Generate Algebra Question
-------------------------------------------------- */

export function generateAlgebraQuestion({ level, config }) {
  if (!config?.patterns?.length) {
    throw new Error(`Algebra patterns are missing for level ${level}.`);
  }

  const pattern = config.patterns[randomNumber(0, config.patterns.length - 1)];

  let questionData;

  switch (pattern) {
    case "additionEquation":
      questionData = generateAdditionEquation(config);
      break;

    case "subtractionEquation":
      questionData = generateSubtractionEquation(config);
      break;

    case "simpleUnknown":
      questionData = generateSimpleUnknown(config);
      break;

    case "divisionEquation":
      questionData = generateDivisionEquation(config);
      break;

    case "bothSidesEquation":
      questionData = generateBothSidesEquation(config);
      break;

    case "bracketEquation":
      questionData = generateBracketEquation(config);
      break;

    case "fractionEquation":
      questionData = generateFractionEquation();
      break;

    case "squareEquation":
      questionData = generateSquareEquation(config);
      break;

    case "squareRootEquation":
      questionData = generateSquareRootEquation(config);
      break;

    case "squareRootUnknown":
      questionData = generateSquareRootUnknown(config);
      break;

    case "factorCancellation":
      questionData = generateFactorCancellation(config);
      break;

    default:
      throw new Error(`Unknown algebra pattern: ${pattern}`);
  }

  const { answer, ...data } = questionData;

  return {
    ...data,
    operation: "algebra",
    level,
    answer,
    options: generateOptions(answer, "algebra"),
  };
}
