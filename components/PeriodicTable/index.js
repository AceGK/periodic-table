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
  const [table, setTable] = useState(true);

  const handleElementClick = (element) => {
    setSelectedElement(element);
  };

  const isGroupSelected = (groupName) => selectedGroup.includes(groupName.replace(/ /g, "-").toLowerCase());


  return (
    <>
      <div className="table-container">
      <ElementDetails element={selectedElement} setSelectedElement={setSelectedElement} />
        <div className="table-wrapper">
          <div className={table ? "periodic-table" : "periodic-list"}>

            {/* <button className="toggleView" onClick={() => setTable(!table)}>
              {!table ? <PeriodicTableIcon /> : <FaThList />}
            </button> */}

            {table &&
            <section className="tabs" style={{padding:'1rem'}}>
              <Legend setSelectedGroup={setSelectedGroup} />
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
            </section> }

            {/* <div className="searchForm">
              <input type="text" placeholder="Search" />
            </div> */}

            {data.elements.map((element) => (
              <Element key={element.number} element={element} handleElementClick={() => handleElementClick(element)} isGroupSelected={isGroupSelected} selectedElement={selectedElement} />
            ))}
          </div>

        </div>
      </div>
    </>
  );
}
