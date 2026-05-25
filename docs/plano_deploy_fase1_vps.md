# Plano de Deploy — Fase 1 na VPS

**Data de criação:** 2026-05-25  
**Branch:** `feat/fase1-fundacao-multioperacao`  
**Status:** ⏳ Aguardando execução — DEPLOY NÃO FEITO AINDA

---

## 1. Resumo da Fase 1

A Fase 1 adiciona a infraestrutura de multioperação ao sistema sem quebrar nenhum fluxo existente. Todo o comportamento anterior (lotes, propostas, reservas, simulação, login) continua funcionando. As mudanças são aditivas e retrocompatíveis.

**Commits que serão publicados (3 commits à frente de `main`):**

| Hash | Mensagem |
|---|---|
| `7ecbc7e` | feat: add multi-operation foundation backend |
| `66fa4e6` | feat: load project config in frontend |
| `f1c9c1e` | docs: record fase1 manual validation |

---

## 2. Arquivos alterados vs. `main`

```
10 arquivos alterados — +2183 inserções / -124 remoções

backend/prisma/schema.prisma                          (schema com 6 novos modelos)
backend/prisma/migrations/
  20260525100354_add_multitenancy_foundation/
    migration.sql                                     (180 linhas — nova migration)
backend/prisma/seed-fase1.js                          (seed idempotente)
backend/prisma/verify-seed-fase1.js                   (auditoria de integridade)
backend/src/server.js                                 (backend project-aware)
docs/status_fase1_ate_commit4.md                      (documentação)
docs/status_fase1_ate_commit5.md                      (documentação + validação manual)
src/App.jsx                                           (carrega /project/current)
src/pages/ConfigPage.jsx                              (badge do projeto)
src/utils/projectConfig.js                            (helper de config — novo arquivo)
```

**Não incluídos no deploy:**
- `backend/dev.db` — banco local (gitignored)
- `backend/prisma/generated/` — gerado no servidor via `prisma generate`
- `backend/test-commit4.js`, `backend/test-validacao-final.mjs` — scripts de dev (não rastreados)

---

## 3. Riscos principais para o deploy

| # | Risco | Severidade | Ação |
|---|---|---|---|
| R1 | **Schema drift na VPS** — banco pode ter sido criado com `db push` sem histórico de migrations | 🔴 Alto | Verificar `_prisma_migrations` antes; usar baseline se necessário |
| R2 | **Seed reexecutado com dados existentes** — seed-fase1.js é idempotente, mas depende de dados reais existentes (75 lotes) | 🟡 Médio | Verificar contagem de lotes antes de rodar seed |
| R3 | **Modo de execução do servidor desconhecido** — sem PM2/systemd/Procfile encontrado | 🟡 Médio | Verificar como o processo está rodando antes do restart |
| R4 | **Frontend em pasta `dist/`** — build gera `dist/` que pode não ser o que o Nginx serve | 🟡 Médio | Verificar configuração do Nginx na VPS |
| R5 | **Variáveis de ambiente** — `.env` da VPS pode não ter `DATABASE_URL` apontando para o banco correto | 🟡 Médio | Verificar `.env` na VPS antes de qualquer migrate |
| R6 | **Prisma Client desatualizado** — `prisma generate` precisa rodar após merge para gerar o client com os novos modelos | 🔴 Alto | Sempre rodar `prisma generate` após `prisma migrate deploy` |

---

## 4. Checklist pré-deploy (executar manualmente na VPS)

### 4.1 Antes de qualquer comando

- [ ] Comunicar equipe: sistema vai entrar em manutenção breve
- [ ] Abrir acesso SSH à VPS
- [ ] Navegar até o diretório do projeto: `cd /path/to/vel-gestao` (verificar o caminho real)
- [ ] Confirmar branch atual: `git branch`
- [ ] Confirmar que está em `main` ou na branch correta

### 4.2 Verificação do banco de produção

```bash
# Localizar o banco SQLite da produção
ls -la backend/*.db 2>/dev/null
cat backend/.env | grep DATABASE_URL

# Verificar tamanho do banco (não deve ser 0)
du -sh backend/dev.db   # ou o nome que aparecer no .env
```

- [ ] Banco encontrado e não vazio
- [ ] Caminho do banco confirmado no `.env`

### 4.3 Verificar estado das migrations na VPS

```bash
cd backend
npx prisma migrate status
```

Resultados possíveis:

| Resultado | Ação |
|---|---|
| `Database schema is up to date!` | Schema já atualizado — verificar se `_init` e `_multitenancy` estão aplicadas |
| `1 migration not yet applied: 20260525100354_add_multitenancy_foundation` | ✅ Ideal — aplicar normalmente |
| `Migration _init not found (drift)` | ⚠️ Banco criado via `db push` — precisa de baseline (ver seção 6) |
| Erro de conexão | Verificar `DATABASE_URL` no `.env` |

---

## 5. Checklist de backup (OBRIGATÓRIO antes do deploy)

```bash
# Na VPS — dentro do diretório do projeto
cd backend

# Identificar o banco (substituir pelo nome real se diferente)
DB_FILE=$(cat .env | grep DATABASE_URL | sed 's/.*file:\.\///' | tr -d '"')
echo "Banco identificado: $DB_FILE"

# Criar backup com timestamp
cp $DB_FILE ${DB_FILE}.backup-pre-fase1-$(date +%Y%m%d-%H%M%S)

# Verificar que o backup foi criado
ls -la *.backup-* 2>/dev/null || ls -la ../*.backup-* 2>/dev/null
```

- [ ] Backup do banco criado com timestamp
- [ ] Tamanho do backup é maior que zero e igual ao original
- [ ] Backup guardado em local seguro (copiar para fora da VPS se possível)

---

## 6. Estratégia de baseline (caso a VPS tenha schema drift)

> ⚠️ **Use esta seção apenas se** `prisma migrate status` mostrar que a migration `_init` não está registrada, mas o banco já tem tabelas.

Este foi exatamente o problema no ambiente local: o banco foi criado com `prisma db push` e não tinha histórico de migrations. A solução:

```bash
cd backend

# Passo 1: registrar a migration _init como baseline (sem reexecutar o SQL)
npx prisma migrate resolve --applied 20260326173049_init

# Passo 2: verificar status novamente
npx prisma migrate status
# Esperado: "1 migration not yet applied: 20260525100354_add_multitenancy_foundation"

# Passo 3: aplicar APENAS a migration da Fase 1
npx prisma migrate deploy
```

**O que NÃO fazer:**
- ❌ `prisma migrate reset` — apaga o banco inteiro
- ❌ `prisma db push` — ignora o histórico de migrations
- ❌ `prisma migrate dev` — requer TTY interativo, não adequado para produção

---

## 7. Comandos de deploy — sequência completa

> 📋 **Sequência sugerida para execução na VPS. Executar cada passo e verificar antes de avançar.**

### Fase A — Atualizar código

```bash
# Navegar ao diretório do projeto na VPS
cd /path/to/vel-gestao   # VERIFICAR O CAMINHO REAL

# Verificar branch atual
git branch

# Opção 1: se a VPS estiver em main (mais comum)
git fetch origin
git merge origin/main   # apenas após o merge de feat → main ser feito localmente

# Opção 2: se preferir checkout direto da feature branch
git fetch origin
git checkout feat/fase1-fundacao-multioperacao
git pull origin feat/fase1-fundacao-multioperacao
```

> ⚠️ **Atenção:** a VPS precisa estar apontando para o código da Fase 1. 
> Definir com Lucas qual estratégia de merge (via PR no GitHub ou merge local antes do pull).

### Fase B — Backend: dependências e banco

```bash
cd backend

# Instalar dependências (apenas se package.json mudou — verificar primeiro)
npm install --omit=dev

# Gerar o Prisma Client (OBRIGATÓRIO após qualquer mudança de schema)
npx prisma generate

# Verificar estado das migrations
npx prisma migrate status

# Se necessário: resolver baseline (ver seção 6)
# npx prisma migrate resolve --applied 20260326173049_init

# Aplicar migration da Fase 1
npx prisma migrate deploy
# Esperado: "1 migration applied successfully"

# Verificar que o banco está correto (contagens)
node -e "
import('./generated/client/index.js').then(({PrismaClient}) => {
  const p = new PrismaClient();
  Promise.all([p.lote.count(), p.user.count(), p.proposta.count()]).then(([l,u,pr]) => {
    console.log('Lotes:', l, '| Usuários:', u, '| Propostas:', pr);
    p.\$disconnect();
  });
});
"
# Esperado: Lotes: 75 | Usuários: 5 | Propostas: 4  (ou o número real de produção)
```

### Fase C — Seed da Fase 1

```bash
# SOMENTE se o banco já tem 75 lotes e os dados originais intactos
# O seed é idempotente — pode ser rodado com --apply com segurança

node prisma/seed-fase1.js        # dry-run primeiro — confirmar o que vai ser feito
node prisma/seed-fase1.js --apply  # aplicar após confirmação visual

# Verificar integridade pós-seed
node prisma/verify-seed-fase1.js
# Esperado: TODAS AS VERIFICACOES PASSARAM — SEED 100% CORRETO
```

> **Nota:** O seed cria Organization, Project, ProjectMembers, ProjectModules, ProjectParticipants e vincula lotes/propostas ao projeto. Se a produção tiver mais de 75 lotes ou outros dados, verificar o comportamento do seed antes de aplicar.

### Fase D — Frontend

```bash
# Voltar ao diretório raiz do projeto
cd ..

# Build de produção
npm run build
# Esperado: "✓ built in Xms" sem erros

# Verificar que /dist foi gerado
ls -la dist/
```

> **Atenção:** verificar como o Nginx (ou servidor web) serve os arquivos do frontend. O build gera em `/dist`. Confirmar que o Nginx aponta para esta pasta.

### Fase E — Reiniciar o servidor backend

> ⚠️ **Esta etapa depende de como o backend está configurado na VPS.** Nenhum arquivo de PM2, systemd ou Procfile foi encontrado no repositório. **Perguntar a Lucas antes de reiniciar.**

```bash
# Se usar PM2 (provável):
pm2 restart vel-gestao   # ou o nome do processo — verificar com: pm2 list
pm2 list
pm2 logs vel-gestao --lines 20

# Se usar systemd:
sudo systemctl restart vel-gestao.service
sudo systemctl status vel-gestao.service

# Se rodar diretamente (não recomendado para produção):
node src/server.js &
```

---

## 8. Validações pós-deploy

Após o restart do servidor, executar:

```bash
# Verificação rápida da API (substituir pelo domínio real)
curl https://api.velgestao.com/lotes | head -c 200
# Esperado: JSON com array de lotes

# Verificar endpoint novo
curl -H "Authorization: Bearer SEU_TOKEN" https://api.velgestao.com/project/current
# Esperado: JSON com project.nome = "Residencial Terra Vista"

# Teste de login
curl -X POST https://api.velgestao.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login":"admin","senha":"terravista2025"}'
# Esperado: {"token":"...","user":{"isSuperAdmin":true,...}}
```

**No navegador:**
- [ ] Acessar `https://velgestao.com` (ou o domínio do frontend)
- [ ] Login como admin funciona
- [ ] Espelho carrega com 75 lotes
- [ ] Aba Config → badge `📍 Residencial Terra Vista` aparece
- [ ] DevTools → Network → `GET /project/current` retorna 200
- [ ] Login como corretor1 funciona

**No servidor:**
```bash
cd backend
node prisma/verify-seed-fase1.js
# Esperado: TODAS AS VERIFICACOES PASSARAM — SEED 100% CORRETO
```

---

## 9. Comandos de rollback

> Em caso de falha crítica, restaurar o backup do banco e reverter o código.

```bash
# Passo 1: Parar o servidor
pm2 stop vel-gestao   # ou o comando equivalente

# Passo 2: Restaurar o banco
cd backend
cp dev.db.backup-pre-fase1-TIMESTAMP dev.db   # usar o nome exato do backup criado

# Passo 3: Reverter o código para a versão anterior (main antes do merge)
git checkout main
git reset --hard origin/main   # CUIDADO: descarta mudanças locais não commitadas

# Passo 4: Reinstalar dependências e regenerar Prisma Client
npm install
npx prisma generate

# Passo 5: Reiniciar o servidor
pm2 restart vel-gestao

# Passo 6: Verificar que voltou ao estado anterior
curl https://api.velgestao.com/lotes | python3 -m json.tool | head -20
```

---

## 10. Pontos de atenção — SQLite e Prisma migrations

### Por que a migration pode dar problema em produção

O banco de produção provavelmente foi criado com `prisma db push` em algum momento anterior, sem histórico de migrations. Isso causa "schema drift": o banco tem as tabelas, mas a tabela `_prisma_migrations` está vazia ou incompleta.

**Sintoma:** `prisma migrate status` mostra a migration `_init` como "not applied" mesmo que as tabelas já existam.

**Solução segura (testada em dev):**
1. `prisma migrate resolve --applied 20260326173049_init` → registra o _init como baseline, sem executar SQL
2. `prisma migrate deploy` → executa apenas o diff real (a migration da Fase 1)

**O que este diff faz (migration `add_multitenancy_foundation`):**
- Cria 6 novas tabelas (Organization, OrganizationMember, Project, ProjectMember, ProjectParticipant, ProjectModule)
- Recria User, Lote, Proposta, AuditLog com novos campos nullable usando o padrão SQLite RedefineTables
- Copia integralmente os dados existentes durante a recriação
- **Não apaga nenhum dado existente**

### Verificação da tabela de migrations na VPS

```bash
# Via SQLite CLI (se disponível)
sqlite3 backend/dev.db "SELECT migration_name, finished_at FROM _prisma_migrations ORDER BY started_at;"

# Via Node.js (sem sqlite3)
node --input-type=module << 'EOF'
import { PrismaClient } from './generated/client/index.js';
const p = new PrismaClient();
const migrations = await p.$queryRaw`SELECT migration_name, finished_at FROM _prisma_migrations ORDER BY started_at`;
console.table(migrations);
await p.$disconnect();
EOF
```

---

## 11. Dúvidas pendentes antes do deploy

As seguintes informações **precisam ser confirmadas com Lucas** antes de executar o deploy:

| # | Dúvida | Por que importa |
|---|---|---|
| D1 | **Como o backend roda na VPS?** PM2, systemd, ou diretamente? | Necessário para reiniciar corretamente |
| D2 | **Qual o caminho do projeto na VPS?** `/var/www/vel-gestao`? `/home/user/vel-gestao`? | Necessário para navegar e executar comandos |
| D3 | **O Nginx está configurado?** Qual pasta serve o frontend? `/dist` ou outra? | Necessário para saber se `npm run build` já é suficiente |
| D4 | **Já existe algum banco SQLite em produção?** Tem dados reais de usuários/lotes? | Determina se o seed pode ser aplicado com segurança |
| D5 | **A migration `_init` está registrada no banco de produção?** | Determina se precisa de baseline antes do migrate deploy |
| D6 | **Adriane usa a plataforma em produção hoje?** | Se sim, o corretor precisa funcionar desde o primeiro acesso pós-deploy |
| D7 | **Qual o domínio do frontend?** `velgestao.com`? `gestao.velgestao.com`? | Para validar no navegador pós-deploy |

---

## 12. Estratégia de merge recomendada

A branch `feat/fase1-fundacao-multioperacao` tem 3 commits à frente de `main`:

```
f1c9c1e docs: record fase1 manual validation
66fa4e6 feat: load project config in frontend
7ecbc7e feat: add multi-operation foundation backend
```

**Antes do deploy na VPS:**

```bash
# Localmente, após aprovação:
git checkout main
git merge feat/fase1-fundacao-multioperacao --no-ff
# Mensagem do merge commit: "chore: merge fase1 multioperacao foundation"

git push origin main
# → VPS pode fazer git pull para atualizar
```

**Ou via Pull Request no GitHub** (preferido para rastreabilidade):
1. Abrir PR: `feat/fase1-fundacao-multioperacao` → `main`
2. Revisar diff
3. Merge
4. VPS: `git pull origin main`

---

*Documento criado em 2026-05-25. Deploy NÃO executado. Aguardando confirmação das dúvidas D1–D7 e janela de manutenção.*
