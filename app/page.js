import PeriodicTable from "@/components/PeriodicTable";

export default function Home() {

  return (
    <main className="container">
      <div className="pb-3">
        <h1>The Periodic Table of Elements</h1>
        <p>Select an element to view its details</p>
      </div>
      <PeriodicTable  />
      
    </main>
  );
}
