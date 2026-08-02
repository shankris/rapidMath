import PlaceValueDisplay from "../PlaceValueDisplay";
import styles from "../Practice.module.css";

export default function PlaceValueHint({ hint }) {
  return (
    <>
      {/* <div className={styles.hintTitle}>{hint.title}</div> */}

      {hint.lines.map((line, index) => (
        <PlaceValueDisplay
          key={index}
          line={line}
        />
      ))}
    </>
  );
}
