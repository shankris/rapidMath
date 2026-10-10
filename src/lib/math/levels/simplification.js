/* src/lib/math/levels/simplification.js */

/* --------------------------------------------------
   Simplification Level Configuration
-------------------------------------------------- */

export const SIMPLIFICATION_LEVELS = {
  1: {
    patterns: ["squareRootUnknown", "factorCancellation", "simpleUnknown"],

    minFactor: 2,
    maxFactor: 12,

    minUnknown: 2,
    maxUnknown: 20,
  },
};
