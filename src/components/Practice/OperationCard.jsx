"use client";

import Link from "next/link";
import styles from "./OperationCard.module.css";

export default function OperationCard({ operation }) {
  const Icon = operation.icon;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Icon size={28} />
        <h2>{operation.title}</h2>
      </div>
      {/* 
      <div className={styles.levelHeader}>
        <span>Level</span>
        <span>Tests</span>
        <span>Accuracy</span>
        <span>Time</span>
      </div> */}

      {operation.levels.map((item) => (
        <Link
          href={`/practice/${operation.id}/${item.level}`}
          className={styles.levelRow}
          key={item.level}
        >
          <span>Level {item.level}</span>
          <span>{item.attempts || "-"}</span>
          <span>{item.accuracy}</span>
          <span>{item.time || "-"}</span>
        </Link>
      ))}
    </div>
  );
}
