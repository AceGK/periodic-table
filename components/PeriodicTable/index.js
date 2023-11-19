"use client";

import data from "@/lib/PeriodicTable.json";
import { useEffect } from "react";

export default function PeriodicTable({ setSelectedElement, selectedElement, selectedGroups }) {

  const handleElementClick = (element) => {
    setSelectedElement(element);
  };

  useEffect(() => {
    const targetSection = document.getElementById("element-details");
    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [selectedElement]); // Dependency on selectedElement

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
