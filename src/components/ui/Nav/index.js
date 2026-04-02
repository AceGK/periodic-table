"use client";

import Link from 'next/link';
import { useState, useRef, useCallback, useEffect } from 'react';
import data from '@/lib/Elements.json';
import { getCategoryColor } from "@/lib/elementColors";
import styles from './styles.module.scss';

// ─── Icons ────────────────────────────────────────────────

import MinimalPeriodicTable from "@/assets/icons/minimal-periodic-table.svg";
import { HiListBullet, HiSun, HiMoon, HiCog6Tooth, HiDocumentText } from "react-icons/hi2";
import { PiCardsFill } from "react-icons/pi";
import { MdQuiz } from "react-icons/md";
import { BsInfoCircleFill, BsQuestionCircleFill } from "react-icons/bs";
import { GoGitCompare } from "react-icons/go";
import { IoChevronDown } from "react-icons/io5";

// ─── Nav item config ──────────────────────────────────────
// Types:
//   - href: direct link (no dropdown)
//   - links: dropdown with link list
//   - links + elementSearch: dropdown with link list + searchable element column

const NAV_ITEMS = [
  {
    label: "Elements",
    elementSearch: true,
    links: [
      { href: '/table', title: 'Periodic Table', desc: 'Interactive periodic table of elements', icon: <MinimalPeriodicTable width="1em" height="1em" />, color: 'var(--clr-phase-gas)' },
      { href: '/elements', title: 'Element List', desc: 'Browse all elements in a sortable list', icon: <HiListBullet />, color: 'var(--clr-phase-liquid)' },
      { href: '/compare', title: 'Compare', desc: 'Compare properties side by side', icon: <GoGitCompare />, color: 'var(--clr-phase-solid)' },
    ],
  },
  {
    label: "Learn",
    links: [
      { href: '/learn/flash-cards', title: 'Flash Cards', desc: 'Memorize elements with flip cards', icon: <PiCardsFill />, color: 'var(--clr-transition-metal)' },
      { href: '/learn/quizzes', title: 'Quizzes', desc: 'Test your knowledge of the elements', icon: <MdQuiz />, color: 'var(--clr-polyatomic-nonmetal)' },
    ],
  },
  {
    label: "Resources",
    links: [
      { href: '/about', title: 'About', desc: 'About this project', icon: <BsInfoCircleFill />, color: 'var(--clr-metalloid)' },
      { href: '/printable-pdfs', title: 'Printable PDFs', desc: 'Download a printable periodic table', icon: <HiDocumentText />, color: 'var(--clr-alkaline-earth-metal)' },
      { href: '/faq', title: 'FAQ', desc: 'Frequently asked questions', icon: <BsQuestionCircleFill />, color: 'var(--clr-noble-gas)' },
    ],
  },
  {
    label: "Support",
    href: "/support",
  },
];

const CLOSE_DELAY = 150;

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
  const dropdownItems = NAV_ITEMS.filter((item) => !item.href);

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

  const closeDropdown = useCallback(() => {
    setActiveIndex(null);
    setIndicatorStyle((s) => ({ ...s, opacity: 0 }));
  }, []);

  const toggleAccordion = (name) => setMobileAccordion(mobileAccordion === name ? null : name);
  const closeMobile = () => { setMobileOpen(false); setMobileAccordion(null); };

  // ─── Render helpers ───────────────────────────────────

  const renderDropdownLink = (link) => (
    <li key={link.href + link.title}>
      <Link href={link.href} className={styles.dropdownLink} onClick={closeDropdown}>
        <span className={styles.dropdownIcon} style={{ color: link.color }}>{link.icon}</span>
        <div>
          <strong>{link.title}</strong>
          <small>{link.desc}</small>
        </div>
      </Link>
    </li>
  );

  const renderDropdownContent = (item) => {
    if (item.elementSearch) {
      return (
        <div className={styles.elementsDropdown}>
          <ul className={styles.dropdownList}>
            {item.links.map(renderDropdownLink)}
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
                <Link key={el.number} href={`/element/${el.name.toLowerCase()}`} className={styles.elementItem} style={{ '--_cat-color': getCategoryColor(el.category) }} onClick={closeDropdown}>
                  <span className={styles.elementItemNumber}>{el.number}</span>
                  <span className={styles.elementItemSymbol}>{el.symbol}</span>
                  <span className={styles.elementItemName}>{el.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      );
    }
    return (
      <ul className={styles.dropdownList}>
        {item.links?.map(renderDropdownLink)}
      </ul>
    );
  };

  const renderMobileAccordion = (item) => {
    const key = item.label.toLowerCase();
    const isAccordionOpen = mobileAccordion === key;
    return (
      <div key={item.label} className={styles.mobileAccordion}>
        <button className={styles.mobileAccordionTrigger} onClick={() => toggleAccordion(key)} aria-expanded={isAccordionOpen}>
          {item.label}
          <IoChevronDown className={`${styles.mobileChevron} ${isAccordionOpen ? styles.mobileChevronOpen : ''}`} size={14} />
        </button>
        <div className={`${styles.mobileAccordionContent} ${isAccordionOpen ? styles.mobileAccordionOpen : ''}`}>
          {item.links.map((link) => (
            <Link key={link.href + link.title} href={link.href} className={styles.mobileSubLink} onClick={closeMobile}>
              {link.title}
            </Link>
          ))}
        </div>
      </div>
    );
  };

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
          {NAV_ITEMS.map((item) => {
            // Direct link (no dropdown)
            if (item.href) {
              return (
                <li key={item.label} onMouseEnter={(e) => { updateHighlight(e); startClose(); }} onMouseLeave={hideHighlight}>
                  <Link href={item.href} className={styles.navLink}>{item.label}</Link>
                </li>
              );
            }
            // Dropdown item
            const dropdownIndex = dropdownItems.indexOf(item);
            return (
              <li
                key={item.label}
                onMouseEnter={(e) => { updateHighlight(e); open(dropdownIndex); }}
                onMouseLeave={startClose}
              >
                <button
                  className={styles.trigger}
                  ref={(el) => (triggerRefs.current[dropdownIndex] = el)}
                  data-state={activeIndex === dropdownIndex ? "open" : "closed"}
                  aria-expanded={activeIndex === dropdownIndex}
                  onClick={() => activeIndex === dropdownIndex ? startClose() : open(dropdownIndex)}
                >
                  {item.label}
                  <IoChevronDown className={styles.chevron} size={12} />
                </button>
              </li>
            );
          })}
        </ul>

        {/* Right-side actions */}
        <div className={styles.navActions}>
          <button className={styles.iconBtn} onClick={() => setDarkMode(!darkMode)} aria-label="Toggle theme">
            {darkMode ? <HiSun size={18} /> : <HiMoon size={18} />}
          </button>
          <button className={styles.iconBtn} aria-label="Settings">
            <HiCog6Tooth size={18} />
          </button>
        </div>

        {/* Mobile actions + hamburger */}
        <div className={styles.mobileActions}>
          <button className={styles.iconBtn} onClick={() => setDarkMode(!darkMode)} aria-label="Toggle theme">
            {darkMode ? <HiSun size={18} /> : <HiMoon size={18} />}
          </button>
          <button className={styles.iconBtn} aria-label="Settings">
            <HiCog6Tooth size={18} />
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
          {dropdownItems.map((item, i) => (
            <div
              key={item.label}
              ref={(el) => (contentRefs.current[i] = el)}
              className={styles.content}
              style={{ display: activeIndex === i ? "block" : "none" }}
            >
              {renderDropdownContent(item)}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${styles.mobileMenu} ${mobileOpen ? styles.mobileMenuOpen : ''}`}>
        {NAV_ITEMS.map((item) => {
          if (item.href) {
            return (
              <Link key={item.label} href={item.href} className={styles.mobileLink} onClick={closeMobile}>
                {item.label}
              </Link>
            );
          }
          return renderMobileAccordion(item);
        })}
      </div>
    </nav>
  );
}
