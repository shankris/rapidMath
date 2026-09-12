"use client";

import { Check, X } from "lucide-react";
import Ripple from "@/components/UI/Ripple/Ripple";
import styles from "./AnswerOptions.module.css";

export default function AnswerOptions({ options, correctAnswer, selectedAnswer, onSelect }) {
  /* --------------------------------------------------
     Determine Answer State
  -------------------------------------------------- */

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
        <Ripple>
          <button
            key={option}
            className={`${getClassName(option)} ripple button`}
            onClick={() => onSelect(option)}
            disabled={selectedAnswer !== null}
          >
            <span className={styles.answerValue}>{option.toLocaleString()}</span>

            <span className={styles.keyboardHint}>Key {index + 1}</span>

            {/* --------------------------------------------------
             Correct Answer
          -------------------------------------------------- */}

            {selectedAnswer !== null && option === correctAnswer && (
              <span className={styles.feedbackIcon}>
                <Check
                  size={22}
                  className={styles.correctIcon}
                />
              </span>
            )}

            {/* --------------------------------------------------
             Incorrect Answer
          -------------------------------------------------- */}

            {selectedAnswer !== null && option === selectedAnswer && option !== correctAnswer && (
              <span className={styles.feedbackIcon}>
                <X
                  size={22}
                  className={styles.wrongIcon}
                />
              </span>
            )}
          </button>
        </Ripple>
      ))}
    </div>
  );
}
