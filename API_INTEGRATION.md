# Integração com API - Guia de Uso

Este documento explica como usar os services e hooks criados para integração com a API do LCP Dashboard.

## Índice
- [Services](#services)
- [Hooks do TanStack Query](#hooks-do-tanstack-query)
- [Store de Autenticação](#store-de-autenticação)
- [Exemplos de Uso](#exemplos-de-uso)

---

## Services

Os services são classes que encapsulam as chamadas à API. Todos os services utilizam o `apiClient` configurado com Axios.

### 📁 Localização dos Services

```
src/features/
├── auth/services/authService.ts
└── dashboard/services/
    ├── dashboardService.ts
    ├── empreendimentoService.ts
    ├── propostaService.ts
    ├── vendaService.ts
    ├── metaService.ts
    └── syncService.ts
```

### 🔐 Auth Service

```typescript
import { authService } from '@/features/auth';

// Login
const { access_token } = await authService.login({
  email: 'admin@lcp.com',
  password: 'senha123'
});

// Registrar usuário
const user = await authService.register({
  email: 'user@exemplo.com',
  nome: 'Usuário Teste',
  password: 'senha123'
});

// Buscar usuário atual
const currentUser = await authService.getCurrentUser();

// Gerenciar token
authService.setToken(token);
authService.removeToken();
const token = authService.getToken();
```

### 🏢 Empreendimento Service

```typescript
import { empreendimentoService } from '@/features/dashboard';

// Listar todos (com paginação)
const empreendimentos = await empreendimentoService.getAll({ skip: 0, limit: 100 });

// Buscar por ID
const empreendimento = await empreendimentoService.getById(1);

// Estatísticas
const stats = await empreendimentoService.getStats();

// Exportar
const excelBlob = await empreendimentoService.exportExcel();
const csvBlob = await empreendimentoService.exportCSV();
```

### 📊 Dashboard Service

```typescript
import { dashboardService } from '@/features/dashboard';

// KPIs
const kpis = await dashboardService.getKPIs();

// Resumo completo
const resumo = await dashboardService.getResumo();

// Top empreendimentos
const topEmps = await dashboardService.getTopEmpreendimentos(10);

// Vendas por período
const vendasPeriodo = await dashboardService.getVendasPorPeriodo({
  data_inicio: '2025-01-01',
  data_fim: '2025-12-31',
  agrupamento: 'mes'
});
```

---

## Hooks do TanStack Query

Os hooks utilizam TanStack Query (React Query) para cache, sincronização e estados de loading/error.

### 🔐 useAuth

```typescript
import { useLogin, useLogout, useCurrentUser, useRegister } from '@/features/auth';

function LoginPage() {
  const login = useLogin();
  const logout = useLogout();
  const { data: user, isLoading } = useCurrentUser();

  const handleLogin = async () => {
    try {
      await login.mutateAsync({
        email: 'admin@lcp.com',
        password: 'senha123'
      });
      // Redirecionar ou mostrar sucesso
    } catch (error) {
      // Tratar erro
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {isLoading && <p>Carregando...</p>}
      {user && <p>Olá, {user.nome}</p>}
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleLogout}>Logout</button>
    </>
  );
}
```

### 📊 useDashboard

```typescript
import {
  useDashboardKPIs,
  useDashboardResumo,
  useTopEmpreendimentos,
  useVendasPorPeriodo
} from '@/features/dashboard';

function Dashboard() {
  const { data: kpis, isLoading, error } = useDashboardKPIs();
  const { data: topEmps } = useTopEmpreendimentos(5);
  const { data: vendas } = useVendasPorPeriodo({
    data_inicio: '2025-01-01',
    data_fim: '2025-12-31',
    agrupamento: 'mes'
  });

  if (isLoading) return <div>Carregando KPIs...</div>;
  if (error) return <div>Erro: {error.message}</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Vendas do mês: {kpis?.vendas_mes_atual.quantidade}</p>
      <p>Taxa de conversão: {kpis?.taxa_conversao.percentual}%</p>
    </div>
  );
}
```

### 🏢 useEmpreendimentos

```typescript
import {
  useEmpreendimentos,
  useEmpreendimento,
  useEmpreendimentoStats
} from '@/features/dashboard';

function EmpreendimentosList() {
  const { data: empreendimentos, isLoading } = useEmpreendimentos({ limit: 50 });
  const { data: stats } = useEmpreendimentoStats();

  return (
    <div>
      <h2>Total: {stats?.total_empreendimentos}</h2>
      {isLoading ? (
        <p>Carregando...</p>
      ) : (
        <ul>
          {empreendimentos?.map(emp => (
            <li key={emp.id}>{emp.nome}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function EmpreendimentoDetail({ id }: { id: number }) {
  const { data: emp, isLoading } = useEmpreendimento(id);

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div>
      <h1>{emp?.nome}</h1>
      <p>Unidades vendidas: {emp?.unidades_vendidas}</p>
    </div>
  );
}
```

### 💰 useVendas e usePropostas

```typescript
import { useVendas, useVenda } from '@/features/dashboard';
import { usePropostas, useProposta } from '@/features/dashboard';

function VendasList() {
  const { data: vendas, isLoading } = useVendas({
    data_inicio: '2025-01-01',
    data_fim: '2025-12-31',
    status: 'Ativa'
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Cliente</th>
          <th>Empreendimento</th>
          <th>Valor</th>
        </tr>
      </thead>
      <tbody>
        {vendas?.map(venda => (
          <tr key={venda.id}>
            <td>{venda.cliente_nome}</td>
            <td>{venda.empreendimento_nome}</td>
            <td>{venda.valor_venda}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

### 🎯 useMetas (com Mutations)

```typescript
import { useMetas, useCreateMeta, useUpdateMeta, useDeleteMeta } from '@/features/dashboard';

function MetasManager() {
  const { data: metas, isLoading } = useMetas(true); // apenas ativas
  const createMeta = useCreateMeta();
  const updateMeta = useUpdateMeta();
  const deleteMeta = useDeleteMeta();

  const handleCreate = async () => {
    try {
      await createMeta.mutateAsync({
        nome: 'Meta Q1 2025',
        tipo: 'vendas',
        valor_meta: 50000000,
        periodo_inicio: '2025-01-01',
        periodo_fim: '2025-03-31',
        ativo: true
      });
      alert('Meta criada!');
    } catch (error) {
      alert('Erro ao criar meta');
    }
  };

  const handleUpdate = async (id: number) => {
    await updateMeta.mutateAsync({
      id,
      data: { valor_meta: 60000000 }
    });
  };

  const handleDelete = async (id: number) => {
    if (confirm('Deletar meta?')) {
      await deleteMeta.mutateAsync(id);
    }
  };

  return (
    <div>
      <button onClick={handleCreate}>Nova Meta</button>
      {metas?.map(meta => (
        <div key={meta.id}>
          <p>{meta.nome}: {meta.percentual_atingido}%</p>
          <button onClick={() => handleUpdate(meta.id)}>Editar</button>
          <button onClick={() => handleDelete(meta.id)}>Deletar</button>
        </div>
      ))}
    </div>
  );
}
```

---

## Store de Autenticação

O Zustand store mantém o estado global de autenticação e persiste no localStorage.

```typescript
import { useAuthStore } from '@/features/auth';

function MyComponent() {
  const { user, token, isAuthenticated, setUser, setToken, logout } = useAuthStore();

  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Usuário: {user?.nome}</p>
          <button onClick={logout}>Sair</button>
        </>
      ) : (
        <p>Não autenticado</p>
      )}
    </div>
  );
}
```

---

## Exemplos de Uso

### Exemplo 1: Dashboard completo

```typescript
import { useDashboardKPIs, useTopEmpreendimentos } from '@/features/dashboard';
import { formatCurrency, formatPercentage } from '@/shared/utils/format';

function DashboardPage() {
  const { data: kpis, isLoading: loadingKPIs } = useDashboardKPIs();
  const { data: topEmps, isLoading: loadingTop } = useTopEmpreendimentos(5);

  if (loadingKPIs || loadingTop) {
    return <div>Carregando dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="kpis">
        <div className="card">
          <h3>Vendas do Mês</h3>
          <p className="value">{kpis?.vendas_mes_atual.quantidade}</p>
          <p className="subtitle">
            {formatCurrency(kpis?.vendas_mes_atual.valor_total || 0)}
          </p>
        </div>

        <div className="card">
          <h3>Taxa de Conversão</h3>
          <p className="value">
            {formatPercentage(kpis?.taxa_conversao.percentual || 0)}
          </p>
        </div>
      </div>

      <div className="top-empreendimentos">
        <h2>Top Empreendimentos</h2>
        {topEmps?.map(emp => (
          <div key={emp.empreendimento_id}>
            <p>{emp.empreendimento_nome}</p>
            <p>{emp.total_vendas} vendas</p>
            <p>{formatCurrency(emp.valor_total)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Exemplo 2: Filtros de Vendas

```typescript
import { useState } from 'react';
import { useVendas } from '@/features/dashboard';

function VendasFilter() {
  const [filters, setFilters] = useState({
    data_inicio: '2025-01-01',
    data_fim: '2025-12-31',
    status: 'Ativa'
  });

  const { data: vendas, isLoading, refetch } = useVendas(filters);

  const handleFilter = () => {
    refetch();
  };

  return (
    <div>
      <input
        type="date"
        value={filters.data_inicio}
        onChange={(e) => setFilters({ ...filters, data_inicio: e.target.value })}
      />
      <input
        type="date"
        value={filters.data_fim}
        onChange={(e) => setFilters({ ...filters, data_fim: e.target.value })}
      />
      <select
        value={filters.status}
        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
      >
        <option value="">Todos</option>
        <option value="Ativa">Ativa</option>
        <option value="Cancelada">Cancelada</option>
        <option value="Distratada">Distratada</option>
      </select>
      <button onClick={handleFilter}>Filtrar</button>

      {isLoading ? (
        <p>Carregando...</p>
      ) : (
        <p>Total de vendas: {vendas?.length}</p>
      )}
    </div>
  );
}
```

### Exemplo 3: Exportação de Dados

```typescript
import { empreendimentoService } from '@/features/dashboard';

function ExportButton() {
  const handleExportExcel = async () => {
    try {
      const blob = await empreendimentoService.exportExcel();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `empreendimentos_${new Date().toISOString()}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao exportar:', error);
    }
  };

  return (
    <button onClick={handleExportExcel}>
      Exportar Excel
    </button>
  );
}
```

---

## Configuração de Query Keys

As query keys seguem um padrão consistente para facilitar invalidação de cache:

```typescript
// Padrão: [entidade, ...filtros]
['empreendimentos', { skip: 0, limit: 100 }]
['empreendimento', 1]
['vendas', { empreendimento_id: 1, status: 'Ativa' }]
['dashboard-kpis']
['metas', true]
```

Para invalidar cache manualmente:

```typescript
import { useQueryClient } from '@tanstack/react-query';

const queryClient = useQueryClient();

// Invalida todas as queries de empreendimentos
queryClient.invalidateQueries({ queryKey: ['empreendimentos'] });

// Invalida query específica
queryClient.invalidateQueries({ queryKey: ['empreendimento', 1] });

// Limpa todo o cache
queryClient.clear();
```

---

## Tratamento de Erros

Todos os hooks retornam informações de erro:

```typescript
const { data, error, isLoading, isError } = useVendas();

if (isError) {
  console.error('Erro:', error);
  return <div>Erro ao carregar vendas: {error.message}</div>;
}
```

Para erros de autenticação (401), o interceptor do Axios automaticamente:
1. Remove o token do localStorage
2. Redireciona para `/login`

---

## Próximos Passos

1. Criar componentes de UI (cards, gráficos, tabelas)
2. Implementar páginas (Dashboard, Login, Vendas, etc)
3. Adicionar testes unitários para hooks e services
4. Configurar loading states e error boundaries
5. Implementar funcionalidade de exportação

---

**Documentação completa da API:** `/docs/front-end/API_SPECIFICATION.md`
**Padrões de desenvolvimento:** `/claude.md`
