/* src/components/DonutChart/DonutChart.jsx */

"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import styles from "./DonutChart.module.css";

/* --------------------------------------------------
   Configuration
-------------------------------------------------- */

const GROUP_THRESHOLD = 10;

const DEFAULT_COLORS = ["#4f46e5", "#0891b2", "#16a34a", "#d97706", "#dc2626", "#9333ea", "#0f766e", "#ca8a04"];

/* --------------------------------------------------
   Prepare Chart Data
-------------------------------------------------- */

function prepareChartData(data) {
  if (!Array.isArray(data) || data.length === 0) {
    return [];
  }

  const total = data.reduce((sum, item) => sum + Number(item.value || 0), 0);

  if (total <= 0) {
    return [];
  }

  const visibleItems = [];
  let othersValue = 0;
  let othersQuestions = 0;

  data.forEach((item) => {
    const value = Number(item.value || 0);
    const percentage = (value / total) * 100;

    if (percentage < GROUP_THRESHOLD) {
      othersValue += value;
      othersQuestions += Number(item.questions || 0);
      return;
    }

    visibleItems.push({
      ...item,
      value,
    });
  });

  if (othersValue > 0) {
    visibleItems.push({
      name: "Others",
      value: othersValue,
      questions: othersQuestions,
      accuracy: null,
    });
  }

  return visibleItems;
}

/* --------------------------------------------------
   Tooltip
-------------------------------------------------- */

function CustomTooltip({ active, payload }) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const item = payload[0].payload;

  return (
    <div className={styles.tooltip}>
      <strong className={styles.tooltipTitle}>{item.name}</strong>

      <span className={styles.tooltipValue}>{Math.round(item.questions || 0)} Questions</span>

      {item.accuracy !== null && item.accuracy !== undefined && <span className={styles.tooltipValue}>{Math.round(item.accuracy)}% accuracy</span>}
    </div>
  );
}

/* --------------------------------------------------
   Donut Chart
-------------------------------------------------- */

export default function DonutChart({ data = [], colors = DEFAULT_COLORS }) {
  const chartData = prepareChartData(data);

  if (chartData.length === 0) {
    return <div className={styles.empty}>No practice data yet</div>;
  }

  const chartColors = Array.isArray(colors) && colors.length > 0 ? colors : DEFAULT_COLORS;

  return (
    <div className={styles.chart}>
      <ResponsiveContainer
        width='100%'
        height='100%'
      >
        <PieChart>
          <Pie
            data={chartData}
            dataKey='value'
            nameKey='name'
            cx='50%'
            cy='50%'
            innerRadius='58%'
            outerRadius='78%'
            paddingAngle={2}
            stroke='none'
          >
            {chartData.map((item, index) => (
              <Cell
                key={`${item.name}-${index}`}
                fill={chartColors[index % chartColors.length]}
              />
            ))}
          </Pie>

          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
