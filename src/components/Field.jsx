// ─────────────────────────────────────────────────────────────────
// FIELD — input reutilizável com label e nota
// ─────────────────────────────────────────────────────────────────

export function Field({ label, value, onChange, type = "text", placeholder = "", note = "" }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 10, color: "#64748b", marginBottom: 4,
        textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>
        {label}
      </div>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(type === "number" ? parseFloat(e.target.value) || 0 : e.target.value)}
        style={{ width: "100%", background: "#141e2e", border: "1px solid #1e3a5f",
          borderRadius: 7, padding: "9px 11px", color: "#e2e8f0", fontSize: 13,
          outline: "none", boxSizing: "border-box" }}
      />
      {note && <div style={{ fontSize: 9, color: "#334155", marginTop: 3 }}>{note}</div>}
    </div>
  );
}
