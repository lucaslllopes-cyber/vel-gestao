/**
 * seed-fase1.js — Seed complementar da Fase 1: Fundação Multioperação Mínima
 *
 * Uso:
 *   node prisma/seed-fase1.js             → DRY-RUN (preview, nada gravado)
 *   node prisma/seed-fase1.js --apply     → grava no banco
 *
 * Idempotente: pode ser executado múltiplas vezes sem duplicar dados.
 */

import { PrismaClient } from './generated/client/index.js';

const prisma = new PrismaClient();
const DRY_RUN = !process.argv.includes('--apply');
const MODO = DRY_RUN ? '🔍 DRY-RUN (preview — nada será gravado)' : '✅ APPLY (gravando no banco)';

// ─────────────────────────────────────────────────────────────
// CONFIGURAÇÕES DA OPERAÇÃO
// ─────────────────────────────────────────────────────────────

const ORG_CONFIG = {
  nome:      'Operação Terra Vista',
  slug:      'operacao-terra-vista',
  descricao: 'Operação inicial do empreendimento Residencial Terra Vista. ' +
             'Organização neutra — representa o conjunto de participantes do empreendimento, ' +
             'não apenas uma única empresa.',
  status:    'ATIVO',
};

const PROJECT_CONFIG = {
  nome:   'Residencial Terra Vista',
  slug:   'residencial-terra-vista',
  // Schema suporta: LOTEAMENTO | CONDOMINIO | COMERCIAL
  // "full_operation" solicitado não existe no schema — usando LOTEAMENTO (correto para este empreendimento).
  tipo:   'LOTEAMENTO',
  status: 'ATIVO',
  cidade: 'Caldas', // Município do empreendimento (entre Poços de Caldas e Bandeira do Sul)
  estado: 'MG',
  // Config comercial herdada do DEFAULT_CFG atual (src/data/constants.js)
  config: JSON.stringify({
    entrada_min_pct: 10,
    taxa_am:         0.8,
    tabelas:         ['SACOC', 'PRICE'],
    anuais_qtd:      5,
    anuais_val:      2000,
    reserva_horas:   48,
  }),
};

// ─────────────────────────────────────────────────────────────
// MÓDULOS DO PROJETO
// Tipo é String livre no schema — usando nomenclatura funcional.
// Referência do plano: commercial|map|proposals|import_export|financial|documents|crm|reports|...
// Nomenclatura ajustada conforme solicitação do Commit 3A.
// ─────────────────────────────────────────────────────────────

const MODULES = [
  // ── ATIVOS nesta fase ──────────────────────────────────────
  { tipo: 'commercial',   ativo: true,  nota: 'Funcionalidade principal já operacional' },
  { tipo: 'reservations', ativo: true,  nota: 'Mapa e reserva de lotes já operacional' },
  { tipo: 'proposals',    ativo: true,  nota: 'Propostas comerciais já operacionais' },
  // ── INATIVOS — previstos para fases futuras ────────────────
  { tipo: 'reports',          ativo: false, nota: 'Relatórios — estrutura prevista, não implementada' },
  { tipo: 'contracts',        ativo: false, nota: 'Contratos — Fase 2+' },
  { tipo: 'documents',        ativo: false, nota: 'Gestão de documentos — Fase 2+' },
  { tipo: 'installments',     ativo: false, nota: 'Parcelas/carnê — Fase 2+' },
  { tipo: 'commissions',      ativo: false, nota: 'Comissões — Fase 2+' },
  { tipo: 'financial_admin',  ativo: false, nota: 'Admin financeiro — Fase 2+' },
  { tipo: 'billing',          ativo: false, nota: 'Cobrança/faturamento — Fase 2+' },
  { tipo: 'partner_reports',  ativo: false, nota: 'Relatórios para sócios/parceiros — Fase 3+' },
];

// ─────────────────────────────────────────────────────────────
// PARTICIPANTES (sem acesso operacional automático)
// ─────────────────────────────────────────────────────────────

const PARTICIPANTS = [
  {
    nome:                  'Diego',
    tipoParticipacao:      'SOCIO',
    descricao:             'Sócio/parceiro do empreendimento Terra Vista. ' +
                           'Sem acesso operacional automático. ' +
                           'Acesso a relatórios somente se Lucas liberar explicitamente.',
    percentualParticipacao: null, // ⚠ Confirmar percentual com Lucas
    percentualComissao:     null, // ⚠ Confirmar com Lucas
    userId:                null, // não possui conta no sistema ainda
  },
  {
    nome:                  'Claudinei',
    tipoParticipacao:      'SOCIO',
    descricao:             'Sócio/parceiro do empreendimento Terra Vista. ' +
                           'Sem acesso operacional automático. ' +
                           'Acesso a relatórios somente se Lucas liberar explicitamente.',
    percentualParticipacao: null, // ⚠ Confirmar percentual com Lucas
    percentualComissao:     null, // ⚠ Confirmar com Lucas
    userId:                null,
  },
];

// ─────────────────────────────────────────────────────────────
// HEURÍSTICA DE MAPEAMENTO DE USUÁRIOS → PERFIL NO PROJETO
// ─────────────────────────────────────────────────────────────

function classificarUsuario(user) {
  const login = (user.login || '').toLowerCase();
  const nome  = (user.nome  || '').toLowerCase();
  const role  = (user.role  || '').toLowerCase();

  // Usuário INATIVO → nunca criar ProjectMember
  if (user.status === 'INATIVO') {
    return {
      acao:   'IGNORAR',
      motivo: `status INATIVO — não receberá acesso ao projeto`,
      perfil: null,
      isSuperAdmin: false,
    };
  }

  // Admin do sistema → presumido Lucas (único usuário com role=ADMIN)
  if (role === 'admin' || login === 'admin') {
    return {
      acao:   'PROJECT_MEMBER',
      perfil: 'project_admin',
      isSuperAdmin: true,
      motivo: `role=ADMIN / login="admin" → presumido Lucas (Gestão Terra Vista). ` +
               `⚠ Confirme se este é realmente o cadastro de Lucas.`,
      status: 'ATIVO',
    };
  }

  // Adriane → commercial_manager
  if (login.includes('adri') || nome.includes('adriane') || nome === 'adriane') {
    return {
      acao:   'PROJECT_MEMBER',
      perfil: 'commercial_manager',
      isSuperAdmin: false,
      motivo: `nome/login contém "adri"/"adriane" → mapeado como Adriane (commercial_manager)`,
      status: 'ATIVO',
    };
  }

  // João → não conceder acesso sem confirmação explícita
  if (login.includes('joao') || login.includes('joão') ||
      nome.includes('joao')  || nome.includes('joão')) {
    return {
      acao:   'ALERTA_SEM_ACAO',
      perfil: null,
      isSuperAdmin: false,
      motivo: `⚠ Possível usuário João identificado. Política: sem acesso global automático. ` +
               `Nenhum ProjectMember será criado sem confirmação explícita de Lucas.`,
    };
  }

  // Usuários com nome claramente de teste → alertar
  if (nome.includes('teste') || nome.includes('test') || login.includes('teste') || login.includes('test')) {
    return {
      acao:   'ALERTA_SEM_ACAO',
      perfil: null,
      isSuperAdmin: false,
      motivo: `⚠ Nome/login contém "teste" — usuário de desenvolvimento. ` +
               `Nenhum ProjectMember criado. Confirme com Lucas se deve ter acesso.`,
    };
  }

  // Corretores ativos → perfil corretor no projeto
  if (role === 'corretor') {
    return {
      acao:   'PROJECT_MEMBER',
      perfil: 'corretor',
      isSuperAdmin: false,
      motivo: `role=corretor, status=ATIVO → acesso como corretor no projeto`,
      status: 'ATIVO',
    };
  }

  // Qualquer outro caso → alertar
  return {
    acao:   'ALERTA_SEM_ACAO',
    perfil: null,
    isSuperAdmin: false,
    motivo: `⚠ Perfil não reconhecido automaticamente (role=${user.role}). ` +
             `Confirme manualmente com Lucas.`,
  };
}

// ─────────────────────────────────────────────────────────────
// UTILITÁRIOS
// ─────────────────────────────────────────────────────────────

function sep(char = '─', len = 60) {
  return char.repeat(len);
}

function label(txt) {
  console.log(`\n${sep()}`);
  console.log(`  ${txt}`);
  console.log(sep());
}

async function execOrPreview(label, fn) {
  if (DRY_RUN) {
    console.log(`  [DRY-RUN] ${label}`);
    return null;
  }
  const result = await fn();
  console.log(`  [APLICADO] ${label}`);
  return result;
}

// ─────────────────────────────────────────────────────────────
// SEED PRINCIPAL
// ─────────────────────────────────────────────────────────────

async function main() {
  console.log('\n' + sep('═'));
  console.log(`  SEED FASE 1 — FUNDAÇÃO MULTIOPERAÇÃO`);
  console.log(`  Modo: ${MODO}`);
  console.log(sep('═'));

  // ── 1. ORGANIZATION ────────────────────────────────────────

  label('1. ORGANIZATION');

  const orgExistente = await prisma.organization.findUnique({
    where: { slug: ORG_CONFIG.slug },
  });

  let orgId;
  if (orgExistente) {
    console.log(`  ✓ Já existe: "${orgExistente.nome}" (id: ${orgExistente.id.slice(0,8)}...)`);
    console.log(`    → Reutilizando (idempotente)`);
    orgId = orgExistente.id;
  } else {
    console.log(`  → Criar: "${ORG_CONFIG.nome}" (slug: ${ORG_CONFIG.slug})`);
    console.log(`    descricao: "${ORG_CONFIG.descricao}"`);
    const criada = await execOrPreview(
      `Organization.create("${ORG_CONFIG.nome}")`,
      () => prisma.organization.create({ data: ORG_CONFIG }),
    );
    orgId = criada?.id ?? '[id-gerado-no-apply]';
  }

  // ── 2. PROJECT ─────────────────────────────────────────────

  label('2. PROJECT');

  console.log(`  ⚠ Nota sobre tipo: solicitado "full_operation" — schema suporta apenas`);
  console.log(`    LOTEAMENTO | CONDOMINIO | COMERCIAL.`);
  console.log(`    Usando "LOTEAMENTO" (correto para Terra Vista).`);
  console.log(`    Para estender tipos suportados, adicionar campo em Fase futura.`);
  console.log();

  const projectExistente = await prisma.project.findUnique({
    where: { slug: PROJECT_CONFIG.slug },
  });

  let projectId;
  if (projectExistente) {
    console.log(`  ✓ Já existe: "${projectExistente.nome}" (id: ${projectExistente.id.slice(0,8)}...)`);
    console.log(`    → Reutilizando (idempotente)`);
    projectId = projectExistente.id;
  } else {
    console.log(`  → Criar: "${PROJECT_CONFIG.nome}"`);
    console.log(`    slug: ${PROJECT_CONFIG.slug}`);
    console.log(`    tipo: ${PROJECT_CONFIG.tipo}`);
    console.log(`    cidade: ${PROJECT_CONFIG.cidade ?? '⚠ null — confirmar com Lucas'}`);
    console.log(`    estado: ${PROJECT_CONFIG.estado ?? '⚠ null — confirmar com Lucas'}`);
    console.log(`    config: ${PROJECT_CONFIG.config}`);

    const criado = await execOrPreview(
      `Project.create("${PROJECT_CONFIG.nome}")`,
      () => prisma.project.create({
        data: { ...PROJECT_CONFIG, organizationId: orgId },
      }),
    );
    projectId = criado?.id ?? '[id-gerado-no-apply]';
  }

  // ── 3. PROJECT MODULES ─────────────────────────────────────

  label('3. PROJECT MODULES');

  const modulosExistentes = await prisma.projectModule.findMany({
    where: { projectId: projectId === '[id-gerado-no-apply]' ? undefined : projectId },
    select: { tipo: true, ativo: true },
  });
  const tiposExistentes = new Set(modulosExistentes.map(m => m.tipo));

  for (const mod of MODULES) {
    const icone   = mod.ativo ? '🟢' : '⚪';
    const estado  = mod.ativo ? 'ATIVO' : 'INATIVO';
    if (tiposExistentes.has(mod.tipo)) {
      const existente = modulosExistentes.find(m => m.tipo === mod.tipo);
      if (existente.ativo !== mod.ativo) {
        console.log(`  ${icone} ${mod.tipo.padEnd(18)} ${estado}  ← atualizar (era: ${existente.ativo ? 'ATIVO' : 'INATIVO'})`);
        await execOrPreview(
          `ProjectModule.upsert(${mod.tipo}, ativo=${mod.ativo})`,
          () => prisma.projectModule.updateMany({
            where: { projectId, tipo: mod.tipo },
            data:  { ativo: mod.ativo },
          }),
        );
      } else {
        console.log(`  ${icone} ${mod.tipo.padEnd(18)} ${estado}  (sem alteração)`);
      }
    } else {
      console.log(`  ${icone} ${mod.tipo.padEnd(18)} ${estado}  → criar | ${mod.nota}`);
      await execOrPreview(
        `ProjectModule.create(${mod.tipo})`,
        () => prisma.projectModule.create({
          data: { projectId, tipo: mod.tipo, ativo: mod.ativo },
        }),
      );
    }
  }

  // ── 4. USUÁRIOS E PROJECT MEMBERS ──────────────────────────

  label('4. USUÁRIOS → PROJECT MEMBERS');

  const usuarios = await prisma.user.findMany({
    select: { id: true, nome: true, login: true, role: true, status: true, isSuperAdmin: true },
    orderBy: { createdAt: 'asc' },
  });

  console.log(`  Usuários encontrados no banco: ${usuarios.length}\n`);

  const membrosParaCriar  = [];
  const alertas           = [];

  for (const user of usuarios) {
    const cls = classificarUsuario(user);
    const loginDisplay = user.login.length > 30 ? user.login.slice(0,27) + '...' : user.login;
    console.log(`  ┌─ [${user.role.padEnd(9)}] ${loginDisplay}`);
    console.log(`  │  nome:   ${user.nome}`);
    console.log(`  │  status: ${user.status}`);
    console.log(`  │  ação:   ${cls.acao}`);
    console.log(`  └─ motivo: ${cls.motivo}`);
    console.log();

    if (cls.acao === 'PROJECT_MEMBER') {
      membrosParaCriar.push({ user, cls });
    } else if (cls.acao === 'ALERTA_SEM_ACAO') {
      alertas.push({ user, cls });
    }
  }

  console.log(`\n  ProjectMembers a criar: ${membrosParaCriar.length}`);
  console.log(`  Alertas (sem ação automática): ${alertas.length}`);

  // Criar ProjectMembers
  for (const { user, cls } of membrosParaCriar) {
    // Verificar se já existe
    const existente = await prisma.projectMember.findFirst({
      where: {
        projectId: projectId === '[id-gerado-no-apply]' ? undefined : projectId,
        userId:    user.id,
      },
    });

    if (existente) {
      console.log(`  ✓ ProjectMember já existe: ${user.login} (${cls.perfil}) — sem alteração`);
    } else {
      console.log(`  → Criar ProjectMember: ${user.login} → perfil="${cls.perfil}", status=ATIVO`);
      await execOrPreview(
        `ProjectMember.create(userId=${user.id.slice(0,8)}..., perfil=${cls.perfil})`,
        () => prisma.projectMember.create({
          data: {
            projectId,
            userId:    user.id,
            perfil:    cls.perfil,
            status:    cls.status ?? 'ATIVO',
          },
        }),
      );
    }

    // Atualizar isSuperAdmin no User se necessário
    if (cls.isSuperAdmin && !user.isSuperAdmin) {
      console.log(`  → Atualizar User.isSuperAdmin=true para: ${user.login}`);
      await execOrPreview(
        `User.update(id=${user.id.slice(0,8)}..., isSuperAdmin=true)`,
        () => prisma.user.update({
          where: { id: user.id },
          data:  { isSuperAdmin: true },
        }),
      );
    }
  }

  // ── 5. PROJECT PARTICIPANTS ────────────────────────────────

  label('5. PROJECT PARTICIPANTS (sem acesso operacional)');

  for (const p of PARTICIPANTS) {
    const existente = await prisma.projectParticipant.findFirst({
      where: {
        projectId: projectId === '[id-gerado-no-apply]' ? undefined : projectId,
        nome:      p.nome,
      },
    });

    if (existente) {
      console.log(`  ✓ Participante já existe: ${p.nome} (${existente.tipoParticipacao}) — sem alteração`);
    } else {
      console.log(`  → Criar ProjectParticipant:`);
      console.log(`    nome:             ${p.nome}`);
      console.log(`    tipoParticipacao: ${p.tipoParticipacao}`);
      console.log(`    userId:           null (sem conta no sistema)`);
      console.log(`    percentualParticipacao: ⚠ null — confirmar com Lucas`);
      console.log(`    percentualComissao:     ⚠ null — confirmar com Lucas`);
      console.log(`    descricao: "${p.descricao}"`);

      await execOrPreview(
        `ProjectParticipant.create("${p.nome}", SOCIO)`,
        () => prisma.projectParticipant.create({
          data: { projectId, ...p },
        }),
      );
    }
    console.log();
  }

  // ── 6. VINCULAR LOTES AO PROJETO ──────────────────────────

  label('6. LOTES → VÍNCULO COM PROJETO');

  const totalLotes = await prisma.lote.count();
  const lotesJaVinculados = await prisma.lote.count({
    where: {
      projectId: projectId === '[id-gerado-no-apply]'
        ? { not: null }
        : projectId,
    },
  });
  const lotesSemVinculo = await prisma.lote.count({
    where: { projectId: null },
  });
  const lotesOutrosProjetos = await prisma.lote.count({
    where: {
      projectId: {
        not: null,
        ...(projectId !== '[id-gerado-no-apply]' ? { not: projectId } : {}),
      },
    },
  });

  console.log(`  Total de lotes no banco:          ${totalLotes}`);
  console.log(`  Lotes sem projectId (null):       ${lotesSemVinculo}  → serão vinculados ao Terra Vista`);
  console.log(`  Lotes já vinculados a este proj:  ${lotesJaVinculados}`);
  if (lotesOutrosProjetos > 0) {
    console.log(`  ⚠ Lotes vinculados a OUTRO projeto: ${lotesOutrosProjetos}  → NÃO serão alterados`);
  }

  if (lotesSemVinculo > 0) {
    console.log(`\n  → Vincular ${lotesSemVinculo} lotes ao projeto "${PROJECT_CONFIG.nome}"`);
    await execOrPreview(
      `Lote.updateMany(projectId=null → projectId=${projectId.slice(0,8)}...)`,
      () => prisma.lote.updateMany({
        where: { projectId: null },
        data:  { projectId },
      }),
    );
  } else {
    console.log(`  ✓ Todos os lotes já estão vinculados — sem alteração`);
  }

  // ── 7. VINCULAR PROPOSTAS AO PROJETO ──────────────────────

  label('7. PROPOSTAS → VÍNCULO COM PROJETO');

  const totalPropostas = await prisma.proposta.count();
  const propostasJaVinculadas = await prisma.proposta.count({
    where: {
      projectId: projectId === '[id-gerado-no-apply]'
        ? { not: null }
        : projectId,
    },
  });
  const propostasSemVinculo = await prisma.proposta.count({
    where: { projectId: null },
  });

  console.log(`  Total de propostas no banco:         ${totalPropostas}`);
  console.log(`  Propostas sem projectId (null):      ${propostasSemVinculo}  → serão vinculadas`);
  console.log(`  Propostas já vinculadas a este proj: ${propostasJaVinculadas}`);

  if (propostasSemVinculo > 0) {
    console.log(`\n  → Vincular ${propostasSemVinculo} propostas ao projeto "${PROJECT_CONFIG.nome}"`);
    await execOrPreview(
      `Proposta.updateMany(projectId=null → projectId=${projectId.slice(0,8)}...)`,
      () => prisma.proposta.updateMany({
        where: { projectId: null },
        data:  { projectId },
      }),
    );
  } else {
    console.log(`  ✓ Todas as propostas já estão vinculadas — sem alteração`);
  }

  // ── 8. RELATÓRIO FINAL ─────────────────────────────────────

  label('8. RESUMO DO ' + (DRY_RUN ? 'DRY-RUN' : 'APPLY'));

  console.log(`  Organization:       "${ORG_CONFIG.nome}"`);
  console.log(`  Project:            "${PROJECT_CONFIG.nome}"`);
  console.log(`  Módulos ativos:     ${MODULES.filter(m => m.ativo).map(m => m.tipo).join(', ')}`);
  console.log(`  Módulos inativos:   ${MODULES.filter(m => !m.ativo).map(m => m.tipo).join(', ')}`);
  console.log(`  ProjectMembers:     ${membrosParaCriar.length} usuário(s) com acesso operacional`);
  membrosParaCriar.forEach(({ user, cls }) => {
    const superTag = cls.isSuperAdmin ? ' [isSuperAdmin=true]' : '';
    console.log(`    • ${user.login.padEnd(35)} → ${cls.perfil}${superTag}`);
  });
  console.log(`  Sem acesso (alerta):`);
  alertas.forEach(({ user, cls }) => {
    console.log(`    ⚠ ${user.login.padEnd(35)} → ${cls.acao}`);
  });
  console.log(`  ProjectParticipants: ${PARTICIPANTS.length} (Diego, Claudinei — sem acesso operacional)`);
  console.log(`  Lotes a vincular:    ${lotesSemVinculo} de ${totalLotes}`);
  console.log(`  Propostas a vincular:${propostasSemVinculo} de ${totalPropostas}`);

  console.log();
  if (DRY_RUN) {
    console.log(`  ⚡ NENHUM DADO FOI GRAVADO.`);
    console.log(`  Para aplicar, execute:`);
    console.log(`    node prisma/seed-fase1.js --apply`);
  } else {
    console.log(`  ✅ SEED APLICADO COM SUCESSO.`);
  }

  // ── 9. ALERTAS PENDENTES ───────────────────────────────────

  if (alertas.length > 0 || PROJECT_CONFIG.cidade === null) {
    label('9. ALERTAS QUE PRECISAM DE CONFIRMAÇÃO DE LUCAS');

    if (PROJECT_CONFIG.cidade === null) {
      console.log(`  ⚠ cidade e estado do Project estão null.`);
      console.log(`    Confirme a cidade/estado do Terra Vista para preencher no apply.`);
      console.log();
    }

    console.log(`  ⚠ Usuários sem acesso automático (revisar com Lucas):`);
    alertas.forEach(({ user, cls }) => {
      console.log(`    • ${user.login} — ${cls.motivo}`);
    });

    console.log();
    console.log(`  ⚠ ProjectParticipants Diego e Claudinei:`);
    console.log(`    percentualParticipacao e percentualComissao estão null.`);
    console.log(`    Confirmar percentuais com Lucas antes do apply se necessário.`);

    console.log();
    console.log(`  ⚠ João não está cadastrado no banco de dados.`);
    console.log(`    Política aplicada: sem acesso automático.`);
    console.log(`    Se João precisar de acesso, deverá ser cadastrado e vinculado manualmente.`);
  }

  console.log('\n' + sep('═') + '\n');

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error('\n❌ ERRO NO SEED:\n', e);
  await prisma.$disconnect();
  process.exit(1);
});
