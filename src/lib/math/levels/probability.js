// src/lib/math/levels/probability.js

/* --------------------------------------------------
   Probability Levels
-------------------------------------------------- */

export const PROBABILITY_LEVELS = {
  1: {
    template: "basic",
    difficulty: "easy",

    /* Simple single-event probability */
    outcomes: {
      min: 2,
      max: 6,
    },
  },

  2: {
    template: "fractions",
    difficulty: "easy",

    totalOutcomes: {
      min: 4,
      max: 12,
    },

    favorableOutcomes: {
      min: 1,
      max: 8,
    },
  },

  3: {
    template: "dice-cards-objects",
    difficulty: "moderate",

    /* Familiar real-world probability spaces */
    dice: {
      sides: 6,
    },

    cards: {
      deckSize: 52,
    },

    objects: {
      totalMin: 5,
      totalMax: 12,
      favorableMin: 1,
      favorableMax: 6,
    },
  },

  4: {
    template: "complement",
    difficulty: "moderate",

    /* P(not A) = 1 - P(A) */
    totalOutcomes: {
      min: 4,
      max: 12,
    },

    favorableOutcomes: {
      min: 1,
      max: 8,
    },
  },

  5: {
    template: "two-step",
    difficulty: "challenging",

    /* Two events such as two coin tosses or two dice */
    coin: {
      sides: 2,
    },

    dice: {
      sides: 6,
    },

    repetitions: {
      min: 2,
      max: 2,
    },
  },

  6: {
    template: "independent-events",
    difficulty: "challenging",

    /* P(A and B) = P(A) × P(B) */
    firstEvent: {
      totalMin: 2,
      totalMax: 6,
      favorableMin: 1,
      favorableMax: 4,
    },

    secondEvent: {
      totalMin: 2,
      totalMax: 6,
      favorableMin: 1,
      favorableMax: 4,
    },
  },

  7: {
    template: "conditional",
    difficulty: "hard",

    /* Probability given that another event occurred */
    population: {
      min: 6,
      max: 15,
    },

    condition: {
      min: 2,
      max: 10,
    },

    favorable: {
      min: 1,
      max: 8,
    },
  },

  8: {
    template: "mixed",
    difficulty: "advanced",

    /* Combination of previously introduced probability concepts */
    totalOutcomes: {
      min: 4,
      max: 20,
    },

    favorableOutcomes: {
      min: 1,
      max: 12,
    },

    repetitions: {
      min: 2,
      max: 3,
    },
  },
};
