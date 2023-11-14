
export default function SelectedElement({ selectedElement }) {
  return ( 
    selectedElement && 
      <div className="element-details">

        {/* <div
          key={selectedElement.number}
          className="element"
        >
          <strong>{selectedElement.symbol}</strong>
          <small className="number">{selectedElement.number}</small>
          <small className="name">{selectedElement.name}</small>
        </div> */}

        <div>
          <h1>{selectedElement.name}</h1>
          <p>{selectedElement.summary}</p>
        </div>

        <ul data-type="element-data">
          <li>
            <label>Group</label>
            <value>{selectedElement.category}</value>
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
            <label>Desnity</label>
            <value>{selectedElement.density}</value>
          </li>
        </ul>

      </div>
  );
}
