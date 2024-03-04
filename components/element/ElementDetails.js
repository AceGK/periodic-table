import Link from "next/link";
import Element from "./ElementCard";
import styles from "./ElementDetails.module.scss";
import dynamic from 'next/dynamic';

const GLBViewerWithNoSSR = dynamic(() => import('../GLBViewer'), {
  ssr: false,
});

export default function ElementDetails({ element }) {
  return (
    element &&
    <div className={styles.elementDetails}>


      <div className={styles.element}>
        <Element element={element} />
      </div>

 
     <GLBViewerWithNoSSR path={element.bohr_model_3d} />


      <div>
        <p>{element.summary}</p>
        <Link href={element.source}>Wiki</Link>
        <div className="name"><span className="capitalize">{element.category}</span>{element.possible_category && ` (${element.possible_category})`}</div>
        <div>{element.phase}</div>
        <ul data-type="element-data">
          <li>
            <label>Atomic Mass</label>
            <output>{element.atomic_mass}</output>
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
            <label>Discovered by</label>
            <output>{element.discovered_by}</output>
          </li>
          <li>
            <label>Named by</label>
            <output>{element.named_by}</output>
          </li>
        </ul>
      </div>

      {/* <ul data-type="element-data">
       
       <li>
          <label>Energy levels</label>
          <output>...</output>
        </li>
        <li>
          <label>Electronegativity</label>
          <output>{element.electronegativity_pauling}</output>
        </li>
        <li>
          <label>Electron Affinity</label>
          <output>{element.electron_affinity}</output>
        </li>
        <li>
          <label>Ionization Energies</label>
          <output>{element.ionization_energies[0]}</output>
        </li>
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
        <li>
          <label>Abundance</label>
          <output>...</output>
        </li> 
      </ul> */}

    </div>
  );
}
