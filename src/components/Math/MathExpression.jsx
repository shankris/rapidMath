/* --------------------------------------------------
   src/components/Math/MathExpression.jsx
-------------------------------------------------- */

import katex from "katex";
import "katex/dist/katex.min.css";

import styles from "./MathExpression.module.css";

export default function MathExpression({ expression, displayMode = false }) {
  const html = katex.renderToString(expression, {
    displayMode,
    throwOnError: false,
  });

  return (
    <span
      className={styles.math}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
