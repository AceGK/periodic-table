'use client';

import PeriodicTable from '@/lib/PeriodicTable.json'
import { useState } from 'react';

export default function Home() {
  const [selectedElement, setSelectedElement] = useState(null);

  const handleElementClick = (element) => {
    setSelectedElement(element);
  };

  return (
    <main>
      <div className="periodic-table">
        {PeriodicTable.elements.map((element) => (
          <div
            key={element.number}
            className={`element ${[element.category.replace(/ /g, '-').toLowerCase()]}`}
            style={{
              gridRow: element.ypos,
              gridColumn: element.xpos,
            }}
            onClick={() => handleElementClick(e)}
          >
            <strong>{element.symbol}</strong>
            <small className="number">{element.number}</small>
            <small className="name">{element.name}</small>
          </div>
        )
        )}
      </div>
      {selectedElement && (
        <div className="element-details">

          <div
            key={selectedElement.number}
            className="element"
            style={{
              gridRow: selectedElement.ypos,
              gridColumn: selectedElement.xpos,
            }}
            onClick={() => handleElementClick(e)}
          >
            <strong>{selectedElement.symbol}</strong>
            <small className="number">{selectedElement.number}</small>
            <small className="name">{selectedElement.name}</small>
          </div>
          <div>
            <h1>{selectedElement.name}</h1>
            <p>{selectedElement.summary}</p>
          </div>
        </div>
      )}

    </main>
  )
}
