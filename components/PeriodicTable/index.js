"use client";

import data from "@/lib/PeriodicTable.json";

export default function PeriodicTable({ setSelectedElement, selectedGroups }) {

  const handleElementClick = (element) => {
    setSelectedElement(element);

    const targetSection = document.getElementById("element-details");
    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: 'smooth', // Smooth scroll
        block: 'start'      // Aligns to the start of the viewport
      });
    }
  };


  const isGroupSelected = (groupName) => selectedGroups.includes(groupName.replace(/ /g, "-").toLowerCase());

  return (
    <div className="table-wrapper">
      <div className="periodic-table">
        {data.elements.map((element) => (
          <div
            key={element.number}
            className='element'
            style={{
              gridRow: element.ypos,
              gridColumn: element.xpos,
            }}
            onClick={() => handleElementClick(element)}
          >
            <div
              className={`
              ${element.category.replace(/ /g, "-").toLowerCase()}
              ${isGroupSelected(element.category) ? 'active' : ''}
              `}
            >
              <strong>{element.symbol}</strong>
              <small className="number">{element.number}</small>
              <small className="name">{element.name}</small>
            </div>
          </div>
        ))}
      </div>
      
  
    </div>
  );
}
