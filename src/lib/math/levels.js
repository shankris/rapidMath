// src/lib/math/levels.js

import { ADDITION_LEVELS } from "./levels/addition";
import { SUBTRACTION_LEVELS } from "./levels/subtraction";
import { MULTIPLICATION_LEVELS } from "./levels/multiplication";
import { DIVISION_LEVELS } from "./levels/division";
import { MIXED_OPERATIONS_LEVELS } from "./levels/mixedOperations";
import { MISSING_NUMBER_LEVELS } from "./levels/missingNumber";
import { COMPARISON_LEVELS } from "./levels/comparison";
import { ESTIMATION_LEVELS } from "./levels/estimation";
import { SEQUENCES_LEVELS } from "./levels/sequences";
import { FRACTIONS_LEVELS } from "./levels/fractions";
import { PERCENTAGES_LEVELS } from "./levels/percentages";
import { POWERS_ROOTS_LEVELS } from "./levels/powersRoots";
import { COMBINATIONS_LEVELS } from "./levels/combinations";
import { PROBABILITY_LEVELS } from "./levels/probability";

/* --------------------------------------------------
   Level Metadata
-------------------------------------------------- */

const LEVEL_METADATA = {
  1: {
    title: "Single Digits",
    description: "Practice basic arithmetic with single digit numbers.",
    details: {
      add: "Add numbers up to 18",
      sub: "Subtract numbers up to 9",
      mul: "Multiply numbers up to 25",
      div: "Divide numbers up to 5",
      estimation: "Estimate easy additions",
      fractions: "Simplify fractions",
      percentages: "Find percentages of numbers",
      powersRoots: "Calculate squares and cubes",
      combinations: "Calculate factorials and factorial expressions",
      probability: "Calculate basic probabilities",
    },
  },

  2: {
    title: "Single + Double Digit",
    description: "Combine single digit numbers with larger values.",
    details: {
      add: "Add numbers up to 60",
      sub: "Subtract numbers up to 29",
      mul: "Multiply numbers up to 49",
      div: "Divide numbers up to 10",
      estimation: "Estimate larger additions",
      fractions: "Find equivalent fractions",
      percentages: "Find common percentages of larger numbers",
      powersRoots: "Calculate square roots and cube roots",
      combinations: "Solve basic permutation problems",
      probability: "Express probability as simplified fractions",
    },
  },

  3: {
    title: "Double Digit Basics",
    description: "Practice working with two digit numbers.",
    details: {
      add: "Add numbers up to 120",
      sub: "Subtract numbers up to 50",
      mul: "Multiply numbers up to 81",
      div: "Divide numbers up to 12",
      estimation: "Estimate easy subtractions",
      fractions: "Compare two fractions",
      percentages: "Calculate percentage increases",
      powersRoots: "Solve mixed powers and roots",
      combinations: "Solve advanced permutation problems",
      probability: "Solve probability problems with dice, cards, and objects",
    },
  },

  4: {
    title: "Three + Two Digit",
    description: "Subtract a two digit number from a three digit number.",
    details: {
      add: "Add numbers up to 200",
      sub: "Subtract numbers up to 190",
      mul: "Multiply numbers up to 144",
      div: "Divide numbers up to 20",
      estimation: "Estimate larger subtractions",
      fractions: "Add and subtract with common denominators",
      percentages: "Calculate percentage decreases",
      powersRoots: "Solve advanced powers and roots",
      combinations: "Solve basic combination problems",
      probability: "Use complementary probability",
    },
  },

  5: {
    title: "Three Digit Subtraction",
    description: "Practice subtracting three digit numbers.",
    details: {
      add: "Add numbers up to 300",
      sub: "Subtract numbers up to 490",
      mul: "Multiply numbers up to 270",
      div: "Divide numbers up to 20",
      estimation: "Estimate easy multiplications",
      fractions: "Add and subtract with different denominators",
      percentages: "Find the original amount",
      combinations: "Solve advanced combination problems",
      probability: "Solve two-step probability problems",
    },
  },

  6: {
    title: "One Digit Mixed",
    description: "Combine addition and subtraction with three single digit numbers.",
    details: {
      add: "Add three numbers up to 27",
      sub: "Add and subtract single digit numbers",
      mul: "Multiply numbers up to 600",
      div: "Divide numbers up to 30",
      estimation: "Estimate larger multiplications",
      fractions: "Multiply and simplify fractions",
      percentages: "Find what percentage one number is of another",
      combinations: "Solve mixed permutation and combination problems",
      probability: "Calculate probabilities of independent events",
    },
  },

  7: {
    title: "Two + One − One",
    description: "Combine a two digit number with two single digit operations.",
    details: {
      add: "Add three numbers up to 60",
      sub: "Add and subtract numbers up to 68",
      mul: "Multiply numbers up to 1,000",
      div: "Divide numbers up to 30",
      estimation: "Estimate mixed operations",
      fractions: "Divide and simplify fractions",
      percentages: "Solve multi-step percentage problems",
      combinations: "Solve advanced counting problems",
      probability: "Solve conditional probability problems",
    },
  },

  8: {
    title: "Two + Two − One",
    description: "Combine two two digit numbers with a single digit subtraction.",
    details: {
      add: "Add three numbers up to 100",
      sub: "Add and subtract numbers up to 158",
      mul: "Multiply numbers up to 2,970",
      div: "Divide numbers up to 50",
      estimation: "Estimate challenging expressions",
      fractions: "Solve mixed fraction expressions",
      percentages: "Solve mixed percentage problems",
      probability: "Solve advanced mixed probability problems",
    },
  },

  9: {
    title: "Two + Two − Two",
    description: "Combine three two digit numbers using addition and subtraction.",
    details: {
      add: "Add three numbers up to 150",
      sub: "Add and subtract numbers up to 170",
      mul: "Multiply numbers up to 9,801",
      div: "Divide numbers up to 100",
    },
  },

  10: {
    title: "Three + Two − Two",
    description: "Combine a three digit number with two two digit operations.",
    details: {
      add: "Add three numbers up to 300",
      sub: "Add and subtract numbers up to 589",
      mul: "Multiply numbers up to 97,902",
      div: "Divide numbers up to 200",
    },
  },

  11: {
    title: "Three + Three − Two",
    description: "Combine two three digit numbers with a two digit subtraction.",
    details: {
      add: "Add three numbers up to 1,500",
      sub: "Add and subtract numbers up to 1,889",
      mul: "Advanced multiplication",
      div: "Advanced division",
    },
  },

  12: {
    title: "Four + Three − Three",
    description: "Combine four, three and three digit numbers with frequent borrowing.",
    details: {
      add: "Add three numbers up to 2,000",
      sub: "Add and subtract numbers up to 10,898",
      mul: "Advanced multiplication",
      div: "Advanced division",
    },
  },
};

/* --------------------------------------------------
   Build Level Configuration
-------------------------------------------------- */

export const LEVEL_CONFIG = Object.fromEntries(
  Object.keys(LEVEL_METADATA).map((level) => [
    level,
    {
      ...LEVEL_METADATA[level],

      addition: ADDITION_LEVELS[level],
      subtraction: SUBTRACTION_LEVELS[level],
      multiplication: MULTIPLICATION_LEVELS[level],
      division: DIVISION_LEVELS[level],
      mixedOperations: MIXED_OPERATIONS_LEVELS[level],
      missingNumber: MISSING_NUMBER_LEVELS[level],
      comparison: COMPARISON_LEVELS[level],
      estimation: ESTIMATION_LEVELS[level],
      sequences: SEQUENCES_LEVELS[level],
      fractions: FRACTIONS_LEVELS[level],
      percentages: PERCENTAGES_LEVELS[level],
      powersRoots: POWERS_ROOTS_LEVELS[level],
      combinations: COMBINATIONS_LEVELS[level],
      probability: PROBABILITY_LEVELS[level],
    },
  ]),
);
