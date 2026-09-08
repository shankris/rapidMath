"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getActivityForPeriod } from "@/lib/stats/activityStats";
import styles from "./PerformanceTrend.module.css";

/* --------------------------------------------------
   Performance Trend
-------------------------------------------------- */

export default function PerformanceTrend({ period = "1m" }) {
  const data = getActivityForPeriod(period);

  /* --------------------------------------------------
   Bar Size
-------------------------------------------------- */

  const barSize = period === "1w" ? 30 : period === "2w" ? 20 : period === "1m" ? 10 : period === "3m" ? 5 : period === "6m" ? 3 : 2;

  return (
    <div className={styles.chartContainer}>
      <ResponsiveContainer
        width='100%'
        height={320}
      >
        <BarChart
          data={data}
          margin={{
            top: 26,
            right: 10,
            left: 0,
            bottom: 0,
          }}
        >
          {/* ----------------------------------------
              Grid
          ---------------------------------------- */}

          <CartesianGrid
            vertical={false}
            strokeDasharray='3 3'
          />

          {/* ----------------------------------------
              X Axis
          ---------------------------------------- */}

          <XAxis
            dataKey='date'
            tickFormatter={(value) => {
              const date = new Date(`${value}T00:00:00`);

              if (period === "1w" || period === "2w" || period === "1m") {
                return String(date.getDate()).padStart(2, "0");
              }

              return date.toLocaleDateString("en-US", {
                month: "short",
              });
            }}
            interval={period === "1y" ? 29 : period === "6m" ? 14 : period === "3m" ? 6 : 0}
            tick={{
              fontSize: 11,
            }}
            tickLine={false}
            axisLine={false}
          />

          {/* ----------------------------------------
              Y Axis
          ---------------------------------------- */}

          <YAxis
            allowDecimals={false}
            width={28}
            tick={{
              fontSize: 10,
            }}
            tickLine={false}
            axisLine={false}
          />

          {/* ----------------------------------------
              Tooltip
          ---------------------------------------- */}

          <Tooltip />

          {/* ----------------------------------------
              Correct Answers
          ---------------------------------------- */}

          <Bar
            dataKey='correct'
            stackId='questions'
            fill='var(--accentColor)'
            name='Correct'
            barSize={barSize}
          />

          {/* ----------------------------------------
              Incorrect Answers
          ---------------------------------------- */}

          <Bar
            dataKey='incorrect'
            stackId='questions'
            fill='var(--borderColor)'
            name='Incorrect'
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
