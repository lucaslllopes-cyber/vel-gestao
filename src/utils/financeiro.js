// ─────────────────────────────────────────────────────────────────
// FINANCEIRO — cálculos de amortização SACOC e PRICE
// ─────────────────────────────────────────────────────────────────
import { R2 } from "./format";

/**
 * SACOC — Sistema de Amortização com juro progressivo anual.
 *
 * Fórmula:
 *   Ano 1: parcela = saldo / n  (sem juros)
 *   Ano N: parcela_ano1 × (1 + taxa_aa)^(N-1)
 *   Taxa aa derivada de: (1 + taxa_am)^12 - 1
 *
 * O IPCA incide no saldo devedor a cada aniversário anual no contrato real,
 * mas não é simulado aqui — as parcelas são exibidas como "+ IPCA".
 *
 * Validação: F-50 (Paulo Henrique) → 91.393,75 ÷ 175 = R$ 522,25 ✅
 */
export function calcSACOC(saldo, n_parcelas, taxa_am_pct) {
  const taxa_am = taxa_am_pct / 100;
  const taxa_aa = Math.pow(1 + taxa_am, 12) - 1;
  const p1      = R2(saldo / n_parcelas);
  const anos    = Math.ceil(n_parcelas / 12);
  const tabela  = [];
  let total     = 0;

  for (let a = 1; a <= anos; a++) {
    const meses = Math.min(12, n_parcelas - (a - 1) * 12);
    if (meses <= 0) break;
    const p = R2(p1 * Math.pow(1 + taxa_aa, a - 1));
    total += p * meses;
    tabela.push({ ano: a, meses, parcela: p, sub: R2(p * meses) });
  }

  return { p1, taxa_aa, tabela, total: R2(total) };
}

/**
 * PRICE — Sistema Francês de amortização (parcela fixa).
 *
 * Regra Terra Vista:
 *   ≤ 24 parcelas → sem juros (parcela = saldo / n)
 *   ≥ 25 parcelas → juros de taxa_am_pct% a.m.
 *
 * O IPCA anual incide no saldo devedor conforme contrato, não simulado aqui.
 */
export function calcPRICE(saldo, n_parcelas, taxa_am_pct) {
  const sem_juros = n_parcelas <= 24;
  const r = taxa_am_pct / 100;
  const parcela = (sem_juros || r === 0)
    ? R2(saldo / n_parcelas)
    : R2(saldo * (r * Math.pow(1 + r, n_parcelas)) / (Math.pow(1 + r, n_parcelas) - 1));

  return { parcela, sem_juros, total: R2(parcela * n_parcelas) };
}
