// src/lib/math/generateQuestion.js

import { LEVEL_CONFIG } from "./levels";
import { OPERATIONS } from "./operations";

import { generateAdditionQuestion } from "./generators/addition";
import { generateSubtractionQuestion } from "./generators/subtraction";
import { generateMultiplicationQuestion } from "./generators/multiplication";
import { generateDivisionQuestion } from "./generators/division";
import { generateMixedOperationsQuestion } from "./generators/mixedOperations";

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
     Invalid Operation
  ------------------------------------------------ */

  throw new Error(`Invalid operation: ${operation}`);
}
