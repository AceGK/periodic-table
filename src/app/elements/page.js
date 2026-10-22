"use client";

import data from "@/lib/Elements.json";
import { useState, useMemo } from "react";
import ElementDetails from "@/components/modules/ElementDetails";
import TemperatureSlider from "@/components/ui/TemperatureSlider";
import PhaseIcon from "@/components/ui/PhaseIcon";
import { SolidIcon, LiquidIcon, GasIcon, UnknownIcon } from "@/components/ui/PhaseIcon";
import { getCategoryColor, categoryVarMap, getPhaseKeyColor } from "@/lib/elementColors";
import PageHeader from "@/components/ui/PageHeader";
import { formatMass } from "@/lib/unitConversions";
import MultiSelect from "@/components/ui/MultiSelect";
import RefinementChips from "@/components/ui/RefinementChips";
import styles from "./styles.module.scss";

// Filter options
const categoryOptions = [...new Set(data.elements.map((el) => el.category))].sort().map((c) => ({ value: c, label: c, color: getCategoryColor(c) }));
const phaseOptions = [
  { value: "phase-solid", label: "Solid" },
  { value: "phase-liquid", label: "Liquid" },
  { value: "phase-gas", label: "Gas" },
  { value: "phase-unknown", label: "Unknown" },
];
const blockOptions = [...new Set(data.elements.map((el) => el.block))].sort().map((b) => ({ value: b, label: `${b}-block` }));

const sortOptions = [
  { value: 'number-asc', label: 'Atomic Number ↑' },
  { value: 'number-desc', label: 'Atomic Number ↓' },
  { value: 'name-asc', label: 'Name A–Z' },
  { value: 'name-desc', label: 'Name Z–A' },
  { value: 'mass-asc', label: 'Mass ↑' },
  { value: 'mass-desc', label: 'Mass ↓' },
  { value: 'electronegativity-asc', label: 'Electronegativity ↑' },
  { value: 'electronegativity-desc', label: 'Electronegativity ↓' },
];

function sortElements(elements, sortKey) {
  const [field, dir] = sortKey.split('-');
  const asc = dir === 'asc' ? 1 : -1;
  return [...elements].sort((a, b) => {
    let va, vb;
    switch (field) {
      case 'number': va = a.number; vb = b.number; break;
      case 'name': return asc * a.name.localeCompare(b.name);
      case 'mass': va = a.atomic_mass ?? 0; vb = b.atomic_mass ?? 0; break;
      case 'electronegativity':
        va = a.electronegativity_pauling ?? -1;
        vb = b.electronegativity_pauling ?? -1;
        break;
      default: va = a.number; vb = b.number;
    }
    return asc * (va - vb);
  });
}

function getPhaseKey(phase) {
  if (!phase) return 'phase-unknown';
  const lower = phase.toLowerCase();
  if (lower.includes('solid')) return 'phase-solid';
  if (lower.includes('liquid')) return 'phase-liquid';
  if (lower.includes('gas')) return 'phase-gas';
  return 'phase-' + lower.replace(/\s+/g, '-');
}

function getPhaseAtTemp(element, temperature) {
  if (temperature === null || temperature === undefined) return null;
  const { melt, boil, number } = element;
  if (melt === null && boil === null) return 'phase-unknown';
  if (melt !== null && temperature < melt) return 'phase-solid';
  if (boil !== null && temperature >= boil) return 'phase-gas';
  if (melt !== null && boil !== null) return 'phase-liquid';
  if (melt !== null) return 'phase-liquid';
  if (boil !== null) return number === 2 ? 'phase-liquid' : 'phase-solid';
  return 'phase-unknown';
}

export default function ElementsPage() {
  const [expandedNumber, setExpandedNumber] = useState(null);
  const [sort, setSort] = useState('number-asc');
  const [search, setSearch] = useState('');
  const [filterCategories, setFilterCategories] = useState([]);
  const [filterPhases, setFilterPhases] = useState([]);
  const [filterBlocks, setFilterBlocks] = useState([]);
  const [temperature, setTemperature] = useState(298);

  const toggle = (number) => {
    setExpandedNumber(expandedNumber === number ? null : number);
  };

  const filtered = useMemo(() => {
    let els = data.elements;

    if (search) {
      const q = search.toLowerCase();
      els = els.filter((el) =>
        el.name.toLowerCase().includes(q) ||
        el.symbol.toLowerCase().includes(q) ||
        String(el.number).includes(q)
      );
    }
    if (filterCategories.length > 0) {
      els = els.filter((el) => filterCategories.includes(el.category));
    }
    if (filterPhases.length > 0) {
      els = els.filter((el) => {
        const key = getPhaseAtTemp(el, temperature) || getPhaseKey(el.phase);
        return filterPhases.includes(key);
      });
    }
    if (filterBlocks.length > 0) {
      els = els.filter((el) => filterBlocks.includes(el.block));
    }

    return sortElements(els, sort);
  }, [search, filterCategories, filterPhases, filterBlocks, sort, temperature]);

  const hasFilters = search || filterCategories.length > 0 || filterPhases.length > 0 || filterBlocks.length > 0;

  const refinementItems = [
    ...filterCategories.map((v) => ({ key: `cat-${v}`, group: "Category", label: v, type: "category", value: v })),
    ...filterPhases.map((v) => ({ key: `phase-${v}`, group: "State", label: phaseOptions.find((o) => o.value === v)?.label || v, type: "phase", value: v })),
    ...filterBlocks.map((v) => ({ key: `block-${v}`, group: "Block", label: `${v}-block`, type: "block", value: v })),
  ];

  const removeRefinement = (item) => {
    if (item.type === "category") setFilterCategories((prev) => prev.filter((v) => v !== item.value));
    if (item.type === "phase") setFilterPhases((prev) => prev.filter((v) => v !== item.value));
    if (item.type === "block") setFilterBlocks((prev) => prev.filter((v) => v !== item.value));
  };

  const clearAllFilters = () => {
    setSearch('');
    setFilterCategories([]);
    setFilterPhases([]);
    setFilterBlocks([]);
  };

  const selectedElement = expandedNumber
    ? data.elements.find((el) => el.number === expandedNumber)
    : null;

  return (
    <main className="container" style={{ padding: '2rem 1rem' }}>
      <PageHeader title="All Elements" />

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />

        <MultiSelect label="Category" value={filterCategories} onChange={setFilterCategories} options={categoryOptions} />
        <MultiSelect label="State" value={filterPhases} onChange={setFilterPhases} options={phaseOptions} />
        <MultiSelect label="Block" value={filterBlocks} onChange={setFilterBlocks} options={blockOptions} />

        <select value={sort} onChange={(e) => setSort(e.target.value)} className={`${styles.filterSelect} ${styles.sortSelect}`}>
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <RefinementChips items={refinementItems} onRemove={removeRefinement} onClearAll={clearAllFilters} />

      {/* Legend */}
      <details className={styles.legendDetails}>
        <summary className={styles.legendSummary}>Legend</summary>
        <div className={styles.legendContent}>
          {/* Example row */}
          <div className={styles.legendRow}>
            <span className={styles.legendItem}>
              <span className={styles.legendValue} style={{ color: 'var(--clr-alkali-metal)' }}>1</span>
              <span className={styles.legendLabel}>Atomic #</span>
            </span>
            <span className={styles.legendItem}>
              <span className={styles.legendValue} style={{ color: 'var(--clr-phase-solid)' }}><SolidIcon size="1.25em" /></span>
              <span className={styles.legendLabel}>State</span>
            </span>
            <span className={styles.legendItem}>
              <span className={styles.legendValue} style={{ fontWeight: 700, fontSize: '1.25rem', color: '#dfdfdf' }}>H</span>
              <span className={styles.legendLabel}>Symbol</span>
            </span>
            <span className={styles.legendItem}>
              <span className={styles.legendValue}>Hydrogen</span>
              <span className={styles.legendLabel}>Name</span>
            </span>
            <span className={styles.legendItem}>
              <span className={styles.legendValue} style={{ color: 'var(--clr-text-secondary)' }}>1.008</span>
              <span className={styles.legendLabel}>Weight</span>
            </span>
            <span className={styles.legendItem}>
              <span className={styles.legendValue} style={{ color: 'var(--clr-text-muted)' }}>2 · 8 · 1</span>
              <span className={styles.legendLabel}>Shells</span>
            </span>
          </div>

          {/* Phase + Series keys */}
          <div className={styles.legendKeys}>
            <div className={styles.legendSection}>
              <span className={styles.legendSectionTitle}>Phase</span>
              <div className={styles.legendSwatches}>
                <span className={styles.legendSwatch} style={{ color: 'var(--clr-phase-solid)' }}><SolidIcon size="1em" /> Solid</span>
                <span className={styles.legendSwatch} style={{ color: 'var(--clr-phase-liquid)' }}><LiquidIcon size="1em" /> Liquid</span>
                <span className={styles.legendSwatch} style={{ color: 'var(--clr-phase-gas)' }}><GasIcon size="1em" /> Gas</span>
                <span className={styles.legendSwatch} style={{ color: 'var(--clr-phase-unknown)' }}><UnknownIcon size="1em" /> Unknown</span>
              </div>
            </div>

            <div className={styles.legendSection}>
              <span className={styles.legendSectionTitle}>Category</span>
              <div className={styles.legendSwatches}>
                {Object.entries(categoryVarMap)
                  .filter(([key]) => !key.startsWith('unknown,'))
                  .map(([name, cssVar]) => (
                    <span key={name} className={styles.legendSwatch} style={{ color: `var(${cssVar})` }}>
                      <span className={styles.legendBar} />
                      <span className={styles.legendSwatchLabel}>{name}</span>
                    </span>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </details>

      <div className={styles.temperatureRow}>
        <TemperatureSlider temperature={temperature} setTemperature={setTemperature} />
      </div>

      <div className={styles.count}>{filtered.length} element{filtered.length !== 1 ? 's' : ''}</div>

      <div className={styles.list}>
        {filtered.map((el) => {
          const phaseKey = getPhaseAtTemp(el, temperature) || getPhaseKey(el.phase);
          const phaseColor = getPhaseKeyColor(phaseKey);
          const catColor = getCategoryColor(el.category);
          const isOpen = expandedNumber === el.number;

          return (
            <div key={el.number} className={styles.item}>
              <button
                className={styles.row}
                onClick={() => toggle(el.number)}
                style={{ borderLeftColor: catColor }}
              >
                <span className={styles.number} style={{ color: catColor }}>{el.number}</span>
                <span className={styles.phase} style={{ color: phaseColor }}>
                  <PhaseIcon phaseKey={phaseKey} size="1.25em" />
                </span>
                <span className={styles.symbol}>{el.symbol}</span>
                <span className={styles.info}>
                  <span className={styles.name}>{el.name}</span>
                  <span className={styles.mass}>{formatMass(el.atomic_mass)}</span>
                </span>
                <span className={styles.shells}>{el.shells?.join(' · ')}</span>
                <svg
                  className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
                  width="16" height="16" viewBox="0 0 10 10"
                >
                  <path d="M2 3.5L5 6.5L8 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>

              <div className={`${styles.details} ${isOpen ? styles.detailsOpen : ''}`}>
                {isOpen && (
                  <ElementDetails
                    selectedElement={selectedElement}
                    hoveredElement={selectedElement}
                    temperature={temperature}
                    setTemperature={setTemperature}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
