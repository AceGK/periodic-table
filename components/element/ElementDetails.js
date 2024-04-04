import Link from "next/link";
import Element from "./ElementCard";
import styles from "./Element.module.scss";
import dynamic from "next/dynamic";
import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import Image from "next/image";
import { MdOpenInNew } from "react-icons/md";

const GLBViewerWithNoSSR = dynamic(() => import("../GLBViewer"), {
  ssr: false,
});

export default function ElementDetails({ selectedElement, setSelectedElement, hoveredElement }) {

  // Determine which element to use: selectedElement or hoveredElement
  const elementToShow = selectedElement || hoveredElement;

  // State to track the selected display option
  const [displayOption, setDisplayOption] = useState('bohrModel3D');

  // Proceed only if there is an element to show
  if (!elementToShow) return null;


  return (

    <div className={styles.elementDetails}>
      <Element element={elementToShow} />

      <div className={styles.details}>

        <Details element={elementToShow} />

        <div style={{ position: 'relative' }}>
          <select className={styles.mediaSelect} value={displayOption} onChange={e => setDisplayOption(e.target.value)}>
            <option value="bohrModel3D">Bohr Model 3D</option>
            <option value="image">Image</option>
          </select>

          <div style={{ width: "100%", height: "100%", maxHeight: "220px", position: 'relative' }}>
            {displayOption === 'bohrModel3D' && elementToShow.bohr_model_3d && (
              <GLBViewerWithNoSSR path={elementToShow.bohr_model_3d} />
            )}
            {displayOption === 'image' && elementToShow.image?.url && (
              <Image
                src={elementToShow.image.url}
                alt="Element"
                layout="fill"
                objectFit="cover"
              />
            )}
          </div>
        </div>

      </div>
    </div>

  );
}


function Details({ element }) {

  // State to keep track of the selected ionization energy index
  const [selectedIonizationIndex, setSelectedIonizationIndex] = useState(0);

  // Function to generate ordinal labels (1st, 2nd, 3rd, etc.)
  const getOrdinalLabel = (n) => {
    const s = ["th", "st", "nd", "rd"],
      v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  return (
    <>
      {/* <div className={styles.summary}>
        <p>{element.summary}</p>
        <Link href={element.source}>Wiki</Link>
      </div> */}
      <div>

        <ul data-type="element-data">
          <li>
            <label>{element.name}</label>
            <output>
              <a href={element.source} target="_blank" aria-label={`Wikipedia link for ${element.name}`}>wiki <MdOpenInNew /></a>
            </output>
          </li>
          <li>
            <label>Series</label>
            <output>
              <span className="capitalize">{element.category}</span>
              {element.possible_category &&
                ` (${element.possible_category})`}
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
            <label>Discovered</label>
            <output>
              {element.discovered_by || 'n/a'}
              {element.discovered && `(${element.discovered})`}
            </output>
          </li>
          <li>
            <label>Named</label>
            <output>
              {element.named_by || "n/a"}
              {element.year_named && element.year_named}
            </output>
          </li>
        </ul>
      </div>

      <div>
        <ul data-type="element-data">
          <li>
            <label>Atomic Mass</label>
            <output>{element.atomic_mass} u</output>
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
          <li>
            <label>Melting point</label>
            <output>{element.melt} K</output>
          </li>
          <li>
            <label>Boling point</label>
            <output>{element.boil} K</output>
          </li>
        </ul>
      </div>

      <div>
        <ul data-type="element-data">

          <Radius element={element} />
          <Hardness element={element} />
          <li>
            <label>Modulus</label>
            <output>...</output>
          </li>
          <li>
            <label>Density</label>
            <output>{element.density} kg/m3</output>
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
    </>
  )


}


function Radius({ element }) {
  const [selectedRadiusIndex, setSelectedRadiusIndex] = useState(0);

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
  const [selectedHardness, setSelectedHardness] = useState(0);

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