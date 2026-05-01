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
        style={{ width: "100%", background: "#f8fafc", border: "1px solid var(--border-color)",
          borderRadius: 8, padding: "11px 13px", color: "var(--text-primary)", fontSize: 14,
          outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
      />
      {note && <div style={{ fontSize: 10, color: "var(--text-secondary)", marginTop: 4 }}>{note}</div>}

    </div>
  );
}
