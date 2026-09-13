// src/lib/math/generators/targetedAddition.js

import { generateOptions } from "../generateOptions";
import { generateAdditionQuestion } from "./addition";

/* --------------------------------------------------
   Random Number
-------------------------------------------------- */

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* --------------------------------------------------
   Calculate Carry Columns
-------------------------------------------------- */

function countCarryColumns(numbers) {
  const reversedNumbers = numbers.map((number) => String(number).split("").reverse().map(Number));

  const maxDigits = Math.max(...reversedNumbers.map((digits) => digits.length));

  let carry = 0;
  let carryCount = 0;

  for (let position = 0; position < maxDigits; position++) {
    let columnTotal = carry;

    reversedNumbers.forEach((digits) => {
      columnTotal += digits[position] ?? 0;
    });

    if (columnTotal >= 10) {
      carry = 1;
      carryCount += 1;
    } else {
      carry = 0;
    }
  }

  return carryCount;
}

/* --------------------------------------------------
   Check Target Pattern
-------------------------------------------------- */

function matchesPattern(numbers, patternKey) {
  const carryColumns = countCarryColumns(numbers);

  if (patternKey === "carry") {
    return carryColumns === 1;
  }

  if (patternKey === "multiple_carries") {
    return carryColumns >= 2;
  }

  if (patternKey === "multi_digit_numbers") {
    return numbers.some((number) => number >= 10);
  }

  return false;
}

/* --------------------------------------------------
   Generate Targeted Numbers
-------------------------------------------------- */

function generateTargetedNumbers(config, patternKey) {
  const { addends, maxResult } = config;

  for (let attempt = 0; attempt < 1000; attempt++) {
    const numbers = addends.map(({ min, max }) => randomNumber(min, max));

    const result = numbers.reduce((total, number) => total + number, 0);

    if (result <= maxResult && matchesPattern(numbers, patternKey)) {
      return numbers;
    }
  }

  return null;
}

/* --------------------------------------------------
   Generate Targeted Addition Question
-------------------------------------------------- */

export function generateTargetedAdditionQuestion({ level, config, patternKey, symbol = "+" }) {
  const numbers = generateTargetedNumbers(config, patternKey);

  /* ------------------------------------------------
     Fallback

     Some patterns cannot exist at every level.
     In that case, use the normal level generator
     rather than creating an invalid question.
  ------------------------------------------------ */

  if (!numbers) {
    return generateAdditionQuestion({
      level,
      config,
      symbol,
    });
  }

  const answer = numbers.reduce((total, number) => total + number, 0);

  return {
    id: `add_${numbers.join("_")}`,
    operation: "add",
    level,
    numbers,
    symbol,
    question: numbers.map((number) => number.toLocaleString()).join(` ${symbol} `),
    answer,
    options: generateOptions(answer, "add", ...numbers),
    targetedPattern: patternKey,
  };
}
