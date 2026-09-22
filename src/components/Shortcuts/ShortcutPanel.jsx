// src/components/Shortcuts/ShortcutPanel.jsx

import { useEffect, useRef, useState } from "react";
import styles from "./ShortcutPanel.module.css";
import TwoDigitSquares from "./PowerRoots/TwoDigitSquares";
import Essentials from "./PowerRoots/Essentials";

export default function ShortcutPanel({ isOpen, onClose, data }) {
  const panelRef = useRef(null);
  const [selectedShortcut, setSelectedShortcut] = useState(null);

  // --------------------------------------------------
  // Select the first shortcut when the panel opens
  // --------------------------------------------------
  useEffect(() => {
    if (isOpen && data?.categories?.length) {
      const firstCategory = data.categories[0];

      if (firstCategory?.shortcuts?.length) {
        setSelectedShortcut(firstCategory.shortcuts[0]);
      }
    }
  }, [isOpen, data]);

  // --------------------------------------------------
  // Close on Escape key
  // --------------------------------------------------
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // --------------------------------------------------
  // Close on outside click
  // --------------------------------------------------
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // --------------------------------------------------
  // Shortcut components
  // --------------------------------------------------
  const shortcutComponents = {
    Essentials,
    TwoDigitSquares,
  };

  const ShortcutContent = selectedShortcut?.component && shortcutComponents[selectedShortcut.component];

  return (
    <div className={`${styles.panel} ${styles.panelFromRight} ${isOpen ? styles.panelIsVisible : ""}`}>
      <div ref={panelRef}>
        {/* --------------------------------------------------
            Header
        -------------------------------------------------- */}
        <header className={styles.panelHeader}>
          <h1>{data?.title || "Shortcuts"}</h1>

          <button
            type='button'
            className={styles.panelClose}
            onClick={onClose}
            aria-label='Close shortcuts'
          >
            Close
          </button>
        </header>

        {/* --------------------------------------------------
            Panel container
        -------------------------------------------------- */}
        <div className={styles.panelContainer}>
          <div className={styles.panelLayout}>
            {/* --------------------------------------------------
                Sidebar
            -------------------------------------------------- */}
            <aside className={styles.sidebar}>
              {data?.categories?.map((category) => (
                <section
                  key={category.id}
                  className={styles.sidebarCategory}
                >
                  <h2>{category.title}</h2>

                  <nav>
                    {category.shortcuts?.map((shortcut) => (
                      <button
                        key={shortcut.id}
                        type='button'
                        className={`${styles.sidebarShortcut} ${selectedShortcut?.id === shortcut.id ? styles.sidebarShortcutActive : ""}`}
                        onClick={() => setSelectedShortcut(shortcut)}
                      >
                        {shortcut.title}
                      </button>
                    ))}
                  </nav>
                </section>
              ))}
            </aside>

            {/* --------------------------------------------------
                Shortcut content
            -------------------------------------------------- */}
            <main className={styles.panelContent}>
              {selectedShortcut ? (
                <>
                  <h2>{selectedShortcut.title}</h2>

                  {selectedShortcut.subtitle && (
                    <p className={styles.subtitle}>
                      <strong>{selectedShortcut.subtitle}</strong>
                    </p>
                  )}

                  {ShortcutContent ? <ShortcutContent /> : <p>No shortcut content available.</p>}
                </>
              ) : (
                <p>No shortcut selected.</p>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
