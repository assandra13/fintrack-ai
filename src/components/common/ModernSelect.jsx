import React, { useState, useRef, useEffect } from "react";
import { Check, ChevronDown } from "lucide-react";

const ModernSelect = ({ label, value, onChange, options = [], placeholder = "Select...", error, required }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value);
  const filteredOptions = options.filter((opt) => opt.label.toLowerCase().includes(searchTerm.toLowerCase()));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange({ target: { value: optionValue } });
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div style={label ? { marginBottom: "var(--space-4)" } : {}}>
      {label && (
        <label
          style={{
            display: "block",
            marginBottom: "var(--space-2)",
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "var(--text-primary)",
          }}
        >
          {label}
          {required && <span style={{ color: "var(--error-solid)" }}> *</span>}
        </label>
      )}

      <div ref={dropdownRef} style={{ position: "relative" }}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            width: "100%",
            height: "44px",
            padding: "var(--space-3) var(--space-4)",
            background: "var(--bg-primary)",
            border: `1px solid ${error ? "var(--error-solid)" : "var(--border-color)"}`,
            borderRadius: "var(--radius-md)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
            transition: "all var(--transition-fast)",
            fontSize: "0.875rem",
            color: selectedOption ? "var(--text-primary)" : "var(--text-tertiary)",
          }}
        >
          <span>{selectedOption ? selectedOption.label : placeholder}</span>
          <ChevronDown
            size={16}
            style={{
              transition: "transform var(--transition-fast)",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </button>

        {isOpen && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 4px)",
              left: 0,
              right: 0,
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-md)",
              boxShadow: "var(--shadow-lg)",
              zIndex: 1000,
              maxHeight: "300px",
              overflow: "hidden",
              animation: "slideDown 0.2s ease-out",
            }}
          >
            {/* Search Input */}
            {options.length > 5 && (
              <div style={{ padding: "var(--space-2)" }}>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "var(--space-2)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.875rem",
                    outline: "none",
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}

            {/* Options List */}
            <div
              style={{
                maxHeight: "250px",
                overflowY: "auto",
                padding: "var(--space-1)",
              }}
            >
              {filteredOptions.length === 0 ? (
                <div
                  style={{
                    padding: "var(--space-4)",
                    textAlign: "center",
                    color: "var(--text-tertiary)",
                    fontSize: "0.875rem",
                  }}
                >
                  No options found
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    style={{
                      width: "100%",
                      padding: "var(--space-2) var(--space-3)",
                      background: value === option.value ? "var(--bg-secondary)" : "transparent",
                      border: "none",
                      borderRadius: "var(--radius-sm)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      transition: "background var(--transition-fast)",
                      fontSize: "0.875rem",
                      color: "var(--text-primary)",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) => {
                      if (value !== option.value) {
                        e.currentTarget.style.background = "var(--bg-secondary)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (value !== option.value) {
                        e.currentTarget.style.background = "transparent";
                      }
                    }}
                  >
                    <span>{option.label}</span>
                    {value === option.value && <Check size={16} style={{ color: "var(--primary-600)" }} />}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p
          style={{
            marginTop: "var(--space-1)",
            fontSize: "0.75rem",
            color: "var(--error-solid)",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default ModernSelect;
