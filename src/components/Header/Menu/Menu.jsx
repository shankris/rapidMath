"use client";

import Link from "next/link";
import styles from "./Menu.module.css";
import menuItems from "./menuItems";

export default function Menu() {
  return (
    <nav className={styles.menu}>
      {menuItems.map((item) => {
        const Icon = item.icon;

        return (
          <Link
            key={item.id}
            href={item.href}
            className={styles.link}
          >
            <Icon
              className={styles.icon}
              size={21}
              strokeWidth={1.8}
            />

            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
