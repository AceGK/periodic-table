"use client";

import blocksData from "@/lib/ElementBlocks.json";
import elementsData from "@/lib/Elements.json";
import WikiModal from "@/components/modules/WikiModal";
import Element from "@/components/ui/ElementCard";
import { CardDeck } from "@/components/modules/FlashCards";
import PageHeader from "@/components/ui/PageHeader";
import { useState } from "react";
import cardStyles from "@/components/modules/FlashCards/styles.module.scss";
import styles from "../styles.module.scss";

export default function BlocksFlashCardsPage() {
  const [wikiOpen, setWikiOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(blocksData.blocks[0]);

  const renderFront = (item) => (
    <>
      <div className={cardStyles.valueLarge}>{item.name}</div>
      <div className={cardStyles.valueSub}>{item.name}-block</div>
    </>
  );

  const renderBack = (item) => {
    const blockElements = elementsData.elements.filter((el) => el.block === item.name);
    setCurrentItem(item);
    return (
      <div className={styles.groupBackInner}>
        <div className={styles.groupTitle}>{item.name}-block</div>
        <div className={styles.akaLabel}>{item.orbitals} · {item.groups}</div>
        <p className={styles.groupDescription}>
          {item.description}{" "}
          <span className={styles.groupWikiLink} onClick={(e) => { e.stopPropagation(); setWikiOpen(true); }}>
            Read more
          </span>
        </p>
        <div className={styles.groupElements}>
          {blockElements.map((el) => (
            <Element key={el.number} element={el} size="md" />
          ))}
        </div>
      </div>
    );
  };

  return (
    <main className={`container ${styles.page}`}>
      <PageHeader title="Blocks" backHref="/learn/flash-cards" backLabel="← All Sets" />

      <CardDeck
        items={blocksData.blocks}
        renderFront={renderFront}
        renderBack={renderBack}
        backClassName={styles.groupBackScrollable}
      />

      <WikiModal title={currentItem.wiki} displayText={`${currentItem.name}-block`} externalOpen={wikiOpen} onExternalClose={() => setWikiOpen(false)}>
        <span className={styles.wikiHidden} />
      </WikiModal>
    </main>
  );
}
