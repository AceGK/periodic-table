import { useState } from 'react';
import elementGroups from '@/lib/ElementGroups.JSON';
import styles from './Legend.module.scss';
export default function Legend({ setSelectedGroup, setHoveredGroup }) {
  const [selected, setSelected] = useState(null);

  const handleGroupChange = (group) => {
    // Adjust logic to set or clear both group and its subgroups as selected
    if (selected === group.name) {
      setSelected(null);
      setSelectedGroup([]);
    } else {
      setSelected(group.name);
      // Set group and all its subgroups as selected
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

  return (
    <div className={styles.legend}>
      {elementGroups.elementGroups.map((group) => (
        <div key={group.name}>
          <div 
            key={group.name} 
            className={`group-title ${group.name.replace(/ /g, "-").toLowerCase()}`}
            onMouseEnter={() => setHoveredGroup(group.name.replace(/ /g, "-").toLowerCase())}
            onMouseLeave={() => setHoveredGroup(null)}
          >
            <label htmlFor={`group-${group.name}`}>
              <input
                type="checkbox"
                name="elementGroup"
                id={`group-${group.name}`}
                checked={selected === group.name}
                onChange={() => handleGroupChange(group)}
              />
              <span>{group.name}</span>
            </label>
          </div>
          <ul className="subgroup-list">
            {group.groups.map((subGroup) => (
              <li 
                key={subGroup.name} 
                className={subGroup.name.replace(/ /g, "-").toLowerCase()}
                onMouseEnter={() => setHoveredGroup(subGroup.name.replace(/ /g, "-").toLowerCase())}
                onMouseLeave={() => setHoveredGroup(null)}
              >
                <label htmlFor={`subgroup-${subGroup.name}`}>
                  <input
                    type="checkbox"
                    name="elementSubGroup"
                    id={`subgroup-${subGroup.name}`}
                    checked={selected === `${group.name}/${subGroup.name}`}
                    onChange={() => handleSubGroupChange(group.name, subGroup.name)}
                  />
                  <span>{subGroup.name}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
