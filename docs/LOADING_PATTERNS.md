# 🔄 Padrões de Loading - Dashboard LCP

**Data:** 2025-11-05
**Status:** ✅ IMPLEMENTADO

---

## 📋 Princípios Gerais

### Regra de Ouro:
> **SEMPRE mostre um indicador de loading quando houver chamada à API**

Todo feedback visual melhora a experiência do usuário e evita cliques duplicados ou confusão sobre o estado da aplicação.

---

## 🎯 Tipos de Loading

### 1. **Loading de Página Completa**
Use quando a página inteira depende dos dados.

```tsx
import { Loading } from '@/shared/components/common';

if (isLoading) {
  return <Loading />;
}
```

**Quando usar:**
- Carregamento inicial de uma página
- Quando toda a interface depende dos dados

**Exemplo:** `Users.tsx:41-43`

---

### 2. **Loading em Botões de Ação**
Use para ações individuais que não bloqueiam toda a interface.

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

// No render:
<Button disabled={loadingId === item.id}>
  {loadingId === item.id ? (
    <Loader2 className="h-4 w-4 animate-spin" />
  ) : (
    <ActionIcon />
  )}
</Button>
```

**Quando usar:**
- Ações de ativar/desativar
- Exclusão de itens
- Ações inline em tabelas

**Exemplo:** `Users.tsx:28-35, 139-146`

---

### 3. **Loading em Formulários (Modal)**
Use para bloquear a edição durante o salvamento.

```tsx
const isLoading = createMutation.isPending || updateMutation.isPending;

<Input
  {...register('field')}
  disabled={isLoading}
/>

<Button type="submit" disabled={isLoading}>
  {isLoading ? 'Salvando...' : 'Salvar'}
</Button>
```

**Quando usar:**
- Submissão de formulários
- Criação/edição de registros
- Modals com formulários

**Exemplo:** `UserFormModal.tsx:42, 137, 151, 167, 181, 194, 204-208`

---

### 4. **Loading Overlay (Tela Cheia)**
Use para operações críticas que devem bloquear toda a interface.

```tsx
import { LoadingOverlay } from '@/shared/components/common';

{isProcessing && <LoadingOverlay message="Processando dados..." />}
```

**Quando usar:**
- Importação/exportação de dados
- Processos demorados
- Sincronização com APIs externas
- Operações que não devem ser interrompidas

**Exemplo:** `LoadingOverlay.tsx`

---

### 5. **Loading em Queries (TanStack Query)**
Use os estados fornecidos pelo React Query.

```tsx
const { data, isLoading, error, isFetching } = useQuery({
  queryKey: ['resource'],
  queryFn: fetchResource,
});

// isLoading: primeira carga
// isFetching: revalidação em background
```

**Estados importantes:**
- `isLoading`: Carregamento inicial (sem dados em cache)
- `isFetching`: Buscando dados (pode haver cache)
- `isPending`: Aguardando (mutation)

---

## 📦 Componentes Disponíveis

### `<Loading />`
Spinner centralizado para página completa.

```tsx
import { Loading } from '@/shared/components/common';

<Loading />
```

**Props:** Nenhuma
**Localização:** `src/shared/components/common/Loading.tsx`

---

### `<LoadingOverlay />`
Overlay de tela cheia com backdrop blur.

```tsx
import { LoadingOverlay } from '@/shared/components/common';

<LoadingOverlay message="Importando arquivos..." />
```

**Props:**
- `message?: string` - Texto exibido (default: "Carregando...")

**Localização:** `src/shared/components/common/LoadingOverlay.tsx`

---

### `<Loader2 />` (Lucide React)
Ícone de spinner para uso inline.

```tsx
import { Loader2 } from 'lucide-react';

<Loader2 className="h-4 w-4 animate-spin text-lcp-gray" />
```

**Classes importantes:**
- `animate-spin`: Animação de rotação
- Tamanhos: `h-4 w-4`, `h-6 w-6`, `h-8 w-8`
- Cores: `text-lcp-blue`, `text-lcp-gray`, `text-white`

---

## ✅ Checklist de Implementação

Ao implementar uma nova feature com API:

- [ ] Loading no carregamento inicial da página/listagem
- [ ] Loading nos botões de ação (criar, editar, deletar)
- [ ] Loading em ações inline (ativar/desativar, toggle)
- [ ] Desabilitar campos de formulário durante submit
- [ ] Texto do botão muda para "Salvando..." / "Carregando..."
- [ ] Ícones de ação substituídos por spinner
- [ ] Prevenir múltiplos cliques com `disabled`
- [ ] Erro tratado com toast/mensagem

---

## 🎨 Padrão Visual

### Cores
- **Azul LCP** (#0B2D5C): Loading principal, textos
- **Cinza LCP** (#6B7280): Loading secundário, ícones desabilitados

### Animação
```tsx
className="animate-spin"  // Rotação contínua
```

### Tamanhos
- **Ícones pequenos (botões):** `h-4 w-4`
- **Ícones médios:** `h-6 w-6`
- **Loading de página:** `h-8 w-8`

---

## 🔍 Exemplos Práticos

### Exemplo 1: CRUD de Usuários ✅

```tsx
// 1. Loading na listagem
if (isLoading) return <Loading />;

// 2. Loading em ação inline
const [loadingUserId, setLoadingUserId] = useState<number | null>(null);

const handleToggle = async (id: number) => {
  setLoadingUserId(id);
  try {
    await toggleMutation.mutateAsync({ id });
  } finally {
    setLoadingUserId(null);
  }
};

// 3. Render com loading
<Button disabled={loadingUserId === user.id}>
  {loadingUserId === user.id ? (
    <Loader2 className="h-4 w-4 animate-spin" />
  ) : (
    <ActionIcon />
  )}
</Button>

// 4. Loading no formulário
const isLoading = createMutation.isPending || updateMutation.isPending;

<Input disabled={isLoading} {...register('field')} />
<Button type="submit" disabled={isLoading}>
  {isLoading ? 'Salvando...' : 'Salvar'}
</Button>
```

---

### Exemplo 2: Dashboard com Filtros

```tsx
const { data: kpis, isLoading } = useDashboardKPIs(filters);
const { data: chart, isLoading: isLoadingChart } = useChartData();

// Loading inicial
if (isLoading) return <Loading />;

// Loading em seções específicas
{isLoadingChart ? (
  <div className="flex h-80 items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-lcp-blue" />
  </div>
) : (
  <Chart data={chart} />
)}
```

---

### Exemplo 3: Exportação de Dados

```tsx
const [isExporting, setIsExporting] = useState(false);

const handleExport = async () => {
  setIsExporting(true);
  try {
    await exportService.exportToExcel(filters);
  } finally {
    setIsExporting(false);
  }
};

// Render
{isExporting && <LoadingOverlay message="Exportando dados..." />}

<Button onClick={handleExport} disabled={isExporting}>
  {isExporting ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Exportando...
    </>
  ) : (
    <>
      <Download className="mr-2 h-4 w-4" />
      Exportar
    </>
  )}
</Button>
```

---

## 🚫 Anti-Patterns (Evitar)

### ❌ Não fazer:

```tsx
// 1. Ação sem loading
const handleDelete = (id) => {
  deleteUser.mutate(id); // ❌ Sem feedback visual
};

// 2. Formulário sem desabilitar campos
<Input {...register('nome')} /> // ❌ Usuário pode editar durante submit

// 3. Botão sem estado de loading
<Button onClick={handleSave}>Salvar</Button> // ❌ Permite múltiplos cliques

// 4. Query sem tratamento de loading
const { data } = useQuery(...); // ❌ Sem verificar isLoading
return <div>{data.items.map(...)}</div>; // Erro se data for undefined
```

### ✅ Fazer:

```tsx
// 1. Ação com loading
const [loading, setLoading] = useState(false);
const handleDelete = async (id) => {
  setLoading(true);
  try {
    await deleteUser.mutateAsync(id);
  } finally {
    setLoading(false);
  }
};

// 2. Formulário com campos desabilitados
<Input {...register('nome')} disabled={isLoading} />

// 3. Botão com loading
<Button onClick={handleSave} disabled={isLoading}>
  {isLoading ? 'Salvando...' : 'Salvar'}
</Button>

// 4. Query com tratamento
const { data, isLoading } = useQuery(...);
if (isLoading) return <Loading />;
if (!data) return <EmptyState />;
```

---

## 📊 Performance

### Otimizações

1. **Debounce em Inputs:**
```tsx
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue';

const [search, setSearch] = useState('');
const debouncedSearch = useDebouncedValue(search, 500);

useQuery({
  queryKey: ['users', debouncedSearch],
  queryFn: () => fetchUsers(debouncedSearch),
});
```

2. **Optimistic Updates:**
```tsx
const mutation = useMutation({
  mutationFn: updateUser,
  onMutate: async (newData) => {
    // Atualiza UI otimisticamente
    await queryClient.cancelQueries(['users']);
    const previous = queryClient.getQueryData(['users']);
    queryClient.setQueryData(['users'], (old) => [...old, newData]);
    return { previous };
  },
  onError: (err, variables, context) => {
    // Reverte se falhar
    queryClient.setQueryData(['users'], context.previous);
  },
});
```

---

## 🎓 Boas Práticas

1. ✅ **Sempre desabilite botões** durante loading
2. ✅ **Mude o texto do botão** ("Salvando...", "Carregando...")
3. ✅ **Use ícones de loading** (`Loader2` com `animate-spin`)
4. ✅ **Trate erros** com toast ou mensagem clara
5. ✅ **Previna múltiplos cliques** com `disabled`
6. ✅ **Use `finally`** para garantir que loading seja resetado
7. ✅ **Mantenha consistência** visual em toda aplicação
8. ✅ **Prefira feedback inline** a overlays quando possível
9. ✅ **Teste casos de erro** para ver se loading é resetado
10. ✅ **Documente operações longas** com mensagens claras

---

## 📚 Referências

- TanStack Query: https://tanstack.com/query/latest
- Lucide React Icons: https://lucide.dev
- React Hook Form: https://react-hook-form.com

---

## 🔄 Changelog

### 2025-11-05
- ✅ Implementado padrão de loading no CRUD de usuários
- ✅ Criado componente `LoadingOverlay`
- ✅ Documentação completa de padrões
- ✅ Exemplos práticos adicionados

---

**Última atualização:** 2025-11-05
**Mantido por:** Equipe de Desenvolvimento LCP
