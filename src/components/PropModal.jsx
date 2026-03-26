// ─────────────────────────────────────────────────────────────────
// PROP MODAL — coleta dados do cliente para envio de proposta
// ─────────────────────────────────────────────────────────────────
import { useState } from "react";
import { brl } from "../utils/format";
import { Field } from "./Field";

export function PropModal({ sel, sim, result, onSubmit, onBack, onClose }) {
  const [f, setF] = useState({ nome: "", tel: "", email: "", obs: "" });

  return (
    <div style={{
      position: "fixed", inset: 0, background: "#000c", zIndex: 300,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 12,
    }}>
      <div style={{
        background: "#090e16", border: "1px solid #1e293b", borderRadius: 14,
        padding: 22, width: 460, maxWidth: "100%", maxHeight: "90vh", overflow: "auto",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#f1f5f9" }}>📩 Dados do Cliente</div>
            <div style={{ fontSize: 11, color: "#475569" }}>
              Lote {sel.id} · {sim.tabela} · {sim.n}x
            </div>
          </div>
          <button onClick={onClose}
            style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 18 }}>
            ✕
          </button>
        </div>

        {/* Resumo da simulação */}
        {result && (
          <div style={{
            background: "#0a1520", border: "1px solid #1e3a5f44",
            borderRadius: 8, padding: "10px 12px", marginBottom: 14, fontSize: 11,
          }}>
            <div style={{ color: "#475569", marginBottom: 5, fontSize: 9,
              textTransform: "uppercase", letterSpacing: "0.5px" }}>Resumo</div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <span style={{ color: "#94a3b8" }}>
                Entrada: <b style={{ color: "#f1f5f9" }}>{brl(result.entrada)}</b>
              </span>
              {sim.tabela === "SACOC" && result.sacoc && (
                <span style={{ color: "#94a3b8" }}>
                  1º ano: <b style={{ color: "#22c55e" }}>{brl(result.sacoc.tabela[0].parcela)}/mês</b>
                </span>
              )}
              {sim.tabela === "PRICE" && (
                <span style={{ color: "#94a3b8" }}>
                  Parcela: <b style={{ color: "#22d3ee" }}>{brl(result.price.parcela)}/mês</b>
                </span>
              )}
              {sim.com_anuais && (
                <span style={{ color: "#94a3b8" }}>
                  Anuais: <b style={{ color: "#fbbf24" }}>{sim.anuais_qtd}×{brl(sim.anuais_val)}</b>
                </span>
              )}
            </div>
          </div>
        )}

        <Field label="Nome completo *" value={f.nome} onChange={v => setF(x => ({ ...x, nome: v }))} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field label="Telefone *" value={f.tel}   onChange={v => setF(x => ({ ...x, tel: v }))}   type="tel" />
          <Field label="E-mail"     value={f.email} onChange={v => setF(x => ({ ...x, email: v }))} type="email" />
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, color: "#64748b", marginBottom: 4,
            textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>
            Observações
          </div>
          <textarea
            value={f.obs}
            onChange={e => setF(x => ({ ...x, obs: e.target.value }))}
            rows={2}
            style={{ width: "100%", background: "#141e2e", border: "1px solid #1e3a5f",
              borderRadius: 7, padding: "8px 10px", color: "#e2e8f0", fontSize: 13,
              outline: "none", resize: "vertical", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onBack}
            style={{ background: "#1e293b", border: "none", color: "#64748b",
              padding: "10px 16px", borderRadius: 7, cursor: "pointer", fontSize: 12 }}>
            ← Voltar
          </button>
          <button
            onClick={() => {
              if (!f.nome.trim() || !f.tel.trim()) {
                alert("Nome e telefone são obrigatórios.");
                return;
              }
              onSubmit({ nome: f.nome, telefone: f.tel, email: f.email, obs: f.obs });
            }}
            style={{ flex: 1, background: "linear-gradient(135deg,#16a34a,#15803d)",
              border: "none", color: "#fff", padding: "11px 0", borderRadius: 7,
              cursor: "pointer", fontWeight: 700, fontSize: 14 }}>
            Confirmar Envio
          </button>
        </div>
      </div>
    </div>
  );
}
