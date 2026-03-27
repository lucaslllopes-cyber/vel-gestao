// ─────────────────────────────────────────────────────────────────
// LOGIN PAGE
// ─────────────────────────────────────────────────────────────────
import { useState } from "react";
import { Field } from "../components/Field";
import { USERS } from "../data/constants";

export function LoginPage({ onLogin }) {
  const [lf, setLF] = useState({ u: "", p: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const doLogin = async () => {
    setErr(""); setLoading(true);
    try {
      const res = await fetch("https://api.velgestao.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: lf.u.trim().toLowerCase(), senha: lf.p }),
      });
      const data = await res.json();
      if (!res.ok) { setErr(data.error || "Credenciais inválidas."); return; }
      // data = { token, user: { id, login, role, nome } }
      onLogin({ ...data.user, token: data.token });
    } catch (e) {
      setErr("Sem conexão com o servidor. Verifique se o backend está rodando.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#060a0e",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Sans','Segoe UI',sans-serif",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage:
          "radial-gradient(ellipse at 30% 30%,#0a2010 0%,transparent 60%)," +
          "radial-gradient(ellipse at 70% 70%,#140a00 0%,transparent 60%)",
      }} />
      <div style={{
        position: "relative", width: 360,
        background: "#0c1118", border: "1px solid #1e293b",
        borderRadius: 16, padding: 36, boxShadow: "0 32px 80px #000d",
      }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 44, marginBottom: 8 }}>🌿</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.5px" }}>
            Terra Vista
          </div>
          <div style={{ fontSize: 11, color: "#475569", marginTop: 3,
            textTransform: "uppercase", letterSpacing: "1.5px" }}>
            Residencial · Caldas MG
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

        <Field
          label="Usuário"
          value={lf.u}
          onChange={v => setLF(f => ({ ...f, u: v }))}
          placeholder="admin ou corretor1"
        />
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: "#64748b", marginBottom: 4,
            textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>
            Senha
          </div>
          <input
            type="password"
            value={lf.p}
            onChange={e => setLF(f => ({ ...f, p: e.target.value }))}
            onKeyDown={e => e.key === "Enter" && doLogin()}
            style={{
              width: "100%", background: "#141e2e", border: "1px solid #1e3a5f",
              borderRadius: 7, padding: "9px 11px", color: "#e2e8f0",
              fontSize: 13, outline: "none", boxSizing: "border-box",
            }}
          />
        </div>

        <button
          onClick={doLogin}
          disabled={loading}
          style={{
            width: "100%", background: loading ? "#15803d88" : "linear-gradient(135deg,#16a34a,#15803d)",
            border: "none", color: "#fff", padding: "12px 0", borderRadius: 8,
            cursor: loading ? "not-allowed" : "pointer", fontWeight: 700, fontSize: 15, marginTop: 4,
          }}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <div style={{ marginTop: 16, padding: 11, background: "#141e2e",
          borderRadius: 8, fontSize: 11, color: "#475569" }}>
          <b style={{ color: "#64748b" }}>Demo: </b>
          admin / terravista2025 &nbsp;·&nbsp; corretor1 / corretor123
        </div>
      </div>
    </div>
  );
}
