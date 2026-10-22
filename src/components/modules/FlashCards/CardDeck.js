"use client";

import { useState, useCallback, useEffect } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import FlashCard from "./FlashCard";
import styles from "./styles.module.scss";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function CardDeck({
  items,
  renderFront,
  renderBack,
  accent,
  frontOptions,
  backOptions,
  onFrontChange,
  onBackChange,
  backClassName,
}) {
  const [cards, setCards] = useState(() => shuffle(items));
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [animate, setAnimate] = useState(true);

  // Re-shuffle when items change
  useEffect(() => {
    setCards(shuffle(items));
    setIndex(0);
    setFlipped(false);
  }, [items]);

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
    setCards(shuffle(items));
    setIndex(0);
  }, [items]);

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

  if (!current) return null;

  const frontObj = renderFront
    ? { render: () => renderFront(current) }
    : undefined;

  const backObj = renderBack
    ? { render: () => renderBack(current) }
    : undefined;

  return (
    <div className={styles.deck} onKeyDown={handleKey} tabIndex={0}>
      <FlashCard
        front={frontObj}
        back={backObj}
        accent={typeof accent === "function" ? accent(current) : accent}
        frontOptions={frontOptions}
        backOptions={backOptions}
        onFrontChange={onFrontChange}
        onBackChange={onBackChange}
        flipped={flipped}
        animate={animate}
        onFlip={() => setFlipped((f) => !f)}
        backClassName={backClassName}
      />

      <div className={styles.controls}>
        <button className={styles.controlBtn} onClick={prev} disabled={index === 0}>
          <IoChevronBack size={18} />
        </button>
        <span className={styles.progress}>{index + 1} / {total}</span>
        <button className={styles.controlBtn} onClick={next} disabled={index === total - 1}>
          <IoChevronForward size={18} />
        </button>
      </div>

      <div className={styles.deckActions}>
        <button className={styles.shuffleBtn} onClick={reshuffle}>
          Shuffle &amp; Restart
        </button>
        <span className={styles.hint}>Space to flip · Arrow keys to navigate</span>
      </div>
    </div>
  );
}
