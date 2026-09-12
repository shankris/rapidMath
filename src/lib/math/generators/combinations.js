// src/lib/math/generators/combinations.js

/* --------------------------------------------------
   Utility Functions
-------------------------------------------------- */

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* --------------------------------------------------
   Factorial Calculation
-------------------------------------------------- */

function factorial(n) {
  if (n < 0 || !Number.isInteger(n)) {
    throw new Error("Factorial requires a non-negative integer.");
  }

  let result = 1;

  for (let i = 2; i <= n; i++) {
    result *= i;
  }

  return result;
}

/* --------------------------------------------------
   Question ID
-------------------------------------------------- */

function createQuestionId() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
}

/* --------------------------------------------------
   Multiple Choice Options
-------------------------------------------------- */

function generateOptions(answer) {
  const options = new Set([answer]);

  const offsets = [-2, -1, 1, 2, 3, -3, 4, -4];

  while (options.size < 4) {
    const offset = offsets[randomInt(0, offsets.length - 1)];
    const option = answer + offset;

    if (option > 0) {
      options.add(option);
    }
  }

  return Array.from(options).sort(() => Math.random() - 0.5);
}

/* --------------------------------------------------
   Direct Factorial Question
-------------------------------------------------- */

function generateDirectFactorial(config) {
  const number = randomInt(config.factorial.min, config.factorial.max);

  const answer = factorial(number);

  return {
    question: `${number}!`,
    answer,
    numbers: [number],
    operators: ["!"],
    template: "factorial-direct",
  };
}

/* --------------------------------------------------
   Factorial Addition
-------------------------------------------------- */

function generateFactorialAddition(config) {
  let first;
  let second;

  do {
    first = randomInt(config.factorial.min, config.factorial.max);

    second = randomInt(config.factorial.min, config.factorial.max);
  } while (first === second);

  const answer = factorial(first) + factorial(second);

  return {
    question: `${first}! + ${second}!`,
    answer,
    numbers: [first, second],
    operators: ["!", "+", "!"],
    template: "factorial-addition",
  };
}

/* --------------------------------------------------
   Factorial Subtraction
-------------------------------------------------- */

// function generateFactorialSubtraction(config) {
//   let larger;
//   let smaller;

//   do {
//     larger = randomInt(config.factorial.min, config.factorial.max);

//     smaller = randomInt(config.factorial.min, config.factorial.max);
//   } while (larger <= smaller);

//   const answer = factorial(larger) - factorial(smaller);

//   return {
//     question: `${larger}! − ${smaller}!`,
//     answer,
//     numbers: [larger, smaller],
//     operators: ["!", "−", "!"],
//     template: "factorial-subtraction",
//   };
// }

/* --------------------------------------------------
   Factorial Multiplication
-------------------------------------------------- */

function generateFactorialMultiplication(config) {
  let first;
  let second;

  do {
    first = randomInt(config.factorial.min, config.factorial.max);

    second = randomInt(config.factorial.min, config.factorial.max);
  } while (first === second);

  const answer = factorial(first) * factorial(second);

  return {
    question: `${first}! × ${second}!`,
    answer,
    numbers: [first, second],
    operators: ["!", "×", "!"],
    template: "factorial-multiplication",
  };
}

/* --------------------------------------------------
   Factorial Division
-------------------------------------------------- */

function generateFactorialDivision(config) {
  let larger;
  let smaller;

  do {
    larger = randomInt(config.factorial.min, config.factorial.max);

    smaller = randomInt(config.factorial.min, config.factorial.max);
  } while (larger <= smaller);

  const answer = factorial(larger) / factorial(smaller);

  return {
    question: `${larger}! ÷ ${smaller}!`,
    answer,
    numbers: [larger, smaller],
    operators: ["!", "÷", "!"],
    template: "factorial-division",
  };
}

/* --------------------------------------------------
   Factorial Template Selection
-------------------------------------------------- */

function generateFactorialTemplate(config) {
  const templates = config.operations || ["direct"];

  const template = templates[randomInt(0, templates.length - 1)];

  switch (template) {
    case "direct":
      return generateDirectFactorial(config);

    case "addition":
      return generateFactorialAddition(config);

    case "multiplication":
      return generateFactorialMultiplication(config);

    case "division":
      return generateFactorialDivision(config);

    default:
      return generateDirectFactorial(config);
  }
}

/* --------------------------------------------------
   Question Template Selection
-------------------------------------------------- */

function generateQuestionTemplate(level, config) {
  switch (level) {
    case 1:
      return generateFactorialTemplate(config);

    case 2:
      return generateBasicPermutation(config);

    case 3:
      return generateAdvancedPermutation(config);

    case 4:
      return generateBasicCombination(config);

    case 5:
      return generateAdvancedCombination(config);

    case 6:
      return generateMixedQuestion(config);

    case 7:
      return generateAdvancedCounting(config);

    default:
      throw new Error(`Factorials, Permutations & Combinations level ${level} is not implemented yet.`);
  }
}

/* --------------------------------------------------
   Permutation Calculation
-------------------------------------------------- */

function permutation(n, r) {
  if (n < 0 || r < 0 || !Number.isInteger(n) || !Number.isInteger(r) || r > n) {
    throw new Error("Invalid permutation values.");
  }

  let result = 1;

  for (let i = 0; i < r; i++) {
    result *= n - i;
  }

  return result;
}

/* --------------------------------------------------
   Combination Calculation
-------------------------------------------------- */

function combination(n, r) {
  if (n < 0 || r < 0 || !Number.isInteger(n) || !Number.isInteger(r) || r > n) {
    throw new Error("Invalid combination values.");
  }

  return factorial(n) / (factorial(r) * factorial(n - r));
}

/* --------------------------------------------------
   Basic Permutation Question
-------------------------------------------------- */

function generateBasicPermutation(config) {
  const { nMin, nMax, rMin, rMax } = config.permutation;

  const n = randomInt(nMin, nMax);
  const r = randomInt(rMin, Math.min(rMax, n));

  const answer = permutation(n, r);

  return {
    question: `${n}P${r}`,
    answer,
    numbers: [n, r],
    operators: ["P"],
    template: "permutation-basic",
  };
}

/* --------------------------------------------------
   Advanced Permutation Question
-------------------------------------------------- */

function generateAdvancedPermutation(config) {
  const { nMin, nMax, rMin, rMax } = config.permutation;

  const n = randomInt(nMin, nMax);
  const r = randomInt(rMin, Math.min(rMax, n));

  const answer = permutation(n, r);

  return {
    question: `${n}P${r}`,
    answer,
    numbers: [n, r],
    operators: ["P"],
    template: "permutation-advanced",
  };
}

/* --------------------------------------------------
   Basic Combination Question
-------------------------------------------------- */

function generateBasicCombination(config) {
  const { nMin, nMax, rMin, rMax } = config.combination;

  const n = randomInt(nMin, nMax);
  const r = randomInt(rMin, Math.min(rMax, n));

  const answer = combination(n, r);

  return {
    question: `${n}C${r}`,
    answer,
    numbers: [n, r],
    operators: ["C"],
    template: "combination-basic",
  };
}

/* --------------------------------------------------
   Advanced Combination Question
-------------------------------------------------- */

function generateAdvancedCombination(config) {
  const { nMin, nMax, rMin, rMax } = config.combination;

  const n = randomInt(nMin, nMax);
  const r = randomInt(rMin, Math.min(rMax, n));

  const answer = combination(n, r);

  return {
    question: `${n}C${r}`,
    answer,
    numbers: [n, r],
    operators: ["C"],
    template: "combination-advanced",
  };
}

/* --------------------------------------------------
   Advanced Counting Question
-------------------------------------------------- */

function generateAdvancedCounting(config) {
  const templates = ["combination-permutation", "combination-multiplication", "permutation-addition", "combination-addition"];

  const template = templates[randomInt(0, templates.length - 1)];

  switch (template) {
    case "combination-permutation": {
      const combinationN = randomInt(config.combination.nMin, config.combination.nMax);

      const combinationR = randomInt(config.combination.rMin, Math.min(config.combination.rMax, combinationN));

      const permutationN = randomInt(config.permutation.nMin, config.permutation.nMax);

      const permutationR = randomInt(config.permutation.rMin, Math.min(config.permutation.rMax, permutationN));

      const combinationValue = combination(combinationN, combinationR);

      const permutationValue = permutation(permutationN, permutationR);

      const answer = combinationValue * permutationValue;

      return {
        question: `${combinationN}C${combinationR} × ${permutationN}P${permutationR}`,
        answer,
        numbers: [combinationN, combinationR, permutationN, permutationR],
        operators: ["C", "×", "P"],
        template: "advanced-counting-combination-permutation",
      };
    }

    case "combination-multiplication": {
      const n = randomInt(config.combination.nMin, config.combination.nMax);

      const r = randomInt(config.combination.rMin, Math.min(config.combination.rMax, n));

      const multiplier = randomInt(2, 5);

      const combinationValue = combination(n, r);
      const answer = combinationValue * multiplier;

      return {
        question: `${n}C${r} × ${multiplier}`,
        answer,
        numbers: [n, r, multiplier],
        operators: ["C", "×"],
        template: "advanced-counting-combination-multiplication",
      };
    }

    case "permutation-addition": {
      const n = randomInt(config.permutation.nMin, config.permutation.nMax);

      const r = randomInt(config.permutation.rMin, Math.min(config.permutation.rMax, n));

      const addend = randomInt(5, 30);

      const permutationValue = permutation(n, r);
      const answer = permutationValue + addend;

      return {
        question: `${n}P${r} + ${addend}`,
        answer,
        numbers: [n, r, addend],
        operators: ["P", "+"],
        template: "advanced-counting-permutation-addition",
      };
    }

    case "combination-addition": {
      const n = randomInt(config.combination.nMin, config.combination.nMax);

      const r = randomInt(config.combination.rMin, Math.min(config.combination.rMax, n));

      const addend = randomInt(5, 30);

      const combinationValue = combination(n, r);
      const answer = combinationValue + addend;

      return {
        question: `${n}C${r} + ${addend}`,
        answer,
        numbers: [n, r, addend],
        operators: ["C", "+"],
        template: "advanced-counting-combination-addition",
      };
    }

    default:
      throw new Error("Unknown advanced counting template.");
  }
}

/* --------------------------------------------------
   Mixed Permutation & Combination Question
-------------------------------------------------- */

function generateMixedQuestion(config) {
  const templates = ["factorial", "permutation", "combination"];

  const template = templates[randomInt(0, templates.length - 1)];

  switch (template) {
    case "factorial": {
      const number = randomInt(config.factorial.min, config.factorial.max);

      const answer = factorial(number);

      return {
        question: `${number}!`,
        answer,
        numbers: [number],
        operators: ["!"],
        template: "mixed-factorial",
      };
    }

    case "permutation": {
      const { nMin, nMax, rMin, rMax } = config.permutation;

      const n = randomInt(nMin, nMax);
      const r = randomInt(rMin, Math.min(rMax, n));

      const answer = permutation(n, r);

      return {
        question: `${n}P${r}`,
        answer,
        numbers: [n, r],
        operators: ["P"],
        template: "mixed-permutation",
      };
    }

    case "combination": {
      const { nMin, nMax, rMin, rMax } = config.combination;

      const n = randomInt(nMin, nMax);
      const r = randomInt(rMin, Math.min(rMax, n));

      const answer = combination(n, r);

      return {
        question: `${n}C${r}`,
        answer,
        numbers: [n, r],
        operators: ["C"],
        template: "mixed-combination",
      };
    }

    default:
      throw new Error("Unknown mixed counting template.");
  }
}

/* --------------------------------------------------
   Public Question Generator
-------------------------------------------------- */

export function generateCombinationsQuestion({ level, config }) {
  if (!config) {
    throw new Error(`Factorials, Permutations & Combinations configuration is missing for level ${level}.`);
  }

  const generated = generateQuestionTemplate(level, config);

  return {
    id: createQuestionId(),
    operation: "combinations",
    level,
    numbers: generated.numbers,
    operators: generated.operators,
    template: generated.template,
    symbol: "!",
    question: generated.question,
    answer: generated.answer,
    options: generateOptions(generated.answer),
  };
}
