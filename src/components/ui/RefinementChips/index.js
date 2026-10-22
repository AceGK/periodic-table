import { IoClose } from "react-icons/io5";
import styles from "./styles.module.scss";

export default function RefinementChips({ items, onRemove, onClearAll }) {
  if (!items || items.length === 0) return null;

  return (
    <div className={styles.chips}>
      {items.map((item) => (
        <button key={item.key} className={styles.chip} onClick={() => onRemove(item)}>
          {item.group && <span className={styles.chipGroup}>{item.group}:</span>}
          <span className={styles.chipLabel}>{item.label}</span>
          <IoClose size={12} className={styles.chipClose} />
        </button>
      ))}
      {items.length > 1 && (
        <button className={styles.clearAll} onClick={onClearAll}>
          Clear all
        </button>
      )}
    </div>
  );
}
