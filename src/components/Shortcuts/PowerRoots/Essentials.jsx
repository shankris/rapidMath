// src/components/Shortcuts/PowerRoots/Essentials.jsx

"use client";

import { useState } from "react";
import styles from "./Essentials.module.css";

/* --------------------------------------------------
   Essentials data
-------------------------------------------------- */

const tabs = [
  {
    id: "squares",
    label: "Squares",
  },
  {
    id: "cubes",
    label: "Cubes",
  },
  {
    id: "squareRoots",
    label: "Square Roots",
  },
  {
    id: "cubeRoots",
    label: "Cube Roots",
  },
];

const squares = [
  [1, 1],
  [2, 4],
  [3, 9],
  [4, 16],
  [5, 25],
  [6, 36],
  [7, 49],
  [8, 64],
  [9, 81],
  [10, 100],
  [11, 121],
  [12, 144],
  [13, 169],
  [14, 196],
  [15, 225],
  [16, 256],
  [17, 289],
  [18, 324],
  [19, 361],
  [20, 400],
];

const cubes = [
  [1, 1],
  [2, 8],
  [3, 27],
  [4, 64],
  [5, 125],
  [6, 216],
  [7, 343],
  [8, 512],
  [9, 729],
  [10, 1000],
];

const squareRoots = [
  [1, 1],
  [4, 2],
  [9, 3],
  [16, 4],
  [25, 5],
  [36, 6],
  [49, 7],
  [64, 8],
  [81, 9],
  [100, 10],
  [121, 11],
  [144, 12],
  [169, 13],
  [196, 14],
  [225, 15],
  [256, 16],
  [289, 17],
  [324, 18],
  [361, 19],
  [400, 20],
];

const cubeRoots = [
  [1, 1],
  [8, 2],
  [27, 3],
  [64, 4],
  [125, 5],
  [216, 6],
  [343, 7],
  [512, 8],
  [729, 9],
  [1000, 10],
];

/* --------------------------------------------------
   Tab content
-------------------------------------------------- */

const tabContent = {
  squares: {
    heading: "Squares",
    description: "Know these squares instantly.",
    rows: squares,
    leftLabel: "Number",
    rightLabel: "Square",
  },

  cubes: {
    heading: "Cubes",
    description: "Know these cubes instantly.",
    rows: cubes,
    leftLabel: "Number",
    rightLabel: "Cube",
  },

  squareRoots: {
    heading: "Square Roots",
    description: "Recognize these perfect squares instantly.",
    rows: squareRoots,
    leftLabel: "Square",
    rightLabel: "Root",
  },

  cubeRoots: {
    heading: "Cube Roots",
    description: "Recognize these perfect cubes instantly.",
    rows: cubeRoots,
    leftLabel: "Cube",
    rightLabel: "Root",
  },
};

/* --------------------------------------------------
   Split rows into sequential columns
-------------------------------------------------- */

const getColumnGroups = (rows, columnCount = 2) => {
  const groupCount = Math.min(columnCount, rows.length);
  const baseSize = Math.floor(rows.length / groupCount);
  const remainder = rows.length % groupCount;

  const groups = [];
  let start = 0;

  for (let i = 0; i < groupCount; i++) {
    const size = baseSize + (i < remainder ? 1 : 0);

    groups.push(rows.slice(start, start + size));

    start += size;
  }

  return groups;
};

/* --------------------------------------------------
   Component
-------------------------------------------------- */

export default function Essentials() {
  const [activeTab, setActiveTab] = useState("squares");

  const content = tabContent[activeTab];
  const columnGroups = getColumnGroups(content.rows, 2);

  return (
    <section className={styles.essentials}>
      {/* --------------------------------------------------
          Header
      -------------------------------------------------- */}
      <header className={styles.header}>
        <p>These are the basic values you should know without calculating. They form the foundation for many of the shortcuts in this section.</p>
      </header>

      {/* --------------------------------------------------
          Tabs
      -------------------------------------------------- */}
      <div
        className={styles.tabs}
        role='tablist'
        aria-label='Powers and roots essentials'
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type='button'
            role='tab'
            aria-selected={activeTab === tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* --------------------------------------------------
          Active tab content
      -------------------------------------------------- */}
      <div
        className={styles.content}
        role='tabpanel'
        aria-label={content.heading}
      >
        <div className={styles.contentHeader}>
          <h3>{content.heading}</h3>
          <p>{content.description}</p>
        </div>

        <div className={styles.tableGrid}>
          {columnGroups.map((group, groupIndex) => (
            <div
              className={styles.tableColumn}
              key={`column-${groupIndex}`}
            >
              <div className={styles.tableColumnHeader}>
                <span>{content.leftLabel}</span>
                <span>{content.rightLabel}</span>
              </div>

              {group.map(([left, right]) => (
                <div
                  className={styles.tableRow}
                  key={`${left}-${right}`}
                >
                  <span>{left}</span>
                  <strong>{right}</strong>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
