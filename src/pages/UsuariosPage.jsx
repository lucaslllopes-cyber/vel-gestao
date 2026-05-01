import { useState, useEffect } from "react";
import { BASE_URL } from "../utils/api";

export function UsuariosPage({ user, onUserUpdated }) {
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
      if (onUserUpdated) onUserUpdated();
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) return <div style={{ padding: 20, color: "#64748b" }}>Carregando...</div>;

  const pendentes = users.filter(u => u.status === "PENDENTE");
  const ativos = users.filter(u => !u.status || u.status === "ATIVO");
  const inativos = users.filter(u => u.status === "INATIVO" || u.status === "RECUSADO");

  return (
    <div style={{ flex: 1, overflow: "auto", padding: "32px", display: "flex", flexDirection: "column", gap: "40px", minHeight: 0, background: "var(--off-white)" }}>
      
      {/* HEADER E NOVO USUARIO MANUAL */}
      <div style={{ maxWidth: 900 }}>
        <h2 style={{ color: "var(--navy-primary)", fontSize: 20, marginBottom: 20, fontWeight: 800 }}>Gestão de Usuários</h2>
        <form onSubmit={handleCreate} className="premium-card" style={{ 
          background: "white", padding: "24px", 
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, alignItems: "end"
        }}>
          <div>
            <label style={{ display: "block", fontSize: 11, color: "var(--text-secondary)", marginBottom: 6, textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.5px" }}>Nome</label>
            <input 
              required placeholder="Ex: Adriane" value={formData.nome}
              onChange={e => setFormData({...formData, nome: e.target.value})}
              style={{ width: "100%", background: "#F8FAFC", border: "1px solid var(--border-color)", borderRadius: 8, padding: "10px 14px", color: "var(--text-primary)", fontSize: 13, outline: "none" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 11, color: "var(--text-secondary)", marginBottom: 6, textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.5px" }}>Login / E-mail</label>
            <input 
              required placeholder="exemplo@gmail.com" value={formData.login}
              onChange={e => setFormData({...formData, login: e.target.value})}
              style={{ width: "100%", background: "#F8FAFC", border: "1px solid var(--border-color)", borderRadius: 8, padding: "10px 14px", color: "var(--text-primary)", fontSize: 13, outline: "none" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 11, color: "var(--text-secondary)", marginBottom: 6, textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.5px" }}>Senha Inicial</label>
            <input 
              required type="password" placeholder="••••••••" value={formData.senha}
              onChange={e => setFormData({...formData, senha: e.target.value})}
              style={{ width: "100%", background: "#F8FAFC", border: "1px solid var(--border-color)", borderRadius: 8, padding: "10px 14px", color: "var(--text-primary)", fontSize: 13, outline: "none" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 11, color: "var(--text-secondary)", marginBottom: 6, textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.5px" }}>Perfil</label>
            <select 
              value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}
              style={{ width: "100%", background: "#F8FAFC", border: "1px solid var(--border-color)", borderRadius: 8, padding: "10px 14px", color: "var(--text-primary)", fontSize: 13, outline: "none", cursor: "pointer" }}
            >
              <option value="corretor">Corretor</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <button 
            type="submit" disabled={saving}
            className="btn-primary"
            style={{ 
              height: 42, fontSize: 14
            }}
          >
            {saving ? "..." : "Cadastrar Usuário"}
          </button>
        </form>
        {error && <div style={{ color: "#dc2626", fontSize: 12, marginTop: 12, padding: "8px 12px", background: "#fef2f2", borderRadius: 8, border: "1px solid #fee2e2" }}>⚠️ {error}</div>}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
        
        {/* BLOCO: PENDENTES */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <h2 style={{ color: "var(--navy-primary)", fontSize: 18, fontWeight: 800 }}>⏳ Solicitações de Acesso</h2>
            <span style={{ background: "var(--gold-primary)", color: "white", fontSize: 11, padding: "2px 10px", borderRadius: 12, fontWeight: 800 }}>{pendentes.length} pendentes</span>
          </div>
          
          <div className="premium-card" style={{ background: "white", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#F8FAFC", borderBottom: "1px solid var(--border-color)" }}>
                  {["Nome / Contato", "Imobiliária", "Data Solicitação", "Ações"].map(h => (
                    <th key={h} style={{ padding: "16px 20px", textAlign: "left", color: "var(--text-secondary)", fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: "1px" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pendentes.length === 0 ? (
                  <tr><td colSpan="4" style={{ padding: 48, textAlign: "center", color: "var(--text-secondary)", fontWeight: 500 }}>Nenhuma solicitação pendente no momento.</td></tr>
                ) : pendentes.map(u => (
                  <tr key={u.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ fontWeight: 800, color: "var(--navy-primary)", marginBottom: 4 }}>{u.nome}</div>
                      <div style={{ color: "var(--text-secondary)", fontSize: 12 }}>{u.login} {u.telefone && `• ${u.telefone}`}</div>
                    </td>
                    <td style={{ padding: "16px 20px", color: "var(--text-primary)", fontWeight: 500 }}>{u.imobiliaria || "—"}</td>
                    <td style={{ padding: "16px 20px", color: "var(--text-secondary)", fontSize: 12 }}>{new Date(u.createdAt).toLocaleDateString("pt-BR")}</td>
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button 
                          onClick={() => handleStatusChange(u.id, "ATIVO")}
                          className="btn-primary"
                          style={{ padding: "6px 16px", fontSize: 11, background: "#16a34a" }}>
                          Aprovar
                        </button>
                        <button 
                          onClick={() => handleStatusChange(u.id, "RECUSADO")}
                          className="btn-outline-gold"
                          style={{ padding: "6px 16px", fontSize: 11, color: "#dc2626", border: "1px solid #fee2e2" }}>
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
          <h2 style={{ color: "var(--navy-primary)", fontSize: 18, marginBottom: 16, fontWeight: 800 }}>
            ✅ Usuários Ativos ({ativos.length})
          </h2>
          <div className="premium-card" style={{ background: "white", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#F8FAFC", borderBottom: "1px solid var(--border-color)" }}>
                  {["Nome / Login", "Contato Info", "Perfil", "Origem/Data", "Ações"].map(h => (
                    <th key={h} style={{ padding: "16px 20px", textAlign: "left", color: "var(--text-secondary)", fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: "1px" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ativos.map((u, i) => (
                  <tr key={u.id} style={{ borderBottom: "1px solid var(--border-color)", background: i % 2 === 0 ? "white" : "#FDFDFD" }}>
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ fontWeight: 800, color: "var(--navy-primary)", marginBottom: 4 }}>{u.nome}</div>
                      <div style={{ color: "var(--text-secondary)", fontSize: 12 }}>{u.login}</div>
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ color: "var(--text-primary)", fontSize: 12, fontWeight: 600 }}>{u.telefone || "Sem telefone"}</div>
                      <div style={{ color: "var(--text-secondary)", fontSize: 11 }}>{u.imobiliaria || "—"}</div>
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <span style={{ 
                        background: u.role === "admin" ? "#f1f5f9" : "transparent", 
                        color: u.role === "admin" ? "var(--navy-primary)" : "var(--text-secondary)",
                        padding: "4px 10px", borderRadius: 20, fontSize: 10, fontWeight: 800, 
                        border: `1px solid ${u.role === "admin" ? "var(--border-color)" : "var(--border-color)"}`
                      }}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: "16px 20px", color: "var(--text-secondary)", fontSize: 12 }}>
                      {new Date(u.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      {u.role !== "admin" && user.id !== u.id && (
                        <button 
                          onClick={() => handleStatusChange(u.id, "INATIVO")}
                          className="btn-outline-gold"
                          style={{ padding: "6px 12px", fontSize: 10, color: "var(--text-secondary)", border: "1px solid var(--border-color)" }}>
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
          <div style={{ display: "flex", flexDirection: "column", flex: 1, opacity: 0.8 }}>
            <h2 style={{ color: "var(--text-secondary)", fontSize: 16, marginBottom: 16, fontWeight: 700 }}>
              ❌ Usuários Inativos ou Recusados ({inativos.length})
            </h2>
            <div className="premium-card" style={{ background: "white", border: "1px dashed var(--border-color)", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#F8FAFC", borderBottom: "1px solid var(--border-color)" }}>
                    {["Nome / Login", "Status", "Data", "Ações"].map(h => (
                      <th key={h} style={{ padding: "16px 20px", textAlign: "left", color: "var(--text-secondary)", fontWeight: 700, fontSize: 10, textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {inativos.map((u, i) => (
                    <tr key={u.id} style={{ borderBottom: "1px solid var(--border-color)", background: i % 2 === 0 ? "white" : "#FDFDFD" }}>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ fontWeight: 800, color: "var(--text-secondary)", marginBottom: 4 }}>{u.nome}</div>
                        <div style={{ color: "var(--text-secondary)", fontSize: 12 }}>{u.login}</div>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <span style={{ 
                          color: u.status === "RECUSADO" ? "#ef4444" : "var(--gold-primary)", 
                          fontSize: 11, fontWeight: 800, textTransform: "uppercase" 
                        }}>
                          {u.status}
                        </span>
                      </td>
                      <td style={{ padding: "16px 20px", color: "var(--text-secondary)", fontSize: 12 }}>
                        {new Date(u.createdAt).toLocaleDateString("pt-BR")}
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <button 
                          onClick={() => handleStatusChange(u.id, "ATIVO")}
                          className="btn-outline-gold"
                          style={{ padding: "6px 12px", fontSize: 10 }}>
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
