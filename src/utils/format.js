// ─────────────────────────────────────────────────────────────────
// FORMATAÇÃO — helpers de display
// ─────────────────────────────────────────────────────────────────

export const R2   = v => Math.round(v * 100) / 100;
export const brl  = v => (+v).toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 });
export const brl0 = v => (+v).toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });
export const m2   = v => `${(+v).toFixed(0)} m²`;
export const ts   = () => new Date().toLocaleString("pt-BR");
