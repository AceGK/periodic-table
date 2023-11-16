"use client";

import { useState } from "react";
import PeriodicTable from "@/components/PeriodicTable";
import SelectedElement from "@/components/SelectedElement";
import Legend from "@/components/Legend";

export default function Home() {
  const [selectedElement, setSelectedElement] = useState(null);
  const [selectedGroups, setSelectedGroups] = useState([]);

  return (
    <main className="container">
      <PeriodicTable selectedElement={selectedElement} setSelectedElement={setSelectedElement} selectedGroups={selectedGroups} setSelectedGroups={setSelectedGroups} />
      <div style={{padding:"0rem 1rem"}}>
      <Legend setSelectedGroups={setSelectedGroups} />
      <SelectedElement selectedElement={selectedElement} />
      </div>
    </main>
  );
}
