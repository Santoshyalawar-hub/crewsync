import React from "react";
import { SearchX } from "lucide-react";

export default function EmptyState({ icon, title = "No results", message, action }) {
  return (
    <div className="cs-empty-state">
      <div className="cs-empty-icon">{icon || <SearchX size={24} />}</div>
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {action && <div className="cs-empty-action">{action}</div>}
    </div>
  );
}
