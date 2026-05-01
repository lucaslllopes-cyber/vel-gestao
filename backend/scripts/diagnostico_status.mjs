import { PrismaClient } from '../prisma/generated/client/index.js';
import 'dotenv/config';

const prisma = new PrismaClient();
const STATUS_ALVO = ['Negociação', 'Reserva Técnica', 'Em Negociação', 'Reservado Técnico'];

console.log('=== STEP 1: LOTES QUE SERÃO ALTERADOS ===');
const afetados = await prisma.lote.findMany({
  where: { status: { in: STATUS_ALVO } },
  select: { id: true, n: true, q: true, status: true },
  orderBy: { id: 'asc' }
});
if (afetados.length === 0) {
  console.log('  Nenhum lote encontrado com os status-alvo. Nada a fazer.');
  await prisma.$disconnect(); process.exit(0);
}
afetados.forEach(l => console.log(`  Lote ${l.id} (Q${l.q} N${l.n}): "${l.status}" → "Disponível"`));

console.log(`\n  Total: ${afetados.length} lote(s) serão convertidos.`);

console.log('\n=== STEP 2: EXECUTANDO ATUALIZAÇÃO ===');
const result = await prisma.lote.updateMany({
  where: { status: { in: STATUS_ALVO } },
  data: { status: 'Disponível' }
});
console.log(`  ✅ Registros alterados: ${result.count}`);

console.log('\n=== STEP 3: CONTAGEM FINAL POR STATUS ===');
const grupos = await prisma.lote.groupBy({ by: ['status'], _count: { status: true }, orderBy: { _count: { status: 'desc' } } });
grupos.forEach(g => console.log(`  ${g.status}: ${g._count.status} lotes`));

console.log('\n=== STEP 4: VERIFICAÇÃO DE SEGURANÇA ===');
const restante = await prisma.lote.count({ where: { status: { in: STATUS_ALVO } } });
console.log(`  Lotes ainda com status legado: ${restante} (esperado: 0)`);
const vendidos = await prisma.lote.count({ where: { status: 'Vendido' } });
const reservados = await prisma.lote.count({ where: { status: 'Reservado' } });
console.log(`  Vendidos intactos: ${vendidos}`);
console.log(`  Reservados intactos: ${reservados}`);

await prisma.$disconnect();
