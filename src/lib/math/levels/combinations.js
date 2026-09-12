// src/lib/math/levels/Combinations.js

/* --------------------------------------------------
   Factorials, Permutations & Combinations
   Level Configuration
-------------------------------------------------- */

export const COMBINATIONS_LEVELS = {
  /* --------------------------------------------------
     Level 1 — Factorials & factorial operations
  -------------------------------------------------- */

  1: {
    template: "factorials",
    difficulty: "easy",

    factorial: {
      min: 2,
      max: 9,
    },

    operations: ["direct", "addition", "multiplication", "division"],
  },

  /* --------------------------------------------------
     Level 2 — Basic permutations
     Includes Level 1 factorial material
  -------------------------------------------------- */

  2: {
    template: "permutations-basic",
    difficulty: "moderate",

    factorial: {
      min: 2,
      max: 9,
    },

    permutation: {
      nMin: 3,
      nMax: 8,
      rMin: 2,
      rMax: 4,
    },

    includeFactorials: true,
    factorialWeight: 30,
    permutationWeight: 70,
  },

  /* --------------------------------------------------
     Level 3 — Advanced permutations
     Includes earlier factorial and basic permutation
     material
  -------------------------------------------------- */

  3: {
    template: "permutations-advanced",
    difficulty: "challenging",

    factorial: {
      min: 2,
      max: 9,
    },

    permutationBasic: {
      nMin: 3,
      nMax: 8,
      rMin: 2,
      rMax: 4,
    },

    permutation: {
      nMin: 5,
      nMax: 10,
      rMin: 2,
      rMax: 5,
    },

    includeFactorials: true,
    includeBasicPermutations: true,

    factorialWeight: 20,
    basicPermutationWeight: 30,
    advancedPermutationWeight: 50,
  },

  /* --------------------------------------------------
     Level 4 — Basic combinations
     Builds on factorials and permutations
  -------------------------------------------------- */

  4: {
    template: "combinations-basic",
    difficulty: "moderate",

    factorial: {
      min: 2,
      max: 9,
    },

    permutation: {
      nMin: 3,
      nMax: 8,
      rMin: 2,
      rMax: 4,
    },

    combination: {
      nMin: 4,
      nMax: 10,
      rMin: 2,
      rMax: 4,
    },

    includeFactorials: true,
    includePermutations: true,

    factorialWeight: 15,
    permutationWeight: 20,
    combinationWeight: 65,
  },

  /* --------------------------------------------------
     Level 5 — Advanced combinations
  -------------------------------------------------- */

  5: {
    template: "combinations-advanced",
    difficulty: "challenging",

    factorial: {
      min: 2,
      max: 10,
    },

    permutation: {
      nMin: 5,
      nMax: 10,
      rMin: 2,
      rMax: 5,
    },

    combination: {
      nMin: 5,
      nMax: 12,
      rMin: 2,
      rMax: 6,
    },

    includeFactorials: true,
    includePermutations: true,
    includeBasicCombinations: true,

    factorialWeight: 10,
    permutationWeight: 15,
    combinationWeight: 75,
  },

  /* --------------------------------------------------
     Level 6 — Mixed permutations & combinations
  -------------------------------------------------- */

  6: {
    template: "mixed",
    difficulty: "hard",

    factorial: {
      min: 2,
      max: 10,
    },

    permutation: {
      nMin: 5,
      nMax: 12,
      rMin: 2,
      rMax: 6,
    },

    combination: {
      nMin: 5,
      nMax: 14,
      rMin: 2,
      rMax: 7,
    },

    includeFactorials: true,
    includePermutations: true,
    includeCombinations: true,

    factorialWeight: 10,
    permutationWeight: 45,
    combinationWeight: 45,
  },

  /* --------------------------------------------------
     Level 7 — Advanced counting problems
  -------------------------------------------------- */

  7: {
    template: "advanced-counting",
    difficulty: "advanced",

    factorial: {
      min: 2,
      max: 10,
    },

    permutation: {
      nMin: 6,
      nMax: 12,
      rMin: 2,
      rMax: 6,
    },

    combination: {
      nMin: 6,
      nMax: 15,
      rMin: 2,
      rMax: 7,
    },

    includeFactorials: true,
    includePermutations: true,
    includeCombinations: true,

    permutationWeight: 40,
    combinationWeight: 40,
    countingWeight: 20,
  },
};
