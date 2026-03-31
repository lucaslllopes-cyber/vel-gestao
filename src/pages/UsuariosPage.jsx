import { useState, useEffect } from "react";
import { BASE_URL } from "../utils/api";

export function UsuariosPage({ user }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Form state
  const [formData, setFormData] = useState({
    nome: "",
    login: "",
    senha: "",
    role: "corretor"
  });
  const [saving, setSaving] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (!res.ok) throw new Error("Falha ao carregar usuários");
      const data = await res.json();
      setUsers(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao criar usuário");
      
      setFormData({ nome: "", login: "", senha: "", role: "corretor" });
      fetchUsers();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: 20, color: "#64748b" }}>Carregando...</div>;

  return (
    <div style={{ flex: 1, overflow: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "24px", minHeight: 0 }}>
      <div style={{ maxWidth: 800 }}>
        <h2 style={{ color: "#f1f5f9", fontSize: 18, marginBottom: 16, fontWeight: 700 }}>Novo Usuário</h2>
        <form onSubmit={handleCreate} style={{ 
          background: "#0c1118", padding: "20px", borderRadius: 12, border: "1px solid #1e293b",
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, alignItems: "end"
        }}>
          <div>
            <label style={{ display: "block", fontSize: 10, color: "#64748b", marginBottom: 4, textTransform: "uppercase", fontWeight: 700 }}>Nome</label>
            <input 
              required
              placeholder="Ex: Adriane"
              value={formData.nome}
              onChange={e => setFormData({...formData, nome: e.target.value})}
              style={{ width: "100%", background: "#141e2e", border: "1px solid #1e3a5f", borderRadius: 6, padding: "8px 10px", color: "#e2e8f0", fontSize: 12, outline: "none" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 10, color: "#64748b", marginBottom: 4, textTransform: "uppercase", fontWeight: 700 }}>Login / E-mail</label>
            <input 
              required
              placeholder="exemplo@gmail.com"
              value={formData.login}
              onChange={e => setFormData({...formData, login: e.target.value})}
              style={{ width: "100%", background: "#141e2e", border: "1px solid #1e3a5f", borderRadius: 6, padding: "8px 10px", color: "#e2e8f0", fontSize: 12, outline: "none" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 10, color: "#64748b", marginBottom: 4, textTransform: "uppercase", fontWeight: 700 }}>Senha Inicial</label>
            <input 
              required
              type="password"
              placeholder="••••••••"
              value={formData.senha}
              onChange={e => setFormData({...formData, senha: e.target.value})}
              style={{ width: "100%", background: "#141e2e", border: "1px solid #1e3a5f", borderRadius: 6, padding: "8px 10px", color: "#e2e8f0", fontSize: 12, outline: "none" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 10, color: "#64748b", marginBottom: 4, textTransform: "uppercase", fontWeight: 700 }}>Perfil</label>
            <select 
              value={formData.role}
              onChange={e => setFormData({...formData, role: e.target.value})}
              style={{ width: "100%", background: "#141e2e", border: "1px solid #1e3a5f", borderRadius: 6, padding: "8px 10px", color: "#e2e8f0", fontSize: 12, outline: "none" }}
            >
              <option value="corretor">Corretor</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <button 
            type="submit" 
            disabled={saving}
            style={{ 
              background: saving ? "#15803d88" : "linear-gradient(135deg,#16a34a,#15803d)", 
              color: "#fff", border: "none", borderRadius: 6, padding: "9px", 
              fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", fontSize: 13, height: 35
            }}
          >
            {saving ? "..." : "Cadastrar"}
          </button>
        </form>
        {error && <div style={{ color: "#f87171", fontSize: 11, marginTop: 8, padding: "0 4px" }}>⚠️ {error}</div>}
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
        <h2 style={{ color: "#f1f5f9", fontSize: 18, marginBottom: 16, fontWeight: 700 }}>Usuários Ativos</h2>
        <div style={{ background: "#0c1118", border: "1px solid #1e293b", borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: "#0d1220" }}>
                {["Nome", "Login", "Perfil", "Criado em"].map(h => (
                  <th key={h} style={{
                    padding: "12px 16px", textAlign: "left", color: "#334155",
                    fontWeight: 700, fontSize: 9, textTransform: "uppercase",
                    letterSpacing: "0.5px", borderBottom: "1px solid #1e293b",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u.id} style={{ background: i % 2 === 0 ? "#060a0e" : "#090e16", borderBottom: "1px solid #1e293b" }}>
                  <td style={{ padding: "12px 16px", fontWeight: 700, color: "#f1f5f9" }}>{u.nome}</td>
                  <td style={{ padding: "12px 16px", color: "#94a3b8" }}>{u.login}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ 
                      background: u.role === "admin" ? "#1e3a5f33" : "#0f172a", 
                      color: u.role === "admin" ? "#60a5fa" : "#64748b",
                      padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700, border: `1px solid ${u.role === "admin" ? "#1e3a5f" : "#1e293b"}`
                    }}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", color: "#334155", fontSize: 11 }}>
                    {new Date(u.createdAt).toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
