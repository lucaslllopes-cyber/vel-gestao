import express from "express";
import cors from "cors";
import { PrismaClient } from "../prisma/generated/client/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import 'dotenv/config';
import * as XLSX from 'xlsx';
import multer from 'multer';
import {
  notifyNewAccessRequest, notifyNewReservation, notifyNewProposal,
  notifyBrokerAccessApproved, notifyBrokerAccessRejected,
  notifyBrokerReservation, notifyBrokerProposal,
  notifyBrokerProposalApproved, notifyBrokerProposalRejected,
  notifyBrokerReservationReleased
} from "./emailService.js";

const app = express();
const prisma = new PrismaClient();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // Limite de 5MB para evitar DoS
});

// Configuração de CORS Restrita
const corsOptions = {
  origin: process.env.NODE_ENV === "production"
    ? ["https://app.velgestao.com", "https://velgestao.com", "https://www.velgestao.com"]
    : "*",
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET && process.env.NODE_ENV === "production") {
  console.error("FATAL: JWT_SECRET não definida em ambiente de produção!");
  process.exit(1);
}
const FINAL_JWT_SECRET = JWT_SECRET || "terravista_dev_secret_only";

// ── MIDDLEWARE AUTH ──

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Token não fornecido" });

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, FINAL_JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: "Token inválido" });
  }
};

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    req.user = null;
    return next();
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, FINAL_JWT_SECRET);
    req.user = payload;
  } catch (e) {
    req.user = null;
  }
  next();
};

// ─────────────────────────────────────────────────────────────
// FASE 1 — HELPERS E MIDDLEWARES MULTIOPERAÇÃO
// ─────────────────────────────────────────────────────────────

/**
 * isAdmin(req) — verifica se o usuário tem papel de administrador.
 * Compatível com tokens antigos (sem isSuperAdmin) e novos (com isSuperAdmin).
 * Substitui os checks inline `req.user.role !== "admin"` com suporte a isSuperAdmin.
 */
const isAdmin = (req) => {
  if (req.user?.isSuperAdmin === true) return true;
  return (req.user?.role || '').toLowerCase() === 'admin';
};

/**
 * resolveProject — identifica o Project ativo para a request.
 *
 * Ordem de prioridade:
 *   1. query param `?projectId=...`
 *   2. body `{ projectId: "..." }`
 *   3. usuário tem exatamente 1 ProjectMember ATIVO → usa esse projeto
 *   4. Fallback: Project "residencial-terra-vista" (único projeto nesta fase)
 *
 * Nunca bloqueia a rota: em caso de erro, req.project = null e continua.
 * Deve ser chamado APÓS requireAuth ou optionalAuth (precisa de req.user).
 */
const resolveProject = async (req, res, next) => {
  req.project = null;

  // Sem usuário autenticado → sem projeto resolvido
  if (!req.user) return next();

  try {
    // 1. projectId explícito em query param ou body
    const explicitId = req.query.projectId || (req.body && req.body.projectId) || null;

    if (explicitId) {
      const project = await prisma.project.findUnique({
        where: { id: explicitId },
        select: { id: true, nome: true, slug: true, status: true, config: true, organizationId: true }
      });
      if (!project || project.status !== 'ATIVO') {
        return res.status(400).json({ error: 'Projeto não encontrado ou inativo' });
      }
      // Admin/SuperAdmin tem acesso direto; demais precisam de ProjectMember
      if (!isAdmin(req)) {
        const member = await prisma.projectMember.findFirst({
          where: { projectId: project.id, userId: req.user.id, status: 'ATIVO' }
        });
        if (!member) {
          return res.status(403).json({ error: 'Sem acesso a este projeto' });
        }
      }
      req.project = project;
      return next();
    }

    // 2. Usuário tem exatamente 1 ProjectMember ativo → usa esse projeto
    const members = await prisma.projectMember.findMany({
      where: { userId: req.user.id, status: 'ATIVO' },
      include: {
        project: {
          select: { id: true, nome: true, slug: true, status: true, config: true, organizationId: true }
        }
      }
    });
    const ativos = members.filter(m => m.project?.status === 'ATIVO');
    if (ativos.length === 1) {
      req.project = ativos[0].project;
      return next();
    }

    // 3. Fallback: Terra Vista (único projeto ativo nesta fase)
    const terraVista = await prisma.project.findFirst({
      where: { slug: 'residencial-terra-vista', status: 'ATIVO' },
      select: { id: true, nome: true, slug: true, status: true, config: true, organizationId: true }
    });
    req.project = terraVista || null;
    return next();

  } catch (err) {
    console.error('[resolveProject] Erro (não-bloqueante):', err.message);
    req.project = null;
    return next();
  }
};

/**
 * checkPermission(...perfisPermitidos) — factory de middleware para permissões baseadas em ProjectMember.
 *
 * Ordem de verificação:
 *   1. User.isSuperAdmin → acesso irrestrito
 *   2. ProjectMember.perfil (se req.project estiver resolvido)
 *   3. Fallback: role global antigo (compatibilidade retroativa)
 *
 * Perfis válidos: project_admin | commercial_manager | corretor | financeiro | viewer
 *
 * ATENÇÃO: Não utilizado para substituir checks existentes neste commit.
 * Mantido como utilitário para rotas novas e commits futuros.
 */
const ROLE_TO_PROJECT_PERFIS = {
  'admin':   ['project_admin', 'commercial_manager', 'corretor', 'financeiro', 'viewer'],
  'corretor': ['corretor', 'viewer'],
};

const checkPermission = (...perfisPermitidos) => async (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Não autenticado' });

  // 1. Super Admin global → acesso irrestrito
  if (req.user.isSuperAdmin === true) return next();

  // 2. Verificação via ProjectMember se há projeto resolvido
  if (req.project) {
    try {
      const member = await prisma.projectMember.findFirst({
        where: { projectId: req.project.id, userId: req.user.id, status: 'ATIVO' }
      });
      if (member) {
        if (perfisPermitidos.includes(member.perfil)) return next();
        return res.status(403).json({
          error: `Perfil "${member.perfil}" não tem permissão para esta operação`
        });
      }
    } catch (err) {
      console.error('[checkPermission] Erro ao buscar ProjectMember:', err.message);
      // Fallback silencioso para role global
    }
  }

  // 3. Fallback: role global (compatibilidade retroativa com tokens anteriores à Fase 1)
  const roleNorm = (req.user.role || '').toLowerCase();
  const perfisDoRole = ROLE_TO_PROJECT_PERFIS[roleNorm] || [];
  if (perfisPermitidos.some(p => perfisDoRole.includes(p))) return next();

  return res.status(403).json({ error: 'Acesso negado' });
};

// ── ROTAS BASILARES ──

// POST /auth/login
// Fase 1: inclui isSuperAdmin no JWT e na resposta
app.post("/auth/login", async (req, res) => {
  const { login, senha } = req.body;
  if (!login || !senha) return res.status(400).json({ error: "Preencha os campos" });

  const user = await prisma.user.findUnique({ where: { login } });
  if (!user) return res.status(401).json({ error: "Credenciais inválidas" });

  const isMatch = await bcrypt.compare(senha, user.senhaHash);
  if (!isMatch) return res.status(401).json({ error: "Credenciais inválidas" });

  if (user.status === "PENDENTE") {
    return res.status(401).json({ error: "Seu acesso está pendente de aprovação pelo administrador." });
  }
  if (user.status === "INATIVO" || user.status === "RECUSADO") {
    return res.status(401).json({ error: "Seu acesso está desativado. Entre em contato com a gestão." });
  }

  const token = jwt.sign(
    {
      id: user.id,
      login: user.login,
      role: user.role.toLowerCase(),
      nome: user.nome,
      isSuperAdmin: user.isSuperAdmin || false  // Fase 1: incluso no JWT
    },
    FINAL_JWT_SECRET,
    { expiresIn: "30d" }
  );

  res.json({
    token,
    user: {
      id: user.id,
      login: user.login,
      role: user.role.toLowerCase(),
      nome: user.nome,
      isSuperAdmin: user.isSuperAdmin || false  // Fase 1: incluso na resposta
    }
  });
});

// GET /auth/me — verifica se o token é válido e retorna dados do usuário
// Fase 1: inclui isSuperAdmin na resposta
app.get("/auth/me", requireAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, nome: true, login: true, role: true, status: true, isSuperAdmin: true }
    });

    if (!user || user.status !== "ATIVO") {
      return res.status(401).json({ error: "Usuário não encontrado ou inativo" });
    }

    res.json({
      user: { ...user, role: user.role.toLowerCase() }
    });
  } catch (e) {
    res.status(500).json({ error: "Erro ao verificar sessão" });
  }
});

// POST /auth/solicitar-acesso
app.post("/auth/solicitar-acesso", async (req, res) => {
  try {
    const { nome, login, senha, telefone, imobiliaria } = req.body;
    if (!nome || !login || !senha) return res.status(400).json({ error: "Preencha nome, e-mail e senha" });

    const loginNorm = login.trim().toLowerCase();
    const exists = await prisma.user.findUnique({ where: { login: loginNorm } });

    if (exists) {
      if (exists.status === "ATIVO") return res.status(400).json({ error: "Este e-mail já possui acesso ativo." });
      if (exists.status === "PENDENTE") return res.status(400).json({ error: "Já existe uma solicitação em análise para este e-mail." });
      return res.status(400).json({ error: "Acesso não liberado para este e-mail. Contate a gestão." });
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const newUser = await prisma.user.create({
      data: {
        nome,
        login: loginNorm,
        senhaHash,
        role: "corretor",
        status: "PENDENTE",
        telefone,
        imobiliaria
      }
    });

    notifyNewAccessRequest(newUser);

    res.status(201).json({ message: "Solicitação recebida com sucesso", id: newUser.id });
  } catch (error) {
    console.error("Erro ao solicitar acesso:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// GET /lotes — Público, mas esconde dados sensíveis se deslogado
// Fase 1: filtra por projectId quando projeto resolvido; fallback retorna todos os lotes
app.get("/lotes", optionalAuth, resolveProject, async (req, res) => {
  try {
    // Se há projeto resolvido, filtra por ele; caso contrário retorna todos (comportamento anterior)
    const where = req.project ? { projectId: req.project.id } : {};
    const lotes = await prisma.lote.findMany({ where });

    // Se não estiver logado, oculta nomes dos compradores (Privacidade/LGPD)
    if (!req.user) {
      return res.json(lotes.map(l => ({
        ...l,
        comprador: l.comprador ? "Reservado/Vendido" : null,
        compradorAnterior: null
      })));
    }

    res.json(lotes);
  } catch (error) {
    res.status(500).json({ error: "Erro interno no BD" });
  }
});

// POST /lotes/:id/reservar
// Fase 1: registra projectId no AuditLog
app.post("/lotes/:id/reservar", requireAuth, resolveProject, async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Busca Lote e Checa o Status
    const lote = await prisma.lote.findUnique({ where: { id } });
    if (!lote) return res.status(404).json({ error: "Lote não encontrado" });
    if (lote.status !== "Disponível") {
      return res.status(409).json({ error: "Lote ocupado!" });
    }

    // 2. Trava estrita de 48 Horas do MVP
    const reservaVenceEm = new Date(Date.now() + 48 * 60 * 60 * 1000);

    // 3. Mutação Atômica Anti-Concorrência
    const result = await prisma.lote.updateMany({
      where: { id: lote.id, status: "Disponível" },
      data: {
        status: "Reservado",
        reservaOwnerId: req.user.id,
        reservaVenceEm
      }
    });

    if (result.count === 0) {
      return res.status(409).json({ error: "Conflito: Lote fisgado por outro corretor!" });
    }

    notifyNewReservation(lote, req.user, reservaVenceEm);
    notifyBrokerReservation(lote, req.user, reservaVenceEm);

    // AuditLog — Fase 1: inclui projectId quando disponível
    await prisma.auditLog.create({
      data: {
        loteId: lote.id,
        userId: req.user.id,
        evento: "RESERVA_CRIADA",
        payloadNovo: JSON.stringify({ status: "Reservado", reservaOwnerId: req.user.id, reservaVenceEm }),
        projectId: req.project?.id || null
      }
    });

    res.json({ message: "Reservado com sucesso", reservaVenceEm });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// POST /lotes/:id/liberar  (admin ou dono da reserva)
// Fase 1: usa isAdmin() para suporte a isSuperAdmin; registra projectId no AuditLog
app.post("/lotes/:id/liberar", requireAuth, resolveProject, async (req, res) => {
  try {
    const { id } = req.params;
    const lote = await prisma.lote.findUnique({
      where: { id },
      include: { reservaOwner: true }
    });
    if (!lote) return res.status(404).json({ error: "Lote não encontrado" });
    if (lote.status !== "Reservado") {
      return res.status(409).json({ error: "Lote não está Reservado" });
    }

    // Admin (incluindo SuperAdmin) pode liberar qualquer reserva; corretor só a sua
    if (!isAdmin(req) && lote.reservaOwnerId !== req.user.id) {
      return res.status(403).json({ error: "Você só pode liberar suas próprias reservas" });
    }

    await prisma.lote.update({
      where: { id },
      data: { status: "Disponível", reservaOwnerId: null, reservaVenceEm: null },
    });

    if (lote.reservaOwner) {
      notifyBrokerReservationReleased(lote, lote.reservaOwner);
    }

    // AuditLog — Fase 1: inclui projectId
    await prisma.auditLog.create({
      data: {
        loteId: id,
        userId: req.user.id,
        evento: "RESERVA_LIBERADA",
        payloadAnterior: JSON.stringify({ status: lote.status, reservaOwnerId: lote.reservaOwnerId }),
        payloadNovo: JSON.stringify({ status: "Disponível", reservaOwnerId: null }),
        projectId: req.project?.id || null
      }
    });

    res.json({ message: `Reserva do Lote ${id} liberada com sucesso` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// POST /lotes/:id/estornar  (admin only)
// Fase 1: usa isAdmin(); registra projectId no AuditLog
app.post("/lotes/:id/estornar", requireAuth, resolveProject, async (req, res) => {
  if (!isAdmin(req)) {
    return res.status(403).json({ error: "Apenas administradores podem estornar vendas" });
  }
  try {
    const { id } = req.params;
    const lote = await prisma.lote.findUnique({ where: { id } });
    if (!lote) return res.status(404).json({ error: "Lote não encontrado" });
    if (lote.status !== "Vendido") {
      return res.status(409).json({ error: `Estorno só é aplicável a lotes Vendidos (atual: "${lote.status}")` });
    }

    // Busca a proposta Aprovada mais recente ligada a este lote
    const propostaAprovada = await prisma.proposta.findFirst({
      where: { loteId: id, status: "Aprovada" },
      orderBy: { criadaEm: "desc" },
    });

    const snapshotAnterior = JSON.stringify({
      status: lote.status,
      comprador: lote.comprador,
    });
    const snapshotNovo = JSON.stringify({
      status: "Disponível",
      comprador: null,
      compradorAnterior: lote.comprador,
    });

    // Transação atômica: distrato proposta + restaura lote + cria audit_log
    await prisma.$transaction([
      // 1. Marca proposta como Distratada (não apaga)
      ...(propostaAprovada ? [prisma.proposta.update({
        where: { id: propostaAprovada.id },
        data: { status: "Distratada" },
      })] : []),
      // 2. Restaura lote — preserva compradorAnterior como histórico
      prisma.lote.update({
        where: { id },
        data: {
          status: "Disponível",
          comprador: null,
          compradorAnterior: lote.comprador,
          reservaOwnerId: null,
          reservaVenceEm: null,
        },
      }),
      // 3. Registra evento no AuditLog — Fase 1: inclui projectId
      prisma.auditLog.create({
        data: {
          loteId: id,
          userId: req.user.id,
          evento: "ESTORNO",
          payloadAnterior: snapshotAnterior,
          payloadNovo: snapshotNovo,
          projectId: req.project?.id || null
        },
      }),
    ]);

    res.json({
      message: `Venda do Lote ${id} estornada. Lote liberado para disponível.`,
      compradorAnterior: lote.comprador,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// PATCH /lotes/:id — Edição Manual (Admin Only)
// Fase 1: usa isAdmin(); registra projectId no AuditLog
app.patch("/lotes/:id", requireAuth, resolveProject, async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: "Acesso negado" });

  try {
    const { id } = req.params;
    const { status, comprador, valor, situacaoLegal } = req.body;

    const lote = await prisma.lote.findUnique({ where: { id } });
    if (!lote) return res.status(404).json({ error: "Lote não encontrado" });

    // Validação de status permitido
    const statusPermitidos = ["Disponível", "Reservado", "Vendido"];
    if (status && !statusPermitidos.includes(status)) {
      return res.status(400).json({ error: "Status inválido. Use Disponível, Reservado ou Vendido." });
    }

    const payloadAnterior = JSON.stringify({
      status: lote.status,
      comprador: lote.comprador,
      valor: lote.valor,
      situacaoLegal: lote.situacaoLegal
    });

    const dataUpdate = {};
    if (status !== undefined) dataUpdate.status = status;
    if (comprador !== undefined) dataUpdate.comprador = comprador;
    if (valor !== undefined) dataUpdate.valor = parseFloat(valor);
    if (situacaoLegal !== undefined) dataUpdate.situacaoLegal = situacaoLegal;

    // Se mudar para Disponível, limpa reserva
    if (status === "Disponível") {
      dataUpdate.reservaOwnerId = null;
      dataUpdate.reservaVenceEm = null;
    }

    const loteAtualizado = await prisma.lote.update({
      where: { id },
      data: dataUpdate
    });

    const payloadNovo = JSON.stringify({
      status: loteAtualizado.status,
      comprador: loteAtualizado.comprador,
      valor: loteAtualizado.valor,
      situacaoLegal: loteAtualizado.situacaoLegal
    });

    // AuditLog — Fase 1: inclui projectId
    await prisma.auditLog.create({
      data: {
        loteId: id,
        userId: req.user.id,
        evento: "EDICAO_MANUAL_LOTE",
        payloadAnterior,
        payloadNovo,
        projectId: req.project?.id || null
      }
    });

    res.json(loteAtualizado);
  } catch (error) {
    console.error("Erro na edição manual:", error);
    res.status(500).json({ error: "Erro interno no servidor ao atualizar lote" });
  }
});

// ── GESTÃO DE PROPOSTAS ──

// POST /propostas/:id/aprovar
// Fase 1: usa isAdmin(); registra projectId no AuditLog
app.post("/propostas/:id/aprovar", requireAuth, resolveProject, async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: "Apenas admin" });
  try {
    const proposta = await prisma.proposta.findUnique({
      where: { id: req.params.id },
      include: { corretor: true, lote: true }
    });
    if (!proposta) return res.status(404).json({ error: "Proposta não encontrada" });
    if (!["Pendente", "AjusteSolicitado"].includes(proposta.status)) {
      return res.status(409).json({ error: `Proposta com status "${proposta.status}" não pode ser aprovada` });
    }

    const [propostaAtualizada] = await prisma.$transaction([
      prisma.proposta.update({
        where: { id: proposta.id },
        data: { status: "Aprovada" },
      }),
      prisma.lote.update({
        where: { id: proposta.loteId },
        data: {
          status: "Vendido",
          comprador: proposta.nomeCliente,
          reservaOwnerId: null,
          reservaVenceEm: null,
        },
      }),
    ]);

    notifyBrokerProposalApproved(propostaAtualizada, proposta.corretor, proposta.lote);

    // AuditLog — Fase 1: inclui projectId
    await prisma.auditLog.create({
      data: {
        loteId: proposta.loteId,
        userId: req.user.id,
        evento: "PROPOSTA_APROVADA",
        payloadAnterior: JSON.stringify({ status: proposta.lote.status, comprador: proposta.lote.comprador }),
        payloadNovo: JSON.stringify({ status: "Vendido", comprador: proposta.nomeCliente }),
        projectId: req.project?.id || proposta.projectId || null
      }
    });

    res.json({ proposta: propostaAtualizada });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// POST /propostas/:id/recusar
// Fase 1: usa isAdmin(); registra projectId no AuditLog
app.post("/propostas/:id/recusar", requireAuth, resolveProject, async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: "Apenas admin" });
  try {
    const proposta = await prisma.proposta.findUnique({
      where: { id: req.params.id },
      include: { corretor: true, lote: true }
    });
    if (!proposta) return res.status(404).json({ error: "Proposta não encontrada" });
    if (!["Pendente", "AjusteSolicitado"].includes(proposta.status)) {
      return res.status(409).json({ error: `Proposta com status "${proposta.status}" não pode ser recusada` });
    }

    const [propostaAtualizada] = await prisma.$transaction([
      prisma.proposta.update({
        where: { id: proposta.id },
        data: { status: "Recusada" },
      }),
      prisma.lote.update({
        where: { id: proposta.loteId },
        data: {
          status: "Disponível",
          reservaOwnerId: null,
          reservaVenceEm: null,
        },
      }),
    ]);

    notifyBrokerProposalRejected(propostaAtualizada, proposta.corretor, proposta.lote);

    // AuditLog — Fase 1: inclui projectId
    await prisma.auditLog.create({
      data: {
        loteId: proposta.loteId,
        userId: req.user.id,
        evento: "PROPOSTA_RECUSADA",
        payloadAnterior: JSON.stringify({ status: proposta.lote.status }),
        payloadNovo: JSON.stringify({ status: "Disponível" }),
        projectId: req.project?.id || proposta.projectId || null
      }
    });

    res.json({ proposta: propostaAtualizada });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// POST /propostas/:id/ajuste  (só em Pendente)
// Fase 1: usa isAdmin()
app.post("/propostas/:id/ajuste", requireAuth, resolveProject, async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: "Apenas admin" });
  try {
    const proposta = await prisma.proposta.findUnique({ where: { id: req.params.id } });
    if (!proposta) return res.status(404).json({ error: "Proposta não encontrada" });
    if (proposta.status !== "Pendente") {
      return res.status(409).json({ error: `Ajuste só pode ser solicitado em propostas Pendentes (atual: "${proposta.status}")` });
    }

    // Lote permanece Reservado — prazo original mantido, sem update no lote
    const propostaAtualizada = await prisma.proposta.update({
      where: { id: proposta.id },
      data: { status: "AjusteSolicitado" },
    });

    res.json({ proposta: propostaAtualizada });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// POST /propostas
// Fase 1: inclui projectId na proposta criada
app.post("/propostas", requireAuth, resolveProject, async (req, res) => {
  try {
    const { loteId, nomeCliente, telefoneCliente, emailCliente, payloadFinanceiro } = req.body;

    if (!loteId || !nomeCliente || !payloadFinanceiro) {
      return res.status(400).json({ error: "Campos obrigatórios: loteId, nomeCliente, payloadFinanceiro" });
    }

    // 1. Busca o lote e valida status + ownership da reserva
    const lote = await prisma.lote.findUnique({ where: { id: loteId } });
    if (!lote) return res.status(404).json({ error: "Lote não encontrado" });

    if (lote.status !== "Reservado") {
      return res.status(409).json({ error: "Proposta só pode ser criada para lote Reservado" });
    }

    if (lote.reservaOwnerId !== req.user.id) {
      return res.status(403).json({ error: "Este lote está reservado por outro corretor" });
    }

    // 2. Serializa payloadFinanceiro se vier como objeto
    const payloadStr = typeof payloadFinanceiro === "string"
      ? payloadFinanceiro
      : JSON.stringify(payloadFinanceiro);

    // 3. Cria a proposta — Fase 1: inclui projectId quando disponível
    const proposta = await prisma.proposta.create({
      data: {
        loteId,
        corretorId: req.user.id,
        nomeCliente,
        telefoneCliente: telefoneCliente || null,
        emailCliente: emailCliente || null,
        payloadFinanceiro: payloadStr,
        status: "Pendente",
        projectId: req.project?.id || lote.projectId || null
      }
    });

    notifyNewProposal(proposta, lote, req.user);
    notifyBrokerProposal(proposta, lote, req.user);

    res.status(201).json({
      ...proposta,
      payloadFinanceiro: JSON.parse(proposta.payloadFinanceiro),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// GET /propostas  (admin: todas do projeto | corretor: só as suas no projeto)
// Fase 1: filtra por projectId quando projeto resolvido
app.get("/propostas", requireAuth, resolveProject, async (req, res) => {
  try {
    const where = {
      // Admin vê todas; corretor vê só as suas
      ...(isAdmin(req) ? {} : { corretorId: req.user.id }),
      // Fase 1: filtra por projeto quando resolvido
      ...(req.project ? { projectId: req.project.id } : {}),
    };
    const propostas = await prisma.proposta.findMany({
      where,
      orderBy: { criadaEm: "desc" },
    });
    res.json(propostas.map(p => ({
      ...p,
      payloadFinanceiro: JSON.parse(p.payloadFinanceiro),
    })));
  } catch (error) {
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// ── GESTÃO DE USUÁRIOS (Admin) ──

// GET /users
// Fase 1: usa isAdmin()
app.get("/users", requireAuth, async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: "Acesso negado" });
  try {
    const users = await prisma.user.findMany({
      select: { id: true, nome: true, login: true, role: true, status: true, telefone: true, imobiliaria: true, createdAt: true },
      orderBy: { nome: "asc" }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar usuários" });
  }
});

// POST /users
// Fase 1: usa isAdmin()
app.post("/users", requireAuth, async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: "Acesso negado" });
  try {
    const { nome, login, senha, role, status, telefone, imobiliaria } = req.body;
    if (!nome || !login || !senha || !role) {
      return res.status(400).json({ error: "Preencha todos os campos obrigatórios" });
    }

    const exists = await prisma.user.findUnique({ where: { login } });
    if (exists) return res.status(400).json({ error: "Este login já está em uso" });

    const senhaHash = await bcrypt.hash(senha, 10);
    const userRole = role.toLowerCase(); // Normaliza para admin ou corretor

    const newUser = await prisma.user.create({
      data: {
        nome,
        login,
        senhaHash,
        role: userRole,
        status: status || "ATIVO",
        telefone,
        imobiliaria
      }
    });

    res.status(201).json({
      id: newUser.id,
      nome: newUser.nome,
      login: newUser.login,
      role: newUser.role,
      status: newUser.status
    });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    res.status(500).json({ error: "Erro interno ao criar usuário" });
  }
});

// PATCH /users/:id/status
// Fase 1: usa isAdmin()
app.patch("/users/:id/status", requireAuth, async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: "Acesso negado" });
  try {
    const { status } = req.body;
    if (!status || !["ATIVO", "PENDENTE", "INATIVO", "RECUSADO"].includes(status)) {
      return res.status(400).json({ error: "Status inválido" });
    }

    const { id } = req.params;
    const user = await prisma.user.update({
      where: { id },
      data: { status }
    });

    if (status === "ATIVO") notifyBrokerAccessApproved(user);
    if (status === "RECUSADO") notifyBrokerAccessRejected(user);

    res.json({ message: "Status atualizado com sucesso", user: { id: user.id, status: user.status } });
  } catch (error) {
    console.error("Erro ao atualizar status:", error);
    res.status(500).json({ error: "Erro interno ao atualizar status" });
  }
});

// ── IMPORTAÇÃO DE PLANILHA (Admin Only) ──

// POST /lotes/import-preview
// Fase 1: usa isAdmin(); registra projectId no AuditLog de confirmação
app.post("/lotes/import-preview", requireAuth, resolveProject, upload.single('file'), async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: "Acesso negado" });

  try {
    if (!req.file) return res.status(400).json({ error: "Arquivo não fornecido" });

    const buffer = req.file.buffer;
    const workbook = XLSX.read(buffer, { type: 'buffer' });

    // Procura aba específica ou usa a primeira
    let sheetName = workbook.SheetNames.find(n => n.toUpperCase() === "IMPORTAR_SITE");
    if (!sheetName) sheetName = workbook.SheetNames[0];

    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    if (data.length === 0) return res.status(400).json({ error: "Planilha vazia ou aba incorreta" });

    const lotesNoBanco = await prisma.lote.findMany();
    const mapBanco = new Map(lotesNoBanco.map(l => [`${l.q}-${l.n}`.toUpperCase(), l]));

    const diffs = [];

    for (const row of data) {
      // Normalização de chaves para evitar problemas com espaços ou case
      const normRow = {};
      Object.keys(row).forEach(k => {
        const normKey = k.trim().toUpperCase().replace(/[\s_]/g, '');
        normRow[normKey] = row[k];
      });

      const q = String(normRow.QUADRA || "").trim().toUpperCase();
      const n = String(normRow.LOTE || "").trim().toUpperCase();

      if (!q || !n) continue;

      const id = `${q}-${n}`;
      const lote = mapBanco.get(id);

      if (!lote) {
        diffs.push({ id, status: "Não encontrado", row });
        continue;
      }

      const valorNovo = parseFloat(normRow.VALORLOTE) || 0;
      const areaNova = parseFloat(normRow.AREAM2) || 0;
      const statusNovo = String(normRow.STATUS || "").trim();
      const situacaoLegalNova = String(normRow.SITUACAOLEGAL || "").trim();
      const valorAvistaNovo = normRow.VALORAVISTA ? parseFloat(normRow.VALORAVISTA) : null;

      const mudancas = {};
      if (Math.abs(lote.valor - valorNovo) > 0.01) mudancas.valor = { old: lote.valor, new: valorNovo };
      if (Math.abs(lote.area - areaNova) > 0.01) mudancas.area = { old: lote.area, new: areaNova };
      if (lote.status !== statusNovo) {
        mudancas.status = { old: lote.status, new: statusNovo };
        // Flag de mudança sensível
        if ((lote.status === "Vendido" || lote.status === "Reservado") && statusNovo === "Disponível") {
          mudancas.sensivel = true;
        }
      }
      if (lote.situacaoLegal !== situacaoLegalNova) mudancas.situacaoLegal = { old: lote.situacaoLegal, new: situacaoLegalNova };
      if (valorAvistaNovo !== null && Math.abs((lote.valorAvista || 0) - valorAvistaNovo) > 0.01) {
        mudancas.valorAvista = { old: lote.valorAvista, new: valorAvistaNovo };
      }

      if (Object.keys(mudancas).length > 0) {
        diffs.push({
          id,
          q,
          n,
          loteOriginal: lote,
          mudancas,
          valoresNovos: {
            valor: valorNovo,
            area: areaNova,
            status: statusNovo,
            situacaoLegal: situacaoLegalNova,
            valorAvista: valorAvistaNovo
          }
        });
      }
    }

    res.json({ diffs });
  } catch (error) {
    console.error("Erro no preview:", error);
    res.status(500).json({ error: "Erro ao processar planilha" });
  }
});

// POST /lotes/import-confirm
// Fase 1: usa isAdmin(); registra projectId no AuditLog
app.post("/lotes/import-confirm", requireAuth, resolveProject, async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: "Acesso negado" });

  const { updates } = req.body; // Array de { id, valoresNovos }
  if (!updates || !Array.isArray(updates)) return res.status(400).json({ error: "Dados invlidos" });

  try {
    // Proteção: Não sobrescrever lotes Vendidos via importação automática
    const lotesNoBanco = await prisma.lote.findMany({
      where: { id: { in: updates.map(u => u.id) } }
    });
    const mapVendidos = new Map(lotesNoBanco.filter(l => l.status === "Vendido").map(l => [l.id, l]));

    const validUpdates = updates.filter(u => {
      if (mapVendidos.has(u.id)) {
        console.warn(`⚠️ Importação pulada para o Lote ${u.id}: Status atual é 'Vendido'.`);
        return false;
      }
      return true;
    });

    const results = await prisma.$transaction(
      validUpdates.map(u => prisma.lote.update({
        where: { id: u.id },
        data: {
          valor: u.valoresNovos.valor,
          area: u.valoresNovos.area,
          status: u.valoresNovos.status,
          situacaoLegal: u.valoresNovos.situacaoLegal,
          valorAvista: u.valoresNovos.valorAvista !== null ? u.valoresNovos.valorAvista : undefined
        }
      }))
    );

    // Registro no AuditLog resiliente fora da transação
    // Fase 1: inclui projectId quando disponível
    try {
      if (validUpdates.length > 0) {
        await prisma.auditLog.create({
          data: {
            loteId: validUpdates[0].id,
            userId: req.user.id,
            evento: "IMPORTACAO_PLANILHA",
            payloadNovo: JSON.stringify({
              total: validUpdates.length,
              pulas: updates.length - validUpdates.length,
              ids: validUpdates.slice(0, 10).map(u => u.id),
              info: "Importação em massa via planilha (lotes vendidos preservados)"
            }),
            projectId: req.project?.id || null
          }
        });
      }
    } catch (logError) {
      console.warn("⚠️ Falha ao registrar AuditLog da importação:", logError.message);
      // Não lançamos o erro para não travar a resposta de sucesso ao usuário
    }

    res.json({ message: `${results.length} lotes atualizados com sucesso` });
  } catch (error) {
    console.error("Erro na confirmação:", error);
    res.status(500).json({ error: "Erro ao aplicar atualizações" });
  }
});

// ── ROTAS DE PROJETO (Fase 1 — leitura de contexto) ──

// GET /project/current — retorna o projeto resolvido para o usuário atual
// Útil para o frontend saber qual projeto está ativo sem mudar telas
app.get("/project/current", requireAuth, resolveProject, async (req, res) => {
  if (!req.project) {
    return res.status(404).json({ error: "Nenhum projeto ativo encontrado para este usuário" });
  }

  // Inclui perfil do usuário no projeto (se existir)
  let perfil = null;
  if (!req.user.isSuperAdmin) {
    const member = await prisma.projectMember.findFirst({
      where: { projectId: req.project.id, userId: req.user.id, status: 'ATIVO' },
      select: { perfil: true, status: true }
    });
    perfil = member?.perfil || null;
  } else {
    perfil = 'project_admin'; // Super Admin tem perfil admin em qualquer projeto
  }

  res.json({
    project: {
      id: req.project.id,
      nome: req.project.nome,
      slug: req.project.slug,
      config: req.project.config ? JSON.parse(req.project.config) : null,
    },
    perfil,
    isSuperAdmin: req.user.isSuperAdmin || false
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Terra Vista API rodando na porta ${PORT}`);
});
