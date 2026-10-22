"use client";

import data from "@/lib/Elements.json";
import { useState } from "react";
import Element from "@/components/ui/ElementCard";
import Legend from "@/components/ui/Legend";
import ElementDetails from "@/components/modules/ElementDetails";
import TemperatureSlider from "@/components/ui/TemperatureSlider";
import styles from "./styles.module.scss";

export default function PeriodicTable({ }) {

  const [selectedElement, setSelectedElement] = useState();
  const [hoveredElement, setHoveredElement] = useState(data.elements[0]);
  const [selectedGroup, setSelectedGroup] = useState([]);
  const [hoveredGroup, setHoveredGroup] = useState(null);
  const [layout, setLayout] = useState("stacked"); // "stacked" | "side"
  const [temperature, setTemperature] = useState(298); // Kelvin, 25°C (room temp)

  const handleElementClick = (element) => {
    if (selectedElement && element.number === selectedElement.number) {
      setSelectedElement(null);
    } else {
      setSelectedElement(element);
    }
  };

  const isGroupSelected = (groupName) => selectedGroup.includes(groupName.replace(/ /g, "-").toLowerCase());

  const isSide = layout === "side";

  return (
    <>
      {/* Toolbar */}
      {/* <div className={`${styles.toolbarRow} container`}>
        <div className={styles.toolbar}>
          <button
            className={`${styles.toolbarBtn} ${layout === "stacked" ? styles.toolbarBtnActive : ""}`}
            onClick={() => setLayout("stacked")}
            title="Details above table"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <rect x="2" y="2" width="12" height="4" rx="1" />
              <rect x="2" y="9" width="12" height="5" rx="1" />
            </svg>
          </button>
          <button
            className={`${styles.toolbarBtn} ${layout === "side" ? styles.toolbarBtnActive : ""}`}
            onClick={() => setLayout("side")}
            title="Details as side drawer"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <rect x="2" y="2" width="4" height="12" rx="1" />
              <rect x="9" y="2" width="5" height="12" rx="1" />
            </svg>
          </button>
        </div>
      </div> */}

      <div className={isSide ? styles.layoutSide : styles.layoutStacked}>

        {/* Details panel */}
        <div className={isSide ? styles.sidePanel : ""}>
          <section className={isSide ? "" : "container"}>
            <ElementDetails selectedElement={selectedElement} setSelectedElement={setSelectedElement} hoveredElement={hoveredElement} compact={isSide} temperature={temperature} setTemperature={setTemperature} />
          </section>
        </div>

        {/* Temperature slider - between details and table in stacked, above table in side */}
        {!isSide && (
          <div className={`${styles.temperatureRow} container`}>
            <TemperatureSlider temperature={temperature} setTemperature={setTemperature} />
          </div>
        )}

        {/* Table area */}
        <div className={isSide ? styles.tableArea : ""}>

          {isSide && (
            <div className={styles.temperatureRow}>
              <TemperatureSlider temperature={temperature} setTemperature={setTemperature} />
            </div>
          )}

          <div className="container" style={{ overflow: 'auto', marginBottom: '5rem' }}>
            <div className="periodic-table">

            <section className="tabs">
              <Legend setSelectedGroup={setSelectedGroup} setHoveredGroup={setHoveredGroup} selectedGroup={selectedGroup} />
            </section>

            {/* Element card key */}
            <div className={styles.cardKey} style={{ gridRow: 2, gridColumn: 3 }}>
              <div className={styles.cardKeyNumber}>Atomic</div>
              <div className={styles.cardKeySymbol}>Symbol</div>
              <div>
                <div className={styles.cardKeyName}>Name</div>
                <div className={styles.cardKeyMass}>Weight</div>
              </div>
            </div>

            {/* Column numbers (groups 1-18) */}
            {Array.from({ length: 18 }, (_, i) => {
              const groupNames = [
                "Lithium Family", "Beryllium Family", "Scandium Family", "Titanium Family",
                "Vanadium Family", "Chromium Family", "Manganese Family", "Iron Family",
                "Cobalt Family", "Nickel Family", "Copper Family", "Zinc Family",
                "Boron Family", "Carbon Family", "Pnictogens", "Chalcogens",
                "Halogens", "Noble Gases"
              ];
              return (
                <span key={`col-${i}`} className="grid-label col-label" style={{ gridColumn: i + 2, gridRow: 1 }} title={`Group ${i + 1} — ${groupNames[i]}`}>
                  {i + 1}
                </span>
              );
            })}

            {/* Row numbers (periods 1-7) */}
            {Array.from({ length: 7 }, (_, i) => (
              <span key={`row-${i}`} className="grid-label row-label" style={{ gridColumn: 1, gridRow: i + 2 }} title={`Period ${i + 1}`}>
                {i + 1}
              </span>
            ))}

            <div
              className="lanthanide-card lanthanide"
              onClick={() => setSelectedGroup(
                selectedGroup.includes("lanthanide") && selectedGroup.length === 1
                  ? []
                  : ["lanthanide"]
              )}
              onMouseEnter={() => setHoveredGroup("lanthanide")}
              onMouseLeave={() => setHoveredGroup(null)}
            >
              <div>57-71</div>
            </div>

            <div
              className="actinide-card actinide"
              onClick={() => setSelectedGroup(
                selectedGroup.includes("actinide") && selectedGroup.length === 1
                  ? []
                  : ["actinide"]
              )}
              onMouseEnter={() => setHoveredGroup("actinide")}
              onMouseLeave={() => setHoveredGroup(null)}
            >
              <div>89-103</div>
            </div>

            {/* Footnote in spacer row */}
            <span className="grid-footnote" style={{ gridRow: 9, gridColumn: '5 / 20' }}>
              For elements with no stable isotopes, the mass number of the isotope with the longest half-life is in parentheses.
            </span>

            <div className="pnictogen-tag">Pnictogens</div>
            <div className="chalcogen-tag">Chalcogens</div>
            <div className="halogen-tag">Halogens</div>

            {data.elements.map((element) => (
              <Element
                key={element.number}
                element={element}
                handleElementClick={() => handleElementClick(element)}
                isGroupSelected={isGroupSelected}
                selectedElement={selectedElement}
                setHoveredElement={setHoveredElement}
                hoveredGroup={hoveredGroup}
                showPhase
                temperature={temperature}
              />
            ))}

          </div>
        </div>
      </div>

    </div>
    </>
  );
}
