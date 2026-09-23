// src/components/Shortcuts/PowerRoots/SquaresEndingIn0.jsx

"use client";

import { useState } from "react";
import styles from "./SquaresEndingIn0.module.css";

export default function SquaresEndingIn0() {
  const [input, setInput] = useState("660");
  const [number, setNumber] = useState(660);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // Generate a random number ending in 0
  // --------------------------------------------------
  const generateRandomNumber = () => {
    const randomNumber = (Math.floor(Math.random() * 99) + 1) * 10;

    setInput(String(randomNumber));
    setNumber(randomNumber);
    setError("");
  };

  // --------------------------------------------------
  // Use the entered number
  // --------------------------------------------------
  const handleChangeNumber = () => {
    const value = Number(input);

    if (!Number.isInteger(value) || value < 10 || value > 990 || value % 10 !== 0) {
      setError("Enter a whole number between 10 and 990 that ends in 0.");
      return;
    }

    setNumber(value);
    setError("");
  };

  // --------------------------------------------------
  // Remove the final zero
  // --------------------------------------------------
  const remainingNumber = number / 10;

  const isSingleDigit = remainingNumber < 10;

  // --------------------------------------------------
  // Two-digit square calculations
  // --------------------------------------------------
  const tens = Math.floor(remainingNumber / 10);
  const units = remainingNumber % 10;

  const firstBlock = tens ** 2;
  const middleBlock = 2 * tens * units;
  const lastBlock = units ** 2;

  // --------------------------------------------------
  // Carry from right to left
  // --------------------------------------------------
  const lastDigit = lastBlock % 10;
  const carryFromLast = Math.floor(lastBlock / 10);

  const middleValue = middleBlock + carryFromLast;
  const middleDigit = middleValue % 10;
  const carryFromMiddle = Math.floor(middleValue / 10);

  const firstValue = firstBlock + carryFromMiddle;

  // --------------------------------------------------
  // Square the remaining number
  // --------------------------------------------------
  const squaredNumber = remainingNumber ** 2;

  // --------------------------------------------------
  // Append two zeros
  // --------------------------------------------------
  const result = number ** 2;

  return (
    <div className={styles.shortcut}>
      {/* --------------------------------------------------
          Example Section
      -------------------------------------------------- */}
      <section className={styles.exampleSection}>
        {/* --------------------------------------------------
            Change Number
        -------------------------------------------------- */}
        <div className={styles.changeNumber}>
          <div className={styles.changeControls}>
            <label htmlFor='squares-ending-in-0-input'>Change number</label>

            <input
              id='squares-ending-in-0-input'
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
              aria-describedby={error ? "squares-ending-in-0-error" : undefined}
              aria-label='Number ending in zero'
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
              id='squares-ending-in-0-error'
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
              Row 1 - Main Number
          -------------------------------------------------- */}
          <div className={styles.numberRow}>
            <div className={styles.numberCell}>{number}²</div>
          </div>

          {/* --------------------------------------------------
              Row 2 - Remove Final Zero
          -------------------------------------------------- */}
          <div className={styles.calculationRow}>
            <div className={styles.calculationCell}>
              <strong>
                {number} → {remainingNumber}
              </strong>

              <span>Remove the final zero</span>
            </div>
          </div>

          {/* --------------------------------------------------
              Single-Digit Calculation
          -------------------------------------------------- */}
          {isSingleDigit ? (
            <>
              <div className={styles.calculationRow}>
                <div className={styles.calculationCell}>
                  <strong>
                    {remainingNumber}² = {squaredNumber}
                  </strong>

                  <span>Square the remaining number</span>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* --------------------------------------------------
                  Split Remaining Number
              -------------------------------------------------- */}
              <div className={styles.splitRow}>
                <div className={styles.splitCell}>{tens}</div>

                <div className={styles.splitCell}>{units}</div>
              </div>

              {/* --------------------------------------------------
                  Two-Digit Square Calculations
              -------------------------------------------------- */}
              <div className={styles.calculationRow}>
                <div className={styles.calculationCell}>
                  <strong>
                    {tens}² = {firstBlock}
                  </strong>

                  <span>Square the tens digit</span>
                </div>

                <div className={styles.calculationCell}>
                  <strong>
                    2 × ({tens} × {units}) = {middleBlock}
                  </strong>

                  <span>Double the product</span>
                </div>

                <div className={styles.calculationCell}>
                  <strong>
                    {units}² = {lastBlock}
                  </strong>

                  <span>Square the units digit</span>
                </div>
              </div>

              {/* --------------------------------------------------
                  Carry and Combine
              -------------------------------------------------- */}
              <div className={styles.resultRow}>
                <div className={styles.resultCell}>
                  <strong>{firstValue}</strong>

                  <span>
                    {firstBlock} + {carryFromMiddle}
                  </span>
                </div>

                <div className={styles.resultCell}>
                  <strong>{middleDigit}</strong>

                  <span>
                    {middleBlock} + {carryFromLast} = {middleValue}
                  </span>

                  {carryFromMiddle > 0 && <span>{carryFromMiddle} carries over</span>}
                </div>

                <div className={styles.resultCell}>
                  <strong>{lastDigit}</strong>

                  <span>{carryFromLast > 0 ? `${carryFromLast} carries over` : "Last digit"}</span>
                </div>
              </div>

              {/* --------------------------------------------------
                  Two-Digit Square Result
              -------------------------------------------------- */}
              <div className={styles.intermediateAnswer}>
                <span>{remainingNumber}² =</span>

                <strong>{squaredNumber}</strong>
              </div>
            </>
          )}

          {/* --------------------------------------------------
              Append Two Zeros
          -------------------------------------------------- */}
          <div className={styles.calculationRow}>
            <div className={styles.calculationCell}>
              <strong>
                {squaredNumber} → {result}
              </strong>

              <span>Append two zeros</span>
            </div>
          </div>
        </div>

        {/* --------------------------------------------------
            Final Answer
        -------------------------------------------------- */}
        <div className={styles.finalAnswer}>
          <span>{number}² =</span>
          <strong>{result}</strong>
        </div>
      </section>

      {/* --------------------------------------------------
          Steps to Remember
      -------------------------------------------------- */}
      <section className={styles.remember}>
        <h3>Steps to remember</h3>

        <ul>
          <li>Remove the final zero.</li>
          <li>Square the remaining number.</li>
          <li>Append two zeros to the result.</li>
        </ul>
      </section>
    </div>
  );
}
