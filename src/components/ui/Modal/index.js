"use client";

import { useEffect, useRef, useCallback } from "react";
import styles from "./styles.module.scss";

export function Modal({ open, onClose, title, children, className, bodyClassName }) {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);

  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === "Escape") handleClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, handleClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div className={styles.portal}>
      <div className={styles.overlay} onClick={handleClose} />
      <div className={`${styles.content} ${className || ""}`} ref={contentRef}>
        <div className={styles.header}>
          {title && <h2 className={styles.title}>{title}</h2>}
          <button className={styles.close} onClick={handleClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 3L13 13M13 3L3 13" />
            </svg>
          </button>
        </div>
        <div className={`${styles.body} ${bodyClassName || ""}`}>
          {children}
        </div>
      </div>
    </div>
  );
}

export function ModalTrigger({ children, onClick, className }) {
  return (
    <button className={`${styles.trigger} ${className || ""}`} onClick={onClick}>
      {children}
    </button>
  );
}
