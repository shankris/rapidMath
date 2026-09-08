// src/app/dev/stats/activity/page.jsx

"use client";

import { useEffect, useState } from "react";

import { getRecentActivity, getHeatMapActivity } from "@/lib/stats/activityStats";

/* --------------------------------------------------
   Activity Statistics Test Page
-------------------------------------------------- */

export default function ActivityStatsTestPage() {
  const [results, setResults] = useState(null);

  useEffect(() => {
    const recentActivity = getRecentActivity();
    const heatMapActivity = getHeatMapActivity("1y");

    setResults({
      recentActivity,
      heatMapActivity,
    });
  }, []);

  if (!results) {
    return (
      <main
        style={{
          padding: "40px",
          fontFamily: "sans-serif",
        }}
      >
        <h1>Activity Statistics Test</h1>
        <p>Loading activity data...</p>
      </main>
    );
  }

  const { recentActivity, heatMapActivity } = results;

  /* ------------------------------------------------
     Calculate Summary Statistics
  ------------------------------------------------ */

  const activeDays = heatMapActivity.filter((day) => day.questions > 0).length;

  const totalQuestions = heatMapActivity.reduce((total, day) => total + day.questions, 0);

  const totalCorrect = heatMapActivity.reduce((total, day) => total + day.correct, 0);

  const totalTests = heatMapActivity.reduce((total, day) => total + day.tests, 0);

  return (
    <main
      style={{
        padding: "40px",
        fontFamily: "sans-serif",
      }}
    >
      <h1>Activity Statistics Test</h1>

      {/* --------------------------------------------
          Summary
      -------------------------------------------- */}

      <section
        style={{
          marginTop: "24px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      >
        <h2>1-Year Summary</h2>

        <p>Active days: {activeDays}</p>

        <p>Questions: {totalQuestions}</p>

        <p>Correct: {totalCorrect}</p>

        <p>Tests: {totalTests}</p>
      </section>

      {/* --------------------------------------------
          Recent Activity
      -------------------------------------------- */}

      <section
        style={{
          marginTop: "24px",
        }}
      >
        <h2>Recent Activity — 30 Days</h2>

        <pre
          style={{
            padding: "20px",
            background: "#f5f5f5",
            borderRadius: "8px",
            overflowX: "auto",
          }}
        >
          {JSON.stringify(recentActivity, null, 2)}
        </pre>
      </section>

      {/* --------------------------------------------
          Heat Map Activity
      -------------------------------------------- */}

      <section
        style={{
          marginTop: "24px",
        }}
      >
        <h2>Heat Map Activity — 1 Year</h2>

        <p>Days returned: {heatMapActivity.length}</p>

        <pre
          style={{
            padding: "20px",
            background: "#f5f5f5",
            borderRadius: "8px",
            overflowX: "auto",
          }}
        >
          {JSON.stringify(heatMapActivity, null, 2)}
        </pre>
      </section>
    </main>
  );
}
