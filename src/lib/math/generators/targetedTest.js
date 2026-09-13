// src/lib/math/generators/targetedTest.js

import { ADDITION_LEVELS } from "../levels/addition";
import { generateTargetedAdditionQuestion } from "./targetedAddition";
import { getTargetedPatternScores } from "../../stats/targetedScoring";
import { selectTargetedPatterns } from "../../stats/targetedSelection";
import { allocateTargetedQuestions } from "../../stats/targetedAllocation";

/* --------------------------------------------------
   Generate Targeted Addition Test
-------------------------------------------------- */

export function generateTargetedAdditionTest(level, totalQuestions = 20) {
  const config = ADDITION_LEVELS[level];

  if (!config) {
    return [];
  }

  /* ------------------------------------------------
     Get Pattern Scores
  ------------------------------------------------ */

  const patternScores = getTargetedPatternScores("add", level);

  /* ------------------------------------------------
     Select Weak Patterns
  ------------------------------------------------ */

  const selectedPatterns = selectTargetedPatterns(patternScores.patterns);

  /* ------------------------------------------------
     Allocate Questions
  ------------------------------------------------ */

  const allocations = allocateTargetedQuestions(selectedPatterns, totalQuestions);

  /* ------------------------------------------------
     Generate Questions
  ------------------------------------------------ */

  const questions = [];

  allocations.forEach((allocation) => {
    for (let index = 0; index < allocation.questionCount; index++) {
      const question = generateTargetedAdditionQuestion({
        level,
        config,
        patternKey: allocation.key,
      });

      questions.push(question);
    }
  });

  return questions;
}
