# Dashboard de Vendas LCP - Padrões de Desenvolvimento

## 1. Visão Geral do Projeto

Dashboard de vendas para análise de indicadores comerciais, permitindo visualização de propostas, vendas, metas e conversões por empreendimento e período.

## 2. Stack Tecnológica

### 2.1. Core
- **Framework:** React 18+ com TypeScript
- **Build Tool:** Vite
- **Package Manager:** pnpm (mais rápido e eficiente)
- **Node Version:** 18+ (LTS)

### 2.2. Roteamento e Estado
- **Routing:** React Router v6
- **State Management:**
  - Zustand (estado global leve e performático)
  - TanStack Query (React Query v5) para cache e sincronização de dados do servidor
  - Context API apenas para temas e autenticação

### 2.3. UI e Estilização
- **Framework CSS:** TailwindCSS v3
- **Componentes:** Shadcn UI (componentes headless customizáveis)
- **Ícones:** Lucide React
- **Gráficos:** Recharts (melhor integração com React)

### 2.4. Formulários e Validação
- **Formulários:** React Hook Form v7
- **Validação:** Zod (schema validation type-safe)

### 2.5. Data Handling
- **Datas:** date-fns (mais leve que moment.js)
- **Formatação:** Intl API nativa do JavaScript
- **Exportação:** xlsx e papaparse

### 2.6. HTTP Client
- **Client:** Axios com interceptors
- **API Base URL:** variável de ambiente

### 2.7. Qualidade de Código
- **Linter:** ESLint com configuração Airbnb + TypeScript
- **Formatter:** Prettier
- **Pre-commit:** Husky + lint-staged
- **Type Checking:** TypeScript strict mode
- **Testing:** Vitest + React Testing Library + Playwright (E2E)

## 2.8. Responsividade

**PREMISSA FUNDAMENTAL: TODO O PROJETO DEVE SER RESPONSIVO**

- **Mobile First:** Desenvolvimento iniciando pelo mobile e expandindo para desktop
- **Breakpoints do Tailwind:**
  - `sm`: 640px (smartphones landscape e tablets pequenos)
  - `md`: 768px (tablets)
  - `lg`: 1024px (desktops)
  - `xl`: 1280px (desktops grandes)
  - `2xl`: 1536px (telas muito grandes)

### Implementação de Responsividade

#### Menu Lateral (Sidebar)
- **Mobile (< 768px):** Menu tipo drawer que desliza da esquerda
  - Botão hamburguer no header para abrir
  - Overlay escuro quando aberto
  - Botão X para fechar
  - Fecha automaticamente ao clicar em um item
  - Animação suave de slide (transition-transform)
- **Desktop (>= 768px):** Menu fixo sempre visível à esquerda

#### Layout Principal
- **Mobile:** Sem padding lateral para sidebar (conteúdo ocupa 100% da largura)
- **Desktop:** Padding lateral de 256px (w-64) para acomodar sidebar fixa

#### Componentes
- Todos os componentes devem adaptar:
  - Tamanhos de fonte (text-sm sm:text-base)
  - Espaçamentos (gap-2 sm:gap-4)
  - Direção de flex (flex-col sm:flex-row)
  - Grid columns (grid-cols-1 md:grid-cols-2 lg:grid-cols-4)
  - Botões (w-full sm:w-auto)

## 3. Arquitetura e Estrutura de Pastas

### 3.1. Arquitetura
- **Pattern:** Feature-Based Architecture com Domain-Driven Design (DDD)
- **Princípios:** SOLID, Clean Code, DRY, KISS
- **Code Splitting:** Lazy loading por rotas e componentes pesados

### 3.2. Estrutura de Diretórios

```
lcp-front/
├── public/                    # Arquivos estáticos
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── app/                   # Configuração da aplicação
│   │   ├── App.tsx
│   │   ├── router.tsx
│   │   └── providers.tsx      # Providers globais
│   ├── features/              # Módulos da aplicação (feature-based)
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── stores/
│   │   │   ├── types/
│   │   │   ├── utils/
│   │   │   └── index.ts
│   │   ├── dashboard/
│   │   │   ├── components/
│   │   │   │   ├── charts/
│   │   │   │   ├── cards/
│   │   │   │   ├── filters/
│   │   │   │   └── tables/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── stores/
│   │   │   ├── types/
│   │   │   └── index.ts
│   │   ├── propostas/
│   │   ├── vendas/
│   │   ├── relatorios/
│   │   └── configuracoes/
│   ├── shared/                # Código compartilhado
│   │   ├── components/        # Componentes reutilizáveis
│   │   │   ├── ui/           # Componentes do Shadcn
│   │   │   ├── layout/       # Layout components
│   │   │   └── common/       # Componentes comuns (Loading, etc)
│   │   ├── contexts/         # Contexts React (SidebarContext, etc)
│   │   ├── hooks/            # Custom hooks globais
│   │   ├── services/         # Serviços compartilhados
│   │   │   ├── api/          # Configuração Axios
│   │   │   └── storage/      # LocalStorage/SessionStorage
│   │   ├── stores/           # Stores globais (Zustand)
│   │   ├── types/            # Types TypeScript globais
│   │   ├── utils/            # Funções utilitárias
│   │   ├── constants/        # Constantes globais
│   │   └── lib/              # Configurações de bibliotecas
│   ├── assets/               # Assets (imagens, fontes, etc)
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   ├── styles/               # Estilos globais
│   │   ├── globals.css
│   │   └── tailwind.css
│   ├── main.tsx              # Entry point
│   └── vite-env.d.ts
├── tests/
│   ├── e2e/                  # Testes E2E (Playwright)
│   ├── integration/          # Testes de integração
│   └── unit/                 # Testes unitários
├── .env.example              # Exemplo de variáveis de ambiente
├── .env.development          # Variáveis de desenvolvimento
├── .env.production           # Variáveis de produção
├── .eslintrc.cjs             # Configuração ESLint
├── .prettierrc               # Configuração Prettier
├── tsconfig.json             # Configuração TypeScript
├── vite.config.ts            # Configuração Vite
├── tailwind.config.js        # Configuração Tailwind
└── package.json
```

## 4. Convenções de Código

### 4.1. Nomenclatura

#### Arquivos e Pastas
```typescript
// Componentes: PascalCase
LoginForm.tsx
DashboardCard.tsx

// Hooks: camelCase com prefixo 'use'
useAuth.ts
useDashboardData.ts

// Utilitários: camelCase
formatCurrency.ts
validateEmail.ts

// Types/Interfaces: PascalCase
User.types.ts
Dashboard.types.ts

// Constantes: UPPER_SNAKE_CASE em arquivo camelCase
apiEndpoints.ts (export const API_ENDPOINTS = {...})

// Services: camelCase
authService.ts
dashboardService.ts

// Stores: camelCase com sufixo 'Store'
authStore.ts
dashboardStore.ts
```

#### Variáveis e Funções
```typescript
// Variáveis: camelCase
const userName = 'Fernando';
const totalSales = 1000;

// Constantes: UPPER_SNAKE_CASE
const MAX_RETRY_ATTEMPTS = 3;
const API_BASE_URL = process.env.VITE_API_URL;

// Funções: camelCase, verbos no início
function fetchUserData() {}
function calculateConversion() {}
function handleSubmit() {}

// Componentes: PascalCase
function LoginForm() {}
function DashboardCard() {}

// Interfaces/Types: PascalCase com prefixo 'I' para interfaces (opcional)
interface User {}
type DashboardData = {};

// Enums: PascalCase
enum UserRole {
  Admin = 'ADMIN',
  User = 'USER',
}

// Boolean: prefixo is/has/should
const isLoading = false;
const hasPermission = true;
const shouldRender = true;
```

### 4.2. Componentes React

#### Estrutura de Componente
```typescript
// DashboardCard.tsx
import { FC, memo } from 'react';
import { cn } from '@/shared/lib/utils';

// 1. Types/Interfaces
interface DashboardCardProps {
  title: string;
  value: number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

// 2. Componente
export const DashboardCard: FC<DashboardCardProps> = memo(({
  title,
  value,
  subtitle,
  icon,
  trend = 'neutral',
  className,
}) => {
  // 2.1. Hooks (ordem: state, context, custom hooks, effects)
  // 2.2. Handlers
  // 2.3. Computed values
  // 2.4. Effects
  // 2.5. Early returns

  // 2.6. Render
  return (
    <div className={cn('p-4 rounded-lg border', className)}>
      {/* JSX */}
    </div>
  );
});

// 3. Display name para debugging
DashboardCard.displayName = 'DashboardCard';

// 4. Export default (se necessário)
export default DashboardCard;
```

#### Ordem de Hooks
```typescript
function MyComponent() {
  // 1. State hooks
  const [count, setCount] = useState(0);
  const [data, setData] = useState<Data[]>([]);

  // 2. Context hooks
  const { user } = useAuth();
  const theme = useTheme();

  // 3. Refs
  const inputRef = useRef<HTMLInputElement>(null);

  // 4. Custom hooks
  const { data: dashboardData, isLoading } = useDashboardData();
  const { mutate: updateData } = useUpdateData();

  // 5. Memoized values
  const totalValue = useMemo(() =>
    data.reduce((acc, item) => acc + item.value, 0),
    [data]
  );

  // 6. Callbacks
  const handleClick = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);

  // 7. Effects
  useEffect(() => {
    // effect logic
  }, []);

  return <div>...</div>;
}
```

### 4.3. TypeScript

#### Configuração Strict
```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

#### Boas Práticas
```typescript
// ✅ BOM: Types explícitos em props
interface UserCardProps {
  user: User;
  onEdit: (id: string) => void;
}

// ❌ RUIM: any
const data: any = fetchData();

// ✅ BOM: unknown ou type específico
const data: unknown = fetchData();
const user: User = fetchData();

// ✅ BOM: Union types
type Status = 'idle' | 'loading' | 'success' | 'error';

// ✅ BOM: Type guards
function isUser(value: unknown): value is User {
  return typeof value === 'object' && value !== null && 'id' in value;
}

// ✅ BOM: Utility types
type PartialUser = Partial<User>;
type ReadonlyUser = Readonly<User>;
type UserWithoutId = Omit<User, 'id'>;
type UserName = Pick<User, 'name'>;
```

### 4.4. Imports

#### Ordem de Imports
```typescript
// 1. Bibliotecas externas
import { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

// 2. Alias internos (@/)
import { Button } from '@/shared/components/ui/button';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { formatCurrency } from '@/shared/utils/format';

// 3. Imports relativos (evitar quando possível)
import { DashboardCard } from './components/DashboardCard';

// 4. Types
import type { User, DashboardData } from '@/shared/types';

// 5. Estilos (se necessário)
import './styles.css';
```

#### Path Aliases (tsconfig.json)
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/features/*": ["./src/features/*"],
      "@/shared/*": ["./src/shared/*"],
      "@/assets/*": ["./src/assets/*"]
    }
  }
}
```

## 5. Gerenciamento de Estado

### 5.1. Zustand para Estado Global

```typescript
// src/shared/stores/authStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: null,
        isAuthenticated: false,
        login: async (email, password) => {
          const { user, token } = await authService.login(email, password);
          set({ user, token, isAuthenticated: true });
        },
        logout: () => {
          set({ user: null, token: null, isAuthenticated: false });
        },
      }),
      {
        name: 'auth-storage',
      }
    )
  )
);
```

### 5.2. TanStack Query para Server State

```typescript
// src/features/dashboard/hooks/useDashboardData.ts
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';

export function useDashboardData(filters: DashboardFilters) {
  return useQuery({
    queryKey: ['dashboard', filters],
    queryFn: () => dashboardService.getKPIs(filters),
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
    retry: 3,
  });
}

// Mutations
export function useUpdateSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: dashboardService.updateSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
```

## 6. API e Serviços

### 6.1. Configuração Axios

```typescript
// src/shared/services/api/client.ts
import axios from 'axios';
import { useAuthStore } from '@/shared/stores/authStore';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### 6.2. Service Pattern

```typescript
// src/features/dashboard/services/dashboardService.ts
import { apiClient } from '@/shared/services/api/client';
import type { DashboardData, DashboardFilters } from '../types';

class DashboardService {
  private readonly baseURL = '/api/dashboard';

  async getKPIs(filters: DashboardFilters): Promise<DashboardData> {
    return apiClient.get(`${this.baseURL}/indicadores`, { params: filters });
  }

  async getCharts(filters: DashboardFilters) {
    return apiClient.get(`${this.baseURL}/graficos`, { params: filters });
  }

  async getLatestSales(limit = 10) {
    return apiClient.get(`${this.baseURL}/vendas`, { params: { limit } });
  }

  async exportData(filters: DashboardFilters, format: 'csv' | 'xlsx') {
    return apiClient.get(`/api/export`, {
      params: { ...filters, format },
      responseType: 'blob',
    });
  }
}

export const dashboardService = new DashboardService();
```

## 7. Estilização

### 7.1. TailwindCSS

#### Configuração
```javascript
// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#0ea5e9',
          900: '#0c4a6e',
        },
        // ... outras cores
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
```

#### Boas Práticas
```typescript
// ✅ BOM: Usar cn() para condicional
import { cn } from '@/shared/lib/utils';

<div className={cn(
  'px-4 py-2 rounded-lg',
  isActive && 'bg-blue-500 text-white',
  isDisabled && 'opacity-50 cursor-not-allowed'
)} />

// ✅ BOM: Componente com variantes
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const buttonVariants = {
  variant: {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    ghost: 'bg-transparent hover:bg-gray-100',
  },
  size: {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  },
};
```

### 7.2. Tema e Dark Mode

```typescript
// src/shared/stores/themeStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'theme-storage',
    }
  )
);
```

## 8. Roteamento

### 8.1. Estrutura de Rotas

```typescript
// src/app/router.tsx
import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Layouts
import { RootLayout } from '@/shared/components/layout/RootLayout';
import { AuthLayout } from '@/shared/components/layout/AuthLayout';
import { PrivateRoute } from '@/features/auth/components/PrivateRoute';

// Lazy loading
const Dashboard = lazy(() => import('@/features/dashboard'));
const Login = lazy(() => import('@/features/auth/pages/Login'));
const Propostas = lazy(() => import('@/features/propostas'));
const Vendas = lazy(() => import('@/features/vendas'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: 'auth',
        element: <AuthLayout />,
        children: [
          { path: 'login', element: <Login /> },
        ],
      },
      {
        path: '/',
        element: <PrivateRoute />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: 'propostas', element: <Propostas /> },
          { path: 'vendas', element: <Vendas /> },
        ],
      },
    ],
  },
]);
```

## 9. Formulários

### 9.1. React Hook Form + Zod

```typescript
// src/features/auth/schemas/loginSchema.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Component
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    await authService.login(data.email, data.password);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
}
```

## 10. Testes

### 10.1. Estrutura de Testes

```typescript
// Component test
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DashboardCard } from './DashboardCard';

describe('DashboardCard', () => {
  it('should render title and value', () => {
    render(<DashboardCard title="Vendas" value={1000} />);

    expect(screen.getByText('Vendas')).toBeInTheDocument();
    expect(screen.getByText('1000')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<DashboardCard title="Vendas" value={1000} onClick={handleClick} />);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### 10.2. Cobertura de Testes
- Componentes críticos: 80%+
- Utilitários e helpers: 90%+
- Services e hooks: 85%+

## 11. Performance

### 11.1. Otimizações

```typescript
// 1. Lazy loading de rotas
const Dashboard = lazy(() => import('./features/dashboard'));

// 2. Code splitting por feature
const DashboardCharts = lazy(() => import('./components/charts'));

// 3. Memoização
const MemoizedChart = memo(Chart, (prev, next) => {
  return prev.data === next.data;
});

// 4. useMemo para cálculos pesados
const totalSales = useMemo(() =>
  data.reduce((acc, item) => acc + item.value, 0),
  [data]
);

// 5. useCallback para funções em props
const handleFilter = useCallback((filters: Filters) => {
  fetchData(filters);
}, [fetchData]);

// 6. Virtual scrolling para listas grandes
import { useVirtualizer } from '@tanstack/react-virtual';

// 7. Debounce em inputs
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue';

const [search, setSearch] = useState('');
const debouncedSearch = useDebouncedValue(search, 500);
```

## 12. Segurança

### 12.1. Boas Práticas

```typescript
// 1. Sanitização de inputs
import DOMPurify from 'dompurify';

const sanitizedHTML = DOMPurify.sanitize(userInput);

// 2. Validação no frontend E backend
// Frontend: Zod schemas
// Backend: Mesma validação

// 3. CSRF Protection (configurar no backend)
// 4. XSS Prevention
// - Usar dangerouslySetInnerHTML APENAS quando necessário
// - Sanitizar HTML

// 5. Tokens em variáveis de ambiente
const API_KEY = import.meta.env.VITE_API_KEY;

// 6. Expiração de tokens
// Implementar refresh token

// 7. Rate limiting no backend
```

## 13. Variáveis de Ambiente

```bash
# .env.example
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_NAME=Dashboard LCP
VITE_ENABLE_ANALYTICS=false

# .env.development
VITE_API_BASE_URL=http://localhost:3000
VITE_ENABLE_ANALYTICS=false

# .env.production
VITE_API_BASE_URL=https://api.production.com
VITE_ENABLE_ANALYTICS=true
```

## 14. Git e Versionamento

### 14.1. Commit Messages (Conventional Commits)

```bash
# Formato
<type>(<scope>): <subject>

# Types
feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação, ponto e vírgula, etc
refactor: refatoração de código
test: adição/correção de testes
chore: atualização de dependências, configs, etc

# Exemplos
feat(dashboard): add export to xlsx functionality
fix(auth): resolve token expiration issue
docs: update README with setup instructions
refactor(dashboard): simplify chart components
test(dashboard): add tests for DashboardCard
chore: update dependencies
```

### 14.2. Branches

```bash
# Main branches
main (ou master) - produção
develop - desenvolvimento

# Feature branches
feature/dashboard-filters
feature/user-authentication

# Fix branches
fix/login-validation
fix/chart-rendering

# Hotfix branches
hotfix/critical-security-issue
```

### 14.3. Pull Request Template

```markdown
## Descrição
Breve descrição das mudanças

## Tipo de mudança
- [ ] Nova funcionalidade
- [ ] Correção de bug
- [ ] Refatoração
- [ ] Documentação

## Checklist
- [ ] Testes adicionados/atualizados
- [ ] Documentação atualizada
- [ ] Código revisado
- [ ] Build passou
- [ ] Sem warnings de lint
```

## 15. ESLint e Prettier

### 15.1. ESLint Config

```javascript
// .eslintrc.cjs
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react/recommended',
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'prettier',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['react-refresh', 'react', '@typescript-eslint'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'import/prefer-default-export': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
};
```

### 15.2. Prettier Config

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

## 16. Acessibilidade (a11y)

### 16.1. Boas Práticas

```typescript
// 1. Semantic HTML
<nav aria-label="Main navigation">
  <ul role="list">
    <li><a href="/">Home</a></li>
  </ul>
</nav>

// 2. ARIA labels
<button aria-label="Fechar modal" onClick={handleClose}>
  <X />
</button>

// 3. Keyboard navigation
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  Click me
</div>

// 4. Focus management
const dialogRef = useRef<HTMLDialogElement>(null);

useEffect(() => {
  if (isOpen) {
    dialogRef.current?.focus();
  }
}, [isOpen]);

// 5. Alt text em imagens
<img src={logo} alt="Logo LCP Dashboard" />

// 6. Contraste de cores (WCAG AA)
// Ratio mínimo 4.5:1 para texto normal
// Ratio mínimo 3:1 para texto grande
```

## 17. Documentação de Código

### 17.1. JSDoc

```typescript
/**
 * Calcula a taxa de conversão entre propostas e vendas
 * @param proposals - Número total de propostas
 * @param sales - Número total de vendas
 * @returns Taxa de conversão em percentual (0-100)
 * @example
 * ```ts
 * calculateConversionRate(100, 25) // returns 25
 * ```
 */
export function calculateConversionRate(
  proposals: number,
  sales: number
): number {
  if (proposals === 0) return 0;
  return (sales / proposals) * 100;
}

/**
 * Hook para buscar dados do dashboard
 * @param filters - Filtros de período e empreendimento
 * @returns Dados do dashboard e estados de loading/error
 */
export function useDashboardData(filters: DashboardFilters) {
  // ...
}
```

## 18. Error Handling

### 18.1. Error Boundaries

```typescript
// src/shared/components/ErrorBoundary.tsx
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Enviar para serviço de monitoring (Sentry, etc)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-container">
          <h1>Algo deu errado</h1>
          <p>{this.state.error?.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 18.2. Error Handling Patterns

```typescript
// 1. Try-catch em async functions
async function fetchData() {
  try {
    const data = await api.getData();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      toast.error(error.message);
    } else {
      toast.error('Erro inesperado');
    }
    throw error;
  }
}

// 2. Error handling com React Query
const { data, error, isError } = useQuery({
  queryKey: ['dashboard'],
  queryFn: fetchDashboardData,
  retry: 3,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
});

if (isError) {
  return <ErrorMessage error={error} />;
}

// 3. Custom error classes
class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
```

## 19. Logging e Monitoring

```typescript
// src/shared/services/logger.ts
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private isDevelopment = import.meta.env.DEV;

  private log(level: LogLevel, message: string, meta?: unknown) {
    if (!this.isDevelopment && level === 'debug') return;

    const timestamp = new Date().toISOString();
    const logData = { timestamp, level, message, meta };

    console[level](logData);

    // Em produção, enviar para serviço de logging
    if (!this.isDevelopment && level === 'error') {
      // Sentry.captureException(meta);
    }
  }

  debug(message: string, meta?: unknown) {
    this.log('debug', message, meta);
  }

  info(message: string, meta?: unknown) {
    this.log('info', message, meta);
  }

  warn(message: string, meta?: unknown) {
    this.log('warn', message, meta);
  }

  error(message: string, meta?: unknown) {
    this.log('error', message, meta);
  }
}

export const logger = new Logger();
```

## 20. Padrões de Loading

**REGRA DE OURO:** Todo feedback visual melhora a UX. **SEMPRE mostre loading quando houver chamada à API**.

### 20.1. Tipos de Loading

#### 1. Loading de Página Completa
```tsx
import { Loading } from '@/shared/components/common';

if (isLoading) return <Loading />;
```

#### 2. Loading em Botões de Ação
```tsx
import { Loader2 } from 'lucide-react';

const [loadingId, setLoadingId] = useState<number | null>(null);

const handleAction = async (id: number) => {
  setLoadingId(id);
  try {
    await mutation.mutateAsync({ id });
  } finally {
    setLoadingId(null);
  }
};

<Button disabled={loadingId === item.id}>
  {loadingId === item.id ? (
    <Loader2 className="h-4 w-4 animate-spin text-lcp-gray" />
  ) : (
    <ActionIcon />
  )}
</Button>
```

#### 3. Loading em Formulários
```tsx
const isLoading = createMutation.isPending || updateMutation.isPending;

<Input {...register('field')} disabled={isLoading} />
<Button type="submit" disabled={isLoading}>
  {isLoading ? 'Salvando...' : 'Salvar'}
</Button>
```

#### 4. Loading Overlay (Tela Cheia)
```tsx
import { LoadingOverlay } from '@/shared/components/common';

{isProcessing && <LoadingOverlay message="Processando dados..." />}
```

### 20.2. Componentes Disponíveis

- **`<Loading />`** - Spinner centralizado para página completa
- **`<LoadingOverlay />`** - Overlay de tela cheia com backdrop blur
- **`<Loader2 />`** (Lucide) - Ícone inline com `animate-spin`

### 20.3. Boas Práticas

✅ **FAZER:**
- Sempre desabilite botões durante loading (`disabled={isLoading}`)
- Mude texto do botão ("Salvando...", "Carregando...")
- Use `Loader2` com `animate-spin` para spinners
- Trate erros com toast
- Previna múltiplos cliques
- Use `finally` para garantir reset do loading
- Desabilite campos de formulário durante submit

❌ **NÃO FAZER:**
- Ação sem feedback visual
- Formulário sem desabilitar campos
- Botão sem estado de loading
- Query sem verificar `isLoading`

### 20.4. Padrão Visual

**Cores:**
- Loading principal: `text-lcp-blue` (#0B2D5C)
- Loading secundário: `text-lcp-gray` (#6B7280)

**Tamanhos:**
- Botões: `h-4 w-4`
- Médio: `h-6 w-6`
- Página: `h-8 w-8`

**Animação:**
```tsx
className="animate-spin"
```

### 20.5. Checklist

- [ ] Loading no carregamento inicial
- [ ] Loading nos botões de ação
- [ ] Desabilitar campos durante submit
- [ ] Texto do botão muda
- [ ] Ícones substituídos por spinner
- [ ] Prevenir múltiplos cliques
- [ ] Erro tratado com toast

**Documentação completa:** `/docs/LOADING_PATTERNS.md`

## 21. Internacionalização (i18n) - Futuro

```typescript
// src/shared/i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ptBR from './locales/pt-BR.json';
import enUS from './locales/en-US.json';

i18n.use(initReactI18next).init({
  resources: {
    'pt-BR': { translation: ptBR },
    'en-US': { translation: enUS },
  },
  lng: 'pt-BR',
  fallbackLng: 'pt-BR',
  interpolation: {
    escapeValue: false,
  },
});

// Uso
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  return <h1>{t('welcome')}</h1>;
}
```

## 22. Build e Deploy

### 22.1. Build Otimizado

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charts: ['recharts'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 3000,
    open: true,
  },
});
```

### 22.2. Scripts Package.json

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,json,css,md}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,json,css,md}\"",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "e2e": "playwright test",
    "e2e:ui": "playwright test --ui",
    "type-check": "tsc --noEmit",
    "prepare": "husky install"
  }
}
```

## 23. Checklist de Desenvolvimento

### 23.1. Antes de Iniciar uma Feature

- [ ] Criar branch a partir de `develop`
- [ ] Ler requisitos completamente
- [ ] Identificar componentes reutilizáveis
- [ ] Definir types/interfaces
- [ ] Planejar estrutura de pastas

### 23.2. Durante o Desenvolvimento

- [ ] Seguir convenções de nomenclatura
- [ ] Escrever código TypeScript strict
- [ ] Adicionar tipos explícitos
- [ ] Usar hooks customizados quando apropriado
- [ ] Memoizar quando necessário
- [ ] Adicionar error handling
- [ ] Implementar loading states
- [ ] Adicionar acessibilidade
- [ ] Testar responsividade

### 23.3. Antes do Commit

- [ ] Executar `npm run lint:fix`
- [ ] Executar `npm run format`
- [ ] Executar `npm run type-check`
- [ ] Executar `npm run test`
- [ ] Verificar no browser
- [ ] Commit com mensagem conventional

### 23.4. Antes do PR

- [ ] Testes passando
- [ ] Build funcionando
- [ ] Sem warnings de lint
- [ ] Code review próprio
- [ ] Atualizar documentação se necessário
- [ ] Screenshots se for UI

## 24. Resources e Referências

### 24.1. Documentação Oficial
- [React](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vitejs.dev)
- [TailwindCSS](https://tailwindcss.com)
- [Shadcn UI](https://ui.shadcn.com)
- [TanStack Query](https://tanstack.com/query)
- [Zustand](https://zustand-demo.pmnd.rs)
- [React Hook Form](https://react-hook-form.com)
- [Zod](https://zod.dev)

### 24.2. Guias de Estilo
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)

### 24.3. Ferramentas Úteis
- [Can I Use](https://caniuse.com) - Compatibilidade de browsers
- [Bundlephobia](https://bundlephobia.com) - Tamanho de pacotes npm
- [npm trends](https://npmtrends.com) - Comparar pacotes
- [React DevTools](https://react.dev/learn/react-developer-tools)

---

## Notas Finais

Este documento é vivo e deve ser atualizado conforme o projeto evolui. Todas as decisões arquiteturais e mudanças de padrões devem ser documentadas aqui.

**Última atualização:** 2025-11-05
**Versão:** 1.0.0
