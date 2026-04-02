// ─── Shared unit conversion formatters and option constants ───
// Used by ElementDetails, ElementPage, and FlashCards FullDetails

// ─── Fallback ─────────────────────────────────────────────

export const d = (v) => (v !== null && v !== undefined ? v : "n/a");

// ─── Temperature ──────────────────────────────────────────

export const tempOptions = [
  { value: "K", label: "K" },
  { value: "C", label: "°C" },
  { value: "F", label: "°F" },
];

export function formatTemp(k, unit = "K") {
  if (k === null || k === undefined) return "n/a";
  if (unit === "C") return `${Math.round((k - 273.15) * 100) / 100}`;
  if (unit === "F") return `${Math.round(((k - 273.15) * 9 / 5 + 32) * 100) / 100}`;
  return `${k}`;
}

export function convertToKelvin(val, unit) {
  if (unit === "C") return val + 273.15;
  if (unit === "F") return (val - 32) * 5 / 9 + 273.15;
  return val;
}

export function formatTempDisplay(kelvin, unit = "K") {
  if (kelvin === null || kelvin === undefined) return "";
  if (unit === "C") return Math.round(kelvin - 273.15);
  if (unit === "F") return Math.round((kelvin - 273.15) * 9 / 5 + 32);
  return kelvin;
}

// ─── Energy ───────────────────────────────────────────────

export const energyOptions = [
  { value: "kJ/mol", label: "kJ/mol" },
  { value: "eV", label: "eV" },
];

export function formatEnergy(val, unit = "kJ/mol") {
  if (val === null || val === undefined) return "n/a";
  if (unit === "eV") return `${Math.round((val / 96.485) * 1000) / 1000}`;
  return `${val}`;
}

// ─── Density ──────────────────────────────────────────────

export const densityOptions = [
  { value: "g/cm³", label: "g/cm³" },
  { value: "kg/m³", label: "kg/m³" },
];

export function formatDensity(val, unit = "g/cm³") {
  if (val === null || val === undefined) return "n/a";
  if (unit === "kg/m³") return `${Math.round(val * 1000 * 100) / 100}`;
  return `${val}`;
}

// ─── Phase at temperature ─────────────────────────────────

export function getPhaseAtTemp(element, temperature) {
  if (temperature === null || temperature === undefined) return element.phase;
  const { melt, boil, number } = element;
  if (melt === null && boil === null) return "Unknown";
  if (melt !== null && temperature < melt) return "Solid";
  if (boil !== null && temperature >= boil) return "Gas";
  if (melt !== null && boil !== null) return "Liquid";
  if (melt !== null) return "Liquid";
  if (boil !== null) return number === 2 ? "Liquid" : "Solid";
  return "Unknown";
}

// ─── Property dropdown configs ────────────────────────────
// Used for multi-value properties (radius, hardness, etc.)

export const radiusOptions = [
  { value: "calculated", label: "Atomic" },
  { value: "covalent-single-bond", label: "Covalent Single Bond" },
  { value: "covalent-triple-bond", label: "Covalent Triple Bond" },
  { value: "van-der-waals", label: "Van der Waals" },
  { value: "metallic", label: "Metallic" },
];

export const hardnessOptions = [
  { value: "brinell", label: "Brinell" },
  { value: "mohs", label: "Mohs" },
  { value: "vickers", label: "Vickers" },
];

export const modulusOptions = [
  { value: "bulk", label: "Bulk" },
  { value: "shear", label: "Shear" },
  { value: "young", label: "Young" },
];

export const conductivityOptions = [
  { value: "thermal", label: "Thermal" },
  { value: "electrical", label: "Electrical" },
];

export const heatOptions = [
  { value: "specific", label: "Specific" },
  { value: "vaporization", label: "Vaporization" },
  { value: "fusion", label: "Fusion" },
];

export const abundanceOptions = [
  { value: "universe", label: "Universe" },
  { value: "sun", label: "Sun" },
  { value: "meteor", label: "Meteorite" },
  { value: "crust", label: "Earth's Crust" },
  { value: "ocean", label: "Ocean" },
  { value: "human", label: "Human Body" },
];
