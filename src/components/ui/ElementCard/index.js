import styles from './styles.module.scss';
import PhaseIcon from '@/components/ui/PhaseIcon';
import { getPhaseKeyColor } from '@/lib/elementColors';

function PhaseIndicator({ phaseKey }) {
  return (
    <span style={{ color: getPhaseKeyColor(phaseKey), display: 'flex', fontSize: 'clamp(10px, 1.1vmax, 15px)' }}>
      <PhaseIcon phaseKey={phaseKey} size="1em" />
    </span>
  );
}

function getPhaseKey(phase) {
  if (!phase) return 'phase-unknown';
  const lower = phase.toLowerCase();
  if (lower.includes('solid')) return 'phase-solid';
  if (lower.includes('liquid')) return 'phase-liquid';
  if (lower.includes('gas')) return 'phase-gas';
  return 'phase-' + lower.replace(/\s+/g, '-');
}

function getPhaseAtTemp(element, temperature) {
  if (temperature === null || temperature === undefined) return null;
  const { melt, boil, number } = element;
  if (melt === null && boil === null) return 'phase-unknown';
  if (melt !== null && temperature < melt) return 'phase-solid';
  if (boil !== null && temperature >= boil) return 'phase-gas';
  if (melt !== null && boil !== null) return 'phase-liquid';
  // Only melt known and temp >= melt
  if (melt !== null) return 'phase-liquid';
  // Only boil known and temp < boil:
  // Helium (2) has no solid phase — stays liquid down to 0K
  // All others sublime (solid → gas) so they're solid below boiling
  if (boil !== null) return number === 2 ? 'phase-liquid' : 'phase-solid';
  return 'phase-unknown';
}

export default function Element({ element, handleElementClick, isGroupSelected, selectedElement, hoveredGroup, setHoveredElement, showShells, showPhase = false, temperature, size }) {
  const phaseKey = temperature !== null && temperature !== undefined
    ? getPhaseAtTemp(element, temperature)
    : getPhaseKey(element.phase);

  const sizeClass = size ? styles[`size-${size}`] : '';

  return (
    <div
      key={element.number}
      className={`
        ${styles.element}
        ${sizeClass}
        ${element.block + '-block'}
        ${'group-' + element.group}
        ${element.category.replace(/ /g, "-").toLowerCase()}
        ${phaseKey}
        ${selectedElement == element ? 'selected-element': ''}
        ${element.hypothetical ? styles.hypothetical : ''}
      `}
      style={size ? undefined : {
        gridRow: element.ypos + 1,
        gridColumn: element.xpos + 1,
      }}
      onClick={(e) => handleElementClick && handleElementClick(element, e)}
      onMouseEnter={() => setHoveredElement && setHoveredElement(element)}
    >
      <div
        className={`
      ${styles.elementBody}
      ${selectedElement && selectedElement.number === element.number ? styles.selected : ''}
      ${isGroupSelected && (isGroupSelected(element.category) || isGroupSelected(phaseKey)) ? 'active' : ''}
      ${hoveredGroup === element.category.replace(/ /g, "-").toLowerCase() || hoveredGroup === phaseKey ? 'hovered' : ''}
      `}
      >

        <div className={styles.number}>
          <span title="Atomic Number">{element.number}</span>
          {showPhase && <span title="Phase"><PhaseIndicator phaseKey={phaseKey} /></span>}
        </div>
        <div className={styles.symbol} title="Symbol">{element.symbol}</div>
        <div>
          <div className={styles.name} title="Name">{element.name}</div>
          <div className={styles.mass} title="Atomic Weight">
            {Number.isInteger(element.atomic_mass) ? `(${element.atomic_mass})` : element.atomic_mass}
          </div>
          {showShells && element.shells && (
            <div className={styles.shells} title="Electron Shells">
              {element.shells.map((count, i) => (
                <span key={i}>{count}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
