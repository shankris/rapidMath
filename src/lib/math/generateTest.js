// src/lib/math/generateTest.js

import { generateQuestion } from "./generateQuestion";

export function generateTest({ operation, level, count = 20 }) {
  const questions = [];

  const usedQuestions = new Set();

  while (questions.length < count) {
    const question = generateQuestion(operation, level);

    // Prevent duplicate questions
    if (usedQuestions.has(question.id)) {
      continue;
    }

    usedQuestions.add(question.id);

    questions.push(question);
  }

  return questions;
}
