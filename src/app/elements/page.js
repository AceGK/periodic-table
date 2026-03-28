import data from "@/lib/Elements.json";
import Link from "next/link";

export default function ElementsPage() {
  return (
    <main className="container" style={{ padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>All Elements</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgb(52, 52, 63)', textAlign: 'left' }}>
            <th style={{ padding: '0.5rem' }}>#</th>
            <th style={{ padding: '0.5rem' }}>Symbol</th>
            <th style={{ padding: '0.5rem' }}>Name</th>
            <th style={{ padding: '0.5rem' }}>Atomic Mass</th>
            <th style={{ padding: '0.5rem' }}>Category</th>
            <th style={{ padding: '0.5rem' }}>Phase</th>
          </tr>
        </thead>
        <tbody>
          {data.elements.map((el) => (
            <tr
              key={el.number}
              style={{ borderBottom: '1px solid rgb(38, 38, 42)' }}
            >
              <td style={{ padding: '0.5rem' }}>{el.number}</td>
              <td style={{ padding: '0.5rem', fontWeight: 700 }}>{el.symbol}</td>
              <td style={{ padding: '0.5rem' }}>{el.name}</td>
              <td style={{ padding: '0.5rem' }}>{el.atomic_mass}</td>
              <td style={{ padding: '0.5rem', textTransform: 'capitalize' }}>{el.category}</td>
              <td style={{ padding: '0.5rem' }}>{el.phase}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
