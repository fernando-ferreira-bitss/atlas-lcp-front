# 📘 LCP Dashboard API - Especificação Completa

**Versão:** 1.0.0
**Base URL:** `http://localhost:8000/api/v1`
**Autenticação:** JWT Bearer Token
**Formato:** JSON
**Última atualização:** 2025-11-05

---

## 📋 Índice

1. [Autenticação](#-autenticação)
2. [Dashboard](#-dashboard)
3. [Empreendimentos](#-empreendimentos)
4. [Propostas](#-propostas)
5. [Vendas](#-vendas)
6. [Metas](#-metas)
7. [Sincronização](#-sincronização)
8. [Exportação](#-exportação)
9. [Tratamento de Erros](#-tratamento-de-erros)
10. [Modelos de Dados](#-modelos-de-dados)
11. [Exemplos de Código](#-exemplos-de-código)

---

## 🔐 Autenticação

Todos os endpoints (exceto `/auth/login` e `/auth/register`) requerem autenticação via JWT Bearer token.

### Como autenticar:

```javascript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

### 1. POST /auth/login

Autentica um usuário e retorna token JWT.

**Autenticação:** Não requerida

**Request Body:**
```json
{
  "email": "admin@lcp.com",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Erros:**
- 401: Credenciais inválidas
- 403: Usuário inativo

---

### 2. GET /auth/me

Retorna dados do usuário autenticado.

**Autenticação:** Requerida

**Response (200):**
```json
{
  "id": 1,
  "email": "admin@lcp.com",
  "nome": "Admin LCP",
  "is_active": true,
  "is_admin": true,
  "created_at": "2025-11-05T10:51:29.913518",
  "updated_at": "2025-11-05T15:00:21.934091"
}
```

---

### 3. POST /auth/register

Registra um novo usuário.

**Autenticação:** Não requerida

**Request Body:**
```json
{
  "email": "usuario@exemplo.com",
  "nome": "Nome do Usuário",
  "password": "admin123",
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

**Erros:**
- 400: Email já cadastrado

---

### 4. GET /auth/users

Lista todos os usuários do sistema.

**Autenticação:** Requerida (Admin apenas)

**Query Parameters (opcionais):**
- `skip` (int): Número de registros para pular (padrão: 0)
- `limit` (int): Número máximo de registros (padrão: 100)

**Response (200):**
```json
[
  {
    "id": 1,
    "email": "admin@lcp.com",
    "nome": "Admin LCP",
    "is_active": true,
    "is_admin": true,
    "created_at": "2025-11-05T10:51:29.913518",
    "updated_at": "2025-11-05T15:00:21.934091"
  },
  {
    "id": 2,
    "email": "test_user@lcp.com",
    "nome": "Test User",
    "is_active": true,
    "is_admin": false,
    "created_at": "2025-11-05T15:43:00.451846",
    "updated_at": "2025-11-05T15:43:00.451849"
  }
]
```

**Erros:**
- 401: Não autenticado
- 403: Não é administrador

---

### 5. GET /auth/users/{user_id}

Retorna dados de um usuário específico por ID.

**Autenticação:** Requerida (Admin apenas)

**Path Parameters:**
- `user_id` (int): ID do usuário

**Response (200):**
```json
{
  "id": 2,
  "email": "test_user@lcp.com",
  "nome": "Test User",
  "is_active": true,
  "is_admin": false,
  "created_at": "2025-11-05T15:43:00.451846",
  "updated_at": "2025-11-05T15:43:00.451849"
}
```

**Erros:**
- 401: Não autenticado
- 403: Não é administrador
- 404: Usuário não encontrado

---

### 6. PUT /auth/users/{user_id}

Atualiza dados de um usuário.

**Autenticação:** Requerida (Admin apenas)

**Path Parameters:**
- `user_id` (int): ID do usuário

**Request Body (todos os campos são opcionais):**
```json
{
  "nome": "Nome Atualizado",
  "email": "novo_email@exemplo.com",
  "password": "novasenha123",
  "is_active": true,
  "is_admin": false
}
```

**Response (200):**
```json
{
  "id": 2,
  "email": "novo_email@exemplo.com",
  "nome": "Nome Atualizado",
  "is_active": true,
  "is_admin": false,
  "created_at": "2025-11-05T15:43:00.451846",
  "updated_at": "2025-11-05T15:43:02.399401"
}
```

**Erros:**
- 400: Email já existe
- 401: Não autenticado
- 403: Não é administrador
- 404: Usuário não encontrado

---

### 7. POST /auth/users/{user_id}/activate

Ativa uma conta de usuário.

**Autenticação:** Requerida (Admin apenas)

**Path Parameters:**
- `user_id` (int): ID do usuário

**Response (200):**
```json
{
  "id": 2,
  "email": "test_user@lcp.com",
  "nome": "Test User Updated",
  "is_active": true,
  "is_admin": false,
  "created_at": "2025-11-05T15:43:00.451846",
  "updated_at": "2025-11-05T15:43:10.037971"
}
```

**Erros:**
- 401: Não autenticado
- 403: Não é administrador
- 404: Usuário não encontrado

---

### 8. POST /auth/users/{user_id}/deactivate

Desativa uma conta de usuário (soft delete).

**⚠️ IMPORTANTE:** Este endpoint **NÃO deleta o usuário do banco de dados**. Apenas define `is_active=False`, impedindo o login mas mantendo todos os dados históricos.

**Autenticação:** Requerida (Admin apenas)

**Path Parameters:**
- `user_id` (int): ID do usuário

**Response (200):**
```json
{
  "id": 2,
  "email": "test_user@lcp.com",
  "nome": "Test User Updated",
  "is_active": false,
  "is_admin": false,
  "created_at": "2025-11-05T15:43:00.451846",
  "updated_at": "2025-11-05T15:43:07.958743"
}
```

**Comportamento:**
- Usuário desativado não pode fazer login (retorna 403 Forbidden)
- Usuário permanece no banco de dados
- Pode ser reativado com `/auth/users/{user_id}/activate`

**Erros:**
- 401: Não autenticado
- 403: Não é administrador
- 404: Usuário não encontrado

---

### 9. POST /auth/change-password

Permite ao usuário mudar sua própria senha.

**Autenticação:** Requerida

**Request Body:**
```json
{
  "current_password": "senha_atual",
  "new_password": "nova_senha123"
}
```

**Response (200):**
```json
{
  "id": 2,
  "email": "test_user@lcp.com",
  "nome": "Test User Updated",
  "is_active": true,
  "is_admin": false,
  "created_at": "2025-11-05T15:43:00.451846",
  "updated_at": "2025-11-05T15:43:03.888525"
}
```

**Validações:**
- Senha atual deve estar correta
- Nova senha deve ter pelo menos 8 caracteres

**Erros:**
- 400: Senha atual incorreta
- 401: Não autenticado
- 404: Usuário não encontrado

---

### 10. POST /auth/users/{user_id}/reset-password

Reset de senha por administrador (não requer senha atual).

**Autenticação:** Requerida (Admin apenas)

**Path Parameters:**
- `user_id` (int): ID do usuário

**Request Body:**
```json
{
  "new_password": "senha_resetada123"
}
```

**Response (200):**
```json
{
  "id": 2,
  "email": "test_user@lcp.com",
  "nome": "Test User Updated",
  "is_active": true,
  "is_admin": false,
  "created_at": "2025-11-05T15:43:00.451846",
  "updated_at": "2025-11-05T15:43:06.142368"
}
```

**Diferença entre change-password e reset-password:**
- `change-password`: Usuário muda própria senha, requer senha atual
- `reset-password`: Admin reseta senha de qualquer usuário, não requer senha atual

**Erros:**
- 401: Não autenticado
- 403: Não é administrador
- 404: Usuário não encontrado

---

## 📊 Dashboard

### 1. GET /dashboard/indicadores

Retorna indicadores principais (KPIs) do dashboard.

**Autenticação:** Requerida

**Query Parameters (opcionais):**
- `data_inicio` (datetime): Data início para filtro
- `data_fim` (datetime): Data fim para filtro
- `empreendimento_id` (int): Filtrar por empreendimento específico

**Response (200):**
```json
{
  "total_propostas": 200,
  "total_vendas": 150,
  "valor_total_vendas": 80535283.0,
  "ticket_medio": 536901.89,
  "taxa_conversao": 75.0,
  "meta_vendas": 0.0,
  "percentual_meta": 0.0
}
```

**Exemplo de uso:**
```javascript
const response = await fetch('/api/v1/dashboard/indicadores?data_inicio=2025-01-01&data_fim=2025-12-31', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const indicadores = await response.json();
```

---

### 2. GET /dashboard/grafico-vendas-mes

Retorna dados de vendas agrupadas por mês para gráficos.

**Autenticação:** Requerida

**Query Parameters:**
- `ano` (int, **obrigatório**): Ano para o gráfico
- `empreendimento_id` (int, opcional): Filtrar por empreendimento

**Response (200):**
```json
[
  {
    "mes": 1,
    "total_vendas": 0,
    "valor_vendas": 0.0,
    "meta_vendas": 0.0
  },
  {
    "mes": 7,
    "total_vendas": 32,
    "valor_vendas": 17699889.0,
    "meta_vendas": 0.0
  },
  {
    "mes": 8,
    "total_vendas": 47,
    "valor_vendas": 25445436.0,
    "meta_vendas": 0.0
  }
]
```

**Exemplo de uso:**
```javascript
const response = await fetch('/api/v1/dashboard/grafico-vendas-mes?ano=2025', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const vendas = await response.json();
```

---

### 3. GET /dashboard/top-empreendimentos

Retorna os empreendimentos com mais vendas.

**Autenticação:** Requerida

**Query Parameters (opcionais):**
- `data_inicio` (datetime): Data início para filtro
- `data_fim` (datetime): Data fim para filtro
- `limit` (int): Limite de registros (padrão: 5, máx: 20)

**Response (200):**
```json
[
  {
    "empreendimento_id": 84,
    "empreendimento_nome": "LOTEAMENTO NOVA BARRA VELHA (BARRA VELHA)",
    "total_vendas": 6,
    "valor_vendas": 3090617.0
  },
  {
    "empreendimento_id": 3,
    "empreendimento_nome": "- COMPLEXO BELEM - MATRÍCULA 11.365  (CASA) (SAO BENTO DO SUL)",
    "total_vendas": 4,
    "valor_vendas": 2907806.0
  }
]
```

---

### 4. GET /dashboard/ultimas-vendas

Retorna as últimas vendas realizadas para exibir em tabela.

**Autenticação:** Requerida

**Query Parameters (opcionais):**
- `limit` (int): Quantidade de vendas (padrão: 10, máx: 50)
- `empreendimento_id` (int): Filtrar por empreendimento

**Response (200):**
```json
[
  {
    "id": 115,
    "codigo_mega": 60115,
    "empreendimento_nome": "LOTEAMENTO NOVA BARRA VELHA (BARRA VELHA)",
    "cliente_nome": "Tatiane Andrade",
    "unidade": "Lote 117",
    "valor_venda": 230746.0,
    "data_venda": "2025-11-05T13:11:11.774398",
    "status": "Ativa",
    "forma_pagamento": "Consórcio"
  }
]
```

---

### 5. GET /dashboard/vendas-por-status

Retorna distribuição de vendas por status para gráficos.

**Autenticação:** Requerida

**Query Parameters (opcionais):**
- `data_inicio` (datetime): Data início
- `data_fim` (datetime): Data fim
- `empreendimento_id` (int): Filtrar por empreendimento

**Response (200):**
```json
[
  {
    "status": "Ativa",
    "total": 56,
    "valor_total": 28367281.0,
    "percentual": 37.33
  },
  {
    "status": "Distratada",
    "total": 48,
    "valor_total": 25297624.0,
    "percentual": 32.0
  },
  {
    "status": "Cancelada",
    "total": 46,
    "valor_total": 26870378.0,
    "percentual": 30.67
  }
]
```

---

### 6. GET /dashboard/vendas-por-forma-pagamento

Retorna distribuição de vendas por forma de pagamento para gráficos.

**Autenticação:** Requerida

**Query Parameters (opcionais):**
- `data_inicio` (datetime): Data início
- `data_fim` (datetime): Data fim
- `empreendimento_id` (int): Filtrar por empreendimento

**Response (200):**
```json
[
  {
    "forma_pagamento": "Consórcio",
    "total": 32,
    "valor_total": 15873779.0,
    "percentual": 21.33
  },
  {
    "forma_pagamento": "Financiamento",
    "total": 28,
    "valor_total": 14000000.0,
    "percentual": 18.67
  }
]
```

---

### 7. GET /dashboard/funil-conversao

Retorna dados do funil de conversão (propostas → vendas).

**Autenticação:** Requerida

**Query Parameters (opcionais):**
- `data_inicio` (datetime): Data início
- `data_fim` (datetime): Data fim
- `empreendimento_id` (int): Filtrar por empreendimento

**Response (200):**
```json
{
  "propostas_totais": 200,
  "propostas_em_analise": 41,
  "propostas_aprovadas": 34,
  "vendas_concluidas": 56,
  "taxa_conversao_proposta_venda": 28.0,
  "taxa_conversao_analise_aprovacao": 17.0
}
```

---

### 8. GET /dashboard/vendas-por-vendedor

Retorna ranking de vendedores por performance.

**Autenticação:** Requerida

**Query Parameters (opcionais):**
- `data_inicio` (datetime): Data início
- `data_fim` (datetime): Data fim
- `limit` (int): Quantidade de vendedores (padrão: 10, máx: 50)

**Response (200):**
```json
[
  {
    "vendedor": "João Silva",
    "total_vendas": 25,
    "valor_total": 12500000.0,
    "ticket_medio": 500000.0
  },
  {
    "vendedor": "Maria Santos",
    "total_vendas": 18,
    "valor_total": 9000000.0,
    "ticket_medio": 500000.0
  }
]
```

---

## 🏢 Empreendimentos

### 1. GET /empreendimentos/

Lista todos os empreendimentos com paginação.

**Autenticação:** Requerida

**Query Parameters (opcionais):**
- `skip` (int): Registros a pular (padrão: 0)
- `limit` (int): Limite de registros (padrão: 100)

**Response (200):**
```json
[
  {
    "id": 55,
    "codigo_mega": 18056,
    "nome": "CASA NOVA BARRA VELHA",
    "endereco": null,
    "cidade": null,
    "estado": null,
    "filial": null,
    "status": "Ativo",
    "data_lancamento": null,
    "total_unidades": 0,
    "unidades_disponiveis": 0,
    "unidades_vendidas": 0,
    "created_at": "2025-11-05T10:58:53.730176",
    "updated_at": "2025-11-05T10:58:53.730181"
  }
]
```

---

### 2. GET /empreendimentos/{id}

Retorna detalhes de um empreendimento específico.

**Autenticação:** Requerida

**Path Parameters:**
- `id` (int): ID do empreendimento

**Response (200):**
```json
{
  "id": 55,
  "codigo_mega": 18056,
  "nome": "CASA NOVA BARRA VELHA",
  "endereco": null,
  "cidade": null,
  "estado": null,
  "filial": null,
  "status": "Ativo",
  "data_lancamento": null,
  "total_unidades": 0,
  "unidades_disponiveis": 0,
  "unidades_vendidas": 0,
  "created_at": "2025-11-05T10:58:53.730176",
  "updated_at": "2025-11-05T10:58:53.730181"
}
```

**Erros:**
- 404: Empreendimento não encontrado

---

## 📋 Propostas

### 1. GET /propostas/

Lista todas as propostas com filtros.

**Autenticação:** Requerida

**Query Parameters (opcionais):**
- `skip` (int): Registros a pular (padrão: 0)
- `limit` (int): Limite de registros (padrão: 100)
- `empreendimento_id` (int): Filtrar por empreendimento
- `status` (string): Filtrar por status
- `data_inicio` (datetime): Data início
- `data_fim` (datetime): Data fim

**Response (200):**
```json
[
  {
    "id": 154,
    "codigo_mega": 50154,
    "empreendimento_id": 52,
    "cliente_nome": "Paulo Ramos",
    "cliente_cpf": "400.500.600-22",
    "unidade": "Lote 197",
    "bloco": "Quadra D",
    "valor_proposta": "776122.00",
    "data_proposta": "2025-11-03T13:11:11.101234",
    "status": "Em Análise",
    "origem": null,
    "vendedor": "Juliana Martins",
    "observacoes": null,
    "created_at": "2025-11-05T13:11:11.107782",
    "updated_at": "2025-11-05T13:11:11.107782"
  }
]
```

---

### 2. GET /propostas/{id}

Retorna detalhes de uma proposta específica.

**Autenticação:** Requerida

**Path Parameters:**
- `id` (int): ID da proposta

**Response (200):**
```json
{
  "id": 154,
  "codigo_mega": 50154,
  "empreendimento_id": 52,
  "cliente_nome": "Paulo Ramos",
  "cliente_cpf": "400.500.600-22",
  "unidade": "Lote 197",
  "bloco": "Quadra D",
  "valor_proposta": "776122.00",
  "data_proposta": "2025-11-03T13:11:11.101234",
  "status": "Em Análise",
  "origem": null,
  "vendedor": "Juliana Martins",
  "observacoes": null,
  "created_at": "2025-11-05T13:11:11.107782",
  "updated_at": "2025-11-05T13:11:11.107782"
}
```

**Erros:**
- 404: Proposta não encontrada

---

## 💰 Vendas

### 1. GET /vendas/

Lista todas as vendas com filtros.

**Autenticação:** Requerida

**Query Parameters (opcionais):**
- `skip` (int): Registros a pular (padrão: 0)
- `limit` (int): Limite de registros (padrão: 100)
- `empreendimento_id` (int): Filtrar por empreendimento
- `status` (string): Filtrar por status
- `data_inicio` (datetime): Data início
- `data_fim` (datetime): Data fim

**Response (200):**
```json
[
  {
    "id": 115,
    "codigo_mega": 60115,
    "empreendimento_id": 84,
    "proposta_id": null,
    "cliente_nome": "Tatiane Andrade",
    "cliente_cpf": null,
    "unidade": "Lote 117",
    "bloco": "Quadra D",
    "valor_venda": "230746.00",
    "data_venda": "2025-11-05T13:11:11.774398",
    "status": "Ativa",
    "forma_pagamento": "Consórcio",
    "vendedor": null,
    "observacoes": null,
    "created_at": "2025-11-05T13:11:12.282801",
    "updated_at": "2025-11-05T13:11:12.282801"
  }
]
```

---

### 2. GET /vendas/{id}

Retorna detalhes de uma venda específica.

**Autenticação:** Requerida

**Path Parameters:**
- `id` (int): ID da venda

**Response (200):**
```json
{
  "id": 115,
  "codigo_mega": 60115,
  "empreendimento_id": 84,
  "proposta_id": null,
  "cliente_nome": "Tatiane Andrade",
  "cliente_cpf": null,
  "unidade": "Lote 117",
  "bloco": "Quadra D",
  "valor_venda": "230746.00",
  "data_venda": "2025-11-05T13:11:11.774398",
  "status": "Ativa",
  "forma_pagamento": "Consórcio",
  "vendedor": null,
  "observacoes": null,
  "created_at": "2025-11-05T13:11:12.282801",
  "updated_at": "2025-11-05T13:11:12.282801"
}
```

**Erros:**
- 404: Venda não encontrada

---

## 🎯 Metas

### 1. GET /metas/

Lista todas as metas cadastradas.

**Autenticação:** Requerida

**Query Parameters (opcionais):**
- `skip` (int): Registros a pular (padrão: 0)
- `limit` (int): Limite de registros (padrão: 100)
- `empreendimento_id` (int): Filtrar por empreendimento
- `ano` (int): Filtrar por ano

**Response (200):**
```json
[
  {
    "id": 1,
    "empreendimento_id": 55,
    "mes": 12,
    "ano": 2025,
    "meta_vendas": "5000000.00",
    "meta_unidades": 10,
    "created_at": "2025-11-05T15:04:07.195964",
    "updated_at": "2025-11-05T15:04:07.195966"
  }
]
```

---

### 2. GET /metas/{id}

Retorna detalhes de uma meta específica.

**Autenticação:** Requerida

**Path Parameters:**
- `id` (int): ID da meta

**Response (200):**
```json
{
  "id": 1,
  "empreendimento_id": 55,
  "mes": 12,
  "ano": 2025,
  "meta_vendas": "5000000.00",
  "meta_unidades": 10,
  "created_at": "2025-11-05T15:04:07.195964",
  "updated_at": "2025-11-05T15:04:07.195966"
}
```

**Erros:**
- 404: Meta não encontrada

---

### 3. POST /metas/

Cria uma nova meta.

**Autenticação:** Requerida (Admin)

**Request Body:**
```json
{
  "empreendimento_id": 55,
  "mes": 12,
  "ano": 2025,
  "meta_vendas": 5000000.00,
  "meta_unidades": 10
}
```

**Response (201):**
```json
{
  "id": 1,
  "empreendimento_id": 55,
  "mes": 12,
  "ano": 2025,
  "meta_vendas": "5000000.00",
  "meta_unidades": 10,
  "created_at": "2025-11-05T15:04:07.195964",
  "updated_at": "2025-11-05T15:04:07.195966"
}
```

**Erros:**
- 400: Meta já existe para este empreendimento/mês/ano
- 403: Usuário não é admin

---

### 4. PUT /metas/{id}

Atualiza uma meta existente.

**Autenticação:** Requerida (Admin)

**Path Parameters:**
- `id` (int): ID da meta

**Request Body (campos opcionais):**
```json
{
  "mes": 12,
  "ano": 2025,
  "meta_vendas": 6000000.00,
  "meta_unidades": 15
}
```

**Response (200):**
```json
{
  "id": 1,
  "empreendimento_id": 55,
  "mes": 12,
  "ano": 2025,
  "meta_vendas": "6000000.00",
  "meta_unidades": 15,
  "created_at": "2025-11-05T15:04:07.195964",
  "updated_at": "2025-11-05T15:05:10.123456"
}
```

**Erros:**
- 403: Usuário não é admin
- 404: Meta não encontrada

---

### 5. DELETE /metas/{id}

Deleta uma meta.

**Autenticação:** Requerida (Admin)

**Path Parameters:**
- `id` (int): ID da meta

**Response (204):** Sem conteúdo

**Erros:**
- 403: Usuário não é admin
- 404: Meta não encontrada

---

## 🔄 Sincronização

Todos os endpoints de sincronização executam em **background** e retornam imediatamente.

### 1. POST /sync/full

Executa sincronização completa (empreendimentos + propostas + vendas).

**Autenticação:** Requerida

**Response (202):**
```json
{
  "message": "Sincronização completa iniciada em background",
  "status": "em_progresso"
}
```

---

### 2. POST /sync/empreendimentos

Sincroniza apenas empreendimentos.

**Autenticação:** Requerida

**Response (202):**
```json
{
  "message": "Sincronização de empreendimentos iniciada em background",
  "status": "em_progresso"
}
```

---

### 3. POST /sync/propostas-vendas

Sincroniza propostas e vendas.

**Autenticação:** Requerida

**Response (202):**
```json
{
  "message": "Sincronização de propostas/vendas iniciada em background",
  "status": "em_progresso"
}
```

---

### 4. GET /sync/status

Retorna histórico de sincronizações.

**Autenticação:** Requerida

**Query Parameters (opcionais):**
- `tipo_sync` (string): Filtrar por tipo ("full", "empreendimentos", "propostas_vendas")
- `skip` (int): Registros a pular (padrão: 0)
- `limit` (int): Limite de registros (padrão: 10)

**Response (200):**
```json
{
  "logs": [
    {
      "id": 10,
      "tipo_sync": "empreendimentos",
      "status": "sucesso",
      "total_registros": 104,
      "registros_criados": 5,
      "registros_atualizados": 99,
      "registros_erro": 0,
      "tempo_execucao_segundos": 12,
      "mensagem": "Sincronização empreendimentos concluída",
      "data_inicio": "2025-11-05T14:11:36.841880",
      "data_fim": "2025-11-05T14:11:48.123456"
    }
  ],
  "skip": 0,
  "limit": 10
}
```

---

### 5. GET /sync/status/latest/{tipo_sync}

Retorna a última sincronização de um tipo específico.

**Autenticação:** Requerida

**Path Parameters:**
- `tipo_sync` (string): Tipo de sincronização ("full", "empreendimentos", "propostas_vendas")

**Response (200):**
```json
{
  "id": 9,
  "tipo_sync": "full",
  "status": "sucesso",
  "total_registros": 154,
  "registros_criados": 45,
  "registros_atualizados": 109,
  "registros_erro": 0,
  "tempo_execucao_segundos": 57,
  "mensagem": "Sincronização full concluída",
  "detalhes_erro": null,
  "data_inicio": "2025-11-05T14:11:36.325623",
  "data_fim": "2025-11-05T14:12:33.456789",
  "user_id": 1,
  "created_at": "2025-11-05T14:11:36.328153"
}
```

**Erros:**
- 404: Nenhuma sincronização encontrada para este tipo

---

## 📤 Exportação

Todos os endpoints de exportação retornam arquivos (CSV ou XLSX), não JSON.

### 1. GET /export/vendas

Exporta vendas em formato CSV ou XLSX.

**Autenticação:** Requerida

**Query Parameters:**
- `formato` (string): "csv" ou "xlsx" (padrão: "xlsx")
- `data_inicio` (datetime, opcional): Data início
- `data_fim` (datetime, opcional): Data fim
- `empreendimento_id` (int, opcional): Filtrar por empreendimento

**Response:** Arquivo para download

**Headers:**
```
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
Content-Disposition: attachment; filename=vendas_20251105_120000.xlsx
```

**Exemplo de uso:**
```javascript
const response = await fetch('/api/v1/export/vendas?formato=xlsx&data_inicio=2025-01-01', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const blob = await response.blob();
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'vendas.xlsx';
a.click();
```

---

### 2. GET /export/propostas

Exporta propostas em formato CSV ou XLSX.

**Autenticação:** Requerida

**Query Parameters:**
- `formato` (string): "csv" ou "xlsx" (padrão: "xlsx")
- `data_inicio` (datetime, opcional): Data início
- `data_fim` (datetime, opcional): Data fim
- `empreendimento_id` (int, opcional): Filtrar por empreendimento
- `status` (string, opcional): Filtrar por status

**Response:** Arquivo para download

---

### 3. GET /export/relatorio-completo

Exporta relatório completo com múltiplas abas (apenas XLSX).

**Autenticação:** Requerida

**Query Parameters (opcionais):**
- `data_inicio` (datetime): Data início
- `data_fim` (datetime): Data fim

**Response:** Arquivo XLSX com múltiplas abas (Vendas, Propostas, Empreendimentos)

---

## 🔴 Tratamento de Erros

### Códigos de Status HTTP

| Código | Descrição |
|--------|-----------|
| 200 | Sucesso |
| 201 | Criado com sucesso |
| 202 | Aceito (processamento em background) |
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
      "input": {},
      "url": "https://errors.pydantic.dev/2.12/v/missing"
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
  endereco: string | null;
  cidade: string | null;
  estado: string | null;
  filial: string | null;
  status: string;
  data_lancamento: string | null;
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
  cliente_nome: string;
  cliente_cpf: string | null;
  unidade: string;
  bloco: string;
  valor_proposta: string;  // Decimal as string
  data_proposta: string;
  status: string;
  origem: string | null;
  vendedor: string | null;
  observacoes: string | null;
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
  proposta_id: number | null;
  cliente_nome: string;
  cliente_cpf: string | null;
  unidade: string;
  bloco: string;
  valor_venda: string;  // Decimal as string
  data_venda: string;
  status: string;
  forma_pagamento: string | null;
  vendedor: string | null;
  observacoes: string | null;
  created_at: string;
  updated_at: string;
}
```

### Meta

```typescript
interface Meta {
  id: number;
  empreendimento_id: number;
  mes: number;  // 1-12
  ano: number;  // 2020-2100
  meta_vendas: string;  // Decimal as string
  meta_unidades: number;
  created_at: string;
  updated_at: string;
}
```

### User

```typescript
interface User {
  id: number;
  email: string;
  nome: string;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}
```

### DashboardIndicadores

```typescript
interface DashboardIndicadores {
  total_propostas: number;
  total_vendas: number;
  valor_total_vendas: number;
  ticket_medio: number;
  taxa_conversao: number;
  meta_vendas: number;
  percentual_meta: number;
}
```

### SyncLog

```typescript
interface SyncLog {
  id: number;
  tipo_sync: 'full' | 'empreendimentos' | 'propostas_vendas';
  status: 'iniciado' | 'em_progresso' | 'sucesso' | 'erro';
  total_registros: number;
  registros_criados: number;
  registros_atualizados: number;
  registros_erro: number;
  tempo_execucao_segundos: number | null;
  mensagem: string;
  detalhes_erro: string | null;
  data_inicio: string;
  data_fim: string | null;
  user_id: number;
  created_at: string;
}
```

---

## 🔧 Exemplos de Código

### Setup de API Client (TypeScript)

```typescript
class LCPApiClient {
  private baseURL = 'http://localhost:8000/api/v1';
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'API request failed');
    }

    return response.json();
  }

  // Auth
  async login(email: string, password: string) {
    const data = await this.request<{ access_token: string; token_type: string }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );
    this.setToken(data.access_token);
    return data;
  }

  async me() {
    return this.request<User>('/auth/me');
  }

  async listUsers(skip = 0, limit = 100) {
    return this.request<User[]>(
      `/auth/users?skip=${skip}&limit=${limit}`
    );
  }

  async getUser(userId: number) {
    return this.request<User>(`/auth/users/${userId}`);
  }

  async updateUser(userId: number, data: Partial<User>) {
    return this.request<User>(`/auth/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async activateUser(userId: number) {
    return this.request<User>(`/auth/users/${userId}/activate`, {
      method: 'POST',
    });
  }

  async deactivateUser(userId: number) {
    return this.request<User>(`/auth/users/${userId}/deactivate`, {
      method: 'POST',
    });
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request<User>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
      }),
    });
  }

  async resetPassword(userId: number, newPassword: string) {
    return this.request<User>(`/auth/users/${userId}/reset-password`, {
      method: 'POST',
      body: JSON.stringify({ new_password: newPassword }),
    });
  }

  // Dashboard
  async getIndicadores(filters?: {
    data_inicio?: string;
    data_fim?: string;
    empreendimento_id?: number;
  }) {
    const params = new URLSearchParams(
      Object.entries(filters || {}).map(([k, v]) => [k, String(v)])
    );
    return this.request<DashboardIndicadores>(
      `/dashboard/indicadores?${params}`
    );
  }

  async getGraficoVendasMes(ano: number, empreendimento_id?: number) {
    const params = new URLSearchParams({ ano: String(ano) });
    if (empreendimento_id) {
      params.append('empreendimento_id', String(empreendimento_id));
    }
    return this.request<Array<{
      mes: number;
      total_vendas: number;
      valor_vendas: number;
      meta_vendas: number;
    }>>(`/dashboard/grafico-vendas-mes?${params}`);
  }

  async getTopEmpreendimentos(limit = 5) {
    return this.request<Array<{
      empreendimento_id: number;
      empreendimento_nome: string;
      total_vendas: number;
      valor_vendas: number;
    }>>(`/dashboard/top-empreendimentos?limit=${limit}`);
  }

  async getUltimasVendas(limit = 10, empreendimento_id?: number) {
    const params = new URLSearchParams({ limit: String(limit) });
    if (empreendimento_id) {
      params.append('empreendimento_id', String(empreendimento_id));
    }
    return this.request<Array<{
      id: number;
      codigo_mega: number;
      empreendimento_nome: string;
      cliente_nome: string;
      unidade: string;
      valor_venda: number;
      data_venda: string;
      status: string;
      forma_pagamento: string | null;
    }>>(`/dashboard/ultimas-vendas?${params}`);
  }

  async getVendasPorStatus(filters?: {
    data_inicio?: string;
    data_fim?: string;
    empreendimento_id?: number;
  }) {
    const params = new URLSearchParams(
      Object.entries(filters || {}).map(([k, v]) => [k, String(v)])
    );
    return this.request<Array<{
      status: string;
      total: number;
      valor_total: number;
      percentual: number;
    }>>(`/dashboard/vendas-por-status?${params}`);
  }

  async getVendasPorFormaPagamento(filters?: {
    data_inicio?: string;
    data_fim?: string;
    empreendimento_id?: number;
  }) {
    const params = new URLSearchParams(
      Object.entries(filters || {}).map(([k, v]) => [k, String(v)])
    );
    return this.request<Array<{
      forma_pagamento: string;
      total: number;
      valor_total: number;
      percentual: number;
    }>>(`/dashboard/vendas-por-forma-pagamento?${params}`);
  }

  async getFunilConversao(filters?: {
    data_inicio?: string;
    data_fim?: string;
    empreendimento_id?: number;
  }) {
    const params = new URLSearchParams(
      Object.entries(filters || {}).map(([k, v]) => [k, String(v)])
    );
    return this.request<{
      propostas_totais: number;
      propostas_em_analise: number;
      propostas_aprovadas: number;
      vendas_concluidas: number;
      taxa_conversao_proposta_venda: number;
      taxa_conversao_analise_aprovacao: number;
    }>(`/dashboard/funil-conversao?${params}`);
  }

  async getVendasPorVendedor(filters?: {
    data_inicio?: string;
    data_fim?: string;
    limit?: number;
  }) {
    const params = new URLSearchParams(
      Object.entries(filters || {}).map(([k, v]) => [k, String(v)])
    );
    return this.request<Array<{
      vendedor: string;
      total_vendas: number;
      valor_total: number;
      ticket_medio: number;
    }>>(`/dashboard/vendas-por-vendedor?${params}`);
  }

  // Empreendimentos
  async getEmpreendimentos(skip = 0, limit = 100) {
    return this.request<Empreendimento[]>(
      `/empreendimentos/?skip=${skip}&limit=${limit}`
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
    status?: string;
    data_inicio?: string;
    data_fim?: string;
  }) {
    const params = new URLSearchParams(
      Object.entries(filters || {}).map(([k, v]) => [k, String(v)])
    );
    return this.request<Venda[]>(`/vendas/?${params}`);
  }

  async getVenda(id: number) {
    return this.request<Venda>(`/vendas/${id}`);
  }

  // Propostas
  async getPropostas(filters?: {
    skip?: number;
    limit?: number;
    empreendimento_id?: number;
    status?: string;
    data_inicio?: string;
    data_fim?: string;
  }) {
    const params = new URLSearchParams(
      Object.entries(filters || {}).map(([k, v]) => [k, String(v)])
    );
    return this.request<Proposta[]>(`/propostas/?${params}`);
  }

  async getProposta(id: number) {
    return this.request<Proposta>(`/propostas/${id}`);
  }

  // Metas
  async getMetas(filters?: {
    skip?: number;
    limit?: number;
    empreendimento_id?: number;
    ano?: number;
  }) {
    const params = new URLSearchParams(
      Object.entries(filters || {}).map(([k, v]) => [k, String(v)])
    );
    return this.request<Meta[]>(`/metas/?${params}`);
  }

  async getMeta(id: number) {
    return this.request<Meta>(`/metas/${id}`);
  }

  async createMeta(data: {
    empreendimento_id: number;
    mes: number;
    ano: number;
    meta_vendas: number;
    meta_unidades: number;
  }) {
    return this.request<Meta>('/metas/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateMeta(
    id: number,
    data: {
      mes?: number;
      ano?: number;
      meta_vendas?: number;
      meta_unidades?: number;
    }
  ) {
    return this.request<Meta>(`/metas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteMeta(id: number) {
    return this.request<void>(`/metas/${id}`, { method: 'DELETE' });
  }

  // Sync
  async triggerFullSync() {
    return this.request<{ message: string; status: string }>('/sync/full', {
      method: 'POST',
    });
  }

  async getSyncStatus(tipo_sync?: string, skip = 0, limit = 10) {
    const params = new URLSearchParams({
      skip: String(skip),
      limit: String(limit),
    });
    if (tipo_sync) {
      params.append('tipo_sync', tipo_sync);
    }
    return this.request<{ logs: SyncLog[]; skip: number; limit: number }>(
      `/sync/status?${params}`
    );
  }

  async getLatestSync(tipo_sync: string) {
    return this.request<SyncLog>(`/sync/status/latest/${tipo_sync}`);
  }

  // Export
  async downloadVendas(formato: 'csv' | 'xlsx' = 'xlsx', filters?: {
    data_inicio?: string;
    data_fim?: string;
    empreendimento_id?: number;
  }) {
    const params = new URLSearchParams({ formato });
    if (filters) {
      Object.entries(filters).forEach(([k, v]) => {
        if (v) params.append(k, String(v));
      });
    }

    const response = await fetch(
      `${this.baseURL}/export/vendas?${params}`,
      {
        headers: { Authorization: `Bearer ${this.token}` },
      }
    );

    if (!response.ok) throw new Error('Download failed');

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vendas_${new Date().toISOString().split('T')[0]}.${formato}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}

export const api = new LCPApiClient();
```

### React Hook para Autenticação

```typescript
import { useState, useEffect, createContext, useContext } from 'react';
import { api } from './api-client';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Tentar carregar token do localStorage
    const token = localStorage.getItem('lcp_token');
    if (token) {
      api.setToken(token);
      api.me()
        .then(setUser)
        .catch(() => {
          localStorage.removeItem('lcp_token');
          api.clearToken();
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const data = await api.login(email, password);
    localStorage.setItem('lcp_token', data.access_token);
    const userData = await api.me();
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('lcp_token');
    api.clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

### Exemplo de Uso em Componente React

```typescript
import { useEffect, useState } from 'react';
import { api } from './api-client';
import { useAuth } from './auth-context';

export function Dashboard() {
  const { isAuthenticated } = useAuth();
  const [indicadores, setIndicadores] = useState<DashboardIndicadores | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;

    api.getIndicadores()
      .then(setIndicadores)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  if (loading) return <div>Carregando...</div>;
  if (!indicadores) return <div>Erro ao carregar</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <div>Total Vendas: {indicadores.total_vendas}</div>
        <div>Valor Total: R$ {indicadores.valor_total_vendas.toLocaleString('pt-BR')}</div>
        <div>Ticket Médio: R$ {indicadores.ticket_medio.toLocaleString('pt-BR')}</div>
        <div>Taxa Conversão: {indicadores.taxa_conversao}%</div>
      </div>
    </div>
  );
}
```

---

## 📝 Notas Importantes

1. **Ambiente de Desenvolvimento:**
   - Base URL: `http://localhost:8000/api/v1`
   - Documentação interativa (Swagger): `http://localhost:8000/docs`
   - ReDoc: `http://localhost:8000/redoc`

2. **Autenticação:**
   - Token JWT expira em 24 horas
   - Incluir header: `Authorization: Bearer {token}`
   - Renovar token fazendo novo login antes da expiração

3. **Paginação:**
   - Padrão: `skip=0`, `limit=100`
   - Máximo de 1000 registros por requisição

4. **Datas:**
   - Formato ISO 8601: `YYYY-MM-DDTHH:mm:ss`
   - Todas as datas são em UTC
   - Filtros de data aceitam formato: `YYYY-MM-DD`

5. **Valores Monetários:**
   - Retornados como `Decimal` (string) para precisão
   - Sempre em Reais (BRL)
   - Use bibliotecas como `decimal.js` para cálculos

6. **CORS:**
   - Configurado para aceitar requisições de `http://localhost:3000`
   - Produção deve configurar origins específicos

7. **Rate Limiting:**
   - Não implementado em desenvolvimento
   - Produção terá limite de 100 req/min por IP

8. **Sincronização:**
   - Processos executam em background
   - Use endpoint `/sync/status` para monitorar progresso
   - Sincronização completa pode levar vários minutos

---

**Última atualização:** 2025-11-05
**Versão da API:** 1.0.0
**Status:** ✅ Todos os endpoints testados e funcionando
