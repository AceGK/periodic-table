import PeriodicTable from "@/components/PeriodicTable";
import ThemeSwitch from "@/components/ThemeSwitch";
import Link from "next/link";

export default function Home() {
  return (
    <main className="container">
      <PeriodicTable />

      {/* <h2>Need more?</h2>
      <p>
        is there a feature you want to see on this site? Please let us know! In
        the meantime, here are are other periodic table apps that might suit
        your needs
      </p>
      <ul>
        <li>
          <Link href="https://ptable.com/">Ptable</Link>
        </li>
        <li>
          <Link href="https://pubchem.ncbi.nlm.nih.gov/periodic-table/">
            PubChem
          </Link>
        </li>
        <li>
          <Link href="https://www.rsc.org/periodic-table">
            Royal Society of Chemistry
          </Link>
        </li>
        <li>
          <Link href="https://www.fishersci.com/us/en/periodic-table.html">Fisher Scientific</Link>
        </li>
        <li>
          <Link href="https://byjus.com/periodic-table/">BYJU'S</Link>
        </li>
        <li>
          <Link href="https://periodum.com/">periodum</Link>
        </li>
      </ul> */}
    </main>
  );
}
