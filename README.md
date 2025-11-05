# Dashboard de Vendas LCP

Dashboard de análise de indicadores comerciais para gestão de vendas, propostas e metas por empreendimento.

## Tecnologias

- **React 18** com TypeScript
- **Vite** - Build tool
- **TailwindCSS** + **Shadcn UI** - Estilização
- **Zustand** - Estado global
- **TanStack Query** - Server state
- **React Hook Form** + **Zod** - Formulários
- **Recharts** - Gráficos
- **Axios** - HTTP client
- **date-fns** - Manipulação de datas

## Pré-requisitos

- Node.js 18+ (LTS)
- pnpm (recomendado) ou npm

## Instalação

```bash
# Instalar dependências
pnpm install

# ou com npm
npm install
```

## Configuração

1. Copie o arquivo `.env.example` para `.env.development`:

```bash
cp .env.example .env.development
```

2. Configure as variáveis de ambiente:

```env
VITE_API_BASE_URL=http://localhost:3001
VITE_APP_NAME=Dashboard LCP
```

## Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev

# Build de produção
pnpm build

# Preview do build
pnpm preview

# Lint
pnpm lint
pnpm lint:fix

# Format
pnpm format
pnpm format:check

# Type checking
pnpm type-check

# Testes
pnpm test
pnpm test:ui
pnpm test:coverage

# E2E
pnpm e2e
pnpm e2e:ui
```

## Estrutura do Projeto

```
src/
├── app/              # Configuração da aplicação
├── features/         # Módulos da aplicação (feature-based)
│   ├── auth/
│   ├── dashboard/
│   ├── propostas/
│   ├── vendas/
│   └── ...
├── shared/           # Código compartilhado
│   ├── components/   # Componentes reutilizáveis
│   ├── hooks/        # Custom hooks
│   ├── services/     # Serviços (API)
│   ├── stores/       # Stores Zustand
│   ├── types/        # TypeScript types
│   └── utils/        # Utilitários
├── assets/           # Assets estáticos
└── styles/           # Estilos globais
```

## Documentação Completa

Para padrões de desenvolvimento, convenções de código e arquitetura completa, consulte o arquivo [`claude.md`](./claude.md) na raiz do projeto.

## Funcionalidades Principais

### Dashboard
- Indicadores de performance (propostas, vendas, conversão, ticket médio)
- Gráficos interativos (metas, evolução, conversão por empreendimento)
- Filtros por período e empreendimento
- Exportação de dados (CSV/XLSX)

### Autenticação
- Login com JWT
- Controle de acesso por perfil (Admin/Usuário)
- Gerenciamento de sessão

### Módulos
- Propostas
- Vendas
- Relatórios
- Configurações

## Comandos Úteis

```bash
# Instalar Husky (pré-commit hooks)
pnpm prepare

# Verificar configuração do projeto
pnpm type-check && pnpm lint && pnpm format:check
```

## Padrões de Código

- **Nomenclatura**: PascalCase para componentes, camelCase para funções
- **TypeScript**: Strict mode habilitado
- **Commits**: Conventional Commits (feat, fix, docs, etc)
- **Imports**: Ordem: external → internal (@/) → relative → types
- **Componentes**: Estrutura padronizada com memo quando necessário

## Licença

Privado - LCP Dashboard
