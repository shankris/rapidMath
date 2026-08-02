"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./Menu.module.css";
import menuItems from "./menuItems";

export default function Menu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className={styles.menuButton}
        onClick={() => setOpen(true)}
        aria-label='Open menu'
      >
        ☰
      </button>

      <nav className={`${styles.menu} ${open ? styles.open : ""}`}>
        <button
          className={styles.closeButton}
          onClick={() => setOpen(false)}
          aria-label='Close menu'
        >
          ×
        </button>

        {menuItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={styles.link}
            onClick={() => setOpen(false)}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {open && (
        <div
          className={styles.overlay}
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
