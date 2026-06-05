import React from "react";

/**
 * Lightweight page chrome that mirrors the Home page feel:
 * - Navy → blue gradient header
 * - Consistent padding + max-width container
 * - Optional right-aligned actions
 */
export default function PageShell({ title, subtitle, actions, children, className = "" }) {
  return (
    <div className={`page-shell ${className}`}>
      <div className="page-hero">
        <div>
          <span className="pill">SamayaHR</span>
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>

      <div className="mt-6 space-y-4">{children}</div>
    </div>
  );
}
