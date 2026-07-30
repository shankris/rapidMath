import styles from "./Practice.module.css";

export default function QuestionCard({ question }) {
  return (
    <div className={styles.questionCard}>
      <div className={styles.question}>{question.question}</div>
    </div>
  );
}
