"use client";

import HintPanel from "./HintPanel";
import { getHints } from "@/lib/math/hints";

import styles from "./Practice.module.css";

export default function QuestionCard({ question }) {
  const hints = getHints(question);

  return (
    <div className={styles.questionCard}>
      <div className={styles.question}>{question.question}</div>

      <HintPanel hints={hints} />
    </div>
  );
}
