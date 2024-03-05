import Link from 'next/link';
import styles from './Nav.module.scss'; 

// Array of link objects
const navLinks = [
  { href: '/', label: 'Home' }
];

export default function Nav(){
  return (
    <nav className={styles.nav}>
      <div className="container">
      <div className={styles.logo}>
      <img src="/elementable-logo.svg"></img>
      </div>
      <ul className={styles.navList}>
        {/* {navLinks.map((link) => (
          <li className={styles.navItem} key={link.href}>
            <Link href={link.href}>
              {link.label}
            </Link>
          </li>
        ))} */}
      </ul>
      </div>
    </nav>
  );
};
