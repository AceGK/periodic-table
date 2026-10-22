"use client";

import { useState, useRef, useEffect } from "react";
import { IoChevronDown } from "react-icons/io5";
import styles from "./styles.module.scss";

export default function MultiSelect({ label, value = [], onChange, options }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const toggle = (val) => {
    onChange(
      value.includes(val) ? value.filter((v) => v !== val) : [...value, val]
    );
  };

  const count = value.length;

  return (
    <div className={styles.wrapper} ref={ref}>
      {count > 0 && <span className={styles.badge}>{count}</span>}
      <button className={`${styles.trigger} ${count > 0 ? styles.triggerActive : ""}`} onClick={() => setOpen(!open)}>
        <span className={styles.triggerText}>{label}</span>
        <IoChevronDown size={12} className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`} />
      </button>
      {open && (
        <div className={styles.dropdown}>
          {options.map((opt) => {
            const selected = value.includes(opt.value);
            return (
              <button
                key={opt.value}
                className={`${styles.option} ${selected ? styles.optionSelected : ""}`}
                onClick={() => toggle(opt.value)}
              >
                <span className={`${styles.checkbox} ${selected ? styles.checkboxChecked : ""}`} />
                {opt.color && <span className={styles.swatch} style={{ background: opt.color }} />}
                <span className={styles.optionLabel}>{opt.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
