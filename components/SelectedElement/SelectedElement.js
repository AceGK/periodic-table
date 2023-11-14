import Link from "next/link";

export default function SelectedElement({ selectedElement }) {
  return (
    selectedElement &&
    <div className="element-details">


      <div>
        <div
          key={selectedElement.number}
          className={`element ${[
            selectedElement.category.replace(/ /g, "-").toLowerCase(),
          ]}`}
        >
          <strong>{selectedElement.symbol}</strong>
          <small className="number">{selectedElement.number}</small>
          <small className="name">{selectedElement.name}</small>
        </div>

        {/* <h1>{selectedElement.name}</h1> */}
        <p>{selectedElement.summary}</p>
      </div>

      <ul data-type="element-data">
        <li>
          <label>Group</label>
          <value>{selectedElement.category}</value>
        </li>
        <li>
          <label>Write up</label>
          <value><Link href={selectedElement.source}>Wiki</Link></value>
        </li>
        <li>
          <label>State at ...</label>
          <value>...</value>
        </li>
        <li>
          <label>Atomic Mass</label>
          <value>{selectedElement.atomic_mass}</value>
        </li>
        <li>
          <label>Energy levels</label>
          <value>...</value>
        </li>
        <li>
          <label>Electronegativity</label>
          <value>{selectedElement.electronegativity_pauling}</value>
        </li>
        <li>
          <label>Melting point (k)</label>
          <value>{selectedElement.melt}</value>
        </li>
        <li>
          <label>Boling point (k)</label>
          <value>{selectedElement.boil}</value>
        </li>
        <li>
          <label>Electron Affinity</label>
          <value>{selectedElement.electron_affinity}</value>
        </li>
        <li>
          <label>Ionization Energies</label>
          <value>{selectedElement.ionization_energies[0]}</value>
        </li>
        <li>
          <label>Radius</label>
          <value>...</value>
        </li>
        <li>
          <label>Hardness</label>
          <value>...</value>
        </li>
        <li>
          <label>Modulus</label>
          <value>...</value>
        </li>
        <li>
          <label>Density</label>
          <value>{selectedElement.density}</value>
        </li>
        <li>
          <label>Conductivity</label>
          <value>...</value>
        </li>
        <li>
          <label>Heat</label>
          <value>...</value>
        </li>
        <li>
          <label>Abundance</label>
          <value>...</value>
        </li>
        <li>
          <label>Discovered</label>
          <value>{selectedElement.discovered_by}</value>
        </li>
      </ul>

    </div>
  );
}
