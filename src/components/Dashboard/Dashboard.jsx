import styles from "./Dashboard.module.css";
import StatCard from "./StatCard";

export default function Dashboard() {
  return (
    <section className={styles.dashboard}>
      {/* Welcome section */}
      <div className={styles.hero}>
        <h1 className={styles.title}>Welcome back 👋</h1>

        <p className={styles.subtitle}>Ready for today's math challenge?</p>

        <button className='btn-primary'>Start Practice</button>
      </div>

      {/* Statistics */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Your Progress</h2>

        <div className={styles.stats}>
          <StatCard
            icon='🔥'
            title='Current Streak'
            value='7 Days'
          />

          <StatCard
            icon='🎯'
            title='Accuracy'
            value='92%'
          />

          <StatCard
            icon='⚡'
            title='Average Time'
            value='1.8s'
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className={`card ${styles.activity}`}>
        <h2 className={styles.sectionTitle}>Recent Activity</h2>

        <div className={styles.activityRow}>
          <div>
            <strong>Addition Practice</strong>

            <p>20 questions completed</p>
          </div>

          <div className={styles.score}>18 / 20</div>
        </div>

        <div className={styles.activityRow}>
          <div>
            <strong>Multiplication Practice</strong>

            <p>20 questions completed</p>
          </div>

          <div className={styles.score}>16 / 20</div>
        </div>
      </div>
    </section>
  );
}
