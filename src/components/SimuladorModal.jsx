// ─────────────────────────────────────────────────────────────────
// SIMULADOR MODAL — SACOC / PRICE com anuais
// ─────────────────────────────────────────────────────────────────
import { brl, brl0, m2 } from "../utils/format";

export function SimuladorModal({ sel, sim, setSim, result, cfg, onProximo, onClose }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "#000c", zIndex: 200,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 12, overflowY: "auto",
    }}>
      <div style={{
        background: "#090e16", border: "1px solid #1e293b", borderRadius: 14,
        padding: 22, width: 520, maxWidth: "100%", maxHeight: "92vh", overflow: "auto",
      }}>
        {/* Cabeçalho */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#f1f5f9" }}>
              🧮 Simulador — Lote {sel.n}
            </div>
            <div style={{ fontSize: 11, color: "#475569" }}>
              {sel.id} · {brl(sel.valor)} · {m2(sel.area)}
            </div>
          </div>
          <button onClick={onClose}
            style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 18 }}>
            ✕
          </button>
        </div>

        {/* Seleção de tabela */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, color: "#64748b", marginBottom: 6,
            textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>
            Sistema de amortização
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {cfg.tabelas.map(t => (
              <button key={t} onClick={() => setSim(s => ({ ...s, tabela: t }))} style={{
                flex: 1, padding: "10px 0", borderRadius: 8,
                border: `2px solid ${sim.tabela === t ? "#16a34a" : "#1e3a5f"}`,
                background: sim.tabela === t ? "#061a0c" : "#141e2e",
                color: sim.tabela === t ? "#22c55e" : "#64748b",
                fontWeight: 700, fontSize: 14, cursor: "pointer",
              }}>
                {t}
                <div style={{ fontSize: 9, fontWeight: 400, marginTop: 2,
                  color: sim.tabela === t ? "#16a34a88" : "#334155" }}>
                  {t === "SACOC" ? "Parcela crescente ano a ano" : "Parcela fixa"}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Entrada */}
        <div style={{ marginBottom: 13 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 10, color: "#64748b",
              textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>
              Entrada
            </span>
            <span style={{ fontSize: 12, color: "#60a5fa", fontWeight: 700 }}>
              {sim.entrada_pct}% = {brl(sel.valor * sim.entrada_pct / 100)}
            </span>
          </div>
          <input
            type="range" min={cfg.entrada_min_pct} max={80} step={1}
            value={sim.entrada_pct}
            onChange={e => setSim(s => ({ ...s, entrada_pct: +e.target.value }))}
            style={{ width: "100%", accentColor: "#16a34a" }}
          />
          <div style={{ fontSize: 9, color: "#334155", marginTop: 2 }}>
            Mínimo: {cfg.entrada_min_pct}% (inclui 8% VEL)
          </div>
        </div>

        {/* Prazo */}
        <div style={{ marginBottom: 13 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 10, color: "#64748b",
              textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>
              Prazo
            </span>
            <span style={{ fontSize: 12, color: "#60a5fa", fontWeight: 700 }}>
              {sim.n}x ({(sim.n / 12).toFixed(1)} anos)
            </span>
          </div>
          <input
            type="range" min={12} max={180} step={12} value={sim.n}
            onChange={e => setSim(s => ({ ...s, n: +e.target.value }))}
            style={{ width: "100%", accentColor: "#16a34a" }}
          />
          {sim.tabela === "PRICE" && (
            <div style={{ fontSize: 9, color: sim.n <= 24 ? "#22c55e" : "#fbbf24", marginTop: 2 }}>
              {sim.n <= 24
                ? "✅ Até 24x → sem juros"
                : `⚠️ Acima de 24x → ${cfg.taxa_am}% a.m. (Price)`}
            </div>
          )}
          {sim.tabela === "SACOC" && (
            <div style={{ fontSize: 9, color: "#475569", marginTop: 2 }}>
              SACOC: sempre com {cfg.taxa_am}% a.m. progressivo
            </div>
          )}
        </div>

        {/* Parcelas anuais */}
        <div style={{ marginBottom: 14, background: "#141e2e", borderRadius: 8, padding: 12 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
            marginBottom: sim.com_anuais ? 10 : 0 }}>
            <input
              type="checkbox" checked={sim.com_anuais}
              onChange={e => setSim(s => ({ ...s, com_anuais: e.target.checked }))}
              style={{ accentColor: "#16a34a", width: 14, height: 14 }}
            />
            <span style={{ fontSize: 12, color: "#e2e8f0", fontWeight: 600 }}>
              Incluir parcelas anuais
            </span>
            <span style={{ fontSize: 10, color: "#334155" }}>(boleto de aniversário)</span>
          </label>
          {sim.com_anuais && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { l: "Quantidade",          k: "anuais_qtd", min: 1,   max: 15,    step: 1 },
                { l: "Valor unitário (R$)",  k: "anuais_val", min: 500, max: 10000, step: 500 },
              ].map(({ l, k, min, max, step }) => (
                <div key={k}>
                  <div style={{ fontSize: 10, color: "#64748b", marginBottom: 3 }}>{l}</div>
                  <input
                    type="number" value={sim[k]} min={min} max={max} step={step}
                    onChange={e => setSim(s => ({ ...s, [k]: +e.target.value }))}
                    style={{ width: "100%", background: "#0f1520", border: "1px solid #1e3a5f",
                      borderRadius: 6, padding: "7px 9px", color: "#e2e8f0",
                      fontSize: 12, outline: "none", boxSizing: "border-box" }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Resultado */}
        {result && (
          <div style={{
            background: "#0a1520", border: "1px solid #1e3a5f",
            borderRadius: 10, padding: 14, marginBottom: 14,
          }}>
            <div style={{ fontSize: 9, color: "#475569", textTransform: "uppercase",
              letterSpacing: "0.5px", marginBottom: 10, fontWeight: 700 }}>
              Resultado
            </div>

            {/* Cards de resumo */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 12 }}>
              {[
                { l: "Entrada",         v: brl(result.entrada),  c: "#f1f5f9" },
                { l: "Saldo financiado",v: brl(result.saldo),    c: "#f1f5f9" },
                ...(sim.com_anuais ? [{ l: `Anuais (${sim.anuais_qtd}× ${brl0(sim.anuais_val)})`, v: brl(result.anuais), c: "#fbbf24" }] : []),
                { l: "Total sem IPCA",  v: brl(result.total),    c: "#22d3ee" },
              ].map(({ l, v, c }) => (
                <div key={l} style={{ background: "#141e2e", borderRadius: 6, padding: "8px 10px" }}>
                  <div style={{ fontSize: 9, color: "#475569", textTransform: "uppercase", letterSpacing: "0.4px" }}>{l}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: c, marginTop: 2 }}>{v}</div>
                </div>
              ))}
            </div>

            {/* Tabela SACOC por ano */}
            {sim.tabela === "SACOC" && result.sacoc?.tabela && (
              <div>
                <div style={{ fontSize: 9, color: "#475569", marginBottom: 6,
                  fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.4px" }}>
                  Progressão mensal por ano:
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 4 }}>
                  {result.sacoc.tabela.map(row => {
                    const cor = row.ano <= 2 ? "#16a34a"
                      : row.ano <= 5 ? "#22d3ee"
                      : row.ano <= 10 ? "#fbbf24"
                      : "#f87171";
                    return (
                      <div key={row.ano} style={{
                        background: "#141e2e", borderRadius: 5,
                        padding: "6px 8px", borderLeft: `2px solid ${cor}`,
                      }}>
                        <div style={{ fontSize: 8, color: "#475569" }}>{row.ano}º ano · {row.meses}m</div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#f1f5f9" }}>{brl(row.parcela)}</div>
                        <div style={{ fontSize: 8, color: "#334155" }}>+ IPCA</div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ fontSize: 9, color: "#475569", marginTop: 7, padding: "7px 9px",
                  background: "#141e2e", borderRadius: 5, lineHeight: 1.5 }}>
                  ℹ️ <b style={{ color: "#64748b" }}>Como funciona:</b> Ano 1 = saldo ÷ {sim.n} (sem juros).
                  A partir do 2º ano, os juros de {cfg.taxa_am}% a.m. entram progressivamente.
                  O IPCA incide no saldo devedor a cada aniversário — não é possível simular o valor futuro.
                </div>
              </div>
            )}

            {/* Price */}
            {sim.tabela === "PRICE" && result.price && (
              <div style={{ background: "#141e2e", borderRadius: 7, padding: "10px 12px" }}>
                <div style={{ fontSize: 9, color: "#475569", marginBottom: 4 }}>
                  Parcela mensal fixa{result.price.sem_juros ? " (sem juros)" : ` (${cfg.taxa_am}% a.m.)`}
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#22d3ee" }}>
                  {brl(result.price.parcela)}
                  <span style={{ fontSize: 10, color: "#475569", fontWeight: 400 }}>/mês + IPCA anual</span>
                </div>
              </div>
            )}
          </div>
        )}

        <button onClick={onProximo} style={{
          width: "100%", background: "linear-gradient(135deg,#16a34a,#15803d)",
          border: "none", color: "#fff", padding: "12px 0", borderRadius: 8,
          cursor: "pointer", fontWeight: 700, fontSize: 14,
        }}>
          📩 Prosseguir → Dados do Cliente
        </button>
      </div>
    </div>
  );
}
