"use client";
/* src/components/QuickPractice/QuickPractice.jsx */

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { getRecentlyUsedPractice } from "@/lib/stats/dashboard";

import styles from "./QuickPractice.module.css";

/* --------------------------------------------------
Operation Display Names
-------------------------------------------------- */

const OPERATION_NAMES = {
  add: "Addition",
  sub: "Subtraction",
  mul: "Multiplication",
  div: "Division",
  mixedOperations: "Mixed Operations",
  missingNumber: "Missing Number",
  comparison: "Comparison",
  estimation: "Estimation",
  sequences: "Sequences & Progressions",
  fractions: "Fractions",
  percentages: "Percentages",
  powersRoots: "Powers & Roots",
};

/* --------------------------------------------------
Get Top Recently Used Practice
-------------------------------------------------- */

function getTopRecentlyUsedPractice(recentPractice) {
  const groups = {};

  recentPractice.slice(0, 20).forEach((item) => {
    if (!groups[item.operation]) {
      groups[item.operation] = {
        operation: item.operation,
        levels: [],
        mostRecent: item.lastUsed,
      };
    }

    groups[item.operation].levels.push(item);
  });

  return Object.values(groups)
    .map((operation) => ({
      ...operation,
      levels: operation.levels.sort((a, b) => Number(a.level) - Number(b.level)),
    }))
    .sort((a, b) => new Date(b.mostRecent).getTime() - new Date(a.mostRecent).getTime());
}

/* --------------------------------------------------
Quick Practice
-------------------------------------------------- */

export default function QuickPractice() {
  const locale = useLocale();
  const t = useTranslations("Dashboard");

  const recentPractice = getRecentlyUsedPractice();

  const groupedPractice = getTopRecentlyUsedPractice(recentPractice);

  return (
    <section className={`card ${styles.quickPractice}`}>
      <div className={styles.heading}>
        <h2>{t("quickPractice.title")}</h2>
      </div>

      <div className={styles.recentSection}>
        {groupedPractice.length > 0 ? (
          <div className={styles.operationList}>
            {groupedPractice.map((operation) => (
              <div
                key={operation.operation}
                className={styles.operationRow}
              >
                <div className={styles.operationName}>{OPERATION_NAMES[operation.operation] ?? operation.operation}</div>

                <div className={styles.levelList}>
                  {operation.levels.map((item) => {
                    const levelContent = <span className={styles.level}>L{item.level}</span>;

                    if (!item.practiceUrl) {
                      return (
                        <span
                          key={`${item.operation}-${item.level}`}
                          className={styles.levelDisabled}
                        >
                          {levelContent}
                        </span>
                      );
                    }

                    return (
                      <Link
                        key={`${item.operation}-${item.level}`}
                        href={`/${locale}/${item.practiceUrl}`}
                        className={styles.levelLink}
                      >
                        {levelContent}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.emptyState}>{t("quickPractice.noRecentPractice")}</p>
        )}
      </div>
    </section>
  );
}
