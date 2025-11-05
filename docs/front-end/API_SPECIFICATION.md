# 📘 LCP Dashboard API - Especificação para Front-End

**Versão:** 1.0.0
**Base URL:** `http://localhost:8000/api/v1`
**Autenticação:** JWT Bearer Token
**Formato:** JSON

---

## 🔐 Autenticação

### 1. Login
Autentica um usuário e retorna token JWT.

**Endpoint:** `POST /auth/login`
**Autenticação:** Não requerida

**Request Body:**
```json
{
  "email": "admin@lcp.com",
  "password": "senha123"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Como usar o token:**
```javascript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

### 2. Registrar Usuário
Cria um novo usuário no sistema.

**Endpoint:** `POST /auth/register`
**Autenticação:** Não requerida

**Request Body:**
```json
{
  "email": "usuario@exemplo.com",
  "nome": "Nome do Usuário",
  "password": "senha123",
  "is_admin": false
}
```

**Response (201):**
```json
{
  "id": 2,
  "email": "usuario@exemplo.com",
  "nome": "Nome do Usuário",
  "is_active": true,
  "is_admin": false,
  "created_at": "2025-11-05T14:30:00",
  "updated_at": "2025-11-05T14:30:00"
}
```

### 3. Obter Usuário Atual
Retorna dados do usuário autenticado.

**Endpoint:** `GET /auth/me`
**Autenticação:** Requerida

**Response (200):**
```json
{
  "id": 1,
  "email": "admin@lcp.com",
  "nome": "Admin LCP",
  "is_active": true,
  "is_admin": true,
  "created_at": "2025-11-05T10:51:29",
  "updated_at": "2025-11-05T10:51:29"
}
```

---

## 🏢 Empreendimentos

### 1. Listar Empreendimentos
Lista todos os empreendimentos com paginação.

**Endpoint:** `GET /empreendimentos`
**Autenticação:** Requerida

**Query Parameters:**
- `skip` (int, opcional): Registros a pular (padrão: 0)
- `limit` (int, opcional): Limite de registros (padrão: 100)

**Response (200):**
```json
[
  {
    "id": 1,
    "codigo_mega": 18056,
    "nome": "LOTEAMENTO JARDIM CRISTINA",
    "endereco": "Rua das Flores, 123",
    "cidade": "Joinville",
    "estado": "SC",
    "filial": "Matriz",
    "status": "Ativo",
    "data_lancamento": "2024-01-15",
    "total_unidades": 150,
    "unidades_disponiveis": 45,
    "unidades_vendidas": 105,
    "created_at": "2025-11-05T10:58:53",
    "updated_at": "2025-11-05T10:58:53"
  }
]
```

### 2. Detalhes de Empreendimento
Retorna detalhes de um empreendimento específico.

**Endpoint:** `GET /empreendimentos/{id}`
**Autenticação:** Requerida

**Path Parameters:**
- `id` (int): ID do empreendimento

**Response (200):**
```json
{
  "id": 1,
  "codigo_mega": 18056,
  "nome": "LOTEAMENTO JARDIM CRISTINA",
  "endereco": "Rua das Flores, 123",
  "cidade": "Joinville",
  "estado": "SC",
  "filial": "Matriz",
  "status": "Ativo",
  "data_lancamento": "2024-01-15",
  "total_unidades": 150,
  "unidades_disponiveis": 45,
  "unidades_vendidas": 105,
  "created_at": "2025-11-05T10:58:53",
  "updated_at": "2025-11-05T10:58:53"
}
```

### 3. Estatísticas de Empreendimento
Retorna estatísticas agregadas.

**Endpoint:** `GET /empreendimentos/stats`
**Autenticação:** Requerida

**Response (200):**
```json
{
  "total_empreendimentos": 104,
  "total_unidades": 15000,
  "unidades_disponiveis": 4500,
  "unidades_vendidas": 8500,
  "unidades_reservadas": 2000,
  "valor_total_vendas": 850000000.00,
  "ticket_medio": 100000.00
}
```

---

## 📋 Propostas

### 1. Listar Propostas
Lista todas as propostas com filtros.

**Endpoint:** `GET /propostas`
**Autenticação:** Requerida

**Query Parameters:**
- `skip` (int, opcional): Registros a pular (padrão: 0)
- `limit` (int, opcional): Limite de registros (padrão: 100)
- `empreendimento_id` (int, opcional): Filtrar por empreendimento
- `status` (string, opcional): Filtrar por status ("Aberta", "Aprovada", "Reprovada", "Cancelada")

**Response (200):**
```json
[
  {
    "id": 1,
    "codigo_mega": 50001,
    "empreendimento_id": 1,
    "empreendimento_nome": "LOTEAMENTO JARDIM CRISTINA",
    "cliente_nome": "João da Silva",
    "cliente_cpf": "123.456.789-00",
    "unidade": "Lote 45",
    "bloco": "Quadra A",
    "valor_proposta": 250000.00,
    "data_proposta": "2025-10-15T14:30:00",
    "status": "Aprovada",
    "vendedor": "Maria Santos",
    "created_at": "2025-10-15T14:30:00",
    "updated_at": "2025-10-16T10:00:00"
  }
]
```

### 2. Detalhes de Proposta
Retorna detalhes de uma proposta específica.

**Endpoint:** `GET /propostas/{id}`
**Autenticação:** Requerida

**Path Parameters:**
- `id` (int): ID da proposta

**Response (200):**
```json
{
  "id": 1,
  "codigo_mega": 50001,
  "empreendimento_id": 1,
  "empreendimento_nome": "LOTEAMENTO JARDIM CRISTINA",
  "cliente_nome": "João da Silva",
  "cliente_cpf": "123.456.789-00",
  "unidade": "Lote 45",
  "bloco": "Quadra A",
  "valor_proposta": 250000.00,
  "data_proposta": "2025-10-15T14:30:00",
  "status": "Aprovada",
  "vendedor": "Maria Santos",
  "created_at": "2025-10-15T14:30:00",
  "updated_at": "2025-10-16T10:00:00"
}
```

### 3. Propostas por Empreendimento
Lista propostas de um empreendimento específico.

**Endpoint:** `GET /propostas/por-empreendimento/{empreendimento_id}`
**Autenticação:** Requerida

**Path Parameters:**
- `empreendimento_id` (int): ID do empreendimento

**Response (200):**
```json
[
  {
    "id": 1,
    "codigo_mega": 50001,
    "cliente_nome": "João da Silva",
    "unidade": "Lote 45",
    "valor_proposta": 250000.00,
    "status": "Aprovada"
  }
]
```

---

## 💰 Vendas

### 1. Listar Vendas
Lista todas as vendas com filtros.

**Endpoint:** `GET /vendas`
**Autenticação:** Requerida

**Query Parameters:**
- `skip` (int, opcional): Registros a pular (padrão: 0)
- `limit` (int, opcional): Limite de registros (padrão: 100)
- `empreendimento_id` (int, opcional): Filtrar por empreendimento
- `status` (string, opcional): Filtrar por status ("Ativa", "Cancelada", "Distratada")
- `data_inicio` (date, opcional): Data início (formato: YYYY-MM-DD)
- `data_fim` (date, opcional): Data fim (formato: YYYY-MM-DD)

**Response (200):**
```json
[
  {
    "id": 1,
    "codigo_mega": 60001,
    "empreendimento_id": 1,
    "empreendimento_nome": "LOTEAMENTO JARDIM CRISTINA",
    "cliente_nome": "Maria Oliveira",
    "unidade": "Lote 23",
    "bloco": "Quadra B",
    "valor_venda": 320000.00,
    "data_venda": "2025-11-01T10:00:00",
    "status": "Ativa",
    "forma_pagamento": "Financiamento",
    "created_at": "2025-11-01T10:00:00",
    "updated_at": "2025-11-01T10:00:00"
  }
]
```

### 2. Detalhes de Venda
Retorna detalhes de uma venda específica.

**Endpoint:** `GET /vendas/{id}`
**Autenticação:** Requerida

**Path Parameters:**
- `id` (int): ID da venda

**Response (200):**
```json
{
  "id": 1,
  "codigo_mega": 60001,
  "empreendimento_id": 1,
  "empreendimento_nome": "LOTEAMENTO JARDIM CRISTINA",
  "cliente_nome": "Maria Oliveira",
  "unidade": "Lote 23",
  "bloco": "Quadra B",
  "valor_venda": 320000.00,
  "data_venda": "2025-11-01T10:00:00",
  "status": "Ativa",
  "forma_pagamento": "Financiamento",
  "created_at": "2025-11-01T10:00:00",
  "updated_at": "2025-11-01T10:00:00"
}
```

### 3. Vendas por Empreendimento
Lista vendas de um empreendimento específico.

**Endpoint:** `GET /vendas/por-empreendimento/{empreendimento_id}`
**Autenticação:** Requerida

**Path Parameters:**
- `empreendimento_id` (int): ID do empreendimento

**Response (200):**
```json
[
  {
    "id": 1,
    "codigo_mega": 60001,
    "cliente_nome": "Maria Oliveira",
    "unidade": "Lote 23",
    "valor_venda": 320000.00,
    "data_venda": "2025-11-01",
    "status": "Ativa"
  }
]
```

---

## 📊 Dashboard

### 1. Top Empreendimentos
Retorna empreendimentos com mais vendas.

**Endpoint:** `GET /dashboard/top-empreendimentos`
**Autenticação:** Requerida

**Query Parameters:**
- `limit` (int, opcional): Limite de registros (padrão: 10)

**Response (200):**
```json
[
  {
    "empreendimento_id": 1,
    "empreendimento_nome": "LOTEAMENTO JARDIM CRISTINA",
    "total_vendas": 105,
    "valor_total": 33600000.00,
    "ticket_medio": 320000.00
  }
]
```

### 2. Vendas por Período
Retorna vendas agrupadas por período.

**Endpoint:** `GET /dashboard/vendas-por-periodo`
**Autenticação:** Requerida

**Query Parameters:**
- `data_inicio` (date, opcional): Data início (formato: YYYY-MM-DD)
- `data_fim` (date, opcional): Data fim (formato: YYYY-MM-DD)
- `agrupamento` (string, opcional): "dia", "semana", "mes" (padrão: "mes")

**Response (200):**
```json
[
  {
    "periodo": "2025-11",
    "total_vendas": 45,
    "valor_total": 14400000.00,
    "ticket_medio": 320000.00
  },
  {
    "periodo": "2025-10",
    "total_vendas": 38,
    "valor_total": 12160000.00,
    "ticket_medio": 320000.00
  }
]
```

### 3. KPIs Gerais
Retorna indicadores chave de performance.

**Endpoint:** `GET /dashboard/kpis`
**Autenticação:** Requerida

**Response (200):**
```json
{
  "vendas_mes_atual": {
    "quantidade": 45,
    "valor_total": 14400000.00,
    "variacao_mes_anterior": 18.4
  },
  "propostas_abertas": {
    "quantidade": 78,
    "valor_total": 24960000.00
  },
  "taxa_conversao": {
    "percentual": 57.6,
    "propostas_aprovadas": 120,
    "total_propostas": 208
  },
  "ticket_medio": {
    "valor": 320000.00,
    "variacao_mes_anterior": -2.3
  },
  "empreendimentos_ativos": 104,
  "unidades_disponiveis": 4500
}
```

### 4. Resumo Geral
Retorna resumo completo do dashboard.

**Endpoint:** `GET /dashboard`
**Autenticação:** Requerida

**Response (200):**
```json
{
  "kpis": {
    "total_empreendimentos": 104,
    "total_vendas_mes": 45,
    "valor_vendas_mes": 14400000.00,
    "propostas_abertas": 78,
    "taxa_conversao": 57.6
  },
  "top_empreendimentos": [
    {
      "nome": "LOTEAMENTO JARDIM CRISTINA",
      "vendas": 105,
      "valor": 33600000.00
    }
  ],
  "vendas_por_mes": [
    {
      "mes": "2025-11",
      "vendas": 45,
      "valor": 14400000.00
    }
  ]
}
```

---

## 🎯 Metas

### 1. Listar Metas
Lista todas as metas cadastradas.

**Endpoint:** `GET /metas`
**Autenticação:** Requerida

**Query Parameters:**
- `ativo` (bool, opcional): Filtrar metas ativas

**Response (200):**
```json
[
  {
    "id": 1,
    "nome": "Meta Vendas Q1 2025",
    "tipo": "vendas",
    "valor_meta": 50000000.00,
    "valor_realizado": 33600000.00,
    "percentual_atingido": 67.2,
    "periodo_inicio": "2025-01-01",
    "periodo_fim": "2025-03-31",
    "ativo": true,
    "created_at": "2025-01-01T00:00:00",
    "updated_at": "2025-11-05T15:00:00"
  }
]
```

### 2. Criar Meta
Cria uma nova meta.

**Endpoint:** `POST /metas`
**Autenticação:** Requerida (Admin)

**Request Body:**
```json
{
  "nome": "Meta Vendas Q1 2025",
  "tipo": "vendas",
  "valor_meta": 50000000.00,
  "periodo_inicio": "2025-01-01",
  "periodo_fim": "2025-03-31",
  "ativo": true
}
```

**Response (201):**
```json
{
  "id": 1,
  "nome": "Meta Vendas Q1 2025",
  "tipo": "vendas",
  "valor_meta": 50000000.00,
  "valor_realizado": 0.00,
  "percentual_atingido": 0.0,
  "periodo_inicio": "2025-01-01",
  "periodo_fim": "2025-03-31",
  "ativo": true
}
```

### 3. Atualizar Meta
Atualiza uma meta existente.

**Endpoint:** `PUT /metas/{id}`
**Autenticação:** Requerida (Admin)

**Request Body:**
```json
{
  "valor_meta": 60000000.00,
  "ativo": true
}
```

### 4. Deletar Meta
Remove uma meta.

**Endpoint:** `DELETE /metas/{id}`
**Autenticação:** Requerida (Admin)

**Response (204):** Sem conteúdo

---

## 🔄 Sincronização

### 1. Sincronizar Empreendimentos
Sincroniza empreendimentos das APIs externas.

**Endpoint:** `POST /sync/empreendimentos`
**Autenticação:** Requerida (Admin)

**Response (200):**
```json
{
  "status": "sucesso",
  "mensagem": "Sincronização concluída",
  "criados": 5,
  "atualizados": 99,
  "erros": 0,
  "tempo_execucao": 12
}
```

### 2. Sincronizar Propostas e Vendas
Sincroniza propostas e vendas das APIs externas.

**Endpoint:** `POST /sync/propostas-vendas`
**Autenticação:** Requerida (Admin)

**Response (200):**
```json
{
  "status": "sucesso",
  "mensagem": "Sincronização concluída",
  "propostas_criadas": 25,
  "propostas_atualizadas": 10,
  "vendas_criadas": 15,
  "vendas_atualizadas": 5,
  "erros": 0,
  "tempo_execucao": 45
}
```

### 3. Sincronização Completa
Executa sincronização completa (empreendimentos + propostas + vendas).

**Endpoint:** `POST /sync/full`
**Autenticação:** Requerida (Admin)

**Response (200):**
```json
{
  "status": "sucesso",
  "empreendimentos": {
    "criados": 5,
    "atualizados": 99
  },
  "propostas": {
    "criadas": 25,
    "atualizadas": 10
  },
  "vendas": {
    "criadas": 15,
    "atualizadas": 5
  }
}
```

### 4. Status da Sincronização
Retorna status da última sincronização.

**Endpoint:** `GET /sync/status`
**Autenticação:** Requerida

**Response (200):**
```json
{
  "logs": [
    {
      "id": 1,
      "tipo_sync": "full",
      "status": "sucesso",
      "total_registros": 154,
      "registros_criados": 45,
      "registros_atualizados": 109,
      "registros_erro": 0,
      "tempo_execucao_segundos": 57,
      "mensagem": "Sincronização completa: 154 registros",
      "data_inicio": "2025-11-05T10:58:00",
      "data_fim": "2025-11-05T10:58:57"
    }
  ]
}
```

---

## 📤 Exportação

### 1. Exportar Empreendimentos (Excel)
Exporta lista de empreendimentos em formato Excel.

**Endpoint:** `GET /export/empreendimentos/excel`
**Autenticação:** Requerida

**Response:** Arquivo `.xlsx`

**Headers:**
```
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
Content-Disposition: attachment; filename=empreendimentos_2025-11-05.xlsx
```

### 2. Exportar Empreendimentos (CSV)
Exporta lista de empreendimentos em formato CSV.

**Endpoint:** `GET /export/empreendimentos/csv`
**Autenticação:** Requerida

**Response:** Arquivo `.csv`

**Headers:**
```
Content-Type: text/csv
Content-Disposition: attachment; filename=empreendimentos_2025-11-05.csv
```

### 3. Exportar Propostas (Excel)
Exporta lista de propostas em formato Excel.

**Endpoint:** `GET /export/propostas/excel`
**Autenticação:** Requerida

**Query Parameters:**
- `empreendimento_id` (int, opcional): Filtrar por empreendimento
- `data_inicio` (date, opcional): Data início
- `data_fim` (date, opcional): Data fim

**Response:** Arquivo `.xlsx`

### 4. Exportar Vendas (Excel)
Exporta lista de vendas em formato Excel.

**Endpoint:** `GET /export/vendas/excel`
**Autenticação:** Requerida

**Query Parameters:**
- `empreendimento_id` (int, opcional): Filtrar por empreendimento
- `data_inicio` (date, opcional): Data início
- `data_fim` (date, opcional): Data fim

**Response:** Arquivo `.xlsx`

---

## 🔴 Tratamento de Erros

### Códigos de Status HTTP

| Código | Descrição |
|--------|-----------|
| 200 | Sucesso |
| 201 | Criado com sucesso |
| 204 | Sem conteúdo (operação bem-sucedida) |
| 400 | Requisição inválida |
| 401 | Não autenticado |
| 403 | Acesso negado |
| 404 | Recurso não encontrado |
| 422 | Erro de validação |
| 500 | Erro interno do servidor |

### Formato de Erro Padrão

```json
{
  "detail": "Mensagem de erro descritiva"
}
```

### Exemplo de Erro de Validação (422)

```json
{
  "detail": [
    {
      "type": "missing",
      "loc": ["body", "email"],
      "msg": "Field required",
      "input": {}
    }
  ]
}
```

---

## 📋 Modelos de Dados

### Empreendimento
```typescript
interface Empreendimento {
  id: number;
  codigo_mega: number;
  nome: string;
  endereco?: string | null;
  cidade?: string | null;
  estado?: string | null;
  filial?: string | null;
  status: string;
  data_lancamento?: string | null;
  total_unidades: number;
  unidades_disponiveis: number;
  unidades_vendidas: number;
  created_at: string;
  updated_at: string;
}
```

### Proposta
```typescript
interface Proposta {
  id: number;
  codigo_mega: number;
  empreendimento_id: number;
  empreendimento_nome?: string;
  cliente_nome: string;
  cliente_cpf?: string | null;
  unidade: string;
  bloco: string;
  valor_proposta: number;
  data_proposta: string;
  status: string;
  vendedor?: string | null;
  created_at: string;
  updated_at: string;
}
```

### Venda
```typescript
interface Venda {
  id: number;
  codigo_mega: number;
  empreendimento_id: number;
  empreendimento_nome?: string;
  cliente_nome: string;
  unidade: string;
  bloco: string;
  valor_venda: number;
  data_venda: string;
  status: string;
  forma_pagamento?: string | null;
  created_at: string;
  updated_at: string;
}
```

### Meta
```typescript
interface Meta {
  id: number;
  nome: string;
  tipo: string;
  valor_meta: number;
  valor_realizado: number;
  percentual_atingido: number;
  periodo_inicio: string;
  periodo_fim: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}
```

---

## 🔧 Exemplos de Uso (JavaScript/TypeScript)

### Autenticação e Requisição Básica

```javascript
// 1. Login
const loginResponse = await fetch('http://localhost:8000/api/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'admin@lcp.com',
    password: 'senha123'
  })
});

const { access_token } = await loginResponse.json();

// 2. Usar o token em requisições
const empreendimentosResponse = await fetch('http://localhost:8000/api/v1/empreendimentos', {
  headers: {
    'Authorization': `Bearer ${access_token}`,
    'Content-Type': 'application/json'
  }
});

const empreendimentos = await empreendimentosResponse.json();
```

### Hook React para Autenticação

```typescript
import { useState, useEffect } from 'react';

interface AuthContext {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export const useAuth = (): AuthContext => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );

  const login = async (email: string, password: string) => {
    const response = await fetch('http://localhost:8000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    setToken(data.access_token);
    localStorage.setItem('token', data.access_token);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  return {
    token,
    login,
    logout,
    isAuthenticated: !!token
  };
};
```

### Service para API

```typescript
class LCPApiService {
  private baseURL = 'http://localhost:8000/api/v1';
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers
      }
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Empreendimentos
  async getEmpreendimentos(skip = 0, limit = 100) {
    return this.request<Empreendimento[]>(
      `/empreendimentos?skip=${skip}&limit=${limit}`
    );
  }

  async getEmpreendimento(id: number) {
    return this.request<Empreendimento>(`/empreendimentos/${id}`);
  }

  // Vendas
  async getVendas(filters?: {
    skip?: number;
    limit?: number;
    empreendimento_id?: number;
    data_inicio?: string;
    data_fim?: string;
  }) {
    const params = new URLSearchParams(
      Object.entries(filters || {}).map(([k, v]) => [k, String(v)])
    );
    return this.request<Venda[]>(`/vendas?${params}`);
  }

  // Dashboard
  async getDashboardKPIs() {
    return this.request<any>('/dashboard/kpis');
  }

  async getTopEmpreendimentos(limit = 10) {
    return this.request<any[]>(`/dashboard/top-empreendimentos?limit=${limit}`);
  }
}

export const api = new LCPApiService();
```

---

## 📝 Notas Importantes

1. **Ambiente de Desenvolvimento:**
   - Base URL: `http://localhost:8000/api/v1`
   - Swagger/OpenAPI: `http://localhost:8000/docs`

2. **Autenticação:**
   - Todos os endpoints (exceto `/auth/login` e `/auth/register`) requerem autenticação
   - Token JWT expira em 24 horas
   - Incluir header: `Authorization: Bearer {token}`

3. **Paginação:**
   - Padrão: `skip=0`, `limit=100`
   - Máximo de 1000 registros por requisição

4. **Datas:**
   - Formato ISO 8601: `YYYY-MM-DDTHH:mm:ss`
   - Filtros de data usam formato: `YYYY-MM-DD`

5. **Valores Monetários:**
   - Retornados como `number` (float)
   - Sempre em Reais (BRL)

6. **CORS:**
   - Configurado para aceitar requisições de `http://localhost:3000` (React)

---

**Última atualização:** 2025-11-05
**Versão da API:** 1.0.0
**Contato:** desenvolvimento@lcp.com
