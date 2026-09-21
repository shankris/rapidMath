"use client";

/* src/components/Practice/QuestionCard.jsx */

import { getHints } from "@/lib/math/hints";
import HintPanel from "./HintPanel";

import styles from "./PracticeSession.module.css";

export default function QuestionCard({ question }) {
  const hints = getHints(question);

  return (
    <div className={styles.questionCard}>
      <div className={styles.question}>{question.question}</div>

      <HintPanel hints={hints} />
    </div>
  );
}
