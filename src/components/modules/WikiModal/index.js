"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Modal } from "@/components/ui/Modal";
import { MdOpenInNew } from "react-icons/md";
import { IoChevronBack } from "react-icons/io5";
import styles from "./styles.module.scss";

// Client-side cache to avoid redundant requests within the same session
const articleCache = {};

async function fetchArticle(title) {
  const res = await fetch(`/api/wiki?title=${encodeURIComponent(title)}`);
  if (!res.ok) return null;
  return res.json();
}

function extractWikiTitle(href) {
  if (!href) return null;
  // Match /wiki/Article_Name
  const match = href.match(/\/wiki\/([^#?]+)/);
  if (match) return decodeURIComponent(match[1]);
  return null;
}

export default function WikiModal({ title, displayText, children, externalOpen, onExternalClose }) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalOpen !== undefined
    ? (v) => { if (!v && onExternalClose) onExternalClose(); else setInternalOpen(v); }
    : setInternalOpen;
  const [currentTitle, setCurrentTitle] = useState(title);
  const [history, setHistory] = useState([]);
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const iframeRef = useRef(null);

  // Reset to the prop title when the modal opens or the prop changes
  useEffect(() => {
    setCurrentTitle(title);
    setHistory([]);
  }, [title, open]);

  // Fetch article when currentTitle changes and modal is open
  useEffect(() => {
    if (!open || !currentTitle) return;

    if (articleCache[currentTitle]) {
      setArticle(articleCache[currentTitle]);
      return;
    }

    setLoading(true);
    setError(null);
    setArticle(null);
    fetchArticle(currentTitle)
      .then((data) => {
        if (data) {
          articleCache[currentTitle] = data;
          setArticle(data);
        } else {
          setError("Article not found");
        }
      })
      .catch(() => setError("Failed to load article"))
      .finally(() => setLoading(false));
  }, [open, currentTitle]);

  const navigateTo = useCallback((newTitle) => {
    setHistory((prev) => [...prev, currentTitle]);
    setCurrentTitle(newTitle);
  }, [currentTitle]);

  const goBack = useCallback(() => {
    setHistory((prev) => {
      const next = [...prev];
      const prevTitle = next.pop();
      if (prevTitle) setCurrentTitle(prevTitle);
      return next;
    });
  }, []);

  // Intercept link clicks inside the iframe
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !article) return;

    const handleLoad = () => {
      const doc = iframe.contentDocument;
      if (!doc) return;

      const handleClick = (e) => {
        const link = e.target.closest("a");
        if (!link) return;

        const href = link.getAttribute("href");
        if (!href) return;

        // Handle anchor links (scroll within page)
        if (href.startsWith("#")) {
          e.preventDefault();
          const target = doc.querySelector(href);
          if (target) target.scrollIntoView({ behavior: "smooth" });
          return;
        }

        // Handle internal wiki links
        const wikiTitle = extractWikiTitle(href);
        if (wikiTitle) {
          e.preventDefault();
          navigateTo(wikiTitle);
          return;
        }

        // External links — open in new tab
        e.preventDefault();
        const fullHref = href.startsWith("//") ? "https:" + href
          : href.startsWith("/") ? "https://en.wikipedia.org" + href
          : href;
        window.open(fullHref, "_blank", "noopener,noreferrer");
      };

      doc.addEventListener("click", handleClick);
    };

    iframe.addEventListener("load", handleLoad);
    // Also run immediately if already loaded
    if (iframe.contentDocument?.readyState === "complete") handleLoad();

    return () => iframe.removeEventListener("load", handleLoad);
  }, [article, navigateTo]);

  const wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(currentTitle)}`;
  const displayTitle = currentTitle?.replace(/_/g, " ");

  return (
    <>
      <span className={styles.trigger} onClick={() => setOpen(true)}>
        {children || displayText || title}
      </span>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={
          <>
            {history.length > 0 && (
              <button className={styles.backBtn} onClick={goBack} aria-label="Go back">
                <IoChevronBack size={14} />
              </button>
            )}
            {displayTitle} — <a href={wikiUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--clr-link)', fontWeight: 400 }}>Wikipedia <MdOpenInNew style={{ verticalAlign: 'middle' }} /></a>
          </>
        }
        bodyClassName={styles.noPadding}
      >
        {loading && (
          <div className={styles.loading}>
            <span className={styles.spinner} />
            Loading article...
          </div>
        )}

        {error && (
          <div className={styles.error}>{error}</div>
        )}

        {article && (
          <iframe
            ref={iframeRef}
            className={styles.wikiFrame}
            sandbox="allow-same-origin"
            srcDoc={`
              <!DOCTYPE html>
              <html>
              <head>
                <base href="https://en.wikipedia.org/" target="_blank">
                ${(article.cssLinks || []).map(href => `<link rel="stylesheet" href="${href}">`).join('\n')}
                <style>
                  body {
                    background: #1E1E22;
                    color: #d0d0d5;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                    font-size: 16px;
                    line-height: 1.65;
                    padding: 1rem;
                    margin: 0;
                  }
                  a { color: #7CC4FA; cursor: pointer; }
                  a:visited { color: #9B8EC4; }
                  h1, h2, h3, h4, h5 { color: #EDEDEF; border-color: rgba(255,255,255,0.08); }

                  table { border-color: rgba(255,255,255,0.08) !important; }
                  table, th, td { border-color: rgba(255,255,255,0.08) !important; color: #d0d0d5; }
                  th { background: rgba(255,255,255,0.06) !important; color: #EDEDEF; }
                  td { background: transparent !important; }
                  tr:nth-child(even) td { background: rgba(255,255,255,0.02) !important; }
                  caption { color: #EDEDEF; }

                  .infobox, .sidebar {
                    background: #161619 !important;
                    border: 1px solid rgba(255,255,255,0.08) !important;
                    color: #d0d0d5;
                  }
                  .infobox *, .sidebar * { color: #d0d0d5 !important; border-color: rgba(255,255,255,0.06) !important; }
                  .infobox a, .sidebar a { color: #7CC4FA !important; }
                  .infobox th, .sidebar th { background: rgba(255,255,255,0.04) !important; color: #EDEDEF !important; }
                  .infobox td, .sidebar td { background: transparent !important; }
                  .infobox caption, .sidebar caption { color: #EDEDEF !important; }

                  img { max-width: 100%; height: auto; }
                  .thumbinner { background: transparent !important; border-color: rgba(255,255,255,0.06) !important; }
                  .thumbcaption { color: #9A9AA0 !important; }

                  div[style*="background"], span[style*="background"], td[style*="background"] {
                    background-color: rgba(255,255,255,0.04) !important;
                  }

                  .hatnote, .dablink, .rellink, .dmbox, .tmbox, .mbox-small,
                  [role="note"], .plainlinks.hlist.navbar,
                  .mw-editsection, .reflist, .refbegin, .navbox, .navbox-container,
                  .sistersitebox, .noprint, .mw-empty-elt, .metadata, .ambox, .portal,
                  .authority-control, .catlinks, .mw-jump-link, .shortdescription,
                  [role="navigation"] { display: none !important; }

                  .mw-body-content { max-width: 100%; }
                </style>
              </head>
              <body class="mw-body-content">
                ${article.html}
              </body>
              </html>
            `}
          />
        )}

      </Modal>
    </>
  );
}
