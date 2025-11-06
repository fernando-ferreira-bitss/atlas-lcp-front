# API: Resumo de Unidades por Status

Documentação da rota de resumo de unidades para integração com o frontend.

---

## Endpoint

### `GET /api/v1/dashboard/resumo-unidades`

Retorna resumo consolidado de unidades por status (disponível, reservada, bloqueada, vendida), incluindo quantidades, valores (VGV) e percentuais.

**Autenticação:** Requerida (Bearer Token)

---

## Query Parameters

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `empreendimento_id` | integer | Não | ID do empreendimento para filtrar. Se omitido, retorna dados consolidados de todos os empreendimentos |

---

## Response

### Status: `200 OK`

```json
{
  "total_unidades": 450,
  "unidades_disponiveis": 135,
  "unidades_reservadas": 90,
  "unidades_bloqueadas": 45,
  "unidades_vendidas": 180,
  "percentual_disponivel": 30.0,
  "percentual_reservadas": 20.0,
  "percentual_bloqueadas": 10.0,
  "percentual_vendidas": 40.0,
  "valor_unidades_disponiveis": 45000000.00,
  "valor_unidades_reservadas": 30000000.00,
  "valor_unidades_bloqueadas": 15000000.00,
  "percentual_valor_disponivel": 50.0,
  "percentual_valor_reservadas": 33.33,
  "percentual_valor_bloqueadas": 16.67
}
```

### Campos da Response

#### Quantidades

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `total_unidades` | integer | Total de unidades |
| `unidades_disponiveis` | integer | Unidades disponíveis para venda |
| `unidades_reservadas` | integer | Unidades reservadas (pré-venda) |
| `unidades_bloqueadas` | integer | Unidades bloqueadas |
| `unidades_vendidas` | integer | Unidades vendidas |

#### Percentuais de Quantidade

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `percentual_disponivel` | float | Percentual de unidades disponíveis (0-100) |
| `percentual_reservadas` | float | Percentual de unidades reservadas (0-100) |
| `percentual_bloqueadas` | float | Percentual de unidades bloqueadas (0-100) |
| `percentual_vendidas` | float | Percentual de unidades vendidas (0-100) |

#### Valores (VGV)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `valor_unidades_disponiveis` | float | Valor total (VGV) das unidades disponíveis em R$ |
| `valor_unidades_reservadas` | float | Valor total (VGV) das unidades reservadas em R$ |
| `valor_unidades_bloqueadas` | float | Valor total (VGV) das unidades bloqueadas em R$ |

**Nota:** Não retornamos o valor de unidades vendidas conforme solicitado.

#### Percentuais de Valor

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `percentual_valor_disponivel` | float | Percentual do VGV disponível (0-100) |
| `percentual_valor_reservadas` | float | Percentual do VGV reservado (0-100) |
| `percentual_valor_bloqueadas` | float | Percentual do VGV bloqueado (0-100) |

---

## Exemplos de Uso

### JavaScript / Fetch API

```javascript
// Buscar resumo consolidado (todos os empreendimentos)
const response = await fetch('http://localhost:8000/api/v1/dashboard/resumo-unidades', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const resumo = await response.json();
console.log(`Total de unidades: ${resumo.total_unidades}`);
console.log(`VGV Disponível: R$ ${resumo.valor_unidades_disponiveis.toLocaleString('pt-BR')}`);

// Buscar resumo de um empreendimento específico
const response = await fetch('http://localhost:8000/api/v1/dashboard/resumo-unidades?empreendimento_id=3', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const resumoEmp = await response.json();
```

### Axios

```javascript
import axios from 'axios';

// Resumo consolidado
const resumo = await axios.get('/api/v1/dashboard/resumo-unidades', {
  headers: {
    Authorization: `Bearer ${token}`
  }
});

console.log(resumo.data);

// Resumo por empreendimento
const resumoEmp = await axios.get('/api/v1/dashboard/resumo-unidades', {
  params: { empreendimento_id: 3 },
  headers: {
    Authorization: `Bearer ${token}`
  }
});
```

### React Hook (Exemplo)

```tsx
import { useState, useEffect } from 'react';
import axios from 'axios';

interface ResumoUnidades {
  total_unidades: number;
  unidades_disponiveis: number;
  unidades_reservadas: number;
  unidades_bloqueadas: number;
  unidades_vendidas: number;
  percentual_disponivel: number;
  percentual_reservadas: number;
  percentual_bloqueadas: number;
  percentual_vendidas: number;
  valor_unidades_disponiveis: number;
  valor_unidades_reservadas: number;
  valor_unidades_bloqueadas: number;
  percentual_valor_disponivel: number;
  percentual_valor_reservadas: number;
  percentual_valor_bloqueadas: number;
}

function useResumoUnidades(empreendimentoId?: number) {
  const [resumo, setResumo] = useState<ResumoUnidades | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResumo() {
      try {
        const { data } = await axios.get('/api/v1/dashboard/resumo-unidades', {
          params: empreendimentoId ? { empreendimento_id: empreendimentoId } : {},
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setResumo(data);
      } catch (error) {
        console.error('Erro ao buscar resumo:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchResumo();
  }, [empreendimentoId]);

  return { resumo, loading };
}

// Uso no componente
function DashboardUnidades() {
  const { resumo, loading } = useResumoUnidades();

  if (loading) return <div>Carregando...</div>;
  if (!resumo) return <div>Erro ao carregar dados</div>;

  return (
    <div>
      <h2>Resumo de Unidades</h2>
      <div className="stats">
        <div className="stat">
          <span>Total</span>
          <strong>{resumo.total_unidades}</strong>
        </div>
        <div className="stat">
          <span>Disponíveis</span>
          <strong>{resumo.unidades_disponiveis} ({resumo.percentual_disponivel}%)</strong>
        </div>
        <div className="stat">
          <span>Reservadas</span>
          <strong>{resumo.unidades_reservadas} ({resumo.percentual_reservadas}%)</strong>
        </div>
        <div className="stat">
          <span>Vendidas</span>
          <strong>{resumo.unidades_vendidas} ({resumo.percentual_vendidas}%)</strong>
        </div>
      </div>

      <h3>Valores (VGV)</h3>
      <div className="valores">
        <div className="valor">
          <span>VGV Disponível</span>
          <strong>
            R$ {resumo.valor_unidades_disponiveis.toLocaleString('pt-BR', {
              minimumFractionDigits: 2
            })}
          </strong>
          <small>{resumo.percentual_valor_disponivel}%</small>
        </div>
        <div className="valor">
          <span>VGV Reservado</span>
          <strong>
            R$ {resumo.valor_unidades_reservadas.toLocaleString('pt-BR', {
              minimumFractionDigits: 2
            })}
          </strong>
          <small>{resumo.percentual_valor_reservadas}%</small>
        </div>
        <div className="valor">
          <span>VGV Bloqueado</span>
          <strong>
            R$ {resumo.valor_unidades_bloqueadas.toLocaleString('pt-BR', {
              minimumFractionDigits: 2
            })}
          </strong>
          <small>{resumo.percentual_valor_bloqueadas}%</small>
        </div>
      </div>
    </div>
  );
}
```

### Vue 3 (Composition API)

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

interface ResumoUnidades {
  total_unidades: number;
  unidades_disponiveis: number;
  unidades_reservadas: number;
  unidades_bloqueadas: number;
  unidades_vendidas: number;
  percentual_disponivel: number;
  percentual_reservadas: number;
  percentual_bloqueadas: number;
  percentual_vendidas: number;
  valor_unidades_disponiveis: number;
  valor_unidades_reservadas: number;
  valor_unidades_bloqueadas: number;
  percentual_valor_disponivel: number;
  percentual_valor_reservadas: number;
  percentual_valor_bloqueadas: number;
}

const props = defineProps<{
  empreendimentoId?: number;
}>();

const resumo = ref<ResumoUnidades | null>(null);
const loading = ref(true);

const fetchResumo = async () => {
  try {
    const params = props.empreendimentoId
      ? { empreendimento_id: props.empreendimentoId }
      : {};

    const { data } = await axios.get('/api/v1/dashboard/resumo-unidades', {
      params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    resumo.value = data;
  } catch (error) {
    console.error('Erro ao buscar resumo:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchResumo);

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};
</script>

<template>
  <div v-if="loading">Carregando...</div>
  <div v-else-if="resumo" class="resumo-unidades">
    <h2>Resumo de Unidades</h2>

    <div class="grid">
      <div class="card">
        <span>Total</span>
        <strong>{{ resumo.total_unidades }}</strong>
      </div>
      <div class="card">
        <span>Disponíveis</span>
        <strong>{{ resumo.unidades_disponiveis }} ({{ resumo.percentual_disponivel }}%)</strong>
      </div>
      <div class="card">
        <span>Reservadas</span>
        <strong>{{ resumo.unidades_reservadas }} ({{ resumo.percentual_reservadas }}%)</strong>
      </div>
      <div class="card">
        <span>Vendidas</span>
        <strong>{{ resumo.unidades_vendidas }} ({{ resumo.percentual_vendidas }}%)</strong>
      </div>
    </div>

    <h3>Valores (VGV)</h3>
    <div class="valores-grid">
      <div class="valor-card">
        <span>VGV Disponível</span>
        <strong>{{ formatCurrency(resumo.valor_unidades_disponiveis) }}</strong>
        <small>{{ resumo.percentual_valor_disponivel }}%</small>
      </div>
      <div class="valor-card">
        <span>VGV Reservado</span>
        <strong>{{ formatCurrency(resumo.valor_unidades_reservadas) }}</strong>
        <small>{{ resumo.percentual_valor_reservadas }}%</small>
      </div>
      <div class="valor-card">
        <span>VGV Bloqueado</span>
        <strong>{{ formatCurrency(resumo.valor_unidades_bloqueadas) }}</strong>
        <small>{{ resumo.percentual_valor_bloqueadas }}%</small>
      </div>
    </div>
  </div>
</template>
```

---

## TypeScript Interface

```typescript
export interface ResumoUnidades {
  total_unidades: number;
  unidades_disponiveis: number;
  unidades_reservadas: number;
  unidades_bloqueadas: number;
  unidades_vendidas: number;
  percentual_disponivel: number;
  percentual_reservadas: number;
  percentual_bloqueadas: number;
  percentual_vendidas: number;
  valor_unidades_disponiveis: number;
  valor_unidades_reservadas: number;
  valor_unidades_bloqueadas: number;
  percentual_valor_disponivel: number;
  percentual_valor_reservadas: number;
  percentual_valor_bloqueadas: number;
}
```

---

## Casos de Uso no Frontend

### 1. Dashboard - Card de Resumo Geral

Exibir card com resumo consolidado de todas as unidades:

```
┌─────────────────────────────────────┐
│ Resumo de Unidades                  │
├─────────────────────────────────────┤
│ Total: 450 unidades                 │
│                                     │
│ ● Disponíveis: 135 (30%)            │
│ ● Reservadas: 90 (20%)              │
│ ● Bloqueadas: 45 (10%)              │
│ ● Vendidas: 180 (40%)               │
│                                     │
│ VGV Total: R$ 90.000.000,00         │
│ ├─ Disponível: R$ 45M (50%)         │
│ ├─ Reservado: R$ 30M (33.33%)       │
│ └─ Bloqueado: R$ 15M (16.67%)       │
└─────────────────────────────────────┘
```

### 2. Gráfico de Pizza - Distribuição de Unidades

Usar os campos `percentual_*` para gráfico de distribuição:

```javascript
const chartData = {
  labels: ['Disponíveis', 'Reservadas', 'Bloqueadas', 'Vendidas'],
  datasets: [{
    data: [
      resumo.percentual_disponivel,
      resumo.percentual_reservadas,
      resumo.percentual_bloqueadas,
      resumo.percentual_vendidas
    ],
    backgroundColor: ['#10b981', '#f59e0b', '#6b7280', '#3b82f6']
  }]
};
```

### 3. Gráfico de Rosca - Distribuição de Valor (VGV)

```javascript
const vgvChartData = {
  labels: ['Disponível', 'Reservado', 'Bloqueado'],
  datasets: [{
    data: [
      resumo.percentual_valor_disponivel,
      resumo.percentual_valor_reservadas,
      resumo.percentual_valor_bloqueadas
    ],
    backgroundColor: ['#10b981', '#f59e0b', '#6b7280']
  }]
};
```

### 4. Página de Detalhes do Empreendimento

Mostrar resumo específico de um empreendimento passando `empreendimento_id`:

```javascript
// URL: /empreendimentos/3
const { resumo } = useResumoUnidades(3);
```

---

## Observações Importantes

1. **Autenticação Obrigatória**: Endpoint requer Bearer Token válido
2. **Valores em Reais**: Todos os campos `valor_*` estão em R$ (decimal com 2 casas)
3. **Percentuais Arredondados**: Percentuais retornados com 2 casas decimais
4. **VGV**: Valor Geral de Vendas (preço de tabela das unidades)
5. **Dados Agregados**: Quando `empreendimento_id` não é informado, retorna soma de todos os empreendimentos
6. **Cache**: API pode cachear resultados por alguns minutos

---

## Status Codes

| Code | Descrição |
|------|-----------|
| `200` | Sucesso |
| `401` | Não autenticado (token inválido/ausente) |
| `500` | Erro interno do servidor |

---

## Changelog

| Data | Versão | Alteração |
|------|--------|-----------|
| 2025-11-06 | 1.0 | Endpoint criado com suporte a quantidades e valores por status |

---

**Última Atualização:** 06/11/2025
