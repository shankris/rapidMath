import { getSplitNumberHint } from "./splitNumber";
import { getNearMultipleHint } from "./nearMultiple";
import { getDoubleHalfHint } from "./doubleHalf";
import { getTimes25Hint } from "./times25";
import { getTimes10Hint } from "./times10";

// Future
// import { getTimes50Hint } from "./times50";
// import { getPowersOf10Hint } from "./powersOf10";
// import { getFactorPairHint } from "./factorPair";
// import { getRoundAdjustHint } from "./roundAdjust";
// import { getDistributiveHint } from "./distributive";

const STRATEGIES = [
  {
    minLevel: 3,
    fn: getTimes10Hint,
  },

  {
    minLevel: 3,
    fn: getSplitNumberHint,
  },
  {
    minLevel: 4,
    fn: getNearMultipleHint,
  },
  {
    minLevel: 4,
    fn: getDoubleHalfHint,
  },

  {
    minLevel: 5,
    fn: getTimes25Hint,
  },

  // Future

  // {
  //   minLevel: 5,
  //   fn: getTimes50Hint,
  // },

  // {
  //   minLevel: 6,
  //   fn: getPowersOf10Hint,
  // },

  // {
  //   minLevel: 7,
  //   fn: getFactorPairHint,
  // },

  // {
  //   minLevel: 8,
  //   fn: getRoundAdjustHint,
  // },

  // {
  //   minLevel: 9,
  //   fn: getDistributiveHint,
  // },
];

export function getMulHints(question) {
  const [left, right] = question.numbers;

  // No hints for basic single-digit multiplication
  if (left < 10 && right < 10) {
    return [];
  }

  return STRATEGIES.filter((strategy) => question.level >= strategy.minLevel)
    .map((strategy) => strategy.fn(question))
    .filter(Boolean);
}
