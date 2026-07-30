"use client";

import { Check, X } from "lucide-react";

import styles from "./Practice.module.css";

export default function AnswerOptions({ options, correctAnswer, selectedAnswer, onSelect }) {
  function getClassName(option) {
    if (selectedAnswer === null) {
      return styles.option;
    }

    if (option === correctAnswer) {
      return `${styles.option} ${styles.correct}`;
    }

    if (option === selectedAnswer && option !== correctAnswer) {
      return `${styles.option} ${styles.wrong}`;
    }

    return styles.option;
  }

  return (
    <div className={styles.options}>
      {options.map((option, index) => (
        <button
          key={option}
          className={getClassName(option)}
          onClick={() => onSelect(option)}
          disabled={selectedAnswer !== null}
        >
          <span className={styles.answerValue}>{option}</span>

          <span className={styles.keyboardHint}>Key {index + 1}</span>

          {selectedAnswer !== null && option === correctAnswer && (
            <span className={styles.feedbackIcon}>
              <Check size={22} />
            </span>
          )}

          {selectedAnswer !== null && option === selectedAnswer && option !== correctAnswer && (
            <span className={styles.feedbackIcon}>
              <X size={22} />
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
