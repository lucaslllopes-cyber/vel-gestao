// ─────────────────────────────────────────────────────────────────
// LISTA PAGE — visualização em tabela
// ─────────────────────────────────────────────────────────────────
import { SC } from "../data/constants";
import { brl0, m2 } from "../utils/format";

export function ListaPage({ filt, isAdmin, sel, setSel, onEditar }) {
  return (
    <div style={{ flex: 1, overflow: "auto", padding: "14px 16px" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr style={{ background: "#0d1220" }}>
            {["Lote", "Q", "Área", ...(isAdmin ? ["Valor"] : []), "Status", "Comprador", ""].map(h => (
              <th key={h} style={{
                padding: "8px 10px", textAlign: "left", color: "#334155",
                fontWeight: 700, fontSize: 9, textTransform: "uppercase",
                letterSpacing: "0.5px", borderBottom: "1px solid #1e293b",
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
            return (
              <tr
                key={lot.id}
                onClick={() => setSel(lot)}
                style={{
                  background: i % 2 === 0 ? "#060a0e" : "#090e16",
                  cursor: "pointer", borderBottom: "1px solid #1e293b",
                }}
              >
                <td style={{ padding: "8px 10px", fontWeight: 700, color: "#60a5fa" }}>{lot.id}</td>
                <td style={{ padding: "8px 10px", color: "#64748b" }}>{lot.q}</td>
                <td style={{ padding: "8px 10px", color: "#64748b" }}>
                  {mostrarDetalhes ? m2(lot.area) : "—"}
                </td>
                {isAdmin && (
                  <td style={{ padding: "8px 10px", fontWeight: 600, color: "#f1f5f9" }}>
                    {brl0(lot.valor)}
                  </td>
                )}
                <td style={{ padding: "8px 10px" }}>
                  <span style={{
                    background: s.bg + "22", color: s.bg,
                    padding: "2px 7px", borderRadius: 4, fontSize: 10, fontWeight: 700,
                  }}>
                    {lot.status}
                  </span>
                </td>
                <td style={{
                  padding: "8px 10px", color: "#64748b",
                  maxWidth: 160, overflow: "hidden",
                  textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {mostrarDetalhes
                    ? (lot.comprador || "—")
                    : <span style={{ color: "#334155", fontSize: 10, fontStyle: "italic" }}>indisponível</span>
                  }
                </td>
                <td style={{ padding: "8px 10px" }}>
                  {isAdmin && (
                    <button
                      onClick={e => { e.stopPropagation(); onEditar(lot); }}
                      style={{
                        background: "#1e3a5f", border: "none", color: "#60a5fa",
                        padding: "2px 8px", borderRadius: 4,
                        cursor: "pointer", fontSize: 10, fontWeight: 600,
                      }}
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
