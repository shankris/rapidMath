import Link from "next/link";
import styles from "./Menu.module.css";
import menuItems from "./menuItems";

export default function Menu() {
  return (
    <nav className={styles.menu}>
      {menuItems.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className={styles.link}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
