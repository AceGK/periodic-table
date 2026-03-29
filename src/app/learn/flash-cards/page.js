import Card from "@/components/ui/Card";
import { IoIosCube } from "react-icons/io";
import { MdGroups } from "react-icons/md";

const sets = [
  {
    href: "/learn/flash-cards/elements",
    title: "Elements",
    description: "Study element names, symbols, atomic numbers, and properties",
    meta: "119 cards",
    // icon: <IoIosCube />,
    accent: "var(--clr-accent)",
  },
  {
    href: "/learn/flash-cards/groups",
    title: "Groups",
    description: "Learn element group names and their characteristics",
    meta: "11 cards",
    // icon: <MdGroups />,
    accent: "var(--clr-phase-liquid)",
  },
];

export default function FlashCardsPage() {
  return (
    <main className="container" style={{ padding: "2rem 1rem" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Flash Cards</h1>
      <p style={{ color: "var(--clr-text-secondary)", marginBottom: "1.5rem", fontSize: "0.875rem" }}>
        Choose a set to start studying.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "0.75rem" }}>
        {sets.map((set) => (
          <Card key={set.href} {...set} />
        ))}
      </div>
    </main>
  );
}
