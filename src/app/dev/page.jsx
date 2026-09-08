"use client";

import { seedDemoData, clearDemoData } from "@/lib/storage/seedDemoData";

import styles from "./page.module.css";

/* --------------------------------------------------
   Development Page
-------------------------------------------------- */

export default function DevelopmentPage() {
  /* --------------------------------------------------
     Generate Demo Data
  -------------------------------------------------- */

  function handleSeedData() {
    seedDemoData();

    alert("Demo data generated successfully.");
  }

  /* --------------------------------------------------
     Clear Demo Data
  -------------------------------------------------- */

  function handleClearData() {
    clearDemoData();

    alert("All Rapid Fire Math data has been cleared.");
  }

  /* --------------------------------------------------
     Render
  -------------------------------------------------- */

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h1>Development Tools</h1>

        <p className={styles.description}>Tools for generating and clearing demo data while developing the dashboard.</p>

        {/* ------------------------------------------------
            Demo Data
        ------------------------------------------------ */}

        <section className={styles.section}>
          <h2>Demo Data</h2>

          <p>Generate approximately one year of realistic practice history for dashboard testing.</p>

          <button
            className={styles.primaryButton}
            onClick={handleSeedData}
          >
            Generate Demo Data
          </button>
        </section>

        {/* ------------------------------------------------
            Clear Data
        ------------------------------------------------ */}

        <section className={styles.section}>
          <h2>Clear Data</h2>

          <p>Remove all Rapid Fire Math data from localStorage.</p>

          <button
            className={styles.dangerButton}
            onClick={handleClearData}
          >
            Clear All Data
          </button>
        </section>
      </div>
    </main>
  );
}
