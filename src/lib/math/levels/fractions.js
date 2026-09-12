// src/lib/math/levels/fractions.js

/* --------------------------------------------------
   Fraction Level Configuration
-------------------------------------------------- */

export const FRACTIONS_LEVELS = {
  /* ------------------------------------------------
     Level 1 — Simplify
  ------------------------------------------------ */

  1: {
    template: "simplify",
    numerator: { min: 1, max: 6 },
    denominator: { min: 2, max: 8 },
    multiplier: { min: 2, max: 4 },
  },

  /* ------------------------------------------------
     Level 2 — Equivalent Fractions
  ------------------------------------------------ */

  2: {
    template: "equivalent",
    numerator: { min: 1, max: 8 },
    denominator: { min: 3, max: 10 },
    multiplier: { min: 2, max: 4 },
  },

  /* ------------------------------------------------
     Level 3 — Compare
  ------------------------------------------------ */

  3: {
    template: "compare",
    denominator: { min: 3, max: 12 },
    numerator: { min: 1, max: 11 },
    equalProbability: 0.25,
  },

  /* ------------------------------------------------
     Level 4 — Add / Subtract Same Denominator
  ------------------------------------------------ */

  4: {
    template: "add-subtract-same",
    denominator: { min: 4, max: 12 },
    numerator: { min: 1, max: 11 },
  },

  /* ------------------------------------------------
     Level 5 — Add / Subtract Different Denominators
  ------------------------------------------------ */

  5: {
    template: "add-subtract-different",
    denominator: { min: 3, max: 10 },
    numerator: { min: 1, max: 9 },
  },

  /* ------------------------------------------------
     Level 6 — Multiply
  ------------------------------------------------ */

  6: {
    template: "multiply",
    denominator: { min: 3, max: 12 },
    numerator: { min: 1, max: 11 },
  },

  /* ------------------------------------------------
     Level 7 — Divide
  ------------------------------------------------ */

  7: {
    template: "divide",
    denominator: { min: 3, max: 12 },
    numerator: { min: 1, max: 11 },
  },

  /* ------------------------------------------------
     Level 8 — Mixed
  ------------------------------------------------ */

  8: {
    template: "mixed",
    denominator: { min: 2, max: 8 },
    numerator: { min: 1, max: 7 },
  },
};
