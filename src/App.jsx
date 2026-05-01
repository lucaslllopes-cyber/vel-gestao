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

// ─────────────────────────────────────────────────────────────────
export default function App() {
  // ── Estado global ──
  const [user, setUser]   = useState(null);
  const [lots, setLots] = useState([]);
  const [isFetchingDb, setIsFetchingDb] = useState(true);

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

  // ── RENDER: LOGIN ──
  if (!user) return <LoginPage onLogin={setUser} />;

  // ── RENDER: APP ──
  if (isFetchingDb) {
    return (
      <div style={{ background: "#060a0e", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", fontFamily: "sans-serif" }}>
        Conectando ao Banco de Dados Base (Terra Vista API)...
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
            .app-main-layout { flex-direction: column !important; }
            .desktop-nav { display: none !important; }
            .mobile-nav-btn { display: flex !important; }
            .bottom-nav { 
              display: flex !important; 
              position: fixed; bottom: 0; left: 0; right: 0; 
              height: 64px; background: white; border-top: 1px solid var(--border-color);
              z-index: 200; justify-content: space-around; align-items: center;
              padding-bottom: env(safe-area-inset-bottom, 0px);
              box-shadow: 0 -4px 12px rgba(0,0,0,0.05);
            }
            .bottom-nav-item {
              display: flex; flex-direction: column; align-items: center; gap: 4px;
              color: var(--text-secondary); font-size: 10px; font-weight: 600;
              cursor: pointer; flex: 1; padding: 8px 0;
            }
            .bottom-nav-item.active { color: var(--navy-primary); }
            .bottom-nav-item i { font-size: 20px; }
            
            .painel-lateral, .painel-flutuante { 
              position: fixed !important; bottom: 64px !important; top: auto !important; 
              right: 0 !important; left: 0 !important; width: 100% !important; 
              z-index: 150 !important; max-height: 70vh !important; 
              border-radius: 24px 24px 0 0 !important; border: none !important; 
              border-top: 1px solid var(--border-color) !important; 
              box-shadow: 0 -10px 40px rgba(0,0,0,0.1) !important; 
            }
            .kpi-grid { grid-template-columns: repeat(2, 1fr) !important; padding: 12px !important; }
            .is-espelho-tab .kpi-grid { display: none !important; }
            .espelho-header { display: none !important; }
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
          <div style={{ height: 24, width: 1, background: "rgba(255,255,255,0.15)" }} />
          <span style={{ fontSize: 10, color: "var(--gold-primary)", background: "rgba(200, 162, 74, 0.1)",
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
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--gold-primary)", 
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
          
          <button onClick={() => { setUser(null); setSel(null); setTab("espelho"); }}
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
        {(tab === "vista-geral" || tab === "lista") && sel && (
          <PainelLote
            lot={sel} isAdmin={isAdmin} cfg={cfg} user={user}
            modo="lateral"
            {...painelCallbacks}
          />
        )}

        {/* Painel Flutuante — sobreposição para o Espelho */}
        {tab === "espelho" && sel && (
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
        <div style={{ position: "fixed", inset: 0, background: "#000c", zIndex: 200,
          display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#090e16", border: "1px solid #1e293b",
            borderRadius: 12, padding: 22, width: 360, maxWidth: "90vw" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", marginBottom: 14 }}>
              Editar Lote {ef.id}
            </div>
            {[
              { l: "Status",     k: "status",    t: "select", opts: ["Disponível", "Reservado", "Vendido"] },
              { l: "Comprador",  k: "comprador", t: "text" },
              { l: "Valor (R$)", k: "valor",     t: "number" },
            ].map(({ l, k, t, opts }) => (
              <div key={k} style={{ marginBottom: 11 }}>
                <div style={{ fontSize: 10, color: "#64748b", marginBottom: 3,
                  textTransform: "uppercase", letterSpacing: "0.5px" }}>{l}</div>
                {t === "select"
                  ? <select value={ef[k] || ""} onChange={e => setEF(f => ({ ...f, [k]: e.target.value }))}
                      style={{ width: "100%", background: "#141e2e", border: "1px solid #1e3a5f",
                        borderRadius: 7, padding: "8px 10px", color: "#e2e8f0", fontSize: 13, outline: "none" }}>
                      {opts.map(o => <option key={o}>{o}</option>)}
                    </select>
                  : <input type={t} value={ef[k] || ""}
                      onChange={e => setEF(f => ({ ...f, [k]: t === "number" ? parseFloat(e.target.value) || 0 : e.target.value }))}
                      style={{ width: "100%", background: "#141e2e", border: "1px solid #1e3a5f",
                        borderRadius: 7, padding: "8px 10px", color: "#e2e8f0", fontSize: 13,
                        outline: "none", boxSizing: "border-box" }}
                    />
                }
              </div>
            ))}
            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              <button onClick={() => {
                setLots(p => p.map(l => l.id === ef.id ? { ...l, ...ef, valor: +ef.valor } : l));
                setSel(ef); setEditOpen(false); toast$("Lote atualizado.");
              }} style={{ flex: 1, background: "#16a34a", border: "none", color: "#fff",
                padding: "10px 0", borderRadius: 7, cursor: "pointer", fontWeight: 700 }}>
                Salvar
              </button>
              <button onClick={() => setEditOpen(false)}
                style={{ flex: 1, background: "#1e293b", border: "none", color: "#94a3b8",
                  padding: "10px 0", borderRadius: 7, cursor: "pointer" }}>
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
        border: "1px solid #1e293b", borderRadius: 7,
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
          { k: "vista-geral", l: "Geral", i: "⬛" },
          { k: "espelho",     l: "Mapa",  i: "🗺️" },
          { k: "props",       l: "Propostas", i: "📋" },
          { k: "cfg",         l: "Config", i: "⚙️", show: isAdmin },
        ].filter(t => t.show !== false).map(t => (
          <div key={t.k} className={`bottom-nav-item ${tab === t.k ? "active" : ""}`} onClick={() => setTab(t.k)}>
            <span style={{ fontSize: 20 }}>{t.i}</span>
            <span>{t.l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

