import Link from "next/link";
import Image from "next/image";
import styles from "./styles.module.scss";

export default function Card({
  href,
  title,
  description,
  meta,
  icon,
  image,
  imageAlt,
  accent,
  onClick,
  className,
  children,
}) {
  const content = (
    <>
      {image && (
        <div className={styles.imageWrap}>
          <Image src={image} alt={imageAlt || title || ""} fill style={{ objectFit: "cover" }} />
        </div>
      )}
      <div className={styles.body}>
        <div className={styles.header}>
          {icon && <span className={styles.icon} style={accent ? { color: accent } : undefined}>{icon}</span>}
          <div className={styles.text}>
            {title && <span className={styles.title}>{title}</span>}
            {description && <span className={styles.description}>{description}</span>}
          </div>
        </div>
        {meta && <span className={styles.meta}>{meta}</span>}
        {children}
      </div>
      {accent && <span className={styles.accentBar} style={{ background: accent }} />}
    </>
  );

  const classNames = `${styles.card} ${image ? styles.hasImage : ""} ${className || ""}`;

  if (href) {
    return <Link href={href} className={classNames}>{content}</Link>;
  }

  return (
    <div className={classNames} onClick={onClick} role={onClick ? "button" : undefined} tabIndex={onClick ? 0 : undefined}>
      {content}
    </div>
  );
}
