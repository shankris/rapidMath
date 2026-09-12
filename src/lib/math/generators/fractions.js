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
   Fraction Operations
-------------------------------------------------- */

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
   Fraction Creation
-------------------------------------------------- */

function randomProperFraction(config) {
  const denominator = randomInt(config.denominator.min, config.denominator.max);

  const maxNumerator = Math.min(config.numerator.max, denominator - 1);

  const minNumerator = Math.min(config.numerator.min, maxNumerator);

  if (maxNumerator < 1 || minNumerator > maxNumerator) {
    throw new Error("Invalid fraction configuration: numerator range cannot create a proper fraction.");
  }

  const numerator = randomInt(Math.max(1, minNumerator), maxNumerator);

  return {
    numerator,
    denominator,
  };
}

/* --------------------------------------------------
   Generate Simplify Question
-------------------------------------------------- */

function generateSimplifyQuestion(config) {
  const base = randomProperFraction(config);

  const multiplier = randomInt(config.multiplier.min, config.multiplier.max);

  const fraction = {
    numerator: base.numerator * multiplier,
    denominator: base.denominator * multiplier,
  };

  const answer = simplifyFraction(fraction.numerator, fraction.denominator);

  const answerText = formatFraction(answer);

  return {
    numbers: [fraction.numerator, fraction.denominator],
    operators: [],
    question: `${fraction.numerator}/${fraction.denominator} = ?`,
    answer: answerText,
    options: generateFractionOptions(answerText),
  };
}

/* --------------------------------------------------
   Generate Equivalent Fraction Question
-------------------------------------------------- */

function generateEquivalentQuestion(config) {
  const denominator = randomInt(config.denominator.min, config.denominator.max);

  const maxNumerator = Math.min(config.numerator.max, denominator - 1);

  const numerator = randomInt(Math.max(1, config.numerator.min), maxNumerator);

  const multiplier = randomInt(config.multiplier.min, config.multiplier.max);

  const newDenominator = denominator * multiplier;
  const answer = numerator * multiplier;

  const distractors = new Set();

  for (const offset of [-2, -1, 1, 2, 3]) {
    const candidate = answer + offset;

    if (candidate > 0 && candidate !== answer) {
      distractors.add(candidate);
    }
  }

  const options = shuffle([...distractors]).slice(0, 3);

  let attempts = 0;
  const maxAttempts = 50;

  while (options.length < 3 && attempts < maxAttempts) {
    attempts++;

    const candidate = answer + randomInt(-6, 6);

    if (candidate > 0 && candidate !== answer && !options.includes(candidate)) {
      options.push(candidate);
    }
  }

  if (options.length < 3) {
    throw new Error("Unable to generate enough equivalent fraction answer options.");
  }

  return {
    numbers: [numerator, denominator, newDenominator],
    operators: ["="],
    question: `${numerator}/${denominator} = □/${newDenominator}`,
    answer,
    options: shuffle([answer, ...options]),
  };
}

/* --------------------------------------------------
   Generate Comparison Question
-------------------------------------------------- */

function generateCompareQuestion(config) {
  const shouldBeEqual = Math.random() < (config.equalProbability ?? 0.25);

  let left;
  let right;

  if (shouldBeEqual) {
    const base = randomProperFraction(config);

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
    let attempts = 0;
    const maxAttempts = 100;

    do {
      attempts++;

      left = randomProperFraction(config);
      right = randomProperFraction(config);

      if (compareFractions(left, right) !== "=") {
        break;
      }
    } while (attempts < maxAttempts);

    if (compareFractions(left, right) === "=") {
      throw new Error("Unable to generate two different fractions for comparison.");
    }
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

/* --------------------------------------------------
   Generate Same-Denominator Question
-------------------------------------------------- */

function generateSameDenominatorQuestion(config) {
  const denominator = randomInt(Math.max(3, config.denominator.min), config.denominator.max);

  const isAddition = Math.random() < 0.5;

  let numerator1;
  let numerator2;

  if (isAddition) {
    const maxNumerator1 = Math.min(config.numerator.max, denominator - 2);

    numerator1 = randomInt(Math.max(1, config.numerator.min), maxNumerator1);

    const maxNumerator2 = Math.min(config.numerator.max, denominator - numerator1 - 1);

    numerator2 = randomInt(1, maxNumerator2);
  } else {
    const maxNumerator1 = Math.min(config.numerator.max, denominator - 1);

    numerator1 = randomInt(Math.max(2, config.numerator.min), maxNumerator1);

    numerator2 = randomInt(1, Math.min(config.numerator.max, numerator1 - 1));
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

/* --------------------------------------------------
   Generate Different-Denominator Question
-------------------------------------------------- */

function generateDifferentDenominatorQuestion(config) {
  let left;
  let right;
  let answer;
  let operator;

  const maxAttempts = 100;

  for (let attempts = 0; attempts < maxAttempts; attempts++) {
    const denominator1 = randomInt(Math.max(3, config.denominator.min), config.denominator.max);

    let denominator2 = randomInt(Math.max(3, config.denominator.min), config.denominator.max);

    if (denominator1 === denominator2) {
      continue;
    }

    left = {
      numerator: randomInt(1, Math.min(config.numerator.max, denominator1 - 1)),
      denominator: denominator1,
    };

    right = {
      numerator: randomInt(1, Math.min(config.numerator.max, denominator2 - 1)),
      denominator: denominator2,
    };

    operator = Math.random() < 0.5 ? "+" : "−";

    answer = operator === "+" ? addFractions(left, right) : subtractFractions(left, right);

    if (answer.numerator > 0 && answer.denominator > 0 && answer.numerator < answer.denominator) {
      const answerText = formatFraction(answer);

      return {
        numbers: [left.numerator, left.denominator, right.numerator, right.denominator],
        operators: [operator],
        question: `${formatFraction(left)} ${operator} ${formatFraction(right)} = ?`,
        answer: answerText,
        options: generateFractionOptions(answerText),
      };
    }
  }

  throw new Error("Unable to generate a valid different-denominator fraction question.");
}

/* --------------------------------------------------
   Generate Multiplication Question
-------------------------------------------------- */

function generateMultiplyQuestion(config) {
  const maxAttempts = 100;

  for (let attempts = 0; attempts < maxAttempts; attempts++) {
    const left = randomProperFraction(config);
    const right = randomProperFraction(config);

    const answer = multiplyFractions(left, right);

    if (answer.denominator === 1) {
      continue;
    }

    const answerText = formatFraction(answer);

    return {
      numbers: [left.numerator, left.denominator, right.numerator, right.denominator],
      operators: ["×"],
      question: `${formatFraction(left)} × ${formatFraction(right)} = ?`,
      answer: answerText,
      options: generateFractionOptions(answerText),
    };
  }

  throw new Error("Unable to generate a valid multiplication fraction question.");
}

/* --------------------------------------------------
   Generate Division Question
-------------------------------------------------- */

function generateDivideQuestion(config) {
  const maxAttempts = 100;

  for (let attempts = 0; attempts < maxAttempts; attempts++) {
    const left = randomProperFraction(config);
    const right = randomProperFraction(config);

    const answer = divideFractions(left, right);

    if (answer.numerator <= 0) {
      continue;
    }

    const answerText = formatFraction(answer);

    return {
      numbers: [left.numerator, left.denominator, right.numerator, right.denominator],
      operators: ["÷"],
      question: `${formatFraction(left)} ÷ ${formatFraction(right)} = ?`,
      answer: answerText,
      options: generateFractionOptions(answerText),
    };
  }

  throw new Error("Unable to generate a valid division fraction question.");
}

/* --------------------------------------------------
   Generate Mixed Question
-------------------------------------------------- */

function generateMixedQuestion(config) {
  const maxAttempts = 100;

  for (let attempts = 0; attempts < maxAttempts; attempts++) {
    const first = randomProperFraction(config);
    const second = randomProperFraction(config);
    const third = randomProperFraction(config);

    const middleOperator = Math.random() < 0.5 ? "+" : "−";

    const multiplied = multiplyFractions(second, third);

    const answer = middleOperator === "+" ? addFractions(first, multiplied) : subtractFractions(first, multiplied);

    if (answer.numerator <= 0) {
      continue;
    }

    const answerText = formatFraction(answer);

    return {
      numbers: [first.numerator, first.denominator, second.numerator, second.denominator, third.numerator, third.denominator],
      operators: [middleOperator, "×"],
      question: `${formatFraction(first)} ${middleOperator} ${formatFraction(second)} × ${formatFraction(third)} = ?`,
      answer: answerText,
      options: generateFractionOptions(answerText),
    };
  }

  throw new Error("Unable to generate a valid mixed fraction question.");
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
    if (candidate.numerator <= 0 || candidate.denominator <= 0) {
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

  /* ------------------------------------------------
     Random Fallback Options

     The attempt limit prevents an exhausted
     candidate space from freezing the browser.
  ------------------------------------------------ */

  let attempts = 0;
  const maxAttempts = 100;

  while (options.length < 3 && attempts < maxAttempts) {
    attempts++;

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

  if (options.length < 3) {
    throw new Error("Unable to generate enough unique fraction answer options.");
  }

  return shuffle([answerText, ...options]);
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

  const generated = generator(config);

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
