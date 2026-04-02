import Card from "@/components/ui/Card";
import styles from "./styles.module.scss";

const sets = [
  {
    href: "/learn/flash-cards/elements",
    title: "Elements",
    description: "Study element names, symbols, atomic numbers, and properties",
    meta: "119 cards",
    accent: "var(--clr-accent)",
  },
  {
    href: "/learn/flash-cards/categories",
    title: "Categories",
    description: "Learn element categories like alkali metals, noble gases, and metalloids",
    meta: "11 cards",
    accent: "var(--clr-phase-liquid)",
  },
  {
    href: "/learn/flash-cards/groups",
    title: "Groups",
    description: "Study the 18 periodic table groups and their family names",
    meta: "18 cards",
    accent: "var(--clr-phase-gas)",
  },
];

export default function FlashCardsPage() {
  return (
    <main className={`container ${styles.page}`}>
      <h1 className={styles.pageTitle}>Flash Cards</h1>
      <p className={styles.pageSubtitle}>Choose a set to start studying.</p>
      <div className={styles.setGrid}>
        {sets.map((set) => (
          <Card key={set.href} {...set} />
        ))}
      </div>
    </main>
  );
}
