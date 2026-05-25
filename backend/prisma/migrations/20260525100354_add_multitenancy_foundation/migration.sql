-- Fase 1: Fundação Multioperação Mínima
-- Migration: add_multitenancy_foundation
-- Data: 2026-05-25
-- Gerada por: prisma migrate diff --from-schema-datasource --to-schema-datamodel

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "descricao" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ATIVO',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "OrganizationMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OrganizationMember_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrganizationMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'LOTEAMENTO',
    "status" TEXT NOT NULL DEFAULT 'ATIVO',
    "cidade" TEXT,
    "estado" TEXT,
    "config" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Project_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProjectMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "perfil" TEXT NOT NULL,
    "modulosExtras" TEXT,
    "modulosRestritos" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ATIVO',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProjectMember_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProjectMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProjectParticipant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipoParticipacao" TEXT NOT NULL,
    "percentualParticipacao" REAL,
    "percentualComissao" REAL,
    "descricao" TEXT,
    "userId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProjectParticipant_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProjectParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProjectModule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT false,
    "config" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProjectModule_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables (SQLite não suporta ADD COLUMN com FK — recria tabela preservando dados)
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

-- AuditLog: adiciona projectId (nullable)
CREATE TABLE "new_AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "loteId" TEXT NOT NULL,
    "userId" TEXT,
    "evento" TEXT NOT NULL,
    "payloadAnterior" TEXT,
    "payloadNovo" TEXT,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "projectId" TEXT,
    CONSTRAINT "AuditLog_loteId_fkey" FOREIGN KEY ("loteId") REFERENCES "Lote" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "AuditLog_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_AuditLog" ("criadoEm", "evento", "id", "loteId", "payloadAnterior", "payloadNovo", "userId") SELECT "criadoEm", "evento", "id", "loteId", "payloadAnterior", "payloadNovo", "userId" FROM "AuditLog";
DROP TABLE "AuditLog";
ALTER TABLE "new_AuditLog" RENAME TO "AuditLog";

-- Lote: adiciona projectId (nullable)
CREATE TABLE "new_Lote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "n" TEXT NOT NULL,
    "q" TEXT NOT NULL,
    "area" REAL NOT NULL,
    "valor" REAL NOT NULL,
    "valorAvista" REAL,
    "status" TEXT NOT NULL,
    "situacaoLegal" TEXT,
    "reservaVenceEm" DATETIME,
    "comprador" TEXT,
    "compradorAnterior" TEXT,
    "reservaOwnerId" TEXT,
    "projectId" TEXT,
    CONSTRAINT "Lote_reservaOwnerId_fkey" FOREIGN KEY ("reservaOwnerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Lote_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Lote" ("area", "comprador", "compradorAnterior", "id", "n", "q", "reservaOwnerId", "reservaVenceEm", "situacaoLegal", "status", "valor", "valorAvista") SELECT "area", "comprador", "compradorAnterior", "id", "n", "q", "reservaOwnerId", "reservaVenceEm", "situacaoLegal", "status", "valor", "valorAvista" FROM "Lote";
DROP TABLE "Lote";
ALTER TABLE "new_Lote" RENAME TO "Lote";

-- Proposta: adiciona projectId (nullable)
CREATE TABLE "new_Proposta" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "loteId" TEXT NOT NULL,
    "corretorId" TEXT NOT NULL,
    "nomeCliente" TEXT NOT NULL,
    "telefoneCliente" TEXT,
    "emailCliente" TEXT,
    "payloadFinanceiro" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pendente',
    "criadaEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "projectId" TEXT,
    CONSTRAINT "Proposta_loteId_fkey" FOREIGN KEY ("loteId") REFERENCES "Lote" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Proposta_corretorId_fkey" FOREIGN KEY ("corretorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Proposta_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Proposta" ("corretorId", "criadaEm", "emailCliente", "id", "loteId", "nomeCliente", "payloadFinanceiro", "status", "telefoneCliente") SELECT "corretorId", "criadaEm", "emailCliente", "id", "loteId", "nomeCliente", "payloadFinanceiro", "status", "telefoneCliente" FROM "Proposta";
DROP TABLE "Proposta";
ALTER TABLE "new_Proposta" RENAME TO "Proposta";

-- User: adiciona isSuperAdmin (NOT NULL DEFAULT false)
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'CORRETOR',
    "status" TEXT NOT NULL DEFAULT 'ATIVO',
    "telefone" TEXT,
    "imobiliaria" TEXT,
    "isSuperAdmin" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("createdAt", "id", "imobiliaria", "login", "nome", "role", "senhaHash", "status", "telefone") SELECT "createdAt", "id", "imobiliaria", "login", "nome", "role", "senhaHash", "status", "telefone" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationMember_organizationId_userId_key" ON "OrganizationMember"("organizationId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectMember_projectId_userId_key" ON "ProjectMember"("projectId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectModule_projectId_tipo_key" ON "ProjectModule"("projectId", "tipo");
