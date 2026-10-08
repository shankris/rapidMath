/* src/lib/config.js */

/* --------------------------------------------------
   Operation Configuration
-------------------------------------------------- */

export const OPERATIONS = {
  add: { maxLevel: 12 },
  sub: { maxLevel: 10 },
  mul: { maxLevel: 10 },
  div: { maxLevel: 10 },
  powersRoots: { maxLevel: 4 },
  mixedOperations: { maxLevel: 4 },
  missingNumber: { maxLevel: 4 },
  estimation: { maxLevel: 4 },
  probability: { maxLevel: 4 },
  combinations: { maxLevel: 4 },
  comparison: { maxLevel: 4 },
  percentages: { maxLevel: 8 },
  fractions: { maxLevel: 8 },
  sequences: { maxLevel: 10 },
};

/* --------------------------------------------------
   Quiz Configuration
-------------------------------------------------- */

export const QUIZ_CONFIG = {
  QUESTIONS_PER_TEST: 20,
  DEFAULT_SHOW_TIMER: true,
  DEFAULT_SHOW_HINTS: false,
  DEFAULT_KEYBOARD_SHORTCUTS: true,
};
