// src/lib/stats/targetedAllocation.js

/* --------------------------------------------------
   Allocation Configuration
-------------------------------------------------- */

const PRIORITY_WEIGHTS = {
  1: 4,
  2: 3,
  3: 2,
};

const EVIDENCE_WEIGHT = 0.1;

/* --------------------------------------------------
   Calculate Pattern Weight
-------------------------------------------------- */

function calculatePatternWeight(pattern) {
  const priorityWeight = PRIORITY_WEIGHTS[pattern.priority] ?? 0;

  const incorrectWeight = Number(pattern.incorrectRate) || 0;

  const slowWeight = Number(pattern.slowCorrectRate) || 0;

  const evidenceWeight = Math.log10(Math.max(Number(pattern.occurrences) || 0, 1)) * EVIDENCE_WEIGHT;

  return priorityWeight + incorrectWeight + slowWeight + evidenceWeight;
}

/* --------------------------------------------------
   Allocate Targeted Questions
-------------------------------------------------- */

export function allocateTargetedQuestions(patterns, totalQuestions = 20) {
  if (!Array.isArray(patterns) || patterns.length === 0 || totalQuestions <= 0) {
    return [];
  }

  /* ------------------------------------------------
     Limit Patterns

     Every selected pattern needs at least one
     question, so we cannot have more patterns
     than available questions.
  ------------------------------------------------ */

  const selectedPatterns = patterns.slice(0, totalQuestions);

  /* ------------------------------------------------
     Give Every Pattern One Question
  ------------------------------------------------ */

  const minimumQuestions = selectedPatterns.length;

  const remainingQuestions = totalQuestions - minimumQuestions;

  /* ------------------------------------------------
     Calculate Weights
  ------------------------------------------------ */

  const weightedPatterns = selectedPatterns.map((pattern) => ({
    ...pattern,
    weight: calculatePatternWeight(pattern),
  }));

  const totalWeight = weightedPatterns.reduce((sum, pattern) => sum + pattern.weight, 0);

  /* ------------------------------------------------
     Initial Allocation
  ------------------------------------------------ */

  const allocations = weightedPatterns.map((pattern) => {
    const exactAdditional = totalWeight > 0 ? (pattern.weight / totalWeight) * remainingQuestions : 0;

    return {
      ...pattern,
      questionCount: 1 + Math.floor(exactAdditional),
      remainder: exactAdditional - Math.floor(exactAdditional),
    };
  });

  /* ------------------------------------------------
     Calculate Remaining Slots
  ------------------------------------------------ */

  let allocated = allocations.reduce((sum, pattern) => sum + pattern.questionCount, 0);

  /* ------------------------------------------------
     Distribute Remaining Slots

     Largest fractional remainders receive the
     remaining questions first.
  ------------------------------------------------ */

  const remainderOrder = [...allocations].sort((a, b) => b.remainder - a.remainder);

  let index = 0;

  while (allocated < totalQuestions) {
    remainderOrder[index].questionCount += 1;

    allocated += 1;
    index += 1;

    if (index >= remainderOrder.length) {
      index = 0;
    }
  }

  /* ------------------------------------------------
     Return Clean Allocation
  ------------------------------------------------ */

  return allocations.map(({ weight, remainder, ...pattern }) => pattern);
}
