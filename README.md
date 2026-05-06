# ConsultaSim

> Controle seus gastos no supermercado em tempo real — sem surpresas no caixa.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=flat-square&logo=prisma)
![PWA](https://img.shields.io/badge/PWA-instalável-5c6bc0?style=flat-square)

---

## Sobre o projeto

O ConsultaSim nasceu de uma necessidade simples: evitar o susto no caixa do supermercado. Com ele você vai adicionando os itens da compra em tempo real, acompanha o total atualizado a cada item e consulta o histórico de compras anteriores com gráficos e métricas.

---

## Funcionalidades

- **Sessões de compra** — crie uma compra nomeada (ex: "Compra de Maio") e adicione itens durante as compras
- **Cálculo em tempo real** — subtotal por item e total geral atualizados instantaneamente
- **Edição e exclusão** — edite nome, categoria, quantidade e preço de qualquer item
- **Histórico** — todas as compras finalizadas agrupadas por mês
- **Gráficos e métricas** — evolução mensal, gasto por categoria e itens mais comprados
- **Optimistic updates** — UI atualiza na hora, sincronização com o banco em segundo plano
- **Autenticação** — login com Google, cada usuário vê apenas suas próprias compras
- **PWA** — instalável no celular como app nativo

---

## Stack

### Frontend
| Tecnologia | Uso |
|---|---|
| [Next.js 14](https://nextjs.org) | Framework React com App Router |
| [TypeScript](https://typescriptlang.org) | Tipagem estática |
| [Tailwind CSS](https://tailwindcss.com) | Estilização |
| [Zustand](https://zustand-demo.pmnd.rs) | Gerenciamento de estado |
| [Recharts](https://recharts.org) | Gráficos do histórico |
| [Lucide React](https://lucide.dev) | Ícones |
| [next-pwa](https://github.com/DuCanh2912/next-pwa) | Suporte a PWA |

### Backend
| Tecnologia | Uso |
|---|---|
| Next.js API Routes | Endpoints da API |
| [Prisma 7](https://prisma.io) | ORM |
| [PostgreSQL](https://postgresql.org) | Banco de dados em produção |
| [Neon](https://neon.tech) | Hospedagem do banco |
| [NextAuth.js](https://next-auth.js.org) | Autenticação com Google |

### Deploy
| Serviço | Uso |
|---|---|
| [Vercel](https://vercel.com) | Hospedagem do app |
| [Neon](https://neon.tech) | Banco PostgreSQL serverless |

---

## Rodando localmente

### Pré-requisitos

- Node.js 22+
- Conta no [Neon](https://neon.tech) (banco PostgreSQL gratuito)
- Credenciais OAuth do Google ([console.cloud.google.com](https://console.cloud.google.com))

### Instalação

```bash
# Clone o repositório
git clone https://github.com/GabrielLeandroSilva/consulta-sim.git
cd consultasim

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
```

### Variáveis de ambiente

Crie um arquivo `.env` na raiz com as seguintes variáveis:

```env
# Banco de dados (Neon PostgreSQL)
DATABASE_URL="postgresql://usuario:senha@ep-xxxx.neon.tech/neondb?sslmode=require"

# NextAuth
AUTH_SECRET="sua-chave-secreta-gerada-com-npx-auth-secret"
AUTH_GOOGLE_ID="seu-google-client-id"
AUTH_GOOGLE_SECRET="seu-google-client-secret"
```

### Banco de dados

```bash
# Aplica as migrations
npx prisma migrate deploy

# Gera o client do Prisma
npx prisma generate
```

### Iniciando o servidor

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

---

## Estrutura do projeto

```
consultasim/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/   # Rotas de autenticação
│   │   ├── sessoes/              # CRUD de sessões de compra
│   │   └── itens/                # CRUD de itens
│   ├── historico/                # Página de histórico
│   ├── login/                    # Página de login
│   ├── layout.tsx
│   └── page.tsx                  # Tela principal
├── components/
│   ├── BottomNav.tsx
│   ├── GraficosHistorico.tsx
│   ├── Header.tsx
│   ├── ItemCard.tsx
│   ├── ItemForm.tsx
│   ├── ItemList.tsx
│   ├── MetricasCards.tsx
│   ├── ModalConfirmacao.tsx
│   ├── SessionProvider.tsx
│   ├── SessaoCard.tsx
│   └── TotalBar.tsx
├── lib/
│   ├── api.ts                    # Camada de serviço da API
│   ├── cache.ts                  # Gerenciador de cache local
│   ├── historico.ts              # Utilitários e métricas
│   ├── prisma.ts                 # Client do Prisma
│   └── session.ts                # Utilitário de sessão autenticada
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── store/
│   └── useCompraStore.ts         # Store Zustand
├── types/
│   └── index.ts                  # Tipagens TypeScript
├── auth.ts                       # Configuração do NextAuth
└── middleware.ts                 # Proteção de rotas
```

---

## API Routes

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/sessoes` | Lista todas as sessões do usuário |
| `POST` | `/api/sessoes` | Cria uma nova sessão |
| `GET` | `/api/sessoes/:id` | Busca uma sessão pelo ID |
| `PATCH` | `/api/sessoes/:id` | Atualiza uma sessão |
| `DELETE` | `/api/sessoes/:id` | Exclui uma sessão |
| `POST` | `/api/sessoes/:id/itens` | Adiciona um item à sessão |
| `PATCH` | `/api/itens/:id` | Edita um item |
| `DELETE` | `/api/itens/:id` | Remove um item |

---

## Modelo de dados

```prisma
model Usuario {
  id        String   @id @default(cuid())
  email     String   @unique
  nome      String?
  imagem    String?
  criadoEm DateTime  @default(now())
  sessoes   Sessao[]
}

model Sessao {
  id           String    @id @default(cuid())
  nome         String
  total        Float     @default(0)
  finalizada   Boolean   @default(false)
  criadaEm     DateTime  @default(now())
  finalizadaEm DateTime?
  usuarioId    String
  usuario      Usuario   @relation(...)
  itens        Item[]
}

model Item {
  id            String   @id @default(cuid())
  nome          String
  quantidade    Int
  precoUnitario Float
  subtotal      Float
  categoria     String
  criadoEm      DateTime @default(now())
  sessaoId      String
  sessao        Sessao   @relation(...)
}
```

---

## Licença

MIT © [Gabriel Leandro da Silva](https://github.com/GabrielLeandroSilva)