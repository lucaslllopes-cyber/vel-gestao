// ─────────────────────────────────────────────────────────────────
// CONFIG PAGE — configurações comerciais (admin only)
// ─────────────────────────────────────────────────────────────────

export function ConfigPage({ cfg, setCfg, project }) {
  const campos = [
    { l: "Entrada mínima (%)",             k: "entrada_min_pct", min: 1,   max: 80,    step: 1,   note: "Piso obrigatório (8% = VEL + comissão)" },
    { l: "Taxa de juros (% a.m.)",          k: "taxa_am",         min: 0,   max: 3,     step: 0.1, note: "Aplicada no SACOC e Price >24x" },
    { l: "Prazo de reserva (horas)",        k: "reserva_horas",   min: 1,   max: 720,   step: 1,   note: "Ex: 48h ou 72h — vencimento automático" },
    { l: "Anuais — quantidade sugerida",    k: "anuais_qtd",      min: 1,   max: 20,    step: 1,   note: "Padrão editável pelo corretor" },
    { l: "Anuais — valor por parcela (R$)", k: "anuais_val",      min: 500, max: 20000, step: 500, note: "Padrão editável pelo corretor" },
  ];

  return (
    <div style={{ flex: 1, overflow: "auto", padding: "32px", background: "var(--off-white)" }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ color: "var(--navy-primary)", fontSize: 24, fontWeight: 800 }}>⚙️ Configurações do Sistema</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 4 }}>Ajuste os parâmetros comerciais globais do empreendimento.</p>
        {project && (
          <div style={{
            marginTop: 8, display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 12, color: "#0369a1",
            background: "#f0f9ff", border: "1px solid #bae6fd",
            borderRadius: 6, padding: "4px 10px", fontWeight: 600,
          }}>
            📍 {project.nome}
          </div>
        )}
      </div>

      <div className="premium-card" style={{
        maxWidth: 500, background: "white", padding: "32px", 
      }}>
        {campos.map(({ l, k, min, max, step, note }) => (
          <div key={k} style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 6, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>{l}</div>
            <input
              type="number"
              value={cfg[k]}
              min={min} max={max} step={step}
              onChange={e => setCfg(c => ({ ...c, [k]: parseFloat(e.target.value) || 0 }))}
              style={{
                width: "100%", background: "#F8FAFC", border: "1px solid var(--border-color)",
                borderRadius: 8, padding: "10px 14px", color: "var(--text-primary)",
                fontSize: 14, outline: "none", boxSizing: "border-box", fontWeight: 600
              }}
            />
            <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 6, opacity: 0.8 }}>{note}</div>
          </div>
        ))}

        {/* Tabelas disponíveis */}
        <div style={{ marginBottom: 20, paddingTop: 12, borderTop: "1px solid var(--border-color)" }}>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Tabelas Ativas
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            {["SACOC", "PRICE"].map(t => (
              <label key={t} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={cfg.tabelas.includes(t)}
                  onChange={e => {
                    const arr = e.target.checked
                      ? [...cfg.tabelas, t]
                      : cfg.tabelas.filter(x => x !== t);
                    if (arr.length > 0) setCfg(c => ({ ...c, tabelas: arr }));
                  }}
                  style={{ width: 18, height: 18, accentColor: "var(--navy-primary)", cursor: "pointer" }}
                />
                <span style={{ fontSize: 14, color: "var(--navy-primary)", fontWeight: 700 }}>{t}</span>
              </label>
            ))}
          </div>
          <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 8, opacity: 0.8 }}>
            Habilite ou desabilite métodos de financiamento para os corretores.
          </div>
        </div>

        <div style={{ 
          marginTop: 12, padding: "12px 16px", background: "#F8FAFC", 
          borderRadius: 8, fontSize: 12, color: "var(--text-secondary)",
          display: "flex", alignItems: "center", gap: 10, border: "1px solid var(--border-color)"
        }}>
          <span style={{ fontSize: 16 }}>💡</span>
          <span>Alterações aplicadas imediatamente para toda a rede de corretores.</span>
        </div>
      </div>
    </div>

  );
}
