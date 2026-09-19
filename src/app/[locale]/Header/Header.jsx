// src/app/[locale]/Header/Header.jsx

"use client";

import { useTranslations } from "next-intl";

import styles from "./Header.module.css";
import ThemeToggle from "./ThemeToggle";
import NotificationBell from "@/components/Notification/NotificationBell";
import Menu from "./Menu/Menu";
import LanguageSwitcher from "./LanguageSwitcher/LanguageSwitcher";
import Logo from "@/components/Logo/Logo";

/* --------------------------------------------------
   Header Notifications
-------------------------------------------------- */

const notificationItems = [
  { id: "newBookmarks", read: false },
  { id: "bookmarksSummary", read: true },
  { id: "weeklySales", read: true },
];

/* --------------------------------------------------
   Header Component
-------------------------------------------------- */

export default function Header() {
  const t = useTranslations("Header");
  const nt = useTranslations("Notifications");

  const notifications = notificationItems.map((item) => ({
    id: item.id,
    title: nt(`${item.id}.title`),
    description: nt(`${item.id}.description`),
    time: nt(`${item.id}.time`),
    read: item.read,
  }));

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.logo}>
          <Logo />
        </div>

        <Menu />

        {/* --------------------------------------------------
           Right Side of Header
        -------------------------------------------------- */}

        <div className={styles.rightIcons}>
          <ThemeToggle />

          <NotificationBell
            notifications={notifications}
            onItemClick={(item) => console.log("Clicked", item)}
            onViewAll={() => router.push("/notifications")}
          />

          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
