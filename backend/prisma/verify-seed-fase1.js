/**
 * verify-seed-fase1.js — Verificação de integridade pós-seed da Fase 1
 * Executar: node prisma/verify-seed-fase1.js
 */
import { PrismaClient } from './generated/client/index.js';
const prisma = new PrismaClient();

let erros = 0;
function ok(msg)   { console.log(`  ✅ ${msg}`); }
function fail(msg) { console.log(`  ❌ ${msg}`); erros++; }
function sep()     { console.log('  ' + '─'.repeat(56)); }
function titulo(t) { console.log(`\n${t}`); }

console.log('\n═'.repeat(57));
console.log('  VERIFICACAO DE INTEGRIDADE POS-SEED FASE 1');
console.log('═'.repeat(57) + '\n');

// ── 1. ORGANIZATION ───────────────────────────────────────
titulo('1. ORGANIZATION');
const org = await prisma.organization.findUnique({ where: { slug: 'operacao-terra-vista' } });
if (org) {
  ok(`Organization criada: "${org.nome}"`);
  ok(`  slug:   ${org.slug}`);
  ok(`  status: ${org.status}`);
} else {
  fail('Organization "operacao-terra-vista" NAO encontrada!');
}
sep();

// ── 2. PROJECT ────────────────────────────────────────────
titulo('2. PROJECT');
const project = await prisma.project.findUnique({ where: { slug: 'residencial-terra-vista' } });
if (project) {
  ok(`Project criado: "${project.nome}"`);
  ok(`  slug:   ${project.slug}`);
  ok(`  tipo:   ${project.tipo}`);
  ok(`  status: ${project.status}`);
  ok(`  cidade: ${project.cidade}`);
  ok(`  estado: ${project.estado}`);
  const cfg = JSON.parse(project.config || '{}');
  ok(`  config.entrada_min_pct: ${cfg.entrada_min_pct}`);
  ok(`  config.taxa_am:         ${cfg.taxa_am}`);
  ok(`  config.tabelas:         ${JSON.stringify(cfg.tabelas)}`);
  ok(`  config.reserva_horas:   ${cfg.reserva_horas}`);
  if (org && project.organizationId === org.id) {
    ok('  organizationId: vinculado corretamente a Organization');
  } else {
    fail('organizationId nao corresponde a org criada!');
  }
} else {
  fail('Project "residencial-terra-vista" NAO encontrado!');
}
sep();

// ── 3. PROJECT MODULES ────────────────────────────────────
titulo('3. PROJECT MODULES');
const modules = project
  ? await prisma.projectModule.findMany({ where: { projectId: project.id }, orderBy: { tipo: 'asc' } })
  : [];
ok(`Total de modulos criados: ${modules.length} (esperado: 11)`);
if (modules.length !== 11) fail(`Esperado 11 modulos, encontrado ${modules.length}`);

const ativos   = modules.filter(m => m.ativo).map(m => m.tipo).sort();
const inativos = modules.filter(m => !m.ativo).map(m => m.tipo).sort();
ok(`Modulos ATIVOS  (${ativos.length}): ${ativos.join(', ')}`);
ok(`Modulos INATIVOS(${inativos.length}): ${inativos.join(', ')}`);

for (const t of ['commercial', 'reservations', 'proposals']) {
  const m = modules.find(m => m.tipo === t);
  if (!m)        fail(`Modulo "${t}" nao encontrado`);
  else if (!m.ativo) fail(`Modulo "${t}" deveria estar ATIVO`);
  else           ok(`  ${t}: ATIVO`);
}
sep();

// ── 4. PROJECT MEMBERS ────────────────────────────────────
titulo('4. PROJECT MEMBERS');
const members = project
  ? await prisma.projectMember.findMany({
      where: { projectId: project.id },
      include: { user: { select: { login: true, nome: true, isSuperAdmin: true } } },
    })
  : [];
ok(`Total de ProjectMembers: ${members.length} (esperado: 3)`);
if (members.length !== 3) fail(`Esperado 3 ProjectMembers, encontrado ${members.length}`);

const adminMember = members.find(m => m.user?.login === 'admin');
if (adminMember) {
  ok(`  admin -> perfil: ${adminMember.perfil}, status: ${adminMember.status}`);
  if (adminMember.perfil !== 'project_admin') fail('admin deveria ter perfil=project_admin');
  if (adminMember.user.isSuperAdmin !== true)  fail('admin deveria ter isSuperAdmin=true');
  else ok('  admin -> isSuperAdmin: true');
} else fail('ProjectMember para "admin" NAO encontrado!');

const adrianeMember = members.find(m => m.user?.login === 'adrimagarner@gmail.com');
if (adrianeMember) {
  ok(`  Adriane -> perfil: ${adrianeMember.perfil}, status: ${adrianeMember.status}`);
  if (adrianeMember.perfil !== 'commercial_manager') fail('Adriane deveria ter perfil=commercial_manager');
} else fail('ProjectMember para Adriane NAO encontrado!');

const corretor1Member = members.find(m => m.user?.login === 'corretor1');
if (corretor1Member) {
  ok(`  corretor1 -> perfil: ${corretor1Member.perfil}, status: ${corretor1Member.status}`);
  if (corretor1Member.perfil !== 'corretor') fail('corretor1 deveria ter perfil=corretor');
} else fail('ProjectMember para "corretor1" NAO encontrado!');
sep();

// ── 5. USUARIOS SEM PROJECT MEMBER ───────────────────────
titulo('5. USUARIOS SEM PROJECT MEMBER (verificacao negativa)');
const testeLocal = await prisma.user.findUnique({ where: { login: 'teste.local@email.com' } });
if (testeLocal && project) {
  const m = await prisma.projectMember.findFirst({ where: { userId: testeLocal.id, projectId: project.id } });
  if (!m) ok('  teste.local: sem ProjectMember (inativo — correto)');
  else    fail('  teste.local TEM ProjectMember — nao deveria!');
}

const testeSolic = await prisma.user.findUnique({ where: { login: 'testesolicitacao@email.com' } });
if (testeSolic && project) {
  const m = await prisma.projectMember.findFirst({ where: { userId: testeSolic.id, projectId: project.id } });
  if (!m) ok('  testesolicitacao: sem ProjectMember (aguardando confirmacao — correto)');
  else    fail('  testesolicitacao TEM ProjectMember — nao deveria!');
}
sep();

// ── 6. PROJECT PARTICIPANTS ───────────────────────────────
titulo('6. PROJECT PARTICIPANTS');
const participants = project
  ? await prisma.projectParticipant.findMany({ where: { projectId: project.id }, orderBy: { nome: 'asc' } })
  : [];
ok(`Total de ProjectParticipants: ${participants.length} (esperado: 2)`);
if (participants.length !== 2) fail(`Esperado 2 participantes, encontrado ${participants.length}`);

for (const p of participants) {
  const pctPart = p.percentualParticipacao === null ? 'null' : p.percentualParticipacao;
  const pctCom  = p.percentualComissao     === null ? 'null' : p.percentualComissao;
  ok(`  ${p.nome}: tipo=${p.tipoParticipacao}, userId=${p.userId ?? 'null'}, pctParticipacao=${pctPart}, pctComissao=${pctCom}`);
  if (p.userId !== null) fail(`${p.nome} nao deveria ter userId (deve ser null)`);
  if (!['Diego','Claudinei'].includes(p.nome)) fail(`Participante inesperado: ${p.nome}`);
}
sep();

// ── 7. LOTES VINCULADOS ───────────────────────────────────
titulo('7. LOTES -> VINCULO COM PROJETO');
const totalLotes       = await prisma.lote.count();
const lotesVinculados  = project ? await prisma.lote.count({ where: { projectId: project.id } }) : 0;
const lotesSemProject  = await prisma.lote.count({ where: { projectId: null } });
ok(`Total de lotes: ${totalLotes}`);
if (lotesVinculados === 75) ok(`Lotes vinculados ao Terra Vista: ${lotesVinculados}/75`);
else fail(`Lotes vinculados: ${lotesVinculados} (esperado: 75)`);
if (lotesSemProject === 0) ok('Lotes sem projectId: 0');
else fail(`Lotes sem projectId: ${lotesSemProject} (esperado: 0)`);

const sampleLotes = await prisma.lote.findMany({
  select: { id: true, n: true, q: true, status: true, valor: true, comprador: true },
  take: 3, orderBy: { q: 'asc' },
});
ok('  Amostra (3 lotes):');
sampleLotes.forEach(l =>
  ok(`    ${l.q}-${l.n}: status=${l.status}, valor=${l.valor}, comprador=${l.comprador ?? 'null'}`));
sep();

// ── 8. PROPOSTAS VINCULADAS ───────────────────────────────
titulo('8. PROPOSTAS -> VINCULO COM PROJETO');
const totalPropostas      = await prisma.proposta.count();
const propostasVinculadas = project ? await prisma.proposta.count({ where: { projectId: project.id } }) : 0;
const propostasSemProject = await prisma.proposta.count({ where: { projectId: null } });
ok(`Total de propostas: ${totalPropostas}`);
if (propostasVinculadas === 4) ok(`Propostas vinculadas ao Terra Vista: ${propostasVinculadas}/4`);
else fail(`Propostas vinculadas: ${propostasVinculadas} (esperado: 4)`);
if (propostasSemProject === 0) ok('Propostas sem projectId: 0');
else fail(`Propostas sem projectId: ${propostasSemProject} (esperado: 0)`);
sep();

// ── 9. USER admin -> isSuperAdmin ────────────────────────
titulo('9. USER admin -> isSuperAdmin');
const adminUser = await prisma.user.findUnique({ where: { login: 'admin' } });
if (adminUser?.isSuperAdmin === true) ok('  admin.isSuperAdmin = true');
else fail(`  admin.isSuperAdmin = ${adminUser?.isSuperAdmin} (esperado: true)`);
sep();

// ── 10. INTEGRIDADE GERAL ─────────────────────────────────
titulo('10. INTEGRIDADE GERAL DOS DADOS');
const totalUsers     = await prisma.user.count();
const totalAuditLogs = await prisma.auditLog.count();
if (totalUsers     === 5) ok(`Users:     ${totalUsers} (esperado: 5)`);
else fail(`Users: ${totalUsers} (esperado: 5)`);
if (totalLotes     === 75) ok(`Lotes:     ${totalLotes} (esperado: 75)`);
else fail(`Lotes: ${totalLotes} (esperado: 75)`);
if (totalPropostas === 4) ok(`Propostas: ${totalPropostas} (esperado: 4)`);
else fail(`Propostas: ${totalPropostas} (esperado: 4)`);
if (totalAuditLogs === 4) ok(`AuditLogs: ${totalAuditLogs} (esperado: 4)`);
else fail(`AuditLogs: ${totalAuditLogs} (esperado: 4)`);

// ── RESULTADO FINAL ───────────────────────────────────────
console.log('\n' + '═'.repeat(57));
if (erros === 0) {
  console.log('  ✅ TODAS AS VERIFICACOES PASSARAM — SEED 100% CORRETO');
} else {
  console.log(`  ❌ ${erros} ERRO(S) ENCONTRADO(S) — REVISAR ACIMA`);
}
console.log('═'.repeat(57) + '\n');

await prisma.$disconnect();
