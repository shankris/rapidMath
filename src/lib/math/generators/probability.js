// src/lib/math/generators/probability.js

/* --------------------------------------------------
   Utility Functions
-------------------------------------------------- */

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* --------------------------------------------------
   Greatest Common Divisor
-------------------------------------------------- */

function gcd(a, b) {
  while (b !== 0) {
    const remainder = a % b;
    a = b;
    b = remainder;
  }

  return Math.abs(a);
}

/* --------------------------------------------------
   Fraction Simplification
-------------------------------------------------- */

function simplifyFraction(numerator, denominator) {
  const divisor = gcd(numerator, denominator);

  return {
    numerator: numerator / divisor,
    denominator: denominator / divisor,
  };
}

/* --------------------------------------------------
   Fraction Formatting
-------------------------------------------------- */

function formatFraction(numerator, denominator) {
  if (numerator === 0) {
    return "0";
  }

  if (numerator === denominator) {
    return "1";
  }

  return `${numerator}/${denominator}`;
}

/* --------------------------------------------------
   Question ID
-------------------------------------------------- */

function createQuestionId() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
}

/* --------------------------------------------------
   Probability Options
-------------------------------------------------- */

function generateOptions(answer) {
  const options = new Set([answer]);

  const [numerator, denominator] = answer.includes("/") ? answer.split("/").map(Number) : [Number(answer), 1];

  const candidates = [
    [numerator + 1, denominator],
    [Math.max(1, numerator - 1), denominator],
    [numerator, denominator + 1],
    [numerator, Math.max(numerator + 1, denominator - 1)],
    [denominator - numerator, denominator],
    [numerator, denominator + 2],
  ];

  for (const [candidateNumerator, candidateDenominator] of candidates) {
    if (candidateNumerator <= 0 || candidateDenominator <= 0 || candidateNumerator > candidateDenominator) {
      continue;
    }

    const simplified = simplifyFraction(candidateNumerator, candidateDenominator);

    const option = formatFraction(simplified.numerator, simplified.denominator);

    if (option !== answer) {
      options.add(option);
    }

    if (options.size === 4) {
      break;
    }
  }

  /*
    The answer space is small at Level 1, so ensure that
    four distinct probability options are always available.
  */
  let denominatorCandidate = Math.max(2, denominator + 1);

  while (options.size < 4) {
    const candidate = formatFraction(1, denominatorCandidate);

    if (candidate !== answer) {
      options.add(candidate);
    }

    denominatorCandidate++;
  }

  return Array.from(options).sort(() => Math.random() - 0.5);
}

/* --------------------------------------------------
   Basic Probability Question
-------------------------------------------------- */

function generateBasicProbability(config) {
  const totalOutcomes = randomInt(config.outcomes.min, config.outcomes.max);

  const favorableOutcomes = randomInt(1, totalOutcomes - 1);

  const simplified = simplifyFraction(favorableOutcomes, totalOutcomes);

  const answer = formatFraction(simplified.numerator, simplified.denominator);

  return {
    question: `A fair spinner has ${totalOutcomes} equally likely sections. ${favorableOutcomes} are red. What is P(red)?`,
    answer,
    numbers: [favorableOutcomes, totalOutcomes],
    operators: ["/"],
    template: "probability-basic",
  };
}

/* --------------------------------------------------
   Fraction Probability Question
-------------------------------------------------- */

function generateFractionProbability(config) {
  let totalOutcomes;
  let favorableOutcomes;
  let simplified;

  do {
    totalOutcomes = randomInt(config.totalOutcomes.min, config.totalOutcomes.max);

    favorableOutcomes = randomInt(config.favorableOutcomes.min, Math.min(config.favorableOutcomes.max, totalOutcomes - 1));

    simplified = simplifyFraction(favorableOutcomes, totalOutcomes);
  } while (simplified.numerator === favorableOutcomes && simplified.denominator === totalOutcomes);

  const answer = formatFraction(simplified.numerator, simplified.denominator);

  return {
    question: `${favorableOutcomes} out of ${totalOutcomes} equally likely outcomes are favorable. What is the probability?`,
    answer,
    numbers: [favorableOutcomes, totalOutcomes],
    operators: ["/"],
    template: "probability-fractions",
  };
}

/* --------------------------------------------------
   Dice Probability
-------------------------------------------------- */

function generateDiceProbability(config) {
  const sides = config.dice.sides;

  const templates = [
    {
      question: `A fair ${sides}-sided die is rolled. What is the probability of rolling an even number?`,
      favorable: sides / 2,
      total: sides,
    },
    {
      question: `A fair ${sides}-sided die is rolled. What is the probability of rolling a number greater than 4?`,
      favorable: sides - 4,
      total: sides,
    },
    {
      question: `A fair ${sides}-sided die is rolled. What is the probability of rolling an odd number?`,
      favorable: Math.ceil(sides / 2),
      total: sides,
    },
    {
      question: `A fair ${sides}-sided die is rolled. What is the probability of rolling a number less than 3?`,
      favorable: 2,
      total: sides,
    },
  ];

  const selected = templates[randomInt(0, templates.length - 1)];

  const simplified = simplifyFraction(selected.favorable, selected.total);

  const answer = formatFraction(simplified.numerator, simplified.denominator);

  return {
    question: selected.question,
    answer,
    numbers: [selected.favorable, selected.total],
    operators: ["/"],
    template: "probability-dice",
  };
}

/* --------------------------------------------------
   Card Probability
-------------------------------------------------- */

function generateCardProbability(config) {
  const deckSize = config.cards.deckSize;

  const templates = [
    {
      question: "A card is drawn from a standard 52-card deck. What is the probability of drawing an ace?",
      favorable: 4,
    },
    {
      question: "A card is drawn from a standard 52-card deck. What is the probability of drawing a heart?",
      favorable: 13,
    },
    {
      question: "A card is drawn from a standard 52-card deck. What is the probability of drawing a red card?",
      favorable: 26,
    },
    {
      question: "A card is drawn from a standard 52-card deck. What is the probability of drawing a face card?",
      favorable: 12,
    },
  ];

  const selected = templates[randomInt(0, templates.length - 1)];

  const simplified = simplifyFraction(selected.favorable, deckSize);

  const answer = formatFraction(simplified.numerator, simplified.denominator);

  return {
    question: selected.question,
    answer,
    numbers: [selected.favorable, deckSize],
    operators: ["/"],
    template: "probability-cards",
  };
}

/* --------------------------------------------------
   Object Probability
-------------------------------------------------- */

function generateObjectProbability(config) {
  const total = randomInt(config.objects.totalMin, config.objects.totalMax);

  const favorable = randomInt(config.objects.favorableMin, Math.min(config.objects.favorableMax, total - 1));

  const colors = ["red", "blue", "green", "yellow"];

  const color = colors[randomInt(0, colors.length - 1)];

  const simplified = simplifyFraction(favorable, total);

  const answer = formatFraction(simplified.numerator, simplified.denominator);

  return {
    question: `A bag contains ${total} objects. ${favorable} are ${color}. One object is chosen at random. What is the probability of choosing a ${color} object?`,
    answer,
    numbers: [favorable, total],
    operators: ["/"],
    template: "probability-objects",
  };
}

/* --------------------------------------------------
   Level 3 Question Selection
-------------------------------------------------- */

function generateDiceCardsObjects(config) {
  const templates = ["dice", "cards", "objects"];

  const template = templates[randomInt(0, templates.length - 1)];

  switch (template) {
    case "dice":
      return generateDiceProbability(config);

    case "cards":
      return generateCardProbability(config);

    case "objects":
      return generateObjectProbability(config);

    default:
      return generateDiceProbability(config);
  }
}

/* --------------------------------------------------
   Complementary Probability
-------------------------------------------------- */

function generateComplementProbability(config) {
  const totalOutcomes = randomInt(config.totalOutcomes.min, config.totalOutcomes.max);

  const favorableOutcomes = randomInt(config.favorableOutcomes.min, Math.min(config.favorableOutcomes.max, totalOutcomes - 1));

  const unfavorableOutcomes = totalOutcomes - favorableOutcomes;

  const contexts = [
    {
      question: `A bag contains ${totalOutcomes} objects. ${favorableOutcomes} are red. What is the probability of not choosing a red object?`,
    },
    {
      question: `A spinner has ${totalOutcomes} equal sections. ${favorableOutcomes} are blue. What is the probability of not landing on blue?`,
    },
    {
      question: `There are ${totalOutcomes} equally likely outcomes. ${favorableOutcomes} are favorable to event A. What is P(not A)?`,
    },
  ];

  const selected = contexts[randomInt(0, contexts.length - 1)];

  const simplified = simplifyFraction(unfavorableOutcomes, totalOutcomes);

  const answer = formatFraction(simplified.numerator, simplified.denominator);

  return {
    question: selected.question,
    answer,
    numbers: [favorableOutcomes, totalOutcomes],
    operators: ["−", "/"],
    template: "probability-complement",
  };
}

/* --------------------------------------------------
   Two-Step Probability
-------------------------------------------------- */

function generateTwoStepProbability(config) {
  const templates = [
    {
      question: "A fair coin is flipped twice. What is the probability of getting two heads?",
      favorable: 1,
      total: 4,
    },
    {
      question: "A fair coin is flipped twice. What is the probability of getting two tails?",
      favorable: 1,
      total: 4,
    },
    {
      question: "A fair die is rolled twice. What is the probability of rolling two 6s?",
      favorable: 1,
      total: 36,
    },
    {
      question: "A fair die is rolled twice. What is the probability of rolling an even number both times?",
      favorable: 9,
      total: 36,
    },
  ];

  const selected = templates[randomInt(0, templates.length - 1)];

  const simplified = simplifyFraction(selected.favorable, selected.total);

  const answer = formatFraction(simplified.numerator, simplified.denominator);

  return {
    question: selected.question,
    answer,
    numbers: [selected.favorable, selected.total],
    operators: ["/"],
    template: "probability-two-step",
  };
}

/* --------------------------------------------------
   Independent Events
-------------------------------------------------- */

function generateIndependentEvents(config) {
  const templates = [
    {
      question: "A bag has 3 red and 2 blue balls. A fair coin is flipped. What is P(red and heads)?",
      firstNumerator: 3,
      firstDenominator: 5,
      secondNumerator: 1,
      secondDenominator: 2,
    },
    {
      question: "A bag has 2 red and 4 blue balls. A fair die is rolled. What is P(red and rolling a 6)?",
      firstNumerator: 2,
      firstDenominator: 6,
      secondNumerator: 1,
      secondDenominator: 6,
    },
    {
      question: "A spinner has 3 red and 2 blue sections. A fair coin is flipped. What is P(blue and tails)?",
      firstNumerator: 2,
      firstDenominator: 5,
      secondNumerator: 1,
      secondDenominator: 2,
    },
    {
      question: "A fair die is rolled and a fair coin is flipped. What is P(even and heads)?",
      firstNumerator: 3,
      firstDenominator: 6,
      secondNumerator: 1,
      secondDenominator: 2,
    },
  ];

  const selected = templates[randomInt(0, templates.length - 1)];

  const numerator = selected.firstNumerator * selected.secondNumerator;

  const denominator = selected.firstDenominator * selected.secondDenominator;

  const simplified = simplifyFraction(numerator, denominator);

  const answer = formatFraction(simplified.numerator, simplified.denominator);

  return {
    question: selected.question,
    answer,
    numbers: [selected.firstNumerator, selected.firstDenominator, selected.secondNumerator, selected.secondDenominator],
    operators: ["×"],
    template: "probability-independent-events",
  };
}

/* --------------------------------------------------
   Conditional Probability
-------------------------------------------------- */

function generateConditionalProbability(config) {
  const templates = [
    {
      question: "A group has 10 students. 6 are girls, and 3 of the girls wear glasses. Given that a student is a girl, what is the probability they wear glasses?",
      favorable: 3,
      total: 6,
    },
    {
      question: "A bag has 12 balls. 7 are red, and 3 of the red balls are large. Given that a ball is red, what is the probability it is large?",
      favorable: 3,
      total: 7,
    },
    {
      question: "A class has 15 students. 9 play football, and 4 of those students also play tennis. Given that a student plays football, what is the probability they also play tennis?",
      favorable: 4,
      total: 9,
    },
    {
      question: "A box contains 14 cards. 8 are blue, and 5 of the blue cards have a star. Given that a card is blue, what is the probability it has a star?",
      favorable: 5,
      total: 8,
    },
  ];

  const selected = templates[randomInt(0, templates.length - 1)];

  const simplified = simplifyFraction(selected.favorable, selected.total);

  const answer = formatFraction(simplified.numerator, simplified.denominator);

  return {
    question: selected.question,
    answer,
    numbers: [selected.favorable, selected.total],
    operators: ["/"],
    template: "probability-conditional",
  };
}

/* --------------------------------------------------
   Advanced Mixed Probability
-------------------------------------------------- */

function generateMixedProbability(config) {
  const templates = [
    {
      question: "A fair die is rolled twice. What is the probability of getting at least one 6?",
      numerator: 11,
      denominator: 36,
      numbers: [6, 36],
      operators: ["−", "×"],
    },
    {
      question: "A fair coin is flipped three times. What is the probability of getting exactly two heads?",
      numerator: 3,
      denominator: 8,
      numbers: [3, 8],
      operators: ["/"],
    },
    {
      question: "A bag contains 5 red and 7 blue balls. Two balls are chosen with replacement. What is the probability both are red?",
      numerator: 25,
      denominator: 144,
      numbers: [5, 7, 12],
      operators: ["×"],
    },
    {
      question: "A standard deck has 52 cards. What is the probability of drawing a card that is not a heart?",
      numerator: 39,
      denominator: 52,
      numbers: [39, 52],
      operators: ["−", "/"],
    },
    {
      question: "A class has 12 students. 7 play football, and 3 of those also play tennis. Given that a student plays football, what is the probability they also play tennis?",
      numerator: 3,
      denominator: 7,
      numbers: [3, 7],
      operators: ["/"],
    },
    {
      question: "A fair die is rolled. What is the probability of rolling an even number or a 5?",
      numerator: 4,
      denominator: 6,
      numbers: [4, 6],
      operators: ["+", "/"],
    },
  ];

  const selected = templates[randomInt(0, templates.length - 1)];

  const simplified = simplifyFraction(selected.numerator, selected.denominator);

  const answer = formatFraction(simplified.numerator, simplified.denominator);

  return {
    question: selected.question,
    answer,
    numbers: selected.numbers,
    operators: selected.operators,
    template: "probability-mixed",
  };
}

/* --------------------------------------------------
   Question Template Selection
-------------------------------------------------- */

function generateQuestionTemplate(level, config) {
  switch (level) {
    case 1:
      return generateBasicProbability(config);

    case 2:
      return generateFractionProbability(config);

    case 3:
      return generateDiceCardsObjects(config);

    case 4:
      return generateComplementProbability(config);

    case 5:
      return generateTwoStepProbability(config);

    case 6:
      return generateIndependentEvents(config);

    case 7:
      return generateConditionalProbability(config);

    case 8:
      return generateMixedProbability(config);

    default:
      throw new Error(`Probability level ${level} is not implemented yet.`);
  }
}

/* --------------------------------------------------
   Public Question Generator
-------------------------------------------------- */

export function generateProbabilityQuestion({ level, config }) {
  if (!config) {
    throw new Error(`Probability configuration is missing for level ${level}.`);
  }

  const generated = generateQuestionTemplate(level, config);

  return {
    id: createQuestionId(),
    operation: "probability",
    level,
    numbers: generated.numbers,
    operators: generated.operators,
    template: generated.template,
    symbol: "",
    question: generated.question,
    answer: generated.answer,
    options: generateOptions(generated.answer),
  };
}
