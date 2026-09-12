// src/components/UI/Ripple/Ripple.jsx

"use client";

import { cloneElement, useRef } from "react";
import styles from "./Ripple.module.css";

/* --------------------------------------------------
   Ripple Component
-------------------------------------------------- */

export default function Ripple({ children }) {
  const elementRef = useRef(null);

  /* --------------------------------------------------
     Create Ripple
  -------------------------------------------------- */

  function createRipple(event) {
    const element = elementRef.current;

    if (!element) {
      return;
    }

    /* --------------------------------------------------
       Remove Existing Ripple
    -------------------------------------------------- */

    const existingRipple = element.querySelector(`.${styles.ripple}`);

    if (existingRipple) {
      existingRipple.remove();
    }

    /* --------------------------------------------------
       Calculate Ripple Size
    -------------------------------------------------- */

    const diameter = Math.max(element.clientWidth, element.clientHeight);

    const radius = diameter / 2;

    /* --------------------------------------------------
       Calculate Click Position
    -------------------------------------------------- */

    const rect = element.getBoundingClientRect();

    const left = event.clientX - rect.left - radius;

    const top = event.clientY - rect.top - radius;

    /* --------------------------------------------------
       Create Ripple Element
    -------------------------------------------------- */

    const circle = document.createElement("span");

    circle.className = styles.ripple;

    circle.style.width = `${diameter}px`;
    circle.style.height = `${diameter}px`;
    circle.style.left = `${left}px`;
    circle.style.top = `${top}px`;

    element.appendChild(circle);
  }

  /* --------------------------------------------------
     Add Ripple Handler To Child
  -------------------------------------------------- */

  return cloneElement(children, {
    ref: elementRef,
    onClick: (event) => {
      children.props.onClick?.(event);
      createRipple(event);
    },
  });
}
