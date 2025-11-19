# Atualizações - Grupos no Dashboard e Vendas

> **Data**: 2025-11-19
> **Versão**: 1.0

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Vendas com Informações de Grupo](#vendas-com-informações-de-grupo)
3. [Novas Rotas de Dashboard](#novas-rotas-de-dashboard)
4. [Exemplos de Uso](#exemplos-de-uso)
5. [TypeScript Types](#typescript-types)
6. [Migração](#migração)

---

## Visão Geral

Estas atualizações adicionam suporte completo para grupos de empreendimentos no dashboard e nas vendas:

### ✨ O que mudou?

1. **Vendas agora incluem informações do grupo** automaticamente
2. **Novas rotas para rankings e conversão por grupo** (dados agregados)
3. **Diferenciação entre filtrar e agrupar por grupo**

---

## Vendas com Informações de Grupo

### Endpoint Atualizado

**GET** `/api/v1/vendas/`

### O que mudou?

O schema de resposta `VendaResponse` agora inclui automaticamente:
- `grupo_id` (int | null)
- `grupo_nome` (string | null)

### Resposta Atualizada

```json
{
  "id": 123,
  "codigo_mega": 45678,
  "empreendimento_id": 5,
  "empreendimento_nome": "Residencial Vista Verde",
  "grupo_id": 1,
  "grupo_nome": "LEBON (RENDA+)",
  "proposta_id": 89,
  "cliente_nome": "João Silva",
  "cliente_cpf": "12345678901",
  "unidade": "101",
  "bloco": "A",
  "valor_venda": 450000.00,
  "data_venda": "2025-11-15T10:30:00",
  "status": "Ativa",
  "forma_pagamento": "Financiamento",
  "vendedor": "Maria Santos",
  "observacoes": null,
  "created_at": "2025-11-15T10:30:00",
  "updated_at": "2025-11-15T10:30:00"
}
```

### Quando os campos de grupo são null?

- Quando o empreendimento **não está vinculado a nenhum grupo**
- Empreendimentos sem grupo terão `grupo_id: null` e `grupo_nome: null`

---

## Novas Rotas de Dashboard

### 1. Top Grupos por Vendas

**GET** `/api/v1/dashboard/top-grupos`

Retorna ranking dos **próprios grupos** por valor de vendas (dados agregados).

#### Parâmetros de Query

| Parâmetro      | Tipo     | Obrigatório | Default | Descrição                      |
|----------------|----------|-------------|---------|--------------------------------|
| `data_inicio`  | datetime | Não         | -       | Data início do filtro          |
| `data_fim`     | datetime | Não         | -       | Data fim do filtro             |
| `limit`        | int      | Não         | 5       | Quantidade de grupos (max 20)  |

#### Resposta

```json
[
  {
    "grupo_id": 1,
    "grupo_nome": "LEBON (RENDA+)",
    "total_vendas": 150,
    "valor_vendas": 45000000.00
  },
  {
    "grupo_id": 2,
    "grupo_nome": "Residenciais Premium",
    "total_vendas": 120,
    "valor_vendas": 38000000.00
  },
  {
    "grupo_id": 3,
    "grupo_nome": "Econômicos",
    "total_vendas": 200,
    "valor_vendas": 25000000.00
  }
]
```

#### Ordenação

- Ordenado por **valor_vendas** (descendente)
- Grupos com maior VGV vendido aparecem primeiro

---

### 2. Conversão por Grupo

**GET** `/api/v1/dashboard/conversao-por-grupo`

Retorna taxa de conversão de cada **grupo** (propostas → vendas agregadas por grupo).

#### Parâmetros de Query

| Parâmetro      | Tipo     | Obrigatório | Default | Descrição                      |
|----------------|----------|-------------|---------|--------------------------------|
| `data_inicio`  | datetime | Não         | -       | Data início do filtro          |
| `data_fim`     | datetime | Não         | -       | Data fim do filtro             |
| `limit`        | int      | Não         | 10      | Quantidade de grupos (max 50)  |

#### Resposta

```json
[
  {
    "grupo_id": 1,
    "grupo_nome": "LEBON (RENDA+)",
    "total_propostas": 250,
    "total_vendas": 150,
    "taxa_conversao": 60.00,
    "valor_propostas": 75000000.00,
    "valor_vendas": 45000000.00
  },
  {
    "grupo_id": 2,
    "grupo_nome": "Residenciais Premium",
    "total_propostas": 200,
    "total_vendas": 120,
    "taxa_conversao": 60.00,
    "valor_propostas": 63000000.00,
    "valor_vendas": 38000000.00
  }
]
```

#### Ordenação

- Ordenado por **taxa_conversao** (descendente)
- Grupos com melhor conversão aparecem primeiro

#### Observações

- `total_propostas` **inclui propostas + reservas** (unidades reservadas do empreendimento)
- `valor_propostas` **inclui valor de propostas + valor de reservas**
- Taxa de conversão = `(total_vendas / total_propostas) * 100`

---

## Exemplos de Uso

### React/TypeScript - Listagem de Vendas com Grupo

```tsx
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

interface Venda {
  id: number;
  codigo_mega: number;
  empreendimento_id: number;
  empreendimento_nome: string;
  grupo_id: number | null;
  grupo_nome: string | null;
  cliente_nome: string;
  valor_venda: number;
  data_venda: string;
  status: string;
}

function VendasList() {
  const { data: vendas } = useQuery({
    queryKey: ['vendas'],
    queryFn: () => api.get<Venda[]>('/vendas?limit=50')
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Cliente</th>
          <th>Empreendimento</th>
          <th>Grupo</th>
          <th>Valor</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {vendas?.map((venda) => (
          <tr key={venda.id}>
            <td>{venda.cliente_nome}</td>
            <td>{venda.empreendimento_nome}</td>
            <td>
              {venda.grupo_nome ? (
                <span className="badge">{venda.grupo_nome}</span>
              ) : (
                <span className="text-muted">Sem grupo</span>
              )}
            </td>
            <td>{formatCurrency(venda.valor_venda)}</td>
            <td>{venda.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

---

### React/TypeScript - Top Grupos Chart

```tsx
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '@/lib/api';

interface TopGrupo {
  grupo_id: number;
  grupo_nome: string;
  total_vendas: number;
  valor_vendas: number;
}

function TopGruposChart() {
  const { data: topGrupos } = useQuery({
    queryKey: ['dashboard', 'top-grupos'],
    queryFn: () => api.get<TopGrupo[]>('/dashboard/top-grupos?limit=5')
  });

  return (
    <div className="card">
      <h3>Top 5 Grupos por Vendas</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={topGrupos}>
          <XAxis dataKey="grupo_nome" />
          <YAxis />
          <Tooltip
            formatter={(value: number) => formatCurrency(value)}
          />
          <Bar dataKey="valor_vendas" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
```

---

### React/TypeScript - Conversão por Grupo

```tsx
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

interface ConversaoGrupo {
  grupo_id: number;
  grupo_nome: string;
  total_propostas: number;
  total_vendas: number;
  taxa_conversao: number;
  valor_propostas: number;
  valor_vendas: number;
}

function ConversaoPorGrupo() {
  const { data: conversoes } = useQuery({
    queryKey: ['dashboard', 'conversao-grupos'],
    queryFn: () => api.get<ConversaoGrupo[]>('/dashboard/conversao-por-grupo?limit=10')
  });

  return (
    <div className="card">
      <h3>Taxa de Conversão por Grupo</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Grupo</th>
            <th>Propostas</th>
            <th>Vendas</th>
            <th>Conversão</th>
            <th>VGV Propostas</th>
            <th>VGV Vendas</th>
          </tr>
        </thead>
        <tbody>
          {conversoes?.map((conv) => (
            <tr key={conv.grupo_id}>
              <td>{conv.grupo_nome}</td>
              <td>{conv.total_propostas}</td>
              <td>{conv.total_vendas}</td>
              <td>
                <span className={`badge ${getTaxaClass(conv.taxa_conversao)}`}>
                  {conv.taxa_conversao.toFixed(2)}%
                </span>
              </td>
              <td>{formatCurrency(conv.valor_propostas)}</td>
              <td>{formatCurrency(conv.valor_vendas)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function getTaxaClass(taxa: number): string {
  if (taxa >= 70) return 'badge-success';
  if (taxa >= 50) return 'badge-warning';
  return 'badge-danger';
}
```

---

### React/TypeScript - Filtro com Data Range

```tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

function TopGruposComFiltro() {
  const [dateRange, setDateRange] = useState({
    inicio: '2025-11-01',
    fim: '2025-11-19'
  });

  const { data: topGrupos } = useQuery({
    queryKey: ['dashboard', 'top-grupos', dateRange],
    queryFn: () =>
      api.get<TopGrupo[]>(
        `/dashboard/top-grupos?data_inicio=${dateRange.inicio}&data_fim=${dateRange.fim}&limit=10`
      )
  });

  return (
    <div>
      <div className="filters">
        <input
          type="date"
          value={dateRange.inicio}
          onChange={(e) => setDateRange({ ...dateRange, inicio: e.target.value })}
        />
        <input
          type="date"
          value={dateRange.fim}
          onChange={(e) => setDateRange({ ...dateRange, fim: e.target.value })}
        />
      </div>

      {/* Chart ou Table aqui */}
    </div>
  );
}
```

---

## TypeScript Types

```typescript
// ============================================
// Venda (Response atualizado)
// ============================================
interface VendaResponse {
  id: number;
  codigo_mega: number;
  empreendimento_id: number;
  empreendimento_nome: string | null;
  grupo_id: number | null;              // ✨ NOVO
  grupo_nome: string | null;            // ✨ NOVO
  proposta_id: number | null;
  cliente_nome: string;
  cliente_cpf: string | null;
  unidade: string | null;
  bloco: string | null;
  valor_venda: number;
  data_venda: string;
  status: string;
  forma_pagamento: string | null;
  vendedor: string | null;
  observacoes: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================
// Top Grupos
// ============================================
interface TopGrupo {
  grupo_id: number;
  grupo_nome: string;
  total_vendas: number;
  valor_vendas: number;
}

// ============================================
// Conversão por Grupo
// ============================================
interface ConversaoGrupo {
  grupo_id: number;
  grupo_nome: string;
  total_propostas: number;      // Inclui propostas + reservas
  total_vendas: number;
  taxa_conversao: number;        // Percentual (0-100)
  valor_propostas: number;       // Inclui propostas + reservas
  valor_vendas: number;
}

// ============================================
// Query Params
// ============================================
interface DashboardGrupoParams {
  data_inicio?: string;   // ISO 8601: "2025-11-01T00:00:00"
  data_fim?: string;      // ISO 8601: "2025-11-19T23:59:59"
  limit?: number;         // Default: 5 (top-grupos) ou 10 (conversao)
}
```

---

## Migração

### Mudanças Breaking Changes?

**Não há breaking changes!** Todas as alterações são **retrocompatíveis**:

✅ Vendas agora incluem campos extras (`grupo_id`, `grupo_nome`)
✅ Campos novos são **nullable**, não afetam código existente
✅ Rotas antigas continuam funcionando normalmente
✅ Novas rotas são **adicionais**, não substituem nada

### Checklist de Atualização

- [ ] Atualizar types TypeScript do `VendaResponse`
- [ ] Adicionar renderização de `grupo_nome` nas tabelas de vendas
- [ ] Implementar componentes para `/top-grupos`
- [ ] Implementar componentes para `/conversao-por-grupo`
- [ ] Adicionar filtros de data range (opcional)
- [ ] Testar com empreendimentos sem grupo (`grupo_id: null`)

---

## Diferença: Filtrar vs Agrupar

### Filtrar por Grupo (Rotas Existentes)

Retorna dados **filtrados** para empreendimentos de um grupo específico:

```
GET /dashboard/top-empreendimentos?grupo_id=1
→ Top empreendimentos DENTRO do grupo 1

GET /dashboard/conversao-por-empreendimento?grupo_id=1
→ Conversão de cada empreendimento DENTRO do grupo 1
```

### Agrupar por Grupo (Novas Rotas)

Retorna dados **agregados** por grupo (os próprios grupos são o resultado):

```
GET /dashboard/top-grupos
→ Ranking dos GRUPOS (não empreendimentos)

GET /dashboard/conversao-por-grupo
→ Conversão de cada GRUPO (agregado)
```

### Exemplo Visual

**Filtrar** (`?grupo_id=1`):
```
LEBON (RENDA+)
  ├─ Residencial Vista Verde: R$ 10M
  ├─ Condomínio Parque: R$ 8M
  └─ Edifício Central: R$ 5M
```

**Agrupar** (sem filtro):
```
LEBON (RENDA+): R$ 23M total
Residenciais Premium: R$ 18M total
Econômicos: R$ 12M total
```

---

## Exemplos de Queries

### Vendas do mês de novembro com informações de grupo

```bash
GET /api/v1/vendas?data_inicio=2025-11-01&data_fim=2025-11-30&limit=100
```

### Top 10 grupos por vendas (período específico)

```bash
GET /api/v1/dashboard/top-grupos?data_inicio=2025-11-01&data_fim=2025-11-30&limit=10
```

### Conversão de todos os grupos (sem filtro de data)

```bash
GET /api/v1/dashboard/conversao-por-grupo?limit=50
```

### Top 5 empreendimentos do grupo LEBON (FILTRADO)

```bash
GET /api/v1/dashboard/top-empreendimentos?grupo_id=1&limit=5
```

### Conversão dos empreendimentos do grupo LEBON (FILTRADO)

```bash
GET /api/v1/dashboard/conversao-por-empreendimento?grupo_id=1&limit=10
```

---

## Notas Importantes

### 1. Reservas incluídas em Propostas

Nas rotas de conversão (`/conversao-por-grupo` e `/conversao-por-empreendimento`):

- `total_propostas` = propostas no período + reservas atuais
- `valor_propostas` = valor propostas + valor reservas

Isso reflete melhor o funil de vendas real (pré-venda + reservas → vendas).

### 2. Empreendimentos sem Grupo

- Vendas de empreendimentos **sem grupo** terão `grupo_id: null`
- Nas rotas `/top-grupos` e `/conversao-por-grupo`, apenas empreendimentos **com grupo** são incluídos
- Para ver empreendimentos sem grupo, use as rotas tradicionais sem `grupo_id`

### 3. Performance

- Todas as queries usam **SQL JOINs eficientes**
- Índices existentes em `empreendimento_grupo_id` otimizam as queries
- Limite padrão de 5-10 resultados previne sobrecarga

### 4. Autenticação

- Todas as rotas requerem autenticação (token JWT)
- Usar header: `Authorization: Bearer <token>`

---

## Suporte

Para dúvidas ou problemas:
1. Verificar tipos TypeScript acima
2. Testar rotas com Postman/Insomnia
3. Verificar logs do backend (`structlog`)
4. Consultar documentação de grupos: `/docs/frontend/grupos-empreendimentos.md`

---

**Última Atualização**: 2025-11-19
**Versão da API**: 0.1.0
