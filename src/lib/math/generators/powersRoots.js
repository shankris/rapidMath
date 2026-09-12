// src/lib/math/generators/powersRoots.js

/* --------------------------------------------------
   Utility Functions
-------------------------------------------------- */

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function createQuestionId(level) {
  return `powers-roots-${level}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/* --------------------------------------------------
   Perfect Root Helpers
-------------------------------------------------- */

function createSquare(value) {
  return value * value;
}

function createCube(value) {
  return value * value * value;
}

/* --------------------------------------------------
   Answer Option Generation
-------------------------------------------------- */

function createOptions(answer) {
  const offsets = [-2, -1, 1, 2, -3, 3, -4, 4];
  const options = [answer];

  for (const offset of offsets) {
    const value = answer + offset;

    if (value < 0 || options.includes(value)) {
      continue;
    }

    options.push(value);

    if (options.length === 4) {
      break;
    }
  }

  return options.sort(() => Math.random() - 0.5);
}

/* --------------------------------------------------
   Question Builder
-------------------------------------------------- */

function buildQuestion({ level, question, answer, operation, numbers = [], operators = [] }) {
  return {
    id: createQuestionId(level),
    operation,
    level,
    numbers,
    operators,
    symbol: "powers-roots",
    question,
    answer,
    options: createOptions(answer),
  };
}

/* --------------------------------------------------
   Level 1 — Powers
-------------------------------------------------- */

function generatePowersQuestion({ level, config }) {
  const useSquare = Math.random() < 0.5;

  if (useSquare) {
    const number = randomInt(config.square.min, config.square.max);
    const answer = createSquare(number);

    return buildQuestion({
      level,
      operation: "powersRoots",
      question: `${number}² = ?`,
      answer,
      numbers: [number],
      operators: ["²"],
    });
  }

  const number = randomInt(config.cube.min, config.cube.max);
  const answer = createCube(number);

  return buildQuestion({
    level,
    operation: "powersRoots",
    question: `${number}³ = ?`,
    answer,
    numbers: [number],
    operators: ["³"],
  });
}

/* --------------------------------------------------
   Level 2 — Roots
-------------------------------------------------- */

function generateRootsQuestion({ level, config }) {
  const useSquareRoot = Math.random() < 0.65;

  if (useSquareRoot) {
    const root = randomInt(config.squareRoot.min, config.squareRoot.max);

    const radicand = createSquare(root);

    return buildQuestion({
      level,
      operation: "powersRoots",
      question: `√${radicand} = ?`,
      answer: root,
      numbers: [radicand],
      operators: ["√"],
    });
  }

  const root = randomInt(config.cubeRoot.min, config.cubeRoot.max);

  const radicand = createCube(root);

  return buildQuestion({
    level,
    operation: "powersRoots",
    question: `∛${radicand} = ?`,
    answer: root,
    numbers: [radicand],
    operators: ["∛"],
  });
}

/* --------------------------------------------------
   Level 3 — Mixed Powers & Roots
-------------------------------------------------- */

function generateMixedQuestion({ level, config }) {
  const templates = ["square-plus-square-root", "cube-plus-square-root", "square-plus-cube-root", "cube-minus-square-root", "square-minus-cube-root", "square-times-square-root"];

  const template = randomItem(templates);

  switch (template) {
    case "square-plus-square-root": {
      const squareNumber = randomInt(config.square.min, config.square.max);
      const root = randomInt(config.squareRoot.min, config.squareRoot.max);

      const square = createSquare(squareNumber);
      const radicand = createSquare(root);
      const answer = square + root;

      return buildQuestion({
        level,
        operation: "powersRoots",
        question: `${squareNumber}² + √${radicand} = ?`,
        answer,
        numbers: [squareNumber, radicand],
        operators: ["²", "+", "√"],
      });
    }

    case "cube-plus-square-root": {
      const cubeNumber = randomInt(config.cube.min, config.cube.max);
      const root = randomInt(config.squareRoot.min, config.squareRoot.max);

      const cube = createCube(cubeNumber);
      const radicand = createSquare(root);
      const answer = cube + root;

      return buildQuestion({
        level,
        operation: "powersRoots",
        question: `${cubeNumber}³ + √${radicand} = ?`,
        answer,
        numbers: [cubeNumber, radicand],
        operators: ["³", "+", "√"],
      });
    }

    case "square-plus-cube-root": {
      const squareNumber = randomInt(config.square.min, config.square.max);
      const root = randomInt(config.cubeRoot.min, config.cubeRoot.max);

      const square = createSquare(squareNumber);
      const radicand = createCube(root);
      const answer = square + root;

      return buildQuestion({
        level,
        operation: "powersRoots",
        question: `${squareNumber}² + ∛${radicand} = ?`,
        answer,
        numbers: [squareNumber, radicand],
        operators: ["²", "+", "∛"],
      });
    }

    case "cube-minus-square-root": {
      const cubeNumber = randomInt(config.cube.min, config.cube.max);
      const root = randomInt(config.squareRoot.min, config.squareRoot.max);

      const cube = createCube(cubeNumber);
      const radicand = createSquare(root);

      if (cube <= root) {
        return generateMixedQuestion({ level, config });
      }

      const answer = cube - root;

      return buildQuestion({
        level,
        operation: "powersRoots",
        question: `${cubeNumber}³ − √${radicand} = ?`,
        answer,
        numbers: [cubeNumber, radicand],
        operators: ["³", "−", "√"],
      });
    }

    case "square-minus-cube-root": {
      const squareNumber = randomInt(config.square.min, config.square.max);
      const root = randomInt(config.cubeRoot.min, config.cubeRoot.max);

      const square = createSquare(squareNumber);
      const radicand = createCube(root);

      if (square <= root) {
        return generateMixedQuestion({ level, config });
      }

      const answer = square - root;

      return buildQuestion({
        level,
        operation: "powersRoots",
        question: `${squareNumber}² − ∛${radicand} = ?`,
        answer,
        numbers: [squareNumber, radicand],
        operators: ["²", "−", "∛"],
      });
    }

    case "square-times-square-root": {
      const squareNumber = randomInt(config.square.min, config.square.max);
      const root = randomInt(config.squareRoot.min, config.squareRoot.max);

      const square = createSquare(squareNumber);
      const radicand = createSquare(root);
      const answer = square * root;

      return buildQuestion({
        level,
        operation: "powersRoots",
        question: `${squareNumber}² × √${radicand} = ?`,
        answer,
        numbers: [squareNumber, radicand],
        operators: ["²", "×", "√"],
      });
    }

    default:
      return generateMixedQuestion({ level, config });
  }
}

/* --------------------------------------------------
   Level 4 — Advanced
-------------------------------------------------- */

function generateAdvancedQuestion({ level, config }) {
  const templates = ["square-plus-root-times-number", "cube-minus-square-plus-root", "root-plus-square-times-number", "square-root-combination"];

  const template = randomItem(templates);

  switch (template) {
    case "square-plus-root-times-number": {
      const squareNumber = randomInt(config.square.min, config.square.max);
      const root = randomInt(config.squareRoot.min, config.squareRoot.max);
      const multiplier = randomInt(2, 5);

      const radicand = createSquare(root);
      const answer = (createSquare(squareNumber) + root) * multiplier;

      return buildQuestion({
        level,
        operation: "powersRoots",
        question: `(${squareNumber}² + √${radicand}) × ${multiplier} = ?`,
        answer,
        numbers: [squareNumber, radicand, multiplier],
        operators: ["²", "+", "√", "×"],
      });
    }

    case "cube-minus-square-plus-root": {
      const cubeNumber = randomInt(config.cube.min, config.cube.max);
      const squareNumber = randomInt(config.square.min, config.square.max);
      const root = randomInt(config.squareRoot.min, config.squareRoot.max);

      const cube = createCube(cubeNumber);
      const square = createSquare(squareNumber);
      const radicand = createSquare(root);
      const answer = cube - square + root;

      if (answer <= 0) {
        return generateAdvancedQuestion({ level, config });
      }

      return buildQuestion({
        level,
        operation: "powersRoots",
        question: `${cubeNumber}³ − ${squareNumber}² + √${radicand} = ?`,
        answer,
        numbers: [cubeNumber, squareNumber, radicand],
        operators: ["³", "−", "²", "+", "√"],
      });
    }

    case "root-plus-square-times-number": {
      const root = randomInt(config.squareRoot.min, config.squareRoot.max);
      const squareNumber = randomInt(config.square.min, config.square.max);
      const multiplier = randomInt(2, 4);

      const radicand = createSquare(root);
      const square = createSquare(squareNumber);
      const answer = (root + square) * multiplier;

      return buildQuestion({
        level,
        operation: "powersRoots",
        question: `(√${radicand} + ${squareNumber}²) × ${multiplier} = ?`,
        answer,
        numbers: [radicand, squareNumber, multiplier],
        operators: ["√", "+", "²", "×"],
      });
    }

    case "square-root-combination": {
      const squareNumber = randomInt(config.square.min, config.square.max);
      const root = randomInt(config.squareRoot.min, config.squareRoot.max);
      const cubeNumber = randomInt(config.cube.min, config.cube.max);

      const square = createSquare(squareNumber);
      const radicand = createSquare(root);
      const cube = createCube(cubeNumber);

      const answer = square + root - cube;

      if (answer <= 0) {
        return generateAdvancedQuestion({ level, config });
      }

      return buildQuestion({
        level,
        operation: "powersRoots",
        question: `${squareNumber}² + √${radicand} − ${cubeNumber}³ = ?`,
        answer,
        numbers: [squareNumber, radicand, cubeNumber],
        operators: ["²", "+", "√", "−", "³"],
      });
    }

    default:
      return generateAdvancedQuestion({ level, config });
  }
}

/* --------------------------------------------------
   Public Generator
-------------------------------------------------- */

export function generatePowersRootsQuestion({ level, config }) {
  switch (config.template) {
    case "powers":
      return generatePowersQuestion({
        level,
        config,
      });

    case "roots":
      return generateRootsQuestion({
        level,
        config,
      });

    case "mixed-powers-roots":
      return generateMixedQuestion({
        level,
        config,
      });

    case "advanced":
      return generateAdvancedQuestion({
        level,
        config,
      });

    default:
      throw new Error(`Unknown Powers & Roots template: ${config.template}`);
  }
}
