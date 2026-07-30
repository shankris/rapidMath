"use client";

import styles from "./Practice.module.css";
import practiceData from "./practiceData";
import OperationCard from "./OperationCard";

export default function Practice() {
  return (
    <section className={styles.practice}>
      <div className={styles.heading}>
        <h1>Practice</h1>
        <p>Select an operation and level.</p>
      </div>

      <div className={styles.grid}>
        {practiceData.map((item) => (
          <OperationCard
            key={item.id}
            operation={item}
          />
        ))}
      </div>
    </section>
  );
}
