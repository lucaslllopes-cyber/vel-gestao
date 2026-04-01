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

      const res = await fetch(`${BASE_URL}/admin/lotes/import/preview`, {
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

      const res = await fetch(`${BASE_URL}/admin/lotes/import/confirm`, {
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
    <div style={{ flex: 1, overflow: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ maxWidth: 900 }}>
        <h2 style={{ color: "#f1f5f9", fontSize: 20, marginBottom: 8, fontWeight: 700 }}>
          📊 Importação de Tabela de Preços
        </h2>
        <p style={{ color: "#94a3b8", fontSize: 13, marginBottom: 24, lineHeight: "1.5" }}>
          Esta ferramenta permite atualizar a base comercial (Lotes) a partir de uma planilha Excel (.xlsx).
          Certifique-se de que a planilha possui as colunas: <strong style={{color:"#e2e8f0"}}>QUADRA, LOTE, AREA_M2, VALOR_LOTE, STATUS, SITUACAO_LEGAL</strong>.
        </p>

        <div style={{ 
          background: "#0c1118", padding: "24px", borderRadius: 12, border: "1px solid #1e293b",
          display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center"
        }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <label style={{ display: "block", fontSize: 11, color: "#64748b", marginBottom: 8, textTransform: "uppercase", fontWeight: 700 }}>
              Arquivo Excel (.xlsx)
            </label>
            <input 
              type="file" 
              accept=".xlsx"
              onChange={handleFileChange}
              style={{
                width: "100%", background: "#141e2e", border: "1px dashed #1e3a5f",
                borderRadius: 8, padding: "12px", color: "#e2e8f0", fontSize: 13,
                outline: "none", cursor: "pointer"
              }}
            />
          </div>
          <button 
            onClick={processPreview}
            disabled={!file || loading}
            style={{ 
              background: (!file || loading) ? "#1e293b" : "linear-gradient(135deg,#3b82f6,#2563eb)", 
              color: "#fff", border: "none", borderRadius: 8, padding: "12px 24px", 
              fontWeight: 700, cursor: (!file || loading) ? "not-allowed" : "pointer", 
              fontSize: 14, height: 48, transition: "transform 0.2s"
            }}
          >
            {loading ? "Processando..." : "Analisar Planilha"}
          </button>
        </div>

        {error && <div style={{ color: "#f87171", fontSize: 13, marginTop: 16, padding: "12px", background: "#7f1d1d22", borderRadius: 8, border: "1px solid #7f1d1d" }}>⚠️ {error}</div>}
        {success && <div style={{ color: "#4ade80", fontSize: 13, marginTop: 16, padding: "12px", background: "#14532d22", borderRadius: 8, border: "1px solid #14532d" }}>✅ {success}</div>}
      </div>

      {preview && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <h2 style={{ color: "#f1f5f9", fontSize: 18, fontWeight: 700 }}>Pré-visualização de Alterações</h2>
              <p style={{ color: "#94a3b8", fontSize: 12 }}>Analise as mudanças abaixo antes de publicar no sistema oficial.</p>
            </div>
            <button 
              onClick={handleConfirm}
              disabled={confirming}
              style={{ 
                background: "linear-gradient(135deg,#16a34a,#15803d)", 
                color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", 
                fontWeight: 700, cursor: confirming ? "not-allowed" : "pointer", fontSize: 13
              }}
            >
              {confirming ? "Publicando..." : "Publicar Alterações no Sistema"}
            </button>
          </div>

          <div style={{ 
            background: "#0c1118", border: "1px solid #1e293b", borderRadius: 12, 
            overflow: "hidden", display: "flex", flexDirection: "column", flex: 1 
          }}>
            <div style={{ overflow: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead style={{ position: "sticky", top: 0, zIndex: 10 }}>
                  <tr style={{ background: "#0d1220" }}>
                    {["Lote", "Área", "Valor do Lote", "Status", "Situação"].map(h => (
                      <th key={h} style={{
                        padding: "12px 16px", textAlign: "left", color: "#64748b",
                        fontWeight: 700, fontSize: 10, textTransform: "uppercase",
                        letterSpacing: "0.5px", borderBottom: "1px solid #1e293b",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ padding: "40px", textAlign: "center", color: "#475569" }}>
                        Nenhuma alteração detectada entre a planilha e o banco de dados.
                      </td>
                    </tr>
                  ) : (
                    preview.map((d, i) => {
                      if (d.status === "Não encontrado") {
                        return (
                          <tr key={i} style={{ background: "#1e1b4b33", borderBottom: "1px solid #1e293b" }}>
                            <td colSpan="5" style={{ padding: "12px 16px", color: "#94a3b8", fontStyle: "italic" }}>
                              Lote {d.id} não encontrado no sistema.
                            </td>
                          </tr>
                        );
                      }

                      const m = d.mudancas || {};
                      
                      return (
                        <tr key={d.id} style={{ 
                          background: m.sensivel ? "#450a0a33" : (i % 2 === 0 ? "#060a0e" : "#090e16"), 
                          borderBottom: "1px solid #1e293b" 
                        }}>
                          <td style={{ padding: "12px 16px", fontWeight: 700, color: "#f1f5f9" }}>{d.id}</td>
                          
                          {/* AREA */}
                          <td style={{ padding: "12px 16px" }}>
                            {m.area ? (
                              <div style={{ display: "flex", flexDirection: "column" }}>
                                <span style={{ color: "#ef4444", textDecoration: "line-through", fontSize: 10 }}>{m2(m.area.old)}</span>
                                <span style={{ color: "#22c55e", fontWeight: 700 }}>{m2(m.area.new)}</span>
                              </div>
                            ) : (
                              <span style={{ color: "#64748b" }}>{m2(d.loteOriginal.area)}</span>
                            )}
                          </td>
                          
                          {/* VALOR */}
                          <td style={{ padding: "12px 16px" }}>
                            {m.valor ? (
                              <div style={{ display: "flex", flexDirection: "column" }}>
                                <span style={{ color: "#ef4444", textDecoration: "line-through", fontSize: 10 }}>{brl(m.valor.old)}</span>
                                <span style={{ color: "#22c55e", fontWeight: 700 }}>{brl(m.valor.new)}</span>
                              </div>
                            ) : (
                              <span style={{ color: "#64748b" }}>{brl(d.loteOriginal.valor)}</span>
                            )}
                          </td>
                          
                          {/* STATUS */}
                          <td style={{ padding: "12px 16px" }}>
                            {m.status ? (
                              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <span style={{ color: "#64748b", fontSize: 9 }}>{m.status.old}</span>
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                  <span style={{ fontWeight: 700, color: "#f1f5f9" }}> → {m.status.new}</span>
                                  {m.sensivel && <span style={{ background: "#ef4444", color: "#fff", fontSize: 8, padding: "1px 4px", borderRadius: 3, fontWeight: "bold" }}>LR</span>}
                                </div>
                              </div>
                            ) : (
                              <span style={{ color: "#64748b" }}>{d.loteOriginal.status}</span>
                            )}
                          </td>

                          {/* SITUACAO */}
                          <td style={{ padding: "12px 16px" }}>
                            {m.situacaoLegal ? (
                              <div style={{ display: "flex", flexDirection: "column" }}>
                                <span style={{ color: "#64748b", fontSize: 9 }}>{m.situacaoLegal.old || "Vazio"}</span>
                                <span style={{ color: "#22c55e", fontWeight: 700 }}>{m.situacaoLegal.new}</span>
                              </div>
                            ) : (
                                <span style={{ color: "#64748b" }}>{d.loteOriginal.situacaoLegal || "---"}</span>
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
              <div style={{ padding: "10px 16px", background: "#450a0a66", fontSize: 10, color: "#fca5a5", borderTop: "1px solid #7f1d1d" }}>
                ⚠️ <strong>Atenção:</strong> Lotes destacados em vermelho terão reservas ou vendas liberadas (voltarão a Disponível).
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
