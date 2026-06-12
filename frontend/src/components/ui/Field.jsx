import React from "react";

export default function Field({ label, hint, error, children, className = "" }) {
  return (
    <label className={`cs-field ${className}`}>
      {label && <span className="cs-field-label">{label}</span>}
      {children}
      {hint && !error && <span className="cs-field-hint">{hint}</span>}
      {error && <span className="cs-field-error">{error}</span>}
    </label>
  );
}
