import React, { useEffect } from "react";
import { X } from "lucide-react";

const ModernModal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md", // sm, md, lg, xl
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeStyles = {
    sm: { maxWidth: "400px" },
    md: { maxWidth: "700px", width: "95%" },
    lg: { maxWidth: "900px", width: "95%" },
    xl: { maxWidth: "1100px", width: "95%" },
  };

  return (
    <>
      {/* Backdrop - Modern with blur */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          zIndex: "1040",
          animation: "fadeIn 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />

      {/* Modal Container */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: "1050",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "var(--space-4)",
          pointerEvents: "none",
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            ...sizeStyles[size],
            width: "100%",
            background: "var(--bg-elevated)",
            borderRadius: "var(--radius-2xl)",
            boxShadow: "0 20px 60px -10px rgba(0, 0, 0, 0.3)",
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
            pointerEvents: "auto",
            animation: "slideUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
            border: "1px solid var(--border-color)",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "var(--space-6)",
              borderBottom: "1px solid var(--border-color)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "linear-gradient(135deg, rgba(14, 165, 233, 0.05) 0%, rgba(8, 145, 178, 0.05) 100%)",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "1.375rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                fontFamily: "var(--font-display)",
              }}
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "var(--radius-lg)",
                border: "none",
                background: "transparent",
                color: "var(--text-secondary)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all var(--transition-fast)",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--bg-secondary)";
                e.currentTarget.style.color = "var(--text-primary)";
                e.currentTarget.style.transform = "rotate(90deg)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--text-secondary)";
                e.currentTarget.style.transform = "rotate(0deg)";
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div
            style={{
              flex: 1,
              padding: "var(--space-6)",
              overflowY: "auto",
              color: "var(--text-primary)",
            }}
          >
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div
              style={{
                padding: "var(--space-6)",
                borderTop: "1px solid var(--border-color)",
                display: "flex",
                gap: "var(--space-3)",
                justifyContent: "flex-end",
                background: "linear-gradient(135deg, rgba(14, 165, 233, 0.02) 0%, rgba(8, 145, 178, 0.02) 100%)",
                flexShrink: 0,
              }}
            >
              {footer}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ModernModal;
