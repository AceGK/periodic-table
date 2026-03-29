// ─── Category (series) colors ─────────────────────────────
// Maps element category names to CSS custom property names defined in _variables.scss

export const categoryVarMap = {
  'alkali metal': '--clr-alkali-metal',
  'alkaline earth metal': '--clr-alkaline-earth-metal',
  'transition metal': '--clr-transition-metal',
  'post-transition metal': '--clr-post-transition-metal',
  'lanthanide': '--clr-lanthanide',
  'actinide': '--clr-actinide',
  'diatomic nonmetal': '--clr-diatomic-nonmetal',
  'polyatomic nonmetal': '--clr-polyatomic-nonmetal',
  'noble gas': '--clr-noble-gas',
  'metalloid': '--clr-metalloid',
};

export function getCategoryColor(category) {
  const cssVar = categoryVarMap[category?.toLowerCase()] || '--clr-unknown';
  return `var(${cssVar})`;
}

// ─── Phase (state) colors ─────────────────────────────────
// Maps phase names to CSS custom property names defined in _variables.scss

export const phaseVarMap = {
  'Solid': '--clr-phase-solid',
  'Liquid': '--clr-phase-liquid',
  'Gas': '--clr-phase-gas',
};

export const phaseKeyVarMap = {
  'phase-solid': '--clr-phase-solid',
  'phase-liquid': '--clr-phase-liquid',
  'phase-gas': '--clr-phase-gas',
  'phase-unknown': '--clr-phase-unknown',
};

export function getPhaseColor(phase) {
  const cssVar = phaseVarMap[phase] || '--clr-phase-unknown';
  return `var(${cssVar})`;
}

export function getPhaseKeyColor(phaseKey) {
  const cssVar = phaseKeyVarMap[phaseKey] || '--clr-phase-unknown';
  return `var(${cssVar})`;
}
