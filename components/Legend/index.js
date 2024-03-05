import { useState } from 'react';
import elementGroups from '@/lib/ElementGroups.JSON';

export default function Legend({ setSelectedGroup }) {
  const [selected, setSelected] = useState(null);

  const handleGroupChange = (group) => {
    // If a group is selected, set it and deselect any subgroup
    const groupSubGroups = group.groups.map(subGroup => subGroup.name.replace(/ /g, "-").toLowerCase());
    setSelected(group.name);
    // Pass all subgroup names as an array to setSelectedGroup
    setSelectedGroup(groupSubGroups);
  };

  const handleSubGroupChange = (groupName, subGroupName) => {
    // If a subgroup is selected, set it (include its parent group for context) and deselect any group
    setSelected(`${groupName}/${subGroupName}`);
    // Pass the subgroup name to setSelectedGroup
    setSelectedGroup([subGroupName.replace(/ /g, "-").toLowerCase()]);
  };

  return (
    <ul data-type="legend">
      {elementGroups.elementGroups.map((group) => (
        <li key={group.name} className={group.name.replace(/ /g, "-").toLowerCase()}>
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
          <ul>
            {group.groups.map((subGroup) => (
              <li key={subGroup.name} className={subGroup.name.replace(/ /g, "-").toLowerCase()}>
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
        </li>
      ))}
    </ul>
  );
}
