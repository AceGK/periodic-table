import styles from "./styles.module.scss";

export default function Section({ title, children, className }) {
  return (
    <section className={`${styles.section} ${className || ""}`}>
      {title && <h2 className={styles.title}>{title}</h2>}
      <div className={styles.content}>{children}</div>
    </section>
  );
}
