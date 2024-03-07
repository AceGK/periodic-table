import styles from './Element.module.scss';

export default function Element({ element, handleElementClick, isGroupSelected, selectedElement, hoveredGroup }) {
  return (
    <div
      key={element.number}
      className={`
        ${styles.element}
        ${element.block + '-block'}
        ${'group-' + element.group}
        ${element.category.replace(/ /g, "-").toLowerCase()}
      `}
      style={{
        gridRow: element.ypos,
        gridColumn: element.xpos,
      }}
      onClick={(e) => handleElementClick(element, e)}
    >
      <div
        className={`
      ${styles.elementBody}
      ${selectedElement && selectedElement.number === element.number ? styles.selected : ''}
 
      ${isGroupSelected && isGroupSelected(element.category) ? 'active' : ''}
      ${hoveredGroup === element.category.replace(/ /g, "-").toLowerCase() ? 'hovered' : ''}
      `}
      >

        <div className={styles.number}>{element.number}</div>
        <div className={styles.symbol}>{element.symbol}</div>
        <div>
          <div className={styles.name}>{element.name}</div>
          <div className={styles.mass}>{element.atomic_mass}</div>
        </div>
      </div>
    </div>
  );
}