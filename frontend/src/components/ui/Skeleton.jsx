import React from "react";

export default function Skeleton({ rows = 3, className = "" }) {
  return (
    <div className={`cs-skeleton ${className}`}>
      {Array.from({ length: rows }).map((_, index) => (
        <span key={index} style={{ width: `${92 - index * 12}%` }} />
      ))}
    </div>
  );
}
