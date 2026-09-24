// src/components/Shortcuts/Multiplication/TwoDigitMultiplication.jsx

"use client";

import { useState } from "react";
import styles from "./TwoDigitMultiplication.module.css";

export default function TwoDigitMultiplication() {
  const [firstInput, setFirstInput] = useState("83");
  const [secondInput, setSecondInput] = useState("27");

  const [firstNumber, setFirstNumber] = useState(83);
  const [secondNumber, setSecondNumber] = useState(27);

  const [error, setError] = useState("");

  // --------------------------------------------------
  // Generate two random two-digit numbers
  // --------------------------------------------------
  const generateRandomNumbers = () => {
    const first = Math.floor(Math.random() * 90) + 10;
    const second = Math.floor(Math.random() * 90) + 10;

    setFirstInput(String(first));
    setSecondInput(String(second));
    setFirstNumber(first);
    setSecondNumber(second);
    setError("");
  };

  // --------------------------------------------------
  // Use the entered numbers
  // --------------------------------------------------
  const handleChangeNumbers = () => {
    const first = Number(firstInput);
    const second = Number(secondInput);

    if (!Number.isInteger(first) || !Number.isInteger(second) || first < 10 || first > 99 || second < 10 || second > 99) {
      setError("Enter two whole numbers between 10 and 99.");
      return;
    }

    setFirstNumber(first);
    setSecondNumber(second);
    setError("");
  };

  // --------------------------------------------------
  // Split the first number
  // --------------------------------------------------
  const firstTens = Math.floor(firstNumber / 10);
  const firstUnits = firstNumber % 10;

  // --------------------------------------------------
  // Split the second number
  // --------------------------------------------------
  const secondTens = Math.floor(secondNumber / 10);
  const secondUnits = secondNumber % 10;

  // --------------------------------------------------
  // Three-block method
  // --------------------------------------------------

  // Tens × Tens
  const firstBlock = firstTens * secondTens;

  // Cross multiplication
  const middleBlock = firstTens * secondUnits + firstUnits * secondTens;

  // Units × Units
  const lastBlock = firstUnits * secondUnits;

  // --------------------------------------------------
  // Normalize blocks from right to left
  // --------------------------------------------------

  // Units block
  const blockLastDigit = lastBlock % 10;
  const blockLastCarry = Math.floor(lastBlock / 10);

  // Middle block
  const blockMiddleValue = middleBlock + blockLastCarry;
  const blockMiddleDigit = blockMiddleValue % 10;
  const blockMiddleCarry = Math.floor(blockMiddleValue / 10);

  // Tens block
  const blockFirstValue = firstBlock + blockMiddleCarry;

  // --------------------------------------------------
  // Final answer
  // --------------------------------------------------
  const result = firstNumber * secondNumber;

  return (
    <div className={styles.shortcut}>
      {/* --------------------------------------------------
          Change Numbers
      -------------------------------------------------- */}
      <section className={styles.exampleSection}>
        <div className={styles.changeNumber}>
          <div className={styles.changeControls}>
            <label htmlFor='two-digit-multiplication-first'>Change numbers</label>

            <div className={styles.numberInputs}>
              <input
                id='two-digit-multiplication-first'
                type='text'
                inputMode='numeric'
                pattern='[0-9]*'
                maxLength={2}
                value={firstInput}
                onChange={(event) => {
                  const value = event.target.value.replace(/\D/g, "").slice(0, 2);

                  setFirstInput(value);
                  setError("");
                }}
                aria-label='First two-digit number'
              />

              <span>×</span>

              <input
                id='two-digit-multiplication-second'
                type='text'
                inputMode='numeric'
                pattern='[0-9]*'
                maxLength={2}
                value={secondInput}
                onChange={(event) => {
                  const value = event.target.value.replace(/\D/g, "").slice(0, 2);

                  setSecondInput(value);
                  setError("");
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleChangeNumbers();
                  }
                }}
                aria-label='Second two-digit number'
              />
            </div>

            <button
              type='button'
              className={styles.secondaryButton}
              onClick={handleChangeNumbers}
            >
              Update
            </button>

            <button
              type='button'
              className={styles.secondaryButton}
              onClick={generateRandomNumbers}
            >
              Random
            </button>
          </div>

          {error && (
            <p
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
      <div className={styles.calculationTable}>
        <table className={styles.blocksTable}>
          <tbody>
            {/* Original multiplication */}
            <tr>
              <th colSpan='3'>
                {firstNumber} × {secondNumber}
              </th>
            </tr>

            {/* Three blocks */}
            <tr>
              <td>
                <strong>{firstBlock}</strong>
                <span>
                  {firstTens} × {secondTens}
                </span>
                <small>Tens × Tens</small>
              </td>

              <td>
                <strong>{middleBlock}</strong>
                <span>
                  {firstTens} × {secondUnits} + {firstUnits} × {secondTens}
                </span>
                <small>Cross multiplication</small>
              </td>

              <td>
                <strong>{lastBlock}</strong>
                <span>
                  {firstUnits} × {secondUnits}
                </span>
                <small>Units × Units</small>
              </td>
            </tr>

            {/* Normalize */}
            <tr>
              <td>
                <strong>{blockFirstValue}</strong>
                <span>
                  {firstBlock} + {blockMiddleCarry}
                </span>
              </td>

              <td>
                <strong>{blockMiddleDigit}</strong>
                <span>
                  {middleBlock} + {blockLastCarry} = {blockMiddleValue}
                </span>

                {blockMiddleCarry > 0 && <small>Carry {blockMiddleCarry}</small>}
              </td>

              <td>
                <strong>{blockLastDigit}</strong>

                {blockLastCarry > 0 && <small>Carry {blockLastCarry}</small>}
              </td>
            </tr>
          </tbody>
        </table>

        <div className={styles.finalAnswer}>
          Answer: <strong>{result}</strong>
        </div>
      </div>

      {/* --------------------------------------------------
          Steps to Remember
      -------------------------------------------------- */}
      <section className={styles.remember}>
        <h3>Steps to remember</h3>

        <ul>
          <li>Multiply tens × tens.</li>
          <li>Add the two cross-products.</li>
          <li>Multiply units × units.</li>
          <li>Place the three blocks together and carry from right to left.</li>
        </ul>
      </section>
    </div>
  );
}
