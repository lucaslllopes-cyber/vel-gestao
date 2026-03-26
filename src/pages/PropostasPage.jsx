// ─────────────────────────────────────────────────────────────────
// PROPOSTAS PAGE
// ─────────────────────────────────────────────────────────────────
import { brl, brl0 } from "../utils/format";

export function PropostasPage({ propostas, isAdmin, onAprovar, onRecusar, onPedirAjuste }) {
  return (
    <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", marginBottom: 12 }}>
        {isAdmin ? "Todas as Propostas" : "Minhas Propostas"}
      </div>

      {propostas.length === 0 ? (
        <div style={{ color: "#334155", textAlign: "center", marginTop: 40, fontSize: 13 }}>
          Nenhuma proposta ainda.
        </div>
      ) : (
        propostas.map(p => {
          const sc = p.status === "Aprovada" ? "#16a34a"
            : p.status === "Recusada" ? "#dc2626"
            : p.status === "AjusteSolicitado" ? "#f97316"
            : "#d97706"; // Pendente
          const s = p.sim;
          const r = p.result;
          return (
            <div key={p.id} style={{
              background: "#090e16", border: "1px solid #1e293b",
              borderRadius: 10, padding: 14, marginBottom: 10,
            }}>
              {/* Cabeçalho */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 10 }}>
                <div>
                  <span style={{ fontWeight: 800, color: "#60a5fa", fontSize: 14 }}>Lote {p.loteId}</span>
                  <span style={{ fontSize: 10, color: "#475569", marginLeft: 8 }}>{p.em}</span>
                  {isAdmin && <span style={{ fontSize: 10, color: "#64748b", marginLeft: 8 }}>— {p.corretor}</span>}
                </div>
                <span style={{
                  background: sc + "22", color: sc,
                  padding: "2px 9px", borderRadius: 4, fontSize: 10, fontWeight: 700,
                }}>
                  {p.status}
                </span>
              </div>

              {/* Campos */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 7, marginBottom: 10 }}>
                {[
                  { l: "Cliente",    v: p.nome },
                  { l: "Telefone",   v: p.telefone },
                  { l: "E-mail",     v: p.email || "—" },
                  { l: "Tabela",     v: `${s.tabela} · ${p.taxa_am}%a.m.` },
                  { l: "Entrada",    v: `${s.entrada_pct}% = ${brl(r.entrada)}` },
                  { l: "Prazo",      v: `${s.n} parcelas` },
                  ...(s.com_anuais ? [{ l: "Anuais", v: `${s.anuais_qtd}× ${brl(s.anuais_val)}` }] : []),
                  { l: "Total s/IPCA", v: brl(r.total) },
                ].map(({ l, v }) => (
                  <div key={l}>
                    <div style={{ fontSize: 9, color: "#334155", textTransform: "uppercase", letterSpacing: "0.4px" }}>{l}</div>
                    <div style={{ fontSize: 11, color: "#e2e8f0", fontWeight: 600, marginTop: 2 }}>{v}</div>
                  </div>
                ))}
              </div>

              {/* Progressão SACOC */}
              {s.tabela === "SACOC" && r.sacoc?.tabela && (
                <div style={{ background: "#141e2e", borderRadius: 7, padding: "8px 10px", marginBottom: 10 }}>
                  <div style={{ fontSize: 9, color: "#475569", marginBottom: 5, fontWeight: 600,
                    textTransform: "uppercase", letterSpacing: "0.4px" }}>
                    Progressão SACOC (sem IPCA)
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 14px" }}>
                    {r.sacoc.tabela.map(row => (
                      <span key={row.ano} style={{ fontSize: 10, color: "#94a3b8" }}>
                        <b style={{ color: "#60a5fa" }}>{row.ano}º</b> {brl(row.parcela)}
                        <span style={{ color: "#334155" }}> +IPCA</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Parcela Price */}
              {s.tabela === "PRICE" && r.price && (
                <div style={{ background: "#141e2e", borderRadius: 7, padding: "7px 10px", marginBottom: 10, fontSize: 11, color: "#94a3b8" }}>
                  Parcela Price: <b style={{ color: "#22d3ee" }}>{brl(r.price.parcela)}/mês</b>{" "}
                  {r.price.sem_juros ? "(sem juros)" : `(${p.taxa_am}% a.m.)`} + IPCA
                </div>
              )}

              {/* Observações */}
              {p.obs && (
                <div style={{ fontSize: 11, color: "#64748b", background: "#141e2e",
                  padding: "6px 9px", borderRadius: 5, marginTop: 8 }}>
                  📝 {p.obs}
                </div>
              )}

              {/* Ações admin */}
              {isAdmin && ["Pendente", "AjusteSolicitado"].includes(p.status) && (
                <div style={{ display: "flex", gap: 7, marginTop: 10, flexWrap: "wrap" }}>
                  <button onClick={() => onAprovar(p.id)} style={{
                    flex: 1, minWidth: 100, background: "#061a0c", border: "1px solid #16a34a44",
                    color: "#22c55e", padding: "8px 0", borderRadius: 6,
                    cursor: "pointer", fontWeight: 700, fontSize: 12,
                  }}>
                    ✅ Aprovar
                  </button>
                  {p.status === "Pendente" && (
                    <button onClick={() => onPedirAjuste(p.id)} style={{
                      flex: 1, minWidth: 100, background: "#251200", border: "1px solid #f9731633",
                      color: "#f97316", padding: "8px 0", borderRadius: 6,
                      cursor: "pointer", fontWeight: 600, fontSize: 12,
                    }}>
                      🔄 Solicitar Ajuste
                    </button>
                  )}
                  <button onClick={() => onRecusar(p.id)} style={{
                    flex: 1, minWidth: 100, background: "#2e0a0a", border: "1px solid #dc262633",
                    color: "#f87171", padding: "8px 0", borderRadius: 6,
                    cursor: "pointer", fontWeight: 600, fontSize: 12,
                  }}>
                    ❌ Recusar e Liberar
                  </button>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
