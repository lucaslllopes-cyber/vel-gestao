# Status da Fase 1 — Fundação Multioperação (até Commit 4)

**Data de referência:** 2026-05-25  
**Branch:** `feat/fase1-fundacao-multioperacao`  
**Base:** `main` (sistema original funcional)

---

## 1. O que foi implementado

### Fundação multioperação mínima

A Fase 1 estabelece a infraestrutura de dados e backend necessária para que o sistema suporte múltiplos empreendimentos (projetos) no futuro, sem quebrar o fluxo atual do Terra Vista.

**Princípio central:** retrocompatibilidade total. Todo o fluxo anterior de admin/corretor continua funcionando exatamente como antes.

### Commits realizados

| Commit | Escopo | Status |
|---|---|---|
| **Commit 1** | `schema.prisma` — 6 novos modelos + campos nullable | ✅ Aplicado |
| **Commit 2** | Migration SQLite local (`add_multitenancy_foundation`) | ✅ Aplicado |
| **Commit 3A** | Script `seed-fase1.js` com modo dry-run | ✅ Criado e validado |
| **Commit 3B** | Seed aplicado no banco local | ✅ Aplicado |
| **Commit 4** | Backend project-aware com compatibilidade retroativa | ✅ Aplicado |

---

## 2. Migrations aplicadas

### `20260525100354_add_multitenancy_foundation`

Aplicada sobre o banco `backend/dev.db` via `prisma migrate deploy`.

**Técnica especial:** o banco foi criado originalmente via `prisma db push` sem histórico de migrations. A migration `_init` foi resolvida como baseline via `prisma migrate resolve --applied`. Em seguida, o diff real foi gerado com `prisma migrate diff --from-schema-datasource --to-schema-datamodel` para garantir que apenas o que realmente faltava fosse incluído.

**SQL aplicado:**
- 6 novas tabelas criadas (Organization, OrganizationMember, Project, ProjectMember, ProjectParticipant, ProjectModule)
- User: adicionado `isSuperAdmin BOOLEAN NOT NULL DEFAULT false`
- Lote: adicionado `projectId TEXT` (nullable) com FK para Project
- Proposta: adicionado `projectId TEXT` (nullable) com FK para Project
- AuditLog: adicionado `projectId TEXT` (nullable) com FK para Project
- Padrão SQLite RedefineTables: recriação das tabelas existentes com cópia integral dos dados
- Todos os índices únicos preservados e recriados

---

## 3. Seed aplicado (Commit 3B)

Executado via `node prisma/seed-fase1.js --apply` em 2026-05-25.

### Dados criados

**Organization:**
- Nome: `Operação Terra Vista`
- Slug: `operacao-terra-vista`
- Status: ATIVO
- Descrição: organização neutra — representa o conjunto de participantes do empreendimento

**Project:**
- Nome: `Residencial Terra Vista`
- Slug: `residencial-terra-vista`
- Tipo: `LOTEAMENTO`
- Cidade: `Caldas` / Estado: `MG`
- Status: ATIVO
- Config JSON: `{"entrada_min_pct":10,"taxa_am":0.8,"tabelas":["SACOC","PRICE"],"anuais_qtd":5,"anuais_val":2000,"reserva_horas":48}`

**ProjectModules criados (11):**

| Módulo | Status |
|---|---|
| commercial | 🟢 ATIVO |
| reservations | 🟢 ATIVO |
| proposals | 🟢 ATIVO |
| reports | ⚪ INATIVO (Fase 2+) |
| contracts | ⚪ INATIVO (Fase 2+) |
| documents | ⚪ INATIVO (Fase 2+) |
| installments | ⚪ INATIVO (Fase 2+) |
| commissions | ⚪ INATIVO (Fase 2+) |
| financial_admin | ⚪ INATIVO (Fase 2+) |
| billing | ⚪ INATIVO (Fase 2+) |
| partner_reports | ⚪ INATIVO (Fase 3+) |

**ProjectMembers criados (3):**

| Usuário | login | Perfil | isSuperAdmin |
|---|---|---|---|
| admin (Lucas) | `admin` | `project_admin` | `true` |
| Adriane | `adrimagarner@gmail.com` | `commercial_manager` | `false` |
| Corretor VEL | `corretor1` | `corretor` | `false` |

**ProjectParticipants criados (2):**

| Nome | Tipo | userId | Acesso operacional |
|---|---|---|---|
| Diego | SOCIO | null | Nenhum |
| Claudinei | SOCIO | null | Nenhum |

**Vínculos realizados:**
- 75/75 lotes → `projectId = Terra Vista`
- 4/4 propostas → `projectId = Terra Vista`

**Usuários sem ProjectMember (por decisão):**
- `teste.local@email.com` → INATIVO, ignorado
- `testesolicitacao@email.com` → nome de teste, aguardando confirmação de Lucas

---

## 4. Novos modelos no schema.prisma

```
Organization       → empresa/grupo proprietário de projetos
OrganizationMember → papel do usuário na organização
Project            → empreendimento (Terra Vista)
ProjectMember      → acesso operacional do usuário ao projeto
ProjectParticipant → sócios/parceiros sem acesso operacional (Diego, Claudinei)
ProjectModule      → módulos ativos/inativos por projeto
```

**Campos adicionados em modelos existentes (todos nullable ou com default):**
- `User.isSuperAdmin Boolean @default(false)`
- `Lote.projectId String?`
- `Proposta.projectId String?`
- `AuditLog.projectId String?`

---

## 5. Arquivos alterados neste commit

| Arquivo | Tipo | Descrição |
|---|---|---|
| `backend/prisma/schema.prisma` | Modificado | 6 novos modelos + campos nullable nos modelos existentes |
| `backend/prisma/migrations/20260525100354_add_multitenancy_foundation/migration.sql` | Novo | SQL da migration da Fase 1 |
| `backend/prisma/seed-fase1.js` | Novo | Script de seed idempotente com modo dry-run/apply |
| `backend/prisma/verify-seed-fase1.js` | Novo | Script de auditoria de integridade do banco (ver seção 7) |
| `backend/src/server.js` | Modificado | Middlewares project-aware + rotas atualizadas |
| `docs/status_fase1_ate_commit4.md` | Novo | Este documento |

**NÃO incluídos no commit:**
- `backend/dev.db` — banco SQLite local (gitignored)
- `backend/dev.db.backup-pre-fase1` — backup local (não versionado)
- `backend/prisma/generated/` — cliente Prisma gerado (gitignored)
- `backend/test-commit4.js` — script de teste de desenvolvimento (não necessário no histórico)
- `docs/*.md` outros documentos de fase/arquitetura (rastreados separadamente)

---

## 6. Mudanças no backend/src/server.js

### Adicionado

| Elemento | Descrição |
|---|---|
| `isAdmin(req)` | Helper que substitui `req.user.role !== "admin"` com suporte a `isSuperAdmin`. Compatível com tokens antigos (sem o campo) e novos. |
| `resolveProject` | Middleware não-bloqueante. Resolve o projeto ativo pela ordem: query param → body → único ProjectMember ativo → fallback Terra Vista. Injeta `req.project`. |
| `checkPermission(...)` | Factory de middleware para permissões por ProjectMember. Definido para uso em rotas futuras. **Não aplicado às rotas existentes neste commit.** |
| `isSuperAdmin` no JWT | Campo incluído no login e na resposta de `/auth/me`. |
| Filtro por `projectId` | `GET /lotes` e `GET /propostas` filtram pelo projeto resolvido. Fallback retorna todos (comportamento anterior). |
| `projectId` em criações | Novas propostas e todos os AuditLogs novos recebem `projectId` automaticamente. |
| `GET /project/current` | Novo endpoint que retorna o projeto ativo + perfil do usuário + config JSON. |

### Substituições cirúrgicas

Todos os `req.user.role !== "admin"` foram substituídos por `!isAdmin(req)`. Isso é a única mudança comportamental: usuários com `isSuperAdmin: true` passam a ter equivalência total com admin, mesmo que `role` não seja "admin".

---

## 7. Sobre os scripts de verificação

### `backend/prisma/seed-fase1.js` — **MANTER**

Script de seed idempotente. Pode ser executado múltiplas vezes com segurança:
- `node prisma/seed-fase1.js` → dry-run (mostra o que faria)
- `node prisma/seed-fase1.js --apply` → grava no banco

**Uso futuro:** quando um segundo ambiente for configurado (staging, produção), este script cria toda a fundação multioperação a partir de um banco migrado mas vazio. Essencial.

### `backend/prisma/verify-seed-fase1.js` — **MANTER como ferramenta de auditoria**

Script que verifica 10 critérios de integridade do banco:
1. Organization presente com slug correto
2. Project presente com todos os campos (cidade, estado, config)
3. 11 módulos criados (3 ativos, 8 inativos)
4. 3 ProjectMembers com perfis corretos
5. Usuários de teste sem ProjectMember
6. 2 ProjectParticipants sem userId
7. 75/75 lotes com projectId
8. 4/4 propostas com projectId
9. admin.isSuperAdmin = true
10. Contagens gerais intactas (5 users, 75 lotes, 4 propostas, 4 auditlogs)

**Justificativa para manter:** é um diagnóstico rápido executável a qualquer momento (`node prisma/verify-seed-fase1.js`). Útil antes de deploys, após migrations, ou para confirmar que o banco está íntegro após qualquer intervenção manual. Custo zero de manutenção — não depende de biblioteca externa além do Prisma.

---

## 8. Testes executados e resultados

Todos os testes passaram com **zero falhas** em duas execuções independentes (após Commit 4 e neste checkpoint).

| # | Teste | Resultado |
|---|---|---|
| 1 | Login admin → `isSuperAdmin: true` no JWT e resposta | ✅ |
| 2 | Login corretor1 → `isSuperAdmin: false` | ✅ |
| 3 | `GET /auth/me` → campo `isSuperAdmin` presente | ✅ |
| 4 | `GET /lotes` sem token → 75 lotes, compradores mascarados | ✅ |
| 5 | `GET /lotes` com admin → 75 lotes (29V / 40D / 6R) | ✅ |
| 6 | `GET /lotes` com corretor1 → 75 lotes | ✅ |
| 7 | 75/75 lotes com `projectId` preenchido | ✅ |
| 8 | Admin vê 4 propostas, todas com `projectId` | ✅ |
| 9 | Corretor vê apenas suas propostas | ✅ |
| 10 | Corretor recebe 403 ao tentar aprovar proposta | ✅ |
| 11 | `GET /project/current` → nome, slug, config, perfil, isSuperAdmin | ✅ |
| 12 | corretor1 via `/project/current` → Terra Vista, perfil=corretor | ✅ |
| 13 | Rotas admin bloqueadas para corretor (403) | ✅ |
| 14 | Rotas protegidas retornam 401 sem token | ✅ |
| 15 | Integridade: 75 lotes, 4 propostas, 5 usuários preservados | ✅ |

---

## 9. Riscos remanescentes

| # | Risco | Impacto | Mitigação |
|---|---|---|---|
| R1 | Tokens emitidos antes da Fase 1 não têm `isSuperAdmin` | Baixo | `isAdmin()` tem fallback para `role === "admin"` — funciona corretamente |
| R2 | `resolveProject` sempre retorna Terra Vista (fallback) — com múltiplos projetos, pode retornar projeto errado | Médio (futuro) | Aceitar explicitamente `?projectId=` quando necessário; resolver por ProjectMember quando houver múltiplos |
| R3 | `checkPermission` definido mas não aplicado — permissões de ProjectMember não exigidas nas rotas | Baixo (intencional) | Endurecer nas próximas fases quando o frontend suportar multi-projeto |
| R4 | `POST /auth/solicitar-acesso` não cria ProjectMember automaticamente | Baixo | Novos usuários requerem vinculação manual por Lucas; comportamento atual mantido |
| R5 | 6 reservas vencidas (A-2, B-9, B-10, B-11, B-12, B-14) ainda ativas no banco | Médio | Lucas deve liberar manualmente; não bloqueia nenhuma funcionalidade da Fase 1 |
| R6 | `Pago_VEL?` na planilha com valores numéricos — significado desconhecido | Baixo | Não importado; aguarda confirmação de Lucas |
| R7 | `testesolicitacao@email.com` sem ProjectMember — pode ter sido usuário real de teste | Baixo | Lucas confirma se deve ter acesso |

---

## 10. Estado atual do banco (dev.db)

```
Organization:        1 (Operação Terra Vista)
Project:             1 (Residencial Terra Vista)
ProjectModule:      11 (3 ativos, 8 inativos)
ProjectMember:       3 (admin, Adriane, corretor1)
ProjectParticipant:  2 (Diego, Claudinei — sem userId)
OrganizationMember:  0 (não vinculado ainda — Fase 2)

User:                5 (inalterado)
Lote:               75 (todos com projectId)
Proposta:            4 (todas com projectId)
AuditLog:            4 (dados históricos com projectId=null)
```

---

## 11. Próximos passos recomendados (Commit 5+)

### Commit 5 — ConfigPage frontend (quando autorizado)
- Migrar `localStorage` → `GET /project/current` para configurações comerciais
- Frontend busca `entrada_min_pct`, `taxa_am`, `tabelas`, `reserva_horas` do banco
- Zero mudança visual — apenas a fonte dos dados muda

### Commit 6 — Vincular solicitar-acesso ao projeto
- Quando novo corretor solicita acesso, criar `ProjectMember` com `status: PENDENTE`
- Quando admin aprova, atualizar `ProjectMember.status → ATIVO`

### Commit 7 — Endurecer checkPermission nas rotas existentes
- Substituir os checks `isAdmin()` por `checkPermission('project_admin')` nas rotas que exigem confirmação por ProjectMember
- Aplicar após o frontend ser project-aware

### Fase 2 — Contratos, parcelas, financeiro
- Fora do escopo da Fase 1
- Infraestrutura de dados já preparada (módulos `contracts`, `installments`, `financial_admin` criados como INATIVO)

---

*Documento gerado em 2026-05-25 como parte do processo de validação da Fase 1.*
