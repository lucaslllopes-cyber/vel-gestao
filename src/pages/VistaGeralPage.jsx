// ─────────────────────────────────────────────────────────────────
// VISTA GERAL PAGE — cards por quadra (espelho visual atual)
// ─────────────────────────────────────────────────────────────────
import { QUADRAS, SC } from "../data/constants";
import { m2 } from "../utils/format";

export function VistaGeralPage({ filt, byQ, sel, setSel, fq }) {
  return (
    <div style={{ flex: 1, overflow: "auto", padding: "14px 16px" }}>
      {QUADRAS.filter(x => fq === "Todas" || fq === x).map(x => {
        const lts = byQ[x];
        if (!lts || lts.length === 0) return null;
        const vx = lts.filter(l => l.status === "Vendido").length;

        return (
          <div key={x} style={{ marginBottom: 18 }}>
            {/* Cabeçalho da quadra */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
              <div style={{
                fontSize: 9, fontWeight: 800, letterSpacing: "2px", color: "#3b82f6",
                background: "#1e3a5f22", border: "1px solid #1e3a5f55",
                padding: "2px 8px", borderRadius: 4,
              }}>
                QUADRA {x}
              </div>
              <div style={{ fontSize: 9, color: "#334155" }}>{vx}/{lts.length}</div>
              <div style={{ flex: 1, height: 2, background: "#1e293b", borderRadius: 1 }}>
                <div style={{
                  height: "100%",
                  width: `${(vx / lts.length) * 100}%`,
                  background: "#16a34a",
                  transition: "width 0.4s",
                }} />
              </div>
            </div>

            {/* Cards dos lotes */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {lts.map(lot => {
                const s = SC[lot.status] || SC.Disponível;
                const isSel = sel?.id === lot.id;
                return (
                  <button
                    key={lot.id}
                    onClick={() => setSel(lot)}
                    style={{
                      width: 66, minHeight: 58, borderRadius: 7,
                      border: `2px solid ${isSel ? s.bg : "transparent"}`,
                      background: s.dim, cursor: "pointer",
                      padding: "4px 2px", display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center", gap: 1,
                      boxShadow: isSel ? `0 0 0 3px ${s.bg}40` : "none",
                      position: "relative", overflow: "hidden",
                    }}
                  >
                    <div style={{
                      position: "absolute", top: 0, left: 0, right: 0,
                      height: 3, background: s.bg, borderRadius: "7px 7px 0 0",
                    }} />
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#f1f5f9" }}>
                      {lot.n}
                    </div>
                    <div style={{ fontSize: 7, color: s.bg, fontWeight: 700, textTransform: "uppercase" }}>
                      {lot.status === "Disponível" ? "livre"
                        : lot.status === "Vendido" ? "vendido"
                        : "reservado"}
                    </div>
                    <div style={{ fontSize: 7, color: "#475569" }}>{m2(lot.area)}</div>
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
