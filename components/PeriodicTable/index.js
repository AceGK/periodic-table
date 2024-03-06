"use client";

import data from "@/lib/PeriodicTable.json";
import { useState, useRef } from "react";
import Element from "../element/ElementCard";
import Legend from "../Legend";
import ElementDetails from "../element/ElementDetails";
import PeriodicTableIcon from "../../public/icons/minimal-periodic-table.svg";
import { FaThList } from "react-icons/fa";
import Tabs from "../tabs/Tabs";
import Tab from "../tabs/Tab";

export default function PeriodicTable({ }) {

  const [selectedElement, setSelectedElement] = useState(data.elements[0]);
  const [selectedGroup, setSelectedGroup] = useState([]);
  const [hoveredGroup, setHoveredGroup] = useState(null);
  const [table, setTable] = useState(true);

  const handleElementClick = (element) => {
    setSelectedElement(element);
  };

  const isGroupSelected = (groupName) => selectedGroup.includes(groupName.replace(/ /g, "-").toLowerCase());

  return (
    <>

      <section className="container">
        <ElementDetails element={selectedElement} setSelectedElement={setSelectedElement} />
      </section>
      <div className="table-wrapper">
        <div className={table ? "periodic-table" : "periodic-list"}>

          {/* <button className="toggleView" onClick={() => setTable(!table)}>
              {!table ? <PeriodicTableIcon /> : <FaThList />}
            </button> */}

          {table &&
            <section className="tabs" style={{ padding: '1rem' }}>
              <Legend setSelectedGroup={setSelectedGroup} setHoveredGroup={setHoveredGroup} />
              {/* <Tabs>
              <Tab label="Filters">
              <Legend setSelectedGroup={setSelectedGroup} />
              </Tab>
              <Tab label="Legend">
              Coming soon...
              </Tab>
              <Tab label="Temperature">
              Coming soon...
              </Tab>
            </Tabs> */}
            </section>}

          {/* <div className="searchForm">
              <input type="text" placeholder="Search" />
            </div> */}

          <div
            className="lanthanide-card lanthanide"
            onClick={() => setSelectedGroup(
              selectedGroup.includes("lanthanide")
                ? selectedGroup.filter(group => group !== "lanthanide") // Remove if it's already selected
                : [...selectedGroup, "lanthanide"] // Add if it's not already selected
            )}
            onMouseEnter={() => setHoveredGroup("lanthanide")}
            onMouseLeave={() => setHoveredGroup(null)}
          >
            57-71
          </div>

          <div
            className="actinide-card actinide"
            onClick={() => setSelectedGroup(
              selectedGroup.includes("actinide")
                ? selectedGroup.filter(group => group !== "actinide") // Remove if it's already selected
                : [...selectedGroup, "actinide"] // Add if it's not already selected
            )}
            onMouseEnter={() => setHoveredGroup("actinide")}
            onMouseLeave={() => setHoveredGroup(null)}
          >
            89-103
          </div>

          {data.elements.map((element) => (
            <Element key={element.number} element={element} handleElementClick={() => handleElementClick(element)} isGroupSelected={isGroupSelected} selectedElement={selectedElement} hoveredGroup={hoveredGroup} />
          ))}
        </div>

      </div>

    </>
  );
}
