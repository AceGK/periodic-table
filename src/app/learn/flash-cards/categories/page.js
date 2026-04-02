"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import categoriesData from "@/lib/ElementCategories.json";
import elementsData from "@/lib/Elements.json";
import { getCategoryColor } from "@/lib/elementColors";
import WikiModal from "@/components/modules/WikiModal";
import Element from "@/components/ui/ElementCard";
import { FlashCard } from "@/components/modules/FlashCards";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import Link from "next/link";
import cardStyles from "@/components/modules/FlashCards/styles.module.scss";
import styles from "../styles.module.scss";

const wikiTitles = {
  "alkali metal": "Alkali_metal",
  "alkaline earth metal": "Alkaline_earth_metal",
  "transition metal": "Transition_metal",
  "post-transition metal": "Post-transition_metal",
  "lanthanide": "Lanthanide",
  "actinide": "Actinide",
  "metalloid": "Metalloid",
  "diatomic nonmetal": "Nonmetal",
  "polyatomic nonmetal": "Nonmetal",
  "noble gas": "Noble_gas",
  "unknown": "Superheavy_element",
};

const allCategories = categoriesData.elementGroups.flatMap((g) =>
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

export default function CategoriesFlashCardsPage() {
  const [cards, setCards] = useState(() => shuffle(allCategories));
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [animate, setAnimate] = useState(true);
  const [wikiOpen, setWikiOpen] = useState(false);

  const total = cards.length;
  const current = cards[index];
  const catColor = getCategoryColor(current.name);
  const categoryElements = useMemo(() =>
    elementsData.elements.filter((el) => el.category === current.name),
    [current.name]
  );

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
    setCards(shuffle(allCategories));
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

  const renderFront = () => (
    <>
      <div className={`${cardStyles.valuePrimary} ${styles.groupTitle}`}>{current.name}</div>
      <div className={cardStyles.valueSub}>{current.parent}</div>
    </>
  );

  const renderBack = () => (
    <div className={styles.groupBackInner}>
      <div className={styles.groupTitle} style={{ color: catColor }}>{current.name}</div>
      <p className={styles.groupDescription}>
        {current.description}{" "}
        <span className={styles.groupWikiLink} onClick={(e) => { e.stopPropagation(); setWikiOpen(true); }}>
          Read more
        </span>
      </p>
      <div className={styles.groupElements}>
        {categoryElements.map((el) => (
          <Element key={el.number} element={el} size="md" />
        ))}
      </div>
    </div>
  );

  return (
    <main className={`container ${styles.page}`}>
      <div className={styles.pageHeader}>
        <Link href="/learn/flash-cards" className={styles.backLink}>← All Sets</Link>
        <h1 className={styles.pageTitle}>Categories</h1>
      </div>

      <div className={cardStyles.deck} onKeyDown={handleKey} tabIndex={0}>
        <FlashCard
          front={{ render: renderFront }}
          back={{ render: renderBack }}
          accent={catColor}
          flipped={flipped}
          animate={animate}
          onFlip={() => setFlipped((f) => !f)}
          backClassName={styles.groupBackScrollable}
        />

        <div className={cardStyles.controls}>
          <button className={cardStyles.controlBtn} onClick={prev} disabled={index === 0}>
            <IoChevronBack size={18} />
          </button>
          <span className={cardStyles.progress}>{index + 1} / {total}</span>
          <button className={cardStyles.controlBtn} onClick={next} disabled={index === total - 1}>
            <IoChevronForward size={18} />
          </button>
        </div>

        <div className={cardStyles.deckActions}>
          <button className={cardStyles.shuffleBtn} onClick={reshuffle}>
            Shuffle &amp; Restart
          </button>
          <span className={cardStyles.hint}>Space to flip · Arrow keys to navigate</span>
        </div>
      </div>

      <WikiModal title={wikiTitles[current.name] || current.name} displayText={current.name} externalOpen={wikiOpen} onExternalClose={() => setWikiOpen(false)}>
        <span className={styles.wikiHidden} />
      </WikiModal>
    </main>
  );
}
