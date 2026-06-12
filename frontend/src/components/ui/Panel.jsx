import React from "react";

export default function Panel({ title, subtitle, action, children, className = "" }) {
  return (
    <section className={`cs-panel ${className}`}>
      {(title || subtitle || action) && (
        <header className="cs-panel-head">
          <div>
            {title && <h2>{title}</h2>}
            {subtitle && <p>{subtitle}</p>}
          </div>
          {action && <div className="cs-panel-action">{action}</div>}
        </header>
      )}
      <div className="cs-panel-body">{children}</div>
    </section>
  );
}
