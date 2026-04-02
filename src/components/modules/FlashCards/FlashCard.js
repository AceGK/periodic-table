import { IoChevronDown } from "react-icons/io5";
import Select from "@/components/ui/Select";
import styles from "./styles.module.scss";

function CardFieldSelect({ value, label, options, onChange }) {
  if (!options || !onChange) return null;
  return (
    <label className={styles.cardFieldSelect} onClick={(e) => e.stopPropagation()}>
      <span>{label}</span>
      <IoChevronDown size={10} />
      <Select
        className={styles.cardFieldSelectInput}
        value={value}
        onChange={onChange}
        options={options}
      />
    </label>
  );
}

export default function FlashCard({
  front,
  back,
  flipped,
  animate,
  onFlip,
  accent,
  frontOptions,
  backOptions,
  onFrontChange,
  onBackChange,
  backClassName,
  backChildren,
}) {
  return (
    <div
      className={`${styles.card} ${flipped ? styles.cardFlipped : ""} ${animate ? "" : styles.cardNoTransition}`}
      onClick={onFlip}
    >
      <div className={styles.cardInner}>
        <div className={styles.cardFront}>
          <CardFieldSelect value={front?.id} label={front?.label} options={frontOptions} onChange={onFrontChange} />
          {typeof front?.render === "function" ? front.render() : front}
        </div>
        <div
          className={`${styles.cardBack} ${backClassName || ""}`}
          style={accent ? { "--card-accent": accent } : undefined}
        >
          <CardFieldSelect value={back?.id} label={back?.label} options={backOptions} onChange={onBackChange} />
          {typeof back?.render === "function" ? back.render() : back}
          {backChildren}
        </div>
      </div>
    </div>
  );
}
