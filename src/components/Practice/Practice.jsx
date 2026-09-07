"use client";

import { useState } from "react";

import styles from "./Practice.module.css";
import practiceData from "./practiceData";
import OperationCard from "./OperationCard";

export default function Practice() {
  const [openOperation, setOpenOperation] = useState(null);

  const handleToggle = (operationId) => {
    setOpenOperation((current) => (current === operationId ? null : operationId));
  };

  return (
    <section className={styles.practice}>
      {/* --------------------------------------------------
         Practice Heading
      -------------------------------------------------- */}

      <div className={styles.heading}>
        <h1>Practice</h1>
        <p>Select an operation and level.</p>
      </div>

      {/* --------------------------------------------------
         Operation Accordion
      -------------------------------------------------- */}

      <div className={styles.grid}>
        {practiceData.map((item) => (
          <OperationCard
            key={item.id}
            operation={item}
            isOpen={openOperation === item.id}
            onToggle={() => handleToggle(item.id)}
          />
        ))}
      </div>
    </section>
  );
}
