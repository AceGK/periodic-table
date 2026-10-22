"use client";

import { useState } from "react";
import categoriesData from "@/lib/ElementCategories.json";
import elementsData from "@/lib/Elements.json";
import { getCategoryColor } from "@/lib/elementColors";
import WikiModal from "@/components/modules/WikiModal";
import Element from "@/components/ui/ElementCard";
import { CardDeck } from "@/components/modules/FlashCards";
import PageHeader from "@/components/ui/PageHeader";
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

export default function CategoriesFlashCardsPage() {
  const [wikiOpen, setWikiOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(allCategories[0]);

  const renderFront = (item) => (
    <>
      <div className={`${cardStyles.valuePrimary} ${styles.groupTitle}`}>{item.name}</div>
      <div className={cardStyles.valueSub}>{item.parent}</div>
    </>
  );

  const renderBack = (item) => {
    const categoryElements = elementsData.elements.filter((el) => el.category === item.name);
    setCurrentItem(item);
    return (
      <div className={styles.groupBackInner}>
        <div className={styles.groupTitle} style={{ color: getCategoryColor(item.name) }}>{item.name}</div>
        <p className={styles.groupDescription}>
          {item.description}{" "}
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
  };

  return (
    <main className={`container ${styles.page}`}>
      <PageHeader title="Categories" backHref="/learn/flash-cards" backLabel="← All Sets" />

      <CardDeck
        items={allCategories}
        renderFront={renderFront}
        renderBack={renderBack}
        accent={(item) => getCategoryColor(item.name)}
        backClassName={styles.groupBackScrollable}
      />

      <WikiModal title={wikiTitles[currentItem.name] || currentItem.name} displayText={currentItem.name} externalOpen={wikiOpen} onExternalClose={() => setWikiOpen(false)}>
        <span className={styles.wikiHidden} />
      </WikiModal>
    </main>
  );
}
