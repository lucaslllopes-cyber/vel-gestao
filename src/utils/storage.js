// ─────────────────────────────────────────────────────────────────
// STORAGE — wrapper de localStorage com fallback
// ─────────────────────────────────────────────────────────────────
// Nota: trocar por Firebase Firestore quando hospedar em produção.
// A interface g/s pode permanecer a mesma — só mudar a implementação.

export const LS = {
  g: (key, defaultValue) => {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  s: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  },
};

// Chaves usadas no app
export const STORAGE_KEYS = {
  LOTS:   "tv3_lots",
  PROPS:  "tv3_props",
  NOTIFS: "tv3_nots",
  CFG:    "tv3_cfg",
};
