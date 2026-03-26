// ─────────────────────────────────────────────────────────────────
// ALERTAS PAGE — notificações (admin only)
// ─────────────────────────────────────────────────────────────────

export function AlertasPage({ notifs, unread, onMarcarLidas }) {
  return (
    <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9" }}>
          Notificações{" "}
          {unread > 0 && (
            <span style={{
              background: "#dc2626", color: "#fff",
              fontSize: 10, padding: "1px 6px", borderRadius: 10, marginLeft: 6,
            }}>
              {unread}
            </span>
          )}
        </div>
        {unread > 0 && (
          <button onClick={onMarcarLidas} style={{
            background: "#1e293b", border: "none", color: "#64748b",
            padding: "4px 10px", borderRadius: 5, cursor: "pointer", fontSize: 11,
          }}>
            Marcar lidas
          </button>
        )}
      </div>

      {notifs.length === 0 ? (
        <div style={{ color: "#334155", textAlign: "center", marginTop: 40 }}>
          Nenhuma notificação.
        </div>
      ) : (
        notifs.map(n => (
          <div key={n.id} style={{
            background: n.lida ? "#060a0e" : "#0c1520",
            border: `1px solid ${n.lida ? "#1e293b" : "#1e3a5f"}`,
            borderRadius: 7, padding: "9px 12px", marginBottom: 7,
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <div>
              <div style={{ fontSize: 12, color: n.lida ? "#475569" : "#e2e8f0", fontWeight: n.lida ? 400 : 600 }}>
                {n.msg}
              </div>
              <div style={{ fontSize: 9, color: "#334155", marginTop: 2 }}>{n.em}</div>
            </div>
            {!n.lida && (
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#3b82f6", flexShrink: 0 }} />
            )}
          </div>
        ))
      )}
    </div>
  );
}
