// ─────────────────────────────────────────────────────────────────
// CONFIG PAGE — configurações comerciais (admin only)
// ─────────────────────────────────────────────────────────────────

export function ConfigPage({ cfg, setCfg }) {
  const campos = [
    { l: "Entrada mínima (%)",             k: "entrada_min_pct", min: 1,   max: 80,    step: 1,   note: "Piso obrigatório (8% = VEL + comissão)" },
    { l: "Taxa de juros (% a.m.)",          k: "taxa_am",         min: 0,   max: 3,     step: 0.1, note: "Aplicada no SACOC e Price >24x" },
    { l: "Prazo de reserva (horas)",        k: "reserva_horas",   min: 1,   max: 720,   step: 1,   note: "Ex: 48h ou 72h — vencimento automático" },
    { l: "Anuais — quantidade sugerida",    k: "anuais_qtd",      min: 1,   max: 20,    step: 1,   note: "Padrão editável pelo corretor" },
    { l: "Anuais — valor por parcela (R$)", k: "anuais_val",      min: 500, max: 20000, step: 500, note: "Padrão editável pelo corretor" },
  ];

  return (
    <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", marginBottom: 16 }}>
        ⚙️ Configurações Comerciais
      </div>
      <div style={{
        maxWidth: 460, background: "#090e16",
        border: "1px solid #1e293b", borderRadius: 12, padding: 20,
      }}>
        {campos.map(({ l, k, min, max, step, note }) => (
          <div key={k} style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 4, fontWeight: 600 }}>{l}</div>
            <input
              type="number"
              value={cfg[k]}
              min={min} max={max} step={step}
              onChange={e => setCfg(c => ({ ...c, [k]: parseFloat(e.target.value) || 0 }))}
              style={{
                width: "100%", background: "#141e2e", border: "1px solid #1e3a5f",
                borderRadius: 7, padding: "8px 11px", color: "#e2e8f0",
                fontSize: 13, outline: "none", boxSizing: "border-box",
              }}
            />
            <div style={{ fontSize: 9, color: "#334155", marginTop: 2 }}>{note}</div>
          </div>
        ))}

        {/* Tabelas disponíveis */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 6, fontWeight: 600 }}>
            Tabelas disponíveis para corretores
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {["SACOC", "PRICE"].map(t => (
              <label key={t} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={cfg.tabelas.includes(t)}
                  onChange={e => {
                    const arr = e.target.checked
                      ? [...cfg.tabelas, t]
                      : cfg.tabelas.filter(x => x !== t);
                    if (arr.length > 0) setCfg(c => ({ ...c, tabelas: arr }));
                  }}
                  style={{ accentColor: "#16a34a" }}
                />
                <span style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 600 }}>{t}</span>
              </label>
            ))}
          </div>
          <div style={{ fontSize: 9, color: "#334155", marginTop: 3 }}>
            Se desmarcar, corretores não veem essa opção
          </div>
        </div>

        <div style={{ padding: 10, background: "#141e2e", borderRadius: 7, fontSize: 11, color: "#64748b" }}>
          💡 Alterações aplicadas imediatamente para todos os corretores.
        </div>
      </div>
    </div>
  );
}
