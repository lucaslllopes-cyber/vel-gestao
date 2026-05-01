import { PrismaClient } from '../prisma/generated/client/index.js';

const prisma = new PrismaClient();

async function deepCleanup() {
  console.log('--- Iniciando Limpeza Profunda de Dados de Teste ---');

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  // 1. Remover TODAS as propostas criadas hoje
  const propostasHoje = await prisma.proposta.findMany({
    where: { criadaEm: { gte: hoje } }
  });

  console.log(`Encontradas ${propostasHoje.length} propostas de teste.`);
  
  for (const p of propostasHoje) {
    console.log(`Deletando proposta ${p.id} (Lote: ${p.loteId})`);
    await prisma.proposta.delete({ where: { id: p.id } });
  }

  // 2. Resetar lotes que foram alterados durante o teste
  // Durante o teste, usei A-1 e possivelmente outros ao clicar/reservar.
  // Vou resetar apenas os que estão com status que mudei ou que tinham propostas hoje.
  const lotesParaReset = [...new Set(propostasHoje.map(p => p.loteId))];
  
  // Adicionar A-1 explicitamente por precaução
  if (!lotesParaReset.includes('A-1')) lotesParaReset.push('A-1');

  for (const id of lotesParaReset) {
    console.log(`Resetando lote ${id} para Disponível...`);
    await prisma.lote.update({
      where: { id },
      data: {
        status: 'Disponível',
        comprador: null,
        reservaVenceEm: null,
        reservaOwnerId: null
      }
    });
  }

  // 3. Limpar AuditLogs de hoje para não poluir o histórico com lixo de teste
  const logsHoje = await prisma.auditLog.deleteMany({
    where: { criadoEm: { gte: hoje } }
  });
  console.log(`Removidos ${logsHoje.count} logs de auditoria de teste.`);

  console.log('\n--- Limpeza concluída. Banco local sanitizado. ---');

  await prisma.$disconnect();
}

deepCleanup().catch(console.error);
