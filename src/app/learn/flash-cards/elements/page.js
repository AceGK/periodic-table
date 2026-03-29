"use client";

import data from "@/lib/Elements.json";
import {
  FlashCardDeck,
  useFlashCardConfig,
  frontFields,
  backFields,
} from "@/components/modules/FlashCards";
import Select from "@/components/ui/Select";
import Link from "next/link";
import styles from "../styles.module.scss";

const categories = [...new Set(data.elements.map((el) => el.category))].sort();
const groupOptions = [
  { value: "all", label: "All Groups" },
  ...categories.map((cat) => ({ value: cat, label: cat })),
];

export default function ElementsFlashCardsPage() {
  const { frontField, setFrontField, backField, setBackField, set, setSet } = useFlashCardConfig();

  const front = frontFields.find((f) => f.id === frontField) || frontFields[0];
  const back = backFields.find((f) => f.id === backField) || backFields[0];

  return (
    <main className="container" style={{ padding: "2rem 1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
        <Link href="/learn/flash-cards" style={{ color: "var(--clr-text-muted)", fontSize: "0.8125rem", textDecoration: "none" }}>
          ← All Sets
        </Link>
        <h1 style={{ fontSize: "1.5rem", margin: 0 }}>Elements</h1>
      </div>

      <div className={styles.toolbar}>
        <Select label="Group" value={set} onChange={setSet} options={groupOptions} />
        <Select label="Front" value={frontField} onChange={setFrontField} options={frontFields} />
        <Select label="Back" value={backField} onChange={setBackField} options={backFields} />
      </div>

      <FlashCardDeck front={front} back={back} set={set} onFrontChange={setFrontField} onBackChange={setBackField} onSetChange={setSet} setOptions={groupOptions} />
    </main>
  );
}
