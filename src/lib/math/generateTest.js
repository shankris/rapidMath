// src/lib/math/generateTest.js

import { generateQuestion } from "./generateQuestion";

/* --------------------------------------------------
   Generate Test
-------------------------------------------------- */

export function generateTest({ operation, level, count = 20 }) {
  const questions = [];
  const uniqueQuestions = [];
  const usedQuestions = new Set();

  /*
   * Generate unique questions first.
   *
   * The attempt limit is important here. Some levels have
   * fewer possible questions than the requested test size.
   * Without a limit, the generator could loop forever trying
   * to find another unique question.
   */
  const maxAttempts = Math.max(count * 100, 100);

  let attempts = 0;

  while (uniqueQuestions.length < count && attempts < maxAttempts) {
    attempts++;

    const question = generateQuestion(operation, level);

    if (usedQuestions.has(question.id)) {
      continue;
    }

    usedQuestions.add(question.id);
    uniqueQuestions.push(question);
  }

  /*
   * If there are not enough unique questions to fill the test,
   * reuse questions from the available unique pool.
   */
  if (uniqueQuestions.length === 0) {
    throw new Error(`Unable to generate questions for ${operation} level ${level}.`);
  }

  /*
   * Start with all available unique questions.
   */
  questions.push(...uniqueQuestions);

  /*
   * Fill the remaining slots by reusing questions.
   *
   * This is intentional for levels where the configured
   * question space contains fewer questions than the
   * requested test size.
   */
  let repeatIndex = 0;

  while (questions.length < count) {
    questions.push(uniqueQuestions[repeatIndex]);

    repeatIndex++;

    if (repeatIndex >= uniqueQuestions.length) {
      repeatIndex = 0;
    }
  }

  return questions;
}
