"use client";

import { useState, useCallback, useEffect } from "react";
import data from "@/lib/Elements.json";
import FlashCard from "./FlashCard";
import Select from "@/components/ui/Select";
import styles from "./styles.module.scss";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getElements(set) {
  if (!set || set === "all") return data.elements;
  return data.elements.filter((el) => el.category === set);
}

export default function FlashCardDeck({ front, back, set, onFrontChange, onBackChange, onSetChange, setOptions }) {
  const [cards, setCards] = useState(() => shuffle(getElements(set)));
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [animate, setAnimate] = useState(true);

  // Re-shuffle when the set changes
  useEffect(() => {
    setCards(shuffle(getElements(set)));
    setIndex(0);
    setFlipped(false);
  }, [set]);

  const total = cards.length;
  const current = cards[index];

  const navigate = useCallback((newIndex) => {
    setAnimate(false);
    setFlipped(false);
    setIndex(newIndex);
  }, []);

  // Re-enable animation after a navigation snap
  useEffect(() => {
    if (!animate) {
      const id = requestAnimationFrame(() => setAnimate(true));
      return () => cancelAnimationFrame(id);
    }
  }, [animate]);

  const reshuffle = useCallback(() => {
    setAnimate(false);
    setFlipped(false);
    setCards(shuffle(getElements(set)));
    setIndex(0);
  }, [set]);

  const next = useCallback(() => {
    if (index < total - 1) navigate(index + 1);
  }, [index, total, navigate]);

  const prev = useCallback(() => {
    if (index > 0) navigate(index - 1);
  }, [index, navigate]);

  const handleKey = useCallback((e) => {
    if (e.key === "ArrowRight" || e.key === "d") next();
    else if (e.key === "ArrowLeft" || e.key === "a") prev();
    else if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      setFlipped((f) => !f);
    }
  }, [next, prev]);

  return (
    <div className={styles.deck} onKeyDown={handleKey} tabIndex={0}>
      <FlashCard
        element={current}
        front={front}
        back={back}
        flipped={flipped}
        animate={animate}
        onFlip={() => setFlipped((f) => !f)}
        onFrontChange={onFrontChange}
        onBackChange={onBackChange}
      />

      <div className={styles.controls}>
        <button className={styles.controlBtn} onClick={prev} disabled={index === 0}>
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M10 3L5 8L10 13" />
          </svg>
        </button>
        <div className={styles.progressGroup}>
          <span className={styles.progress}>{index + 1} / {total}</span>
          <label className={styles.setLabel} onClick={(e) => e.stopPropagation()}>
            <span>{set === "all" ? "All Groups" : set}</span>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M2.5 4L5 6.5L7.5 4" />
            </svg>
            <Select
              className={styles.setLabelInput}
              value={set}
              onChange={onSetChange}
              options={setOptions}
            />
          </label>
        </div>
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
  );
}
