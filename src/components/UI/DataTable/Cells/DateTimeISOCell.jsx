import styles from "./DateTimeISOCell.module.css";

/* --------------------------------------------------
   DateTime ISO Cell

   Formats an ISO 8601 timestamp using the user's
   local timezone and locale.
-------------------------------------------------- */

export default function DateTimeISOCell({ value, config = {} }) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  const options = {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    ...config,
  };

  const formattedDateTime = new Intl.DateTimeFormat(undefined, options).format(date);

  return <span className={styles.dateTime}>{formattedDateTime}</span>;
}
