import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import styles from "./styles.module.scss";

const sets = [
  {
    href: "/learn/flash-cards/elements",
    title: "Elements",
    description: "Study element names, symbols, atomic numbers, and properties",
    meta: "118 cards",
    accent: "var(--clr-phase-solid)",
  },
  {
    href: "/learn/flash-cards/categories",
    title: "Categories",
    description: "Learn element categories like alkali metals, noble gases, and metalloids",
    meta: "11 cards",
    accent: "var(--clr-phase-gas)",
  },
  {
    href: "/learn/flash-cards/groups",
    title: "Groups",
    description: "Study the 18 periodic table groups and their family names",
    meta: "18 cards",
    accent: "var(--clr-phase-liquid)",
  },
  {
    href: "/learn/flash-cards/blocks",
    title: "Blocks",
    description: "Learn the 4 electron orbital blocks and their properties",
    meta: "4 cards",
    accent: "var(--clr-noble-gas)",
  },
];

export default function FlashCardsPage() {
  return (
    <main className={`container ${styles.page}`}>
      <PageHeader title="Flash Cards" subtitle="Choose a set to start studying." />
      <div className={styles.setGrid}>
        {sets.map((set) => (
          <Card key={set.href} {...set} />
        ))}
      </div>
    </main>
  );
}
