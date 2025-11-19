# 📚 Grupos de Empreendimentos - Documentação Frontend

## Visão Geral

A funcionalidade de **Grupos de Empreendimentos** permite agrupar múltiplos empreendimentos para visualização consolidada no dashboard. É útil para agrupar fases de um mesmo projeto ou empreendimentos relacionados.

---

## 🔑 Conceitos Principais

- **Grupo**: Agrupamento lógico de empreendimentos (ex: "LEBON (RENDA+)", "STOCKCARGO - Todas as Fases")
- **Empreendimento**: Projeto individual que pode ou não estar vinculado a um grupo
- **Vínculo**: Relação entre empreendimento e grupo (um empreendimento só pode estar em 1 grupo por vez)

---

## 📋 Endpoints Disponíveis

### Base URL
```
/api/v1/empreendimento-grupos
```

### Autenticação
- **Rotas públicas**: `/simple` (sem autenticação)
- **Rotas admin**: Todas as outras (requer token de admin)

---

## 1️⃣ Listar Grupos (Simples) - Para Dropdowns

**Endpoint:** `GET /empreendimento-grupos/simple`

**Autenticação:** Não requer

**Descrição:** Retorna lista simplificada de grupos ativos para popular dropdowns/selects.

### Request
```http
GET /api/v1/empreendimento-grupos/simple
```

### Response
```json
[
  {
    "id": 1,
    "nome_grupo": "LEBON (RENDA+)"
  },
  {
    "id": 2,
    "nome_grupo": "STOCKCARGO - Todas as Fases"
  }
]
```

### Exemplo de Uso (React)
```typescript
// Buscar grupos para dropdown
const fetchGrupos = async () => {
  const response = await fetch('/api/v1/empreendimento-grupos/simple');
  const grupos = await response.json();
  return grupos;
};

// Uso em select
<Select>
  <option value="">Todos os grupos</option>
  {grupos.map(grupo => (
    <option key={grupo.id} value={grupo.id}>
      {grupo.nome_grupo}
    </option>
  ))}
</Select>
```

---

## 2️⃣ Listar Grupos (Completo) - Com Contagem

**Endpoint:** `GET /empreendimento-grupos/`

**Autenticação:** Admin

**Descrição:** Retorna lista completa de grupos com contagem de empreendimentos.

### Request
```http
GET /api/v1/empreendimento-grupos/?skip=0&limit=100&apenas_ativos=false
Authorization: Bearer <token>
```

### Query Parameters
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `skip` | integer | Não | Registros para pular (padrão: 0) |
| `limit` | integer | Não | Máximo de registros (padrão: 100, max: 1000) |
| `apenas_ativos` | boolean | Não | Filtrar apenas grupos ativos (padrão: false) |

### Response
```json
[
  {
    "id": 1,
    "nome_grupo": "LEBON (RENDA+)",
    "descricao": "Grupo de empreendimentos Lebon",
    "ativo": true,
    "created_at": "2025-11-19T14:30:00Z",
    "updated_at": "2025-11-19T14:30:00Z",
    "total_empreendimentos": 5
  }
]
```

---

## 3️⃣ Buscar Grupo por ID

**Endpoint:** `GET /empreendimento-grupos/{grupo_id}`

**Autenticação:** Admin

### Request
```http
GET /api/v1/empreendimento-grupos/1
Authorization: Bearer <token>
```

### Response
```json
{
  "id": 1,
  "nome_grupo": "LEBON (RENDA+)",
  "descricao": "Grupo de empreendimentos Lebon",
  "ativo": true,
  "created_at": "2025-11-19T14:30:00Z",
  "updated_at": "2025-11-19T14:30:00Z"
}
```

---

## 4️⃣ Criar Grupo (Com Empreendimentos)

**Endpoint:** `POST /empreendimento-grupos/`

**Autenticação:** Admin

**Descrição:** Cria um novo grupo e já vincula empreendimentos.

### Request
```http
POST /api/v1/empreendimento-grupos/
Authorization: Bearer <token>
Content-Type: application/json

{
  "nome_grupo": "STOCKCARGO - Todas as Fases",
  "descricao": "Agrupa todas as fases do empreendimento StockCargo",
  "ativo": true,
  "empreendimento_ids": [10, 11, 12]
}
```

### Campos
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `nome_grupo` | string | Sim | Nome único do grupo (max 255 chars) |
| `descricao` | string | Não | Descrição do grupo (max 500 chars) |
| `ativo` | boolean | Não | Se o grupo está ativo (padrão: true) |
| `empreendimento_ids` | array[int] | Não | IDs de empreendimentos a vincular (padrão: []) |

### Response
```json
{
  "id": 2,
  "nome_grupo": "STOCKCARGO - Todas as Fases",
  "descricao": "Agrupa todas as fases do empreendimento StockCargo",
  "ativo": true,
  "created_at": "2025-11-19T15:00:00Z",
  "updated_at": "2025-11-19T15:00:00Z"
}
```

### Exemplo React/TypeScript
```typescript
interface CreateGrupoRequest {
  nome_grupo: string;
  descricao?: string;
  ativo?: boolean;
  empreendimento_ids?: number[];
}

const createGrupo = async (data: CreateGrupoRequest) => {
  const response = await fetch('/api/v1/empreendimento-grupos/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail);
  }

  return await response.json();
};

// Uso
await createGrupo({
  nome_grupo: "LEBON (RENDA+)",
  descricao: "Grupo Lebon",
  empreendimento_ids: [1, 2, 3],
});
```

---

## 5️⃣ Atualizar Grupo (E Empreendimentos)

**Endpoint:** `PUT /empreendimento-grupos/{grupo_id}`

**Autenticação:** Admin

**Descrição:** Atualiza dados do grupo. Se `empreendimento_ids` for fornecido, **substitui todos os vínculos**.

### Request
```http
PUT /api/v1/empreendimento-grupos/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "nome_grupo": "LEBON (RENDA+) - Atualizado",
  "descricao": "Descrição atualizada",
  "empreendimento_ids": [1, 2, 4, 5]
}
```

### Campos
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `nome_grupo` | string | Não | Novo nome do grupo |
| `descricao` | string | Não | Nova descrição |
| `ativo` | boolean | Não | Ativar/desativar grupo |
| `empreendimento_ids` | array[int] | Não | **Substitui TODOS os vínculos** (se fornecido) |

⚠️ **IMPORTANTE**: Se você enviar `empreendimento_ids`, todos os vínculos anteriores serão removidos e apenas os novos IDs serão vinculados.

### Response
```json
{
  "id": 1,
  "nome_grupo": "LEBON (RENDA+) - Atualizado",
  "descricao": "Descrição atualizada",
  "ativo": true,
  "created_at": "2025-11-19T14:30:00Z",
  "updated_at": "2025-11-19T15:30:00Z"
}
```

### Exemplo React/TypeScript
```typescript
interface UpdateGrupoRequest {
  nome_grupo?: string;
  descricao?: string;
  ativo?: boolean;
  empreendimento_ids?: number[];
}

const updateGrupo = async (grupoId: number, data: UpdateGrupoRequest) => {
  const response = await fetch(`/api/v1/empreendimento-grupos/${grupoId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail);
  }

  return await response.json();
};

// Atualizar apenas o nome
await updateGrupo(1, {
  nome_grupo: "Novo Nome"
});

// Atualizar empreendimentos (substitui todos)
await updateGrupo(1, {
  empreendimento_ids: [1, 2, 3, 4]
});
```

---

## 6️⃣ Deletar Grupo

**Endpoint:** `DELETE /empreendimento-grupos/{grupo_id}`

**Autenticação:** Admin

**Descrição:** Deleta o grupo. Os empreendimentos vinculados **não são deletados**, apenas desvinculados.

### Request
```http
DELETE /api/v1/empreendimento-grupos/1
Authorization: Bearer <token>
```

### Response
```
204 No Content
```

---

## 7️⃣ Listar Empreendimentos do Grupo

**Endpoint:** `GET /empreendimento-grupos/{grupo_id}/empreendimentos`

**Autenticação:** Admin

**Descrição:** Retorna IDs de empreendimentos vinculados ao grupo.

### Request
```http
GET /api/v1/empreendimento-grupos/1/empreendimentos
Authorization: Bearer <token>
```

### Response
```json
[1, 2, 3, 4, 5]
```

---

## 8️⃣ Listar Empreendimentos Disponíveis (Sem Grupo)

**Endpoint:** `GET /empreendimento-grupos/disponiveis/empreendimentos`

**Autenticação:** Admin

**Descrição:** Retorna empreendimentos que **não estão vinculados a nenhum grupo**, útil para mostrar opções disponíveis ao criar/editar grupos.

### Request
```http
GET /api/v1/empreendimento-grupos/disponiveis/empreendimentos
Authorization: Bearer <token>
```

### Response
```json
[
  {
    "id": 15,
    "codigo_mega": 1234,
    "nome": "EMPREENDIMENTO SEM GRUPO A"
  },
  {
    "id": 16,
    "codigo_mega": 5678,
    "nome": "EMPREENDIMENTO SEM GRUPO B"
  }
]
```

### Exemplo de Uso (React)
```typescript
// Buscar empreendimentos disponíveis para vincular
const fetchEmpreendimentosDisponiveis = async () => {
  const response = await fetch(
    '/api/v1/empreendimento-grupos/disponiveis/empreendimentos',
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );
  return await response.json();
};

// Uso em multi-select
<MultiSelect>
  {empreendimentosDisponiveis.map(emp => (
    <Option key={emp.id} value={emp.id}>
      {emp.nome} ({emp.codigo_mega})
    </Option>
  ))}
</MultiSelect>
```

---

## 🎯 Uso no Dashboard

### Filtrar Dashboard por Grupo

Todos os endpoints de dashboard aceitam o parâmetro `grupo_id`:

```http
GET /api/v1/dashboard/indicadores?grupo_id=1
GET /api/v1/dashboard/grafico-vendas-mes?ano=2025&grupo_id=1
GET /api/v1/dashboard/top-empreendimentos?grupo_id=1&limit=5
```

### Prioridade de Filtros

O backend aplica filtros nesta ordem:
1. `grupo_id` (se fornecido, ignora os outros)
2. `empreendimento_id` (se fornecido e não há grupo_id)
3. Empreendimentos com meta (padrão, se nenhum filtro fornecido)

### Exemplo Completo - Seletor de Grupo
```typescript
import { useState, useEffect } from 'react';

interface Grupo {
  id: number;
  nome_grupo: string;
}

const GrupoSelector = ({ onChange }: { onChange: (grupoId: number | null) => void }) => {
  const [grupos, setGrupos] = useState<Grupo[]>([]);

  useEffect(() => {
    fetch('/api/v1/empreendimento-grupos/simple')
      .then(res => res.json())
      .then(setGrupos);
  }, []);

  return (
    <select onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}>
      <option value="">Todos os empreendimentos</option>
      {grupos.map(grupo => (
        <option key={grupo.id} value={grupo.id}>
          {grupo.nome_grupo}
        </option>
      ))}
    </select>
  );
};

// Uso no Dashboard
const Dashboard = () => {
  const [grupoId, setGrupoId] = useState<number | null>(null);
  const [indicadores, setIndicadores] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (grupoId) params.set('grupo_id', String(grupoId));

    fetch(`/api/v1/dashboard/indicadores?${params}`)
      .then(res => res.json())
      .then(setIndicadores);
  }, [grupoId]);

  return (
    <div>
      <GrupoSelector onChange={setGrupoId} />
      {/* Renderizar indicadores */}
    </div>
  );
};
```

---

## 🔄 Fluxo de Gerenciamento de Grupos

### 1. Listar Grupos Existentes
```typescript
const grupos = await fetch('/api/v1/empreendimento-grupos/').then(r => r.json());
```

### 2. Buscar Empreendimentos Disponíveis
```typescript
const disponiveis = await fetch('/api/v1/empreendimento-grupos/disponiveis/empreendimentos', {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json());
```

### 3. Criar Novo Grupo
```typescript
const novoGrupo = await fetch('/api/v1/empreendimento-grupos/', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    nome_grupo: "Meu Grupo",
    empreendimento_ids: [1, 2, 3],
  }),
}).then(r => r.json());
```

### 4. Atualizar Grupo (Adicionar/Remover Empreendimentos)
```typescript
// Primeiro, buscar IDs atuais
const idsAtuais = await fetch(`/api/v1/empreendimento-grupos/${grupoId}/empreendimentos`, {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json());

// Adicionar novos IDs
const novosIds = [...idsAtuais, 10, 11];

// Atualizar
await fetch(`/api/v1/empreendimento-grupos/${grupoId}`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    empreendimento_ids: novosIds,
  }),
});
```

---

## ⚠️ Tratamento de Erros

### Códigos de Status HTTP
| Código | Descrição |
|--------|-----------|
| `200` | Sucesso (GET, PUT) |
| `201` | Criado com sucesso (POST) |
| `204` | Deletado com sucesso (DELETE) |
| `400` | Dados inválidos (nome duplicado, lista vazia, etc) |
| `401` | Não autenticado |
| `403` | Não autorizado (não é admin) |
| `404` | Grupo não encontrado |

### Exemplos de Erros

**Nome de grupo duplicado:**
```json
{
  "detail": "Grupo com nome 'LEBON (RENDA+)' já existe"
}
```

**Grupo não encontrado:**
```json
{
  "detail": "Grupo com ID 999 não encontrado"
}
```

**Lista de empreendimentos vazia (se implementado validação):**
```json
{
  "detail": "Lista de empreendimentos não pode estar vazia"
}
```

---

## 📊 Tipos TypeScript

```typescript
// Schemas
interface EmpreendimentoGrupoSimple {
  id: number;
  nome_grupo: string;
}

interface EmpreendimentoGrupoResponse {
  id: number;
  nome_grupo: string;
  descricao: string | null;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

interface EmpreendimentoGrupoWithMembros extends EmpreendimentoGrupoResponse {
  total_empreendimentos: number;
}

interface EmpreendimentoSimple {
  id: number;
  codigo_mega: number;
  nome: string;
}

// Request bodies
interface CreateGrupoRequest {
  nome_grupo: string;
  descricao?: string;
  ativo?: boolean;
  empreendimento_ids?: number[];
}

interface UpdateGrupoRequest {
  nome_grupo?: string;
  descricao?: string;
  ativo?: boolean;
  empreendimento_ids?: number[];
}
```

---

## 🎨 Exemplo de Tela de Gerenciamento

```tsx
import React, { useState, useEffect } from 'react';

const GrupoManager = () => {
  const [grupos, setGrupos] = useState<EmpreendimentoGrupoWithMembros[]>([]);
  const [disponiveis, setDisponiveis] = useState<EmpreendimentoSimple[]>([]);
  const [formData, setFormData] = useState({
    nome_grupo: '',
    descricao: '',
    empreendimento_ids: [] as number[],
  });

  useEffect(() => {
    loadGrupos();
    loadDisponiveis();
  }, []);

  const loadGrupos = async () => {
    const res = await fetch('/api/v1/empreendimento-grupos/', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    setGrupos(await res.json());
  };

  const loadDisponiveis = async () => {
    const res = await fetch('/api/v1/empreendimento-grupos/disponiveis/empreendimentos', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    setDisponiveis(await res.json());
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch('/api/v1/empreendimento-grupos/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    loadGrupos();
    loadDisponiveis();
    setFormData({ nome_grupo: '', descricao: '', empreendimento_ids: [] });
  };

  return (
    <div>
      <h2>Gerenciar Grupos</h2>

      {/* Formulário de criação */}
      <form onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="Nome do Grupo"
          value={formData.nome_grupo}
          onChange={(e) => setFormData({...formData, nome_grupo: e.target.value})}
          required
        />

        <textarea
          placeholder="Descrição (opcional)"
          value={formData.descricao}
          onChange={(e) => setFormData({...formData, descricao: e.target.value})}
        />

        <select
          multiple
          value={formData.empreendimento_ids.map(String)}
          onChange={(e) => setFormData({
            ...formData,
            empreendimento_ids: Array.from(e.target.selectedOptions, o => Number(o.value))
          })}
        >
          {disponiveis.map(emp => (
            <option key={emp.id} value={emp.id}>
              {emp.nome} ({emp.codigo_mega})
            </option>
          ))}
        </select>

        <button type="submit">Criar Grupo</button>
      </form>

      {/* Lista de grupos */}
      <ul>
        {grupos.map(grupo => (
          <li key={grupo.id}>
            <strong>{grupo.nome_grupo}</strong> - {grupo.total_empreendimentos} empreendimentos
          </li>
        ))}
      </ul>
    </div>
  );
};
```

---

## 📝 Notas Importantes

1. **Um empreendimento só pode estar em 1 grupo por vez**. Se você vincular um empreendimento que já está em outro grupo, ele será automaticamente desvinculado do grupo anterior.

2. **Ao usar `empreendimento_ids` no UPDATE, todos os vínculos são substituídos**. Se quiser adicionar/remover apenas alguns, você precisa:
   - Buscar os IDs atuais com `GET /{grupo_id}/empreendimentos`
   - Modificar o array
   - Enviar o array completo no PUT

3. **Grupos inativos** (`ativo: false`) não aparecem no endpoint `/simple`, mas aparecem no endpoint principal se `apenas_ativos=false`.

4. **O endpoint `/disponiveis/empreendimentos`** só retorna empreendimentos **sem grupo**. Empreendimentos já vinculados a um grupo não aparecem aqui.

5. **Ao deletar um grupo**, os empreendimentos vinculados não são deletados, apenas desvinculados (ficam sem grupo).

---

## 🚀 Quick Start

```typescript
// 1. Listar grupos para dropdown
const grupos = await fetch('/api/v1/empreendimento-grupos/simple').then(r => r.json());

// 2. Filtrar dashboard por grupo
const indicadores = await fetch(`/api/v1/dashboard/indicadores?grupo_id=${grupoId}`)
  .then(r => r.json());

// 3. Criar grupo (admin)
await fetch('/api/v1/empreendimento-grupos/', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    nome_grupo: "Meu Grupo",
    empreendimento_ids: [1, 2, 3],
  }),
});
```

---

**Última Atualização:** 19/11/2025
**Versão da API:** v1
