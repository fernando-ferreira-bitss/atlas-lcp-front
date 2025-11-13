# 📊 Módulo de Relatórios - Exportação de Dados

## Visão Geral

Módulo responsável por exportar dados de **Vendas** e **Propostas** nos formatos **CSV** e **XLSX** (Excel), integrando com a API de exportação do backend.

## 📁 Estrutura

```
src/features/relatorios/
├── hooks/
│   └── useExport.ts              # Hook customizado para exportação
├── pages/
│   └── Relatorios.tsx            # Página de relatórios
├── services/
│   └── exportService.ts          # Serviço de comunicação com API
├── types/
│   └── index.ts                  # Definições de tipos TypeScript
├── index.ts                      # Exports públicos do módulo
└── README.md                     # Esta documentação
```

## 🚀 Como Usar

### Página de Relatórios

A página de relatórios (`/relatorios`) oferece três tipos de exportação:

1. **Exportar Propostas** - Exporta dados de propostas no formato selecionado
2. **Exportar Vendas** - Exporta dados de vendas no formato selecionado
3. **Exportar Relatório Completo** - Gera um Excel com 3 abas (Vendas, Propostas, Empreendimentos)

### Usando o Hook `useExport`

```typescript
import { useExport } from '@/features/relatorios';

function MyComponent() {
  const {
    isExporting,      // Estado de loading
    error,            // Mensagem de erro (se houver)
    exportVendas,     // Função para exportar vendas
    exportPropostas,  // Função para exportar propostas
    exportRelatorioCompleto, // Função para relatório completo
    clearError        // Limpa erro atual
  } = useExport();

  const handleExport = async () => {
    const success = await exportVendas({
      formato: 'xlsx',
      data_inicio: '2024-01-01T00:00:00',
      data_fim: '2024-12-31T23:59:59',
      empreendimento_id: 5
    });

    if (success) {
      console.log('Exportação concluída!');
    } else {
      console.error('Erro:', error);
    }
  };

  return (
    <button onClick={handleExport} disabled={isExporting}>
      {isExporting ? 'Exportando...' : 'Exportar'}
    </button>
  );
}
```

### Usando o Service Diretamente

```typescript
import { exportService } from '@/features/relatorios';

// Exportar vendas
await exportService.exportVendas({
  formato: 'xlsx',
  data_inicio: '2024-01-01T00:00:00',
  data_fim: '2024-12-31T23:59:59',
});

// Exportar propostas com filtro de status
await exportService.exportPropostas({
  formato: 'csv',
  status: 'Aprovada',
  empreendimento_id: 3,
});

// Exportar relatório completo
await exportService.exportRelatorioCompleto({
  data_inicio: '2024-01-01T00:00:00',
  data_fim: '2024-12-31T23:59:59',
});
```

## 📝 API

### Hook `useExport()`

#### Retorno

| Propriedade               | Tipo                           | Descrição                                |
| ------------------------- | ------------------------------ | ---------------------------------------- |
| `isExporting`             | `boolean`                      | `true` quando há exportação em andamento |
| `error`                   | `string \| null`               | Mensagem de erro ou `null`               |
| `exportVendas`            | `(params) => Promise<boolean>` | Exporta vendas                           |
| `exportPropostas`         | `(params) => Promise<boolean>` | Exporta propostas                        |
| `exportRelatorioCompleto` | `(params) => Promise<boolean>` | Exporta relatório completo               |
| `clearError`              | `() => void`                   | Limpa o erro atual                       |

### Parâmetros de Exportação

#### `ExportBaseParams` (Vendas)

```typescript
interface ExportBaseParams {
  formato?: 'csv' | 'xlsx'; // Default: 'xlsx'
  data_inicio?: string; // ISO 8601: "2024-01-01T00:00:00"
  data_fim?: string; // ISO 8601: "2024-12-31T23:59:59"
  empreendimento_id?: number | null; // null = todos
}
```

#### `ExportPropostasParams` (Propostas)

```typescript
interface ExportPropostasParams extends ExportBaseParams {
  status?: string; // Ex: "Aberta", "Aprovada", "Rejeitada"
}
```

#### `ExportRelatorioCompletoParams` (Relatório Completo)

```typescript
interface ExportRelatorioCompletoParams {
  data_inicio?: string; // ISO 8601
  data_fim?: string; // ISO 8601
}
```

## 🎨 Componentes UI

A página de relatórios inclui:

- **Seletor de Formato** - Permite escolher entre CSV ou Excel
- **Botões de Exportação** - Com estados de loading (`Loader2` animado)
- **Feedback Visual** - Toasts para sucesso/erro
- **Design Responsivo** - Mobile-first, adaptável a todos os tamanhos de tela
- **Card Informativo** - Dicas sobre exportação

## 🔐 Autenticação

Todas as requisições incluem automaticamente o token JWT armazenado em `localStorage` (`auth_token`).

Se a sessão expirar (401), o serviço tratará o erro e exibirá uma mensagem amigável.

## 🎯 Casos de Uso

### 1. Exportar Dados Filtrados do Dashboard

```typescript
import { useExport } from '@/features/relatorios';
import { useDashboardFilters } from '@/features/dashboard';

function ExportButton() {
  const { filters } = useDashboardFilters();
  const { exportVendas, isExporting } = useExport();

  const handleExport = () => {
    exportVendas({
      formato: 'xlsx',
      data_inicio: filters.data_inicio,
      data_fim: filters.data_fim,
      empreendimento_id: filters.empreendimento_id,
    });
  };

  return (
    <button onClick={handleExport} disabled={isExporting}>
      Exportar Vendas
    </button>
  );
}
```

### 2. Exportar com Feedback Toast

```typescript
import { useExport } from '@/features/relatorios';
import { useToast } from '@/shared/hooks/use-toast';

function ExportWithToast() {
  const { exportPropostas, isExporting, error } = useExport();
  const { toast } = useToast();

  const handleExport = async () => {
    const success = await exportPropostas({ formato: 'csv' });

    if (success) {
      toast({
        title: 'Sucesso!',
        description: 'Propostas exportadas com sucesso.',
      });
    } else {
      toast({
        title: 'Erro',
        description: error || 'Erro ao exportar propostas.',
        variant: 'destructive',
      });
    }
  };

  return (
    <button onClick={handleExport} disabled={isExporting}>
      Exportar
    </button>
  );
}
```

## ⚠️ Tratamento de Erros

O hook `useExport` trata automaticamente os seguintes erros:

| Status | Mensagem                                                   |
| ------ | ---------------------------------------------------------- |
| 401    | "Sessão expirada. Faça login novamente."                   |
| 403    | "Você não tem permissão para exportar dados."              |
| 422    | "Filtros inválidos. Verifique os dados e tente novamente." |
| Outros | "Erro ao exportar dados."                                  |

## 📊 Formato de Datas

### Entrada (Parâmetros)

ISO 8601: `YYYY-MM-DDTHH:MM:SS`

Exemplos:

- `2024-01-01T00:00:00`
- `2024-12-31T23:59:59`

### Saída (Arquivos CSV/XLSX)

Formato Brasileiro: `DD/MM/YYYY HH:MM`

Exemplos:

- `01/01/2024 10:30`
- `31/12/2024 23:59`

## 🔧 Manutenção

### Adicionar Novo Tipo de Exportação

1. Adicionar método no `exportService.ts`:

```typescript
async exportCustomData(params: CustomParams): Promise<void> {
  // Implementação
}
```

2. Adicionar função no hook `useExport.ts`:

```typescript
const exportCustomData = async (params: CustomParams): Promise<boolean> => {
  setIsExporting(true);
  setError(null);
  try {
    await exportService.exportCustomData(params);
    return true;
  } catch (err) {
    setError(handleError(err));
    return false;
  } finally {
    setIsExporting(false);
  }
};
```

3. Retornar a nova função:

```typescript
return {
  // ... outras funções
  exportCustomData,
};
```

## 📚 Referências

- [Documentação da API de Exportação](/docs/backend/API_EXPORTACAO_CSV.md)
- [Padrões de Desenvolvimento](/CLAUDE.md)
- [Padrões de Loading](/docs/LOADING_PATTERNS.md)

## 🤝 Contribuindo

Ao adicionar novas funcionalidades:

1. Siga os padrões de nomenclatura do projeto
2. Adicione tipos TypeScript explícitos
3. Implemente tratamento de erros
4. Adicione estados de loading
5. Teste responsividade
6. Execute `npm run lint:fix` e `npm run type-check`
7. Atualize esta documentação

---

**Última Atualização:** 13/11/2024
**Versão:** 1.0.0
