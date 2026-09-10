// src/lib/math/generators/sequences.js

/* --------------------------------------------------
   Random Number
-------------------------------------------------- */

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
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

/* --------------------------------------------------
   Generate Options
-------------------------------------------------- */

function generateOptions(answer) {
  const options = new Set();

  options.add(answer);

  const variations = Math.abs(answer) < 50 ? [-3, -2, -1, 1, 2, 3] : [-20, -10, -5, 5, 10, 20];

  let attempts = 0;

  while (options.size < 4 && attempts < 100) {
    attempts++;

    const variation = variations[randomNumber(0, variations.length - 1)];

    const option = answer + variation;

    if (option > 0) {
      options.add(option);
    }
  }

  let fallback = 1;

  while (options.size < 4) {
    const option = answer + fallback;

    if (option > 0) {
      options.add(option);
    }

    fallback++;
  }

  return shuffleOptions([...options]);
}

/* --------------------------------------------------
   Generate Addition Sequence
-------------------------------------------------- */

function generateAdditionSequence(config) {
  const start = randomNumber(config.start.min, config.start.max);

  const difference = randomNumber(config.difference.min, config.difference.max);

  const sequence = [start];

  for (let index = 1; index < config.length; index++) {
    sequence.push(sequence[index - 1] + difference);
  }

  return {
    sequence,
    answer: sequence[sequence.length - 1] + difference,
  };
}

/* --------------------------------------------------
   Generate Subtraction Sequence
-------------------------------------------------- */

function generateSubtractionSequence(config) {
  let start;
  let difference;
  let sequence;

  let attempts = 0;

  do {
    start = randomNumber(config.start.min, config.start.max);

    difference = randomNumber(config.difference.min, config.difference.max);

    sequence = [start];

    for (let index = 1; index < config.length; index++) {
      sequence.push(sequence[index - 1] - difference);
    }

    attempts++;
  } while (sequence.some((number) => number <= 0) && attempts < 100);

  return {
    sequence,
    answer: sequence[sequence.length - 1] - difference,
  };
}

/* --------------------------------------------------
   Generate Multiplication Sequence
-------------------------------------------------- */

function generateMultiplicationSequence(config) {
  const start = randomNumber(config.start.min, config.start.max);

  const multiplier = randomNumber(config.multiplier.min, config.multiplier.max);

  const sequence = [start];

  for (let index = 1; index < config.length; index++) {
    sequence.push(sequence[index - 1] * multiplier);
  }

  return {
    sequence,
    answer: sequence[sequence.length - 1] * multiplier,
  };
}

/* --------------------------------------------------
   Generate Division Sequence
-------------------------------------------------- */

function generateDivisionSequence(config) {
  const divisor = randomNumber(config.divisor.min, config.divisor.max);

  /*
     Generate the starting value as a power of
     the divisor so every division remains exact.
  */

  const power = randomNumber(5, 8);

  const start = Math.pow(divisor, power);

  const sequence = [start];

  for (let index = 1; index < config.length; index++) {
    sequence.push(sequence[index - 1] / divisor);
  }

  return {
    sequence,
    answer: sequence[sequence.length - 1] / divisor,
  };
}

/* --------------------------------------------------
   Apply Operation
-------------------------------------------------- */

function applyOperation(value, operation) {
  const operand = randomNumber(operation.min, operation.max);

  if (operation.operator === "×") {
    return value * operand;
  }

  if (operation.operator === "−") {
    return value - operand;
  }

  if (operation.operator === "+") {
    return value + operand;
  }

  throw new Error(`Unknown sequence operator: ${operation.operator}`);
}

/* --------------------------------------------------
   Generate Alternating Sequence
-------------------------------------------------- */

function generateAlternatingSequence(config) {
  const start = randomNumber(config.start.min, config.start.max);

  const sequence = [start];

  for (let index = 1; index < config.length; index++) {
    const operation = config.operations[(index - 1) % config.operations.length];

    sequence.push(applyOperation(sequence[index - 1], operation));
  }

  return {
    sequence,
    answer: applyOperation(sequence[sequence.length - 1], config.operations[(config.length - 1) % config.operations.length]),
  };
}

/* --------------------------------------------------
   Generate Increasing Difference Sequence
-------------------------------------------------- */

function generateIncreasingDifferenceSequence(config) {
  const start = randomNumber(config.start.min, config.start.max);

  const sequence = [start];

  for (let index = 1; index < config.length; index++) {
    const difference = config.difference.start + (index - 1) * config.difference.increment;

    sequence.push(sequence[index - 1] + difference);
  }

  const nextDifference = config.difference.start + (config.length - 1) * config.difference.increment;

  return {
    sequence,
    answer: sequence[sequence.length - 1] + nextDifference,
  };
}

/* --------------------------------------------------
   Generate Odd Difference Sequence
-------------------------------------------------- */

function generateOddDifferenceSequence(config) {
  const start = randomNumber(config.start.min, config.start.max);

  const sequence = [start];

  for (let index = 1; index < config.length; index++) {
    const difference = config.difference.start + (index - 1) * config.difference.increment;

    sequence.push(sequence[index - 1] + difference);
  }

  const nextDifference = config.difference.start + (config.length - 1) * config.difference.increment;

  return {
    sequence,
    answer: sequence[sequence.length - 1] + nextDifference,
  };
}

/* --------------------------------------------------
   Generate Compound Sequence
-------------------------------------------------- */

function generateCompoundSequence(config) {
  const start = randomNumber(config.start.min, config.start.max);

  const sequence = [start];

  for (let index = 1; index < config.length; index++) {
    const operation = config.operations[(index - 1) % config.operations.length];

    sequence.push(applyOperation(sequence[index - 1], operation));
  }

  const nextOperation = config.operations[(config.length - 1) % config.operations.length];

  return {
    sequence,
    answer: applyOperation(sequence[sequence.length - 1], nextOperation),
  };
}

/* --------------------------------------------------
   Format Sequence
-------------------------------------------------- */

function formatSequence(sequence) {
  return sequence.join(", ") + ", □";
}

/* --------------------------------------------------
   Generate Sequence Question
-------------------------------------------------- */

export function generateSequenceQuestion({ level, config }) {
  let generated;

  switch (config.template) {
    case "addition":
      generated = generateAdditionSequence(config);
      break;

    case "subtraction":
      generated = generateSubtractionSequence(config);
      break;

    case "multiplication":
      generated = generateMultiplicationSequence(config);
      break;

    case "division":
      generated = generateDivisionSequence(config);
      break;

    case "alternating":
      generated = generateAlternatingSequence(config);
      break;

    case "increasing-difference":
      generated = generateIncreasingDifferenceSequence(config);
      break;

    case "odd-difference":
      generated = generateOddDifferenceSequence(config);
      break;

    case "compound":
      generated = generateCompoundSequence(config);
      break;

    default:
      throw new Error(`Unknown Sequences template for level ${level}: ${config.template}`);
  }

  return {
    id: `sequences_${level}_` + generated.sequence.join("_"),

    operation: "sequences",
    level,
    numbers: [...generated.sequence, generated.answer],
    operators: [],
    question: formatSequence(generated.sequence),
    answer: generated.answer,
    options: generateOptions(generated.answer),
  };
}
