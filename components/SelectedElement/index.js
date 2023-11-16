import Link from "next/link";

export default function SelectedElement({ selectedElement }) {
  return (
    selectedElement &&
    <div id="element-details" className="element-details">


      <div className="title">
        <div
          key={selectedElement.number}
          className={`element ${[
            selectedElement.category.replace(/ /g, "-").toLowerCase(),
          ]}`}
        >
          <strong>{selectedElement.symbol}</strong>
          <small className="number">{selectedElement.number}</small>
          {/* <small className="name">{selectedElement.name}</small> */}
        </div>
        <div>
          <h2 className="name">{selectedElement.name}</h2>
          <div className="name">{selectedElement.category}{selectedElement.possible_category && ` | ${selectedElement.possible_category}`}</div>
          <div>{selectedElement.phase}</div>
        </div>
      </div>


      <div>
        <p>{selectedElement.summary}</p>
        <Link href={selectedElement.source}>Wiki</Link>
        <ul data-type="element-data">
          <li>
            <label>Atomic Mass</label>
            <output>{selectedElement.atomic_mass}</output>
          </li>
          <li>
            <label>Melting point</label>
            <output>{selectedElement.melt} K</output>
          </li>
          <li>
            <label>Boling point</label>
            <output>{selectedElement.boil} K</output>
          </li>
          <li>
            <label>Discovered by</label>
            <output>{selectedElement.discovered_by}</output>
          </li>
          <li>
            <label>Named by</label>
            <output>{selectedElement.named_by}</output>
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
          <output>{selectedElement.electronegativity_pauling}</output>
        </li>
        <li>
          <label>Electron Affinity</label>
          <output>{selectedElement.electron_affinity}</output>
        </li>
        <li>
          <label>Ionization Energies</label>
          <output>{selectedElement.ionization_energies[0]}</output>
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
          <output>{selectedElement.density}</output>
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
