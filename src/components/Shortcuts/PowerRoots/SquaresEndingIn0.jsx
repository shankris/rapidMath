/* src/components/Shortcuts/PowerRoots/SquaresEndingIn0.jsx */

"use client";

import { useState } from "react";
import styles from "./SquaresEndingIn0.module.css";

export default function SquaresEndingIn0() {
  const [input, setInput] = useState("660");
  const [number, setNumber] = useState(660);
  const [error, setError] = useState("");

  /* --------------------------------------------------
     Generate a random number ending in 0
  -------------------------------------------------- */

  const generateRandomNumber = () => {
    const randomNumber = (Math.floor(Math.random() * 99) + 1) * 10;

    setInput(String(randomNumber));
    setNumber(randomNumber);
    setError("");
  };

  /* --------------------------------------------------
     Apply the entered number
  -------------------------------------------------- */

  const handleChangeNumber = () => {
    const value = Number(input);

    if (!Number.isInteger(value) || value < 10 || value > 990 || value % 10 !== 0) {
      setError("Enter a whole number between 10 and 990 that ends in 0.");
      return;
    }

    setNumber(value);
    setError("");
  };

  /* --------------------------------------------------
     Calculate the shortcut
  -------------------------------------------------- */

  const remainingNumber = number / 10;
  const squaredNumber = remainingNumber ** 2;
  const result = number ** 2;

  /* --------------------------------------------------
     Two-digit square calculation

     For example:

     66²

     6² = 36
     2 × (6 × 6) = 72
     6² = 36
  -------------------------------------------------- */

  const isTwoDigit = remainingNumber >= 10;

  const tens = Math.floor(remainingNumber / 10);
  const units = remainingNumber % 10;

  const firstBlock = tens ** 2;
  const middleBlock = 2 * tens * units;
  const lastBlock = units ** 2;

  const carryFromLast = Math.floor(lastBlock / 10);
  const middleValue = middleBlock + carryFromLast;

  const middleDigit = middleValue % 10;
  const carryFromMiddle = Math.floor(middleValue / 10);

  const firstValue = firstBlock + carryFromMiddle;

  return (
    <div className={styles.container}>
      {/* --------------------------------------------------
         Number input
      -------------------------------------------------- */}

      <div className={styles.inputSection}>
        <label htmlFor='square-number'>Number</label>

        <div className={styles.inputRow}>
          <input
            id='square-number'
            type='text'
            inputMode='numeric'
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleChangeNumber();
              }
            }}
          />

          <button
            type='button'
            onClick={handleChangeNumber}
          >
            Change number
          </button>

          <button
            type='button'
            onClick={generateRandomNumber}
          >
            Random
          </button>
        </div>

        {error && <p className={styles.error}>{error}</p>}
      </div>

      {/* --------------------------------------------------
         Shortcut
      -------------------------------------------------- */}

      <div className={styles.shortcut}>
        {/* 660² */}

        <div className={styles.mainStep}>
          <div className={styles.mainValue}>{number.toLocaleString()}²</div>
        </div>

        {/* 66² */}

        <div className={styles.mainStep}>
          <div className={styles.mainValue}>{remainingNumber.toLocaleString()}²</div>

          <div className={styles.stepNote}>Remove 0</div>
        </div>

        {/* 4,356 */}

        <div className={styles.mainStep}>
          <div className={styles.mainValue}>{squaredNumber.toLocaleString()}</div>

          <div className={styles.stepNote}>Square of {remainingNumber}</div>
        </div>

        {/* --------------------------------------------------
           Two-digit squaring procedure
        -------------------------------------------------- */}

        {isTwoDigit && (
          <div className={styles.squaringProcedure}>
            <div className={styles.procedureTitle}>Help squaring a two-digit number</div>

            <table className={styles.squaringTable}>
              <tbody>
                {/* First calculation row */}

                <tr>
                  <td>
                    <strong>{firstBlock}</strong>
                  </td>

                  <td>
                    <strong>{middleBlock}</strong>
                  </td>

                  <td>
                    <strong>{lastBlock}</strong>
                  </td>
                </tr>

                {/* Formula row */}

                <tr className={styles.formulaRow}>
                  <td>{tens}²</td>

                  <td>
                    2 × ({tens} × {units})
                  </td>

                  <td>{units}²</td>
                </tr>

                {/* Result blocks */}

                <tr>
                  <td>
                    <strong>{firstValue}</strong>
                  </td>

                  <td>
                    <strong>{middleDigit}</strong>
                  </td>

                  <td>
                    <strong>{lastBlock % 10}</strong>
                  </td>
                </tr>

                {/* Carry calculation */}

                <tr className={styles.explanationRow}>
                  <td>
                    {firstBlock} + {carryFromMiddle}
                  </td>

                  <td>
                    {middleBlock} + {carryFromLast}
                  </td>

                  <td>Last digit</td>
                </tr>

                {/* Carry labels */}

                <tr className={styles.carryRow}>
                  <td>{carryFromMiddle > 0 && `carry ${carryFromMiddle}`}</td>

                  <td>{carryFromLast > 0 && `carry ${carryFromLast}`}</td>

                  <td></td>
                </tr>

                {/* Final blocks */}

                <tr>
                  <td>
                    <strong>{firstValue}</strong>
                  </td>

                  <td>
                    <strong>{middleDigit}</strong>
                  </td>

                  <td>
                    <strong>{lastBlock % 10}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* --------------------------------------------------
           Final result
        -------------------------------------------------- */}

        <div className={styles.mainStep}>
          <div className={styles.mainValue}>{result.toLocaleString()}</div>

          <div className={styles.stepNote}>Add two 00</div>
        </div>
      </div>
    </div>
  );
}
