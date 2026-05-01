import { PrismaClient } from '../prisma/generated/client/index.js';

const prisma = new PrismaClient();

async function checkResiduals() {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  console.log('--- Verificação Global de Resíduos de Teste ---');

  const propostasHoje = await prisma.proposta.findMany({
    where: { criadaEm: { gte: hoje } }
  });

  const lotesNaoDisponiveis = await prisma.lote.findMany({
    where: { 
      NOT: { status: 'Disponível' } 
    }
  });

  console.log('Propostas criadas hoje:', propostasHoje.length);
  console.log('Lotes não disponíveis:', lotesNaoDisponiveis.length);

  if (propostasHoje.length > 0) {
    console.log('AVISO: Ainda existem propostas criadas hoje!');
  }

  await prisma.$disconnect();
}

checkResiduals().catch(console.error);
