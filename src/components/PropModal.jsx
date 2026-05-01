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
      position: "fixed", inset: 0, background: "rgba(19, 53, 65, 0.8)", zIndex: 500,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 12, backdropFilter: "blur(4px)"
    }}>
      <div className="premium-card" style={{
        background: "white", padding: 32, width: 480, maxWidth: "100%", 
        maxHeight: "90vh", overflow: "auto", boxShadow: "var(--shadow-lg)",
        borderRadius: "var(--radius-lg)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24, alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "var(--navy-primary)" }}>📩 Dados do Cliente</div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4, fontWeight: 500 }}>
              Lote {sel.id} · {sim.tabela} · {sim.n}x parcelas
            </div>
          </div>
          <button onClick={onClose}
            style={{ background: "#f1f5f9", border: "none", color: "var(--text-secondary)", cursor: "pointer", 
              width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            ✕
          </button>
        </div>

        {/* Resumo da simulação */}
        {result && (
          <div style={{
            background: "#F8FAFC", border: "1px solid var(--border-color)",
            borderRadius: 12, padding: "16px", marginBottom: 24, fontSize: 12,
          }}>
            <div style={{ color: "var(--text-secondary)", marginBottom: 8, fontSize: 10,
              textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700 }}>Resumo da Proposta</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ color: "var(--text-secondary)" }}>
                Entrada: <div style={{ color: "var(--text-primary)", fontWeight: 800, fontSize: 14 }}>{brl(result.entrada)}</div>
              </div>
              {sim.tabela === "SACOC" && result.sacoc && (
                <div style={{ color: "var(--text-secondary)" }}>
                  1º ano: <div style={{ color: "#16a34a", fontWeight: 800, fontSize: 14 }}>{brl(result.sacoc.tabela[0].parcela)}/mês</div>
                </div>
              )}
              {sim.tabela === "PRICE" && (
                <div style={{ color: "var(--text-secondary)" }}>
                  Parcela: <div style={{ color: "#0284c7", fontWeight: 800, fontSize: 14 }}>{brl(result.price.parcela)}/mês</div>
                </div>
              )}
            </div>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Field label="Nome completo *" value={f.nome} onChange={v => setF(x => ({ ...x, nome: v }))} placeholder="Nome do proponente" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Field label="Telefone *" value={f.tel}   onChange={v => setF(x => ({ ...x, tel: v }))}   type="tel" placeholder="(00) 00000-0000" />
            <Field label="E-mail"     value={f.email} onChange={v => setF(x => ({ ...x, email: v }))} type="email" placeholder="email@exemplo.com" />
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, color: "var(--text-secondary)", marginBottom: 6,
              textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 700 }}>
              Observações Adicionais
            </div>
            <textarea
              value={f.obs}
              onChange={e => setF(x => ({ ...x, obs: e.target.value }))}
              rows={3}
              placeholder="Ex: Cliente solicita carência ou reforço nas parcelas..."
              style={{ width: "100%", background: "#F8FAFC", border: "1px solid var(--border-color)",
                borderRadius: 8, padding: "12px 14px", color: "var(--text-primary)", fontSize: 14,
                outline: "none", resize: "none", boxSizing: "border-box" }}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
          <button onClick={onBack}
            className="btn-outline-gold"
            style={{ padding: "12px 24px", color: "var(--text-secondary)", border: "1px solid var(--border-color)" }}>
            Voltar
          </button>
          <button
            onClick={() => {
              if (!f.nome.trim() || !f.tel.trim()) {
                alert("Nome e telefone são obrigatórios.");
                return;
              }
              onSubmit({ nome: f.nome, telefone: f.tel, email: f.email, obs: f.obs });
            }}
            className="btn-primary"
            style={{ flex: 1, padding: "12px 0", fontSize: 15 }}>
            Finalizar e Enviar Proposta
          </button>
        </div>
      </div>
    </div>
  );
}

