import Link from 'next/link';
import styles from './styles.module.scss';

const links = [
  { href: '/table', label: 'Table' },
  { href: '/elements', label: 'Elements' },
  { href: '/learn', label: 'Learn' },
  { href: '/support', label: 'Support' },
  { href: '/', label: 'About' },
  { href: '/', label: 'FAQ' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <img src="/elementable-logo.svg" alt="Elementable" />
        </Link>
        <nav className={styles.links}>
          {links.map((link) => (
            <Link key={link.label} href={link.href}>{link.label}</Link>
          ))}
        </nav>
        <p className={styles.copy}>&copy; {currentYear} Elementable</p>
      </div>
    </footer>
  );
}
