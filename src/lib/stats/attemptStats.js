// src/lib/stats/attemptStats.js

/* --------------------------------------------------
   Calculate statistics for a single quiz attempt
-------------------------------------------------- */

export function calculateAttemptStats(attempt) {
  const questions = attempt?.questions || [];

  const total = questions.length;
  const correctQuestions = questions.filter((question) => question.correct);
  const correct = correctQuestions.length;
  const incorrect = total - correct;

  const totalTime = questions.reduce((sum, question) => sum + (Number(question.time) || 0), 0);

  const correctTimes = correctQuestions.map((question) => Number(question.time) || 0).filter((time) => time > 0);

  const averageTime = total > 0 ? totalTime / total : 0;

  const averageCorrectTime = correctTimes.length > 0 ? correctTimes.reduce((sum, time) => sum + time, 0) / correctTimes.length : 0;

  const fastestCorrectTime = correctTimes.length > 0 ? Math.min(...correctTimes) : 0;

  const slowestCorrectTime = correctTimes.length > 0 ? Math.max(...correctTimes) : 0;

  const accuracy = total > 0 ? (correct / total) * 100 : 0;

  return {
    id: attempt?.id,
    operation: attempt?.operation,
    level: attempt?.level,

    questions: total,
    correct,
    incorrect,

    accuracy: Number(accuracy.toFixed(1)),

    averageTime: Number(averageTime.toFixed(2)),
    averageCorrectTime: Number(averageCorrectTime.toFixed(2)),
    fastestCorrectTime: Number(fastestCorrectTime.toFixed(2)),
    slowestCorrectTime: Number(slowestCorrectTime.toFixed(2)),

    totalTime: Number(totalTime.toFixed(2)),

    startedAt: attempt?.startedAt,
    completedAt: attempt?.completedAt,
  };
}
