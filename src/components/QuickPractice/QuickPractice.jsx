/* src/components/QuickPractice/QuickPractice.jsx */

"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

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
Get Local Date Key
-------------------------------------------------- */

function getLocalDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/* --------------------------------------------------
Get Start Of Week
-------------------------------------------------- */

function getStartOfWeek(date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const day = start.getDay();
  const daysFromMonday = day === 0 ? 6 : day - 1;

  start.setDate(start.getDate() - daysFromMonday);

  return start;
}

/* --------------------------------------------------
Get Date Group
-------------------------------------------------- */

function getDateGroup(timestamp) {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return {
      key: "earlier",
      label: "Earlier",
      sortDate: 0,
    };
  }

  const now = new Date();

  const todayKey = getLocalDateKey(now);
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  const yesterdayKey = getLocalDateKey(yesterday);
  const dateKey = getLocalDateKey(date);

  if (dateKey === todayKey) {
    return {
      key: "today",
      label: "Today",
      sortDate: date.getTime(),
    };
  }

  if (dateKey === yesterdayKey) {
    return {
      key: "yesterday",
      label: "Yesterday",
      sortDate: date.getTime(),
    };
  }

  const thisWeekStart = getStartOfWeek(now);
  const dateWeekStart = getStartOfWeek(date);

  if (dateWeekStart.getTime() === thisWeekStart.getTime()) {
    return {
      key: "thisWeek",
      label: "This Week",
      sortDate: date.getTime(),
    };
  }

  const lastWeekStart = new Date(thisWeekStart);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);

  if (dateWeekStart.getTime() === lastWeekStart.getTime()) {
    return {
      key: "lastWeek",
      label: "Last Week",
      sortDate: date.getTime(),
    };
  }

  const differenceInWeeks = Math.floor((thisWeekStart.getTime() - dateWeekStart.getTime()) / (7 * 24 * 60 * 60 * 1000));

  if (differenceInWeeks >= 2) {
    return {
      key: `${differenceInWeeks}WeeksAgo`,
      label: `${differenceInWeeks} Weeks Ago`,
      sortDate: date.getTime(),
    };
  }

  return {
    key: "earlier",
    label: "Earlier",
    sortDate: date.getTime(),
  };
}

/* --------------------------------------------------
Group Recently Used Practice
-------------------------------------------------- */

function groupRecentlyUsedPractice(recentPractice) {
  const groups = {};

  recentPractice.forEach((item) => {
    const dateGroup = getDateGroup(item.lastUsed);

    if (!groups[dateGroup.key]) {
      groups[dateGroup.key] = {
        key: dateGroup.key,
        label: dateGroup.label,
        sortDate: dateGroup.sortDate,
        operations: {},
      };
    }

    const group = groups[dateGroup.key];

    if (!group.operations[item.operation]) {
      group.operations[item.operation] = {
        operation: item.operation,
        levels: [],
      };
    }

    group.operations[item.operation].levels.push(item);
  });

  return Object.values(groups)
    .sort((a, b) => b.sortDate - a.sortDate)
    .map((group) => ({
      ...group,
      operations: Object.values(group.operations),
    }));
}

/* --------------------------------------------------
Quick Practice
-------------------------------------------------- */

export default function QuickPractice({ recentPractice = [] }) {
  const locale = useLocale();
  const t = useTranslations("Dashboard");

  const groupedPractice = groupRecentlyUsedPractice(recentPractice);

  return (
    <section className={`card ${styles.quickPractice}`}>
      <div className={styles.heading}>
        <h2>{t("title")}</h2>
      </div>

      <div className={styles.recentSection}>
        <h3>{t("recentlyUsed")}</h3>

        {groupedPractice.length > 0 ? (
          <div className={styles.dateGroups}>
            {groupedPractice.map((group) => (
              <section
                key={group.key}
                className={styles.dateGroup}
              >
                <div className={styles.dateHeading}>{group.label}</div>

                <div className={styles.operationList}>
                  {group.operations.map((operation) => (
                    <div
                      key={operation.operation}
                      className={styles.operationRow}
                    >
                      <div className={styles.operationName}>{OPERATION_NAMES[operation.operation] ?? operation.operation}</div>

                      <div className={styles.levelList}>
                        {operation.levels.map((item) => {
                          const levelContent = <span className={styles.level}>{item.level}</span>;

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
              </section>
            ))}
          </div>
        ) : (
          <p className={styles.emptyState}>{t("noRecentPractice")}</p>
        )}
      </div>
    </section>
  );
}
