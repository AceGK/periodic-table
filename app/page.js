'use client';

import PeriodicTable from '@/lib/PeriodicTable.json'
import { useState } from 'react';
import SelectedElement from '@/components/SelectedElement/SelectedElement';

export default function Home() {
  const [selectedElement, setSelectedElement] = useState(null);

  const handleElementClick = (element) => {
    setSelectedElement(element);
  };

  return (
    <main>
      <SelectedElement selectedElement={selectedElement} />
      <div className="periodic-table">
        {PeriodicTable.elements.map((element) => (
          <div
            key={element.number}
            className={`element ${[element.category.replace(/ /g, '-').toLowerCase()]}`}
            style={{
              gridRow: element.ypos,
              gridColumn: element.xpos,
            }}
            onClick={() => handleElementClick(element)}
          >
            <strong>{element.symbol}</strong>
            <small className="number">{element.number}</small>
            <small className="name">{element.name}</small>
          </div>
        )
        )}
      </div>
 
    </main>
  )
}
