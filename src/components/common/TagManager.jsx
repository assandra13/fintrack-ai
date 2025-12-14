import React, { useState } from "react";
import { X, Plus } from "lucide-react";
import Input from "./Input";
import Button from "./Button";

const TagManager = ({ tags = [], onTagsChange, placeholder = "Tambah tag baru" }) => {
  const [inputValue, setInputValue] = useState("");

  const handleAddTag = () => {
    if (inputValue.trim() && !tags.includes(inputValue.trim())) {
      onTagsChange([...tags, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    onTagsChange(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
      <div style={{ display: "flex", gap: "var(--space-2)" }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          style={{
            flex: 1,
            padding: "var(--space-2) var(--space-3)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-md)",
            fontSize: "0.875rem",
            fontFamily: "inherit",
            transition: "all var(--transition-fast)",
            color: "var(--text-primary)",
            backgroundColor: "var(--bg-secondary)",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--primary-500)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
        />
        <Button onClick={handleAddTag} size="sm">
          <Plus size={16} />
          Tambah
        </Button>
      </div>

      {tags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
          {tags.map((tag) => (
            <div
              key={tag}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
                background: "var(--primary-100)",
                color: "var(--primary-700)",
                padding: "var(--space-1) var(--space-2)",
                borderRadius: "var(--radius-md)",
                fontSize: "0.875rem",
                fontWeight: 500,
              }}
            >
              <span>🏷️ {tag}</span>
              <button
                onClick={() => handleRemoveTag(tag)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                  color: "var(--primary-700)",
                  transition: "all var(--transition-fast)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--error-solid)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--primary-700)")}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagManager;
