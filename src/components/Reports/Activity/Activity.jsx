"use client";

import { useEffect, useState } from "react";

import DataTable from "@/components/UI/DataTable/DataTable";
import { getRecentAttempts } from "@/lib/stats/recentActivity";

import styles from "./Activity.module.css";

/* --------------------------------------------------
   Operation Labels
-------------------------------------------------- */

const OPERATION_LABELS = {
  add: "Addition",
  sub: "Subtraction",
  mul: "Multiplication",
  div: "Division",
};

/* --------------------------------------------------
   Activity Table Columns
-------------------------------------------------- */

const columns = [
  {
    key: "startedAt",
    label: "Date & Time",
    align: "left",
    cell: "DateTimeISOCell",
  },
  {
    key: "startedAt",
    label: "Relative Date",
    align: "left",
    cell: "RelativeDateCell",
  },
  {
    key: "operationLabel",
    label: "Operation",
    align: "left",
  },
  {
    key: "questionsSort",
    label: "Correct / Questions",
    align: "right",
    cell: "RatioCell",
    numerator: "correct",
    denominator: "questions",
  },
  {
    key: "accuracy",
    label: "Accuracy",
    align: "right",
    cell: "PercentageCell",
  },
  {
    key: "averageTime",
    label: "Avg. Time",
    align: "right",
    cell: "TimeCell",
  },
  {
    key: "totalTime",
    label: "Total Time",
    align: "right",
    cell: "TimeCell",
  },
];

/* --------------------------------------------------
   Activity Component
-------------------------------------------------- */

export default function Activity() {
  const [data, setData] = useState([]);

  /* --------------------------------------------------
     Load Activity Data

     localStorage is only available in the browser,
     so activity data is loaded after the component
     mounts to avoid a hydration mismatch.
  -------------------------------------------------- */

  useEffect(() => {
    const attempts = getRecentAttempts();

    const activity = attempts.map((attempt) => ({
      ...attempt,

      operationLabel: `${OPERATION_LABELS[attempt.operation] || attempt.operation} ${attempt.level}`,

      questionsSort: attempt.accuracy,
    }));

    setData(activity);
  }, []);

  return (
    <div className={styles.container}>
      <DataTable
        data={data}
        config={columns}
      />
    </div>
  );
}
