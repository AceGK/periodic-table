import styles from './Element.module.scss';

export default function Element({ element, handleElementClick, isGroupSelected, selectedElement }) {
  return (
    <div
      key={element.number}
      className={styles.element}
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
      ${element.category.replace(/ /g, "-").toLowerCase()}
      ${isGroupSelected && isGroupSelected(element.category) ? 'active' : ''}
      `}
      >
        <div className={styles.numbers}>
          <small className={styles.number}>{element.number}</small>
          <small className={styles.mass}>{element.atomic_mass.toFixed(2)}</small>
        </div>

        <strong className={styles.symbol}>{element.symbol}</strong>
        <small className={styles.name}>{element.name}</small>
      </div>
    </div>
  );
}