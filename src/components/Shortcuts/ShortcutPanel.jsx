// src/components/Shortcuts/ShortcutPanel.jsx

"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ShortcutPanel.module.css";

import Essentials from "./PowerRoots/Essentials";
import TwoDigitSquares from "./PowerRoots/TwoDigitSquares";
import ThreeDigitSquares from "./PowerRoots/ThreeDigitSquares";
import SquaresEndingIn0 from "./PowerRoots/SquaresEndingIn0";

import TwoDigitMultiplication from "./Multiplication/TwoDigitMultiplication";

import { PanelsTopLeft } from "lucide-react";

export default function ShortcutPanel({ isOpen, onClose, data }) {
  const panelRef = useRef(null);
  const [selectedShortcut, setSelectedShortcut] = useState(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

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
  // Close mobile drawer when panel closes
  // --------------------------------------------------
  useEffect(() => {
    if (!isOpen) {
      setIsMobileDrawerOpen(false);
    }
  }, [isOpen]);

  // --------------------------------------------------
  // Close on Escape key
  // --------------------------------------------------
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (isMobileDrawerOpen) {
          setIsMobileDrawerOpen(false);
        } else {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isMobileDrawerOpen, onClose]);

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
    ThreeDigitSquares,
    SquaresEndingIn0,
    TwoDigitMultiplication,
  };

  const ShortcutContent = selectedShortcut?.component && shortcutComponents[selectedShortcut.component];

  // --------------------------------------------------
  // Select shortcut
  // --------------------------------------------------
  const handleShortcutSelect = (shortcut) => {
    setSelectedShortcut(shortcut);
    setIsMobileDrawerOpen(false);
  };

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
                Desktop sidebar
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
                        onClick={() => handleShortcutSelect(shortcut)}
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
              {/* --------------------------------------------------
                  Mobile drawer trigger
              -------------------------------------------------- */}
              <button
                type='button'
                className={styles.mobileShortcutTrigger}
                onClick={() => setIsMobileDrawerOpen(true)}
                aria-label='Open shortcuts'
              >
                <PanelsTopLeft
                  size={18}
                  strokeWidth={1.8}
                  aria-hidden='true'
                />{" "}
                Notes Menu
              </button>

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

          {/* --------------------------------------------------
              Mobile shortcut drawer
          -------------------------------------------------- */}
          <div
            className={`${styles.mobileDrawerOverlay} ${isMobileDrawerOpen ? styles.mobileDrawerOverlayVisible : ""}`}
            onClick={() => setIsMobileDrawerOpen(false)}
          >
            <aside
              className={`${styles.mobileDrawer} ${isMobileDrawerOpen ? styles.mobileDrawerVisible : ""}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.mobileDrawerHeader}>
                <h2>Shortcuts</h2>

                <button
                  type='button'
                  className={styles.mobileDrawerClose}
                  onClick={() => setIsMobileDrawerOpen(false)}
                  aria-label='Close shortcut menu'
                >
                  ×
                </button>
              </div>

              <div className={styles.mobileDrawerContent}>
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
                          onClick={() => handleShortcutSelect(shortcut)}
                        >
                          {shortcut.title}
                        </button>
                      ))}
                    </nav>
                  </section>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
