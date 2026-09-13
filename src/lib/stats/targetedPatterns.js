// src/lib/stats/targetedPatterns.js

import { getQuizAttemptsByLevel } from "../storage/quizHistory";

/* --------------------------------------------------
   Targeted Pattern Configuration
-------------------------------------------------- */

const TARGETING_DAYS = 30;

/* --------------------------------------------------
   Get Targeting Start Date
-------------------------------------------------- */

function getTargetingStartDate() {
  const date = new Date();

  date.setDate(date.getDate() - TARGETING_DAYS);

  return date;
}

/* --------------------------------------------------
   Check Recent Attempt
-------------------------------------------------- */

function isRecentAttempt(attempt, startDate) {
  if (!attempt.startedAt) {
    return false;
  }

  const startedAt = new Date(attempt.startedAt);

  return !Number.isNaN(startedAt.getTime()) && startedAt >= startDate;
}

/* --------------------------------------------------
   Get Recent Questions
-------------------------------------------------- */

function getRecentQuestions(operation, level) {
  const attempts = getQuizAttemptsByLevel(operation, level);
  const startDate = getTargetingStartDate();

  return attempts
    .filter((attempt) => isRecentAttempt(attempt, startDate))
    .flatMap((attempt) => (Array.isArray(attempt.questions) ? attempt.questions : []))
    .filter((question) => question.questionData);
}

/* --------------------------------------------------
   Count Digits
-------------------------------------------------- */

function getDigitCount(value) {
  return Math.abs(Number(value)).toString().length;
}

/* --------------------------------------------------
   Detect Addition Carries
-------------------------------------------------- */

function countAdditionCarries(numbers) {
  if (!Array.isArray(numbers) || numbers.length < 2) {
    return 0;
  }

  const reversedNumbers = numbers.map((number) => Math.abs(Number(number)).toString().split("").reverse().map(Number));

  const maxDigits = Math.max(...reversedNumbers.map((digits) => digits.length));

  let carries = 0;
  let carry = 0;

  for (let column = 0; column < maxDigits; column++) {
    let columnTotal = carry;

    reversedNumbers.forEach((digits) => {
      columnTotal += digits[column] ?? 0;
    });

    if (columnTotal >= 10) {
      carries++;
      carry = Math.floor(columnTotal / 10);
    } else {
      carry = 0;
    }
  }

  return carries;
}

/* --------------------------------------------------
   Detect Subtraction Borrowing
-------------------------------------------------- */

function countSubtractionBorrows(numbers, operators) {
  if (!Array.isArray(numbers) || !Array.isArray(operators) || numbers.length < 2) {
    return 0;
  }

  /*
   * This handles the subtraction expressions currently
   * produced by the subtraction generator.
   *
   * Addition terms are ignored because they do not
   * create borrowing.
   */
  let borrows = 0;

  for (let index = 0; index < operators.length; index++) {
    if (operators[index] !== "−") {
      continue;
    }

    const left = Math.abs(Number(numbers[index]));
    const right = Math.abs(Number(numbers[index + 1]));

    const leftDigits = left.toString().split("").reverse().map(Number);

    const rightDigits = right.toString().split("").reverse().map(Number);

    const maxDigits = Math.max(leftDigits.length, rightDigits.length);

    let borrow = 0;

    for (let column = 0; column < maxDigits; column++) {
      const leftDigit = (leftDigits[column] ?? 0) - borrow;

      const rightDigit = rightDigits[column] ?? 0;

      if (leftDigit < rightDigit) {
        borrows++;
        borrow = 1;
      } else {
        borrow = 0;
      }
    }
  }

  return borrows;
}

/* --------------------------------------------------
   Detect Zero Borrowing
-------------------------------------------------- */

function hasZeroBorrowing(numbers, operators) {
  if (!Array.isArray(numbers) || !Array.isArray(operators)) {
    return false;
  }

  for (let index = 0; index < operators.length; index++) {
    if (operators[index] !== "−") {
      continue;
    }

    const left = Math.abs(Number(numbers[index]));

    if (left.toString().includes("0")) {
      return true;
    }
  }

  return false;
}

/* --------------------------------------------------
   Add Pattern
-------------------------------------------------- */

function addPattern(patterns, key, data) {
  if (!patterns.has(key)) {
    patterns.set(key, {
      key,
      type: data.type,
      value: data.value ?? null,
      occurrences: 0,
      questions: [],
      questionRecords: [],
    });
  }

  const pattern = patterns.get(key);

  pattern.occurrences++;
  pattern.questions.push(data.question);

  if (data.questionRecord) {
    pattern.questionRecords.push(data.questionRecord);
  }
}

/* --------------------------------------------------
   Detect Addition Patterns
-------------------------------------------------- */

function detectAdditionPatterns(question, questionRecord, patterns) {
  const numbers = question.numbers;

  if (!Array.isArray(numbers)) {
    return;
  }

  if (numbers.length > 2) {
    addPattern(patterns, "multiple_addends", {
      type: "multiple_addends",
      question,
      questionRecord,
    });
  }

  const carryCount = countAdditionCarries(numbers);

  if (carryCount > 0) {
    addPattern(patterns, "carry", {
      type: "carry",
      value: carryCount,
      question,
      questionRecord,
    });
  }

  if (carryCount > 1) {
    addPattern(patterns, "multiple_carries", {
      type: "multiple_carries",
      value: carryCount,
      question,
      questionRecord,
    });
  }

  if (numbers.some((number) => getDigitCount(number) >= 2)) {
    addPattern(patterns, "multi_digit_numbers", {
      type: "multi_digit_numbers",
      question,
      questionRecord,
    });
  }
}

/* --------------------------------------------------
   Detect Subtraction Patterns
-------------------------------------------------- */

function detectSubtractionPatterns(question, questionRecord, patterns) {
  const numbers = question.numbers;
  const operators = question.operators;

  if (!Array.isArray(numbers) || !Array.isArray(operators)) {
    return;
  }

  if (numbers.some((number) => getDigitCount(number) >= 2)) {
    addPattern(patterns, "multi_digit_numbers", {
      type: "multi_digit_numbers",
      question,
      questionRecord,
    });
  }

  const borrowCount = countSubtractionBorrows(numbers, operators);

  if (borrowCount > 0) {
    addPattern(patterns, "borrowing", {
      type: "borrowing",
      value: borrowCount,
      question,
      questionRecord,
    });
  }

  if (borrowCount > 1) {
    addPattern(patterns, "multiple_borrowing", {
      type: "multiple_borrowing",
      value: borrowCount,
      question,
      questionRecord,
    });
  }

  if (hasZeroBorrowing(numbers, operators)) {
    addPattern(patterns, "zero_borrowing", {
      type: "zero_borrowing",
      question,
      questionRecord,
    });
  }

  if (operators.length > 1) {
    addPattern(patterns, "multiple_operations", {
      type: "multiple_operations",
      question,
      questionRecord,
    });
  }
}

/* --------------------------------------------------
   Detect Multiplication Patterns
-------------------------------------------------- */

function detectMultiplicationPatterns(question, questionRecord, patterns) {
  const numbers = question.numbers;

  if (!Array.isArray(numbers)) {
    return;
  }

  /*
   * Each factor can represent a multiplication table.
   *
   * For example:
   *
   * 7 × 8
   *
   * contributes to both the 7 and 8 tables.
   */
  numbers.forEach((number) => {
    addPattern(patterns, `multiplication_table_${number}`, {
      type: "multiplication_table",
      value: Number(number),
      question,
      questionRecord,
    });
  });

  if (numbers.some((number) => getDigitCount(number) >= 2)) {
    addPattern(patterns, "multi_digit_factors", {
      type: "multi_digit_factors",
      question,
      questionRecord,
    });
  }

  if (numbers.length > 2) {
    addPattern(patterns, "multiple_factors", {
      type: "multiple_factors",
      question,
      questionRecord,
    });
  }
}

/* --------------------------------------------------
   Detect Division Patterns
-------------------------------------------------- */

function detectDivisionPatterns(question, questionRecord, patterns) {
  const numbers = question.numbers;

  if (!Array.isArray(numbers) || numbers.length < 2) {
    return;
  }

  const dividend = Number(numbers[0]);
  const divisor = Number(numbers[1]);
  const quotient = Number(question.answer);

  if (Number.isFinite(divisor)) {
    addPattern(patterns, `division_divisor_${divisor}`, {
      type: "divisor",
      value: divisor,
      question,
      questionRecord,
    });
  }

  if (Number.isFinite(dividend) && getDigitCount(dividend) >= 3) {
    addPattern(patterns, "large_dividend", {
      type: "large_dividend",
      question,
      questionRecord,
    });
  }

  if (Number.isFinite(divisor) && getDigitCount(divisor) >= 2) {
    addPattern(patterns, "large_divisor", {
      type: "large_divisor",
      question,
      questionRecord,
    });
  }

  if (Number.isFinite(quotient) && getDigitCount(quotient) >= 2) {
    addPattern(patterns, "large_quotient", {
      type: "large_quotient",
      question,
      questionRecord,
    });
  }

  if (numbers.some((number) => Math.abs(Number(number)).toString().includes("0"))) {
    addPattern(patterns, "zero_in_number", {
      type: "zero_in_number",
      question,
      questionRecord,
    });
  }

  /*
   * Future support:
   *
   * When division questions contain a remainder,
   * question.remainder can be used here.
   */
  if (Number.isFinite(Number(question.remainder)) && Number(question.remainder) !== 0) {
    addPattern(patterns, `remainder_${question.remainder}`, {
      type: "remainder",
      value: Number(question.remainder),
      question,
      questionRecord,
    });
  }
}

/* --------------------------------------------------
   Detect Patterns For Question
-------------------------------------------------- */

function detectPatterns(question, questionRecord, operation, patterns) {
  if (!question) {
    return;
  }

  if (operation === "add") {
    detectAdditionPatterns(question, questionRecord, patterns);
    return;
  }

  if (operation === "sub") {
    detectSubtractionPatterns(question, questionRecord, patterns);
    return;
  }

  if (operation === "mul") {
    detectMultiplicationPatterns(question, questionRecord, patterns);
    return;
  }

  if (operation === "div") {
    detectDivisionPatterns(question, questionRecord, patterns);
  }
}

/* --------------------------------------------------
   Get Targeted Patterns
-------------------------------------------------- */

export function getTargetedPatterns(operation, level) {
  const questionRecords = getRecentQuestions(operation, level);

  const patterns = new Map();

  questionRecords.forEach((questionRecord) => {
    detectPatterns(questionRecord.questionData, questionRecord, operation, patterns);
  });

  return Array.from(patterns.values()).sort((a, b) => b.occurrences - a.occurrences);
}
