// ─────────────────────────────────────────────────────────────────
// utils/api.js — URL base da API por ambiente
//
// Dev local  → VITE_API_URL = http://localhost:3001  (via .env)
// Produção   → VITE_API_URL = https://api.velgestao.com (via .env.production)
// ─────────────────────────────────────────────────────────────────
export const BASE_URL = import.meta.env.VITE_API_URL ?? "https://api.velgestao.com";
