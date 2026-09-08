"use client";

import { useEffect, useState } from "react";

import { getDashboardStats, getAvailablePeriods } from "@/lib/stats/dashboardStats";

/* --------------------------------------------------
   Development Statistics Test Page
-------------------------------------------------- */

export default function StatsTestPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const periods = ["1w", "2w", "1m", "3m", "6m", "1y", "all"];

    const availablePeriods = getAvailablePeriods();

    const results = periods.map((period) => ({
      period,
      stats: getDashboardStats(period),
    }));

    setStats({
      availablePeriods,
      results,
    });
  }, []);

  if (!stats) {
    return (
      <main
        style={{
          padding: "40px",
          fontFamily: "sans-serif",
        }}
      >
        <h1>Dashboard Statistics Test</h1>

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
      <h1>Dashboard Statistics Test</h1>

      <p>Available periods: {stats.availablePeriods.join(" · ") || "None"}</p>

      {stats.results.map(({ period, stats }) => (
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
