import styles from "./TimeCell.module.css";

/* --------------------------------------------------
   Time Cell

   Formats numeric durations in seconds.

   Decimals can be controlled through config:
   config={{ decimals: 2 }}
-------------------------------------------------- */

export default function TimeCell({ value, config = {} }) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "—";
  }

  const decimals = Number.isInteger(config.decimals) ? config.decimals : 1;

  const formattedNumber = decimals > 0 ? number.toFixed(decimals).replace(/\.?0+$/, "") : Math.round(number).toString();

  return <span className={styles.time}>{formattedNumber}s</span>;
}
