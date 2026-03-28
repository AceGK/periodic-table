import Link from "next/link";

const learnPages = [
  { href: "/learn/quizzes", title: "Quizzes", description: "Test your knowledge of the elements" },
  { href: "/learn/flash-cards", title: "Flash Cards", description: "Memorize elements with flip cards" },
  { href: "/learn/element-matcher", title: "Element Matcher", description: "Match elements to their properties" },
  { href: "/learn/trends", title: "Trends Explorer", description: "Visualize periodic trends interactively" },
  { href: "/learn/electron-config", title: "Electron Config", description: "Practice writing electron configurations" },
];

export default function LearnPage() {
  return (
    <main className="container" style={{ padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Learn</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
        {learnPages.map((page) => (
          <Link
            key={page.href}
            href={page.href}
            style={{
              display: 'block',
              padding: '1.25rem',
              border: '1px solid rgb(52, 52, 63)',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'background-color 0.15s',
            }}
          >
            <strong style={{ display: 'block', marginBottom: '0.25rem' }}>{page.title}</strong>
            <small style={{ color: 'rgb(140, 140, 150)' }}>{page.description}</small>
          </Link>
        ))}
      </div>
    </main>
  );
}
