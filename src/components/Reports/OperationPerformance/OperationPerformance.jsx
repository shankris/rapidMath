"use client";

import { flexRender, getCoreRowModel, getExpandedRowModel, useReactTable } from "@tanstack/react-table";

import { AnimatePresence, motion } from "motion/react";

import { useEffect, useMemo, useState } from "react";

import { getOperationStats } from "@/lib/stats/operationStats";
import ProgressBar from "@/components/UI/ProgressBar/ProgressBar";

import styles from "./OperationPerformance.module.css";

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
   Operation Performance Component
-------------------------------------------------- */

export default function OperationPerformance({ period = "1m" }) {
  const [stats, setStats] = useState(null);

  /* --------------------------------------------------
     Load Statistics
  -------------------------------------------------- */

  useEffect(() => {
    const data = getOperationStats(period);

    setStats(data);
  }, [period]);

  /* --------------------------------------------------
     Prepare Table Data
  -------------------------------------------------- */

  const data = useMemo(() => {
    if (!stats) {
      return [];
    }

    return Object.entries(OPERATION_LABELS).map(([operation, label]) => {
      const operationStats = stats[operation];

      return {
        id: operation,

        operation: label,

        accuracy: operationStats.accuracy,

        correct: operationStats.correctAnswers,

        questions: operationStats.questionsAnswered,

        averageTime: operationStats.averageTime,

        tests: operationStats.testsCompleted,

        /* ------------------------------------------
           Level Rows
        ------------------------------------------ */

        subRows: [1, 2, 3, 4].map((level) => {
          const levelStats = operationStats.levels[level];

          return {
            id: `${operation}-${level}`,

            operation: `Level ${level}`,

            level,

            accuracy: levelStats.accuracy,

            correct: levelStats.correctAnswers,

            questions: levelStats.questionsAnswered,

            averageTime: levelStats.averageTime,

            tests: levelStats.testsCompleted,
          };
        }),
      };
    });
  }, [stats]);

  /* --------------------------------------------------
     Table Columns
  -------------------------------------------------- */

  const columns = useMemo(
    () => [
      {
        id: "operation",

        header: "Operation",

        accessorKey: "operation",

        cell: ({ row }) => {
          const isLevel = row.depth > 0;

          return (
            <div className={isLevel ? styles.levelName : styles.operationName}>
              {!isLevel && (
                <button
                  type='button'
                  className={styles.expandButton}
                  onClick={() => row.toggleExpanded()}
                  aria-label={row.getIsExpanded() ? `Collapse ${row.original.operation}` : `Expand ${row.original.operation}`}
                  aria-expanded={row.getIsExpanded()}
                >
                  <motion.span
                    animate={{
                      rotate: row.getIsExpanded() ? 90 : 0,
                    }}
                    transition={{
                      duration: 0.2,
                      ease: "easeOut",
                    }}
                  >
                    ›
                  </motion.span>
                </button>
              )}

              {isLevel && <span className={styles.levelIndent} />}

              <span>{row.original.operation}</span>
            </div>
          );
        },
      },

      /* --------------------------------------------
         Performance
      -------------------------------------------- */

      {
        id: "performance",

        header: "Performance",

        cell: ({ row }) => (
          <div className={styles.progressWrapper}>
            <ProgressBar
              value={row.original.accuracy}
              height={16}
            />
          </div>
        ),
      },

      /* --------------------------------------------
         Correct / Questions
      -------------------------------------------- */

      {
        id: "correct",

        header: "Correct / Questions",

        cell: ({ row }) => (
          <span>
            {row.original.correct} / {row.original.questions}
          </span>
        ),
      },

      /* --------------------------------------------
         Average Time
      -------------------------------------------- */

      {
        id: "averageTime",

        header: "Avg. Time",

        cell: ({ row }) => <span>{row.original.averageTime}s</span>,
      },

      /* --------------------------------------------
         Tests
      -------------------------------------------- */

      {
        id: "tests",

        header: "Tests",

        cell: ({ row }) => <span>{row.original.tests}</span>,
      },
    ],
    [],
  );

  /* --------------------------------------------------
     Create TanStack Table
  -------------------------------------------------- */

  const table = useReactTable({
    data,

    columns,

    getSubRows: (row) => row.subRows,

    getCoreRowModel: getCoreRowModel(),

    getExpandedRowModel: getExpandedRowModel(),
  });

  /* --------------------------------------------------
     Loading State
  -------------------------------------------------- */

  if (!stats) {
    return null;
  }

  /* --------------------------------------------------
     Render
  -------------------------------------------------- */

  const rows = table.getRowModel().rows;

  return (
    <div className={styles.container}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={header.column.id === "operation" ? styles.left : styles.right}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            <AnimatePresence initial={false}>
              {rows.map((row) => {
                const isLevel = row.depth > 0;

                const cells = row.getVisibleCells();

                /* ----------------------------------
                   Operation Rows
                ---------------------------------- */

                if (!isLevel) {
                  return (
                    <tr
                      key={row.id}
                      className={styles.operationRow}
                    >
                      {cells.map((cell) => (
                        <td
                          key={cell.id}
                          className={cell.column.id === "operation" ? styles.left : styles.right}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  );
                }

                /* ----------------------------------
                   Level Rows
                ---------------------------------- */

                return (
                  <motion.tr
                    key={row.id}
                    initial={{
                      opacity: 0,
                      y: -8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: -8,
                    }}
                    transition={{
                      duration: 0.2,
                      ease: "easeOut",
                    }}
                    className={styles.levelRow}
                  >
                    {cells.map((cell) => (
                      <td
                        key={cell.id}
                        className={cell.column.id === "operation" ? styles.left : styles.right}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
