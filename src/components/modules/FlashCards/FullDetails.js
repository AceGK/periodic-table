"use client";

import { useState } from "react";
import { getCategoryColor, getPhaseColor } from "@/lib/elementColors";
import { d, formatTemp, formatEnergy, formatDensity, tempOptions, energyOptions, densityOptions } from "@/lib/unitConversions";
import PhaseIcon from "@/components/ui/PhaseIcon";
import Select from "@/components/ui/Select";
import styles from "./styles.module.scss";

export default function FullDetails({ element: el }) {
  const [tempUnit, setTempUnit] = useState("K");
  const [energyUnit, setEnergyUnit] = useState("kJ/mol");
  const [densityUnit, setDensityUnit] = useState("g/cm³");

  return (
    <div className={styles.fullDetailsWrap}>
      <div className={styles.detailsGrid}>
        {/* Identity */}
        <div className={styles.detailRow}><span>Name</span><span>{el.name}</span></div>
        <div className={styles.detailRow}><span>Symbol</span><span>{el.symbol}</span></div>
        <div className={styles.detailRow}><span>Category</span><span style={{ color: getCategoryColor(el.category), textTransform: "capitalize" }}>{el.category}</span></div>
        <div className={styles.detailRow}><span>Phase</span><span style={{ color: getPhaseColor(el.phase), display: "flex", alignItems: "center", gap: "0.375rem" }}><PhaseIcon phase={el.phase} /> {el.phase}</span></div>
        <div className={styles.detailRow}><span>Block</span><span>{el.block}</span></div>
        <div className={styles.detailRow}><span>Weight</span><span>{el.atomic_mass} u</span></div>
        <div className={styles.detailRow}><span>Config</span><span className={styles.detailConfig}>{el.electron_configuration_semantic}</span></div>
        <div className={styles.detailRow}><span>Energy Levels</span><span>{el.shells?.join(", ")}</span></div>
        {/* Reactivity */}
        <div className={styles.detailRow}><span>Electronegativity</span><span>{d(el.electronegativity_pauling)}</span></div>
        <div className={styles.detailRow}>
          <span>Ionization</span>
          <span className={styles.detailWithUnit}>
            {formatEnergy(el.ionization_energies?.[0], energyUnit)}
            <Select className={styles.unitSelect} value={energyUnit} onChange={setEnergyUnit} options={energyOptions} onClick={(e) => e.stopPropagation()} />
          </span>
        </div>
        <div className={styles.detailRow}>
          <span>Electron Affinity</span>
          <span className={styles.detailWithUnit}>
            {formatEnergy(el.electron_affinity, energyUnit)}
            <Select className={styles.unitSelect} value={energyUnit} onChange={setEnergyUnit} options={energyOptions} onClick={(e) => e.stopPropagation()} />
          </span>
        </div>
        {/* Physical */}
        <div className={styles.detailRow}>
          <span>Melting Point</span>
          <span className={styles.detailWithUnit}>
            {formatTemp(el.melt, tempUnit)}
            <Select className={styles.unitSelect} value={tempUnit} onChange={setTempUnit} options={tempOptions} onClick={(e) => e.stopPropagation()} />
          </span>
        </div>
        <div className={styles.detailRow}>
          <span>Boiling Point</span>
          <span className={styles.detailWithUnit}>
            {formatTemp(el.boil, tempUnit)}
            <Select className={styles.unitSelect} value={tempUnit} onChange={setTempUnit} options={tempOptions} onClick={(e) => e.stopPropagation()} />
          </span>
        </div>
        <div className={styles.detailRow}>
          <span>Density</span>
          <span className={styles.detailWithUnit}>
            {formatDensity(el.density, densityUnit)}
            <Select className={styles.unitSelect} value={densityUnit} onChange={setDensityUnit} options={densityOptions} onClick={(e) => e.stopPropagation()} />
          </span>
        </div>
        <div className={styles.detailRow}><span>Crystal Structure</span><span>{d(el.crystal_structure)}</span></div>
        <div className={styles.detailRow}><span>Magnetic Order</span><span>{d(el.magnetic_ordering)}</span></div>
        {/* History */}
        <div className={styles.detailRow}><span>Discovered</span><span>{d(el.year_discovered)}</span></div>
      </div>
    </div>
  );
}
