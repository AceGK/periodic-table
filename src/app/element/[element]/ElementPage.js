"use client";

import { useState } from "react";
import data from "@/lib/Elements.json";
import Link from "next/link";
import Element from "@/components/ui/ElementCard";
import elementCardStyles from "@/components/ui/ElementCard/styles.module.scss";
import { Modal } from "@/components/ui/Modal";
import WikiModal from "@/components/modules/WikiModal";
import PhaseIcon from "@/components/ui/PhaseIcon";
import Section from "@/components/ui/Section";
import { DataList, DataItem } from "@/components/ui/DataList";
import { getCategoryColor, getPhaseColor } from "@/lib/elementColors";
import Image from "next/image";
import dynamic from "next/dynamic";
import styles from "./styles.module.scss";

const GLBViewer = dynamic(() => import("@/components/ui/GlbViewer"), { ssr: false });

const ExpandIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 3 21 3 21 9" />
    <polyline points="9 21 3 21 3 15" />
    <line x1="21" y1="3" x2="14" y2="10" />
    <line x1="3" y1="21" x2="10" y2="14" />
  </svg>
);

const d = (v) => (v !== null && v !== undefined ? v : "n/a");
const fmtK = (k) => (k != null ? `${k} K` : "n/a");

export default function ElementPage({ element: el }) {
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const catColor = getCategoryColor(el.category);
  const phaseColor = getPhaseColor(el.phase);

  const prevEl = data.elements.find((e) => e.number === el.number - 1);
  const nextEl = data.elements.find((e) => e.number === el.number + 1);

  return (
    <main className="container" style={{ padding: "2rem 1rem 4rem" }}>
      {/* ─── Hero ──────────────────────────────────────────── */}
      <div className={styles.hero}>
        <div className={`${styles.heroCard} ${elementCardStyles.elementDetails}`}>
          <Element element={el} showShells />
        </div>
        <div className={styles.heroInfo}>
          <span className={styles.heroNumber} style={{ color: catColor }}>#{el.number}</span>
          <h1 className={styles.heroName}>{el.name}</h1>
          <div className={styles.heroMeta}>
            <span style={{ color: catColor, textTransform: "capitalize" }}>{el.category}</span>
            <span>·</span>
            <span style={{ color: phaseColor, display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
              <PhaseIcon phase={el.phase} size="0.9em" /> {el.phase}
            </span>
            <span>·</span>
            <span>{el.atomic_mass} u</span>
          </div>
          {el.summary && (
            <p className={styles.heroSummary}>{el.summary}</p>
          )}
          <div className={styles.heroLinks}>
            <WikiModal title={el.name} displayText={el.name}>
              Read on Wikipedia
            </WikiModal>
          </div>
        </div>
      </div>

      {/* ─── Content grid ──────────────────────────────────── */}
      <div className={styles.grid}>

        {/* Identity */}
        <Section title="Identity">
          <DataList>
            <DataItem label="Symbol" value={el.symbol} />
            <DataItem label="Atomic Number" value={el.number} />
            <DataItem label="Atomic Mass" value={`${el.atomic_mass} u`} />
            <DataItem label="Category" color={catColor}>
              <WikiModal title={el.category.replace(/ /g, "_")} displayText={el.category}>
                <span style={{ textTransform: "capitalize" }}>{el.category}</span>
              </WikiModal>
            </DataItem>
            <DataItem label="Block" value={`${el.block}-block`} />
            <DataItem label="Period" value={el.period} />
            <DataItem label="Group" value={el.group || "n/a"} />
            {el.appearance && <DataItem label="Appearance" value={el.appearance} />}
            <DataItem label="Year Discovered" value={d(el.year_discovered)} />
            {el.discovered_by && <DataItem label="Discovered By" value={el.discovered_by} />}
            {el.named_by && <DataItem label="Named By" value={el.named_by} />}
          </DataList>
        </Section>

        {/* Electron Properties */}
        <Section title="Electrons">
          {el.bohr_model_3d && (
            <div className={styles.sectionModel}>
              <GLBViewer path={el.bohr_model_3d} />
              <button
                className={elementCardStyles.expandBtn}
                onClick={() => setBohrModalOpen(true)}
                aria-label="Expand Bohr model"
              >
                <ExpandIcon />
              </button>
            </div>
          )}
          <DataList>
            <DataItem label="Configuration" value={el.electron_configuration_semantic} />
            <DataItem label="Full Configuration" value={el.electron_configuration} />
            <DataItem label="Shells" value={el.shells?.join(", ")} />
            <DataItem label="Electronegativity" value={d(el.electronegativity_pauling)} />
            <DataItem label="Electron Affinity" value={el.electron_affinity != null ? `${el.electron_affinity} kJ/mol` : "n/a"} />
            <DataItem label="Oxidation States" value={el.oxidation_states || "n/a"} />
            {el.ionization_energies?.length > 0 && (
              <DataItem label="Ionization Energies">
                <span style={{ fontSize: "0.8125rem" }}>
                  {el.ionization_energies.slice(0, 5).map((e, i) => (
                    <span key={i}>{i > 0 && ", "}{e}</span>
                  ))}
                  {el.ionization_energies.length > 5 && ` … +${el.ionization_energies.length - 5} more`}
                  <span style={{ color: "var(--clr-text-muted)" }}> kJ/mol</span>
                </span>
              </DataItem>
            )}
          </DataList>
        </Section>

        {/* Physical Properties */}
        <Section title="Physical Properties">
          {el.image?.url && (
            <div className={styles.sectionImage}>
              <Image
                src={el.image.url}
                alt={el.name}
                fill
                style={{ objectFit: "cover", borderRadius: "var(--border-radius)" }}
              />
              <button
                className={elementCardStyles.expandBtn}
                onClick={() => setImageModalOpen(true)}
                aria-label="Expand image"
              >
                <ExpandIcon />
              </button>
            </div>
          )}
          <DataList>
            <DataItem label="Phase" color={phaseColor}>
              <span style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                <PhaseIcon phase={el.phase} size="1em" /> {el.phase}
              </span>
            </DataItem>
            <DataItem label="Melting Point" value={fmtK(el.melt)} />
            <DataItem label="Boiling Point" value={fmtK(el.boil)} />
            <DataItem label="Density" value={el.density != null ? `${el.density} g/cm³` : "n/a"} />
            {el.molar_heat && <DataItem label="Molar Heat" value={`${el.molar_heat} J/(mol·K)`} />}
            <DataItem label="Crystal Structure">
              {el.crystal_structure ? (
                <WikiModal title={el.crystal_structure.replace(/ /g, "_")} displayText={el.crystal_structure}>
                  {el.crystal_structure}
                </WikiModal>
              ) : "n/a"}
            </DataItem>
            <DataItem label="Magnetic Ordering">
              {el.magnetic_ordering ? (
                <WikiModal title={el.magnetic_ordering.replace(/ /g, "_")} displayText={el.magnetic_ordering}>
                  {el.magnetic_ordering}
                </WikiModal>
              ) : "n/a"}
            </DataItem>
          </DataList>
        </Section>

        {/* Mechanical */}
        {(el.radius || el.hardness || el.modulus) && (
          <Section title="Mechanical">
            <DataList>
              {el.radius && (
                <>
                  {el.radius.calculated && <DataItem label="Atomic Radius" value={`${el.radius.calculated} pm`} />}
                  {el.radius["covalent-single-bond"] && <DataItem label="Covalent Radius" value={`${el.radius["covalent-single-bond"]} pm`} />}
                  {el.radius["van-der-waals"] && <DataItem label="Van der Waals" value={`${el.radius["van-der-waals"]} pm`} />}
                  {el.radius.metallic && <DataItem label="Metallic Radius" value={`${el.radius.metallic} pm`} />}
                </>
              )}
              {el.hardness && (
                <>
                  {el.hardness.mohs && <DataItem label="Mohs Hardness" value={el.hardness.mohs} />}
                  {el.hardness.brinell && <DataItem label="Brinell Hardness" value={`${el.hardness.brinell} MPa`} />}
                  {el.hardness.vickers && <DataItem label="Vickers Hardness" value={`${el.hardness.vickers} MPa`} />}
                </>
              )}
              {el.modulus && (
                <>
                  {el.modulus.bulk && <DataItem label="Bulk Modulus" value={`${el.modulus.bulk} GPa`} />}
                  {el.modulus.shear && <DataItem label="Shear Modulus" value={`${el.modulus.shear} GPa`} />}
                  {el.modulus.young && <DataItem label="Young's Modulus" value={`${el.modulus.young} GPa`} />}
                </>
              )}
            </DataList>
          </Section>
        )}

        {/* Thermal & Electrical */}
        {(el.conductivity || el.heat) && (
          <Section title="Thermal & Electrical">
            <DataList>
              {el.conductivity?.thermal && <DataItem label="Thermal Conductivity" value={`${el.conductivity.thermal} W/(m·K)`} />}
              {el.conductivity?.electrical && <DataItem label="Electrical Conductivity" value={`${el.conductivity.electrical} S/m`} />}
              {el.heat?.specific && <DataItem label="Specific Heat" value={`${el.heat.specific} J/(g·K)`} />}
              {el.heat?.vaporization && <DataItem label="Heat of Vaporization" value={`${el.heat.vaporization} kJ/mol`} />}
              {el.heat?.fusion && <DataItem label="Heat of Fusion" value={`${el.heat.fusion} kJ/mol`} />}
            </DataList>
          </Section>
        )}

        {/* Abundance */}
        {el.abundance && (
          <Section title="Abundance">
            <DataList>
              {el.abundance.universe && <DataItem label="Universe" value={el.abundance.universe} />}
              {el.abundance.sun && <DataItem label="Sun" value={el.abundance.sun} />}
              {el.abundance.meteor && <DataItem label="Meteorite" value={el.abundance.meteor} />}
              {el.abundance.crust && <DataItem label="Earth's Crust" value={el.abundance.crust} />}
              {el.abundance.ocean && <DataItem label="Ocean" value={el.abundance.ocean} />}
              {el.abundance.human && <DataItem label="Human Body" value={el.abundance.human} />}
            </DataList>
          </Section>
        )}
      </div>

      {/* ─── Media row ─────────────────────────────────────── */}
      {/* Image modal */}
      <Modal
        open={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        title={`${el.name}${el.image?.attribution ? ` — ${el.image.attribution}` : ""}`}
        bodyClassName={elementCardStyles.galleryBody}
      >
        {el.image?.url && (
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <Image
              src={el.image.url}
              alt={el.name}
              fill
              style={{ objectFit: "contain", borderRadius: "var(--border-radius)" }}
            />
          </div>
        )}
      </Modal>

      {/* ─── Prev / Next navigation ────────────────────────── */}
      <nav className={styles.elementNav}>
        {prevEl ? (
          <Link href={`/element/${prevEl.name.toLowerCase()}`} className={styles.elementNavLink}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10 3L5 8L10 13" /></svg>
            <div className={styles.elementNavCard}>
              <Element element={prevEl} />
            </div>
            <div className={styles.elementNavText}>
              <span className={styles.elementNavLabel}>Prev</span>
              <span className={styles.elementNavName}>{prevEl.name}</span>
            </div>
          </Link>
        ) : <span />}
        {nextEl ? (
          <Link href={`/element/${nextEl.name.toLowerCase()}`} className={`${styles.elementNavLink} ${styles.elementNavRight}`}>
            <div className={styles.elementNavText} style={{ textAlign: "right" }}>
              <span className={styles.elementNavLabel}>Next</span>
              <span className={styles.elementNavName}>{nextEl.name}</span>
            </div>
            <div className={styles.elementNavCard}>
              <Element element={nextEl} />
            </div>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 3L11 8L6 13" /></svg>
          </Link>
        ) : <span />}
      </nav>

    </main>
  );
}
