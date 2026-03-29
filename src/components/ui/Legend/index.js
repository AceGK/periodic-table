import { useState, useEffect } from 'react';
import elementGroups from '@/lib/ElementGroups.json';
import styles from './styles.module.scss';
import { SolidIcon, LiquidIcon, GasIcon, UnknownIcon } from '@/components/ui/PhaseIcon';

const phases = [
  { name: 'Solid', key: 'phase-solid', Icon: SolidIcon, color: 'var(--clr-phase-solid)' },
  { name: 'Liquid', key: 'phase-liquid', Icon: LiquidIcon, color: 'var(--clr-phase-liquid)' },
  { name: 'Gas', key: 'phase-gas', Icon: GasIcon, color: 'var(--clr-phase-gas)' },
  { name: 'Unknown', key: 'phase-unknown', Icon: UnknownIcon, color: 'var(--clr-phase-unknown)' },
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
