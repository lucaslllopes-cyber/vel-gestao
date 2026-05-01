// ─────────────────────────────────────────────────────────────────
// VISTA GERAL PAGE — cards por quadra (espelho visual atual)
// ─────────────────────────────────────────────────────────────────
import { QUADRAS, SC } from "../data/constants";
import { m2 } from "../utils/format";

export function VistaGeralPage({ filt, byQ, sel, setSel, fq }) {
  return (
    <div style={{ flex: 1, overflow: "auto", padding: "20px 24px" }}>
      {QUADRAS.filter(x => fq === "Todas" || fq === x).map(x => {
        const lts = byQ[x];
        if (!lts || lts.length === 0) return null;
        const vx = lts.filter(l => l.status === "Vendido").length;

        return (
          <div key={x} style={{ marginBottom: 28 }}>
            {/* Cabeçalho da quadra */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{
                fontSize: 10, fontWeight: 800, letterSpacing: "1px", color: "var(--navy-primary)",
                background: "#f1f5f9", border: "1px solid var(--border-color)",
                padding: "4px 12px", borderRadius: 6,
              }}>
                QUADRA {x}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 600 }}>{vx} de {lts.length} vendidos</div>
              <div style={{ flex: 1, height: 4, background: "#f1f5f9", borderRadius: 2, overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${(vx / lts.length) * 100}%`,
                  background: "var(--navy-primary)",
                  transition: "width 0.4s",
                }} />
              </div>
            </div>

            {/* Cards dos lotes */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {lts.map(lot => {
                const s = SC[lot.status] || SC.Disponível;
                const isSel = sel?.id === lot.id;
                return (
                  <button
                    key={lot.id}
                    onClick={() => setSel(lot)}
                    className="premium-card"
                    style={{
                      width: 72, height: 68,
                      border: isSel ? `2px solid ${s.bg}` : `1px solid var(--border-color)`,
                      background: isSel ? "#f8fafc" : "white", cursor: "pointer",
                      padding: "8px 4px", display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center", gap: 2,
                      boxShadow: isSel ? `0 0 0 3px ${s.bg}20` : "var(--shadow-sm)",
                      position: "relative", overflow: "hidden",
                    }}
                  >
                    <div style={{
                      position: "absolute", top: 0, left: 0, right: 0,
                      height: 4, background: s.bg,
                    }} />
                    <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)" }}>
                      {lot.n}
                    </div>
                    <div style={{ fontSize: 8, color: s.bg, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      {lot.status}
                    </div>
                    <div style={{ fontSize: 9, color: "var(--text-secondary)", fontWeight: 500 }}>{m2(lot.area)}</div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>

  );
}
