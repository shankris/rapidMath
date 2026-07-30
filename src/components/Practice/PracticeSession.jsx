"use client";

import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { generateTest } from "@/lib/math/generateTest";

import { QUIZ_CONFIG } from "@/lib/config";
import QuestionCard from "./QuestionCard";
import AnswerOptions from "./AnswerOptions";
import QuizSetup from "./QuizSetup";
import QuizComplete from "./QuizComplete";
import { OPERATIONS } from "@/lib/math/operations";

import styles from "./Practice.module.css";

export default function PracticeSession({ operation, level }) {
  const [questions, setQuestions] = useState(() =>
    generateTest({
      operation,
      level,
      count: QUIZ_CONFIG.QUESTIONS_PER_TEST,
    }),
  );

  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [reactionTimes, setReactionTimes] = useState([]);

  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const [startTime, setStartTime] = useState(null);
  const [reactionTime, setReactionTime] = useState(null);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const question = questions[currentQuestion];

  const router = useRouter();

  function takeAnotherTest() {
    router.push("/practice");
  }

  function restartTest() {
    setQuestions(
      generateTest({
        operation,
        level,
        count: QUIZ_CONFIG.QUESTIONS_PER_TEST,
      }),
    );

    setCurrentQuestion(0);
    setSelectedAnswer(null);

    setQuizCompleted(false);
    setQuizStarted(false);

    // Reset statistics
    setCorrectAnswers(0);
    setReactionTimes([]);

    setReactionTime(null);
    setStartTime(null);
  }

  useEffect(() => {
    function handleKeyDown(event) {
      // Enter key moves to next question
      if (event.key === "Enter" && selectedAnswer !== null) {
        handleNext();
        return;
      }

      // Ignore answer keys after selection
      if (selectedAnswer !== null) {
        return;
      }

      const key = event.key.toLowerCase();

      const keyMap = {
        1: 0,
        2: 1,
        3: 2,
        4: 3,

        a: 0,
        b: 1,
        c: 2,
        d: 3,
      };

      const index = keyMap[key];

      if (index !== undefined) {
        const answer = question.options[index];

        handleAnswer(answer);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [question, selectedAnswer]);

  useEffect(() => {
    setStartTime(Date.now());
    setReactionTime(null);
  }, [currentQuestion]);

  function handleAnswer(answer) {
    if (selectedAnswer !== null) {
      return;
    }

    // Stop timer
    const reaction = (Date.now() - startTime) / 1000;

    setReactionTime(reaction);
    setReactionTimes((prev) => [...prev, reaction]);

    if (answer === question.answer) {
      setCorrectAnswers((prev) => prev + 1);
    }

    setSelectedAnswer(answer);
  }

  function handleNext() {
    if (currentQuestion < questions.length - 1) {
      setSelectedAnswer(null);
      setReactionTime(null);

      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizCompleted(true);
    }
  }

  function handleStartQuiz() {
    setQuizStarted(true);
    setStartTime(Date.now());
  }

  if (!quizStarted) {
    return (
      <QuizSetup
        operation={operation}
        level={level}
        onStart={handleStartQuiz}
      />
    );
  }

  const averageTime = reactionTimes.length === 0 ? 0 : (reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length).toFixed(2);

  const accuracy = Math.round((correctAnswers / questions.length) * 100);

  const fastestTime = reactionTimes.length === 0 ? 0 : Math.min(...reactionTimes).toFixed(2);

  const slowestTime = reactionTimes.length === 0 ? 0 : Math.max(...reactionTimes).toFixed(2);

  if (quizCompleted) {
    return (
      <QuizComplete
        results={{
          correct: correctAnswers,
          total: questions.length,
          accuracy,
          averageTime,
          fastestTime,
          slowestTime,
        }}
        onRetake={restartTest}
        onAnotherTest={takeAnotherTest}
        onContinue={() => {
          console.log("View progress");
        }}
      />
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>
          {OPERATIONS[operation].name} Level {level}
        </h1>

        <p>
          Question {currentQuestion + 1} / {questions.length}
        </p>
      </div>

      <QuestionCard question={question} />

      <AnswerOptions
        options={question.options}
        correctAnswer={question.answer}
        selectedAnswer={selectedAnswer}
        onSelect={handleAnswer}
      />

      {selectedAnswer !== null && (
        <button
          className={styles.nextButton}
          onClick={handleNext}
        >
          <span className={styles.nextText}>Next</span>
          <span className={styles.nextKeyHint}>Key Enter</span>
        </button>
      )}

      {reactionTime !== null && <div className={styles.reactionTime}>Reaction Time: {reactionTime}s</div>}
    </div>
  );
}
