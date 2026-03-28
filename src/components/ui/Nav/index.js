"use client";

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import styles from './styles.module.scss';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@/components/ui/NavigationMenu';

const learnLinks = [
  { href: '/learn/quizzes', title: 'Quizzes', desc: 'Test your knowledge of the elements' },
  { href: '/learn/flash-cards', title: 'Flash Cards', desc: 'Memorize elements with flip cards' },
];

const resourceLinks = [
  { href: '/', title: 'About', desc: 'About this project' },
  { href: '/', title: 'Printable PDF', desc: 'Download a printable periodic table' },
  { href: '/', title: 'FAQ', desc: 'Frequently asked questions' },
];

// Icons
const SettingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

export default function Nav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState(null);
  const [darkMode, setDarkMode] = useState(true);

  const isActive = (href) => pathname === href || pathname.startsWith(href + '/');
  const navLinkClass = (href) => `${navigationMenuTriggerStyle} ${isActive(href) ? styles.activeLink : ''}`;

  const toggleAccordion = (name) => {
    setMobileAccordion(mobileAccordion === name ? null : name);
  };

  const closeMobile = () => {
    setMobileOpen(false);
    setMobileAccordion(null);
  };

  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.logo}>
        <img src="/elementable-logo.svg" alt="Elementable" />
      </Link>

      {/* Desktop navigation — centered */}
      <div className={styles.desktopNav}>
        <NavigationMenu>
          <NavigationMenuList>

            <NavigationMenuItem>
              <Link href="/table" legacyBehavior passHref>
                <NavigationMenuLink className={navLinkClass('/table')}>
                  Table
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/elements" legacyBehavior passHref>
                <NavigationMenuLink className={navLinkClass('/elements')}>
                  Elements
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Learn</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className={styles.dropdownList}>
                  {learnLinks.map((link) => (
                    <li key={link.href}>
                      <NavigationMenuLink asChild>
                        <Link href={link.href} className={styles.dropdownLink}>
                          <strong>{link.title}</strong>
                          <small>{link.desc}</small>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className={styles.dropdownList}>
                  {resourceLinks.map((link) => (
                    <li key={link.title}>
                      <NavigationMenuLink asChild>
                        <Link href={link.href} className={styles.dropdownLink}>
                          <strong>{link.title}</strong>
                          <small>{link.desc}</small>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Right-side actions */}
      <div className={styles.navActions}>
        <button
          className={styles.iconBtn}
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Toggle theme"
        >
          {darkMode ? <SunIcon /> : <MoonIcon />}
        </button>
        <button className={styles.iconBtn} aria-label="Settings">
          <SettingsIcon />
        </button>
        <Link href="/support" className={styles.ctaBtn}>
          Support
        </Link>
      </div>

      {/* Mobile actions + hamburger */}
      <div className={styles.mobileActions}>
        <button
          className={styles.iconBtn}
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Toggle theme"
        >
          {darkMode ? <SunIcon /> : <MoonIcon />}
        </button>
        <button className={styles.iconBtn} aria-label="Settings">
          <SettingsIcon />
        </button>
        <button
          className={styles.hamburger}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <span className={`${styles.hamburgerLine} ${mobileOpen ? styles.open : ''}`} />
          <span className={`${styles.hamburgerLine} ${mobileOpen ? styles.open : ''}`} />
          <span className={`${styles.hamburgerLine} ${mobileOpen ? styles.open : ''}`} />
        </button>
      </div>

      {/* Mobile dropdown menu */}
      <div className={`${styles.mobileMenu} ${mobileOpen ? styles.mobileMenuOpen : ''}`}>
        <Link href="/table" className={styles.mobileLink} onClick={closeMobile}>
          Table
        </Link>

        <Link href="/elements" className={styles.mobileLink} onClick={closeMobile}>
          Elements
        </Link>

        {/* Learn accordion */}
        <div className={styles.mobileAccordion}>
          <button
            className={styles.mobileAccordionTrigger}
            onClick={() => toggleAccordion('learn')}
            aria-expanded={mobileAccordion === 'learn'}
          >
            Learn
            <svg
              className={`${styles.mobileChevron} ${mobileAccordion === 'learn' ? styles.mobileChevronOpen : ''}`}
              width="14" height="14" viewBox="0 0 10 10"
            >
              <path d="M2 3.5L5 6.5L8 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <div className={`${styles.mobileAccordionContent} ${mobileAccordion === 'learn' ? styles.mobileAccordionOpen : ''}`}>
            {learnLinks.map((link) => (
              <Link key={link.href} href={link.href} className={styles.mobileSubLink} onClick={closeMobile}>
                {link.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Resources accordion */}
        <div className={styles.mobileAccordion}>
          <button
            className={styles.mobileAccordionTrigger}
            onClick={() => toggleAccordion('resources')}
            aria-expanded={mobileAccordion === 'resources'}
          >
            Resources
            <svg
              className={`${styles.mobileChevron} ${mobileAccordion === 'resources' ? styles.mobileChevronOpen : ''}`}
              width="14" height="14" viewBox="0 0 10 10"
            >
              <path d="M2 3.5L5 6.5L8 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <div className={`${styles.mobileAccordionContent} ${mobileAccordion === 'resources' ? styles.mobileAccordionOpen : ''}`}>
            {resourceLinks.map((link) => (
              <Link key={link.title} href={link.href} className={styles.mobileSubLink} onClick={closeMobile}>
                {link.title}
              </Link>
            ))}
          </div>
        </div>

        <Link href="/support" className={styles.mobileLink} onClick={closeMobile}>
          Support
        </Link>
      </div>
    </nav>
  );
}
