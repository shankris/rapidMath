// src/lib/math/generators/powersRoots.js

/* --------------------------------------------------
   Powers & Roots Utilities
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

/* --------------------------------------------------
   Level 1
   Squares of Small Numbers
-------------------------------------------------- */

function generateSquareSmallQuestion() {
  const number = randomInt(2, 12);
  const answer = number * number;

  return {
    numbers: [number],
    operators: ["²"],
    question: `${number}² = ?`,
    answer,
    options: generateNumericOptions(answer, 1),
  };
}

/* --------------------------------------------------
   Level 2
   Cubes of Small Numbers
-------------------------------------------------- */

function generateCubeSmallQuestion() {
  const number = randomInt(2, 8);
  const answer = number * number * number;

  return {
    numbers: [number],
    operators: ["³"],
    question: `${number}³ = ?`,
    answer,
    options: generateNumericOptions(answer, number),
  };
}

/* --------------------------------------------------
   Level 3
   Squares of Larger Numbers
-------------------------------------------------- */

function generateSquareLargeQuestion() {
  const number = randomInt(13, 30);
  const answer = number * number;

  return {
    numbers: [number],
    operators: ["²"],
    question: `${number}² = ?`,
    answer,
    options: generateNumericOptions(answer, number),
  };
}

/* --------------------------------------------------
   Level 4
   Powers of 2 and 10
-------------------------------------------------- */

function generatePowersQuestion() {
  const useTwo = Math.random() < 0.5;

  const base = useTwo ? 2 : 10;
  const exponent = useTwo ? randomInt(3, 10) : randomInt(2, 4);

  const answer = base ** exponent;

  return {
    numbers: [base, exponent],
    operators: ["^"],
    question: `${base}^${exponent} = ?`,
    answer,
    options: generateNumericOptions(answer, base === 2 ? Math.max(2, answer / 16) : 10),
  };
}

/* --------------------------------------------------
   Level 5
   Square Roots
-------------------------------------------------- */

function generateSquareRootQuestion() {
  const root = randomInt(2, 20);
  const number = root * root;

  return {
    numbers: [number],
    operators: ["√"],
    question: `√${number} = ?`,
    answer: root,
    options: generateNumericOptions(root, 1),
  };
}

/* --------------------------------------------------
   Level 6
   Cube Roots
-------------------------------------------------- */

function generateCubeRootQuestion() {
  const root = randomInt(2, 10);
  const number = root * root * root;

  return {
    numbers: [number],
    operators: ["∛"],
    question: `∛${number} = ?`,
    answer: root,
    options: generateNumericOptions(root, 1),
  };
}

/* --------------------------------------------------
   Level 7
   Mixed Powers and Roots
-------------------------------------------------- */

function generateMixedPowersRootsQuestion() {
  const type = randomInt(1, 4);

  let question;
  let answer;
  let numbers;
  let operators;

  if (type === 1) {
    const number = randomInt(3, 12);

    answer = number * number;
    question = `${number}² + ${number} = ?`;
    answer += number;

    numbers = [number];
    operators = ["²", "+"];
  } else if (type === 2) {
    const root = randomInt(3, 12);
    const number = root * root;

    answer = root + 5;
    question = `√${number} + 5 = ?`;

    numbers = [number, 5];
    operators = ["√", "+"];
  } else if (type === 3) {
    const number = randomInt(2, 8);

    answer = number * number * number - number;
    question = `${number}³ − ${number} = ?`;

    numbers = [number];
    operators = ["³", "−"];
  } else {
    const root = randomInt(2, 8);
    const number = root * root * root;

    answer = root * 2;
    question = `∛${number} × 2 = ?`;

    numbers = [number, 2];
    operators = ["∛", "×"];
  }

  return {
    numbers,
    operators,
    question,
    answer,
    options: generateNumericOptions(answer, Math.max(1, Math.floor(answer / 10))),
  };
}

/* --------------------------------------------------
   Level 8
   Advanced Powers and Roots
-------------------------------------------------- */

function generateAdvancedQuestion() {
  const type = randomInt(1, 4);

  let question;
  let answer;
  let numbers;
  let operators;

  if (type === 1) {
    const base = randomInt(2, 5);
    const exponent = randomInt(2, 4);
    const addition = randomInt(2, 10);

    answer = base ** exponent + addition;

    question = `${base}^${exponent} + ${addition} = ?`;

    numbers = [base, exponent, addition];
    operators = ["^", "+"];
  } else if (type === 2) {
    const root = randomInt(3, 15);
    const multiplier = randomInt(2, 5);
    const number = root * root;

    answer = root * multiplier;

    question = `√${number} × ${multiplier} = ?`;

    numbers = [number, multiplier];
    operators = ["√", "×"];
  } else if (type === 3) {
    const base = randomInt(2, 5);
    const exponent = randomInt(2, 4);
    const subtraction = randomInt(1, 10);

    answer = base ** exponent - subtraction;

    if (answer < 0) {
      return generateAdvancedQuestion();
    }

    question = `${base}^${exponent} − ${subtraction} = ?`;

    numbers = [base, exponent, subtraction];
    operators = ["^", "−"];
  } else {
    const root = randomInt(2, 8);
    const number = root * root * root;
    const addition = randomInt(2, 10);

    answer = root + addition;

    question = `∛${number} + ${addition} = ?`;

    numbers = [number, addition];
    operators = ["∛", "+"];
  }

  return {
    numbers,
    operators,
    question,
    answer,
    options: generateNumericOptions(answer, Math.max(1, Math.floor(answer / 10))),
  };
}

/* --------------------------------------------------
   Template Generators
-------------------------------------------------- */

const TEMPLATE_GENERATORS = {
  "square-small": generateSquareSmallQuestion,
  "cube-small": generateCubeSmallQuestion,
  "square-large": generateSquareLargeQuestion,
  powers: generatePowersQuestion,
  "square-root": generateSquareRootQuestion,
  "cube-root": generateCubeRootQuestion,
  "mixed-powers-roots": generateMixedPowersRootsQuestion,
  advanced: generateAdvancedQuestion,
};

/* --------------------------------------------------
   Generate Powers & Roots Question
-------------------------------------------------- */

export function generatePowersRootsQuestion({ level, config }) {
  if (!config) {
    throw new Error(`Powers & Roots configuration is missing for level ${level}.`);
  }

  const generator = TEMPLATE_GENERATORS[config.template];

  if (!generator) {
    throw new Error(`Unknown Powers & Roots template "${config.template}" for level ${level}.`);
  }

  const generated = generator();

  return {
    id: `powersRoots_${level}_${generated.question}_${generated.answer}`,
    operation: "powersRoots",
    level,
    numbers: generated.numbers,
    operators: generated.operators,
    question: generated.question,
    answer: generated.answer,
    options: generated.options,
  };
}
