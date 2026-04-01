import express from "express";
import cors from "cors";
import { PrismaClient } from "../prisma/generated/client/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import 'dotenv/config';
import * as XLSX from 'xlsx';
import multer from 'multer';

const app = express();
const prisma = new PrismaClient();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "terravista_super_secret_dev";

// ── MIDDLEWARE AUTH ──
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Token não fornecido" });
  
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: "Token inválido" });
  }
};

// ── ROTAS BASILARES ──

// POST /auth/login
app.post("/auth/login", async (req, res) => {
  const { login, senha } = req.body;
  if (!login || !senha) return res.status(400).json({ error: "Preencha os campos" });
  
  const user = await prisma.user.findUnique({ where: { login } });
  if (!user) return res.status(401).json({ error: "Credenciais inválidas" });

  const isMatch = await bcrypt.compare(senha, user.senhaHash);
  if (!isMatch) return res.status(401).json({ error: "Credenciais inválidas" });

  const token = jwt.sign(
    { id: user.id, login: user.login, role: user.role.toLowerCase(), nome: user.nome }, 
    JWT_SECRET, 
    { expiresIn: "12h" }
  );
  
  res.json({
    token,
    user: { id: user.id, login: user.login, role: user.role.toLowerCase(), nome: user.nome }
  });
});

// GET /lotes
app.get("/lotes", async (req, res) => {
  try {
    const lotes = await prisma.lote.findMany();
    // Opcional: Omitir "comprador" se o requester for corretor,
    // mas na Fase 1 abriremos para validar o bind do App.jsx primeiro.
    res.json(lotes);
  } catch (error) {
    res.status(500).json({ error: "Erro interno no BD" });
  }
});

// POST /lotes/:id/reservar
app.post("/lotes/:id/reservar", requireAuth, async (req, res) => {
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

    res.json({ message: "Reservado com sucesso", reservaVenceEm });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// POST /lotes/:id/liberar  (admin only)
app.post("/lotes/:id/liberar", requireAuth, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Apenas administradores podem liberar reservas" });
  }
  try {
    const { id } = req.params;
    const lote = await prisma.lote.findUnique({ where: { id } });
    if (!lote) return res.status(404).json({ error: "Lote não encontrado" });
    if (lote.status !== "Reservado") {
      return res.status(409).json({ error: "Lote não está Reservado" });
    }

    await prisma.lote.update({
      where: { id },
      data: { status: "Disponível", reservaOwnerId: null, reservaVenceEm: null },
    });

    res.json({ message: `Reserva do Lote ${id} liberada com sucesso` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// POST /lotes/:id/estornar  (admin only)
app.post("/lotes/:id/estornar", requireAuth, async (req, res) => {
  if (req.user.role !== "admin") {
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
      // 3. Registra evento no AuditLog
      prisma.auditLog.create({
        data: {
          loteId: id,
          userId: req.user.id,
          evento: "ESTORNO",
          payloadAnterior: snapshotAnterior,
          payloadNovo: snapshotNovo,
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

// ── GESTÃO DE PROPOSTAS (Admin) ──

// POST /propostas/:id/aprovar
app.post("/propostas/:id/aprovar", requireAuth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Apenas admin" });
  try {
    const proposta = await prisma.proposta.findUnique({ where: { id: req.params.id } });
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

    res.json({ proposta: propostaAtualizada });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// POST /propostas/:id/recusar
app.post("/propostas/:id/recusar", requireAuth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Apenas admin" });
  try {
    const proposta = await prisma.proposta.findUnique({ where: { id: req.params.id } });
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

    res.json({ proposta: propostaAtualizada });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// POST /propostas/:id/ajuste  (só em Pendente)
app.post("/propostas/:id/ajuste", requireAuth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Apenas admin" });
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
app.post("/propostas", requireAuth, async (req, res) => {
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

    // 3. Cria a proposta
    const proposta = await prisma.proposta.create({
      data: {
        loteId,
        corretorId: req.user.id,
        nomeCliente,
        telefoneCliente: telefoneCliente || null,
        emailCliente: emailCliente || null,
        payloadFinanceiro: payloadStr,
        status: "Pendente",
      }
    });

    res.status(201).json({
      ...proposta,
      payloadFinanceiro: JSON.parse(proposta.payloadFinanceiro),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// GET /propostas  (admin: todas | corretor: só as suas)
app.get("/propostas", requireAuth, async (req, res) => {
  try {
    const where = req.user.role === "admin" ? {} : { corretorId: req.user.id };
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
app.get("/users", requireAuth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Acesso negado" });
  try {
    const users = await prisma.user.findMany({
      select: { id: true, nome: true, login: true, role: true, createdAt: true },
      orderBy: { nome: "asc" }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar usuários" });
  }
});

// POST /users
app.post("/users", requireAuth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Acesso negado" });
  try {
    const { nome, login, senha, role } = req.body;
    if (!nome || !login || !senha || !role) {
      return res.status(400).json({ error: "Preencha todos os campos" });
    }
    
    const exists = await prisma.user.findUnique({ where: { login } });
    if (exists) return res.status(400).json({ error: "Este login já está em uso" });

    const senhaHash = await bcrypt.hash(senha, 10);
    const userRole = role.toLowerCase(); // Normaliza para admin ou corretor

    const newUser = await prisma.user.create({
      data: { nome, login, senhaHash, role: userRole }
    });

    res.status(201).json({ 
      id: newUser.id, 
      nome: newUser.nome, 
      login: newUser.login, 
      role: newUser.role 
    });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    res.status(500).json({ error: "Erro interno ao criar usuário" });
  }
});

// ── IMPORTAÇÃO DE PLANILHA (Admin) ──

// POST /admin/lotes/import/preview
app.post("/admin/lotes/import/preview", requireAuth, upload.single('file'), async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Acesso negado" });
  
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

// POST /admin/lotes/import/confirm
app.post("/admin/lotes/import/confirm", requireAuth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Acesso negado" });
  
  const { updates } = req.body; // Array de { id, valoresNovos }
  if (!updates || !Array.isArray(updates)) return res.status(400).json({ error: "Dados invlidos" });

  try {
    const results = await prisma.$transaction(
      updates.map(u => prisma.lote.update({
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
    // Usamos o primeiro lote da lista como referência de "âncora" para o log global de importação
    try {
      if (updates.length > 0) {
        await prisma.auditLog.create({
          data: {
            loteId: updates[0].id, 
            userId: req.user.id,
            evento: "IMPORTACAO_PLANILHA",
            payloadNovo: JSON.stringify({ 
              total: updates.length, 
              ids: updates.slice(0, 10).map(u => u.id), // Loga apenas os primeiros 10 IDs para evitar payload gigante
              info: "Importação em massa via planilha" 
            })
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Terra Vista API rodando na porta ${PORT}`);
});
