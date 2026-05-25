// ─────────────────────────────────────────────────────────────────
// utils/projectConfig.js — busca configuração do projeto via API
//
// Prioridade de config (da menor para a maior precedência):
//   3. DEFAULT_CFG hardcoded       (fallback final)
//   2. config salva em localStorage (fallback)
//   1. config do Project via API   (fonte canônica — vence)
//
// Se /project/current falhar por qualquer motivo (rede, 401, 500, etc.),
// retorna fallback válido sem lançar exceção.
// ─────────────────────────────────────────────────────────────────
import { BASE_URL } from './api';
import { DEFAULT_CFG } from '../data/constants';

/**
 * Busca GET /project/current e devolve config mesclada + dados do projeto.
 * Nunca lança exceção — sempre retorna objeto válido.
 *
 * @param {string} token    - JWT do usuário autenticado
 * @param {object} lsConfig - config atual do localStorage (fallback intermediário)
 * @returns {{ config: object, project: object|null, perfil: string|null }}
 */
export async function fetchProjectConfig(token, lsConfig = {}) {
  try {
    const res = await fetch(`${BASE_URL}/project/current`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      console.warn('[projectConfig] /project/current retornou', res.status, '— usando fallback');
      return { config: { ...DEFAULT_CFG, ...lsConfig }, project: null, perfil: null };
    }

    const data = await res.json();
    const projectConfig = data.project?.config ?? {};

    // Merge com prioridade: backend > localStorage > defaults
    const merged = { ...DEFAULT_CFG, ...lsConfig, ...projectConfig };

    return {
      config: merged,
      project: data.project
        ? { id: data.project.id, nome: data.project.nome, slug: data.project.slug }
        : null,
      perfil: data.perfil ?? null,
    };
  } catch (e) {
    console.warn('[projectConfig] Falha ao buscar /project/current — usando fallback:', e.message);
    return { config: { ...DEFAULT_CFG, ...lsConfig }, project: null, perfil: null };
  }
}
