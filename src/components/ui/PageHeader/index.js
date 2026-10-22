import Link from "next/link";
import styles from "./styles.module.scss";

export default function PageHeader({ title, subtitle, backHref, backLabel, children }) {
  return (
    <div className={styles.header}>
      {backHref && (
        <Link href={backHref} className={styles.back}>
          {backLabel || "← Back"}
        </Link>
      )}
      <h1 className={styles.title}>{title}</h1>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      {children}
    </div>
  );
}
