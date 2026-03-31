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
  const [tab, setTab]   = useState("vista-geral");
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
        setSel(prev => ({ ...prev, status: "Reservado", reservaVenceEm: data.reservaVenceEm }));
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
    { k: "usuarios",    l: "👥 Usuários", show: isAdmin },
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
    <div className={tab === "espelho" ? "is-espelho-tab" : ""} style={{
      fontFamily: "'DM Sans','Segoe UI',sans-serif",
      background: "#060a0e", minHeight: "100vh",
      color: "#e2e8f0", display: "flex", flexDirection: "column",
    }}>
      <style>
        {`
          .mobile-nav-btn { display: none; }
          @media (max-width: 768px) {
            .app-main-layout { flex-direction: column !important; }
            .desktop-nav { display: none !important; }
            .mobile-nav-btn { display: flex !important; }
            .painel-lateral { position: absolute !important; bottom: 0 !important; top: auto !important; right: 0 !important; left: 0 !important; width: 100% !important; z-index: 100 !important; max-height: 70vh !important; padding: 15px !important; padding-bottom: calc(15px + env(safe-area-inset-bottom, 0px)) !important; border-radius: 18px 18px 0 0 !important; border: none !important; border-top: 1px solid #1e293b !important; box-shadow: 0 -10px 40px rgba(0,0,0,0.8) !important; overflow-y: auto !important; }
            .painel-flutuante { position: absolute !important; bottom: 0 !important; top: auto !important; right: 0 !important; left: 0 !important; width: 100% !important; z-index: 100 !important; max-height: 70vh !important; padding: 15px !important; padding-bottom: calc(15px + env(safe-area-inset-bottom, 0px)) !important; border-radius: 18px 18px 0 0 !important; border: none !important; border-top: 1px solid #1e293b !important; box-shadow: 0 -10px 40px rgba(0,0,0,0.8) !important; overflow-y: auto !important; }
            .kpi-grid { grid-template-columns: repeat(2, 1fr) !important; }
            .kpi-grid > div:last-child { grid-column: span 2 !important; }
            .is-espelho-tab .kpi-grid { display: none !important; }
            .is-espelho-tab .filter-bar { padding: 4px 10px !important; gap: 4px !important; }
            .espelho-header { display: none !important; }
            .espelho-legend { bottom: auto !important; top: 10px !important; right: 10px !important; left: auto !important; padding: 6px 10px !important; display: flex !important; flex-direction: row !important; align-items: center !important; gap: 8px !important; }
            .espelho-legend-title { display: none !important; }
            .espelho-legend-items { flex-direction: row !important; gap: 6px !important; }
          }
        `}
      </style>
      <Toast toast={toast} />

      {/* ── NAV ── */}
      <div style={{
        background: "#133541", borderBottom: "1px solid rgba(229, 231, 235, 0.1)",
        padding: "0 16px", display: "flex", alignItems: "center",
        height: 56, gap: 12, position: "sticky", top: 0, zIndex: 90, flexShrink: 0,
      }}>
        <img 
          src="/logo.png" 
          alt="Residencial Terra Vista" 
          style={{ height: 38, objectFit: "contain", display: "block" }} 
        />
        <span style={{ fontSize: 9, color: "#C8A24A", background: "#1F4E5F", border: "1px solid rgba(200, 162, 74, 0.3)",
          padding: "3px 8px", borderRadius: 4, textTransform: "uppercase", fontWeight: "700" }}>
          {isAdmin ? "Admin" : "Corretor"}
        </span>

        <div className="desktop-nav" style={{ gap: 2, marginLeft: 10, display: "flex" }}>
          {navTabs.map(({ k, l }) => (
            <button key={k} onClick={() => setTab(k)} style={{
              padding: "5px 11px", borderRadius: 5, border: "none", cursor: "pointer",
              fontSize: 11, fontWeight: 600,
              background: tab === k ? "#1F4E5F" : "transparent",
              color: tab === k ? "#C8A24A" : "#94A3B8",
              transition: "all 0.2s"
            }}>
              {l}
            </button>
          ))}
        </div>

        <button className="mobile-nav-btn" onClick={() => setMenuOpen(!menuOpen)} style={{
          marginLeft: "auto", background: "transparent", border: "none", color: "#C8A24A",
          fontSize: 22, cursor: "pointer", padding: "0 8px", alignItems: "center"
        }}>
          ☰
        </button>

        {menuOpen && (
          <div className="mobile-nav-btn" style={{
            position: "absolute", top: 56, left: 0, right: 0, background: "#0F2F3A",
            flexDirection: "column", padding: "12px 16px 20px", gap: 8, zIndex: 100,
            borderBottom: "1px solid rgba(229,231,235,0.1)", boxShadow: "0 10px 30px rgba(0,0,0,0.6)"
          }}>
            {navTabs.map(({ k, l }) => (
              <button key={k} onClick={() => { setTab(k); setMenuOpen(false); }} style={{
                padding: "12px 16px", borderRadius: 6, border: "none", cursor: "pointer",
                fontSize: 14, fontWeight: 600, textAlign: "left",
                background: tab === k ? "#1F4E5F" : "transparent",
                color: tab === k ? "#C8A24A" : "#E2E8F0",
                transition: "all 0.2s"
              }}>
                {l}
              </button>
            ))}
          </div>
        )}

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 11, color: "#E2E8F0", fontWeight: 500 }}>{user.nome}</span>
          <button onClick={() => { setUser(null); setSel(null); setTab("vista-geral"); }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)"}
            style={{ 
              background: "rgba(255, 255, 255, 0.08)", border: "none", color: "#F8FAFC",
              padding: "5px 10px", borderRadius: 5, cursor: "pointer", fontSize: 10,
              fontWeight: 600, transition: "background 0.2s" 
            }}>
            Sair
          </button>
        </div>
      </div>

      {/* ── KPIs ── */}
      <div className="kpi-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 1,
        background: "#0d222b", borderBottom: "1px solid #0d222b", flexShrink: 0 }}>
        {[
          { l: "Total",       v: stats.total,                         i: "🗂" },
          { l: "Vendidos",    v: `${stats.v} (${stats.pct}%)`,        i: "✅", c: "#4ade80" },
          { l: "Reservados",  v: stats.r,                             i: "🔖", c: "#FBBF24" },
          { l: "Disponíveis", v: stats.d,                             i: "🟢", c: "#38bdf8" },
          isAdmin
            ? { l: "VGV Vendido",      v: brl0(stats.vv),                    i: "💰", c: "#FBBF24" }
            : { l: "Lotes disponíveis",v: `${stats.d} de ${stats.total}`,    i: "📊", c: "#94a3b8" },
        ].map((k, i) => (
          <div key={i} style={{ background: "#1C4A5A", padding: "10px 13px" }}>
            <div style={{ fontSize: 9, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {k.i} {k.l}
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: k.c || "#f1f5f9" }}>{k.v}</div>
          </div>
        ))}
      </div>
      <div style={{ height: 3, background: "#1e293b", flexShrink: 0 }}>
        <div style={{ height: "100%", width: `${stats.pct}%`,
          background: "linear-gradient(90deg,#1F4E5F,#C8A24A)", transition: "width 0.5s" }} />
      </div>

      {/* ── FILTROS (Vista Geral, Lista + Espelho) ── */}
      {(tab === "vista-geral" || tab === "lista" || tab === "espelho") && (
        <div className="filter-bar" style={{ padding: "8px 16px", display: "flex", gap: 7, flexWrap: "wrap",
          alignItems: "center", borderBottom: "1px solid #0d222b",
          background: "#163A48", flexShrink: 0 }}>
          <input value={q} onChange={e => setQ(e.target.value)}
            placeholder="🔍 Lote ou comprador..."
            style={{ ...inp({ minWidth: 190, padding: "5px 10px", fontSize: 12 }) }} />
          <div style={{ display: "flex", gap: 3 }}>
            {["Todos", "Disponível", "Reservado", "Vendido"].map(f => (
              <button key={f} onClick={() => setFS(f)} style={{
                padding: "4px 9px", borderRadius: 4, border: "none", cursor: "pointer",
                fontSize: 11, fontWeight: 600,
                background: fs === f ? (SC[f]?.bg || "#3b82f6") : "#1e293b",
                color: fs === f ? "#fff" : "#64748b",
              }}>{f}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 3, marginLeft: "auto" }}>
            {["Todas", ...QUADRAS].map(x => (
              <button key={x} onClick={() => setFQ(x)} style={{
                padding: "4px 8px", borderRadius: 4, border: "none", cursor: "pointer",
                fontSize: 11, fontWeight: 700,
                background: fq === x ? "#1F4E5F" : "#1e293b",
                color: fq === x ? "#C8A24A" : "#64748b",
              }}>{x === "Todas" ? "Todas" : "Q" + x}</button>
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
        {tab === "usuarios" && isAdmin && <UsuariosPage user={user} />}

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
    </div>
  );
}
