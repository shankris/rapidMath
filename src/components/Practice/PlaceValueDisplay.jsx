import styles from "./PlaceValueDisplay.module.css";

export default function PlaceValueDisplay({ line }) {
  return (
    <div className={styles.placeValueRow}>
      <span className={styles.number}>{line.number} =</span>

      <div className={styles.values}>
        {line.values.map((item, index) => (
          <span
            key={item.place}
            className={`${styles.place} ${styles[item.place]}`}
          >
            {!item.isEmpty && (
              <>
                {item.value.toLocaleString()}
                {index < line.values.length - 1 && <span className={styles.operator}> +</span>}
              </>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
