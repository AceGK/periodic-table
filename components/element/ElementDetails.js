import Link from "next/link";
import Element from "./ElementCard";
import styles from "./Element.module.scss";
import dynamic from 'next/dynamic';

const GLBViewerWithNoSSR = dynamic(() => import('../GLBViewer'), {
  ssr: false,
});

export default function ElementDetails({ element, setSelectedElement }) {
  return (
    element &&
    <div className={styles.elementDetails}>

      <Element element={element} />

      <div className={styles.details}>
        <div style={{maxHeight:"220px"}}>
          {element.bohr_model_3d && <GLBViewerWithNoSSR path={element.bohr_model_3d} />}
        </div>

        <div>
          <ul data-type="element-data">

            <li><label>Series</label>
              <output><span className="capitalize">{element.category}</span>{element.possible_category && ` (${element.possible_category})`}</output></li>

            <li>
              <label>Description</label>
              <output><Link href={element.source}>Wiki</Link></output>
            </li>

            {/* TODO make state at:temp selector */}
            <li><label>State</label>
              <output>{element.phase}</output></li>
            <li>
              <label>Atomic Mass:</label>
              <output>{element.atomic_mass}</output>
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

          </ul>
        </div>

        <div>
          <ul data-type="element-data">
            <li>
              <label>Melting point</label>
              <output>{element.melt} K</output>
            </li>
            <li>
              <label>Boling point</label>
              <output>{element.boil} K</output>
            </li>
            <li>
              <label>Electron Affinity</label>
              <output>{element.electron_affinity} kJ/mol</output>
            </li>
            <li>
              <label>Ionization Energies</label>
              <output>{element.ionization_energies[0]} kJ/mol</output>
            </li>
            <li>
              <label>Radius</label>
              <output>...</output>
            </li>
            <li>
              <label>Hardness</label>
              <output>...</output>
            </li>
          </ul>
        </div>

        <div>
          <ul data-type="element-data">
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
            <li>
              <label>Abundance</label>
              <output>...</output>
            </li>
            <li>
              <label>Discovered</label>
              <output>{element.discovered_by}</output>
            </li>
            <li>
              <label>Named by:</label>
              <output>{element.named_by}</output>
            </li>
          </ul>
        </div>

        {/* <div className={styles.summary}>
        <p>{element.summary}</p>
        <Link href={element.source}>Wiki</Link>
      </div> */}

      </div>
    </div>
  );
}
