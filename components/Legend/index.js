import { useState } from 'react';
import elementGroups from '@/lib/ElementGroups.JSON';

export default function Legend({ setSelectedGroup }) {
  const [selected, setSelected] = useState(null);

  const handleGroupChange = (group) => {
    const groupSubGroups = group.groups.map(subGroup => subGroup.name.replace(/ /g, "-").toLowerCase());

    // Toggle functionality: deselect if already selected, else select
    if (selected === group.name) {
      setSelected(null);
      setSelectedGroup([]);
    } else {
      setSelected(group.name);
      setSelectedGroup(groupSubGroups);
    }
  };

  const handleSubGroupChange = (groupName, subGroupName) => {
    const selectedSubGroup = `${groupName}/${subGroupName}`;

    // Toggle functionality: deselect if already selected, else select
    if (selected === selectedSubGroup) {
      setSelected(null);
      setSelectedGroup([]);
    } else {
      setSelected(selectedSubGroup);
      setSelectedGroup([subGroupName.replace(/ /g, "-").toLowerCase()]);
    }
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
              // Ensure `selected` is not null before calling `startsWith`
              checked={selected === group.name || (selected && selected.startsWith(group.name + '/'))}
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
                    // Use `checked` prop to reflect the current selection state accurately
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
