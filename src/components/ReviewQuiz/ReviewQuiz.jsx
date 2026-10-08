/* src/components/ReviewQuiz/ReviewQuiz.jsx */

"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, CircleX } from "lucide-react";

import { getQuizAttemptsChronological } from "@/lib/storage/quizHistory";
import { useTranslations } from "next-intl";
import styles from "./ReviewQuiz.module.css";

/* --------------------------------------------------
   Get Local Date Key
-------------------------------------------------- */

function getLocalDateKey(timestamp) {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/* --------------------------------------------------
   Format Date and Time
-------------------------------------------------- */

function formatDateTime(timestamp) {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/* --------------------------------------------------
   Get Relative Time
-------------------------------------------------- */

function getRelativeTime(timestamp, now = Date.now()) {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const difference = Math.max(0, now - date.getTime());

  const seconds = Math.floor(difference / 1000);

  if (seconds < 60) {
    return "Just now";
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 30) {
    return `${days}d ago`;
  }

  const months = Math.floor(days / 30);

  if (months < 12) {
    return `${months}mo ago`;
  }

  const years = Math.floor(months / 12);

  return `${years}y ago`;
}

/* --------------------------------------------------
   Review Quiz
-------------------------------------------------- */

export default function ReviewQuiz({ operation, level, date }) {
  const t = useTranslations("Practice");

  const [attempts, setAttempts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [attempt, setAttempt] = useState(undefined);
  const [currentTime, setCurrentTime] = useState(Date.now());

  const [sortConfig, setSortConfig] = useState({
    key: "time",
    direction: "asc",
  });

  const hasPrevious = currentIndex < attempts.length - 1;
  const hasNext = currentIndex > 0;

  /* --------------------------------------------------
     Refresh Relative Time
  -------------------------------------------------- */

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  /* --------------------------------------------------
     Load Chronological Quiz Attempts
  -------------------------------------------------- */

  useEffect(() => {
    if (!operation || !level || !date) {
      setAttempts([]);
      setCurrentIndex(-1);
      setAttempt(null);
      return;
    }

    const storedAttempts = getQuizAttemptsChronological();

    const targetDate = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`;

    /* ----------------------------------------------
       Find the originally selected quiz

       The page parameters identify the quiz that
       should be opened initially. Navigation after
       this point is global and chronological.
    ---------------------------------------------- */

    const matchingAttemptIndex = storedAttempts.findIndex((storedAttempt) => {
      if (!storedAttempt?.startedAt) {
        return false;
      }

      return storedAttempt.operation === operation && Number(storedAttempt.level) === Number(level) && getLocalDateKey(storedAttempt.startedAt) === targetDate;
    });

    if (matchingAttemptIndex === -1) {
      setAttempts(storedAttempts);
      setCurrentIndex(-1);
      setAttempt(null);
      return;
    }

    setAttempts(storedAttempts);
    setCurrentIndex(matchingAttemptIndex);
    setAttempt(storedAttempts[matchingAttemptIndex]);

    setSortConfig({
      key: "time",
      direction: "asc",
    });
  }, [operation, level, date]);

  /* --------------------------------------------------
     Handle Previous / Next Navigation
  -------------------------------------------------- */

  function handlePrevious() {
    if (currentIndex <= 0) {
      return;
    }

    const nextIndex = currentIndex - 1;
    const nextAttempt = attempts[nextIndex];

    setCurrentIndex(nextIndex);
    setAttempt(nextAttempt);

    setSortConfig({
      key: "time",
      direction: "asc",
    });
  }

  function handleNext() {
    if (currentIndex < 0 || currentIndex >= attempts.length - 1) {
      return;
    }

    const nextIndex = currentIndex + 1;
    const nextAttempt = attempts[nextIndex];

    setCurrentIndex(nextIndex);
    setAttempt(nextAttempt);

    setSortConfig({
      key: "time",
      direction: "asc",
    });
  }

  /* --------------------------------------------------
     Keyboard Navigation
  -------------------------------------------------- */

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "ArrowLeft") {
        handlePrevious();
      }

      if (event.key === "ArrowRight") {
        handleNext();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentIndex, attempts]);

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
      <div className={styles.headingRow}>
        <h1>
          {t("review")}
          <span>
            - {t(`operations.${attempt.operation}`)} - {t("level")} {attempt.level}
          </span>
        </h1>

        <div className={styles.navigation}>
          <button
            type='button'
            onClick={handlePrevious}
            disabled={!hasPrevious}
            aria-label='Previous quiz'
          >
            <ChevronLeft size={20} />
          </button>

          <button
            type='button'
            onClick={handleNext}
            disabled={!hasNext}
            aria-label='Next quiz'
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* --------------------------------------------------
          Review Statistics
      -------------------------------------------------- */}

      <div className={styles.statsMain}>
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

        <div>
          <div className={styles.stastDate}>
            {formatDateTime(attempt.startedAt)} - {getRelativeTime(attempt.startedAt, currentTime)}
          </div>

          <div className={styles.statsNote}>Avg. time is based on correct responses only</div>
        </div>
      </div>

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
                key={`${question.id}-${question.questionNumber}`}
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
