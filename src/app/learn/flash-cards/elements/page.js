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
const categoryOptions = [
  { value: "all", label: "All Categories" },
  ...categories.map((cat) => ({ value: cat, label: cat })),
];

export default function ElementsFlashCardsPage() {
  const { frontField, setFrontField, backField, setBackField, set, setSet } = useFlashCardConfig();

  const front = frontFields.find((f) => f.id === frontField) || frontFields[0];
  const back = backFields.find((f) => f.id === backField) || backFields[0];

  return (
    <main className={`container ${styles.page}`}>
      <div className={styles.pageHeader}>
        <Link href="/learn/flash-cards" className={styles.backLink}>← All Sets</Link>
        <h1 className={styles.pageTitle}>Elements</h1>
      </div>

      <div className={styles.toolbar}>
        <Select label="Category" value={set} onChange={setSet} options={categoryOptions} />
        <Select label="Front" value={frontField} onChange={setFrontField} options={frontFields} />
        <Select label="Back" value={backField} onChange={setBackField} options={backFields} />
      </div>

      <FlashCardDeck front={front} back={back} set={set} onFrontChange={setFrontField} onBackChange={setBackField} onSetChange={setSet} setOptions={categoryOptions} />
    </main>
  );
}
