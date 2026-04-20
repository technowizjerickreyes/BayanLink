import { useEffect, useRef } from "react";
import Icon from "./Icon.jsx";

const sizeClass = {
  sm: "",
  md: "",
  lg: "wide",
  xl: "wide",
  "2xl": "wide",
};

export default function Modal({
  isOpen,
  onClose,
  title = "",
  children,
  footer = null,
  size = "md",
  className = "",
}) {
  const backdropRef = useRef(null);

  // ESC to close
  useEffect(() => {
    if (!isOpen) return;
    const handle = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [isOpen, onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={backdropRef}
      className="modal-backdrop"
      onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}
      role="presentation"
    >
      <section
        aria-modal="true"
        className={`modal ${sizeClass[size] || ""} ${className}`.trim()}
        role="dialog"
        aria-labelledby={title ? "modal-title" : undefined}
      >
        {title && (
          <>
            <h2 id="modal-title">{title}</h2>
            <button
              aria-label="Close"
              className="icon-button modal-close"
              onClick={onClose}
              type="button"
            >
              <Icon name="close" />
            </button>
          </>
        )}
        {!title && (
          <button
            aria-label="Close"
            className="icon-button modal-close"
            onClick={onClose}
            type="button"
          >
            <Icon name="close" />
          </button>
        )}
        <div>{children}</div>
        {footer && <div className="modal-actions">{footer}</div>}
      </section>
    </div>
  );
}
