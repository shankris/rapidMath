// RatioCell.jsx

import styles from "./RatioCell.module.css";

/* --------------------------------------------------
   Ratio Cell

   Displays two numeric values as a ratio.

   Example:
   numerator: 18
   denominator: 20
   → 18 / 20

   Source fields are configured through:
   config={{
     numerator: "correct",
     denominator: "questions",
   }}
-------------------------------------------------- */

export default function RatioCell({ config = {}, ...row }) {
  const numeratorKey = config.numerator;
  const denominatorKey = config.denominator;

  if (!numeratorKey || !denominatorKey) {
    return "—";
  }

  const numerator = Number(row[numeratorKey]);
  const denominator = Number(row[denominatorKey]);

  if (!Number.isFinite(numerator) || !Number.isFinite(denominator)) {
    return "—";
  }

  return (
    <span className={styles.ratio}>
      {numerator} / {denominator}
    </span>
  );
}
