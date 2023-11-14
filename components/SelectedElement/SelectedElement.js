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
   <Link href={selectedElement.source}>Wiki</Link>
      </div>

      <div>
        Animation...
      </div>

      <ul data-type="element-data">
        <li>
          <label>Group</label>
          <output>{selectedElement.category}</output>
        </li>
        <li>
          <label>Phase</label>
          <output>{selectedElement.phase}</output>
        </li>
        <li>
          <label>Appearance</label>
          <output>{selectedElement.apperance}</output>
        </li>
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
<br/>
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
      </ul>

    </div>
  );
}
