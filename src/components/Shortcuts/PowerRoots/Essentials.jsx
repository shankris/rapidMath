// src/components/Shortcuts/PowerRoots/Essentials.jsx

"use client";

import styles from "./Essentials.module.css";

/* --------------------------------------------------
   Essentials data
-------------------------------------------------- */

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
  [11, 1331],
  [12, 1728],
  [13, 2197],
  [14, 2744],
  [15, 3375],
  [16, 4096],
  [17, 4913],
  [18, 5832],
  [19, 6859],
  [20, 8000],
];

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
  const squareColumns = getColumnGroups(squares, 2);
  const cubeColumns = getColumnGroups(cubes, 2);

  return (
    <section className={styles.essentials}>
      {/* --------------------------------------------------
          Introduction
      -------------------------------------------------- */}
      <p className={styles.description}>These are the basic values you should know without calculating. They form the foundation for many of the shortcuts in this section.</p>

      {/* --------------------------------------------------
          Essentials tables
      -------------------------------------------------- */}
      <div className={styles.tables}>
        {/* --------------------------------------------------
            Squares
        -------------------------------------------------- */}
        <div className={styles.tableSection}>
          <h3>Squares</h3>

          <div className={styles.tableGrid}>
            {squareColumns.map((group, groupIndex) => (
              <div
                className={styles.tableColumn}
                key={`square-column-${groupIndex}`}
              >
                {group.map(([number, square]) => (
                  <div
                    className={styles.tableRow}
                    key={`square-${number}`}
                  >
                    <span>{number}</span>
                    <strong>{square}</strong>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* --------------------------------------------------
            Cubes
        -------------------------------------------------- */}
        <div className={styles.tableSection}>
          <h3>Cubes</h3>

          <div className={styles.tableGrid}>
            {cubeColumns.map((group, groupIndex) => (
              <div
                className={styles.tableColumn}
                key={`cube-column-${groupIndex}`}
              >
                {group.map(([number, cube]) => (
                  <div
                    className={styles.tableRow}
                    key={`cube-${number}`}
                  >
                    <span>{number}</span>
                    <strong>{cube}</strong>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
