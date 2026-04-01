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
    role: "corretor",
    status: "ATIVO"
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
      
      setFormData({ nome: "", login: "", senha: "", role: "corretor", status: "ATIVO" });
      fetchUsers();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (targetUserId, newStatus) => {
    if (!window.confirm(`Tem certeza que deseja mudar o status para ${newStatus}?`)) return;
    
    try {
      const res = await fetch(`${BASE_URL}/users/${targetUserId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao atualizar status");
      
      fetchUsers();
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) return <div style={{ padding: 20, color: "#64748b" }}>Carregando...</div>;

  const pendentes = users.filter(u => u.status === "PENDENTE");
  const ativos = users.filter(u => !u.status || u.status === "ATIVO");
  const inativos = users.filter(u => u.status === "INATIVO" || u.status === "RECUSADO");

  return (
    <div style={{ flex: 1, overflow: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "32px", minHeight: 0 }}>
      
      {/* HEADER E NOVO USUARIO MANUAL */}
      <div style={{ maxWidth: 800 }}>
        <h2 style={{ color: "#f1f5f9", fontSize: 18, marginBottom: 16, fontWeight: 700 }}>Cadastrar Novo Usuário (Manual)</h2>
        <form onSubmit={handleCreate} style={{ 
          background: "#0c1118", padding: "20px", borderRadius: 12, border: "1px solid #1e293b",
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12, alignItems: "end"
        }}>
          <div>
            <label style={{ display: "block", fontSize: 10, color: "#64748b", marginBottom: 4, textTransform: "uppercase", fontWeight: 700 }}>Nome</label>
            <input 
              required placeholder="Ex: Adriane" value={formData.nome}
              onChange={e => setFormData({...formData, nome: e.target.value})}
              style={{ width: "100%", background: "#141e2e", border: "1px solid #1e3a5f", borderRadius: 6, padding: "8px 10px", color: "#e2e8f0", fontSize: 12, outline: "none" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 10, color: "#64748b", marginBottom: 4, textTransform: "uppercase", fontWeight: 700 }}>Login / E-mail</label>
            <input 
              required placeholder="exemplo@gmail.com" value={formData.login}
              onChange={e => setFormData({...formData, login: e.target.value})}
              style={{ width: "100%", background: "#141e2e", border: "1px solid #1e3a5f", borderRadius: 6, padding: "8px 10px", color: "#e2e8f0", fontSize: 12, outline: "none" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 10, color: "#64748b", marginBottom: 4, textTransform: "uppercase", fontWeight: 700 }}>Senha Inicial</label>
            <input 
              required type="password" placeholder="••••••••" value={formData.senha}
              onChange={e => setFormData({...formData, senha: e.target.value})}
              style={{ width: "100%", background: "#141e2e", border: "1px solid #1e3a5f", borderRadius: 6, padding: "8px 10px", color: "#e2e8f0", fontSize: 12, outline: "none" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 10, color: "#64748b", marginBottom: 4, textTransform: "uppercase", fontWeight: 700 }}>Perfil</label>
            <select 
              value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}
              style={{ width: "100%", background: "#141e2e", border: "1px solid #1e3a5f", borderRadius: 6, padding: "8px 10px", color: "#e2e8f0", fontSize: 12, outline: "none" }}
            >
              <option value="corretor">Corretor</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <button 
            type="submit" disabled={saving}
            style={{ 
              background: saving ? "#15803d88" : "linear-gradient(135deg,#16a34a,#15803d)", color: "#fff", border: "none", borderRadius: 6, padding: "9px", 
              fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", fontSize: 13, height: 35
            }}
          >
            {saving ? "..." : "Cadastrar"}
          </button>
        </form>
        {error && <div style={{ color: "#f87171", fontSize: 11, marginTop: 8, padding: "0 4px" }}>⚠️ {error}</div>}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        
        {/* BLOCO: PENDENTES */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <h2 style={{ color: "#eab308", fontSize: 18, marginBottom: 16, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
            ⏳ Solicitações Pendentes <span style={{ background: "#ca8a0444", color: "#fef08a", fontSize: 11, padding: "2px 8px", borderRadius: 12 }}>{pendentes.length}</span>
          </h2>
          <div style={{ background: "#0c1118", border: "1px solid #1e293b", borderRadius: 12, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: "#0d1220" }}>
                  {["Nome / Contato", "Imobiliária", "Data Solicitação", "Ações"].map(h => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#64748b", fontWeight: 700, fontSize: 10, textTransform: "uppercase", borderBottom: "1px solid #1e293b" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pendentes.length === 0 ? (
                  <tr><td colSpan="4" style={{ padding: 32, textAlign: "center", color: "#475569" }}>Nenhuma solicitação pendente no momento.</td></tr>
                ) : pendentes.map(u => (
                  <tr key={u.id} style={{ borderBottom: "1px solid #1e293b" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ fontWeight: 700, color: "#f1f5f9", marginBottom: 2 }}>{u.nome}</div>
                      <div style={{ color: "#94a3b8", fontSize: 11 }}>{u.login} {u.telefone && `• ${u.telefone}`}</div>
                    </td>
                    <td style={{ padding: "12px 16px", color: "#94a3b8" }}>{u.imobiliaria || "-"}</td>
                    <td style={{ padding: "12px 16px", color: "#94a3b8", fontSize: 11 }}>{new Date(u.createdAt).toLocaleDateString("pt-BR")}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button 
                          onClick={() => handleStatusChange(u.id, "ATIVO")}
                          style={{ background: "#16a34a", color: "#fff", border: "none", borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontWeight: "bold", fontSize: 11 }}>
                          Aprovar
                        </button>
                        <button 
                          onClick={() => handleStatusChange(u.id, "RECUSADO")}
                          style={{ background: "#dc2626", color: "#fff", border: "none", borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontWeight: "bold", fontSize: 11 }}>
                          Recusar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* BLOCO: ATIVOS */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <h2 style={{ color: "#f1f5f9", fontSize: 18, marginBottom: 16, fontWeight: 700 }}>
            ✅ Usuários Ativos ({ativos.length})
          </h2>
          <div style={{ background: "#0c1118", border: "1px solid #1e293b", borderRadius: 12, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: "#0d1220" }}>
                  {["Nome / Login", "Contato Info", "Perfil", "Origem/Data", "Ações"].map(h => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#64748b", fontWeight: 700, fontSize: 10, textTransform: "uppercase", borderBottom: "1px solid #1e293b" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ativos.map((u, i) => (
                  <tr key={u.id} style={{ background: i % 2 === 0 ? "#060a0e" : "#090e16", borderBottom: "1px solid #1e293b" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ fontWeight: 700, color: "#f1f5f9", marginBottom: 2 }}>{u.nome}</div>
                      <div style={{ color: "#64748b", fontSize: 11 }}>{u.login}</div>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ color: "#94a3b8", fontSize: 11 }}>{u.telefone || "Sem telefone"}</div>
                      <div style={{ color: "#94a3b8", fontSize: 11 }}>{u.imobiliaria || "-"}</div>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ 
                        background: u.role === "admin" ? "#1e3a5f33" : "#0f172a", color: u.role === "admin" ? "#60a5fa" : "#64748b",
                        padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700, border: `1px solid ${u.role === "admin" ? "#1e3a5f" : "#1e293b"}`
                      }}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", color: "#64748b", fontSize: 11 }}>
                      {new Date(u.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      {u.role !== "admin" && user.id !== u.id && (
                        <button 
                          onClick={() => handleStatusChange(u.id, "INATIVO")}
                          style={{ background: "#1e293b", color: "#e2e8f0", border: "1px solid #334155", borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontSize: 10 }}>
                          Desativar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* BLOCO: INATIVOS / RECUSADOS */}
        {inativos.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", flex: 1, opacity: 0.7 }}>
            <h2 style={{ color: "#64748b", fontSize: 18, marginBottom: 16, fontWeight: 700 }}>
              ❌ Usuários Inativos / Recusados ({inativos.length})
            </h2>
            <div style={{ background: "#0c1118", border: "1px dashed #334155", borderRadius: 12, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: "#0d1220" }}>
                    {["Nome / Login", "Status", "Data", "Ações"].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#64748b", fontWeight: 700, fontSize: 10, textTransform: "uppercase", borderBottom: "1px solid #1e293b" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {inativos.map((u, i) => (
                    <tr key={u.id} style={{ background: i % 2 === 0 ? "#060a0e" : "#090e16", borderBottom: "1px solid #1e293b" }}>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ fontWeight: 700, color: "#94a3b8", marginBottom: 2 }}>{u.nome}</div>
                        <div style={{ color: "#475569", fontSize: 11 }}>{u.login}</div>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ color: u.status === "RECUSADO" ? "#ef4444" : "#f59e0b", fontSize: 10, fontWeight: "bold" }}>
                          {u.status}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", color: "#475569", fontSize: 11 }}>
                        {new Date(u.createdAt).toLocaleDateString("pt-BR")}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <button 
                          onClick={() => handleStatusChange(u.id, "ATIVO")}
                          style={{ background: "transparent", color: "#3b82f6", border: "1px solid #3b82f6", borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontSize: 10 }}>
                          Reativar Acesso
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
