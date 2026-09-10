// src/lib/math/generators/fractions.js

/* --------------------------------------------------
   Fraction Utilities
-------------------------------------------------- */

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);

  while (b !== 0) {
    const remainder = a % b;
    a = b;
    b = remainder;
  }

  return a || 1;
}

function simplifyFraction(numerator, denominator) {
  if (denominator === 0) {
    throw new Error("Fraction denominator cannot be zero.");
  }

  if (denominator < 0) {
    numerator *= -1;
    denominator *= -1;
  }

  const divisor = gcd(numerator, denominator);

  return {
    numerator: numerator / divisor,
    denominator: denominator / divisor,
  };
}

function fractionKey(fraction) {
  const simplified = simplifyFraction(fraction.numerator, fraction.denominator);

  return `${simplified.numerator}/${simplified.denominator}`;
}

function formatFraction(fraction) {
  const simplified = simplifyFraction(fraction.numerator, fraction.denominator);

  if (simplified.denominator === 1) {
    return String(simplified.numerator);
  }

  return `${simplified.numerator}/${simplified.denominator}`;
}

function addFractions(left, right) {
  return simplifyFraction(left.numerator * right.denominator + right.numerator * left.denominator, left.denominator * right.denominator);
}

function subtractFractions(left, right) {
  return simplifyFraction(left.numerator * right.denominator - right.numerator * left.denominator, left.denominator * right.denominator);
}

function multiplyFractions(left, right) {
  return simplifyFraction(left.numerator * right.numerator, left.denominator * right.denominator);
}

function divideFractions(left, right) {
  if (right.numerator === 0) {
    throw new Error("Cannot divide by a fraction with a zero numerator.");
  }

  return simplifyFraction(left.numerator * right.denominator, left.denominator * right.numerator);
}

function compareFractions(left, right) {
  const leftValue = left.numerator * right.denominator;
  const rightValue = right.numerator * left.denominator;

  if (leftValue < rightValue) {
    return "<";
  }

  if (leftValue > rightValue) {
    return ">";
  }

  return "=";
}

/* --------------------------------------------------
   Fraction Generators
-------------------------------------------------- */

function randomProperFraction(minDenominator = 3, maxDenominator = 12) {
  const denominator = randomInt(minDenominator, maxDenominator);

  const numerator = randomInt(1, denominator - 1);

  return {
    numerator,
    denominator,
  };
}

function generateSimplifyQuestion() {
  const base = randomProperFraction(2, 10);
  const multiplier = randomInt(2, 5);

  const fraction = {
    numerator: base.numerator * multiplier,
    denominator: base.denominator * multiplier,
  };

  const answer = simplifyFraction(fraction.numerator, fraction.denominator);

  return {
    numbers: [fraction.numerator, fraction.denominator],
    operators: [],
    question: `${fraction.numerator}/${fraction.denominator} = ?`,
    answer: formatFraction(answer),
    options: generateFractionOptions(answer),
  };
}

function generateEquivalentQuestion() {
  const denominator = randomInt(3, 10);
  const numerator = randomInt(1, denominator - 1);
  const multiplier = randomInt(2, 4);

  const newDenominator = denominator * multiplier;
  const answer = numerator * multiplier;

  const distractors = new Set([answer - 2, answer - 1, answer + 1, answer + 2, answer + 3]);

  const options = shuffle([...distractors].filter((value) => value > 0).slice(0, 4));

  while (options.length < 4) {
    const candidate = answer + randomInt(-6, 6);

    if (candidate > 0 && candidate !== answer && !options.includes(candidate)) {
      options.push(candidate);
    }
  }

  return {
    numbers: [numerator, denominator, newDenominator],
    operators: ["="],
    question: `${numerator}/${denominator} = □/${newDenominator}`,
    answer,
    options: shuffle([answer, ...options.slice(0, 3)]),
  };
}

function generateCompareQuestion() {
  const shouldBeEqual = Math.random() < 0.25;

  let left;
  let right;

  if (shouldBeEqual) {
    const base = randomProperFraction(3, 10);
    const leftMultiplier = randomInt(2, 4);
    const rightMultiplier = randomInt(2, 5);

    left = {
      numerator: base.numerator * leftMultiplier,
      denominator: base.denominator * leftMultiplier,
    };

    right = {
      numerator: base.numerator * rightMultiplier,
      denominator: base.denominator * rightMultiplier,
    };
  } else {
    do {
      left = randomProperFraction(3, 12);
      right = randomProperFraction(3, 12);
    } while (compareFractions(left, right) === "=");
  }

  const answer = compareFractions(left, right);

  return {
    numbers: [left.numerator, left.denominator, right.numerator, right.denominator],
    operators: [answer],
    question: `${formatFraction(left)} □ ${formatFraction(right)}`,
    answer,
    options: shuffle(["<", ">", "="]),
  };
}

function generateSameDenominatorQuestion() {
  const denominator = randomInt(4, 12);
  const isAddition = Math.random() < 0.5;

  let numerator1;
  let numerator2;

  if (isAddition) {
    numerator1 = randomInt(1, denominator - 2);
    numerator2 = randomInt(1, denominator - numerator1 - 1);
  } else {
    numerator1 = randomInt(2, denominator - 1);
    numerator2 = randomInt(1, numerator1 - 1);
  }

  const left = {
    numerator: numerator1,
    denominator,
  };

  const right = {
    numerator: numerator2,
    denominator,
  };

  const answer = isAddition ? addFractions(left, right) : subtractFractions(left, right);

  const operator = isAddition ? "+" : "−";

  const answerText = formatFraction(answer);

  return {
    numbers: [numerator1, denominator, numerator2, denominator],
    operators: [operator],
    question: `${formatFraction(left)} ${operator} ${formatFraction(right)} = ?`,
    answer: answerText,
    options: generateFractionOptions(answerText),
  };
}

function generateDifferentDenominatorQuestion() {
  let left;
  let right;
  let answer;
  let operator;

  do {
    const denominator1 = randomInt(3, 10);
    let denominator2 = randomInt(3, 10);

    while (denominator2 === denominator1) {
      denominator2 = randomInt(3, 10);
    }

    left = {
      numerator: randomInt(1, denominator1 - 1),
      denominator: denominator1,
    };

    right = {
      numerator: randomInt(1, denominator2 - 1),
      denominator: denominator2,
    };

    operator = Math.random() < 0.5 ? "+" : "−";

    answer = operator === "+" ? addFractions(left, right) : subtractFractions(left, right);
  } while (answer.numerator <= 0 || answer.denominator <= 0 || answer.numerator >= answer.denominator);

  const answerText = formatFraction(answer);

  return {
    numbers: [left.numerator, left.denominator, right.numerator, right.denominator],
    operators: [operator],
    question: `${formatFraction(left)} ${operator} ${formatFraction(right)} = ?`,
    answer: answerText,
    options: generateFractionOptions(answerText),
  };
}

function generateMultiplyQuestion() {
  let left;
  let right;
  let answer;

  do {
    left = randomProperFraction(3, 12);
    right = randomProperFraction(3, 12);

    answer = multiplyFractions(left, right);
  } while (answer.numerator === 0 || answer.denominator === 1);

  const answerText = formatFraction(answer);

  return {
    numbers: [left.numerator, left.denominator, right.numerator, right.denominator],
    operators: ["×"],
    question: `${formatFraction(left)} × ${formatFraction(right)} = ?`,
    answer: answerText,
    options: generateFractionOptions(answerText),
  };
}

function generateDivideQuestion() {
  let left;
  let right;
  let answer;

  do {
    left = randomProperFraction(3, 12);
    right = randomProperFraction(3, 12);

    answer = divideFractions(left, right);
  } while (answer.numerator <= 0);

  const answerText = formatFraction(answer);

  return {
    numbers: [left.numerator, left.denominator, right.numerator, right.denominator],
    operators: ["÷"],
    question: `${formatFraction(left)} ÷ ${formatFraction(right)} = ?`,
    answer: answerText,
    options: generateFractionOptions(answerText),
  };
}

function generateMixedQuestion() {
  let first;
  let second;
  let third;
  let middleOperator;
  let answer;

  do {
    first = randomProperFraction(2, 8);
    second = randomProperFraction(2, 8);
    third = randomProperFraction(2, 8);

    middleOperator = Math.random() < 0.5 ? "+" : "−";

    const multiplied = multiplyFractions(second, third);

    answer = middleOperator === "+" ? addFractions(first, multiplied) : subtractFractions(first, multiplied);
  } while (answer.numerator <= 0);

  const answerText = formatFraction(answer);

  return {
    numbers: [first.numerator, first.denominator, second.numerator, second.denominator, third.numerator, third.denominator],
    operators: [middleOperator, "×"],
    question: `${formatFraction(first)} ${middleOperator} ${formatFraction(second)} × ${formatFraction(third)} = ?`,
    answer: answerText,
    options: generateFractionOptions(answerText),
  };
}

/* --------------------------------------------------
   Fraction Answer Options
-------------------------------------------------- */

function generateFractionOptions(answerText) {
  const answer = parseFraction(answerText);
  const answerKey = fractionKey(answer);

  const candidates = [
    {
      numerator: answer.numerator + 1,
      denominator: answer.denominator,
    },
    {
      numerator: answer.numerator - 1,
      denominator: answer.denominator,
    },
    {
      numerator: answer.numerator,
      denominator: answer.denominator + 1,
    },
    {
      numerator: answer.numerator,
      denominator: Math.max(2, answer.denominator - 1),
    },
    {
      numerator: answer.numerator + 1,
      denominator: answer.denominator + 1,
    },
    {
      numerator: answer.numerator - 1,
      denominator: answer.denominator + 1,
    },
    {
      numerator: answer.numerator + 2,
      denominator: answer.denominator,
    },
    {
      numerator: answer.numerator,
      denominator: answer.denominator + 2,
    },
  ];

  const options = [];
  const used = new Set([answerKey]);

  for (const candidate of candidates) {
    if (candidate.numerator <= 0) {
      continue;
    }

    const simplified = simplifyFraction(candidate.numerator, candidate.denominator);

    const key = fractionKey(simplified);

    if (used.has(key)) {
      continue;
    }

    used.add(key);
    options.push(formatFraction(simplified));

    if (options.length === 3) {
      break;
    }
  }

  while (options.length < 3) {
    const candidate = {
      numerator: randomInt(Math.max(1, answer.numerator - 3), answer.numerator + 3),
      denominator: randomInt(Math.max(2, answer.denominator - 2), answer.denominator + 3),
    };

    const simplified = simplifyFraction(candidate.numerator, candidate.denominator);

    const key = fractionKey(simplified);

    if (used.has(key)) {
      continue;
    }

    used.add(key);
    options.push(formatFraction(simplified));
  }

  return shuffle([answerText, ...options]);
}

/* --------------------------------------------------
   Fraction Parsing
-------------------------------------------------- */

function parseFraction(value) {
  if (!String(value).includes("/")) {
    return {
      numerator: Number(value),
      denominator: 1,
    };
  }

  const [numerator, denominator] = String(value).split("/").map(Number);

  return simplifyFraction(numerator, denominator);
}

/* --------------------------------------------------
   Shuffle
-------------------------------------------------- */

function shuffle(values) {
  const result = [...values];

  for (let index = result.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));

    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }

  return result;
}

/* --------------------------------------------------
   Question Generators
-------------------------------------------------- */

const TEMPLATE_GENERATORS = {
  simplify: generateSimplifyQuestion,
  equivalent: generateEquivalentQuestion,
  compare: generateCompareQuestion,
  "add-subtract-same": generateSameDenominatorQuestion,
  "add-subtract-different": generateDifferentDenominatorQuestion,
  multiply: generateMultiplyQuestion,
  divide: generateDivideQuestion,
  mixed: generateMixedQuestion,
};

/* --------------------------------------------------
   Generate Fraction Question
-------------------------------------------------- */

export function generateFractionQuestion({ level, config }) {
  if (!config) {
    throw new Error(`Fractions configuration is missing for level ${level}.`);
  }

  const generator = TEMPLATE_GENERATORS[config.template];

  if (!generator) {
    throw new Error(`Unknown fraction template "${config.template}" for level ${level}.`);
  }

  const generated = generator();

  return {
    id: `fractions_${level}_${generated.question}_${generated.answer}`,
    operation: "fractions",
    level,
    numbers: generated.numbers,
    operators: generated.operators,
    question: generated.question,
    answer: generated.answer,
    options: generated.options,
  };
}
