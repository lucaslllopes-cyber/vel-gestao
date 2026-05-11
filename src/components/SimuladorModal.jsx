// ─────────────────────────────────────────────────────────────────
// SIMULADOR MODAL — SACOC / PRICE com anuais
// ─────────────────────────────────────────────────────────────────
import { brl, brl0, m2 } from "../utils/format";

export function SimuladorModal({ sel, sim, setSim, result, cfg, canPropose = true, proposeMessage, onReservar, onProximo, onClose }) {
  return (
    <div className="modal-overlay" style={{
      position: "fixed", inset: 0, background: "rgba(19, 53, 65, 0.8)", zIndex: 2000,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 12, overflowY: "auto", backdropFilter: "blur(4px)"
    }}>
      <div className="modal-content" style={{
        background: "#FFFFFF", border: "1px solid var(--border-color)", borderRadius: 16,
        padding: "32px 28px", width: 520, maxWidth: "100%", maxHeight: "92vh", overflow: "auto",
        boxShadow: "var(--shadow-lg)"
      }}>
        {/* Cabeçalho */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24, alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "var(--navy-primary)", letterSpacing: "-0.5px" }}>
              🧮 Simulador de Financiamento
            </div>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4, fontWeight: 500 }}>
              Lote {sel.n} · {sel.id} · {brl(sel.valor)}
            </div>
          </div>
          <button onClick={onClose}
            style={{ background: "#f1f5f9", border: "none", color: "var(--text-secondary)", cursor: "pointer", 
              width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            ✕
          </button>
        </div>

        {/* Seleção de tabela */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10, color: "var(--text-secondary)", marginBottom: 8,
            textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700 }}>
            Sistema de Amortização
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {cfg.tabelas.map(t => (
              <button key={t} onClick={() => setSim(s => ({ ...s, tabela: t }))} style={{
                flex: 1, padding: "12px 8px", borderRadius: 10,
                border: `2px solid ${sim.tabela === t ? "var(--gold-primary)" : "var(--border-color)"}`,
                background: sim.tabela === t ? "var(--navy-primary)" : "#f8fafc",
                color: sim.tabela === t ? "white" : "var(--text-secondary)",
                fontWeight: 700, fontSize: 14, cursor: "pointer",
                transition: "all 0.2s ease"
              }}>
                {t}
                <div style={{ fontSize: 9, fontWeight: 500, marginTop: 2,
                  color: sim.tabela === t ? "rgba(255,255,255,0.6)" : "var(--text-secondary)" }}>
                  {t === "SACOC" ? "Parcelas anuais variáveis" : "Parcelas fixas"}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Entrada */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 10, color: "var(--text-secondary)",
              textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700 }}>
              Valor da Entrada
            </span>
            <span style={{ fontSize: 14, color: "var(--navy-primary)", fontWeight: 800 }}>
              {sim.entrada_pct}% = {brl(sel.valor * sim.entrada_pct / 100)}
            </span>
          </div>
          <input
            type="range" min={cfg.entrada_min_pct} max={80} step={1}
            value={sim.entrada_pct}
            onChange={e => setSim(s => ({ ...s, entrada_pct: +e.target.value }))}
            style={{ width: "100%", accentColor: "var(--navy-primary)", cursor: "pointer" }}
          />
          <div style={{ fontSize: 10, color: "var(--text-secondary)", marginTop: 4, fontWeight: 500 }}>
            Mínimo exigido: {cfg.entrada_min_pct}%
          </div>
        </div>

        {/* Prazo */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 10, color: "var(--text-secondary)",
              textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700 }}>
              Prazo de Pagamento
            </span>
            <span style={{ fontSize: 14, color: "var(--navy-primary)", fontWeight: 800 }}>
              {sim.n} Meses ({(sim.n / 12).toFixed(1)} anos)
            </span>
          </div>
          <input
            type="range" min={12} max={180} step={12} value={sim.n}
            onChange={e => setSim(s => ({ ...s, n: +e.target.value }))}
            style={{ width: "100%", accentColor: "var(--navy-primary)", cursor: "pointer" }}
          />
          {sim.tabela === "PRICE" && (
            <div style={{ fontSize: 10, color: sim.n <= 24 ? "#16a34a" : "var(--gold-primary)", marginTop: 4, fontWeight: 600 }}>
              {sim.n <= 24
                ? "✅ Sem juros (Até 24x)"
                : `⚠️ Com juros: ${cfg.taxa_am}% a.m.`}
            </div>
          )}
          {sim.tabela === "SACOC" && (
            <div style={{ fontSize: 10, color: "var(--text-secondary)", marginTop: 4, fontWeight: 500 }}>
              SACOC: Juros de {cfg.taxa_am}% a.m. progressivos
            </div>
          )}
        </div>

        {/* Parcelas anuais */}
        <div style={{ marginBottom: 24, background: "#f8fafc", borderRadius: 12, padding: 16, border: "1px solid var(--border-color)" }}>
          <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
            marginBottom: sim.com_anuais ? 12 : 0 }}>
            <input
              type="checkbox" checked={sim.com_anuais}
              onChange={e => setSim(s => ({ ...s, com_anuais: e.target.checked }))}
              style={{ accentColor: "var(--navy-primary)", width: 16, height: 16 }}
            />
            <span style={{ fontSize: 13, color: "var(--navy-primary)", fontWeight: 700 }}>
              Incluir Parcelas Anuais
            </span>
          </label>
          {sim.com_anuais && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { l: "Qtd. de Anuais",      k: "anuais_qtd", min: 1,   max: 15,    step: 1 },
                { l: "Valor Unitário (R$)",  k: "anuais_val", min: 500, max: 10000, step: 500 },
              ].map(({ l, k, min, max, step }) => (
                <div key={k}>
                  <div style={{ fontSize: 10, color: "var(--text-secondary)", marginBottom: 4, fontWeight: 600 }}>{l}</div>
                  <input
                    type="number" value={sim[k]} min={min} max={max} step={step}
                    onChange={e => setSim(s => ({ ...s, [k]: +e.target.value }))}
                    style={{ width: "100%", background: "white", border: "1px solid var(--border-color)",
                      borderRadius: 8, padding: "10px 12px", color: "var(--navy-primary)",
                      fontSize: 13, outline: "none", boxSizing: "border-box", fontWeight: 600 }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Resultado */}
        {result && (
          <div style={{
            background: "white", border: "1.5px solid var(--navy-primary)",
            borderRadius: 14, padding: 20, marginBottom: 24,
            boxShadow: "0 4px 12px rgba(19, 53, 65, 0.05)"
          }}>
            <div style={{ fontSize: 10, color: "var(--navy-primary)", textTransform: "uppercase",
              letterSpacing: "1.5px", marginBottom: 16, fontWeight: 800, textAlign: "center" }}>
              Resumo do Investimento
            </div>

            {/* Cards de resumo */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              {[
                { l: "Entrada",         v: brl(result.entrada),  c: "var(--navy-primary)" },
                { l: "Saldo a Financi.", v: brl(result.saldo),    c: "var(--navy-primary)" },
                ...(sim.com_anuais ? [{ l: `Anuais (${sim.anuais_qtd}×)`, v: brl(result.anuais), c: "var(--gold-primary)" }] : []),
                { l: "VGV Proposto",  v: brl(result.total),    c: "#16a34a" },
              ].map(({ l, v, c }) => (
                <div key={l} style={{ background: "#f8fafc", borderRadius: 10, padding: "12px", border: "1px solid #f1f5f9" }}>
                  <div style={{ fontSize: 9, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 700 }}>{l}</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: c, marginTop: 4 }}>{v}</div>
                </div>
              ))}
            </div>

            {/* Tabela SACOC por ano */}
            {sim.tabela === "SACOC" && result.sacoc?.tabela && (
              <div>
                <div style={{ fontSize: 10, color: "var(--text-secondary)", marginBottom: 8,
                  fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Progressão de Parcelas (Anual):
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6 }}>
                  {result.sacoc.tabela.map(row => (
                    <div key={row.ano} style={{
                      background: "#f8fafc", borderRadius: 8,
                      padding: "8px 10px", border: "1px solid #e2e8f0",
                    }}>
                      <div style={{ fontSize: 8, color: "var(--text-secondary)", fontWeight: 600 }}>{row.ano}º ANO</div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: "var(--navy-primary)", marginTop: 2 }}>{brl(row.parcela)}</div>
                      <div style={{ fontSize: 8, color: "var(--text-secondary)", marginTop: 1 }}>+ IPCA</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Price */}
            {sim.tabela === "PRICE" && result.price && (
              <div style={{ background: "var(--navy-primary)", borderRadius: 12, padding: "16px", textAlign: "center" }}>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", marginBottom: 4, fontWeight: 600 }}>
                  Parcela Mensal Fixa{result.price.sem_juros ? " (Sem Juros)" : ` (Juros ${cfg.taxa_am}% a.m.)`}
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "var(--gold-primary)" }}>
                  {brl(result.price.parcela)}
                </div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>* Reajuste anual pelo IPCA</div>
              </div>
            )}
          </div>
        )}

        {canPropose ? (
          <button onClick={onProximo} className="btn-primary" style={{
            width: "100%", padding: "16px 0", borderRadius: 12,
            fontSize: 15, boxShadow: "0 10px 15px -3px rgba(19, 53, 65, 0.2)"
          }}>
            📩 Prosseguir para Dados do Cliente
          </button>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{
              width: "100%", background: "#f8fafc", border: "1px solid var(--border-color)",
              color: "var(--text-secondary)", padding: "14px", borderRadius: 12,
              fontWeight: 600, fontSize: 13, lineHeight: 1.4, textAlign: "center"
            }}>
              🚫 {proposeMessage || "Proposta bloqueada"}
            </div>
            {sel.status === "Disponível" && (
              <button onClick={onReservar} className="btn-outline-gold" style={{
                width: "100%", padding: "14px 0", borderRadius: 12, fontWeight: 700, fontSize: 14
              }}>
                🔖 Reservar este Lote ({cfg.reserva_horas}h)
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
