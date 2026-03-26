# 🌿 Terra Vista — Sistema de Vendas

**Residencial Terra Vista · Caldas MG**

Sistema de espelho de vendas para corretores e gestão do loteamento.

---

## Stack

- React 18 + Vite
- Estilo inline (sem CSS externo, sem Tailwind)
- Estado local com `localStorage` (sem backend)
- Pronto para migrar para Firebase Firestore

---

## Instalação

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # gera /dist para deploy
```

---

## Credenciais de acesso (demo)

| Usuário | Senha | Perfil |
|---|---|---|
| `admin` | `terravista2025` | Gestão completa |
| `corretor1` | `corretor123` | Corretor — VEL |

> ⚠️ Senhas em texto claro — adequado apenas para demo local.
> Em produção, substituir por Firebase Auth.

---

## Estrutura de pastas

```
src/
├── App.jsx                    # Componente raiz — estado global e roteamento
├── main.jsx                   # Entry point React
│
├── data/
│   └── constants.js           # LOTS_SEED, DEFAULT_CFG, USERS, QUADRAS, SC
│
├── utils/
│   ├── format.js              # brl(), m2(), ts(), R2()
│   ├── financeiro.js          # calcSACOC(), calcPRICE()
│   ├── reserva.js             # isoNow(), isoAdd(), venceuReserva(), limparReserva()
│   └── storage.js             # LS.g(), LS.s(), STORAGE_KEYS
│
├── hooks/
│   └── useReservaTimer.js     # Timer de expiração automática de reservas (60s)
│
├── components/
│   ├── Field.jsx              # Input reutilizável com label e nota
│   ├── Toast.jsx              # Notificação temporária de ação
│   ├── PainelLote.jsx         # Painel de detalhes — compartilhado entre abas
│   ├── PropModal.jsx          # Modal de coleta de dados do cliente
│   └── SimuladorModal.jsx     # Modal do simulador SACOC / PRICE
│
└── pages/
    ├── LoginPage.jsx          # Tela de login
    ├── VistaGeralPage.jsx     # Cards por quadra (visão atual)
    ├── ListaPage.jsx          # Tabela de lotes
    ├── PropostasPage.jsx      # Gestão de propostas
    ├── AlertasPage.jsx        # Notificações (admin only)
    ├── ConfigPage.jsx         # Configurações comerciais (admin only)
    └── EspelhoPage.jsx        # 🚧 Placeholder — mapa SVG (implementação futura)
```

---

## Schema do lote

```js
{
  id:            "F-50",        // string — quadra + número
  q:             "F",           // string — quadra (A–F)
  n:             50,            // number — número do lote
  status:        "Vendido",     // "Disponível" | "Reservado" | "Vendido"
  area:          523.21,        // number — m²
  valor:         112659.75,     // number — R$ preço de tabela
  comprador:     "Paulo Henrique Lucas",  // string | null

  // Metadados de reserva (preenchidos apenas quando Reservado)
  reservado_em:  "2026-03-25T14:00:00.000Z",  // ISO string | null
  reservado_ate: "2026-03-27T14:00:00.000Z",  // ISO string | null
  reservado_por: "corretor1",                  // login | null

  // Futuro Espelho em mapa SVG
  mapa: null,
  // ou quando calibrado:
  // mapa: { cx: 312, cy: 445, pts: "310,440 314,440 314,450 310,450" }
}
```

---

## Lógica financeira

### SACOC
- Ano 1: `parcela = saldo / n_parcelas` (sem juros)
- Ano N: `parcela_ano1 × (1 + taxa_aa)^(N-1)`
- `taxa_aa = (1 + taxa_am)^12 - 1`
- IPCA incide no saldo devedor no aniversário anual (não simulado — mostrado como "+ IPCA")
- **Validação:** F-50 (Paulo Henrique) → 91.393,75 ÷ 175 = R$ 522,25 ✅

### PRICE
- ≤ 24x → sem juros: `parcela = saldo / n`
- ≥ 25x → Price padrão com `taxa_am`%: `parcela = saldo × (r × (1+r)^n) / ((1+r)^n - 1)`
- IPCA anual sobre saldo devedor (não simulado)

---

## Permissões por perfil

| Funcionalidade | Admin | Corretor |
|---|---|---|
| Ver valor e comprador de lotes Vendidos | ✅ | ❌ |
| VGV Vendido no KPI bar | ✅ | ❌ |
| Simular e enviar proposta | ✅ | ✅ |
| Ver próprias propostas | ✅ | ✅ |
| Ver todas as propostas | ✅ | ❌ |
| Aprovar / Recusar propostas | ✅ | ❌ |
| Reservar / Liberar / Renovar lote | ✅ | ❌ |
| Editar lote | ✅ | ❌ |
| Alertas | ✅ | ❌ |
| Aba Espelho (mapa) | ✅ | ❌ |
| Config comercial | ✅ | ❌ |
| Taxa de juros (editável) | ✅ (Config) | ❌ |
| Tabelas disponíveis (SACOC/PRICE) | ✅ (Config) | ver apenas |

---

## Reserva automática

- Configurável via Config → "Prazo de reserva (horas)" (padrão: 48h)
- Ao reservar: grava `reservado_em`, `reservado_ate`, `reservado_por`
- Timer de 60s verifica expiração, libera automaticamente e gera notificação
- Admin pode Renovar (+Xh) ou Liberar manualmente

---

## Futuro Espelho em mapa

O componente `PainelLote` já suporta `modo="flutuante"` para sobreposição sobre o mapa SVG.

Cada lote tem `mapa: null` — quando calibrado, recebe:
```js
mapa: {
  cx:  312,                               // centro x no SVG
  cy:  445,                               // centro y no SVG
  pts: "310,440 314,440 314,450 310,450"  // polígono SVG
}
```

Lotes com `mapa: null` não aparecem no Espelho sem quebrar nada.

---

## Próximos passos sugeridos

1. **Firebase Auth** — substituir USERS hardcoded
2. **Firebase Firestore** — substituir localStorage (trocar `LS.g/s` em `storage.js`)
3. **Espelho SVG** — calibrar polígonos sobre a prancha, implementar `EspelhoPage`
4. **Notificações push** — via Firebase Cloud Messaging quando proposta chegar
5. **Deploy** — Vercel (`npm run build` → arrastar `/dist`)
