// src/components/Practice/PracticeSession.jsx

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { generateTest } from "@/lib/math/generateTest";
import { OPERATIONS } from "@/lib/math/operations";
import { QUIZ_CONFIG } from "@/lib/config";
import { saveQuizAttempt, updateQuizAttempt } from "@/lib/storage/quizHistory";
import { updateStreak } from "@/lib/storage/streak";

import QuestionCard from "./QuestionCard";
import AnswerOptions from "./AnswerOptions";
import QuizSetup from "./QuizSetup";
import QuizComplete from "./QuizComplete";

import styles from "./Practice.module.css";

/* --------------------------------------------------
   Generate Attempt ID
-------------------------------------------------- */

function generateAttemptId(timestamp) {
  const date = new Date(timestamp);

  const isoTimestamp = date.toISOString();

  const datePart = isoTimestamp.slice(0, 10).replace(/-/g, "");

  const timePart = isoTimestamp.slice(11, 19).replace(/:/g, "");

  const randomPart = Math.random().toString(36).substring(2, 5);

  return `${datePart}-${timePart}-${randomPart}`;
}

/* --------------------------------------------------
   Practice Session
-------------------------------------------------- */

export default function PracticeSession({ operation, level }) {
  /* --------------------------------------------------
     Quiz Questions
  -------------------------------------------------- */

  const [questions, setQuestions] = useState(() =>
    generateTest({
      operation,
      level,
      count: QUIZ_CONFIG.QUESTIONS_PER_TEST,
    }),
  );

  /* --------------------------------------------------
     Quiz State
  -------------------------------------------------- */

  const [quizStarted, setQuizStarted] = useState(false);

  const [quizCompleted, setQuizCompleted] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [selectedAnswer, setSelectedAnswer] = useState(null);

  /* --------------------------------------------------
     Current Question Timer

     This is only used to calculate the reaction
     time for the current question.
  -------------------------------------------------- */

  const [startTime, setStartTime] = useState(null);

  const [reactionTime, setReactionTime] = useState(null);

  /* --------------------------------------------------
     Quiz Attempt

     React state is used for rendering.

     The ref is used whenever we need the latest
     attempt synchronously, especially when completing
     the final question.
  -------------------------------------------------- */

  const [attempt, setAttempt] = useState(null);

  const attemptRef = useRef(null);

  /* --------------------------------------------------
     Current Question
  -------------------------------------------------- */

  const question = questions[currentQuestion];

  /* --------------------------------------------------
     Router
  -------------------------------------------------- */

  const router = useRouter();

  /* --------------------------------------------------
     Take Another Test
  -------------------------------------------------- */

  function takeAnotherTest() {
    router.push("/practice");
  }

  /* --------------------------------------------------
     Restart Current Test
  -------------------------------------------------- */

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

    setAttempt(null);
    attemptRef.current = null;

    setReactionTime(null);
    setStartTime(null);
  }

  /* --------------------------------------------------
     Start / Reset Question Timer
  -------------------------------------------------- */

  useEffect(() => {
    if (!quizStarted || quizCompleted) {
      return;
    }

    setStartTime(Date.now());
    setReactionTime(null);
  }, [currentQuestion, quizStarted, quizCompleted]);

  /* --------------------------------------------------
     Keyboard Controls

     1 - 4 and A - D select answers.
     Enter moves to the next question.
  -------------------------------------------------- */

  useEffect(() => {
    function handleKeyDown(event) {
      /* ----------------------------------------------
         Enter moves to the next question
      ---------------------------------------------- */

      if (event.key === "Enter" && selectedAnswer !== null) {
        handleNext();
        return;
      }

      /* ----------------------------------------------
         Ignore answer keys after selection
      ---------------------------------------------- */

      if (selectedAnswer !== null) {
        return;
      }

      /* ----------------------------------------------
         Answer Key Mapping
      ---------------------------------------------- */

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

      /* ----------------------------------------------
         Select Answer
      ---------------------------------------------- */

      if (index !== undefined && question?.options[index] !== undefined) {
        handleAnswer(question.options[index]);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [question, selectedAnswer]);

  /* --------------------------------------------------
     Record Answer
  -------------------------------------------------- */

  function handleAnswer(answer) {
    const currentAttempt = attemptRef.current;

    if (selectedAnswer !== null || !startTime || !currentAttempt) {
      return;
    }

    const reaction = (Date.now() - startTime) / 1000;

    setReactionTime(reaction);

    const answerRecord = {
      id: question.id,
      question: question.question,
      correctAnswer: question.answer,
      selectedAnswer: answer,
      correct: answer === question.answer,
      time: reaction,
    };

    const updatedQuestions = [...currentAttempt.questions, answerRecord];

    const updatedAttempt = {
      ...currentAttempt,
      questions: updatedQuestions,
    };

    /* ----------------------------------------------
       Keep Ref and React State In Sync

       The ref is updated first so handleNext() can
       immediately access this answer, even though the
       React state update is asynchronous.
    ---------------------------------------------- */

    attemptRef.current = updatedAttempt;

    setAttempt(updatedAttempt);

    /* ----------------------------------------------
       Persist Answer
    ---------------------------------------------- */

    updateQuizAttempt(currentAttempt.id, {
      questions: updatedQuestions,
    });

    setSelectedAnswer(answer);
  }

  /* --------------------------------------------------
     Move To Next Question
  -------------------------------------------------- */

  function handleNext() {
    /* ----------------------------------------------
       Move To Next Question
    ---------------------------------------------- */

    if (currentQuestion < questions.length - 1) {
      setSelectedAnswer(null);
      setReactionTime(null);

      setCurrentQuestion((previous) => previous + 1);

      return;
    }

    /* --------------------------------------------------
       Complete Quiz Attempt

       Read the latest attempt from the ref rather than
       React state. This guarantees that the answer to
       the final question is included.
    -------------------------------------------------- */

    const currentAttempt = attemptRef.current;

    if (!currentAttempt) {
      return;
    }

    const completedAt = new Date().toISOString();

    const records = currentAttempt.questions;

    const total = records.length;

    const correctRecords = records.filter((record) => record.correct);

    const correct = correctRecords.length;

    const incorrect = total - correct;

    /* ----------------------------------------------
       Correct Answer Timing

       Timing statistics are based only on answers
       that were answered correctly.
    ---------------------------------------------- */

    const correctTimes = correctRecords.map((record) => Number(record.time) || 0).filter((time) => time > 0);

    const totalTime = records.reduce((sum, record) => sum + (Number(record.time) || 0), 0);

    const accuracy = total === 0 ? 0 : Math.round((correct / total) * 100);

    const averageCorrectTime = correctTimes.length === 0 ? 0 : Number((correctTimes.reduce((sum, time) => sum + time, 0) / correctTimes.length).toFixed(2));

    const fastestCorrectTime = correctTimes.length === 0 ? 0 : Number(Math.min(...correctTimes).toFixed(2));

    const slowestCorrectTime = correctTimes.length === 0 ? 0 : Number(Math.max(...correctTimes).toFixed(2));

    /* ----------------------------------------------
       Test Summary
    ---------------------------------------------- */

    const stats = {
      questions: total,
      correct,
      incorrect,
      accuracy,
      averageCorrectTime,
      fastestCorrectTime,
      slowestCorrectTime,
      totalTime: Number(totalTime.toFixed(2)),
    };

    /* ----------------------------------------------
       Completed Attempt
    ---------------------------------------------- */

    const completedAttempt = {
      ...currentAttempt,
      completedAt,
      status: "completed",
      stats,
    };

    /* ----------------------------------------------
       Persist Completed Attempt

       The questions have already been saved when each
       answer was selected. Here we save the completion
       state and final summary.
    ---------------------------------------------- */

    updateQuizAttempt(currentAttempt.id, {
      completedAt,
      status: "completed",
      stats,
    });

    updateStreak();

    /* ----------------------------------------------
       Keep Ref and React State In Sync
    ---------------------------------------------- */

    attemptRef.current = completedAttempt;

    setAttempt(completedAttempt);
    setQuizCompleted(true);
  }

  /* --------------------------------------------------
     Start Quiz
  -------------------------------------------------- */

  function handleStartQuiz() {
    const startedAt = new Date().toISOString();

    /* ----------------------------------------------
       Create New Quiz Attempt
    ---------------------------------------------- */

    const newAttempt = {
      id: generateAttemptId(startedAt),

      operation,
      level,

      startedAt,
      completedAt: null,

      status: "in_progress",

      questions: [],
    };

    /* ----------------------------------------------
       Save Attempt

       The attempt is created before the first
       question is answered.
    ---------------------------------------------- */

    saveQuizAttempt(newAttempt);

    /* ----------------------------------------------
       Keep Ref and React State In Sync

       The ref gives us immediate access to the new
       attempt without waiting for React's state update.
    ---------------------------------------------- */

    attemptRef.current = newAttempt;

    setAttempt(newAttempt);
    setQuizStarted(true);
  }

  /* --------------------------------------------------
     Quiz Setup
  -------------------------------------------------- */

  if (!quizStarted) {
    return (
      <QuizSetup
        operation={operation}
        level={level}
        onStart={handleStartQuiz}
      />
    );
  }

  /* --------------------------------------------------
     Quiz Results

     Results are read from the persisted test summary.
  -------------------------------------------------- */

  if (quizCompleted && attempt) {
    const { correct, questions: total, accuracy, averageCorrectTime, fastestCorrectTime, slowestCorrectTime } = attempt.stats;

    return (
      <QuizComplete
        results={{
          correct,
          total,
          accuracy,
          averageTime: averageCorrectTime,
          fastestTime: fastestCorrectTime,
          slowestTime: slowestCorrectTime,
        }}
        onRetake={restartTest}
        onAnotherTest={takeAnotherTest}
        onContinue={() => {
          console.log("View progress");
        }}
      />
    );
  }

  /* --------------------------------------------------
     Active Quiz
  -------------------------------------------------- */

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>{OPERATIONS[operation].name}</h1>

          <span className={styles.level}>Level {level}</span>
        </div>

        <div className={styles.questionProgress}>
          {currentQuestion + 1} / {questions.length}
        </div>
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
