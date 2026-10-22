"use client";

import { useState } from "react";
import groupsData from "@/lib/GroupFamilies.json";
import elementsData from "@/lib/Elements.json";
import WikiModal from "@/components/modules/WikiModal";
import Element from "@/components/ui/ElementCard";
import { CardDeck } from "@/components/modules/FlashCards";
import Select from "@/components/ui/Select";
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

const frontOptions = [
  { value: "number", label: "Group #", id: "number" },
  { value: "number-family", label: "Group # + Family", id: "number-family" },
  { value: "family", label: "Family Name", id: "family" },
];

function getGroupElements(groupNumber) {
  return elementsData.elements.filter((el) => {
    if (el.group !== groupNumber) return false;
    if (groupNumber === 3 && (el.category === "lanthanide" || el.category === "actinide")) {
      return el.number === 57 || el.number === 89;
    }
    return true;
  });
}

export default function GroupsFlashCardsPage() {
  const [wikiOpen, setWikiOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(groupsData.groups[0]);
  const [frontField, setFrontField] = useState("number");

  const renderFront = (item) => {
    if (frontField === "number") return <div className={cardStyles.valuePrimary}>Group {item.number}</div>;
    if (frontField === "number-family") return (
      <>
        <div className={cardStyles.valuePrimary}>Group {item.number}</div>
        <div className={cardStyles.valueSub}>{item.name}</div>
        {item.aka && <div className={styles.akaLabel}>{item.aka}</div>}
      </>
    );
    return (
      <>
        <div className={cardStyles.valuePrimary}>{item.name}</div>
        {item.aka && <div className={styles.akaLabel}>{item.aka}</div>}
      </>
    );
  };

  const renderBack = (item) => {
    const groupElements = getGroupElements(item.number);
    setCurrentItem(item);
    return (
      <div className={styles.groupBackInner}>
        <div className={styles.groupTitle}>
          Group {item.number} — {item.name}
        </div>
        {item.aka && <div className={styles.akaLabel}>{item.aka}</div>}
        <p className={styles.groupDescription}>
          {item.description}{" "}
          <span className={styles.groupWikiLink} onClick={(e) => { e.stopPropagation(); setWikiOpen(true); }}>
            Read more
          </span>
        </p>
        <div className={styles.groupElements}>
          {groupElements.map((el) => (
            <Element key={el.number} element={el} size="md" />
          ))}
        </div>
      </div>
    );
  };

  return (
    <main className={`container ${styles.page}`}>
      <PageHeader title="Groups" backHref="/learn/flash-cards" backLabel="← All Sets" />

      <div className={styles.toolbar}>
        <Select label="Front" value={frontField} onChange={setFrontField} options={frontOptions} />
      </div>

      <CardDeck
        items={groupsData.groups}
        renderFront={renderFront}
        renderBack={renderBack}
        backClassName={styles.groupBackScrollable}
      />

      <WikiModal title={wikiTitles[currentItem.name] || currentItem.wiki} displayText={`Group ${currentItem.number}`} externalOpen={wikiOpen} onExternalClose={() => setWikiOpen(false)}>
        <span className={styles.wikiHidden} />
      </WikiModal>
    </main>
  );
}
