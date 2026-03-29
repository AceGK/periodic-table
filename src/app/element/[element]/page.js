import data from "@/lib/Elements.json";
import { notFound } from "next/navigation";
import ElementPage from "./ElementPage";

export function generateStaticParams() {
  return data.elements.map((el) => ({
    element: el.name.toLowerCase(),
  }));
}

export function generateMetadata({ params }) {
  const el = data.elements.find(
    (e) => e.name.toLowerCase() === params.element.toLowerCase()
  );
  if (!el) return { title: "Element Not Found" };
  return {
    title: `${el.name} (${el.symbol}) — Periodic Table`,
    description: el.summary?.slice(0, 160),
  };
}

export default function Page({ params }) {
  const el = data.elements.find(
    (e) => e.name.toLowerCase() === params.element.toLowerCase()
  );
  if (!el) notFound();

  return <ElementPage element={el} />;
}
