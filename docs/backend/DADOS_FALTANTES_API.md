# 📋 Dados Faltantes na API - Para Implementação no Backend

Este documento lista todos os dados que estão **mockados no frontend** e precisam ser implementados no backend.

**Data:** 2025-11-05
**Status:** ⚠️ PENDENTE - Aguardando implementação no backend

---

## 🔴 PRIORIDADE ALTA - Endpoint `/dashboard/indicadores`

Os seguintes campos precisam ser adicionados ao endpoint `/dashboard/indicadores`:

### 1. **Conversão (R$) - Taxa de Conversão Financeira**
```typescript
taxa_conversao_valor: number  // Percentual
```
**Cálculo:** `(valor_total_vendas / valor_total_propostas) * 100`

**Descrição:** Relação financeira das conversões (não apenas quantidade, mas valores em reais)

---

### 2. **Valor Total de Propostas**
```typescript
valor_total_propostas: number  // R$
```
**Descrição:** Soma de todos os valores das propostas no período filtrado

**Necessário para:** Calcular a taxa de conversão financeira

---

### 3. **Ticket Médio (Proposta)**
```typescript
ticket_medio_proposta: number  // R$
```
**Cálculo:** `valor_total_propostas / total_propostas`

**Descrição:** Valor médio das propostas realizadas

---

### 4. **Meta VGV Mensal**
```typescript
meta_vendas_mensal: number       // R$
percentual_meta_mensal: number   // Percentual
```
**Cálculo:**
- `meta_vendas_mensal`: Valor da meta para o mês atual
- `percentual_meta_mensal`: `(valor_vendas_mes / meta_vendas_mensal) * 100`

**Descrição:** Meta de vendas e percentual atingido do mês atual

---

### 5. **Meta VGV YTD (Year to Date)**
```typescript
meta_vendas_ytd: number       // R$
percentual_meta_ytd: number   // Percentual
```
**Cálculo:**
- `meta_vendas_ytd`: Soma das metas de janeiro até o mês atual
- `percentual_meta_ytd`: `(valor_vendas_ytd / meta_vendas_ytd) * 100`

**Descrição:** Meta de vendas acumulada no ano e percentual atingido

---

## 🟡 PRIORIDADE MÉDIA - Novos Endpoints Necessários

### 6. **Endpoint: `/dashboard/comparativo-anos`**

**Método:** `GET`

**Query Parameters:**
- `ano_atual` (int): Ano atual
- `ano_anterior` (int): Ano para comparação
- `empreendimento_id` (int, opcional): Filtrar por empreendimento

**Response:**
```typescript
[
  {
    mes: number,           // 1-12
    vendas_ano_anterior: number,
    vendas_ano_atual: number,
    valor_ano_anterior: number,  // R$
    valor_ano_atual: number      // R$
  }
]
```

**Descrição:** Comparativo de vendas entre dois anos para gráfico de evolução

---

### 7. **Endpoint: `/dashboard/conversao-por-empreendimento`**

**Método:** `GET`

**Query Parameters:**
- `data_inicio` (datetime, opcional)
- `data_fim` (datetime, opcional)
- `limit` (int, opcional): Padrão 10

**Response:**
```typescript
[
  {
    empreendimento_id: number,
    empreendimento_nome: string,
    total_propostas: number,
    total_vendas: number,
    taxa_conversao: number,      // Percentual
    valor_propostas: number,     // R$
    valor_vendas: number         // R$
  }
]
```

**Descrição:** Taxa de conversão por empreendimento (propostas x vendas)

---

### 8. **Endpoint: `/dashboard/evolucao-ticket-medio`**

**Método:** `GET`

**Query Parameters:**
- `ano` (int, obrigatório)
- `empreendimento_id` (int, opcional)

**Response:**
```typescript
[
  {
    mes: number,                // 1-12
    ticket_medio_proposta: number,  // R$
    ticket_medio_venda: number,     // R$
    total_propostas: number,
    total_vendas: number
  }
]
```

**Descrição:** Evolução mensal do ticket médio de propostas e vendas

---

## 🟢 PRIORIDADE BAIXA - Melhorias nos Endpoints Existentes

### 9. **Endpoint `/vendas/` - Melhorias**

**Adicionar query parameter:**
- `order_by` (string): Campo para ordenação (padrão: `data_venda`)
- `order_dir` (string): Direção da ordenação (`asc` ou `desc`, padrão: `desc`)

**Descrição:** Permite ordenar as vendas por data (mais recentes primeiro) para a tabela de "Últimas Vendas"

---

### 10. **Endpoint `/vendas/{id}` - Melhorias**

**Adicionar ao response:**
- `empreendimento_nome` (string): Nome do empreendimento relacionado

**Descrição:** Evita necessidade de buscar o empreendimento separadamente ao exibir detalhes da venda

---

## 📊 Resumo de Prioridades

| Prioridade | Item | Endpoint | Status |
|------------|------|----------|--------|
| 🔴 ALTA | Conversão (R$) | `/dashboard/indicadores` | ❌ Não implementado |
| 🔴 ALTA | Valor Total Propostas | `/dashboard/indicadores` | ❌ Não implementado |
| 🔴 ALTA | Ticket Médio Proposta | `/dashboard/indicadores` | ❌ Não implementado |
| 🔴 ALTA | Meta VGV Mensal | `/dashboard/indicadores` | ❌ Não implementado |
| 🔴 ALTA | Meta VGV YTD | `/dashboard/indicadores` | ❌ Não implementado |
| 🟡 MÉDIA | Comparativo de Anos | `/dashboard/comparativo-anos` | ❌ Endpoint não existe |
| 🟡 MÉDIA | Conversão por Emp | `/dashboard/conversao-por-empreendimento` | ❌ Endpoint não existe |
| 🟡 MÉDIA | Evolução Ticket Médio | `/dashboard/evolucao-ticket-medio` | ❌ Endpoint não existe |
| 🟢 BAIXA | Ordenação Vendas | `/vendas/` | ⚠️ Melhoria |
| 🟢 BAIXA | Nome Empreendimento | `/vendas/{id}` | ⚠️ Melhoria |

---

## 🎯 Exemplo de Response Atualizado - `/dashboard/indicadores`

```json
{
  "total_propostas": 200,
  "total_vendas": 150,
  "valor_total_vendas": 80535283.0,
  "valor_total_propostas": 107380377.0,
  "ticket_medio": 536901.89,
  "ticket_medio_proposta": 536901.89,
  "taxa_conversao": 75.0,
  "taxa_conversao_valor": 75.0,
  "meta_vendas": 100000000.0,
  "percentual_meta": 80.5,
  "meta_vendas_mensal": 10000000.0,
  "percentual_meta_mensal": 85.3,
  "meta_vendas_ytd": 110000000.0,
  "percentual_meta_ytd": 73.2
}
```

---

## 📝 Notas de Implementação

1. **Metas:** As metas devem ser configuráveis via endpoint `/metas/` (já existe na API)
2. **Cálculos:** Todos os percentuais devem considerar divisão por zero
3. **Filtros:** Todos os endpoints devem respeitar os filtros de data e empreendimento
4. **Performance:** Considerar cache para queries pesadas (agregações)
5. **YTD:** Year to Date = do dia 01/01 do ano atual até hoje

---

## 🚀 Ordem de Implementação Sugerida

1. ✅ **Fase 1 (Crítico):** Adicionar campos ao `/dashboard/indicadores`
   - Permite que todos os 8 cards do dashboard funcionem corretamente

2. ⏳ **Fase 2 (Importante):** Criar `/dashboard/conversao-por-empreendimento`
   - Melhora análise de performance por empreendimento

3. ⏳ **Fase 3 (Desejável):** Criar `/dashboard/comparativo-anos` e `/dashboard/evolucao-ticket-medio`
   - Adiciona análises temporais mais profundas

4. ⏳ **Fase 4 (Opcional):** Melhorias nos endpoints existentes
   - Facilita uso mas não bloqueia funcionalidades

---

**Última atualização:** 2025-11-05
**Responsável Frontend:** Claude
**Aguardando:** Implementação Backend
