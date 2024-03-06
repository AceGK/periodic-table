import Link from "next/link";
import Element from "./ElementCard";
import styles from "./Element.module.scss";
import dynamic from "next/dynamic";
import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const GLBViewerWithNoSSR = dynamic(() => import("../GLBViewer"), {
  ssr: false,
});

export default function ElementDetails({ element, setSelectedElement }) {
  const [showDetails, setShowDetails] = useState(true);

  // State to keep track of the selected ionization energy index
  const [selectedIonizationIndex, setSelectedIonizationIndex] = useState(0);

  // Function to generate ordinal labels (1st, 2nd, 3rd, etc.)
  const getOrdinalLabel = (n) => {
    const s = ["th", "st", "nd", "rd"],
      v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  return (
    element && (
      <div>
        <div className={styles.toggleDetails}>
          {/* <button onClick={()=>setShowDetails(!showDetails)}>
            {showDetails ? <FaChevronUp /> : <FaChevronDown />}
            </button> */}
          </div>
      {showDetails && <div className={styles.elementDetails}>
        <Element element={element} />

        <div className={styles.details}>
          <div style={{ maxHeight: "220px", maxWidth:"220px" }}>
            {element.bohr_model_3d && (
              <GLBViewerWithNoSSR path={element.bohr_model_3d} />
            )}
          </div>

          <div>
            <ul data-type="element-data">
              <li>
                <label>Series</label>
                <output>
                  <span className="capitalize">{element.category}</span>
                  {element.possible_category &&
                    ` (${element.possible_category})`}
                </output>
              </li>

              <li>
                <label>Description</label>
                <output>
                  <Link href={element.source}>Wiki</Link>
                </output>
              </li>

              {/* TODO make state at:temp selector */}
              <li>
                <label>State</label>
                <output>{element.phase}</output>
              </li>
              <li>
                <label>Abundance</label>
                <output>...</output>
              </li>
              <li>
                <label>Discovered by</label>
                <output>
                  {element.discovered_by} ({element.year_discovered})
                </output>
              </li>
              <li>
                <label>Named by</label>
                <output>
                  {element.named_by} ({element.year_named})
                </output>
              </li>
            </ul>
          </div>

          <div>
            <ul data-type="element-data">
              <li>
                <label>Atomic Mass</label>
                <output>{element.atomic_mass}u</output>
              </li>
              <li>
                <label>Melting point</label>
                <output>{element.melt} K</output>
              </li>
              <li>
                <label>Boling point</label>
                <output>{element.boil} K</output>
              </li>
              <li>
                <label>Energy levels</label>
                <output>
                  {element.shells.map((i, index) => {
                    // Check if the current item is the last in the array
                    const isLastItem = index === element.shells.length - 1;
                    // If it's the last item, don't append a comma. Otherwise, append a comma.
                    return isLastItem ? `${i}` : `${i}, `;
                  })}
                </output>
              </li>
              <li>
                <label>Electronegativity</label>
                <output>{element.electronegativity_pauling}</output>
              </li>
              <li>
                <label>Electron Affinity</label>
                <output>{element.electron_affinity} kJ/mol</output>
              </li>
              <li>
                <label style={{ display: "flex" }}>
                  Ionization
                  <select
                    value={selectedIonizationIndex}
                    onChange={(e) => setSelectedIonizationIndex(e.target.value)}
                  >
                    {element.ionization_energies.map((energy, index) => (
                      <option key={index} value={index}>
                        {getOrdinalLabel(index + 1)}
                      </option>
                    ))}
                  </select>
                </label>
                <output>
                  {element.ionization_energies[selectedIonizationIndex]} kJ/mol
                </output>
              </li>
            </ul>
          </div>

          <div>
            <ul data-type="element-data">
             
              <li>
                <label>Radius</label>
                <output>...</output>
              </li>
              <li>
                <label>Hardness</label>
                <output>...</output>
              </li>
              <li>
                <label>Modulus</label>
                <output>...</output>
              </li>
              <li>
                <label>Density</label>
                <output>{element.density}</output>
              </li>
              <li>
                <label>Conductivity</label>
                <output>...</output>
              </li>
              <li>
                <label>Heat</label>
                <output>...</output>
              </li>
            </ul>
          </div>

          {/* <div className={styles.summary}>
        <p>{element.summary}</p>
        <Link href={element.source}>Wiki</Link>
      </div> */}
        </div>
      </div>
}
      </div>
    )
  );
}
