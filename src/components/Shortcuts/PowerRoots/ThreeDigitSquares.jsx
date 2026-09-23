"use client";
/* src/components/Shortcuts/PowerRoots/ThreeDigitSquares.jsx */

import { useState } from "react";
import styles from "./ThreeDigitSquares.module.css";

export default function ThreeDigitSquares() {
  const [input, setInput] = useState("123");
  const [number, setNumber] = useState(123);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // Generate a random three-digit number
  // --------------------------------------------------
  const generateRandomNumber = () => {
    const randomNumber = Math.floor(Math.random() * 900) + 100;

    setInput(String(randomNumber));
    setNumber(randomNumber);
    setError("");
  };

  // --------------------------------------------------
  // Use the entered number
  // --------------------------------------------------
  const handleChangeNumber = () => {
    const value = Number(input);

    if (!Number.isInteger(value) || value < 100 || value > 999) {
      setError("Enter a three-digit whole number between 100 and 999.");
      return;
    }

    setNumber(value);
    setError("");
  };

  // --------------------------------------------------
  // Split the number into hundreds and last two digits
  // --------------------------------------------------
  const hundreds = Math.floor(number / 100);
  const lastTwoDigits = number % 100;

  // --------------------------------------------------
  // Calculate the three parts
  // --------------------------------------------------
  const firstBlock = hundreds ** 2;
  const middleBlock = 2 * hundreds * lastTwoDigits;
  const lastBlock = lastTwoDigits ** 2;

  // --------------------------------------------------
  // Carry from right to left
  // --------------------------------------------------
  const lastBlockResult = lastBlock % 100;
  const carryFromLast = Math.floor(lastBlock / 100);

  const middleValue = middleBlock + carryFromLast;
  const middleBlockResult = middleValue % 100;
  const carryFromMiddle = Math.floor(middleValue / 100);

  const firstValue = firstBlock + carryFromMiddle;

  const result = number ** 2;

  return (
    <div className={styles.shortcut}>
      {/* --------------------------------------------------
      Example heading
      -------------------------------------------------- */}

      <section className={styles.exampleSection}>
        {/* --------------------------------------------------
        Change number
        -------------------------------------------------- */}

        <div className={styles.changeNumber}>
          <div className={styles.changeControls}>
            <label htmlFor='three-digit-square-input'>Change number</label>

            <input
              id='three-digit-square-input'
              type='text'
              inputMode='numeric'
              pattern='[0-9]*'
              maxLength={3}
              value={input}
              onChange={(event) => {
                const value = event.target.value.replace(/\D/g, "").slice(0, 3);

                setInput(value);
                setError("");
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleChangeNumber();
                }
              }}
              aria-describedby={error ? "three-digit-square-error" : undefined}
              aria-label='Three-digit number'
            />

            <button
              type='button'
              className={styles.secondaryButton}
              onClick={handleChangeNumber}
            >
              Update
            </button>

            <button
              type='button'
              className={styles.secondaryButton}
              onClick={generateRandomNumber}
            >
              Random
            </button>
          </div>

          {error && (
            <p
              id='three-digit-square-error'
              className={styles.error}
              role='alert'
            >
              {error}
            </p>
          )}
        </div>
      </section>

      {/* --------------------------------------------------
      Calculation
      -------------------------------------------------- */}

      <section className={styles.calculationSection}>
        <div className={styles.calculationTable}>
          {/* --------------------------------------------------
          Row 1 - Main number
          -------------------------------------------------- */}

          <div className={styles.numberRow}>
            <div className={styles.numberCell}>{number}</div>
          </div>

          {/* --------------------------------------------------
          Row 2 - Split number
          -------------------------------------------------- */}

          <div className={styles.splitRow}>
            <div className={styles.splitCell}>{hundreds}</div>
            <div className={styles.splitCell}>{String(lastTwoDigits).padStart(2, "0")}</div>
          </div>

          {/* --------------------------------------------------
          Row 3 - Three calculations
          -------------------------------------------------- */}

          <div className={styles.calculationRow}>
            <div className={styles.calculationCell}>
              <strong>
                {hundreds}² = {firstBlock}
              </strong>

              <span>Square the hundreds digit</span>
            </div>

            <div className={styles.calculationCell}>
              <strong>
                2 × ({hundreds} × {lastTwoDigits}) = {middleBlock}
              </strong>

              <span>Double the product of the two blocks</span>
            </div>

            <div className={styles.calculationCell}>
              <strong>
                {lastTwoDigits}² = {lastBlock}
              </strong>

              <span>Square the last two digits</span>
            </div>
          </div>

          {/* --------------------------------------------------
          Row 4 - Result blocks and carries
          -------------------------------------------------- */}

          <div className={styles.resultRow}>
            <div className={styles.resultCell}>
              <strong>{firstValue}</strong>

              <span>
                {firstBlock} + {carryFromMiddle}
              </span>
            </div>

            <div className={styles.resultCell}>
              <strong>{String(middleBlockResult).padStart(2, "0")}</strong>

              <span>
                {middleBlock} + {carryFromLast} = {middleValue}
              </span>

              {carryFromMiddle > 0 && <span>{carryFromMiddle} carries over</span>}
            </div>

            <div className={styles.resultCell}>
              <strong>{String(lastBlockResult).padStart(2, "0")}</strong>

              <span>{carryFromLast > 0 ? `${carryFromLast} carries over` : "Last two digits"}</span>
            </div>
          </div>
        </div>

        {/* --------------------------------------------------
        Final answer
        -------------------------------------------------- */}

        <div className={styles.finalAnswer}>
          <span>{number}² =</span>
          <strong>{result}</strong>
        </div>
      </section>

      {/* --------------------------------------------------
      Remember
      -------------------------------------------------- */}

      <section className={styles.remember}>
        <h3>Steps to remember</h3>

        <ul>
          <li>Split the number into hundreds and the last two digits.</li>
          <li>Work out a², 2ab, and b².</li>
          <li>Keep the last block to two digits.</li>
          <li>Carry from right to left.</li>
        </ul>
      </section>
    </div>
  );
}
