"use client";

import data from "@/lib/PeriodicTable.json";
import { useState, useRef } from "react";
import Element from "../element/ElementCard";
import Legend from "../Legend";
import ElementDetails from "../element/ElementDetails";

export default function PeriodicTable({ }) {

  const [selectedElement, setSelectedElement] = useState(null);
  const [selectedGroups, setSelectedGroups] = useState([]);

  const handleElementClick = (element) => {
    setSelectedElement(element);
  };

  const isGroupSelected = (groupName) => selectedGroups.includes(groupName.replace(/ /g, "-").toLowerCase());


  return (
    <>

      <Legend setSelectedGroups={setSelectedGroups} />
 
      <div className="table-container">
      <div className="table-wrapper">
        <div className="periodic-table"> 
          {data.elements.map((element) => (
            <Element key={element.number} element={element} handleElementClick={() => handleElementClick(element)} isGroupSelected={isGroupSelected} selectedElement={selectedElement} />
          ))}
        </div>
        
      </div>
      <ElementDetails element={selectedElement} setSelectedElement={setSelectedElement} />
      </div>
    </>
  );
}
