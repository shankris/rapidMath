````md
# DonutChart

A reusable donut chart component built with **Recharts**.

The component accepts chart data and an optional color palette through props. Categories representing less than 10% of the total are automatically grouped into an `Others` slice.

---

## Requirements

Install Recharts:

```bash
npm install recharts
```
````

The component uses:

```text
src/components/DonutChart/
├── DonutChart.jsx
├── DonutChart.module.css
└── DonutChart.md
```

---

## Basic Usage

Import the component:

```jsx
import DonutChart from "@/components/DonutChart/DonutChart";
```

Provide data through the `data` prop:

```jsx
const data = [
  { name: "Addition", value: 420 },
  { name: "Subtraction", value: 310 },
  { name: "Multiplication", value: 280 },
  { name: "Division", value: 190 },
];
```

Then render:

```jsx
<DonutChart data={data} />
```

---

## Using Custom Colors

Colors can be supplied through the `colors` prop.

```jsx
const colors = ["#4f46e5", "#0891b2", "#16a34a", "#d97706"];

<DonutChart
  data={data}
  colors={colors}
/>;
```

The colors are assigned to slices in the same order as the processed chart data.

If there are more slices than supplied colors, the component cycles through the color array.

For example:

```jsx
<DonutChart
  data={data}
  colors={["#2563eb", "#16a34a"]}
/>
```

will use:

```text
Slice 1 → #2563eb
Slice 2 → #16a34a
Slice 3 → #2563eb
Slice 4 → #16a34a
```

If `colors` is omitted, the component uses its built-in default palette.

---

## Data Format

Each data item requires:

| Property | Type   | Description                            |
| -------- | ------ | -------------------------------------- |
| `name`   | string | Label displayed in the tooltip         |
| `value`  | number | Numeric value represented by the slice |

Example:

```jsx
const data = [
  { name: "Addition", value: 420 },
  { name: "Subtraction", value: 310 },
  { name: "Multiplication", value: 280 },
  { name: "Division", value: 190 },
];
```

The component does not require percentages to be supplied. Percentages are calculated automatically from the values.

---

## Automatic `Others` Grouping

Individual categories representing **less than 10%** of the total are automatically combined into an `Others` slice.

For example:

```jsx
const data = [
  { name: "Addition", value: 500 },
  { name: "Subtraction", value: 300 },
  { name: "Multiplication", value: 150 },
  { name: "Division", value: 30 },
  { name: "Fractions", value: 20 },
];
```

The smaller categories are combined:

```text
Addition        500
Subtraction     300
Multiplication  150
Others           50
```

`Others` is treated as a normal chart slice and appears in the tooltip.

The 10% threshold applies to each original category before the smaller categories are combined.

---

## Tooltip

Hovering over a slice displays:

```text
Addition
420 questions · 42.0%
```

The tooltip percentage is calculated automatically from the original total.

---

## Empty Data

If no usable data is supplied, the component displays:

```text
No practice data yet
```

This occurs when:

- `data` is not an array
- `data` is empty
- the total value is zero or less

Example:

```jsx
<DonutChart data={[]} />
```

---

## Component Props

### `data`

Chart data.

```jsx
data={[
  { name: "Addition", value: 420 },
  { name: "Subtraction", value: 310 },
]}
```

Type:

```text
Array<{ name: string, value: number }>
```

Default:

```jsx
[];
```

---

### `colors`

Optional array of colors used for the donut slices.

```jsx
colors={[
  "#4f46e5",
  "#0891b2",
  "#16a34a",
]}
```

Type:

```text
string[]
```

If omitted, the component uses its default color palette.

---

## Complete Example

```jsx
"use client";

import DonutChart from "@/components/DonutChart/DonutChart";

export default function Example() {
  const data = [
    { name: "Addition", value: 420 },
    { name: "Subtraction", value: 310 },
    { name: "Multiplication", value: 280 },
    { name: "Division", value: 190 },
  ];

  const colors = ["#4f46e5", "#0891b2", "#16a34a", "#d97706"];

  return (
    <DonutChart
      data={data}
      colors={colors}
    />
  );
}
```

---

## Rapid Fire Math Example

Rapid Fire Math already has a `getPracticeDistribution()` utility.

The returned distribution can be converted into the format expected by `DonutChart`:

```jsx
import DonutChart from "@/components/DonutChart/DonutChart";
import { getPracticeDistribution } from "@/lib/stats/dashboard";
```

Inside the component:

```jsx
const distribution = getPracticeDistribution();

const data = Object.entries(distribution).map(([operation, value]) => ({
  name: operation,
  value,
}));
```

Then:

```jsx
<DonutChart data={data} />
```

A custom Rapid Fire Math palette can also be supplied:

```jsx
<DonutChart
  data={data}
  colors={["#4f46e5", "#0891b2", "#16a34a", "#d97706", "#9333ea", "#dc2626"]}
/>
```

---

## Design Notes

The component intentionally does not import or depend on:

- Rapid Fire Math storage
- Rapid Fire Math dashboard utilities
- Dashboard-specific data
- Operation names
- Application-specific business logic

This keeps `DonutChart` reusable across different projects.

The only project-specific dependency currently remaining is the CSS theme variables used by the tooltip and empty state:

```text
--mutedColor
--borderColor
--surfaceColor
--headingCol
--shadow-md
```

For use in another project, these can either be replaced with that project's variables or converted to component-local CSS values.

```

This gives you a standalone reference you can keep beside the component and copy with it into another project.
```
