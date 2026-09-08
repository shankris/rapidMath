"use client";

import { useEffect, useState } from "react";

import { getOperationStats } from "@/lib/stats/operationStats";

/* --------------------------------------------------
   Operation Statistics Test Page
-------------------------------------------------- */

export default function OperationStatsTestPage() {
  const [results, setResults] = useState(null);

  useEffect(() => {
    const periods = ["1w", "2w", "1m", "3m", "6m", "1y", "all"];

    const statistics = periods.map((period) => ({
      period,
      stats: getOperationStats(period),
    }));

    setResults(statistics);
  }, []);

  if (!results) {
    return (
      <main
        style={{
          padding: "40px",
          fontFamily: "sans-serif",
        }}
      >
        <h1>Operation Statistics Test</h1>
        <p>Loading statistics...</p>
      </main>
    );
  }

  return (
    <main
      style={{
        padding: "40px",
        fontFamily: "sans-serif",
      }}
    >
      <h1>Operation Statistics Test</h1>

      {results.map(({ period, stats }) => (
        <section
          key={period}
          style={{
            marginTop: "24px",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          <h2>{period}</h2>

          <pre>{JSON.stringify(stats, null, 2)}</pre>
        </section>
      ))}
    </main>
  );
}
