import React from "react";

export default function StatCard({ label, value, helper, icon, tone = "primary" }) {
  const toneMap = {
    primary: ["#315EFB", "#f8fbff", "#8B5CF633"],
    success: ["#0F9F8F", "#f5fffd", "#0891B233"],
    warn: ["#B7791F", "#fffaf0", "#f6b94b55"],
    info: ["#6D5DFC", "#f7f6ff", "#6d5dfc33"],
  };
  const [text, bg, border] = toneMap[tone] || toneMap.primary;

  return (
    <div
      className="glass-card p-4 flex items-start gap-3"
      style={{ borderColor: border, backgroundColor: bg, minHeight: 108 }}
    >
      {icon && (
        <div
          className="w-10 h-10 flex items-center justify-center"
          style={{
            background: "#fff",
            color: text,
            borderRadius: 10,
            boxShadow: "0 12px 28px -18px rgba(16,24,40,.45)",
            border: "1px solid rgba(16,24,40,.06)",
          }}
        >
          {icon}
        </div>
      )}
      <div className="flex-1">
        <p className="subtle-label">{label}</p>
        <p className="text-2xl font-extrabold text-slate-900 leading-tight">{value}</p>
        {helper && <p className="text-sm text-slate-500 mt-1">{helper}</p>}
      </div>
    </div>
  );
}
