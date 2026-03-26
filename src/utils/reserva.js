// ─────────────────────────────────────────────────────────────────
// RESERVA — helpers de datas e expiração
// ─────────────────────────────────────────────────────────────────

export const isoNow = () => new Date().toISOString();
export const isoAdd = (h) => new Date(Date.now() + h * 3_600_000).toISOString();

export const venceuReserva = (lot) =>
  lot.status === "Reservado" &&
  lot.reservado_ate &&
  new Date(lot.reservado_ate) < new Date();

export const fmtVencimento = (iso) => {
  if (!iso) return "—";
  const diff = new Date(iso) - new Date();
  if (diff <= 0) return "Expirado";
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  return h > 0 ? `${h}h ${m}min` : `${m}min`;
};

export const fmtDataHora = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "2-digit",
    hour: "2-digit", minute: "2-digit",
  });
};

export const limparReserva = (lot) => ({
  ...lot,
  status:        "Disponível",
  reservado_em:  null,
  reservado_ate: null,
  reservado_por: null,
});
