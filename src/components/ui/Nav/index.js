"use client";

import Link from 'next/link';
import { useState, useRef, useCallback, useEffect } from 'react';
import data from '@/lib/Elements.json';
import styles from './styles.module.scss';
import MinimalPeriodicTable from "@/assets/icons/minimal-periodic-table.svg";
import { HiListBullet } from "react-icons/hi2";
import { PiCardsFill } from "react-icons/pi";
import { MdQuiz } from "react-icons/md";
import { BsInfoCircleFill, BsQuestionCircleFill } from "react-icons/bs";
import { HiDocumentText } from "react-icons/hi2";

// ─── Nav item config ──────────────────────────────────────

const NAV_ITEMS = [
  {
    label: "Elements",
    content: "elements",
  },
  {
    label: "Learn",
    links: [
      { href: '/learn/flash-cards', title: 'Flash Cards', desc: 'Memorize elements with flip cards', icon: <PiCardsFill />, color: 'var(--clr-phase-gas)' },
      { href: '/learn/quizzes', title: 'Quizzes', desc: 'Test your knowledge of the elements', icon: <MdQuiz />, color: 'var(--clr-phase-liquid)' },
    ],
  },
  {
    label: "Resources",
    links: [
      { href: '/', title: 'About', desc: 'About this project', icon: <BsInfoCircleFill />, color: 'var(--clr-accent)' },
      { href: '/', title: 'Printable PDF', desc: 'Download a printable periodic table', icon: <HiDocumentText />, color: 'var(--clr-phase-solid)' },
      { href: '/', title: 'FAQ', desc: 'Frequently asked questions', icon: <BsQuestionCircleFill />, color: 'var(--clr-noble-gas)' },
    ],
  },
  {
    label: "Support",
    href: "/support",
  },
];

const CLOSE_DELAY = 150;

// ─── Icons ────────────────────────────────────────────────

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

const ChevronDown = () => (
  <svg className={styles.chevron} width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M2 3.5L5 6.5L8 3.5" />
  </svg>
);

// ─── Component ────────────────────────────────────────────

export default function Nav() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [prevIndex, setPrevIndex] = useState(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ opacity: 0 });
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0, left: 0 });
  const [highlightStyle, setHighlightStyle] = useState({ opacity: 0 });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [elementSearch, setElementSearch] = useState('');

  const closeTimer = useRef(null);
  const triggerRefs = useRef([]);
  const contentRefs = useRef([]);
  const rootRef = useRef(null);
  const menuListRef = useRef(null);
  const highlightActive = useRef(false);

  const isOpen = activeIndex !== null;

  const filteredElements = elementSearch
    ? data.elements.filter((el) => {
        const q = elementSearch.toLowerCase();
        return el.name.toLowerCase().includes(q) || el.symbol.toLowerCase().includes(q) || String(el.number).includes(q);
      })
    : data.elements;

  // ─── Dropdown logic ───────────────────────────────────

  const updateIndicator = useCallback((index) => {
    const trigger = triggerRefs.current[index];
    const root = rootRef.current;
    if (!trigger || !root) return;
    const tRect = trigger.getBoundingClientRect();
    const rRect = root.getBoundingClientRect();
    setIndicatorStyle({
      opacity: 1,
      width: tRect.width,
      transform: `translateX(${tRect.left - rRect.left}px)`,
    });
  }, []);

  const updateViewportSize = useCallback((index) => {
    const content = contentRefs.current[index];
    const trigger = triggerRefs.current[index];
    const root = rootRef.current;
    if (!content || !trigger || !root) return;
    requestAnimationFrame(() => {
      const tRect = trigger.getBoundingClientRect();
      const rRect = root.getBoundingClientRect();
      const cWidth = content.scrollWidth;
      let left = tRect.left + tRect.width / 2 - rRect.left;
      const pad = 16;
      const minLeft = pad + cWidth / 2;
      const maxLeft = rRect.width - pad - cWidth / 2;
      left = Math.max(minLeft, Math.min(maxLeft, left));
      setViewportSize({ width: cWidth, height: content.scrollHeight, left });
    });
  }, []);

  const open = useCallback((index) => {
    clearTimeout(closeTimer.current);
    setPrevIndex(activeIndex);
    setActiveIndex(index);
    updateIndicator(index);
  }, [activeIndex, updateIndicator]);

  const startClose = useCallback(() => {
    closeTimer.current = setTimeout(() => {
      setPrevIndex(activeIndex);
      setActiveIndex(null);
      setIndicatorStyle((s) => ({ ...s, opacity: 0 }));
    }, CLOSE_DELAY);
  }, [activeIndex]);

  const cancelClose = useCallback(() => {
    clearTimeout(closeTimer.current);
  }, []);

  const updateHighlight = useCallback((e) => {
    const el = e.currentTarget.querySelector("button, a");
    const list = menuListRef.current;
    if (!el || !list) return;
    const elRect = el.getBoundingClientRect();
    const listRect = list.getBoundingClientRect();
    const shouldAnimate = highlightActive.current;
    highlightActive.current = true;
    setHighlightStyle({
      opacity: 1,
      width: elRect.width,
      height: elRect.height,
      transform: `translate(${elRect.left - listRect.left}px, ${elRect.top - listRect.top}px)`,
      animate: shouldAnimate,
    });
  }, []);

  const hideHighlight = useCallback(() => {
    setHighlightStyle((s) => ({ ...s, opacity: 0 }));
    highlightActive.current = false;
  }, []);

  useEffect(() => {
    if (activeIndex !== null) updateViewportSize(activeIndex);
  }, [activeIndex, updateViewportSize]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") {
        setActiveIndex(null);
        setIndicatorStyle((s) => ({ ...s, opacity: 0 }));
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  // ─── Mobile ───────────────────────────────────────────

  const toggleAccordion = (name) => setMobileAccordion(mobileAccordion === name ? null : name);
  const closeMobile = () => { setMobileOpen(false); setMobileAccordion(null); };

  // ─── Render helpers ───────────────────────────────────

  const renderDropdownLink = (link) => (
    <li key={link.href + link.title}>
      <Link href={link.href} className={styles.dropdownLink}>
        <span className={styles.dropdownIcon} style={{ color: link.color }}>{link.icon}</span>
        <div>
          <strong>{link.title}</strong>
          <small>{link.desc}</small>
        </div>
      </Link>
    </li>
  );

  const renderElementsContent = () => (
    <div className={styles.elementsDropdown}>
      <ul className={styles.dropdownList}>
        <li>
          <Link href="/table" className={styles.dropdownLink}>
            <span className={styles.dropdownIcon} style={{ color: 'var(--clr-accent)' }}><MinimalPeriodicTable width="1em" height="1em" /></span>
            <div>
              <strong>Periodic Table</strong>
              <small>Interactive periodic table of elements</small>
            </div>
          </Link>
        </li>
        <li>
          <Link href="/elements" className={styles.dropdownLink}>
            <span className={styles.dropdownIcon} style={{ color: 'var(--clr-phase-liquid)' }}><HiListBullet /></span>
            <div>
              <strong>List</strong>
              <small>Browse all elements in a sortable list</small>
            </div>
          </Link>
        </li>
      </ul>
      <div className={styles.elementsList}>
        <span className={styles.elementsListHeading}>Elements</span>
        <input
          type="text"
          placeholder="Search"
          value={elementSearch}
          onChange={(e) => setElementSearch(e.target.value)}
          className={styles.elementsSearch}
          onClick={(e) => e.stopPropagation()}
        />
        <div className={styles.elementsScroll}>
          {filteredElements.map((el) => (
            <Link key={el.number} href={`/element/${el.name.toLowerCase()}`} className={styles.elementItem}>
              <span className={styles.elementItemNumber}>{el.number}</span>
              <span className={styles.elementItemSymbol}>{el.symbol}</span>
              <span className={styles.elementItemName}>{el.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <nav className={styles.nav} ref={rootRef} onMouseLeave={startClose}>
      <div className={`container ${styles.navInner}`}>
        <Link href="/" className={styles.logo}>
          <img src="/elementable-logo.svg" alt="Elementable" />
        </Link>

        {/* Desktop menu */}
        <ul className={styles.menuList} ref={menuListRef} onMouseLeave={hideHighlight}>
          <div
            className={styles.highlight}
            style={{
              opacity: highlightStyle.opacity,
              width: highlightStyle.width,
              height: highlightStyle.height,
              transform: highlightStyle.transform,
              transition: highlightStyle.animate
                ? "transform 200ms ease, width 200ms ease, opacity 150ms ease"
                : "opacity 150ms ease",
            }}
          />
          {NAV_ITEMS.map((item, i) => {
            if (item.href) {
              return (
                <li key={item.label} onMouseEnter={(e) => { updateHighlight(e); startClose(); }} onMouseLeave={hideHighlight}>
                  <Link href={item.href} className={styles.navLink}>{item.label}</Link>
                </li>
              );
            }
            return (
              <li
                key={item.label}
                onMouseEnter={(e) => { updateHighlight(e); open(i); }}
                onMouseLeave={startClose}
              >
                <button
                  className={styles.trigger}
                  ref={(el) => (triggerRefs.current[i] = el)}
                  data-state={activeIndex === i ? "open" : "closed"}
                  aria-expanded={activeIndex === i}
                  onClick={() => activeIndex === i ? startClose() : open(i)}
                >
                  {item.label}
                  <ChevronDown />
                </button>
              </li>
            );
          })}
        </ul>

        {/* Right-side actions */}
        <div className={styles.navActions}>
          <button className={styles.iconBtn} onClick={() => setDarkMode(!darkMode)} aria-label="Toggle theme">
            {darkMode ? <SunIcon /> : <MoonIcon />}
          </button>
          <button className={styles.iconBtn} aria-label="Settings">
            <SettingsIcon />
          </button>
        </div>

        {/* Mobile actions + hamburger */}
        <div className={styles.mobileActions}>
          <button className={styles.iconBtn} onClick={() => setDarkMode(!darkMode)} aria-label="Toggle theme">
            {darkMode ? <SunIcon /> : <MoonIcon />}
          </button>
          <button className={styles.iconBtn} aria-label="Settings">
            <SettingsIcon />
          </button>
          <button className={styles.hamburger} onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu" aria-expanded={mobileOpen}>
            <span className={`${styles.hamburgerLine} ${mobileOpen ? styles.open : ''}`} />
            <span className={`${styles.hamburgerLine} ${mobileOpen ? styles.open : ''}`} />
            <span className={`${styles.hamburgerLine} ${mobileOpen ? styles.open : ''}`} />
          </button>
        </div>
      </div>

      {/* Indicator arrow */}
      <div
        className={styles.indicator}
        style={{
          ...indicatorStyle,
          transition: "transform 250ms ease, width 250ms ease, opacity 200ms ease",
        }}
      >
        <div className={styles.arrow} />
      </div>

      {/* Viewport */}
      <div
        className={styles.viewportPosition}
        style={{
          left: viewportSize.left,
          pointerEvents: isOpen ? "auto" : "none",
          transition: prevIndex !== null ? undefined : "none",
        }}
        onMouseEnter={cancelClose}
        onMouseLeave={startClose}
      >
        <div className={styles.bridge} />
        <div
          className={styles.viewport}
          data-state={isOpen ? "open" : "closed"}
          style={{
            width: viewportSize.width,
            height: viewportSize.height,
          }}
        >
          {NAV_ITEMS.map((item, i) => (
            <div
              key={item.label}
              ref={(el) => (contentRefs.current[i] = el)}
              className={styles.content}
              style={{ display: activeIndex === i ? "block" : "none" }}
            >
              {item.content === "elements" ? renderElementsContent() : (
                <ul className={styles.dropdownList}>
                  {item.links?.map(renderDropdownLink)}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <div className={`${styles.mobileMenu} ${mobileOpen ? styles.mobileMenuOpen : ''}`}>
        <div className={styles.mobileAccordion}>
          <button className={styles.mobileAccordionTrigger} onClick={() => toggleAccordion('elements')} aria-expanded={mobileAccordion === 'elements'}>
            Elements
            <svg className={`${styles.mobileChevron} ${mobileAccordion === 'elements' ? styles.mobileChevronOpen : ''}`} width="14" height="14" viewBox="0 0 10 10">
              <path d="M2 3.5L5 6.5L8 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <div className={`${styles.mobileAccordionContent} ${mobileAccordion === 'elements' ? styles.mobileAccordionOpen : ''}`}>
            <Link href="/table" className={styles.mobileSubLink} onClick={closeMobile}>Periodic Table</Link>
            <Link href="/elements" className={styles.mobileSubLink} onClick={closeMobile}>Element List</Link>
          </div>
        </div>

        <div className={styles.mobileAccordion}>
          <button className={styles.mobileAccordionTrigger} onClick={() => toggleAccordion('learn')} aria-expanded={mobileAccordion === 'learn'}>
            Learn
            <svg className={`${styles.mobileChevron} ${mobileAccordion === 'learn' ? styles.mobileChevronOpen : ''}`} width="14" height="14" viewBox="0 0 10 10">
              <path d="M2 3.5L5 6.5L8 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <div className={`${styles.mobileAccordionContent} ${mobileAccordion === 'learn' ? styles.mobileAccordionOpen : ''}`}>
            {NAV_ITEMS.find((i) => i.label === "Learn")?.links.map((link) => (
              <Link key={link.href} href={link.href} className={styles.mobileSubLink} onClick={closeMobile}>{link.title}</Link>
            ))}
          </div>
        </div>

        <div className={styles.mobileAccordion}>
          <button className={styles.mobileAccordionTrigger} onClick={() => toggleAccordion('resources')} aria-expanded={mobileAccordion === 'resources'}>
            Resources
            <svg className={`${styles.mobileChevron} ${mobileAccordion === 'resources' ? styles.mobileChevronOpen : ''}`} width="14" height="14" viewBox="0 0 10 10">
              <path d="M2 3.5L5 6.5L8 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <div className={`${styles.mobileAccordionContent} ${mobileAccordion === 'resources' ? styles.mobileAccordionOpen : ''}`}>
            {NAV_ITEMS.find((i) => i.label === "Resources")?.links.map((link) => (
              <Link key={link.title} href={link.href} className={styles.mobileSubLink} onClick={closeMobile}>{link.title}</Link>
            ))}
          </div>
        </div>

        <Link href="/support" className={styles.mobileLink} onClick={closeMobile}>Support</Link>
      </div>
    </nav>
  );
}
