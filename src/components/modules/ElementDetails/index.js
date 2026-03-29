import Element from "@/components/ui/ElementCard";
import styles from "@/components/ui/ElementCard/styles.module.scss";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { Modal } from "@/components/ui/Modal";
import WikiModal from "@/components/modules/WikiModal";
import dynamic from "next/dynamic";
import { useState } from "react";
import Image from "next/image";

const GLBViewerWithNoSSR = dynamic(() => import("@/components/ui/GlbViewer"), {
  ssr: false,
});

export default function ElementDetails({ selectedElement, hoveredElement, compact, temperature, setTemperature }) {

  // Determine which element to use: selectedElement or hoveredElement
  const elementToShow = selectedElement || hoveredElement;

  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [bohrModalOpen, setBohrModalOpen] = useState(false);

  // Proceed only if there is an element to show
  if (!elementToShow) return null;


  return (

    <div className={`${styles.elementDetails} ${compact ? styles.compact : ''}`}>
      <Element element={elementToShow} showShells temperature={temperature} />

      <Tabs defaultValue="properties">
        <TabsList>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="summary">Description</TabsTrigger>
          <TabsTrigger value="electrons">Electrons</TabsTrigger>
          <TabsTrigger value="isotopes">Isotopes</TabsTrigger>
          <TabsTrigger value="compounds">Compounds</TabsTrigger>
        </TabsList>

        <TabsContent value="properties">
          <div className={styles.details}>
            <Details element={elementToShow} temperature={temperature} setTemperature={setTemperature} />
          </div>
        </TabsContent>

        <TabsContent value="summary">
          <div className={styles.details} style={{ height: '100%' }}>
            <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '100%' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--clr-text-secondary)', marginBottom: '0.5rem', flexShrink: 0 }}>
                {elementToShow.discovered_by && `Discovered by ${elementToShow.discovered_by}`}
                {elementToShow.discovered_by && elementToShow.year_discovered && ` (${elementToShow.year_discovered})`}
                {!elementToShow.discovered_by && elementToShow.year_discovered && `Discovered ${elementToShow.year_discovered}`}
                {(elementToShow.discovered_by || elementToShow.year_discovered) && elementToShow.named_by && ' · '}
                {elementToShow.named_by && `Named by ${elementToShow.named_by}`}
              </p>
              <p style={{ fontSize: '0.875rem', lineHeight: '1.5', flex: 1, minHeight: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 7, WebkitBoxOrient: 'vertical' }}>
                {elementToShow.summary || "No summary available."}
              </p>
              <p style={{ marginTop: '0.5rem', flexShrink: 0 }}>
                <WikiModal title={elementToShow.name} displayText={`${elementToShow.name}`}>
                  <span style={{ fontSize: '0.8125rem' }}>Read full description</span>
                </WikiModal>
              </p>
            </div>

            {elementToShow.image?.url && (
              <div style={{ position: 'relative', minWidth: '200px', flex: '0 0 auto', height: '100%' }}>
                <Image
                  src={elementToShow.image.url}
                  alt={elementToShow.name}
                  layout="fill"
                  objectFit="cover"
                  style={{ borderRadius: 'var(--border-radius)' }}
                />
                <button
                  className={styles.expandBtn}
                  onClick={() => setImageModalOpen(true)}
                  aria-label="Expand image"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 3 21 3 21 9" />
                    <polyline points="9 21 3 21 3 15" />
                    <line x1="21" y1="3" x2="14" y2="10" />
                    <line x1="3" y1="21" x2="10" y2="14" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Image gallery modal */}
          <Modal
            open={imageModalOpen}
            onClose={() => setImageModalOpen(false)}
            title={`${elementToShow.name}${elementToShow.image?.attribution ? ` — ${elementToShow.image.attribution}` : ''}`}
            bodyClassName={styles.galleryBody}
          >
            {elementToShow.image?.url && (
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <Image
                  src={elementToShow.image.url}
                  alt={elementToShow.name}
                  layout="fill"
                  objectFit="contain"
                  style={{ borderRadius: 'var(--border-radius)' }}
                />
              </div>
            )}
          </Modal>
        </TabsContent>

        <TabsContent value="electrons">
          <div className={styles.details}>
            <div>
              <ul data-type="element-data">
                <li>
                  <label>Configuration</label>
                  <output>{elementToShow.electron_configuration_semantic}</output>
                </li>
                <li>
                  <label>Shells</label>
                  <output>{elementToShow.shells?.join(', ')}</output>
                </li>
                <li>
                  <label>Block</label>
                  <output>{elementToShow.block}</output>
                </li>
                <li>
                  <label>Electronegativity</label>
                  <output>{elementToShow.electronegativity_pauling ?? 'n/a'}</output>
                </li>
                <li>
                  <label>Electron Affinity</label>
                  <output>{elementToShow.electron_affinity ? `${elementToShow.electron_affinity} kJ/mol` : 'n/a'}</output>
                </li>
                <li>
                  <label>Oxidation States</label>
                  <output>{elementToShow.oxidation_states || 'n/a'}</output>
                </li>
              </ul>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{ width: "100%", height: "100%", maxHeight: "220px", position: 'relative' }}>
                {elementToShow.bohr_model_3d && (
                  <GLBViewerWithNoSSR path={elementToShow.bohr_model_3d} />
                )}
              </div>
              {elementToShow.bohr_model_3d && (
                <button
                  className={styles.expandBtn}
                  onClick={() => setBohrModalOpen(true)}
                  aria-label="Expand Bohr model"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 3 21 3 21 9" />
                    <polyline points="9 21 3 21 3 15" />
                    <line x1="21" y1="3" x2="14" y2="10" />
                    <line x1="3" y1="21" x2="10" y2="14" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Bohr model gallery modal */}
          <Modal
            open={bohrModalOpen}
            onClose={() => setBohrModalOpen(false)}
            title={`${elementToShow.name} — Bohr Model`}
            bodyClassName={styles.galleryBody}
          >
            {bohrModalOpen && elementToShow.bohr_model_3d && (
              <div style={{ width: '100%', height: '100%' }}>
                <GLBViewerWithNoSSR path={elementToShow.bohr_model_3d} />
              </div>
            )}
          </Modal>
        </TabsContent>

        <TabsContent value="isotopes">
          <div className={styles.details}>
            <div>
              <p style={{ padding: '0.75rem', fontSize: '0.825rem', color: 'var(--clr-text-muted)' }}>
                Isotope data coming soon.
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="compounds">
          <div className={styles.details}>
            <div>
              <p style={{ padding: '0.75rem', fontSize: '0.825rem', color: 'var(--clr-text-muted)' }}>
                Compound data coming soon.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>

  );
}


function Details({ element, temperature, setTemperature }) {

  // State to keep track of the selected ionization energy index
  const [selectedIonizationIndex, setSelectedIonizationIndex] = useState(0);
  const [tempUnit, setTempUnit] = useState('K');
  const [energyUnit, setEnergyUnit] = useState('kJ/mol');
  const [densityUnit, setDensityUnit] = useState('g/cm³');

  const formatDensity = (val) => {
    if (val === null || val === undefined) return 'n/a';
    if (densityUnit === 'kg/m³') return `${Math.round(val * 1000 * 100) / 100}`;
    return `${val}`;
  };

  const DensityUnitSelect = () => (
    <select value={densityUnit} onChange={(e) => setDensityUnit(e.target.value)}>
      <option value="g/cm³">g/cm³</option>
      <option value="kg/m³">kg/m³</option>
    </select>
  );

  const formatEnergy = (val) => {
    if (val === null || val === undefined) return 'n/a';
    if (energyUnit === 'eV') return `${Math.round((val / 96.485) * 1000) / 1000}`;
    return `${val}`;
  };

  const EnergyUnitSelect = () => (
    <select value={energyUnit} onChange={(e) => setEnergyUnit(e.target.value)}>
      <option value="kJ/mol">kJ/mol</option>
      <option value="eV">eV</option>
    </select>
  );

  const formatKelvin = (k) => {
    if (k === null || k === undefined) return 'n/a';
    if (tempUnit === 'C') return Math.round((k - 273.15) * 100) / 100;
    if (tempUnit === 'F') return Math.round(((k - 273.15) * 9 / 5 + 32) * 100) / 100;
    return k;
  };

  const TempUnitSelect = () => (
    <select value={tempUnit} onChange={(e) => setTempUnit(e.target.value)}>
      <option value="K">K</option>
      <option value="C">°C</option>
      <option value="F">°F</option>
    </select>
  );

  const getPhaseAtTemp = () => {
    if (temperature === null || temperature === undefined) return element.phase;
    const { melt, boil, number } = element;
    if (melt === null && boil === null) return 'Unknown';
    if (melt !== null && temperature < melt) return 'Solid';
    if (boil !== null && temperature >= boil) return 'Gas';
    if (melt !== null && boil !== null) return 'Liquid';
    if (melt !== null) return 'Liquid';
    // Only boil known: helium stays liquid, all others sublime (solid below boiling)
    if (boil !== null) return number === 2 ? 'Liquid' : 'Solid';
    return 'Unknown';
  };

  const handleTempInput = (e) => {
    let val = Number(e.target.value);
    if (isNaN(val)) return;
    if (tempUnit === 'C') val = val + 273.15;
    if (tempUnit === 'F') val = (val - 32) * 5 / 9 + 273.15;
    setTemperature(Math.round(Math.max(0, Math.min(6500, val))));
  };

  const displayTemp = () => {
    if (temperature === null || temperature === undefined) return '';
    if (tempUnit === 'C') return Math.round(temperature - 273.15);
    if (tempUnit === 'F') return Math.round((temperature - 273.15) * 9 / 5 + 32);
    return temperature;
  };

  const crystalWikiMap = {
    'BCC': 'Body-centered_cubic',
    'FCC': 'Face-centered_cubic',
    'HEX': 'Hexagonal_crystal_family',
    'Diamond Cubic': 'Diamond_cubic',
    'Simple Cubic': 'Cubic_crystal_system',
    'Orthorhombic': 'Orthorhombic_crystal_system',
    'Tetragonal': 'Tetragonal_crystal_system',
    'Monoclinic': 'Monoclinic_crystal_system',
    'Rhombohedral': 'Rhombohedral_crystal_system',
  };

  // Function to generate ordinal labels (1st, 2nd, 3rd, etc.)
  const getOrdinalLabel = (n) => {
    const s = ["th", "st", "nd", "rd"],
      v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  return (
    <>
      {/* Column 1 — What is this element? */}
      <div>
        <ul data-type="element-data">
          <li>
            <label>Element</label>
            <output>
              <WikiModal title={element.name} displayText={`${element.name}`}>
                {element.name}
              </WikiModal>
            </output>
          </li>
          <li>
            <label>Category</label>
            <output>
              <WikiModal title={element.category.replace(/ /g, '_')} displayText={element.category}>
                <span className="capitalize">{element.category}</span>
              </WikiModal>
              {element.possible_category && ` (${element.possible_category})`}
            </output>
          </li>
          <li>
            <label style={{ display: "flex" }}>
              State at
              <input
                type="number"
                value={displayTemp()}
                onChange={handleTempInput}
                style={{ width: '4rem', marginLeft: '4px', marginRight: '2px', padding: '0 4px', background: 'var(--clr-bg-secondary)', border: '1px solid var(--clr-border)', borderRadius: '4px', color: 'var(--clr-text-primary)', fontSize: '0.75rem' }}
              />
              <TempUnitSelect />
            </label>
            <output>
              <WikiModal title={getPhaseAtTemp()} displayText={`${getPhaseAtTemp()} — State of Matter`}>
                {getPhaseAtTemp()}
              </WikiModal>
            </output>
          </li>
          <li>
            <label>Weight</label>
            <output>{element.atomic_mass} u</output>
          </li>
          <li>
            <label>Energy Levels</label>
            <output>{element.shells.join(', ')}</output>
          </li>
          <li>
            <label>Electronegativity</label>
            <output>{element.electronegativity_pauling ?? 'n/a'}</output>
          </li>
          <li>
            <label>Crystal Structure</label>
            <output>
              {element.crystal_structure ? (
                <WikiModal title={crystalWikiMap[element.crystal_structure] || 'Crystal_structure'} displayText={`${element.crystal_structure} — Crystal Structure`}>
                  {element.crystal_structure}
                </WikiModal>
              ) : 'n/a'}
            </output>
          </li>
        </ul>
      </div>

      {/* Column 2 — Atomic-level behavior */}
      <div>
        <ul data-type="element-data">
          <li>
            <label>Melting Point</label>
            <output style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>{formatKelvin(element.melt)} <TempUnitSelect /></output>
          </li>
          <li>
            <label>Boiling Point</label>
            <output style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>{formatKelvin(element.boil)} <TempUnitSelect /></output>
          </li>
          <li>
            <label>Electron Affinity</label>
            <output style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              {formatEnergy(element.electron_affinity)} <EnergyUnitSelect />
            </output>
          </li>
          <li>
            <label style={{ display: "flex" }}>
              Ionization
              <select
                value={selectedIonizationIndex}
                onChange={(e) => setSelectedIonizationIndex(e.target.value)}
              >
                {element.ionization_energies.map((_, index) => (
                  <option key={index} value={index}>
                    {getOrdinalLabel(index + 1)}
                  </option>
                ))}
              </select>
            </label>
            <output style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              {formatEnergy(element.ionization_energies[selectedIonizationIndex])} <EnergyUnitSelect />
            </output>
          </li>
          <Radius element={element} />
          <Hardness element={element} />
        </ul>
      </div>

      {/* Column 3 — Bulk/practical properties */}
      <div>
        <ul data-type="element-data">
          <Modulus element={element} />
          <li>
            <label>Density</label>
            <output style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              {formatDensity(element.density)} <DensityUnitSelect />
            </output>
          </li>
          <Conductivity element={element} />
          <Heat element={element} />
          <li>
            <label>Magnetic Order</label>
            <output>
              {element.magnetic_ordering ? (
                <WikiModal title={element.magnetic_ordering.replace(/ /g, '_')} displayText={`${element.magnetic_ordering} — Magnetic Ordering`}>
                  {element.magnetic_ordering}
                </WikiModal>
              ) : 'n/a'}
            </output>
          </li>
          <Abundance element={element} />
          <li>
            <label>Discovered</label>
            <output>{element.year_discovered || 'n/a'}</output>
          </li>
        </ul>
      </div>
    </>
  )


}


function Radius({ element }) {
  const [selectedRadiusIndex, setSelectedRadiusIndex] = useState("calculated");

  if (!element.radius) {
    return null;
  }

  return (
    <li>
      <label style={{ display: "flex" }}>
        Radius
        <select
          value={selectedRadiusIndex}
          onChange={(e) => setSelectedRadiusIndex(e.target.value)}
        >
          <option value="calculated">Atomic</option>
          <option value="covalent-single-bond">Covalent Single Bond</option>
          <option value="covalent-triple-bond">Covalent Triple Bond</option>
          <option value="van-der-waals">Van der Waals</option>
          <option value="metallic">Metallic</option>
        </select>
      </label>
      <output>
        {element.radius[selectedRadiusIndex] ? element.radius[selectedRadiusIndex] : "n/a"}
      </output>
    </li>
  );
}

function Hardness({ element }) {
  const [selectedHardness, setSelectedHardness] = useState("brinell");

  if (!element.hardness) {
    return null;
  }

  return (
    <li>
      <label style={{ display: "flex" }}>
        Hardness
        <select
          value={selectedHardness}
          onChange={(e) => setSelectedHardness(e.target.value)}
        >
          <option value="brinell">Brinell</option>
          <option value="mohs">Mohs</option>
          <option value="vickers">Vickers</option>
        </select>
      </label>
      <output>
        {element.hardness[selectedHardness] ? element.hardness[selectedHardness] : "n/a"}
      </output>
    </li>
  );
}

function Modulus({ element }) {
  const [selected, setSelected] = useState("bulk");

  if (!element.modulus) return null;

  return (
    <li>
      <label style={{ display: "flex" }}>
        Modulus
        <select value={selected} onChange={(e) => setSelected(e.target.value)}>
          <option value="bulk">Bulk</option>
          <option value="shear">Shear</option>
          <option value="young">Young</option>
        </select>
      </label>
      <output>
        {element.modulus[selected] ? element.modulus[selected] : "n/a"}
      </output>
    </li>
  );
}

function Conductivity({ element }) {
  const [selected, setSelected] = useState("thermal");

  if (!element.conductivity) return null;

  return (
    <li>
      <label style={{ display: "flex" }}>
        Conductivity
        <select value={selected} onChange={(e) => setSelected(e.target.value)}>
          <option value="thermal">Thermal</option>
          <option value="electrical">Electrical</option>
        </select>
      </label>
      <output>
        {element.conductivity[selected] ? element.conductivity[selected] : "n/a"}
      </output>
    </li>
  );
}

function Heat({ element }) {
  const [selected, setSelected] = useState("specific");

  if (!element.heat) return null;

  return (
    <li>
      <label style={{ display: "flex" }}>
        Heat
        <select value={selected} onChange={(e) => setSelected(e.target.value)}>
          <option value="specific">Specific</option>
          <option value="vaporization">Vaporization</option>
          <option value="fusion">Fusion</option>
        </select>
      </label>
      <output>
        {element.heat[selected] ? element.heat[selected] : "n/a"}
      </output>
    </li>
  );
}

function Abundance({ element }) {
  const [selected, setSelected] = useState("universe");

  if (!element.abundance) return null;

  return (
    <li>
      <label style={{ display: "flex" }}>
        Abundance
        <select value={selected} onChange={(e) => setSelected(e.target.value)}>
          <option value="universe">Universe</option>
          <option value="sun">Sun</option>
          <option value="meteor">Meteorite</option>
          <option value="crust">Earth&apos;s Crust</option>
          <option value="ocean">Ocean</option>
          <option value="human">Human Body</option>
        </select>
      </label>
      <output>
        {element.abundance[selected] ? element.abundance[selected] : "n/a"}
      </output>
    </li>
  );
}
