"use client";

import { useState } from "react";

import { getStreak, updateStreak, clearStreak } from "@/lib/storage/streak";

/* --------------------------------------------------
   Streak Development Test Page
-------------------------------------------------- */

export default function StreakTestPage() {
  const [streak, setStreak] = useState(null);

  /* ------------------------------------------------
     Read Streak
  ------------------------------------------------ */

  function handleGetStreak() {
    setStreak(getStreak());
  }

  /* ------------------------------------------------
     Update Streak
  ------------------------------------------------ */

  function handleUpdateStreak() {
    const updatedStreak = updateStreak();

    setStreak(updatedStreak);
  }

  /* ------------------------------------------------
     Clear Streak
  ------------------------------------------------ */

  function handleClearStreak() {
    clearStreak();

    setStreak(getStreak());
  }

  return (
    <main
      style={{
        padding: "40px",
        fontFamily: "sans-serif",
      }}
    >
      <h1>Streak Test</h1>

      <div
        style={{
          display: "flex",
          gap: "12px",
          marginTop: "24px",
          flexWrap: "wrap",
        }}
      >
        <button onClick={handleGetStreak}>Get Streak</button>

        <button onClick={handleUpdateStreak}>Update Streak</button>

        <button onClick={handleClearStreak}>Clear Streak</button>
      </div>

      {streak && (
        <pre
          style={{
            marginTop: "30px",
            padding: "20px",
            background: "#f1f5f9",
            borderRadius: "8px",
          }}
        >
          {JSON.stringify(streak, null, 2)}
        </pre>
      )}
    </main>
  );
}
