"use client";

import { useState } from "react";
import { useEffect } from "react";

import { generateTest } from "@/lib/math/generateTest";

import QuestionCard from "./QuestionCard";
import AnswerOptions from "./AnswerOptions";
import styles from "./Practice.module.css";

export default function PracticeSession({ operation, level }) {
  const [questions] = useState(() =>
    generateTest({
      operation,
      level,
      count: 20,
    }),
  );

  const [startTime, setStartTime] = useState(null);
  const [reactionTime, setReactionTime] = useState(null);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const question = questions[currentQuestion];

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

    const timeTaken = (Date.now() - startTime) / 1000;

    setReactionTime(timeTaken.toFixed(2));

    setSelectedAnswer(answer);
  }

  function handleNext() {
    setSelectedAnswer(null);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      console.log("Test completed");
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>
          {operation.toUpperCase()} Level {level}
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
