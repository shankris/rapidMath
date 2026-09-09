import styles from "./RelativeDateCell.module.css";

/* --------------------------------------------------
   Relative Date Cell

   Displays a relative date label based on the user's
   local calendar date.

   Weeks begin on Sunday.

   Examples:
   Today
   Yesterday
   2d ago
   Last week
   2w ago
-------------------------------------------------- */

export default function RelativeDateCell({ value }) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  const now = new Date();

  /* --------------------------------------------------
     Normalize Both Dates

     Only the local calendar dates are relevant here.
     The time of day is deliberately ignored.
  -------------------------------------------------- */

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const millisecondsPerDay = 24 * 60 * 60 * 1000;

  const daysAgo = Math.floor((today - targetDate) / millisecondsPerDay);

  if (daysAgo < 0) {
    return "—";
  }

  if (daysAgo === 0) {
    return <span className={styles.relativeDate}>Today</span>;
  }

  if (daysAgo === 1) {
    return <span className={styles.relativeDate}>Yesterday</span>;
  }

  /* --------------------------------------------------
     Current Week

     Sunday is day 0 of the week.

     Dates earlier in the current week are displayed
     as 2d ago, 3d ago, etc.
  -------------------------------------------------- */

  const currentDayOfWeek = today.getDay();

  if (daysAgo <= currentDayOfWeek) {
    return <span className={styles.relativeDate}>{daysAgo}d ago</span>;
  }

  /* --------------------------------------------------
     Previous Weeks

     Once we cross the previous Sunday, calculate the
     calendar-week distance.

     Previous calendar week = Last week
     Two calendar weeks ago = 2w ago
     Three calendar weeks ago = 3w ago
  -------------------------------------------------- */

  const daysSinceStartOfCurrentWeek = currentDayOfWeek;

  const daysIntoPreviousWeeks = daysAgo - daysSinceStartOfCurrentWeek;

  const weeksAgo = Math.floor((daysIntoPreviousWeeks - 1) / 7) + 1;

  if (weeksAgo === 1) {
    return <span className={styles.relativeDate}>Last week</span>;
  }

  return <span className={styles.relativeDate}>{weeksAgo}w ago</span>;
}
