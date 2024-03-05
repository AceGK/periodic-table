import { useState } from 'react';
import styles from './Tabs.module.scss';

export default function Tabs({ children }) {
  const [activeTab, setActiveTab] = useState(children[0].props.label);

  const handleClick = (e, newActiveTab) => {
    e.preventDefault();
    setActiveTab(newActiveTab);
  };

  // Determine if the first tab is selected
  const isFirstTabSelected = activeTab === children[0].props.label;

  // Apply conditional style for the tabContent
  const tabContentStyle = isFirstTabSelected
    ? { borderTopLeftRadius: '0px' }
    : {};


  return (
    <div className={styles.tabs}>
      <ul className={styles.tabHeaders}>
        {children.map((tab) => (
          <li
            key={tab.props.label}
            className={tab.props.label === activeTab ? styles.active : ''}
            onClick={(e) => handleClick(e, tab.props.label)}
          >
            {tab.props.label}
          </li>
        ))}
      </ul>
      <div
        className={styles.tabContent}
        style={tabContentStyle}
      >
        {children.map((content) => {
          if (content.props.label !== activeTab) return undefined;
          return content.props.children;
        })}
      </div>
    </div>
  );
};
