/* src/components/ReviewQuiz/ReviewQuiz.jsx */

"use client";

import { useEffect, useMemo, useState } from "react";
import { CircleX } from "lucide-react";

import { getQuizAttempt } from "@/lib/storage/quizHistory";

import styles from "./ReviewQuiz.module.css";

/* --------------------------------------------------
   Review Quiz
-------------------------------------------------- */

export default function ReviewQuiz({ attemptId }) {
  const [attempt, setAttempt] = useState(undefined);

  const [sortConfig, setSortConfig] = useState({
    key: "time",
    direction: "asc",
  });

  /* --------------------------------------------------
     Load Quiz Attempt
  -------------------------------------------------- */

  useEffect(() => {
    const storedAttempt = getQuizAttempt(attemptId);

    setAttempt(storedAttempt);
  }, [attemptId]);

  /* --------------------------------------------------
     Sort Configuration
  -------------------------------------------------- */

  const sortedQuestions = useMemo(() => {
    if (!attempt?.questions) {
      return [];
    }

    const questions = attempt.questions.map((question, index) => ({
      ...question,
      questionNumber: index + 1,
    }));

    return [...questions].sort((a, b) => {
      const { key, direction } = sortConfig;

      let valueA;
      let valueB;

      switch (key) {
        case "questionNumber":
          valueA = a.questionNumber;
          valueB = b.questionNumber;
          break;

        case "question":
          valueA = a.question;
          valueB = b.question;
          break;

        case "selectedAnswer":
          valueA = a.selectedAnswer;
          valueB = b.selectedAnswer;
          break;

        case "correctAnswer":
          valueA = a.correctAnswer;
          valueB = b.correctAnswer;
          break;

        case "correct":
          valueA = a.correct ? 1 : 0;
          valueB = b.correct ? 1 : 0;
          break;

        case "time":
          valueA = Number(a.time);
          valueB = Number(b.time);
          break;

        default:
          return 0;
      }

      if (typeof valueA === "string" && typeof valueB === "string") {
        return valueA.localeCompare(valueB) * (direction === "asc" ? 1 : -1);
      }

      if (valueA < valueB) {
        return direction === "asc" ? -1 : 1;
      }

      if (valueA > valueB) {
        return direction === "asc" ? 1 : -1;
      }

      return 0;
    });
  }, [attempt, sortConfig]);

  /* --------------------------------------------------
     Handle Sort
  -------------------------------------------------- */

  function handleSort(key) {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  }

  /* --------------------------------------------------
   Reaction Time Bar
-------------------------------------------------- */

  function ReactionTimeBar({ time, correct, averageTime, fastestTime, slowestCorrectTime, slowestOverallTime }) {
    const numericTime = Number(time);

    const maxTime = Math.max(slowestOverallTime, 0.01);

    const barWidth = Math.min((numericTime / maxTime) * 100, 100);

    let barClass = styles.reactionBarIncorrect;

    if (correct) {
      if (numericTime <= averageTime) {
        const range = averageTime - fastestTime;

        const position = range > 0 ? (averageTime - numericTime) / range : 1;

        if (position >= 0.8) {
          barClass = styles.reactionBarGreen5;
        } else if (position >= 0.6) {
          barClass = styles.reactionBarGreen4;
        } else if (position >= 0.4) {
          barClass = styles.reactionBarGreen3;
        } else if (position >= 0.2) {
          barClass = styles.reactionBarGreen2;
        } else {
          barClass = styles.reactionBarGreen1;
        }
      } else {
        const range = slowestCorrectTime - averageTime;

        const position = range > 0 ? (numericTime - averageTime) / range : 1;

        if (position >= 0.8) {
          barClass = styles.reactionBarRed5;
        } else if (position >= 0.6) {
          barClass = styles.reactionBarRed4;
        } else if (position >= 0.4) {
          barClass = styles.reactionBarRed3;
        } else if (position >= 0.2) {
          barClass = styles.reactionBarRed2;
        } else {
          barClass = styles.reactionBarRed1;
        }
      }
    }

    return (
      <div className={styles.reactionTime}>
        <span className={styles.reactionTimeValue}>{numericTime.toFixed(2)}s</span>

        <div className={styles.reactionBar}>
          <div
            className={`${styles.reactionBarFill} ${barClass}`}
            style={{
              "--reactionBarWidth": `${barWidth}%`,
            }}
          />
        </div>
      </div>
    );
  }

  /* --------------------------------------------------
     Sort Indicator
  -------------------------------------------------- */

  function SortIndicator({ column }) {
    if (sortConfig.key !== column) {
      return null;
    }

    return sortConfig.direction === "asc" ? " ↑" : " ↓";
  }

  /* --------------------------------------------------
     Loading State
  -------------------------------------------------- */

  if (attempt === undefined) {
    return (
      <div className={styles.container}>
        <p>Loading quiz review...</p>
      </div>
    );
  }

  /* --------------------------------------------------
     Attempt Not Found
  -------------------------------------------------- */

  if (!attempt) {
    return (
      <div className={styles.container}>
        <h1>Quiz Review</h1>

        <p>Sorry, this quiz attempt could not be found.</p>
      </div>
    );
  }

  /* --------------------------------------------------
     Review Statistics
  -------------------------------------------------- */

  const totalQuestions = attempt.questions.length;

  const correctQuestions = attempt.questions.filter((question) => question.correct);

  const correctAnswers = correctQuestions.length;

  const incorrectAnswers = totalQuestions - correctAnswers;

  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  const averageTime = correctAnswers > 0 ? correctQuestions.reduce((total, question) => total + Number(question.time), 0) / correctAnswers : 0;

  const correctTimes = correctQuestions.map((question) => Number(question.time));

  const allTimes = attempt.questions.map((question) => Number(question.time));

  const fastestTime = correctTimes.length > 0 ? Math.min(...correctTimes) : 0;

  const slowestCorrectTime = correctTimes.length > 0 ? Math.max(...correctTimes) : 0;

  const slowestOverallTime = allTimes.length > 0 ? Math.max(...allTimes) : 0;

  /* --------------------------------------------------
     Review
  -------------------------------------------------- */

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Quiz Review</h1>

        <p>Review your answers and reaction times.</p>
      </div>

      {/* --------------------------------------------------
          Review Statistics
      -------------------------------------------------- */}

      <div className={styles.stats}>
        <div>
          <span>Avg. Time</span>
          <strong>{averageTime.toFixed(2)}s</strong>
        </div>

        <div>
          <span>Accuracy</span>
          <strong>{accuracy}%</strong>
        </div>

        <div>
          <span>Incorrect</span>
          <strong>{incorrectAnswers}</strong>
        </div>
      </div>

      <div className={styles.statsNote}>Average reaction time is based on correct answers only.</div>

      {/* --------------------------------------------------
          Questions
      -------------------------------------------------- */}

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>
                <button
                  type='button'
                  onClick={() => handleSort("questionNumber")}
                >
                  #
                  <SortIndicator column='questionNumber' />
                </button>
              </th>

              <th>
                <button
                  type='button'
                  onClick={() => handleSort("question")}
                >
                  Question
                  <SortIndicator column='question' />
                </button>
              </th>

              <th>
                <button
                  type='button'
                  onClick={() => handleSort("selectedAnswer")}
                >
                  Your Answer
                  <SortIndicator column='selectedAnswer' />
                </button>
              </th>

              <th>
                <button
                  type='button'
                  onClick={() => handleSort("correctAnswer")}
                >
                  Correct Answer
                  <SortIndicator column='correctAnswer' />
                </button>
              </th>

              <th>
                <button
                  type='button'
                  onClick={() => handleSort("correct")}
                >
                  Result
                  <SortIndicator column='correct' />
                </button>
              </th>

              <th>
                <button
                  type='button'
                  onClick={() => handleSort("time")}
                >
                  Reaction Time
                  <SortIndicator column='time' />
                </button>
              </th>
            </tr>
          </thead>

          <tbody>
            {sortedQuestions.map((question) => (
              <tr
                key={question.id}
                className={!question.correct ? styles.incorrectRow : ""}
              >
                <td>{question.questionNumber}</td>

                <td data-label='Question'>{question.question}</td>

                <td
                  data-label='Your Answer'
                  className={!question.correct ? styles.incorrectAnswer : ""}
                >
                  {!question.correct && (
                    <CircleX
                      size={18}
                      strokeWidth={2.2}
                      className={styles.incorrectIcon}
                    />
                  )}

                  {question.selectedAnswer}
                </td>

                <td data-label='Correct Answer'>{question.correctAnswer}</td>

                <td>{question.correct ? "Correct" : "Incorrect"}</td>

                <td
                  data-label='Reaction Time'
                  className={styles.reactionTimeCell}
                >
                  <ReactionTimeBar
                    time={question.time}
                    correct={question.correct}
                    averageTime={averageTime}
                    fastestTime={fastestTime}
                    slowestCorrectTime={slowestCorrectTime}
                    slowestOverallTime={slowestOverallTime}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
