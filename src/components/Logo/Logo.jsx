"use client";

/* src/components/Logo/Logo.jsx */

import styles from "./Logo.module.css";

export default function Logo() {
  return (
    <>
      <div className={styles.logo}>
        <span>R</span>
        <span>A</span>
        <span>P</span>
        <span>I</span>
        <span>D</span>
        <div className={styles.math}>Math</div>
      </div>
    </>
  );
}
