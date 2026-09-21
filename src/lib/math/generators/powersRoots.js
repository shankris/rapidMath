// src/lib/math/generators/powersRoots.js

/* --------------------------------------------------
   Random helpers
-------------------------------------------------- */

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function randomStepValue(min, max, step) {
  const count = Math.floor((max - min) / step);
  return min + randomInt(0, count) * step;
}

function createQuestionId(level) {
  return `powers-roots-${level}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/* --------------------------------------------------
   Mathematical helpers
-------------------------------------------------- */

function createSquare(value) {
  return value * value;
}

function createCube(value) {
  return value * value * value;
}

function isPerfectSquare(value) {
  const root = Math.sqrt(value);
  return Number.isInteger(root);
}

/* --------------------------------------------------
   Basic option helpers
-------------------------------------------------- */

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function hasSameParity(value, answer) {
  return Math.abs(value) % 2 === Math.abs(answer) % 2;
}

/* --------------------------------------------------
   Pattern-based integer options

   Levels 1–2 deliberately reinforce predictable
   mental-math patterns.

   Levels 3–4 use less obvious distractors so the
   learner must actually calculate.
-------------------------------------------------- */

function createPatternedIntegerOptions(answer, pattern) {
  const options = [answer];

  /*
     Squaring a number ending in 5 always produces
     a result ending in 25.

     For Levels 1–2 we deliberately keep the pattern
     in every answer choice so the learner can recognize
     and practise the technique.
  */
  if (pattern === "ends-in-25") {
    const offsets = [-100, 100, -200, 200, -300, 300, -400, 400, -500, 500];

    for (const offset of offsets) {
      const value = answer + offset;

      if (value <= 0) continue;
      if (value % 100 !== 25) continue;
      if (options.includes(value)) continue;

      options.push(value);

      if (options.length === 4) break;
    }

    return shuffle(options);
  }

  /*
     Squaring a number ending in 0 produces a result
     ending in 00.

     Again, Levels 1–2 deliberately reinforce this
     recognizable pattern.
  */
  if (pattern === "ends-in-00") {
    const offsets = [-100, 100, -200, 200, -300, 300, -400, 400, -500, 500];

    for (const offset of offsets) {
      const value = answer + offset;

      if (value <= 0) continue;
      if (value % 100 !== 0) continue;
      if (options.includes(value)) continue;

      options.push(value);

      if (options.length === 4) break;
    }

    return shuffle(options);
  }

  return createIntegerOptions(answer);
}

/* --------------------------------------------------
   General integer options

   Used where there is no specific training pattern,
   and for the harder levels.

   Distractors:
   - remain close to the answer
   - preserve parity
   - avoid unnecessary 0/5 giveaways
-------------------------------------------------- */

function createIntegerOptions(answer) {
  const options = [answer];

  const offsets = [-2, 2, -4, 4, -6, 6, -8, 8, -10, 10, -12, 12, -14, 14, -16, 16, -20, 20, -25, 25, -30, 30, -40, 40];

  /*
     First pass:
     Preserve parity and avoid introducing an obvious
     0/5 ending when the answer does not have one.
  */
  for (const offset of offsets) {
    const value = answer + offset;

    if (value < 0) continue;
    if (options.includes(value)) continue;
    if (!hasSameParity(value, answer)) continue;

    /*
       If the answer does not end in 0 or 5, don't make
       a distractor ending in 0 or 5 stand out.
    */
    if (answer % 10 !== 0 && answer % 10 !== 5 && (value % 10 === 0 || value % 10 === 5)) {
      continue;
    }

    options.push(value);

    if (options.length === 4) break;
  }

  /*
     Fallback:
     Preserve parity if the stricter rules could not
     produce enough options.
  */
  if (options.length < 4) {
    for (const offset of offsets) {
      const value = answer + offset;

      if (value < 0) continue;
      if (options.includes(value)) continue;
      if (!hasSameParity(value, answer)) continue;

      options.push(value);

      if (options.length === 4) break;
    }
  }

  return shuffle(options);
}

/* --------------------------------------------------
   Decimal options
-------------------------------------------------- */

function createDecimalOptions(answer) {
  const offsets = [-0.1, 0.1, -0.2, 0.2, -0.3, 0.3, -0.4, 0.4, -0.5, 0.5];

  const options = [Number(answer.toFixed(1))];

  for (const offset of offsets) {
    const value = Number((answer + offset).toFixed(1));

    if (value <= 0) continue;
    if (options.includes(value)) continue;

    options.push(value);

    if (options.length === 4) break;
  }

  return shuffle(options);
}

/* --------------------------------------------------
   Decimal interval helpers

   Returns one-decimal candidates and verifies that
   exactly one option lies strictly inside the interval.
-------------------------------------------------- */

function isBetween(value, lower, upper) {
  return value > lower && value < upper;
}

function createRootIntervalOptions(lowerRoot, upperRoot, answer) {
  const candidates = new Set();

  /*
     Generate one-decimal values covering the interval
     and some nearby values outside it.
  */
  const lowerTenth = Math.floor((lowerRoot - 1) * 10);
  const upperTenth = Math.ceil((upperRoot + 1) * 10);

  for (let tenth = lowerTenth; tenth <= upperTenth; tenth += 1) {
    candidates.add(Number((tenth / 10).toFixed(1)));
  }

  const validCandidates = [...candidates].filter((value) => value > 0 && isBetween(value, lowerRoot, upperRoot));

  if (validCandidates.length === 0) {
    return null;
  }

  /*
     The caller supplies a valid answer. Make sure it
     is actually one of the values inside the interval.
  */
  if (!validCandidates.includes(Number(answer.toFixed(1)))) {
    return null;
  }

  /*
     Choose the answer plus three values outside the
     interval. This guarantees only one option is valid.
  */
  const outsideCandidates = [...candidates].filter((value) => value > 0 && !isBetween(value, lowerRoot, upperRoot) && value !== Number(answer.toFixed(1))).sort((a, b) => Math.abs(a - answer) - Math.abs(b - answer));

  if (outsideCandidates.length < 3) {
    return null;
  }

  return shuffle([Number(answer.toFixed(1)), ...outsideCandidates.slice(0, 3)]);
}

/* --------------------------------------------------
   Question builder
-------------------------------------------------- */

function buildQuestion({ level, type, question, answer, operation = "powersRoots", numbers = [], operators = [], options }) {
  return {
    id: createQuestionId(level),
    operation,
    level,
    type,
    numbers,
    operators,
    symbol: "powers-roots",
    question,
    answer,
    options: options || createIntegerOptions(answer),
  };
}

/* --------------------------------------------------
   Level 1 generators
-------------------------------------------------- */

function generateSingleDigitSquare({ level, config }) {
  const value = randomInt(config.singleDigitSquare.min, config.singleDigitSquare.max);

  const answer = createSquare(value);

  return buildQuestion({
    level,
    type: "single-digit-square",
    question: `${value}² = ?`,
    answer,
    numbers: [value],
    operators: ["²"],
  });
}

function generateMultipleOf10Square({ level, config }) {
  const value = randomStepValue(config.multipleOf10Square.min, config.multipleOf10Square.max, config.multipleOf10Square.step);

  const answer = createSquare(value);

  /*
     Levels 1–2 deliberately keep 00 in every option.
  */
  const options = level <= 2 ? createPatternedIntegerOptions(answer, "ends-in-00") : createIntegerOptions(answer);

  return buildQuestion({
    level,
    type: "multiple-of-10-square",
    question: `${value}² = ?`,
    answer,
    numbers: [value],
    operators: ["²"],
    options,
  });
}

function generateEndingIn5Square({ level, config }) {
  const value = randomStepValue(config.endingIn5Square.min, config.endingIn5Square.max, config.endingIn5Square.step);

  const answer = createSquare(value);

  /*
     Levels 1–2 deliberately keep 25 in every option.
  */
  const options = level <= 2 ? createPatternedIntegerOptions(answer, "ends-in-25") : createIntegerOptions(answer);

  return buildQuestion({
    level,
    type: "ending-in-5-square",
    question: `${value}² = ?`,
    answer,
    numbers: [value],
    operators: ["²"],
    options,
  });
}

function generateThreeDigitEndingIn5Square({ level, config }) {
  const value = randomStepValue(config.threeDigitEndingIn5Square.min, config.threeDigitEndingIn5Square.max, config.threeDigitEndingIn5Square.step);

  const answer = createSquare(value);

  /*
     This is still a Level 2 training question, so all
     options deliberately retain the 25 pattern.
  */
  const options = level <= 2 ? createPatternedIntegerOptions(answer, "ends-in-25") : createIntegerOptions(answer);

  return buildQuestion({
    level,
    type: "three-digit-ending-in-5-square",
    question: `${value}² = ?`,
    answer,
    numbers: [value],
    operators: ["²"],
    options,
  });
}

function generateCube({ level, config }) {
  const value = randomInt(config.cube.min, config.cube.max);
  const answer = createCube(value);

  return buildQuestion({
    level,
    type: "cube",
    question: `${value}³ = ?`,
    answer,
    numbers: [value],
    operators: ["³"],
  });
}

/* --------------------------------------------------
   Root generators
-------------------------------------------------- */

function generateSquareRoot({ level, config }) {
  const root = randomInt(config.squareRoot.min, config.squareRoot.max);

  const radicand = createSquare(root);

  return buildQuestion({
    level,
    type: "square-root",
    question: `√${radicand} = ?`,
    answer: root,
    numbers: [radicand],
    operators: ["√"],
  });
}

function generateCubeRoot({ level, config }) {
  const root = randomInt(config.cubeRoot.min, config.cubeRoot.max);

  const radicand = createCube(root);

  return buildQuestion({
    level,
    type: "cube-root",
    question: `∛${radicand} = ?`,
    answer: root,
    numbers: [radicand],
    operators: ["∛"],
  });
}

/* --------------------------------------------------
   General square generator
-------------------------------------------------- */

function generateSquare({ level, config }) {
  const value = randomInt(config.square.min, config.square.max);

  const answer = createSquare(value);

  return buildQuestion({
    level,
    type: "square",
    question: `${value}² = ?`,
    answer,
    numbers: [value],
    operators: ["²"],
  });
}

/* --------------------------------------------------
   Square-root interval generator

   Level 1–2:
   Use familiar perfect-square boundaries.

   Level 3–4:
   Use wider intervals and select a valid
   one-decimal number anywhere inside them.
-------------------------------------------------- */

function generateSquareRootInterval({ level, config }) {
  const minimumRoot = config.squareRootInterval.min;
  const maximumRoot = config.squareRootInterval.max;

  /*
     Levels 1–2 use familiar consecutive perfect squares.
     This introduces the concept before decimal estimation.
  */
  if (level <= 2) {
    const lowerRoot = randomInt(minimumRoot, maximumRoot - 1);

    const upperRoot = lowerRoot + 1;

    const lowerRadicand = createSquare(lowerRoot);
    const upperRadicand = createSquare(upperRoot);

    /*
       Use several possible one-decimal answers rather than
       always choosing the midpoint. For consecutive integer
       roots, all tenths between them are valid.
    */
    const validAnswers = [];

    for (let tenth = Math.ceil(lowerRoot * 10 + 1); tenth < upperRoot * 10; tenth += 1) {
      validAnswers.push(Number((tenth / 10).toFixed(1)));
    }

    const answer = randomItem(validAnswers);

    const options = createRootIntervalOptions(lowerRoot, upperRoot, answer);

    /*
       This should always succeed for a one-unit interval,
       but retain a safe fallback.
    */
    return buildQuestion({
      level,
      type: "square-root-interval",
      question: `Which number lies between √${lowerRadicand} and √${upperRadicand}?`,
      answer,
      numbers: [lowerRadicand, upperRadicand],
      operators: ["√", "√"],
      options: options || createDecimalOptions(answer),
    });
  }

  /*
     Levels 3–4:
     Search for a pair of radicands whose roots contain
     multiple one-decimal values. The answer is any one
     valid value, not necessarily the midpoint.
  */
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const lowerRadicand = randomInt(minimumRoot, maximumRoot);

    const upperRadicand = randomInt(lowerRadicand + 2, maximumRoot + 20);

    const lowerRoot = Math.sqrt(lowerRadicand);
    const upperRoot = Math.sqrt(upperRadicand);

    const validAnswers = [];

    const startTenth = Math.ceil(lowerRoot * 10);
    const endTenth = Math.floor(upperRoot * 10);

    for (let tenth = startTenth; tenth <= endTenth; tenth += 1) {
      const candidate = Number((tenth / 10).toFixed(1));

      if (candidate > lowerRoot && candidate < upperRoot) {
        validAnswers.push(candidate);
      }
    }

    if (validAnswers.length < 4) {
      continue;
    }

    const answer = randomItem(validAnswers);

    const options = createRootIntervalOptions(lowerRoot, upperRoot, answer);

    if (!options) {
      continue;
    }

    return buildQuestion({
      level,
      type: "square-root-interval",
      question: `Which number lies between √${lowerRadicand} and √${upperRadicand}?`,
      answer,
      numbers: [lowerRadicand, upperRadicand],
      operators: ["√", "√"],
      options,
    });
  }

  /*
     Safe fallback using a familiar interval.
  */
  const lowerRoot = Math.max(1, minimumRoot);
  const upperRoot = lowerRoot + 2;

  const lowerRadicand = createSquare(lowerRoot);
  const upperRadicand = createSquare(upperRoot);

  const answer = Number((lowerRoot + 0.7).toFixed(1));

  return buildQuestion({
    level,
    type: "square-root-interval",
    question: `Which number lies between √${lowerRadicand} and √${upperRadicand}?`,
    answer,
    numbers: [lowerRadicand, upperRadicand],
    operators: ["√", "√"],
    options: createRootIntervalOptions(lowerRoot, upperRoot, answer) || createDecimalOptions(answer),
  });
}

/* --------------------------------------------------
   Square root between integers
-------------------------------------------------- */

function generateSquareRootBetweenIntegers({ level, config }) {
  let radicand;

  do {
    radicand = randomInt(config.squareRootBetweenIntegers.min, config.squareRootBetweenIntegers.max);
  } while (isPerfectSquare(radicand));

  const lower = Math.floor(Math.sqrt(radicand));
  const upper = lower + 1;

  const answer = `${lower} and ${upper}`;

  const options = [answer, `${Math.max(1, lower - 2)} and ${lower - 1}`, `${lower - 1} and ${lower}`, `${upper} and ${upper + 1}`];

  return buildQuestion({
    level,
    type: "square-root-between-integers",
    question: `Which pair of integers contains √${radicand}?`,
    answer,
    numbers: [radicand],
    operators: ["√"],
    options: shuffle(options),
  });
}

/* --------------------------------------------------
   Mixed powers and roots
-------------------------------------------------- */

function generateMixedPowersRoots({ level }) {
  const template = randomItem(["square-plus-root", "square-minus-root", "cube-plus-root", "square-plus-cube"]);

  let question;
  let answer;
  let numbers;
  let operators;

  switch (template) {
    case "square-plus-root": {
      const squareValue = randomInt(2, 15);
      const rootValue = randomInt(4, 9);
      const rootRadicand = createSquare(rootValue);

      answer = createSquare(squareValue) + rootValue;
      question = `${squareValue}² + √${rootRadicand} = ?`;
      numbers = [squareValue, rootRadicand];
      operators = ["²", "√"];
      break;
    }

    case "square-minus-root": {
      const squareValue = randomInt(5, 15);
      const rootValue = randomInt(2, 6);
      const rootRadicand = createSquare(rootValue);

      answer = createSquare(squareValue) - rootValue;
      question = `${squareValue}² − √${rootRadicand} = ?`;
      numbers = [squareValue, rootRadicand];
      operators = ["²", "√"];
      break;
    }

    case "cube-plus-root": {
      const cubeValue = randomInt(2, 6);
      const rootValue = randomInt(2, 6);
      const rootRadicand = createSquare(rootValue);

      answer = createCube(cubeValue) + rootValue;
      question = `${cubeValue}³ + √${rootRadicand} = ?`;
      numbers = [cubeValue, rootRadicand];
      operators = ["³", "√"];
      break;
    }

    case "square-plus-cube": {
      const squareValue = randomInt(2, 10);
      const cubeValue = randomInt(2, 5);

      answer = createSquare(squareValue) + createCube(cubeValue);

      question = `${squareValue}² + ${cubeValue}³ = ?`;
      numbers = [squareValue, cubeValue];
      operators = ["²", "³"];
      break;
    }

    default:
      throw new Error(`Unsupported mixed powers/root template: ${template}`);
  }

  return buildQuestion({
    level,
    type: "mixed-powers-roots",
    question,
    answer,
    numbers,
    operators,
  });
}

/* --------------------------------------------------
   Question-type dispatcher
-------------------------------------------------- */

function generateQuestionByType({ level, type, config }) {
  switch (type) {
    case "single-digit-square":
      return generateSingleDigitSquare({ level, config });

    case "multiple-of-10-square":
      return generateMultipleOf10Square({ level, config });

    case "ending-in-5-square":
      return generateEndingIn5Square({ level, config });

    case "three-digit-ending-in-5-square":
      return generateThreeDigitEndingIn5Square({
        level,
        config,
      });

    case "cube":
      return generateCube({ level, config });

    case "square-root":
      return generateSquareRoot({ level, config });

    case "cube-root":
      return generateCubeRoot({ level, config });

    case "square":
      return generateSquare({ level, config });

    case "square-root-interval":
      return generateSquareRootInterval({
        level,
        config,
      });

    case "square-root-between-integers":
      return generateSquareRootBetweenIntegers({
        level,
        config,
      });

    case "mixed-powers-roots":
      return generateMixedPowersRoots({
        level,
        config,
      });

    default:
      throw new Error(`Unsupported Powers & Roots question type: ${type}`);
  }
}

/* --------------------------------------------------
   Public generator
-------------------------------------------------- */

export function generatePowersRootsQuestion({ level, config }) {
  if (!config || !Array.isArray(config.questionTypes)) {
    throw new Error(`Invalid Powers & Roots configuration for level ${level}`);
  }

  const type = randomItem(config.questionTypes);

  return generateQuestionByType({
    level,
    type,
    config,
  });
}
