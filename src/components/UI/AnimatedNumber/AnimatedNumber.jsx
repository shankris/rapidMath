"use client";

import { useEffect, useRef, useState } from "react";

import styles from "./AnimatedNumber.module.css";

/* --------------------------------------------------
   Animated Number
-------------------------------------------------- */

export default function AnimatedNumber({ value, duration = 800, decimals = 0, max, className = "" }) {
  const target = Math.min(Number(value) || 0, max !== undefined ? Number(max) : Infinity);

  const [displayValue, setDisplayValue] = useState(0);
  const animationRef = useRef(null);
  const delayRef = useRef(null);

  /* ------------------------------------------------
     Animate Number
  ------------------------------------------------ */

  useEffect(() => {
    let cancelled = false;

    const startAnimation = () => {
      if (cancelled) return;

      const startTime = performance.now();

      const animate = (currentTime) => {
        if (cancelled) return;

        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out slightly so the animation slows near the end.
        const easedProgress = 1 - Math.pow(1 - progress, 3);

        setDisplayValue(target * easedProgress);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setDisplayValue(target);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    };

    /* ------------------------------------------------
       Reset To Zero
    ------------------------------------------------ */

    setDisplayValue(0);

    /* ------------------------------------------------
       Initial Page Load Delay
    ------------------------------------------------ */

    if (document.readyState === "complete") {
      delayRef.current = setTimeout(startAnimation, 1000);
    } else {
      const handleLoad = () => {
        delayRef.current = setTimeout(startAnimation, 1000);
      };

      window.addEventListener("load", handleLoad);

      return () => {
        cancelled = true;

        window.removeEventListener("load", handleLoad);

        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }

        if (delayRef.current) {
          clearTimeout(delayRef.current);
        }
      };
    }

    return () => {
      cancelled = true;

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      if (delayRef.current) {
        clearTimeout(delayRef.current);
      }
    };
  }, [target, duration]);

  /* ------------------------------------------------
     Format Number
  ------------------------------------------------ */

  const formattedValue = displayValue.toFixed(decimals);

  /* ------------------------------------------------
     Render
  ------------------------------------------------ */

  return <span className={`${styles.container} ${className}`}>{formattedValue}</span>;
}
