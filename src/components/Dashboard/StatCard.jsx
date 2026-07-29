import styles from "./StatCard.module.css";

export default function StatCard({ icon, title, value }) {
  return (
    <div className={`card ${styles.statCard}`}>
      <div className={styles.icon}>{icon}</div>

      <div className={styles.value}>{value}</div>

      <div className={styles.title}>{title}</div>
    </div>
  );
}
