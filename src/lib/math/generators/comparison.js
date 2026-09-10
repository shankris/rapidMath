// src/lib/math/generators/comparison.js

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
   Generate Comparison Symbol
-------------------------------------------------- */

function getComparisonSymbol(left, right) {
  if (left < right) {
    return "<";
  }

  if (left > right) {
    return ">";
  }

  return "=";
}

/* --------------------------------------------------
   Select Difference Type
-------------------------------------------------- */

function getDifferenceType(config) {
  const random = Math.random();

  const equalityProbability = config.equalityProbability ?? 0;

  const closeDifferenceProbability = config.closeDifferenceProbability ?? 0;

  if (random < equalityProbability) {
    return "equal";
  }

  if (random < equalityProbability + closeDifferenceProbability) {
    return "close";
  }

  return "normal";
}

/* --------------------------------------------------
   Generate Target Difference
-------------------------------------------------- */

function generateTargetDifference(config, type) {
  if (type === "equal") {
    return 0;
  }

  if (type === "close") {
    return randomNumber(config.closeDifference.min, config.closeDifference.max);
  }

  return randomNumber(11, config.maxDifference);
}

/* --------------------------------------------------
   Generate Positive Comparison Target
-------------------------------------------------- */

function generatePositiveTarget(leftAnswer, difference) {
  if (difference === 0) {
    return leftAnswer;
  }

  /*
     If subtracting the difference would produce
     zero or a negative result, the right side must
     be larger instead.
  */

  if (leftAnswer - difference <= 0) {
    return leftAnswer + difference;
  }

  const makeRightLarger = Math.random() < 0.5;

  if (makeRightLarger) {
    return leftAnswer + difference;
  }

  return leftAnswer - difference;
}

/* --------------------------------------------------
   Generate Addition Expression
-------------------------------------------------- */

function generateAdditionSingle(config, differenceType) {
  const leftNumbers = config.left.operands.map(generateFromRange);

  const leftAnswer = leftNumbers.reduce((total, number) => total + number, 0);

  const difference = generateTargetDifference(config, differenceType);

  const rightAnswer = generatePositiveTarget(leftAnswer, difference);

  const rightNumbers = [rightAnswer];

  return {
    numbers: [...leftNumbers, ...rightNumbers],
    leftNumbers,
    rightNumbers,
    leftAnswer,
    rightAnswer,
    operators: ["+"],
    question: `${leftNumbers.join(" + ")} □ ` + `${rightNumbers.join(" + ")}`,
  };
}

/* --------------------------------------------------
   Generate Two-Sided Addition Expression
-------------------------------------------------- */

function generateAdditionDouble(config, differenceType) {
  const leftNumbers = config.left.operands.map(generateFromRange);

  const leftAnswer = leftNumbers.reduce((total, number) => total + number, 0);

  const difference = generateTargetDifference(config, differenceType);

  const rightAnswer = generatePositiveTarget(leftAnswer, difference);

  /*
     Build the right-hand side from two positive
     numbers whose sum equals the required result.
  */

  let rightFirst;
  let rightSecond;

  if (rightAnswer <= 2) {
    rightFirst = 1;
    rightSecond = rightAnswer - 1;
  } else {
    rightFirst = randomNumber(1, rightAnswer - 1);

    rightSecond = rightAnswer - rightFirst;
  }

  const rightNumbers = [rightFirst, rightSecond];

  return {
    numbers: [...leftNumbers, ...rightNumbers],
    leftNumbers,
    rightNumbers,
    leftAnswer,
    rightAnswer,
    operators: ["+", "+"],
    question: `${leftNumbers.join(" + ")} □ ` + `${rightNumbers.join(" + ")}`,
  };
}

/* --------------------------------------------------
   Generate Two-Sided Subtraction Expression
-------------------------------------------------- */

function generateSubtractionDouble(config, differenceType) {
  const leftNumbers = config.left.operands.map(generateFromRange);

  /*
     Ensure the left-hand subtraction has a
     positive result.
  */

  if (leftNumbers[1] >= leftNumbers[0]) {
    leftNumbers[1] = Math.max(1, leftNumbers[0] - 1);
  }

  const leftAnswer = leftNumbers[0] - leftNumbers[1];

  const difference = generateTargetDifference(config, differenceType);

  const rightAnswer = generatePositiveTarget(leftAnswer, difference);

  /*
     Ensure the right-hand subtraction also has
     a positive result.
  */

  let rightSubtrahend = randomNumber(1, Math.max(1, rightAnswer - 1));

  let rightMinuend = rightAnswer + rightSubtrahend;

  const rightNumbers = [rightMinuend, rightSubtrahend];

  return {
    numbers: [...leftNumbers, ...rightNumbers],
    leftNumbers,
    rightNumbers,
    leftAnswer,
    rightAnswer,
    operators: ["−", "−"],
    question: `${leftNumbers.join(" − ")} □ ` + `${rightNumbers.join(" − ")}`,
  };
}

/* --------------------------------------------------
   Generate Mixed Expression
-------------------------------------------------- */

function generateMixed(config, differenceType) {
  const leftNumbers = config.left.operands.map(generateFromRange);

  const leftAnswer = leftNumbers[0] * leftNumbers[1];

  const difference = generateTargetDifference(config, differenceType);

  const rightAnswer = generatePositiveTarget(leftAnswer, difference);

  const rightSubtrahend = randomNumber(10, 99);

  const rightMinuend = rightAnswer + rightSubtrahend;

  const rightNumbers = [rightMinuend, rightSubtrahend];

  return {
    numbers: [...leftNumbers, ...rightNumbers],
    leftNumbers,
    rightNumbers,
    leftAnswer,
    rightAnswer,
    operators: ["×", "−"],
    question: `${leftNumbers[0]} × ${leftNumbers[1]} □ ` + `${rightNumbers[0]} − ${rightNumbers[1]}`,
  };
}

/* --------------------------------------------------
   Generate Multiple-Operation Expression
-------------------------------------------------- */

function generateMultiple(config, differenceType) {
  const leftNumbers = config.left.operands.map(generateFromRange);

  const leftAnswer = leftNumbers[0] + leftNumbers[1] * leftNumbers[2];

  const difference = generateTargetDifference(config, differenceType);

  const rightAnswer = generatePositiveTarget(leftAnswer, difference);

  const rightSubtrahend = randomNumber(1, 50);

  const rightMinuend = rightAnswer + rightSubtrahend;

  const rightNumbers = [rightMinuend, rightSubtrahend];

  return {
    numbers: [...leftNumbers, ...rightNumbers],
    leftNumbers,
    rightNumbers,
    leftAnswer,
    rightAnswer,
    operators: ["+", "×", "−"],
    question: `${leftNumbers[0]} + ` + `${leftNumbers[1]} × ${leftNumbers[2]} □ ` + `${rightNumbers[0]} − ${rightNumbers[1]}`,
  };
}

/* --------------------------------------------------
   Generate Comparison Question
-------------------------------------------------- */

export function generateComparisonQuestion({ level, config }) {
  const differenceType = getDifferenceType(config);

  let generated;

  switch (config.template) {
    case "addition-single":
      generated = generateAdditionSingle(config, differenceType);
      break;

    case "addition-double":
      generated = generateAdditionDouble(config, differenceType);
      break;

    case "subtraction-double":
      generated = generateSubtractionDouble(config, differenceType);
      break;

    case "mixed":
      generated = generateMixed(config, differenceType);
      break;

    case "multiple":
      generated = generateMultiple(config, differenceType);
      break;

    default:
      throw new Error(`Unknown Comparison template for level ${level}: ${config.template}`);
  }

  const answer = getComparisonSymbol(generated.leftAnswer, generated.rightAnswer);

  return {
    id: `comparison_${level}_` + generated.numbers.join("_"),

    operation: "comparison",
    level,
    numbers: generated.numbers,
    operators: generated.operators,
    symbol: answer,
    question: generated.question,
    answer,
    options: ["<", ">", "="],
  };
}
