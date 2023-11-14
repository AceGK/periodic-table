"use client";

import { useState } from "react";
import PeriodicTable from "@/lib/PeriodicTable.json";
import elementGroups from "@/lib/ElementGroups.json";
import SelectedElement from "@/components/SelectedElement/SelectedElement";

export default function Home() {
  const [selectedElement, setSelectedElement] = useState(null);
  const [selectedGroups, setSelectedGroups] = useState([]);

  const handleElementClick = (element) => {
    setSelectedElement(element);
  };

  const handleGroupChange = (groupName) => {
    const groupNameWithHyphens = groupName.replace(/ /g, "-").toLowerCase();
    setSelectedGroups((currentGroups) => {
      if (currentGroups.includes(groupNameWithHyphens)) {
        return currentGroups.filter(group => group !== groupNameWithHyphens);
      } else {
        return [...currentGroups, groupNameWithHyphens];
      }
    });
  };
  const isGroupSelected = (groupName) => selectedGroups.includes(groupName.replace(/ /g, "-").toLowerCase());

  return (
    <main className="container">

      <h1>Periodic Table</h1>
      <span>
        Click on an element to see its details.
      </span>

      <div className="table-wrapper">
        <div className="periodic-table">
          {PeriodicTable.elements.map((element) => (
            <div
              key={element.number}
              className={`element ${[
                element.category.replace(/ /g, "-").toLowerCase(),
              ]}`}
              style={{
                gridRow: element.ypos,
                gridColumn: element.xpos,
                backgroundColor: isGroupSelected(element.category) ? 'red' : 'transparent'
              }}
              onClick={() => handleElementClick(element)}
            >
              <strong>{element.symbol}</strong>
              <small className="number">{element.number}</small>
              <small className="name">{element.name}</small>
            </div>
          ))}

          <ul data-type="legend">
            {elementGroups.elementGroups.map((group) => (
              <li key={group.name} className={group.name.replace(/ /g, "-").toLowerCase()}>
                <label htmlFor={group.name}>
                <input
                  type="checkbox"
                  id={group.name}
                  onChange={() => handleGroupChange(group.name)}
                />
                <span>{group.name}</span>
                </label>
              </li>
            ))}
          </ul>

        </div>
      </div>


      <SelectedElement selectedElement={selectedElement} />
    </main>
  );
}
