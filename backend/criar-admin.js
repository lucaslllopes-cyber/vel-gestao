require('dotenv').config();

const { PrismaClient } = require('./prisma/generated/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const senhaHash = await bcrypt.hash('terravista2025', 10);

  const existente = await prisma.user.findUnique({
    where: { login: 'admin' }
  });

  if (existente) {
    await prisma.user.update({
      where: { login: 'admin' },
      data: {
        name: 'Administrador',
        senhaHash,
        role: 'ADMIN'
      }
    });
    console.log('admin atualizado');
  } else {
    await prisma.user.create({
      data: {
        name: 'Administrador',
        login: 'admin',
        senhaHash,
        role: 'ADMIN'
      }
    });
    console.log('admin criado');
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
