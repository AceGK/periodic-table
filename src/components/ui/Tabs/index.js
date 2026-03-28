import { useState, createContext, useContext } from "react";
import styles from "./styles.module.scss";

const TabsContext = createContext();

export function Tabs({ defaultValue, children, className }) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={`${styles.tabs} ${className || ""}`}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className }) {
  return (
    <div className={`${styles.tabsList} ${className || ""}`} role="tablist">
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children, className }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const isActive = activeTab === value;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      className={`${styles.tabsTrigger} ${isActive ? styles.active : ""} ${className || ""}`}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className }) {
  const { activeTab } = useContext(TabsContext);

  if (activeTab !== value) return null;

  return (
    <div role="tabpanel" className={`${styles.tabsContent} ${className || ""}`}>
      {children}
    </div>
  );
}
