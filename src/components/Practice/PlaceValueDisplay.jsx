import styles from "./PlaceValueDisplay.module.css";

export default function PlaceValueDisplay({ line }) {
  const values = {};

  line.values.forEach((item) => {
    values[item.place] = item.value;
  });

  const places = ["thousands", "hundreds", "tens", "ones"];

  return (
    <div className={styles.placeValueRow}>
      <span className={styles.number}>{line.number} =</span>

      <span className={styles.values}>
        {places.map((place, index) => (
          <span
            key={place}
            className={styles.placeColumn}
          >
            {values[place] ?? ""}

            {index < places.length - 1 && <span className={styles.operator}>+</span>}
          </span>
        ))}
      </span>
    </div>
  );
}
