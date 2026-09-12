// src/lib/math/generateQuestion.js

import { LEVEL_CONFIG } from "./levels";
import { OPERATIONS } from "./operations";

import { generateAdditionQuestion } from "./generators/addition";
import { generateSubtractionQuestion } from "./generators/subtraction";
import { generateMultiplicationQuestion } from "./generators/multiplication";
import { generateDivisionQuestion } from "./generators/division";
import { generateMixedOperationsQuestion } from "./generators/mixedOperations";
import { generateMissingNumberQuestion } from "./generators/missingNumber";
import { generateComparisonQuestion } from "./generators/comparison";
import { generateEstimationQuestion } from "./generators/estimation";
import { generateSequenceQuestion } from "./generators/sequences";
import { generateFractionQuestion } from "./generators/fractions";
import { generatePercentageQuestion } from "./generators/percentages";
import { generatePowersRootsQuestion } from "./generators/powersRoots";
import { generateCombinationsQuestion } from "./generators/combinations";
import { generateProbabilityQuestion } from "./generators/probability";

/* --------------------------------------------------
   Generate Question
  -------------------------------------------------- */

export function generateQuestion(operation, level) {
  const config = LEVEL_CONFIG[level];

  if (!config) {
    throw new Error(`Invalid level: ${level}`);
  }

  /* ------------------------------------------------
     Addition
  ------------------------------------------------ */

  if (operation === "add") {
    return generateAdditionQuestion({
      level,
      config: config.addition,
      symbol: OPERATIONS.add.symbol,
    });
  }

  /* ------------------------------------------------
     Subtraction
  ------------------------------------------------ */

  if (operation === "sub") {
    const subtractionConfig = config.subtraction;

    if (!subtractionConfig) {
      throw new Error(`Subtraction configuration is missing for level ${level}.`);
    }

    return generateSubtractionQuestion({
      level,
      config: subtractionConfig,
      symbol: OPERATIONS.sub.symbol,
    });
  }

  /* ------------------------------------------------
     Multiplication
  ------------------------------------------------ */

  if (operation === "mul") {
    return generateMultiplicationQuestion({
      level,
      config: config.multiplication,
      symbol: OPERATIONS.mul.symbol,
    });
  }

  /* ------------------------------------------------
     Division
  ------------------------------------------------ */

  if (operation === "div") {
    return generateDivisionQuestion({
      level,
      config: config.division,
      symbol: OPERATIONS.div.symbol,
    });
  }

  /* ------------------------------------------------
     Mixed Operations
  ------------------------------------------------ */

  if (operation === "mixedOperations") {
    const mixedOperationsConfig = config.mixedOperations;

    if (!mixedOperationsConfig) {
      throw new Error(`Mixed Operations configuration is missing for level ${level}.`);
    }

    return generateMixedOperationsQuestion({
      level,
      config: mixedOperationsConfig,
    });
  }

  /* ------------------------------------------------
   Missing Number
  ------------------------------------------------ */

  if (operation === "missingNumber") {
    const missingNumberConfig = config.missingNumber;

    if (!missingNumberConfig) {
      throw new Error(`Missing Number configuration is missing for level ${level}.`);
    }

    return generateMissingNumberQuestion({
      level,
      config: missingNumberConfig,
    });
  }

  /* ------------------------------------------------
   Comparison
  ------------------------------------------------ */

  if (operation === "comparison") {
    const comparisonConfig = config.comparison;

    if (!comparisonConfig) {
      throw new Error(`Comparison configuration is missing for level ${level}.`);
    }

    return generateComparisonQuestion({
      level,
      config: comparisonConfig,
    });
  }

  /* ------------------------------------------------
   Estimation
  ------------------------------------------------ */

  if (operation === "estimation") {
    const estimationConfig = config.estimation;

    if (!estimationConfig) {
      throw new Error(`Estimation configuration is missing for level ${level}.`);
    }

    return generateEstimationQuestion({
      level,
      config: estimationConfig,
    });
  }

  /* ------------------------------------------------
   Sequences
  ------------------------------------------------ */

  if (operation === "sequences") {
    const sequencesConfig = config.sequences;

    if (!sequencesConfig) {
      throw new Error(`Sequences configuration is missing for level ${level}.`);
    }

    return generateSequenceQuestion({
      level,
      config: sequencesConfig,
    });
  }

  /* ------------------------------------------------
   Fractions
  ------------------------------------------------ */

  if (operation === "fractions") {
    const fractionsConfig = config.fractions;

    if (!fractionsConfig) {
      throw new Error(`Fractions configuration is missing for level ${level}.`);
    }

    return generateFractionQuestion({
      level,
      config: fractionsConfig,
    });
  }

  /* ------------------------------------------------
   Percentages
  ------------------------------------------------ */

  if (operation === "percentages") {
    const percentagesConfig = config.percentages;

    if (!percentagesConfig) {
      throw new Error(`Percentages configuration is missing for level ${level}.`);
    }

    return generatePercentageQuestion({
      level,
      config: percentagesConfig,
    });
  }

  /* ------------------------------------------------
   Power and Roots
  ------------------------------------------------ */

  if (operation === "powersRoots") {
    const powersRootsConfig = config.powersRoots;

    if (!powersRootsConfig) {
      throw new Error(`Powers & Roots configuration is missing for level ${level}.`);
    }

    return generatePowersRootsQuestion({
      level,
      config: powersRootsConfig,
    });
  }

  /* --------------------------------------------------
   Factorials, Permutations & Combinations
  -------------------------------------------------- */

  if (operation === "combinations") {
    const combinationsConfig = config.combinations;

    if (!combinationsConfig) {
      throw new Error(`Factorials, Permutations & Combinations configuration is missing for level ${level}.`);
    }

    return generateCombinationsQuestion({
      level,
      config: combinationsConfig,
    });
  }

  /* --------------------------------------------------
   Probability
  -------------------------------------------------- */

  if (operation === "probability") {
    const probabilityConfig = config.probability;

    if (!probabilityConfig) {
      throw new Error(`Probability configuration is missing for level ${level}.`);
    }

    return generateProbabilityQuestion({
      level,
      config: probabilityConfig,
    });
  }

  /* ------------------------------------------------
     Invalid Operation
  ------------------------------------------------ */

  throw new Error(`Invalid operation: ${operation}`);
}
