
import elementGroups from "@/lib/ElementGroups.json";

export default function Legend({ setSelectedGroups }) {

  const handleGroupChange = (groupName) => {
    const groupNameWithHyphens = groupName.replace(/ /g, "-").toLowerCase();
    setSelectedGroups((currentGroups) => {
      if (currentGroups.includes(groupNameWithHyphens)) {
        return currentGroups.filter(group => group !== groupNameWithHyphens);
      } else {
        return [...currentGroups, groupNameWithHyphens];
      }
    });
  };

  return ( 
    <ul data-type="legend">
    {elementGroups.elementGroups.map((group) => (
      <li key={group.name} className={group.name.replace(/ /g, "-").toLowerCase()}>
        <label htmlFor={group.name}>
          <input
            type="checkbox"
            id={group.name}
            onChange={() => handleGroupChange(group.name)}
          />
          <span>{group.name}</span>
        </label>
      </li>
    ))}
  </ul>
   );
}