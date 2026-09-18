// src/app/[locale]/Header/Menu/Menu.jsx

"use client";

import { createNavigation } from "next-intl/navigation";
import { useTranslations } from "next-intl";

import styles from "./Menu.module.css";
import menuItems from "./menuItems";

import { routing } from "@/i18n/routing";

/* --------------------------------------------------
   Locale-aware Navigation
-------------------------------------------------- */

const { Link } = createNavigation(routing);

/* --------------------------------------------------
   Header Menu
-------------------------------------------------- */

export default function Menu() {
  const t = useTranslations("Header");

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

            <span>{t(`menu.${item.id}`)}</span>
          </Link>
        );
      })}
    </nav>
  );
}
