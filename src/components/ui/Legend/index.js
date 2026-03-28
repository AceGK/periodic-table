import { useState, useEffect } from 'react';
import elementGroups from '@/lib/ElementGroups.JSON';
import styles from './styles.module.scss';
import { IoIosCube } from "react-icons/io";
import { TbDropletFilled } from "react-icons/tb";
const HeatIcon = ({ size = "1em" }) => (
  <svg width={size} height={size} viewBox="0 0 640 640" fill="currentColor">
    <path d="M272 96C289.7 96 304 110.3 304 128L304 208C304 242.6 315.2 276.3 336 304L355.2 329.6C384.3 368.4 400 415.5 400 464L400 512C400 529.7 385.7 544 368 544C350.3 544 336 529.7 336 512L336 464C336 429.4 324.8 395.7 304 368L284.8 342.4C255.7 303.6 240 256.5 240 208L240 128C240 110.3 254.3 96 272 96zM128 160C145.7 160 160 174.3 160 192L160 224C160 258.6 171.2 292.3 192 320L211.2 345.6C240.3 384.4 256 431.5 256 480L256 512C256 529.7 241.7 544 224 544C206.3 544 192 529.7 192 512L192 480C192 445.4 180.8 411.7 160 384L140.8 358.4C111.7 319.6 96 272.5 96 224L96 192C96 174.3 110.3 160 128 160zM448 192L448 224C448 258.6 459.2 292.3 480 320L499.2 345.6C528.3 384.4 544 431.5 544 480L544 512C544 529.7 529.7 544 512 544C494.3 544 480 529.7 480 512L480 480C480 445.4 468.8 411.7 448 384L428.8 358.4C399.7 319.6 384 272.5 384 224L384 192C384 174.3 398.3 160 416 160C433.7 160 448 174.3 448 192z" />
  </svg>
);
import { AiOutlineQuestionCircle } from "react-icons/ai";

const PhaseIcons = {
  Solid: IoIosCube,
  Liquid: TbDropletFilled,
  Gas: HeatIcon,
  Unknown: AiOutlineQuestionCircle,
};

const phases = [
  { name: 'Solid', key: 'phase-solid', Icon: PhaseIcons.Solid, color: '#e85d75' },
  { name: 'Liquid', key: 'phase-liquid', Icon: PhaseIcons.Liquid, color: '#5EBBFF' },
  { name: 'Gas', key: 'phase-gas', Icon: PhaseIcons.Gas, color: '#4AE3B5' },
  { name: 'Unknown', key: 'phase-unknown', Icon: PhaseIcons.Unknown, color: 'var(--clr-text-secondary)' },
];

export default function Legend({ setSelectedGroup, setHoveredGroup, selectedGroup }) {
  const [selected, setSelected] = useState(null);

  // Clear internal selection when external selectedGroup changes (e.g. lanthanide/actinide cards)
  useEffect(() => {
    if (selectedGroup?.length === 0) setSelected(null);
  }, [selectedGroup]);

  // Sync legend visual state when selectedGroup changes externally (e.g. lanthanide/actinide cards)
  const effectiveSelected = (() => {
    if (selected) return selected;
    if (!selectedGroup || selectedGroup.length === 0) return null;
    // Check if it matches a subgroup
    if (selectedGroup.length === 1) {
      const key = selectedGroup[0];
      if (key.startsWith('phase-')) return key;
      // Find which group/subgroup this belongs to
      for (const group of elementGroups.elementGroups) {
        for (const sub of group.groups) {
          if (sub.name.replace(/ /g, '-').toLowerCase() === key) {
            return `${group.name}/${sub.name}`;
          }
        }
      }
    }
    // Check if it matches a full group (like lanthanide selected via the card)
    if (selectedGroup.includes('lanthanide')) return 'Metals/lanthanide';
    if (selectedGroup.includes('actinide')) return 'Metals/actinide';
    return null;
  })();

  const handleGroupChange = (group) => {
    if (selected === group.name) {
      setSelected(null);
      setSelectedGroup([]);
    } else {
      setSelected(group.name);
      const groupSubGroups = group.groups.map(subGroup => subGroup.name.replace(/ /g, "-").toLowerCase());
      setSelectedGroup([group.name.replace(/ /g, "-").toLowerCase(), ...groupSubGroups]);
    }
  };

  const handleSubGroupChange = (groupName, subGroupName) => {
    const fullSubGroupName = `${groupName}/${subGroupName}`;
    if (selected === fullSubGroupName) {
      setSelected(null);
      setSelectedGroup([]);
    } else {
      setSelected(fullSubGroupName);
      setSelectedGroup([subGroupName.replace(/ /g, "-").toLowerCase()]);
    }
  };

  const renderGroup = (group, { twoCol } = {}) => {
    if (!group) return null;
    return (
      <div key={group.name} className={styles.groupBlock}>
        <div
          className={`${styles.groupHeader} ${effectiveSelected === group.name ? styles.groupHeaderActive : ''}`}
          onClick={() => handleGroupChange(group)}
          onMouseEnter={() => setHoveredGroup(group.name.replace(/ /g, "-").toLowerCase())}
          onMouseLeave={() => setHoveredGroup(null)}
        >
          <span>{group.name}</span>
        </div>
        <div className={`${styles.subGroups} ${twoCol ? styles.twoCol : ''}`}>
          {group.groups.map((subGroup) => {
            const normalized = subGroup.name.replace(/ /g, "-").toLowerCase();
            const isSubActive = effectiveSelected === `${group.name}/${subGroup.name}` || effectiveSelected === group.name;
            return (
              <div
                key={subGroup.name}
                className={`${styles.subGroupItem} ${normalized} ${isSubActive ? styles.subGroupItemActive : ''}`}
                onClick={() => handleSubGroupChange(group.name, subGroup.name)}
                onMouseEnter={() => setHoveredGroup(normalized)}
                onMouseLeave={() => setHoveredGroup(null)}
              >
                <span className={styles.subGroupSwatch} />
                <span className={styles.subGroupLabel}>{subGroup.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.legend}>
      {/* Phase indicators */}
      <div className={styles.phaseGroup}>
        {phases.map((phase) => {
          const isPhaseSelected = effectiveSelected === phase.key;
          return (
            <div
              key={phase.name}
              className={`${styles.phaseItem} ${isPhaseSelected ? styles.phaseItemActive : ''}`}
              style={{ color: phase.color }}
              onClick={() => {
                if (isPhaseSelected) {
                  setSelected(null);
                  setSelectedGroup([]);
                } else {
                  setSelected(phase.key);
                  setSelectedGroup([phase.key]);
                }
              }}
              onMouseEnter={() => setHoveredGroup(phase.key)}
              onMouseLeave={() => setHoveredGroup(null)}
            >
              <span className={styles.phaseIcon}><phase.Icon /></span>
              <span className={styles.phaseLabel}>{phase.name}</span>
            </div>
          );
        })}
      </div>

      {/* Category groups — 3 columns */}
      <div className={styles.categoryGroups}>
        {renderGroup(elementGroups.elementGroups.find(g => g.name === 'Metals'), { twoCol: true })}
        <div className={styles.middleColumn}>
          {renderGroup(elementGroups.elementGroups.find(g => g.name === 'Metalloids'))}
          {renderGroup(elementGroups.elementGroups.find(g => g.name === 'Other'))}
        </div>
        {renderGroup(elementGroups.elementGroups.find(g => g.name === 'Nonmetals'))}
      </div>
    </div>
  );
}
