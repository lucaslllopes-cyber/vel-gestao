import { PrismaClient } from './generated/client/index.js';
import bcrypt from 'bcryptjs';
import { LOTS_SEED, USERS } from '../../src/data/constants.js';

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando Seed de Dados Reais do Terra Vista...");

  // 1. Usuários Base
  const adminHash = await bcrypt.hash(USERS.admin.pw, 10);
  const corretorHash = await bcrypt.hash(USERS.corretor1.pw, 10);

  console.log("Criando Usuário Admin...");
  await prisma.user.upsert({
    where: { login: 'admin' },
    update: {},
    create: {
      nome: USERS.admin.nome,
      login: 'admin',
      senhaHash: adminHash,
      role: 'ADMIN'
    }
  });

  console.log("Criando Usuário Corretor...");
  await prisma.user.upsert({
    where: { login: 'corretor1' },
    update: {},
    create: {
      nome: USERS.corretor1.nome,
      login: 'corretor1',
      senhaHash: corretorHash,
      role: 'CORRETOR'
    }
  });

  // 2. Lotes Lift & Shift
  console.log("Deletando Lotes Antigos...");
  await prisma.lote.deleteMany({});
  
  console.log("Empacotando Seed Real...");
  const lotesInsert = LOTS_SEED.map(l => ({
    id: String(l.id),
    n: String(l.n),
    q: String(l.q),
    area: Number(l.area),
    valor: Number(l.valor),
    status: l.status,
    comprador: l.comprador || null,
    reservaVenceEm: null
  }));

  console.log(`Injetando ${lotesInsert.length} Lotes no SQLite...`);
  const insertedLotes = await prisma.lote.createMany({
    data: lotesInsert
  });

  console.log(`✅ Sucesso Absoluto: ${insertedLotes.count} lotes importados para o Servidor Local!`);
}

main()
  .catch(e => {
    console.error("Erro fatal no Seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
