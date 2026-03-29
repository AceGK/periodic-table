"use client";

import { useState, useCallback, useEffect } from "react";
import groupsData from "@/lib/ElementGroups.json";
import { getCategoryColor } from "@/lib/elementColors";
import Link from "next/link";
import styles from "@/components/modules/FlashCards/styles.module.scss";

const allGroups = groupsData.elementGroups.flatMap((g) =>
  g.groups.map((sub) => ({ ...sub, parent: g.name }))
);

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function GroupsFlashCardsPage() {
  const [cards, setCards] = useState(() => shuffle(allGroups));
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [animate, setAnimate] = useState(true);

  const total = cards.length;
  const current = cards[index];

  const navigate = useCallback((newIndex) => {
    setAnimate(false);
    setFlipped(false);
    setIndex(newIndex);
  }, []);

  useEffect(() => {
    if (!animate) {
      const id = requestAnimationFrame(() => setAnimate(true));
      return () => cancelAnimationFrame(id);
    }
  }, [animate]);

  const reshuffle = useCallback(() => {
    setAnimate(false);
    setFlipped(false);
    setCards(shuffle(allGroups));
    setIndex(0);
  }, []);

  const next = useCallback(() => {
    if (index < total - 1) navigate(index + 1);
  }, [index, total, navigate]);

  const prev = useCallback(() => {
    if (index > 0) navigate(index - 1);
  }, [index, navigate]);

  const handleKey = useCallback((e) => {
    if (e.key === "ArrowRight" || e.key === "d") next();
    else if (e.key === "ArrowLeft" || e.key === "a") prev();
    else if (e.key === " " || e.key === "Enter") { e.preventDefault(); setFlipped((f) => !f); }
  }, [next, prev]);

  const catColor = getCategoryColor(current.name);

  return (
    <main className="container" style={{ padding: "2rem 1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
        <Link href="/learn/flash-cards" style={{ color: "var(--clr-text-muted)", fontSize: "0.8125rem", textDecoration: "none" }}>
          ← All Sets
        </Link>
        <h1 style={{ fontSize: "1.5rem", margin: 0 }}>Groups</h1>
      </div>

      <div className={styles.deck} onKeyDown={handleKey} tabIndex={0}>
        <div
          className={`${styles.card} ${flipped ? styles.cardFlipped : ""} ${animate ? "" : styles.cardNoTransition}`}
          onClick={() => setFlipped((f) => !f)}
        >
          <div className={styles.cardInner}>
            <div className={styles.cardFront}>
              <div className={styles.valuePrimary} style={{ textTransform: "capitalize" }}>
                {current.name}
              </div>
              <div className={styles.valueSub}>{current.parent}</div>
            </div>
            <div className={styles.cardBack} style={{ "--card-accent": catColor }}>
              <div className={styles.valuePrimary} style={{ color: catColor, textTransform: "capitalize", fontSize: "1.25rem" }}>
                {current.name}
              </div>
              <p style={{ fontSize: "0.9375rem", lineHeight: 1.6, color: "var(--clr-text-secondary)", textAlign: "center", maxWidth: "320px" }}>
                {current.description}
              </p>
            </div>
          </div>
        </div>

        <div className={styles.controls}>
          <button className={styles.controlBtn} onClick={prev} disabled={index === 0}>
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M10 3L5 8L10 13" />
            </svg>
          </button>
          <span className={styles.progress}>{index + 1} / {total}</span>
          <button className={styles.controlBtn} onClick={next} disabled={index === total - 1}>
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 3L11 8L6 13" />
            </svg>
          </button>
        </div>

        <div className={styles.deckActions}>
          <button className={styles.shuffleBtn} onClick={reshuffle}>
            Shuffle &amp; Restart
          </button>
          <span className={styles.hint}>Space to flip · Arrow keys to navigate</span>
        </div>
      </div>
    </main>
  );
}
