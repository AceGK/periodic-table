"use client";

import data from "@/lib/Elements.json";
import { useState, useMemo } from "react";
import { IoIosCube } from "react-icons/io";
import { TbDropletFilled } from "react-icons/tb";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import ElementDetails from "@/components/modules/ElementDetails";
import TemperatureSlider from "@/components/ui/TemperatureSlider";
import styles from "./styles.module.scss";

// Unique categories from data
const categories = [...new Set(data.elements.map((el) => el.category))].sort();
const blocks = [...new Set(data.elements.map((el) => el.block))].sort();

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

const HeatIcon = ({ size = "1em" }) => (
  <svg width={size} height={size} viewBox="0 0 640 640" fill="currentColor">
    <path d="M272 96C289.7 96 304 110.3 304 128L304 208C304 242.6 315.2 276.3 336 304L355.2 329.6C384.3 368.4 400 415.5 400 464L400 512C400 529.7 385.7 544 368 544C350.3 544 336 529.7 336 512L336 464C336 429.4 324.8 395.7 304 368L284.8 342.4C255.7 303.6 240 256.5 240 208L240 128C240 110.3 254.3 96 272 96zM128 160C145.7 160 160 174.3 160 192L160 224C160 258.6 171.2 292.3 192 320L211.2 345.6C240.3 384.4 256 431.5 256 480L256 512C256 529.7 241.7 544 224 544C206.3 544 192 529.7 192 512L192 480C192 445.4 180.8 411.7 160 384L140.8 358.4C111.7 319.6 96 272.5 96 224L96 192C96 174.3 110.3 160 128 160zM448 192L448 224C448 258.6 459.2 292.3 480 320L499.2 345.6C528.3 384.4 544 431.5 544 480L544 512C544 529.7 529.7 544 512 544C494.3 544 480 529.7 480 512L480 480C480 445.4 468.8 411.7 448 384L428.8 358.4C399.7 319.6 384 272.5 384 224L384 192C384 174.3 398.3 160 416 160C433.7 160 448 174.3 448 192z" />
  </svg>
);

const phaseColors = {
  'phase-solid': '#e85d75',
  'phase-liquid': '#5EBBFF',
  'phase-gas': '#4AE3B5',
  'phase-unknown': 'var(--clr-text-secondary)',
};

const phaseIconMap = {
  'phase-solid': IoIosCube,
  'phase-liquid': TbDropletFilled,
  'phase-gas': HeatIcon,
  'phase-unknown': AiOutlineQuestionCircle,
};

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

const categoryVarMap = {
  'alkali metal': '--clr-alkali-metal',
  'alkaline earth metal': '--clr-alkaline-earth-metal',
  'transition metal': '--clr-transition-metal',
  'post-transition metal': '--clr-post-transition-metal',
  'lanthanide': '--clr-lanthanide',
  'actinide': '--clr-actinide',
  'diatomic nonmetal': '--clr-diatomic-nonmetal',
  'polyatomic nonmetal': '--clr-polyatomic-nonmetal',
  'noble gas': '--clr-noble-gas',
  'metalloid': '--clr-metalloid',
  'unknown, probably transition metal': '--clr-unknown',
  'unknown, probably post-transition metal': '--clr-unknown',
  'unknown, probably metalloid': '--clr-unknown',
  'unknown, predicted to be noble gas': '--clr-unknown',
  'unknown': '--clr-unknown',
};

function getCategoryColor(category) {
  const key = category?.toLowerCase() || 'unknown';
  const cssVar = categoryVarMap[key] || '--clr-unknown';
  return `var(${cssVar})`;
}

export default function ElementsPage() {
  const [expandedNumber, setExpandedNumber] = useState(null);
  const [sort, setSort] = useState('number-asc');
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterPhase, setFilterPhase] = useState('');
  const [filterBlock, setFilterBlock] = useState('');
  const [temperature, setTemperature] = useState(293);

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
    if (filterCategory) {
      els = els.filter((el) => el.category === filterCategory);
    }
    if (filterPhase) {
      els = els.filter((el) => {
        const key = getPhaseAtTemp(el, temperature) || getPhaseKey(el.phase);
        return key === filterPhase;
      });
    }
    if (filterBlock) {
      els = els.filter((el) => el.block === filterBlock);
    }

    return sortElements(els, sort);
  }, [search, filterCategory, filterPhase, filterBlock, sort, temperature]);

  const selectedElement = expandedNumber
    ? data.elements.find((el) => el.number === expandedNumber)
    : null;

  const hasFilters = search || filterCategory || filterPhase || filterBlock;

  return (
    <main className="container" style={{ padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>All Elements</h1>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />

        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className={styles.filterSelect}>
          <option value="">All Series</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select value={filterPhase} onChange={(e) => setFilterPhase(e.target.value)} className={styles.filterSelect}>
          <option value="">All States</option>
          <option value="phase-solid">Solid</option>
          <option value="phase-liquid">Liquid</option>
          <option value="phase-gas">Gas</option>
          <option value="phase-unknown">Unknown</option>
        </select>

        <select value={filterBlock} onChange={(e) => setFilterBlock(e.target.value)} className={styles.filterSelect}>
          <option value="">All Blocks</option>
          {blocks.map((b) => (
            <option key={b} value={b}>{b}-block</option>
          ))}
        </select>

        <select value={sort} onChange={(e) => setSort(e.target.value)} className={styles.filterSelect}>
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {hasFilters && (
          <button
            className={styles.clearBtn}
            onClick={() => { setSearch(''); setFilterCategory(''); setFilterPhase(''); setFilterBlock(''); }}
          >
            Clear
          </button>
        )}
      </div>

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
              <span className={styles.legendValue} style={{ color: '#e85d75' }}><IoIosCube size="1.25em" /></span>
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
                <span className={styles.legendSwatch} style={{ color: '#e85d75' }}><IoIosCube size="1em" /> Solid</span>
                <span className={styles.legendSwatch} style={{ color: '#5EBBFF' }}><TbDropletFilled size="1em" /> Liquid</span>
                <span className={styles.legendSwatch} style={{ color: '#4AE3B5' }}><HeatIcon size="1em" /> Gas</span>
                <span className={styles.legendSwatch} style={{ color: 'var(--clr-text-secondary)' }}><AiOutlineQuestionCircle size="1em" /> Unknown</span>
              </div>
            </div>

            <div className={styles.legendSection}>
              <span className={styles.legendSectionTitle}>Series</span>
              <div className={styles.legendSwatches}>
                {Object.entries(categoryVarMap)
                  .filter(([key]) => !key.startsWith('unknown,'))
                  .map(([name, cssVar]) => (
                    <span key={name} className={styles.legendSwatch}>
                      <span className={styles.legendDot} style={{ background: `var(${cssVar})` }} />
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
          const PhaseIconComp = phaseIconMap[phaseKey] || phaseIconMap['phase-unknown'];
          const phaseColor = phaseColors[phaseKey] || phaseColors['phase-unknown'];
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
                  <PhaseIconComp size="1.25em" />
                </span>
                <span className={styles.symbol}>{el.symbol}</span>
                <span className={styles.info}>
                  <span className={styles.name}>{el.name}</span>
                  <span className={styles.mass}>{el.atomic_mass}</span>
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
