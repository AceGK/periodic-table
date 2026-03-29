import styles from "./styles.module.scss";

export default function Select({ value, onChange, options, label, className, ...props }) {
  const select = (
    <select
      className={`${styles.select} ${className || ""}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      {...props}
    >
      {options.map((opt) => (
        <option key={opt.value ?? opt.id} value={opt.value ?? opt.id}>
          {opt.label}
        </option>
      ))}
    </select>
  );

  if (!label) return select;

  return (
    <label className={styles.field}>
      <span className={styles.label}>{label}</span>
      {select}
    </label>
  );
}
