import styles from "./styles.module.scss";

export function DataList({ children, className }) {
  return (
    <dl className={`${styles.list} ${className || ""}`}>
      {children}
    </dl>
  );
}

export function DataItem({ label, value, color, children }) {
  return (
    <div className={styles.item}>
      <dt className={styles.label}>{label}</dt>
      <dd className={styles.value} style={color ? { color } : undefined}>
        {children || value || "n/a"}
      </dd>
    </div>
  );
}
