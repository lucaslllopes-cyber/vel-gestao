// ─────────────────────────────────────────────────────────────────
// PAINEL LOTE — painel de detalhes compartilhado
// Usado por: Vista Geral, Lista, e futuro Espelho (mapa)
//
// Props:
//   lot        — objeto do lote selecionado
//   isAdmin    — boolean
//   cfg        — config global
//   user       — usuário logado
//   modo       — "lateral" | "flutuante" (para o futuro Espelho)
//   onClose    — () => void
//   onSimular  — () => void
//   onEditar   — (lot) => void
//   onReservar — (updLot) => void
//   onRenovar  — (updLot) => void
//   onLiberar  — (updLot) => void
//   onEstornar — (lot) => void
// ─────────────────────────────────────────────────────────────────
import { useState, useEffect } from "react";
import { SC } from "../data/constants";
import { brl, brl0, m2 } from "../utils/format";
import { isoNow, isoAdd, fmtVencimento, fmtDataHora, limparReserva } from "../utils/reserva";

export function PainelLote({
  lot, isAdmin, cfg, user, modo = "lateral",
  onClose, onSimular, onEditar, onReservar, onRenovar, onLiberar, onEstornar,
}) {
  if (!lot) return null;

  const [topOffset, setTopOffset] = useState(88); // fallback seguro

  useEffect(() => {
    if (modo === "flutuante") {
      const el = document.querySelector(".espelho-header");
      if (!el) return;
      
      const registrar = () => {
        // A altura física do header + 16px (padding do container da página) + 16px (margem entre header e mapa)
        setTopOffset(el.offsetHeight + 32);
      };
      
      registrar();
      const ro = new ResizeObserver(registrar);
      ro.observe(el);
      return () => ro.disconnect();
    }
  }, [modo]);

  // "lateral" → painel fixo à direita (Vista Geral / Lista)
  // "flutuante" → sobreposição absoluta (futuro Espelho em mapa)
  const estiloContainer = modo === "flutuante"
    ? {
        position: "absolute", top: topOffset, right: 16, zIndex: 50,
        width: 290, maxHeight: `calc(100% - ${topOffset + 16}px)`,
        background: "#090e16", border: "1px solid #1e293b",
        borderRadius: 10, padding: 15, overflow: "auto",
        boxShadow: "0 8px 32px #000a",
      }
    : {
        width: 290, background: "#090e16",
        borderLeft: "1px solid #1e293b",
        padding: 15, overflow: "auto", flexShrink: 0,
      };

  const vendido     = lot.status === "Vendido";
  const mostrar     = isAdmin || !vendido;
  const statusColor = SC[lot.status]?.bg || "#64748b";

  return (
    <div style={estiloContainer} className={modo === "flutuante" ? "painel-flutuante" : "painel-lateral"}>

      {/* Cabeçalho Fixado (Sticky) para nunca cortar o nome do Lote no Scroll */}
      <div style={{ 
        display: "flex", justifyContent: "space-between", 
        position: "sticky", top: -12, background: "#090e16", 
        paddingTop: 12, paddingBottom: 8, marginBottom: 8, 
        zIndex: 60, borderBottom: "1px solid rgba(30, 41, 59, 0.4)",
        margin: "-15px -15px 8px -15px", paddingLeft: 15, paddingRight: 15
      }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#f1f5f9", lineHeight: 1.1 }}>Lote {lot.n}</div>
          <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>Quadra {lot.q} · {lot.id}</div>
        </div>
        <button onClick={onClose}
          style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 16 }}>
          ✕
        </button>
      </div>

      {/* Badge de status */}
      <div style={{
        background: statusColor + "22", border: `1px solid ${statusColor}44`,
        borderRadius: 6, padding: "4px 8px", marginBottom: 8,
        display: "flex", alignItems: "center", gap: 6,
      }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: statusColor }} />
        <span style={{ color: statusColor, fontWeight: 700, fontSize: 11 }}>{lot.status}</span>
      </div>

      {/* Campos de detalhe — mascarados para corretor em lotes Vendidos */}
      {mostrar
        ? [
            { l: "Área",      v: m2(lot.area) },
            { l: "Valor",     v: brl(lot.valor) },
            { l: "R$/m²",     v: brl0(lot.valor / lot.area) + "/m²" },
            ...(lot.comprador ? [{ l: "Comprador", v: lot.comprador }] : []),
          ].map(({ l, v }) => (
            <div key={l} style={{
              display: "flex", justifyContent: "space-between",
              padding: "4px 0", borderBottom: "1px solid #1e293b",
            }}>
              <span style={{ fontSize: 10, color: "#475569", flexShrink: 0 }}>{l}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#e2e8f0",
                textAlign: "right", maxWidth: 170 }}>{v}</span>
            </div>
          ))
        : (
          <div style={{
            background: "#1a0606", border: "1px solid #dc262633",
            borderRadius: 6, padding: "8px 10px", marginTop: 2, marginBottom: 2,
          }}>
            <div style={{ fontSize: 10, color: "#f87171", fontWeight: 600, marginBottom: 2 }}>
              🔴 Lote indisponível
            </div>
            <div style={{ fontSize: 9, color: "#64748b", lineHeight: 1.4 }}>
              Este lote já foi comercializado. Detalhes visíveis apenas para a gestão.
            </div>
          </div>
        )
      }

      {/* Ações */}
      <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 5 }}>

        {(lot.status === "Disponível" ||
          (lot.status === "Reservado" && lot.reservaOwnerId === user.id)
        ) && (
          <button 
            onClick={onSimular} 
            onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.2)"}
            onMouseLeave={e => e.currentTarget.style.filter = "none"}
            style={{
              background: "linear-gradient(135deg, #275D6F, #1F4E5F)", border: "1px solid rgba(200, 162, 74, 0.4)",
              color: "#C8A24A", padding: "8px 0", borderRadius: 6, cursor: "pointer",
              fontWeight: 700, fontSize: 12, transition: "filter 0.2s ease, box-shadow 0.2s",
              boxShadow: "0 4px 12px rgba(31, 78, 95, 0.3)"
            }}
          >
            🧮 Simular & Propor
          </button>
        )}

        {isAdmin && (
          <button onClick={() => onEditar(lot)} style={{
            background: "#0d1f26", border: "1px solid rgba(31, 78, 95, 0.5)", color: "#8ea4ab",
            padding: "6px 0", borderRadius: 6, cursor: "pointer", fontWeight: 600, fontSize: 11,
          }}>
            ✏️ Editar Lote Especial
          </button>
        )}

        {isAdmin && lot.status === "Disponível" && (
          <button onClick={() => onReservar({
            ...lot,
            status:        "Reservado",
            reservado_em:  isoNow(),
            reservado_ate: isoAdd(cfg.reserva_horas),
            reservado_por: user.login,
          })} style={{
            background: "#1a1000", border: "1px solid #d9770633", color: "#fbbf24",
            padding: "8px 0", borderRadius: 7, cursor: "pointer", fontWeight: 600, fontSize: 12,
          }}>
            🔖 Reservar ({cfg.reserva_horas}h)
          </button>
        )}

        {isAdmin && lot.status === "Reservado" && (
          <>
            {/* Info de vencimento */}
            <div style={{
              background: "#1a1000", border: "1px solid #d9770622",
              borderRadius: 7, padding: "8px 10px", fontSize: 10,
            }}>
              <div style={{ color: "#fbbf24", fontWeight: 600, marginBottom: 3 }}>⏰ Reserva ativa</div>
              <div style={{ color: "#64748b" }}>
                Por: <span style={{ color: "#94a3b8" }}>{lot.reservado_por || "—"}</span>
              </div>
              <div style={{ color: "#64748b" }}>
                Em: <span style={{ color: "#94a3b8" }}>{fmtDataHora(lot.reservado_em)}</span>
              </div>
              <div style={{ color: "#64748b" }}>
                Vence:{" "}
                <span style={{
                  color: new Date(lot.reservado_ate) < new Date(Date.now() + 3_600_000)
                    ? "#f87171" : "#fbbf24",
                  fontWeight: 600,
                }}>
                  {fmtVencimento(lot.reservado_ate)} ({fmtDataHora(lot.reservado_ate)})
                </span>
              </div>
            </div>

            <button onClick={() => onRenovar({ ...lot, reservado_ate: isoAdd(cfg.reserva_horas) })}
              style={{
                background: "#1a1000", border: "1px solid #d9770644", color: "#fbbf24",
                padding: "8px 0", borderRadius: 7, cursor: "pointer", fontWeight: 600, fontSize: 12,
              }}>
              🔄 Renovar (+{cfg.reserva_horas}h)
            </button>

            <button onClick={() => onLiberar(limparReserva(lot))} style={{
              background: "#061a0c", border: "1px solid #16a34a44", color: "#16a34a",
              padding: "8px 0", borderRadius: 7, cursor: "pointer", fontWeight: 600, fontSize: 12,
            }}>
              ↩️ Liberar reserva
            </button>
          </>
        )}

        {isAdmin && lot.status === "Vendido" && (
          <div style={{ marginTop: 4 }}>
            <div style={{ fontSize: 10, color: "#64748b", marginBottom: 4, padding: "6px 8px",
              background: "#1a0a00", borderRadius: 5, border: "1px solid #dc262622" }}>
              🔴 Vendido para: <span style={{ color: "#94a3b8" }}>{lot.comprador || "—"}</span>
            </div>
            <button onClick={() => onEstornar(lot)} style={{
              width: "100%", background: "#2e0a0a", border: "1px solid #dc262644",
              color: "#f87171", padding: "8px 0", borderRadius: 7,
              cursor: "pointer", fontWeight: 700, fontSize: 12,
            }}>
              ↩️ Estornar Venda
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
