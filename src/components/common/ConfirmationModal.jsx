import React from "react";
import { AlertCircle } from "lucide-react";
import ModernModal from "./ModernModal";
import Button from "./Button";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Konfirmasi",
  message,
  confirmText = "Ya, Lanjutkan",
  cancelText = "Batal",
  variant = "warning", // warning, danger, info
  isLoading = false,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          icon: <AlertCircle size={24} style={{ color: "var(--error-text)" }} />,
          titleColor: "var(--error-text)",
          confirmButton: "danger",
        };
      case "warning":
        return {
          icon: <AlertCircle size={24} style={{ color: "var(--warning-text)" }} />,
          titleColor: "var(--warning-text)",
          confirmButton: "danger",
        };
      default:
        return {
          icon: <AlertCircle size={24} style={{ color: "var(--info-text)" }} />,
          titleColor: "var(--info-text)",
          confirmButton: "primary",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <ModernModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button variant={styles.confirmButton} onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Memproses..." : confirmText}
          </Button>
        </>
      }
    >
      <div style={{ display: "flex", gap: "var(--space-4)" }}>
        <div style={{ fontSize: "1.5rem", flexShrink: 0 }}>{styles.icon}</div>
        <div>
          <p style={{ margin: 0, fontSize: "0.95rem", lineHeight: "1.6" }}>{message}</p>
        </div>
      </div>
    </ModernModal>
  );
};

export default ConfirmationModal;
