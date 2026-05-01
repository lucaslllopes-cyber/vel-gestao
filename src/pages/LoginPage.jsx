// ─────────────────────────────────────────────────────────────────
// LOGIN PAGE
// ─────────────────────────────────────────────────────────────────
import { useState } from "react";
import { Field } from "../components/Field";
import { USERS } from "../data/constants";
import { BASE_URL } from "../utils/api";

export function LoginPage({ onLogin }) {
  const [lf, setLF] = useState({ u: "", p: "" });
  const [rf, setRF] = useState({ nome: "", email: "", telefone: "", imobiliaria: "", senha: "" });
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  const doLogin = async () => {
    setErr(""); setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: lf.u.trim().toLowerCase(), senha: lf.p }),
      });
      const data = await res.json();
      if (!res.ok) { setErr(data.error || "Credenciais inválidas."); return; }
      // data = { token, user: { id, login, role, nome } }
      
      // FIX para iOS/Safari: remove o foco do input para forçar o fechamento do teclado
      // e resetar o zoom automático antes da transição da tela
      if (document.activeElement) {
        document.activeElement.blur();
      }
      
      setTimeout(() => {
        window.scrollTo(0, 0);
        onLogin({ ...data.user, token: data.token });
      }, 150);
    } catch (e) {
      setErr("Sem conexão com o servidor. Verifique se o backend está rodando.");
    } finally {
      setLoading(false);
    }
  };

  const doRequestAccess = async () => {
    setErr("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/solicitar-acesso`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: rf.nome,
          login: rf.email,
          senha: rf.senha,
          telefone: rf.telefone,
          imobiliaria: rf.imobiliaria
        }),
      });
      const data = await res.json();
      if (!res.ok) { setErr(data.error || "Erro ao solicitar acesso."); return; }
      
      setSuccess("Solicitação enviada! Aguarde a aprovação da gestão.");
      setIsRequesting(false);
      setRF({ nome: "", email: "", telefone: "", imobiliaria: "", senha: "" });
    } catch (e) {
      setErr("Sem conexão com o servidor. Verifique se o backend está rodando.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "var(--navy-primary)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px"
    }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(circle at top right, rgba(200,162,74,0.1), transparent 40%), radial-gradient(circle at bottom left, rgba(0,0,0,0.3), transparent 50%)",
      }} />
      
      <div className="premium-card" style={{
        position: "relative", width: 400, maxWidth: "100%",
        background: "var(--bg-card)", padding: "48px 40px",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        borderRadius: "var(--radius-lg)"
      }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <img src="/logo.png" alt="Terra Vista" style={{ height: 48, marginBottom: 16, filter: "brightness(0.2)" }} />
          <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 4,
            textTransform: "uppercase", letterSpacing: "2px", fontWeight: 700 }}>
            Painel de Gestão Comercial
          </div>
        </div>


        {err && (
          <div style={{
            background: "#2e0a0a", border: "1px solid #dc262633",
            borderRadius: 8, padding: "9px 13px", color: "#f87171",
            fontSize: 13, marginBottom: 13,
          }}>
            {err}
          </div>
        )}

        {success && (
          <div style={{
            background: "#14532d22", border: "1px solid #14532d",
            borderRadius: 8, padding: "9px 13px", color: "#4ade80",
            fontSize: 13, marginBottom: 13, textAlign: "center"
          }}>
            {success}
          </div>
        )}

        {!isRequesting ? (
          <form onSubmit={e => { e.preventDefault(); doLogin(); }}>
            <Field
              label="Usuário"
              name="username"
              value={lf.u}
              onChange={v => setLF(f => ({ ...f, u: v }))}
              placeholder="Usuário"
              autoComplete="username"
              required
            />
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: "#64748b", marginBottom: 4,
                textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>
                Senha
              </div>
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                value={lf.p}
                onChange={e => setLF(f => ({ ...f, p: e.target.value }))}
                required
                style={{
                  width: "100%", background: "#f8fafc", border: "1px solid var(--border-color)",
                  borderRadius: 8, padding: "12px 14px", color: "var(--text-primary)",
                  fontSize: 14, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s"
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: "100%", padding: "14px 0", fontSize: 16, marginTop: 12 }}
            >
              {loading ? "Autenticando..." : "Entrar no Sistema"}
            </button>


            <div style={{ marginTop: 20, textAlign: "center" }}>
              <button
                type="button"
                onClick={() => { setIsRequesting(true); setErr(""); setSuccess(""); }}
                style={{
                  background: "none", border: "none", fontSize: 12, color: "#475569",
                  textDecoration: "underline", padding: 0, cursor: "pointer",
                }}
              >
                Solicitar acesso
              </button>
            </div>
          </form>
        ) : (
          <>
            <Field label="Nome Completo" value={rf.nome} onChange={v => setRF(f => ({...f, nome: v}))} placeholder="Nome" />
            <Field label="E-mail (Login)" value={rf.email} onChange={v => setRF(f => ({...f, email: v}))} placeholder="E-mail" />
            <Field label="Telefone / WhatsApp" value={rf.telefone} onChange={v => setRF(f => ({...f, telefone: v}))} placeholder="(00) 00000-0000" />
            <Field label="Imobiliária" value={rf.imobiliaria} onChange={v => setRF(f => ({...f, imobiliaria: v}))} placeholder="Imobiliária (Opcional)" />
            
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10, color: "#64748b", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>
                Crie sua Senha
              </div>
              <input
                type="password"
                value={rf.senha}
                onChange={e => setRF(f => ({...f, senha: e.target.value}))}
                style={{
                  width: "100%", background: "#141e2e", border: "1px solid #1e3a5f",
                  borderRadius: 7, padding: "9px 11px", color: "#e2e8f0", fontSize: 13, outline: "none", boxSizing: "border-box"
                }}
              />
            </div>

            <button
              onClick={doRequestAccess}
              disabled={loading}
              style={{
                width: "100%", background: loading ? "#3b82f688" : "linear-gradient(135deg,#3b82f6,#2563eb)",
                border: "none", color: "#fff", padding: "12px 0", borderRadius: 8,
                cursor: loading ? "not-allowed" : "pointer", fontWeight: 700, fontSize: 15,
              }}
            >
              {loading ? "Enviando..." : "Enviar Solicitação"}
            </button>

            <div style={{ marginTop: 20, textAlign: "center" }}>
              <button
                onClick={() => { setIsRequesting(false); setErr(""); }}
                style={{ background: "none", border: "none", fontSize: 12, color: "#475569", textDecoration: "underline", padding: 0, cursor: "pointer" }}
              >
                Voltar ao Login
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
