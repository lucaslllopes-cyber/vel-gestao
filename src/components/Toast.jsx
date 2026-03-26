// ─────────────────────────────────────────────────────────────────
// TOAST — notificação temporária de ação
// ─────────────────────────────────────────────────────────────────

export function Toast({ toast }) {
  if (!toast) return null;
  const isErr = toast.type === "err";
  return (
    <div style={{
      position: "fixed", top: 12, right: 12, zIndex: 999,
      background: isErr ? "#2e0a0a" : "#0a1f10",
      border: `1px solid ${isErr ? "#dc2626" : "#16a34a"}55`,
      borderRadius: 10, padding: "11px 16px",
      color: isErr ? "#f87171" : "#86efac",
      fontWeight: 600, fontSize: 13,
      boxShadow: "0 8px 32px #0009", maxWidth: 320,
    }}>
      {isErr ? "❌" : "✅"} {toast.msg}
    </div>
  );
}
