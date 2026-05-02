// ─────────────────────────────────────────────────────────────────
// LISTA PAGE — visualização em tabela
// ─────────────────────────────────────────────────────────────────
import { SC } from "../data/constants";
import { brl0, m2 } from "../utils/format";

export function ListaPage({ filt, isAdmin, sel, setSel, onEditar }) {
  return (
    <div className="page-container" style={{ flex: 1, overflow: "auto", padding: "24px" }}>
      <div className="premium-card" style={{ overflow: "hidden", background: "transparent", boxShadow: "none", border: "none" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#F8FAFC", borderBottom: "1px solid var(--border-color)" }}>
              {["Lote", "Q", "Área", ...(isAdmin ? ["Valor"] : []), "Status", "Comprador", ""].map(h => (
                <th key={h} style={{
                  padding: "16px 20px", textAlign: "left", color: "var(--text-secondary)",
                  fontWeight: 700, fontSize: 10, textTransform: "uppercase",
                  letterSpacing: "1px"
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filt.map((lot, i) => {
              const s = SC[lot.status] || SC.Disponível;
              const isVendido = lot.status === "Vendido";
              const mostrarDetalhes = isAdmin || !isVendido;
              const isSel = sel?.id === lot.id;

              return (
                <tr
                  key={lot.id}
                  onClick={() => setSel(lot)}
                  style={{
                    background: isSel ? "#F1F5F9" : (i % 2 === 0 ? "#FFFFFF" : "#FDFDFD"),
                    cursor: "pointer", borderBottom: "1px solid var(--border-color)",
                    transition: "background 0.2s"
                  }}
                >
                  <td data-label="Lote" style={{ padding: "14px 20px", fontWeight: 800, color: "var(--navy-primary)" }}>{lot.id}</td>
                  <td data-label="Quadra" style={{ padding: "14px 20px", color: "var(--text-secondary)", fontWeight: 500 }}>{lot.q}</td>
                  <td data-label="Área" style={{ padding: "14px 20px", color: "var(--text-primary)", fontWeight: 500 }}>
                    {mostrarDetalhes ? m2(lot.area) : "—"}
                  </td>
                  {isAdmin && (
                    <td data-label="Valor" style={{ padding: "14px 20px", fontWeight: 700, color: "var(--text-primary)" }}>
                      {brl0(lot.valor)}
                    </td>
                  )}
                  <td data-label="Status" style={{ padding: "14px 20px" }}>
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      background: s.bg + "15", color: s.bg,
                      padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                    }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: s.bg }} />
                      {lot.status}
                    </div>
                  </td>
                  <td data-label="Comprador" style={{
                    padding: "14px 20px", color: "var(--text-secondary)",
                    maxWidth: 160, overflow: "hidden",
                    textOverflow: "ellipsis", whiteSpace: "nowrap",
                    fontSize: 12, fontWeight: 500
                  }}>
                    {mostrarDetalhes
                      ? (lot.comprador || "—")
                      : <span style={{ opacity: 0.4, fontStyle: "italic" }}>Indisponível</span>
                    }
                  </td>
                  <td style={{ padding: "14px 20px", textAlign: "right" }}>
                    {isAdmin && (
                      <button
                        onClick={e => { e.stopPropagation(); onEditar(lot); }}
                        className="btn-outline-gold"
                        style={{ padding: "4px 12px", fontSize: 10 }}
                      >
                        Editar
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>

  );
}
