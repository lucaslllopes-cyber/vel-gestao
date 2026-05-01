import { PrismaClient } from '../prisma/generated/client/index.js';
import 'dotenv/config';

const prisma = new PrismaClient();

// Final verification — check what the API sees
const grupos = await prisma.lote.groupBy({ 
  by: ['status'], 
  _count: { status: true }, 
  orderBy: { _count: { status: 'desc' } }
});

console.log('=== STATUS FINAIS NO BANCO (fonte de verdade da API) ===');
let total = 0;
grupos.forEach(g => {
  console.log(`  ${g.status}: ${g._count.status} lotes`);
  total += g._count.status;
});
console.log(`  TOTAL: ${total} lotes`);

const legados = ['Negociação', 'Reserva Técnica', 'Em Negociação', 'Reservado Técnico'];
const restantes = await prisma.lote.count({ where: { status: { in: legados } } });
console.log(`\n  Status legados restantes: ${restantes} ← deve ser 0`);

await prisma.$disconnect();
