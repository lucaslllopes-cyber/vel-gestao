// ─────────────────────────────────────────────────────────────────
// APP.JSX — componente raiz, orquestra estado e roteamento de abas
// ─────────────────────────────────────────────────────────────────
import { useState, useMemo, useEffect, useCallback } from "react";
import { BASE_URL } from "./utils/api";

import { LOTS_SEED, DEFAULT_CFG, QUADRAS, SC } from "./data/constants";
import { LS, STORAGE_KEYS }                    from "./utils/storage";
import { R2, brl, brl0, m2, ts }               from "./utils/format";
import { isoNow, isoAdd, limparReserva }        from "./utils/reserva";
import { calcSACOC, calcPRICE }                 from "./utils/financeiro";
import { useReservaTimer }                      from "./hooks/useReservaTimer";

import { Toast }          from "./components/Toast";
import { PainelLote }     from "./components/PainelLote";
import { PropModal }      from "./components/PropModal";
import { SimuladorModal } from "./components/SimuladorModal";

import { LoginPage }      from "./pages/LoginPage";
import { VistaGeralPage } from "./pages/VistaGeralPage";
import { ListaPage }      from "./pages/ListaPage";
import { PropostasPage }  from "./pages/PropostasPage";
import { AlertasPage }    from "./pages/AlertasPage";
import { ConfigPage }     from "./pages/ConfigPage";
import { EspelhoPage }    from "./pages/EspelhoPage";
import { UsuariosPage }   from "./pages/UsuariosPage";
import { ImportacaoPage } from "./pages/ImportacaoPage";

// ── Icons (SVGs for consistent mobile UI) ──
const IconGeral = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect>
  </svg>
);
const IconMapa = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
    <line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line>
  </svg>
);
const IconPropostas = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
  </svg>
);
const IconConfig = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

// ─────────────────────────────────────────────────────────────────
export default function App() {
  // ── Estado global ──
  const [user, setUser] = useState(() => LS.g(STORAGE_KEYS.USER, null));
  const [isRestoring, setIsRestoring] = useState(!!LS.g(STORAGE_KEYS.USER, null));
  const [lots, setLots] = useState([]);
  const [isFetchingDb, setIsFetchingDb] = useState(true);

  // ── Restauração de Sessão ──
  useEffect(() => {
    const restoreSession = async () => {
      const stored = LS.g(STORAGE_KEYS.USER, null);
      if (!stored?.token) {
        setIsRestoring(false);
        return;
      }

      try {
        const res = await fetch(`${BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${stored.token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          // Atualiza dados do usuário mantendo o token
          const updatedUser = { ...data.user, token: stored.token };
          setUser(updatedUser);
          LS.s(STORAGE_KEYS.USER, updatedUser);
        } else {
          // Token expirado ou inválido
          setUser(null);
          localStorage.removeItem(STORAGE_KEYS.USER);
        }
      } catch (e) {
        console.error("Erro ao restaurar sessão:", e);
      } finally {
        setIsRestoring(false);
      }
    };

    restoreSession();
  }, []);

  const fetchLotes = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/lotes`);
      const data = await res.json();
      setLots(data);
      LS.s(STORAGE_KEYS.LOTS, data);
    } catch (err) {
      console.error("API error:", err);
    } finally {
      setIsFetchingDb(false);
    }
  }, []);

  useEffect(() => { fetchLotes(); }, [fetchLotes]);

  const [props, setProps] = useState(() => LS.g(STORAGE_KEYS.PROPS,  []));
  const [notifs, setNots] = useState(() => LS.g(STORAGE_KEYS.NOTIFS, []));
  const [cfg, setCfg]     = useState(() => LS.g(STORAGE_KEYS.CFG,    DEFAULT_CFG));

  // ── UI state ──
  const [tab, setTab]   = useState("espelho");
  const [sel, setSel]   = useState(null);
  const [fs,  setFS]    = useState("Todos");
  const [fq,  setFQ]    = useState("Todas");
  const [q,   setQ]     = useState("");
  const [toast, setToast] = useState(null);

  // ── Modals ──
  const [simOpen,  setSimOpen]  = useState(false);
  const [propOpen, setPropOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [ef, setEF]             = useState({});
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // ── Simulador ──
  const [sim, setSim] = useState({
    tabela: "SACOC", entrada_pct: 10, n: 175,
    com_anuais: true, anuais_qtd: 5, anuais_val: 2000,
  });

  // ── Pending Users (Admin) ──
  const [pendingUsersCount, setPendingUsersCount] = useState(0);

  const fetchPendingUsersCount = useCallback(async () => {
    if (!user || user.role?.toLowerCase() !== "admin") return;
    try {
      const res = await fetch(`${BASE_URL}/users`, { headers: { Authorization: `Bearer ${user.token}` } });
      const data = await res.json();
      const count = data.filter(u => u.status === "PENDENTE").length;
      setPendingUsersCount(count);
    } catch (e) {
      console.error("Erro ao carregar usuários pendentes:", e);
    }
  }, [user]);

  useEffect(() => {
    fetchPendingUsersCount();
  }, [fetchPendingUsersCount]);

  // ── Persistência ──
  useEffect(() => { LS.s(STORAGE_KEYS.USER,   user);   }, [user]);
  useEffect(() => { LS.s(STORAGE_KEYS.LOTS,   lots);   }, [lots]);
  useEffect(() => { LS.s(STORAGE_KEYS.PROPS,  props);  }, [props]);
  useEffect(() => { LS.s(STORAGE_KEYS.NOTIFS, notifs); }, [notifs]);
  useEffect(() => { LS.s(STORAGE_KEYS.CFG,    cfg);    }, [cfg]);

  // ── Timer de expiração de reservas ──
  useReservaTimer(setLots, setNots, setSel, fetchLotes);

  const toast$ = useCallback((msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const isAdmin = user?.role?.toLowerCase() === "admin";

  // ── Métricas ──
  const stats = useMemo(() => {
    const v  = lots.filter(l => l.status === "Vendido").length;
    const r  = lots.filter(l => l.status === "Reservado").length;
    const d  = lots.filter(l => l.status === "Disponível").length;
    const vv = lots.filter(l => l.status === "Vendido").reduce((s, l) => s + l.valor, 0);
    return { total: lots.length, v, r, d, vv, pct: ((v / lots.length) * 100).toFixed(1) };
  }, [lots]);

  // ── Filtros ──
  const filt = useMemo(() => lots.filter(l => {
    if (fs !== "Todos" && l.status !== fs) return false;
    if (fq !== "Todas" && l.q !== fq)     return false;
    if (q && !`${l.id} ${l.comprador || ""} ${l.n}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [lots, fs, fq, q]);

  const byQ = useMemo(() => {
    const m = {}; QUADRAS.forEach(x => m[x] = []);
    filt.forEach(l => { if (m[l.q]) m[l.q].push(l); });
    return m;
  }, [filt]);

  // ── Cálculo da simulação ──
  const result = useMemo(() => {
    if (!sel) return null;
    const entrada = R2(sel.valor * sim.entrada_pct / 100);
    const saldo   = R2(sel.valor - entrada);
    const sacoc   = sim.tabela === "SACOC" ? calcSACOC(saldo, sim.n, cfg.taxa_am) : null;
    const price   = sim.tabela === "PRICE" ? calcPRICE(saldo, sim.n, cfg.taxa_am) : null;
    const base    = sacoc ? sacoc.total : price.total;
    const anuais  = sim.com_anuais ? sim.anuais_qtd * sim.anuais_val : 0;
    return { entrada, saldo, sacoc, price, anuais, total: R2(entrada + base + anuais) };
  }, [sel, sim, cfg.taxa_am]);

  // ── Ações de proposta ──
  const submitProp = async (dadosCliente) => {
    if (!result || !sel) return;

    const payloadFinanceiro = {
      financiamento: {
        metodo: sim.tabela,
        valorOriginalTabela: sel.valor,
        valorFinalProposto: sel.valor,
        entradaOriginal: result.entrada,
        entradaProposta: result.entrada,
      },
      fluxoMensal: {
        quantidadeParcelas: sim.n,
        valorEsperadoParcela: result.sacoc?.parc1 ?? result.price?.parc ?? 0,
        taxaJurosAAMEnviada: cfg.taxa_am,
        aplicaCorrecaoIGPM: false,
      },
      baloesAnuais: sim.com_anuais
        ? Array.from({ length: sim.anuais_qtd }, (_, i) => ({ ano: i + 1, valor: sim.anuais_val }))
        : [],
      totalEstimado: result.total,
    };

    try {
      const res = await fetch(`${BASE_URL}/propostas`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          loteId: sel.id,
          nomeCliente: dadosCliente.nome,
          telefoneCliente: dadosCliente.fone || null,
          emailCliente: dadosCliente.email || null,
          payloadFinanceiro,
        }),
      });

      const data = await res.json();
      console.log("[PROPOSTA]", res.status, data);

      if (!res.ok) {
        toast$(data.error || `Erro ${res.status} ao enviar proposta`, "err");
        return;
      }

      // Cache local otimista para a aba Propostas (aprovação ainda local nesta fase)
      const nova = {
        id: data.id, loteId: sel.id, loteNum: sel.n, quadra: sel.q,
        valorLote: sel.valor, corretor: user.nome, corretorLogin: user.login,
        nome: dadosCliente.nome, fone: dadosCliente.fone, email: dadosCliente.email,
        sim: { ...sim }, result: { ...result },
        taxa_am: cfg.taxa_am, status: "Pendente", em: ts(),
      };
      setProps(p => [nova, ...p]);
      setNots(n => [{
        id: Date.now(), msg: `Nova proposta: Lote ${sel.id} — ${dadosCliente.nome}`,
        lida: false, em: ts(),
      }, ...n]);

      setPropOpen(false); setSimOpen(false);
      toast$(`✅ Proposta enviada! Lote ${sel.id} — ${dadosCliente.nome}`);
    } catch (e) {
      console.error("[PROPOSTA] Erro de rede:", e);
      toast$(`Falha de rede: ${e.message}`, "err");
    }
  };

  const callProposta = async (propostaId, acao, toastOk, toastErr) => {
    try {
      const res = await fetch(`${BASE_URL}/propostas/${propostaId}/${acao}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${user.token}`, "Content-Type": "application/json" },
      });
      const data = await res.json();
      console.log(`[PROPOSTA/${acao.toUpperCase()}]`, res.status, data);
      if (!res.ok) { toast$(data.error || `Erro ${res.status}`, "err"); return false; }
      return true;
    } catch (e) {
      console.error(`[PROPOSTA/${acao}]`, e);
      toast$(`Falha de rede: ${e.message}`, "err");
      return false;
    }
  };

  const aprovar = async (id) => {
    const ok = await callProposta(id, "aprovar");
    if (!ok) return;
    setProps(prev => prev.map(x => x.id === id ? { ...x, status: "Aprovada" } : x));
    await fetchLotes();
    const p = props.find(x => x.id === id);
    setNots(n => [{ id: Date.now(), msg: `✅ Aprovada: Lote ${p?.loteId} → ${p?.nome}`, lida: false, em: ts() }, ...n]);
    toast$(`Lote ${p?.loteId} vendido!`);
  };

  const recusar = async (id) => {
    const ok = await callProposta(id, "recusar");
    if (!ok) return;
    setProps(prev => prev.map(x => x.id === id ? { ...x, status: "Recusada" } : x));
    await fetchLotes();
    toast$("Proposta recusada. Lote liberado.", "err");
  };

  const pedirAjuste = async (id) => {
    const ok = await callProposta(id, "ajuste");
    if (!ok) return;
    setProps(prev => prev.map(x => x.id === id ? { ...x, status: "AjusteSolicitado" } : x));
    toast$("Ajuste solicitado. Lote continua reservado.");
  };

  // ── Callbacks do PainelLote ──
  const painelCallbacks = {
    onClose:    () => setSel(null),
    onSimular:  () => setSimOpen(true),
    onEditar:   (lot) => { setEF({ ...lot }); setEditOpen(true); },
    onReservar: async (upd) => {
      toast$("Iniciando reserva no banco de dados...");
      try {
        const res = await fetch(`${BASE_URL}/lotes/${upd.id}/reservar`, {
          method: "POST",
          headers: { 
            "Authorization": `Bearer ${user.token}`,
            "Content-Type": "application/json"
          }
        });
        const data = await res.json();
        console.log("[RESERVA]", res.status, data); // Debug real
        if (!res.ok) {
          toast$(`Erro ${res.status}: ${data.error || JSON.stringify(data)}`, "err");
          return;
        }
        toast$(`✅ ${data.message} Vence: ${new Date(data.reservaVenceEm).toLocaleTimeString()}`);
        await fetchLotes();
        setSel(prev => ({ ...prev, status: "Reservado", reservaVenceEm: data.reservaVenceEm, reservaOwnerId: user.id }));
      } catch (e) {
        console.error("[RESERVA] Erro de rede:", e);
        toast$(`Falha de rede: ${e.message}`, "err");
      }
    },
    onRenovar:  () => toast$("Renovação não disponível nesta fase do MVP.", "err"),
    onLiberar:  async (upd) => {
      toast$("Liberando reserva...");
      try {
        const res = await fetch(`${BASE_URL}/lotes/${upd.id}/liberar`, {
          method: "POST",
          headers: { "Authorization": `Bearer ${user.token}`, "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (!res.ok) {
          toast$(data.error || `Erro ${res.status} ao liberar`, "err");
          return;
        }
        toast$(`Reserva do Lote ${upd.id} liberada.`);
        await fetchLotes();
        setSel(null);
      } catch (e) {
        console.error("[LIBERAR]", e);
        toast$(`Falha de rede: ${e.message}`, "err");
      }
    },
    onEstornar: async (lot) => {
      toast$("Processando estorno...");
      try {
        const res = await fetch(`${BASE_URL}/lotes/${lot.id}/estornar`, {
          method: "POST",
          headers: { "Authorization": `Bearer ${user.token}`, "Content-Type": "application/json" },
        });
        const data = await res.json();
        console.log("[ESTORNO]", res.status, data);
        if (!res.ok) { toast$(data.error || `Erro ${res.status}`, "err"); return; }
        toast$(`↩️ Estorno concluído. Lote ${lot.id} liberado.`);
        await fetchLotes();
        setSel(null);
      } catch (e) {
        console.error("[ESTORNO]", e);
        toast$(`Falha de rede: ${e.message}`, "err");
      }
    },
  };

  const unread      = notifs.filter(n => !n.lida).length;
  const pendente    = props.filter(p => p.status === "Pendente").length;
  const minhasProps = isAdmin ? props : props.filter(p => p.corretorLogin === user?.login);

  const navTabs = [
    { k: "vista-geral", l: "⬛ Vista Geral" },
    { k: "lista",       l: "☰ Lista" },
    { k: "props",       l: `📋 Propostas${pendente > 0 ? ` (${pendente})` : ""}` },
    { k: "alertas",     l: `🔔 Alertas${unread > 0 ? ` (${unread})` : ""}`, show: isAdmin },
    { k: "espelho",     l: "🗺️ Espelho" },
    { k: "usuarios",    l: `👥 Usuários${pendingUsersCount > 0 ? ` (${pendingUsersCount})` : ""}`, show: isAdmin },
    { k: "import",      l: "📊 Importação", show: isAdmin },
    { k: "cfg",         l: "⚙️ Config",  show: isAdmin },
  ].filter(t => t.show !== false);

  const inp = (style) => ({
    background: "#141e2e", border: "1px solid #1e3a5f",
    borderRadius: 7, padding: "8px 10px", color: "#e2e8f0",
    fontSize: 13, outline: "none", ...style,
  });

  // ── RENDER: RESTORING SESSION ──
  if (isRestoring) {
    return (
      <div style={{ 
        background: "var(--navy-primary)", height: "100vh", 
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", 
        color: "white", fontFamily: "sans-serif" 
      }}>
        <img src="/logo.png" alt="Terra Vista" style={{ height: 48, marginBottom: 24, filter: "brightness(0) invert(1)" }} />
        <div style={{ fontSize: 14, fontWeight: 600, opacity: 0.8 }}>Restaurando sessão...</div>
      </div>
    );
  }

  // ── RENDER: LOGIN ──
  if (!user) return <LoginPage onLogin={setUser} />;

  // ── RENDER: APP ──
  if (isFetchingDb) {
    return (
      <div style={{ 
        background: "var(--navy-primary)", height: "100vh", 
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", 
        color: "white", fontFamily: "sans-serif" 
      }}>
        <img src="/logo.png" alt="Terra Vista" style={{ height: 48, marginBottom: 24, filter: "brightness(0) invert(1)" }} />
        <div style={{ fontSize: 14, fontWeight: 600, opacity: 0.8 }}>Conectando ao Banco de Dados...</div>
      </div>
    );
  }

  return (
    <div className={(tab === "espelho" ? "is-espelho-tab " : "") + "app-root"} style={{
      height: "100svh", overflow: "hidden",
      display: "flex", flexDirection: "column",
    }}>

      <style>
        {`
          .mobile-nav-btn { display: none; }
          .bottom-nav { display: none; }
          @media (max-width: 768px) {
            .app-main-layout { 
              flex-direction: column !important; 
              padding-bottom: calc(64px + env(safe-area-inset-bottom, 0px)) !important;
              height: auto !important;
              overflow: visible !important;
            }
            .desktop-nav { display: none !important; }
            .mobile-nav-btn { display: flex !important; }
            
            .premium-header { 
              height: 56px !important; 
              padding: 0 12px !important; 
              position: sticky; top: 0; z-index: 1100;
            }
            .premium-header img { height: 24px !important; }
            .role-badge { display: none !important; }
            .user-avatar { width: 28px !important; height: 28px !important; font-size: 10px !important; }

            .bottom-nav { 
              display: flex !important; 
              position: fixed; bottom: 0; left: 0; right: 0; 
              height: calc(60px + env(safe-area-inset-bottom, 0px)); 
              background: #060a0e; border-top: 1px solid #1e293b;
              z-index: 1200; justify-content: space-around; align-items: flex-start;
              padding-top: 8px;
              padding-bottom: env(safe-area-inset-bottom, 0px);
              box-shadow: 0 -4px 25px rgba(0,0,0,0.5);
            }
            .bottom-nav-item {
              display: flex; flex-direction: column; align-items: center; gap: 4px;
              color: #64748b; font-size: 9px; font-weight: 700;
              cursor: pointer; flex: 1; padding: 2px 0;
              text-transform: uppercase; letter-spacing: 0.3px;
              transition: all 0.2s;
            }
            .bottom-nav-item.active { color: var(--gold-primary); }
            .bottom-nav-item svg { width: 20px; height: 20px; transition: transform 0.2s; }
            .bottom-nav-item.active svg { transform: translateY(-2px); }
            
            .painel-lateral, .painel-flutuante { 
              position: fixed !important; bottom: calc(60px + env(safe-area-inset-bottom, 0px)) !important; 
              top: auto !important; right: 0 !important; left: 0 !important; width: 100% !important; 
              z-index: 1050 !important; max-height: 85vh !important; 
              border-radius: 20px 20px 0 0 !important; border: none !important; 
              box-shadow: 0 -15px 50px rgba(0,0,0,0.6) !important; 
            }
            .kpi-grid { 
              grid-template-columns: repeat(2, 1fr) !important; 
              padding: 12px 16px !important; 
              gap: 10px !important;
            }
            .kpi-card { padding: 10px 14px !important; }
            .kpi-icon-box { width: 28px !important; height: 28px !important; font-size: 12px !important; }
            .kpi-label { font-size: 8px !important; }
            .kpi-value { font-size: 12px !important; }
            .kpi-grid > div:last-child { grid-column: span 2; } 

            .is-espelho-tab .kpi-grid { display: none !important; }
            .espelho-header { display: none !important; }
            .filter-bar { padding: 8px 12px !important; gap: 6px !important; position: sticky; top: 56px; z-index: 1000; }
            .filter-bar select, .filter-bar input { font-size: 12px !important; padding: 6px 8px !important; }
            
            .page-container {
              padding-bottom: 40px !important; /* Espaço extra interno nas páginas */
            }

            /* Tabela Mobile para Cards */
            table thead { display: none; }
            table tr { 
              display: flex; flex-direction: column; 
              margin-bottom: 12px; padding: 12px; 
              border: 1px solid var(--border-color) !important; 
              border-radius: 12px; background: white !important;
            }
            table td { padding: 4px 0 !important; border: none !important; display: flex; justify-content: space-between; align-items: center; }
            table td::before { content: attr(data-label); font-weight: 700; font-size: 10px; color: var(--text-secondary); text-transform: uppercase; }
            table td:first-child { font-size: 16px; border-bottom: 1px solid #f1f5f9 !important; padding-bottom: 8px !important; margin-bottom: 4px; }
            table td:first-child::before { content: "Lote"; }

            /* Modais full-screen no mobile */
            .modal-overlay {
              z-index: 3000 !important;
              padding: 0 !important;
              align-items: flex-start !important;
            }
            .modal-content {
              width: 100% !important;
              height: 100% !important;
              max-height: 100svh !important;
              border-radius: 0 !important;
              padding: 24px 20px calc(24px + env(safe-area-inset-bottom, 24px)) !important;
              overflow-y: auto !important;
              border: none !important;
            }
          }
          @keyframes slideUp {
            from { transform: translateY(100px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>
      <Toast toast={toast} />

      {/* ── NAV ── */}
      <nav className="premium-header">
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <img 
            src="/logo.png" 
            alt="Residencial Terra Vista" 
            style={{ height: 32, objectFit: "contain", display: "block" }} 
          />
          <div style={{ height: 24, width: 1, background: "rgba(255,255,255,0.15)" }} className="role-badge" />
          <span className="role-badge" style={{ fontSize: 10, color: "var(--gold-primary)", background: "rgba(200, 162, 74, 0.1)",
            padding: "2px 8px", borderRadius: 4, textTransform: "uppercase", fontWeight: "800", letterSpacing: "0.5px" }}>
            {isAdmin ? "Administrador" : "Consultor VEL"}
          </span>
        </div>

        <div className="desktop-nav" style={{ gap: 4, display: "flex", marginLeft: 24 }}>
          {navTabs.map(({ k, l }) => (
            <div key={k} className={`premium-nav-item ${tab === k ? "active" : ""}`} onClick={() => setTab(k)}>
              {l}
            </div>
          ))}
        </div>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginRight: 8 }}>
            <div style={{ textAlign: "right", display: "none" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "white", lineHeight: 1 }}>{user.nome}</div>
            </div>
            <div className="user-avatar" style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--gold-primary)", 
              display: "flex", alignItems: "center", justifyContent: "center", color: "var(--navy-primary)", fontWeight: 800, fontSize: 12 }}>
              {user.nome.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
            </div>
          </div>
          
          <button className="mobile-nav-btn" onClick={() => setMenuOpen(!menuOpen)} style={{
            background: "transparent", border: "none", color: "white",
            fontSize: 24, cursor: "pointer", display: "flex", alignItems: "center"
          }}>
            ☰
          </button>
          
          <button onClick={() => { 
            setUser(null); 
            setSel(null); 
            setTab("espelho"); 
            localStorage.removeItem(STORAGE_KEYS.USER);
          }}
            className="btn-outline-gold"
            style={{ padding: "6px 12px", fontSize: 11, border: "1px solid rgba(200, 162, 74, 0.4)", color: "white" }}>
            Sair
          </button>
        </div>

        {menuOpen && (
          <div style={{
            position: "absolute", top: 64, left: 0, right: 0, background: "var(--navy-dark)",
            flexDirection: "column", padding: "16px", gap: 8, zIndex: 100,
            borderBottom: "1px solid var(--border-color)", boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            display: "flex"
          }}>
            {navTabs.map(({ k, l }) => (
              <div key={k} className={`premium-nav-item ${tab === k ? "active" : ""}`} onClick={() => { setTab(k); setMenuOpen(false); }}>
                {l}
              </div>
            ))}
          </div>
        )}
      </nav>


      {/* ── KPIs ── */}
      <div className="kpi-grid">
        {[
          { l: "Total",       v: stats.total,                         i: "🗂", bg: "#f8fafc" },
          { l: "Vendidos",    v: `${stats.v} (${stats.pct}%)`,        i: "✅", c: "#16a34a", bg: "#f0fdf4" },
          { l: "Reservados",  v: stats.r,                             i: "🔖", c: "#d97706", bg: "#fffbeb" },
          { l: "Disponíveis", v: stats.d,                             i: "🟢", c: "#0284c7", bg: "#f0f9ff" },
          isAdmin
            ? { l: "VGV Vendido",      v: brl0(stats.vv),                    i: "💰", c: "var(--navy-primary)", bg: "#f8fafc" }
            : { l: "Lotes disponíveis",v: `${stats.d} de ${stats.total}`,    i: "📊", c: "var(--text-secondary)", bg: "#f8fafc" },
        ].map((k, i) => (
          <div key={i} className="premium-card kpi-card">
            <div className="kpi-icon-box" style={{ background: k.bg }}>{k.i}</div>
            <div>
              <div className="kpi-label">{k.l}</div>
              <div className="kpi-value" style={{ color: k.c }}>{k.v}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ height: 4, background: "#f1f5f9", flexShrink: 0, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${stats.pct}%`,
          background: "linear-gradient(90deg, var(--navy-primary), var(--gold-primary))", transition: "width 0.5s" }} />
      </div>


      {/* ── FILTROS ── */}
      {(tab === "vista-geral" || tab === "lista" || tab === "espelho") && (
        <div className="filter-bar" style={{ 
          padding: "12px 24px", display: "flex", gap: 12, flexWrap: "wrap",
          alignItems: "center", borderBottom: "1px solid var(--border-color)",
          background: "white", flexShrink: 0 
        }}>
          <div style={{ position: "relative", minWidth: 240 }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", opacity: 0.4 }}>🔍</span>
            <input value={q} onChange={e => setQ(e.target.value)}
              placeholder="Lote ou comprador..."
              style={{ 
                width: "100%", background: "#F8FAFC", border: "1px solid var(--border-color)",
                borderRadius: 8, padding: "8px 12px 8px 36px", color: "var(--text-primary)",
                fontSize: 13, outline: "none"
              }} />
          </div>

          <div style={{ display: "flex", gap: 6, background: "#F1F5F9", padding: 4, borderRadius: 10 }}>
            {["Todos", "Disponível", "Reservado", "Vendido"].map(f => (
              <button key={f} onClick={() => setFS(f)} style={{
                padding: "6px 16px", borderRadius: 7, border: "none", cursor: "pointer",
                fontSize: 12, fontWeight: 600,
                background: fs === f ? (SC[f]?.bg || "var(--navy-primary)") : "transparent",
                color: fs === f ? "#fff" : "var(--text-secondary)",
                transition: "all 0.2s"
              }}>
                {f}
              </button>
            ))}
          </div>

          <div style={{ height: 24, width: 1, background: "var(--border-color)", margin: "0 8px" }} />

          <div style={{ display: "flex", gap: 3, marginLeft: "auto", background: "#F1F5F9", padding: 4, borderRadius: 10 }}>
            {["Todas", ...QUADRAS].map(x => (
              <button key={x} onClick={() => setFQ(x)} style={{
                padding: "6px 10px", borderRadius: 7, border: "none", cursor: "pointer",
                fontSize: 11, fontWeight: 600,
                background: fq === x ? "var(--navy-primary)" : "transparent",
                color: fq === x ? "#fff" : "var(--text-secondary)",
                transition: "all 0.2s"
              }}>
                {x}
              </button>
            ))}
          </div>

        </div>
      )}

      {/* ── CONTEÚDO PRINCIPAL ── */}
      <div className="app-main-layout" style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0, position: "relative" }}>

        {/* Vista Geral */}
        {tab === "vista-geral" && (
          <VistaGeralPage filt={filt} byQ={byQ} sel={sel} setSel={setSel} fq={fq} />
        )}

        {/* Lista */}
        {tab === "lista" && (
          <ListaPage
            filt={filt} isAdmin={isAdmin} sel={sel} setSel={setSel}
            onEditar={lot => { setEF({ ...lot }); setEditOpen(true); }}
          />
        )}

        {/* Propostas */}
        {tab === "props" && (
          <PropostasPage
            propostas={minhasProps} isAdmin={isAdmin}
            onAprovar={aprovar} onRecusar={recusar} onPedirAjuste={pedirAjuste}
          />
        )}

        {/* Alertas */}
        {tab === "alertas" && isAdmin && (
          <AlertasPage
            notifs={notifs} unread={unread}
            onMarcarLidas={() => setNots(n => n.map(x => ({ ...x, lida: true })))}
          />
        )}

        {/* Espelho (PoC) */}
        {tab === "espelho" && (
          <EspelhoPage lots={lots} filt={filt} sel={sel} setSel={setSel} />
        )}

        {/* Config */}
        {tab === "cfg" && isAdmin && <ConfigPage cfg={cfg} setCfg={setCfg} />}

        {/* Usuários */}
        {tab === "usuarios" && isAdmin && <UsuariosPage user={user} onUserUpdated={fetchPendingUsersCount} />}

        {/* Importação */}
        {tab === "import" && isAdmin && <ImportacaoPage user={user} onRefreshLotes={fetchLotes} />}

        {/* Painel Lateral — compartilhado com Vista Geral e Lista */}
        {(tab === "vista-geral" || tab === "lista") && sel && !simOpen && !propOpen && !editOpen && (
          <PainelLote
            lot={sel} isAdmin={isAdmin} cfg={cfg} user={user}
            modo="lateral"
            {...painelCallbacks}
          />
        )}

        {/* Painel Flutuante — sobreposição para o Espelho */}
        {tab === "espelho" && sel && !simOpen && !propOpen && !editOpen && (
          <PainelLote
            lot={sel} isAdmin={isAdmin} cfg={cfg} user={user}
            modo="flutuante"
            {...painelCallbacks}
          />
        )}
      </div>

      {/* ── MODAL: Simulador ── */}
      {simOpen && sel && (
        <SimuladorModal
          sel={sel} sim={sim} setSim={setSim} result={result} cfg={cfg}
          canPropose={(isAdmin && sel.status === "Disponível") || (sel.status === "Reservado" && sel.reservaOwnerId === user.id)}
          proposeMessage={
            sel.status === "Disponível" 
              ? "Para enviar proposta, reserve este lote primeiro." 
              : "Lote reservado por outro corretor. Simulação liberada, proposta bloqueada enquanto a reserva estiver ativa."
          }
          onReservar={() => painelCallbacks.onReservar({
            ...sel,
            status:        "Reservado",
            reservado_em:  isoNow(),
            reservado_ate: isoAdd(cfg.reserva_horas),
            reservado_por: user.login,
          })}
          onProximo={() => { setSimOpen(false); setPropOpen(true); }}
          onClose={() => setSimOpen(false)}
        />
      )}

      {/* ── MODAL: Proposta ── */}
      {propOpen && sel && (
        <PropModal
          sel={sel} sim={sim} result={result}
          onSubmit={submitProp}
          onBack={() => { setPropOpen(false); setSimOpen(true); }}
          onClose={() => setPropOpen(false)}
        />
      )}

      {/* ── MODAL: Editar Lote (admin) ── */}
      {editOpen && isAdmin && (
        <div className="modal-overlay" style={{ position: "fixed", inset: 0, background: "rgba(19, 53, 65, 0.8)", zIndex: 2000,
          display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
          <div className="modal-content" style={{ background: "white", border: "1px solid var(--border-color)",
            borderRadius: 16, padding: 32, width: 400, maxWidth: "100%", boxShadow: "var(--shadow-lg)" }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: "var(--navy-primary)", marginBottom: 20, letterSpacing: "-0.5px" }}>
              🛠️ Editar Lote {ef.id}
            </div>
            {[
              { l: "Status do Lote",     k: "status",    t: "select", opts: ["Disponível", "Reservado", "Vendido"] },
              { l: "Nome do Comprador",  k: "comprador", t: "text" },
              { l: "Valor de Tabela (R$)", k: "valor",     t: "number" },
            ].map(({ l, k, t, opts }) => (
              <div key={k} style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 10, color: "var(--text-secondary)", marginBottom: 6,
                  textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700 }}>{l}</div>
                {t === "select"
                  ? <select value={ef[k] || ""} onChange={e => setEF(f => ({ ...f, [k]: e.target.value }))}
                      style={{ width: "100%", background: "#f8fafc", border: "1px solid var(--border-color)",
                        borderRadius: 10, padding: "12px 14px", color: "var(--navy-primary)", fontSize: 14, outline: "none", fontWeight: 600 }}>
                      {opts.map(o => <option key={o}>{o}</option>)}
                    </select>
                  : <input type={t} value={ef[k] || ""}
                      onChange={e => setEF(f => ({ ...f, [k]: t === "number" ? parseFloat(e.target.value) || 0 : e.target.value }))}
                      style={{ width: "100%", background: "#f8fafc", border: "1px solid var(--border-color)",
                        borderRadius: 10, padding: "12px 14px", color: "var(--navy-primary)", fontSize: 14,
                        outline: "none", boxSizing: "border-box", fontWeight: 600 }}
                    />
                }
              </div>
            ))}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 24 }}>
              <button 
                className="btn-primary"
                disabled={isSavingEdit}
                onClick={async () => {
                  // Validação: Se status for Vendido, exige comprador
                  if (ef.status === "Vendido" && (!ef.comprador || ef.comprador.trim().length < 3)) {
                    toast$("Para marcar como Vendido, informe o nome completo do comprador.", "err");
                    return;
                  }

                  setIsSavingEdit(true);
                  try {
                    const res = await fetch(`${BASE_URL}/lotes/${ef.id}`, {
                      method: "PATCH",
                      headers: {
                        "Authorization": `Bearer ${user.token}`,
                        "Content-Type": "application/json"
                      },
                      body: JSON.stringify({
                        status: ef.status,
                        comprador: ef.comprador,
                        valor: ef.valor,
                      })
                    });

                    const data = await res.json();
                    
                    if (!res.ok) {
                      toast$(data.error || "Erro ao persistir no banco de dados", "err");
                      return;
                    }

                    // SUCESSO REAL: Atualiza estado local apenas após confirmação do backend
                    setLots(p => p.map(l => l.id === data.id ? data : l));
                    setSel(data);
                    setEditOpen(false);
                    toast$(`✅ Lote ${data.id} atualizado com sucesso!`);
                  } catch (e) {
                    console.error("[EDITAR] Falha crítica de rede:", e);
                    toast$(`Falha de conexão: ${e.message}. O dado NÃO foi salvo.`, "err");
                  } finally {
                    setIsSavingEdit(false);
                  }
                }} 
                style={{ 
                  width: "100%", background: isSavingEdit ? "#94a3b8" : "#0f172a", color: "#fff",
                  padding: "14px 0", borderRadius: 10, cursor: isSavingEdit ? "not-allowed" : "pointer", 
                  fontWeight: 700, fontSize: 14, border: "none",
                  transition: "all 0.2s"
                }}
              >
                {isSavingEdit ? "⌛ Gravando no banco..." : "💾 Salvar alterações"}
              </button>

              <button 
                onClick={() => setEditOpen(false)}
                disabled={isSavingEdit}
                style={{ 
                  width: "100%", background: "transparent", border: "1px solid #1e293b", color: "#94a3b8",
                  padding: "10px 0", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Legenda ── */}
      <div style={{
        position: "fixed", bottom: 8, left: 8,
        background: "#090e16cc", backdropFilter: "blur(8px)",
        border: "1px solid #1e3a5f", borderRadius: 7,
        padding: "5px 11px", display: "flex", gap: 11,
        pointerEvents: "none", zIndex: 50,
      }}>
        {Object.entries(SC).map(([s, c]) => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 7, height: 7, borderRadius: 2, background: c.bg }} />
            <span style={{ fontSize: 9, color: "#475569" }}>{s}</span>
          </div>
        ))}
      </div>
      {/* ── BOTTOM NAV (Mobile) ── */}
      <div className="bottom-nav">
        {[
          { k: "vista-geral", l: "Geral", i: <IconGeral /> },
          { k: "espelho",     l: "Mapa",  i: <IconMapa /> },
          { k: "props",       l: "Propostas", i: <IconPropostas /> },
          { k: "cfg",         l: "Config", i: <IconConfig />, show: isAdmin },
        ].filter(t => t.show !== false).map(t => (
          <div key={t.k} className={`bottom-nav-item ${tab === t.k ? "active" : ""}`} onClick={() => setTab(t.k)}>
            {t.i}
            <span>{t.l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

