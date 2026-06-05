import React from "react";

export default function StatCard({ label, value, helper, icon, tone = "primary" }) {
  const toneMap = {
    primary: ["#000080", "#2563eb10", "#00008020"],
    success: ["#15803d", "#ecfdf3", "#22c55e33"],
    warn: ["#c2410c", "#fff7ed", "#fb923c33"],
    info: ["#0ea5e9", "#e0f2fe", "#0ea5e933"],
  };
  const [text, bg, border] = toneMap[tone] || toneMap.primary;

  return (
    <div
      className="glass-card p-4 flex items-start gap-3"
      style={{ borderColor: border, backgroundColor: bg }}
    >
      {icon && (
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "#fff", color: text, boxShadow: "0 8px 24px -16px rgba(0,0,0,.25)" }}
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
