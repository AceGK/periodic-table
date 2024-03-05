import Link from 'next/link';
import styles from './Nav.module.scss';
import { LiaCubeSolid } from "react-icons/lia";
import { BiSolidDonateHeart } from "react-icons/bi";

// Array of link objects
const navLinks = [
  { href: '/project', label: 'Project', icon: <LiaCubeSolid /> },
  { href: '/support', label: 'Support', icon: <BiSolidDonateHeart />}
];

export default function Nav() {
  return (
    <nav className={`${styles.nav} container`}>
        <div href="/" className={styles.logo}>
        <Link href="/" className={styles.logo}>
          <img src="/elementable-logo.svg"/>
        </Link>
        </div>
        {/* <ul className={styles.navList}>
          {navLinks.map((link) => (
            <li className={styles.navItem} key={link.href}>
              <Link href={link.href}>
                {link.icon} {" "}
                {link.label}
              </Link>
            </li>
          ))}
        </ul> */}

    </nav>
  );
};
