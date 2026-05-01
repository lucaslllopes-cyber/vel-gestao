import { useState } from "react";
import { BASE_URL } from "../utils/api";
import { brl, m2 } from "../utils/format";

export function ImportacaoPage({ user, onRefreshLotes }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(null);
      setError("");
      setSuccess("");
    }
  };

  const processPreview = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${BASE_URL}/lotes/import-preview`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${user.token}`
        },
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao processar planilha");
      
      setPreview(data.diffs);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!preview || preview.length === 0) return;
    
    setConfirming(true);
    setError("");
    try {
      const updates = preview
        .filter(d => d.mudancas && !d.status) // Filtra apenas os que foram encontrados e têm mudanças
        .map(d => ({
          id: d.id,
          valoresNovos: d.valoresNovos
        }));

      if (updates.length === 0) {
        setError("Nenhuma alteração pendente para ser aplicada.");
        return;
      }

      const res = await fetch(`${BASE_URL}/lotes/import-confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify({ updates })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao confirmar importação");

      setSuccess(data.message);
      setPreview(null);
      setFile(null);
      if (onRefreshLotes) onRefreshLotes();
    } catch (e) {
      setError(e.message);
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div style={{ flex: 1, overflow: "auto", padding: "32px", display: "flex", flexDirection: "column", gap: "32px", background: "var(--off-white)" }}>
      <div style={{ maxWidth: 1000 }}>
        <h2 style={{ color: "var(--navy-primary)", fontSize: 24, marginBottom: 12, fontWeight: 800 }}>
          📊 Importação de Lotes
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 24, lineHeight: "1.6", maxWidth: 700 }}>
          Atualize a base comercial a partir de uma planilha Excel (.xlsx).
          O sistema identificará mudanças de preços, áreas e status automaticamente.
        </p>

        <div className="premium-card" style={{ 
          background: "white", padding: "32px", 
          display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center"
        }}>
          <div style={{ flex: 1, minWidth: 300 }}>
            <label style={{ display: "block", fontSize: 11, color: "var(--text-secondary)", marginBottom: 8, textTransform: "uppercase", fontWeight: 700, letterSpacing: "1px" }}>
              Selecione o Arquivo (.xlsx)
            </label>
            <div style={{ position: "relative" }}>
              <input 
                type="file" 
                accept=".xlsx"
                onChange={handleFileChange}
                style={{
                  width: "100%", background: "#F8FAFC", border: "2px dashed var(--border-color)",
                  borderRadius: 12, padding: "20px", color: "var(--text-primary)", fontSize: 14,
                  outline: "none", cursor: "pointer", textAlign: "center"
                }}
              />
            </div>
          </div>
          <button 
            onClick={processPreview}
            disabled={!file || loading}
            className="btn-primary"
            style={{ 
              padding: "0 32px", height: 56, fontSize: 15
            }}
          >
            {loading ? "Processando..." : "Analisar Planilha"}
          </button>
        </div>

        {error && <div style={{ color: "#dc2626", fontSize: 14, marginTop: 16, padding: "16px", background: "#fef2f2", borderRadius: 12, border: "1px solid #fee2e2" }}>⚠️ {error}</div>}
        {success && <div style={{ color: "#16a34a", fontSize: 14, marginTop: 16, padding: "16px", background: "#f0fdf4", borderRadius: 12, border: "1px solid #dcfce7" }}>✅ {success}</div>}
      </div>

      {preview && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20 }}>
            <div>
              <h2 style={{ color: "var(--navy-primary)", fontSize: 20, fontWeight: 800 }}>Pré-visualização</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: 13, marginTop: 4 }}>Compare os dados da planilha com o sistema antes de confirmar.</p>
            </div>
            <button 
              onClick={handleConfirm}
              disabled={confirming}
              className="btn-primary"
              style={{ 
                background: "var(--gold-primary)", padding: "12px 24px", fontSize: 14
              }}
            >
              {confirming ? "Publicando..." : "Confirmar e Publicar Alterações"}
            </button>
          </div>

          <div className="premium-card" style={{ 
            background: "white", overflow: "hidden", display: "flex", flexDirection: "column", flex: 1 
          }}>
            <div style={{ overflow: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead style={{ position: "sticky", top: 0, zIndex: 10 }}>
                  <tr style={{ background: "#F8FAFC" }}>
                    {["Lote", "Área", "Valor do Lote", "Status", "Situação"].map(h => (
                      <th key={h} style={{
                        padding: "16px 20px", textAlign: "left", color: "var(--text-secondary)",
                        fontWeight: 700, fontSize: 10, textTransform: "uppercase",
                        letterSpacing: "1px", borderBottom: "1px solid var(--border-color)",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ padding: "64px", textAlign: "center", color: "var(--text-secondary)", fontWeight: 500 }}>
                        Nenhuma alteração detectada entre a planilha e o banco de dados.
                      </td>
                    </tr>
                  ) : (
                    preview.map((d, i) => {
                      if (d.status === "Não encontrado") {
                        return (
                          <tr key={i} style={{ background: "#F1F5F9", borderBottom: "1px solid var(--border-color)" }}>
                            <td colSpan="5" style={{ padding: "12px 20px", color: "var(--text-secondary)", fontStyle: "italic", fontSize: 12 }}>
                              Lote {d.id} não encontrado no sistema.
                            </td>
                          </tr>
                        );
                      }

                      const m = d.mudancas || {};
                      
                      return (
                        <tr key={d.id} style={{ 
                          background: m.sensivel ? "#FEF2F2" : (i % 2 === 0 ? "white" : "#FDFDFD"), 
                          borderBottom: "1px solid var(--border-color)" 
                        }}>
                          <td style={{ padding: "16px 20px", fontWeight: 800, color: "var(--navy-primary)" }}>{d.id}</td>
                          
                          {/* AREA */}
                          <td style={{ padding: "16px 20px" }}>
                            {m.area ? (
                              <div style={{ display: "flex", flexDirection: "column" }}>
                                <span style={{ color: "#ef4444", textDecoration: "line-through", fontSize: 10 }}>{m2(m.area.old)}</span>
                                <span style={{ color: "#16a34a", fontWeight: 800 }}>{m2(m.area.new)}</span>
                              </div>
                            ) : (
                              <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{m2(d.loteOriginal.area)}</span>
                            )}
                          </td>
                          
                          {/* VALOR */}
                          <td style={{ padding: "16px 20px" }}>
                            {m.valor ? (
                              <div style={{ display: "flex", flexDirection: "column" }}>
                                <span style={{ color: "#ef4444", textDecoration: "line-through", fontSize: 10 }}>{brl(m.valor.old)}</span>
                                <span style={{ color: "#16a34a", fontWeight: 800 }}>{brl(m.valor.new)}</span>
                              </div>
                            ) : (
                              <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{brl(d.loteOriginal.valor)}</span>
                            )}
                          </td>
                          
                          {/* STATUS */}
                          <td style={{ padding: "16px 20px" }}>
                            {m.status ? (
                              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <span style={{ color: "var(--text-secondary)", fontSize: 10 }}>{m.status.old}</span>
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                  <span style={{ fontWeight: 800, color: "var(--navy-primary)" }}> → {m.status.new}</span>
                                  {m.sensivel && <span style={{ background: "#ef4444", color: "#fff", fontSize: 8, padding: "2px 6px", borderRadius: 4, fontWeight: 900 }}>LIBERAÇÃO</span>}
                                </div>
                              </div>
                            ) : (
                              <span style={{ color: "var(--text-secondary)", fontWeight: 500 }}>{d.loteOriginal.status}</span>
                            )}
                          </td>

                          {/* SITUACAO */}
                          <td style={{ padding: "16px 20px" }}>
                            {m.situacaoLegal ? (
                              <div style={{ display: "flex", flexDirection: "column" }}>
                                <span style={{ color: "var(--text-secondary)", fontSize: 10 }}>{m.situacaoLegal.old || "Vazio"}</span>
                                <span style={{ color: "#16a34a", fontWeight: 800 }}>{m.situacaoLegal.new}</span>
                              </div>
                            ) : (
                                <span style={{ color: "var(--text-secondary)", fontWeight: 500 }}>{d.loteOriginal.situacaoLegal || "---"}</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            {preview.some(d => d.mudancas?.sensivel) && (
              <div style={{ padding: "12px 20px", background: "#FEF2F2", fontSize: 11, color: "#991B1B", borderTop: "1px solid #FEE2E2", fontWeight: 600 }}>
                ⚠️ <strong>Atenção:</strong> Lotes destacados em vermelho terão reservas ou vendas liberadas automaticamente devido à mudança de status na planilha.
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
