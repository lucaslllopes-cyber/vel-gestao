-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'CORRETOR',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Lote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "n" TEXT NOT NULL,
    "q" TEXT NOT NULL,
    "area" REAL NOT NULL,
    "valor" REAL NOT NULL,
    "status" TEXT NOT NULL,
    "reservaVenceEm" DATETIME,
    "comprador" TEXT,
    "reservaOwnerId" TEXT,
    CONSTRAINT "Lote_reservaOwnerId_fkey" FOREIGN KEY ("reservaOwnerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");
