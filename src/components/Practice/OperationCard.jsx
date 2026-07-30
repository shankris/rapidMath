"use client";

import Link from "next/link";

import { LEVEL_CONFIG } from "@/lib/math/levels";

import styles from "./OperationCard.module.css";

export default function OperationCard({ operation }) {
  const Icon = operation.icon;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Icon size={28} />
        <h2>{operation.title}</h2>
      </div>

      {Object.entries(LEVEL_CONFIG).map(([level, config]) => (
        <Link
          href={`/practice/${operation.operation}/${level}`}
          className={styles.levelRow}
          key={level}
        >
          <span>Level {level}</span>
          <span>-</span>
          <span>New</span>
          <span>-</span>
        </Link>
      ))}
    </div>
  );
}
