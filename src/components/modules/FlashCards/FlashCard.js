import { getCategoryColor } from "@/lib/elementColors";
import { frontFields, backFields } from "./fields";
import Select from "@/components/ui/Select";
import styles from "./styles.module.scss";

function CardFieldSelect({ value, label, options, onChange }) {
  return (
    <label className={styles.cardFieldSelect} onClick={(e) => e.stopPropagation()}>
      <span>{label}</span>
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M2.5 4L5 6.5L7.5 4" />
      </svg>
      <Select
        className={styles.cardFieldSelectInput}
        value={value}
        onChange={onChange}
        options={options}
      />
    </label>
  );
}

export default function FlashCard({ element, front, back, flipped, animate, onFlip, onFrontChange, onBackChange }) {
  return (
    <div
      className={`${styles.card} ${flipped ? styles.cardFlipped : ""} ${animate ? "" : styles.cardNoTransition}`}
      onClick={onFlip}
    >
      <div className={styles.cardInner}>
        <div className={styles.cardFront}>
          <CardFieldSelect value={front.id} label={front.label} options={frontFields} onChange={onFrontChange} />
          {front.render(element)}
        </div>
        <div
          className={styles.cardBack}
          style={{ "--card-accent": getCategoryColor(element.category) }}
        >
          <CardFieldSelect value={back.id} label={back.label} options={backFields} onChange={onBackChange} />
          {back.render(element)}
        </div>
      </div>
    </div>
  );
}
