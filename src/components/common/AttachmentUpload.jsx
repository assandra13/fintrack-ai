import React from "react";
import { X, Upload } from "lucide-react";

const AttachmentUpload = ({ attachment, onAttachmentChange, onRemove }) => {
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File terlalu besar! Maksimal 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        onAttachmentChange({
          fileName: file.name,
          base64Data: event.target?.result,
          uploadedAt: new Date().toISOString(),
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.style.borderColor = "var(--primary-500)";
    e.currentTarget.style.backgroundColor = "var(--primary-100)";
  };

  const handleDragLeave = (e) => {
    e.currentTarget.style.borderColor = "var(--primary-300)";
    e.currentTarget.style.backgroundColor = "var(--primary-50)";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onAttachmentChange({
          fileName: file.name,
          base64Data: event.target?.result,
          uploadedAt: new Date().toISOString(),
        });
      };
      reader.readAsDataURL(file);
    } else {
      alert("Hanya file gambar yang didukung!");
    }
    e.currentTarget.style.borderColor = "var(--primary-300)";
    e.currentTarget.style.backgroundColor = "var(--primary-50)";
  };

  if (attachment) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        <div
          style={{
            position: "relative",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
            border: "1px solid var(--border-color)",
            backgroundColor: "var(--bg-secondary)",
          }}
        >
          <img src={attachment.base64Data} alt="Preview" style={{ width: "100%", height: "auto", maxHeight: "300px", objectFit: "cover", display: "block" }} />
          <button
            onClick={() => onRemove()}
            style={{
              position: "absolute",
              top: "var(--space-2)",
              right: "var(--space-2)",
              background: "rgba(0,0,0,0.6)",
              color: "white",
              border: "none",
              borderRadius: "var(--radius-md)",
              padding: "var(--space-2)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all var(--transition-fast)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.8)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.6)")}
          >
            <X size={18} />
          </button>
        </div>
        <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
          <span style={{ fontWeight: 500 }}>📁 {attachment.fileName}</span>
        </div>
        <button
          onClick={() => {
            document.getElementById("attachment-input")?.click();
          }}
          type="button"
          style={{
            padding: "var(--space-2) var(--space-3)",
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-md)",
            cursor: "pointer",
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "var(--text-primary)",
            fontFamily: "inherit",
            transition: "all var(--transition-fast)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-tertiary)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--bg-secondary)")}
        >
          Ganti Foto
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        border: "2px dashed var(--primary-300)",
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-6)",
        textAlign: "center",
        cursor: "pointer",
        transition: "all var(--transition-fast)",
        backgroundColor: "var(--primary-50)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--primary-500)";
        e.currentTarget.style.backgroundColor = "var(--primary-100)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--primary-300)";
        e.currentTarget.style.backgroundColor = "var(--primary-50)";
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input type="file" accept="image/*" onChange={handleFileSelect} style={{ display: "none" }} id="attachment-input" />
      <label htmlFor="attachment-input" style={{ cursor: "pointer", display: "block", marginBottom: 0 }}>
        <div style={{ fontSize: "1rem", fontWeight: 500, marginBottom: "var(--space-2)", color: "var(--text-primary)" }}>
          <Upload style={{ display: "inline-block", marginRight: "var(--space-1)" }} size={20} />
          Klik atau drag & drop foto
        </div>
        <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Maksimal 5MB - JPG, PNG, GIF</div>
      </label>
    </div>
  );
};

export default AttachmentUpload;
