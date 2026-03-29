import { getCategoryColor, getPhaseColor } from "@/lib/elementColors";
import PhaseIcon from "@/components/ui/PhaseIcon";
import FullDetails from "./FullDetails";
import styles from "./styles.module.scss";

// ─── Front fields (no color hints) ───────────────────────

export const frontFields = [
  {
    id: "name",
    label: "Name",
    render: (el) => <div className={styles.valuePrimary}>{el.name}</div>,
  },
  {
    id: "symbol",
    label: "Symbol",
    render: (el) => <div className={styles.valueLarge}>{el.symbol}</div>,
  },
  {
    id: "number",
    label: "Atomic #",
    render: (el) => <div className={styles.valuePrimary}>#{el.number}</div>,
  },
  {
    id: "name-symbol",
    label: "Name + Symbol",
    render: (el) => (
      <>
        <div className={styles.valueLarge}>{el.symbol}</div>
        <div className={styles.valueSub}>{el.name}</div>
      </>
    ),
  },
  {
    id: "name-number",
    label: "Name + Atomic #",
    render: (el) => (
      <>
        <div className={styles.valuePrimary}>{el.name}</div>
        <div className={styles.valueSub}>#{el.number}</div>
      </>
    ),
  },
  {
    id: "name-symbol-number",
    label: "Name + Symbol + Atomic #",
    render: (el) => (
      <>
        <div className={styles.valueLarge}>{el.symbol}</div>
        <div className={styles.valueSub}>{el.name} · #{el.number}</div>
      </>
    ),
  },
  {
    id: "symbol-number",
    label: "Symbol + Atomic #",
    render: (el) => (
      <>
        <div className={styles.valueLarge}>{el.symbol}</div>
        <div className={styles.valueSub}>#{el.number}</div>
      </>
    ),
  },
];

// ─── Back fields (with colors) ────────────────────────────

export const backFields = [
  {
    id: "full_details",
    label: "Full Details",
    render: (el) => <FullDetails element={el} />,
  },
  {
    id: "name",
    label: "Name",
    render: (el) => <div className={styles.valuePrimary}>{el.name}</div>,
  },
  {
    id: "symbol",
    label: "Symbol",
    render: (el) => <div className={styles.valueLarge}>{el.symbol}</div>,
  },
  {
    id: "number",
    label: "Atomic #",
    render: (el) => (
      <div className={styles.valueAccent} style={{ color: getCategoryColor(el.category) }}>
        #{el.number}
      </div>
    ),
  },
  {
    id: "mass",
    label: "Atomic Mass",
    render: (el) => <div className={styles.valuePrimary}>{el.atomic_mass} u</div>,
  },
  {
    id: "category",
    label: "Category",
    render: (el) => (
      <div className={styles.valuePrimary} style={{ color: getCategoryColor(el.category), textTransform: "capitalize" }}>
        {el.category}
      </div>
    ),
  },
  {
    id: "phase",
    label: "Phase",
    render: (el) => (
      <div className={styles.valuePrimary} style={{ color: getPhaseColor(el.phase), display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <PhaseIcon phase={el.phase} /> {el.phase}
      </div>
    ),
  },
  {
    id: "electron_config",
    label: "Electron Config",
    render: (el) => <div className={styles.valueConfig}>{el.electron_configuration_semantic}</div>,
  },
  {
    id: "shells",
    label: "Shells",
    render: (el) => <div className={styles.valuePrimary}>{el.shells?.join(", ")}</div>,
  },
  {
    id: "block",
    label: "Block",
    render: (el) => <div className={styles.valuePrimary}>{el.block}-block</div>,
  },
];
