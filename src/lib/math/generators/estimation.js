// src/lib/math/generators/estimation.js

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
   Round To Nearest Ten
-------------------------------------------------- */

function roundToNearestTen(number) {
  return Math.round(number / 10) * 10;
}

/* --------------------------------------------------
   Round To Nearest Hundred
-------------------------------------------------- */

function roundToNearestHundred(number) {
  return Math.round(number / 100) * 100;
}

/* --------------------------------------------------
   Round Number
-------------------------------------------------- */

function roundNumber(number, rounding) {
  if (rounding === "nearest-100") {
    return roundToNearestHundred(number);
  }

  return roundToNearestTen(number);
}

/* --------------------------------------------------
   Generate Addition Question
-------------------------------------------------- */

function generateAddition(config) {
  const leftNumber = generateFromRange(config.left.operands[0]);

  const rightNumber = generateFromRange(config.right.operands[0]);

  const estimatedLeft = roundNumber(leftNumber, config.rounding);

  const estimatedRight = roundNumber(rightNumber, config.rounding);

  const answer = estimatedLeft + estimatedRight;

  return {
    numbers: [leftNumber, rightNumber],
    estimatedNumbers: [estimatedLeft, estimatedRight],
    operators: ["+"],
    question: `${leftNumber} + ${rightNumber}`,
    answer,
  };
}

/* --------------------------------------------------
   Generate Subtraction Question
-------------------------------------------------- */

function generateSubtraction(config) {
  let leftNumber;
  let rightNumber;

  let estimatedLeft;
  let estimatedRight;
  let answer;

  let attempts = 0;

  /*
     Keep generating until the estimated result
     remains positive when the level requires it.
  */

  do {
    leftNumber = generateFromRange(config.left.operands[0]);

    rightNumber = generateFromRange(config.right.operands[0]);

    estimatedLeft = roundNumber(leftNumber, config.rounding);

    estimatedRight = roundNumber(rightNumber, config.rounding);

    answer = estimatedLeft - estimatedRight;

    attempts++;
  } while (config.positiveResult && answer <= 0 && attempts < 100);

  return {
    numbers: [leftNumber, rightNumber],
    estimatedNumbers: [estimatedLeft, estimatedRight],
    operators: ["−"],
    question: `${leftNumber} − ${rightNumber}`,
    answer,
  };
}

/* --------------------------------------------------
   Generate Multiplication Question
-------------------------------------------------- */

function generateMultiplication(config) {
  const leftNumber = generateFromRange(config.left.operands[0]);

  const rightNumber = generateFromRange(config.right.operands[0]);

  const estimatedLeft = roundNumber(leftNumber, config.rounding);

  /*
     Keep the smaller factor unchanged when it
     is already easy to calculate mentally.
  */

  const estimatedRight = rightNumber;

  const answer = estimatedLeft * estimatedRight;

  return {
    numbers: [leftNumber, rightNumber],
    estimatedNumbers: [estimatedLeft, estimatedRight],
    operators: ["×"],
    question: `${leftNumber} × ${rightNumber}`,
    answer,
  };
}

/* --------------------------------------------------
   Generate Mixed Operation Question
-------------------------------------------------- */

function generateMixed(config) {
  const firstNumber = generateFromRange(config.left.operands[0]);

  const secondNumber = generateFromRange(config.left.operands[1]);

  const thirdNumber = generateFromRange(config.right.operands[0]);

  const estimatedFirst = roundNumber(firstNumber, config.rounding);

  const estimatedSecond = roundNumber(secondNumber, config.rounding);

  const estimatedThird = thirdNumber;

  /*
     Apply multiplication before addition,
     following normal order of operations.
  */

  const answer = estimatedFirst + estimatedSecond * estimatedThird;

  return {
    numbers: [firstNumber, secondNumber, thirdNumber],
    estimatedNumbers: [estimatedFirst, estimatedSecond, estimatedThird],
    operators: ["+", "×"],
    question: `${firstNumber} + ` + `${secondNumber} × ${thirdNumber}`,
    answer,
  };
}

/* --------------------------------------------------
   Generate Estimation Question
-------------------------------------------------- */

export function generateEstimationQuestion({ level, config }) {
  let generated;

  switch (config.template) {
    case "addition":
      generated = generateAddition(config);
      break;

    case "subtraction":
      generated = generateSubtraction(config);
      break;

    case "multiplication":
      generated = generateMultiplication(config);
      break;

    case "mixed":
      generated = generateMixed(config);
      break;

    default:
      throw new Error(`Unknown Estimation template for level ${level}: ${config.template}`);
  }

  return {
    id: `estimation_${level}_` + generated.numbers.join("_"),

    operation: "estimation",
    level,
    numbers: generated.numbers,
    operators: generated.operators,
    question: generated.question,
    answer: generated.answer,
    options: generateEstimationOptions(generated.answer),
  };
}

/* --------------------------------------------------
   Generate Estimation Options
-------------------------------------------------- */

function generateEstimationOptions(answer) {
  const options = new Set();

  options.add(answer);

  const variation = answer >= 1000 ? 100 : answer >= 100 ? 50 : 10;

  const variations = [-variation * 2, -variation, variation, variation * 2];

  for (const difference of variations) {
    if (options.size >= 4) {
      break;
    }

    const option = answer + difference;

    if (option >= 0) {
      options.add(option);
    }
  }

  /*
     Ensure four options are always available.
  */

  let fallback = variation;

  while (options.size < 4) {
    const option = answer + fallback;

    if (option >= 0) {
      options.add(option);
    }

    fallback += variation;
  }

  return shuffleOptions([...options]);
}

/* --------------------------------------------------
   Shuffle Options
-------------------------------------------------- */

function shuffleOptions(options) {
  const shuffled = [...options];

  for (let index = shuffled.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));

    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled;
}
