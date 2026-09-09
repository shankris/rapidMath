// PercentageCell.jsx

import styles from "./PercentageCell.module.css";

/* --------------------------------------------------
   Percentage Cell

   Formats numeric values as percentages.

   Decimals can be controlled through config:
   config={{ decimals: 1 }}
-------------------------------------------------- */

export default function PercentageCell({ value, config = {} }) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "—";
  }

  const decimals = Number.isInteger(config.decimals) ? config.decimals : 1;

  const formattedNumber = decimals > 0 ? number.toFixed(decimals).replace(/\.?0+$/, "") : Math.round(number).toString();

  return <span className={styles.percentage}>{formattedNumber}%</span>;
}
