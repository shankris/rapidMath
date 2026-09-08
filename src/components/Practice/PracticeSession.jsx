"use client";

import { useEffect, useState } from "react";
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

  const datePart = date.toISOString().slice(0, 10).replace(/-/g, "");

  const timePart = date.toTimeString().slice(0, 8).replace(/:/g, "");

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
     
     This is only used to calculate the reaction time
     for the current question.
  -------------------------------------------------- */

  const [startTime, setStartTime] = useState(null);
  const [reactionTime, setReactionTime] = useState(null);

  /* --------------------------------------------------
     Quiz Attempt
     
     This is the single source of truth for the
     persisted quiz attempt.
  -------------------------------------------------- */

  const [attempt, setAttempt] = useState(null);

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
     Handle Answer
  -------------------------------------------------- */

  function handleAnswer(answer) {
    /* ----------------------------------------------
       Prevent Multiple Answers
    ---------------------------------------------- */

    if (selectedAnswer !== null || !startTime || !attempt) {
      return;
    }

    /* ----------------------------------------------
       Calculate Reaction Time
    ---------------------------------------------- */

    const reaction = (Date.now() - startTime) / 1000;

    setReactionTime(reaction);

    /* ----------------------------------------------
       Create Minimal Answer Record
       
       Only the information required for history
       and future statistics is stored.
    ---------------------------------------------- */

    const answerRecord = {
      id: question.id,
      correct: answer === question.answer,
      time: reaction,
    };

    /* ----------------------------------------------
       Update Quiz Attempt
    --------------------------------------------------
       Save the updated attempt immediately so that
       every answered question is persisted.
    ---------------------------------------------- */

    const updatedQuestions = [...attempt.questions, answerRecord];

    const updatedAttempt = {
      ...attempt,
      questions: updatedQuestions,
    };

    updateQuizAttempt(attempt.id, {
      questions: updatedQuestions,
    });

    setAttempt(updatedAttempt);

    /* ----------------------------------------------
       Update Selected Answer
    ---------------------------------------------- */

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
--------------------------------------------------
   The final answer has already been saved.
   We only need to update the attempt status
   and record the practice streak.
-------------------------------------------------- */

    const completedAt = Date.now();

    const completedAttempt = {
      ...attempt,
      completedAt,
      status: "completed",
    };

    updateQuizAttempt(attempt.id, {
      completedAt,
      status: "completed",
    });

    updateStreak();

    setAttempt(completedAttempt);
    setQuizCompleted(true);
  }

  /* --------------------------------------------------
     Start Quiz
  -------------------------------------------------- */

  function handleStartQuiz() {
    const startedAt = Date.now();

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
     
     Summary values are calculated from the persisted
     question records rather than being stored.
  -------------------------------------------------- */

  if (quizCompleted && attempt) {
    const records = attempt.questions;

    const total = records.length;

    const correct = records.filter((record) => record.correct).length;

    const times = records.map((record) => record.time);

    const accuracy = total === 0 ? 0 : Math.round((correct / total) * 100);

    const averageTime = times.length === 0 ? 0 : Number((times.reduce((sum, time) => sum + time, 0) / times.length).toFixed(2));

    const fastestTime = times.length === 0 ? 0 : Number(Math.min(...times).toFixed(2));

    const slowestTime = times.length === 0 ? 0 : Number(Math.max(...times).toFixed(2));

    return (
      <QuizComplete
        results={{
          correct,
          total,
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
