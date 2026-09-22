// src/components/Shortcuts/PowerRoots/TwoDigitSquares.jsx

"use client";

import { useState } from "react";
import styles from "./TwoDigitSquares.module.css";

export default function TwoDigitSquares() {
  const [input, setInput] = useState("83");
  const [number, setNumber] = useState(83);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // Generate a random two-digit number
  // --------------------------------------------------
  const generateRandomNumber = () => {
    const randomNumber = Math.floor(Math.random() * 90) + 10;

    setInput(String(randomNumber));
    setNumber(randomNumber);
    setError("");
  };

  // --------------------------------------------------
  // Use the entered number
  // --------------------------------------------------
  const handleChangeNumber = () => {
    const value = Number(input);

    if (!Number.isInteger(value) || value < 10 || value > 99) {
      setError("Enter a two-digit whole number between 10 and 99.");
      return;
    }

    setNumber(value);
    setError("");
  };

  // --------------------------------------------------
  // Split the number into tens and units
  // --------------------------------------------------
  const tens = Math.floor(number / 10);
  const units = number % 10;

  // --------------------------------------------------
  // Calculate the three parts
  // --------------------------------------------------
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

  const result = number ** 2;

  return (
    <div className={styles.shortcut}>
      {/* -------------------------------------------------- Example heading -------------------------------------------------- */}
      <section className={styles.exampleSection}>
        {/* <div className={styles.numberHeading}>
          <span className={styles.number}> {number} </span>
        </div> */}
        {/* -------------------------------------------------- Change number -------------------------------------------------- */}
        <div className={styles.changeNumber}>
          <div className={styles.changeControls}>
            <label htmlFor='two-digit-square-input'> Change number </label>
            <input
              id='two-digit-square-input'
              type='text'
              inputMode='numeric'
              pattern='[0-9]*'
              maxLength={2}
              value={input}
              onChange={(event) => {
                const value = event.target.value.replace(/\D/g, "").slice(0, 2);
                setInput(value);
                setError("");
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleChangeNumber();
                }
              }}
              aria-describedby={error ? "two-digit-square-error" : undefined}
              aria-label='Two-digit number'
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
              id='two-digit-square-error'
              className={styles.error}
              role='alert'
            >
              {error}
            </p>
          )}
        </div>
      </section>
      {/* -------------------------------------------------- Calculation -------------------------------------------------- */}
      <section className={styles.calculationSection}>
        <div className={styles.calculationTable}>
          {/* -------------------------------------------------- Row 1 - Main number -------------------------------------------------- */}
          <div className={styles.numberRow}>
            <div className={styles.numberCell}> {number} </div>
          </div>
          {/* -------------------------------------------------- Row 2 - Split digits -------------------------------------------------- */}
          <div className={styles.splitRow}>
            <div className={styles.splitCell}> {tens} </div> <div className={styles.splitCell}> {units} </div>
          </div>
          {/* -------------------------------------------------- Row 3 - Three calculations -------------------------------------------------- */}
          <div className={styles.calculationRow}>
            <div className={styles.calculationCell}>
              <strong>
                {tens}² = {firstBlock}
              </strong>
              <span> Square the tens digit </span>
            </div>
            <div className={styles.calculationCell}>
              <strong>
                2 × ({tens} × {units}) = {middleBlock}
              </strong>
              <span> Double the product of the digits </span>
            </div>
            <div className={styles.calculationCell}>
              <strong>
                {units}² = {lastBlock}
              </strong>
              <span> Square the units digit </span>
            </div>
          </div>
          {/* -------------------------------------------------- Row 4 - Result digits and carries -------------------------------------------------- */}
          <div className={styles.resultRow}>
            <div className={styles.resultCell}>
              <strong> {firstValue} </strong>
              <span>
                {firstBlock} + {carryFromMiddle}
              </span>
            </div>
            <div className={styles.resultCell}>
              <strong> {middleDigit} </strong>
              <span>
                {middleBlock} + {carryFromLast} = {middleValue}
              </span>
              {carryFromMiddle > 0 && <span> {carryFromMiddle} carries over </span>}
            </div>
            <div className={styles.resultCell}>
              <strong> {lastDigit} </strong> <span> {carryFromLast > 0 ? `${carryFromLast} carries over` : "Last digit"} </span>
            </div>
          </div>
        </div>
        {/* -------------------------------------------------- Final answer -------------------------------------------------- */}
        <div className={styles.finalAnswer}>
          <span> {number}² = </span> <strong> {result} </strong>
        </div>
      </section>
      {/* --------------------------------------------------
          Remember
      -------------------------------------------------- */}
      <section className={styles.remember}>
        <h3>Steps to remember</h3>
        <p>
          <ul>
            <li>Split number into two digits - a, b</li>
            <li>Work out the three small calculations - a² + 2ab + b²</li>
            <li>Then carry from right to left</li>
          </ul>
        </p>
      </section>
    </div>
  );
}
