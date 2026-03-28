import styles from './styles.module.scss';
import { IoIosCube } from "react-icons/io";
import { TbDropletFilled } from "react-icons/tb";
const HeatIcon = ({ size = "1em" }) => (
  <svg width={size} height={size} viewBox="0 0 640 640" fill="currentColor">
    <path d="M272 96C289.7 96 304 110.3 304 128L304 208C304 242.6 315.2 276.3 336 304L355.2 329.6C384.3 368.4 400 415.5 400 464L400 512C400 529.7 385.7 544 368 544C350.3 544 336 529.7 336 512L336 464C336 429.4 324.8 395.7 304 368L284.8 342.4C255.7 303.6 240 256.5 240 208L240 128C240 110.3 254.3 96 272 96zM128 160C145.7 160 160 174.3 160 192L160 224C160 258.6 171.2 292.3 192 320L211.2 345.6C240.3 384.4 256 431.5 256 480L256 512C256 529.7 241.7 544 224 544C206.3 544 192 529.7 192 512L192 480C192 445.4 180.8 411.7 160 384L140.8 358.4C111.7 319.6 96 272.5 96 224L96 192C96 174.3 110.3 160 128 160zM448 192L448 224C448 258.6 459.2 292.3 480 320L499.2 345.6C528.3 384.4 544 431.5 544 480L544 512C544 529.7 529.7 544 512 544C494.3 544 480 529.7 480 512L480 480C480 445.4 468.8 411.7 448 384L428.8 358.4C399.7 319.6 384 272.5 384 224L384 192C384 174.3 398.3 160 416 160C433.7 160 448 174.3 448 192z" />
  </svg>
);
import { AiOutlineQuestionCircle } from "react-icons/ai";

const phaseColors = {
  'phase-solid': '#e85d75',
  'phase-liquid': '#5EBBFF',
  'phase-gas': '#4AE3B5',
  'phase-unknown': 'var(--clr-text-secondary)',
};

const phaseIconMap = {
  'phase-solid': IoIosCube,
  'phase-liquid': TbDropletFilled,
  'phase-gas': HeatIcon,
  'phase-unknown': AiOutlineQuestionCircle,
};

function PhaseIcon({ phaseKey }) {
  const Icon = phaseIconMap[phaseKey] || phaseIconMap['phase-unknown'];
  const color = phaseColors[phaseKey] || phaseColors['phase-unknown'];
  return (
    <span style={{ color, display: 'flex', fontSize: 'clamp(10px, 1.1vmax, 15px)' }}>
      <Icon size="1em" />
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

export default function Element({ element, handleElementClick, isGroupSelected, selectedElement, hoveredGroup, setHoveredElement, showShells, temperature }) {
  const phaseKey = temperature !== null && temperature !== undefined
    ? getPhaseAtTemp(element, temperature)
    : getPhaseKey(element.phase);
  return (
    <div
      key={element.number}
      className={`
        ${styles.element}
        ${element.block + '-block'}
        ${'group-' + element.group}
        ${element.category.replace(/ /g, "-").toLowerCase()}
        ${phaseKey}
        ${selectedElement == element ? 'selected-element': ''}
        ${element.hypothetical ? styles.hypothetical : ''}
      `}
      style={{
        gridRow: element.ypos + 1,
        gridColumn: element.xpos + 1,
      }}
      onClick={(e) => handleElementClick && handleElementClick(element, e)}
      onMouseEnter={() => setHoveredElement && setHoveredElement(element)}
      // onMouseLeave={() => setHoveredElement(null)}
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
          <span title="Phase"><PhaseIcon phaseKey={phaseKey} /></span>
        </div>
        <div className={styles.symbol} title="Symbol">{element.symbol}</div>
        <div>
          <div className={styles.name} title="Name">{element.name}</div>
          <div className={styles.mass} title="Atomic Weight">{element.atomic_mass}</div>
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
