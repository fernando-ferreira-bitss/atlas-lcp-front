# 📘 Instruções para Frontend - Implementação de Grupos de Empreendimentos

**Data:** 19/11/2025
**Versão da API:** v1
**Objetivo:** Implementar agrupamento de empreendimentos (fases) para visualização consolidada no dashboard

---

## 🎯 Contexto da Mudança

### Problema Resolvido

Empreendimentos no Mega ERP às vezes aparecem duplicados (ex: fases de um mesmo projeto). O cliente quer visualizar esses empreendimentos agrupados no dashboard, somando dados de todas as fases.

**Exemplo:**
```
ANTES (separado):
- ID 10  | 3636  | CONDOMINIO INDUSTRIAL STOCKCARGO (SFS) - Fase 1
- ID 56  | 16047 | CONDOMINIO INDUSTRIAL STOCKCARGO (SFS) - Fase 2

DEPOIS (agrupado):
- Grupo: "CONDOMINIO INDUSTRIAL STOCKCARGO (SFS)"
  - Empreendimentos: [10, 56]
  - Dashboard mostra soma de vendas/propostas de ambos
```

### Arquitetura da Solução

- ✅ **Nova entidade:** `EmpreendimentoGrupo`
- ✅ **Relacionamento:** `Empreendimento.empreendimento_grupo_id → EmpreendimentoGrupo.id`
- ✅ **Metas:** Agora são criadas **APENAS por grupo**, não mais por empreendimento individual
- ✅ **Dashboard:** Aceita filtro por `grupo_id` ao invés de `empreendimento_id`

---

## 📦 Novos Endpoints Criados

### 1. CRUD de Grupos (`/api/v1/empreendimento-grupos`)

#### **GET** `/api/v1/empreendimento-grupos`
Lista todos os grupos com contagem de membros.

**Query Parameters:**
- `skip` (int, default: 0): Paginação
- `limit` (int, default: 100): Limite de registros
- `apenas_ativos` (bool, default: false): Filtrar apenas grupos ativos

**Response:**
```json
[
  {
    "id": 1,
    "nome_grupo": "CONDOMINIO INDUSTRIAL STOCKCARGO (SFS)",
    "descricao": "Todas as fases do empreendimento",
    "ativo": true,
    "total_empreendimentos": 3,
    "created_at": "2025-11-19T10:00:00",
    "updated_at": "2025-11-19T10:00:00"
  }
]
```

---

#### **POST** `/api/v1/empreendimento-grupos`
Criar novo grupo (apenas admin).

**Request Body:**
```json
{
  "nome_grupo": "CONDOMINIO INDUSTRIAL STOCKCARGO (SFS)",
  "descricao": "Todas as fases do empreendimento StockCargo",
  "ativo": true
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "nome_grupo": "CONDOMINIO INDUSTRIAL STOCKCARGO (SFS)",
  "descricao": "Todas as fases do empreendimento StockCargo",
  "ativo": true,
  "created_at": "2025-11-19T10:00:00",
  "updated_at": "2025-11-19T10:00:00"
}
```

**Errors:**
- `400 Bad Request`: Nome do grupo já existe
- `401 Unauthorized`: Usuário não autenticado
- `403 Forbidden`: Usuário não é admin

---

#### **GET** `/api/v1/empreendimento-grupos/{grupo_id}`
Buscar grupo por ID.

**Response:**
```json
{
  "id": 1,
  "nome_grupo": "CONDOMINIO INDUSTRIAL STOCKCARGO (SFS)",
  "descricao": "Todas as fases",
  "ativo": true,
  "created_at": "2025-11-19T10:00:00",
  "updated_at": "2025-11-19T10:00:00"
}
```

**Errors:**
- `404 Not Found`: Grupo não encontrado

---

#### **PUT** `/api/v1/empreendimento-grupos/{grupo_id}`
Atualizar grupo (apenas admin).

**Request Body:** (todos os campos opcionais)
```json
{
  "nome_grupo": "NOVO NOME DO GRUPO",
  "descricao": "Nova descrição",
  "ativo": false
}
```

**Response:** `200 OK` (mesmo formato do GET)

**Errors:**
- `400 Bad Request`: Nome já existe (se alterando nome)
- `404 Not Found`: Grupo não encontrado

---

#### **DELETE** `/api/v1/empreendimento-grupos/{grupo_id}`
Deletar grupo (apenas admin).

**Response:** `204 No Content`

**Nota:** Empreendimentos vinculados ao grupo terão `empreendimento_grupo_id = NULL`.

---

#### **GET** `/api/v1/empreendimento-grupos/{grupo_id}/empreendimentos`
Listar IDs de empreendimentos vinculados ao grupo.

**Response:**
```json
[10, 56, 87]
```

---

## 🔄 Endpoints Modificados

### 2. Empreendimentos (`/api/v1/empreendimentos`)

#### **GET** `/api/v1/empreendimentos/{id}`
**Mudança:** Response agora inclui `empreendimento_grupo_id`.

**Response:**
```json
{
  "id": 10,
  "codigo_mega": 3636,
  "nome": "CONDOMINIO INDUSTRIAL STOCKCARGO (SFS) - Fase 1",
  "empreendimento_grupo_id": 1,  // ← NOVO CAMPO
  "endereco": "Rua X",
  "cidade": "São Paulo",
  "status": "Ativo",
  ...
}
```

---

#### **PUT** `/api/v1/empreendimentos/{id}`
**Mudança:** Permite vincular/desvincular grupo.

**Request Body:**
```json
{
  "empreendimento_grupo_id": 1  // ou null para desvincular
}
```

---

### 3. Metas (`/api/v1/metas`)

#### **⚠️ MUDANÇA CRÍTICA: Metas agora são criadas APENAS por grupo**

#### **POST** `/api/v1/metas`
**Antes:**
```json
{
  "empreendimento_id": 10,  // ← REMOVIDO
  "mes": 11,
  "ano": 2025,
  "meta_vendas": 1000000.0,
  "meta_unidades": 50
}
```

**AGORA (apenas grupo_id):**
```json
{
  "empreendimento_grupo_id": 1,  // ← OBRIGATÓRIO
  "mes": 11,
  "ano": 2025,
  "meta_vendas": 1000000.0,
  "meta_unidades": 50
}
```

**Regras de validação:**
- ✅ Apenas `empreendimento_grupo_id` deve estar preenchido
- ✅ `empreendimento_id` deve ser `null`
- ❌ Se ambos preenchidos → **400 Bad Request**

---

#### **GET** `/api/v1/metas/{id}`
**Response agora inclui:**
```json
{
  "id": 1,
  "empreendimento_id": null,
  "empreendimento_grupo_id": 1,  // ← NOVO CAMPO
  "mes": 11,
  "ano": 2025,
  "meta_vendas": 1000000.0,
  "meta_unidades": 50,
  ...
}
```

---

### 4. Vendas (`/api/v1/vendas`)

#### **GET** `/api/v1/vendas`

**Query Parameters:**
- `skip` (int, default: 0): Paginação
- `limit` (int, default: 100): Limite de registros
- `grupo_id` (int, optional) ← **NOVO PARÂMETRO**
- `empreendimento_id` (int, optional, **DEPRECATED**)
- `status` (string, optional): Filtrar por status
- `data_inicio` (datetime, optional): Data inicial
- `data_fim` (datetime, optional): Data final

**Comportamento:**
1. Se `grupo_id` fornecido → Lista vendas de todos empreendimentos do grupo
2. Se `empreendimento_id` fornecido → Lista vendas daquele empreendimento (manter compatibilidade)
3. Se nenhum fornecido → Lista vendas de empreendimentos com meta

**Exemplo:**
```bash
GET /api/v1/vendas?grupo_id=1&status=Ativa&limit=50
```

---

### 5. Propostas (`/api/v1/propostas`)

#### **GET** `/api/v1/propostas`

**Query Parameters:**
- `skip` (int, default: 0): Paginação
- `limit` (int, default: 100): Limite de registros
- `grupo_id` (int, optional) ← **NOVO PARÂMETRO**
- `empreendimento_id` (int, optional, **DEPRECATED**)
- `status` (string, optional): Filtrar por status
- `data_inicio` (datetime, optional): Data inicial
- `data_fim` (datetime, optional): Data final

**Comportamento:**
1. Se `grupo_id` fornecido → Lista propostas de todos empreendimentos do grupo
2. Se `empreendimento_id` fornecido → Lista propostas daquele empreendimento (manter compatibilidade)
3. Se nenhum fornecido → Lista todas as propostas

**Exemplo:**
```bash
GET /api/v1/propostas?grupo_id=1&status=Aprovada&limit=50
```

---

### 6. Dashboard (`/api/v1/dashboard/*`)

#### **⚠️ MUDANÇA CRÍTICA: Filtro agora é por `grupo_id`**

**Todos os endpoints de dashboard foram ajustados para aceitar `grupo_id`:**

---

#### **GET** `/api/v1/dashboard/indicadores`

**Query Parameters:**
- `data_inicio` (datetime, optional)
- `data_fim` (datetime, optional)
- `grupo_id` (int, optional) ← **NOVO PARÂMETRO**
- `empreendimento_id` (int, optional, **DEPRECATED**)

**Comportamento:**
1. Se `grupo_id` fornecido → Agrupa dados de todos empreendimentos do grupo
2. Se `empreendimento_id` fornecido → Filtra apenas aquele empreendimento (manter compatibilidade)
3. Se nenhum fornecido → Usa lógica atual (empreendimentos com meta)

**Response:** (mesmo formato, sem mudanças)

---

#### **GET** `/api/v1/dashboard/grafico-vendas-mes`
**Query Parameters:**
- `ano` (int, required)
- `grupo_id` (int, optional) ← **NOVO**

---

#### **GET** `/api/v1/dashboard/top-empreendimentos`
**⚠️ IMPORTANTE:** Este endpoint agora retorna **grupos** quando dados estão agrupados.

**Query Parameters:**
- `data_inicio` (datetime, optional)
- `data_fim` (datetime, optional)
- `limit` (int, default: 5)

**Response:**
```json
[
  {
    "empreendimento_id": null,  // null quando é grupo
    "empreendimento_nome": null,
    "grupo_id": 1,  // ← NOVO CAMPO
    "grupo_nome": "CONDOMINIO INDUSTRIAL STOCKCARGO (SFS)",  // ← NOVO CAMPO
    "total_propostas": 120,
    "total_vendas": 62,
    "valor_propostas": 15000000.0,
    "valor_vendas": 8500000.0
  }
]
```

**Notas:**
- Se empreendimento estiver em grupo: agrupa por `grupo_nome`
- Se empreendimento NÃO estiver em grupo: usa `empreendimento_nome`

---

#### **GET** `/api/v1/dashboard/ultimas-vendas`
**Query Parameters:**
- `limit` (int, default: 10)
- `grupo_id` (int, optional) ← **NOVO**

**Response:** (mesmo formato, sem mudanças)

---

#### **GET** `/api/v1/dashboard/vendas-por-status`
**Query Parameters:**
- `data_inicio` (datetime, optional)
- `data_fim` (datetime, optional)
- `grupo_id` (int, optional) ← **NOVO**

---

#### **GET** `/api/v1/dashboard/vendas-por-forma-pagamento`
**Query Parameters:**
- `data_inicio` (datetime, optional)
- `data_fim` (datetime, optional)
- `grupo_id` (int, optional) ← **NOVO**

---

#### **GET** `/api/v1/dashboard/funil-conversao`
**Query Parameters:**
- `data_inicio` (datetime, optional)
- `data_fim` (datetime, optional)
- `grupo_id` (int, optional) ← **NOVO**

---

#### **GET** `/api/v1/dashboard/vendas-por-vendedor`
**Query Parameters:**
- `data_inicio` (datetime, optional)
- `data_fim` (datetime, optional)
- `limit` (int, default: 10)
- (Não aceita filtro por grupo/empreendimento - mostra ranking geral)

---

#### **GET** `/api/v1/dashboard/comparativo-anos`
**Query Parameters:**
- `ano_atual` (int, required)
- `ano_anterior` (int, required)
- `grupo_id` (int, optional) ← **NOVO**

---

#### **GET** `/api/v1/dashboard/conversao-por-empreendimento`
**Query Parameters:**
- `data_inicio` (datetime, optional)
- `data_fim` (datetime, optional)
- `limit` (int, default: 10)
- (Não aceita filtro - mostra todos empreendimentos/grupos com meta)

---

#### **GET** `/api/v1/dashboard/evolucao-ticket-medio`
**Query Parameters:**
- `ano` (int, required)
- `grupo_id` (int, optional) ← **NOVO**

---

#### **GET** `/api/v1/dashboard/resumo-unidades`
**Query Parameters:**
- `grupo_id` (int, optional) ← **NOVO**

---

## 🔧 Implementação Recomendada no Frontend

### Passo 1: Atualizar Tipos TypeScript

```typescript
// types/empreendimento.ts
export interface Empreendimento {
  id: number;
  codigo_mega: number;
  nome: string;
  empreendimento_grupo_id: number | null;  // ← NOVO
  endereco?: string;
  cidade?: string;
  // ... outros campos
}

// types/grupo.ts (NOVO)
export interface EmpreendimentoGrupo {
  id: number;
  nome_grupo: string;
  descricao?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface EmpreendimentoGrupoWithMembros extends EmpreendimentoGrupo {
  total_empreendimentos: number;
}

// types/meta.ts
export interface Meta {
  id: number;
  empreendimento_id: number | null;  // ← SEMPRE NULL agora
  empreendimento_grupo_id: number | null;  // ← NOVO (obrigatório)
  mes: number;
  ano: number;
  meta_vendas: number;
  meta_unidades: number;
  // ... outros campos
}
```

---

### Passo 2: Criar Serviço de Grupos

```typescript
// services/grupoService.ts
import { api } from './api';
import { EmpreendimentoGrupo, EmpreendimentoGrupoWithMembros } from '@/types/grupo';

export const grupoService = {
  async list(apenasAtivos = false): Promise<EmpreendimentoGrupoWithMembros[]> {
    const response = await api.get('/empreendimento-grupos', {
      params: { apenas_ativos: apenasAtivos }
    });
    return response.data;
  },

  async getById(id: number): Promise<EmpreendimentoGrupo> {
    const response = await api.get(`/empreendimento-grupos/${id}`);
    return response.data;
  },

  async create(data: {
    nome_grupo: string;
    descricao?: string;
    ativo?: boolean;
  }): Promise<EmpreendimentoGrupo> {
    const response = await api.post('/empreendimento-grupos', data);
    return response.data;
  },

  async update(id: number, data: Partial<EmpreendimentoGrupo>): Promise<EmpreendimentoGrupo> {
    const response = await api.put(`/empreendimento-grupos/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/empreendimento-grupos/${id}`);
  },

  async getEmpreendimentos(id: number): Promise<number[]> {
    const response = await api.get(`/empreendimento-grupos/${id}/empreendimentos`);
    return response.data;
  }
};
```

---

### Passo 3: Ajustar Serviço de Dashboard

```typescript
// services/dashboardService.ts
export const dashboardService = {
  async getIndicadores(params: {
    data_inicio?: string;
    data_fim?: string;
    grupo_id?: number;  // ← NOVO
  }) {
    const response = await api.get('/dashboard/indicadores', { params });
    return response.data;
  },

  async getGraficoVendasMes(params: {
    ano: number;
    grupo_id?: number;  // ← NOVO
  }) {
    const response = await api.get('/dashboard/grafico-vendas-mes', { params });
    return response.data;
  },

  async getTopEmpreendimentos(params: {
    data_inicio?: string;
    data_fim?: string;
    limit?: number;
  }) {
    const response = await api.get('/dashboard/top-empreendimentos', { params });
    return response.data;
  },

  // ... outros métodos com grupo_id
};
```

---

### Passo 4: Componente de Seleção de Grupo

```tsx
// components/GrupoSelect.tsx
import { useState, useEffect } from 'react';
import { grupoService } from '@/services/grupoService';
import { EmpreendimentoGrupoWithMembros } from '@/types/grupo';

interface GrupoSelectProps {
  value?: number | null;
  onChange: (grupoId: number | null) => void;
  placeholder?: string;
}

export function GrupoSelect({ value, onChange, placeholder = "Selecione um grupo" }: GrupoSelectProps) {
  const [grupos, setGrupos] = useState<EmpreendimentoGrupoWithMembros[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGrupos() {
      try {
        const data = await grupoService.list(true); // apenas ativos
        setGrupos(data);
      } catch (error) {
        console.error('Erro ao carregar grupos:', error);
      } finally {
        setLoading(false);
      }
    }
    loadGrupos();
  }, []);

  return (
    <select
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
      disabled={loading}
    >
      <option value="">{placeholder}</option>
      {grupos.map((grupo) => (
        <option key={grupo.id} value={grupo.id}>
          {grupo.nome_grupo} ({grupo.total_empreendimentos} empreendimentos)
        </option>
      ))}
    </select>
  );
}
```

---

### Passo 5: Atualizar Página de Dashboard

```tsx
// pages/Dashboard.tsx
import { useState } from 'react';
import { GrupoSelect } from '@/components/GrupoSelect';
import { dashboardService } from '@/services/dashboardService';

export function Dashboard() {
  const [grupoId, setGrupoId] = useState<number | null>(null);
  const [indicadores, setIndicadores] = useState(null);

  async function loadIndicadores() {
    const data = await dashboardService.getIndicadores({
      grupo_id: grupoId ?? undefined,
    });
    setIndicadores(data);
  }

  useEffect(() => {
    loadIndicadores();
  }, [grupoId]);

  return (
    <div>
      <div className="filters">
        <GrupoSelect value={grupoId} onChange={setGrupoId} />
      </div>

      {/* Renderizar indicadores */}
      {indicadores && (
        <div className="metrics">
          <MetricCard title="Total Vendas" value={indicadores.total_vendas} />
          <MetricCard title="Valor Vendas" value={indicadores.valor_total_vendas} />
          {/* ... */}
        </div>
      )}
    </div>
  );
}
```

---

### Passo 6: Tela de Gerenciamento de Grupos (Admin)

```tsx
// pages/admin/Grupos.tsx
import { useState, useEffect } from 'react';
import { grupoService } from '@/services/grupoService';
import { EmpreendimentoGrupoWithMembros } from '@/types/grupo';

export function GruposPage() {
  const [grupos, setGrupos] = useState<EmpreendimentoGrupoWithMembros[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nome_grupo: '',
    descricao: '',
    ativo: true,
  });

  async function loadGrupos() {
    const data = await grupoService.list();
    setGrupos(data);
  }

  async function handleCreate() {
    await grupoService.create(formData);
    setShowModal(false);
    loadGrupos();
  }

  async function handleDelete(id: number) {
    if (confirm('Tem certeza? Empreendimentos vinculados serão desvinculados.')) {
      await grupoService.delete(id);
      loadGrupos();
    }
  }

  useEffect(() => {
    loadGrupos();
  }, []);

  return (
    <div>
      <button onClick={() => setShowModal(true)}>Novo Grupo</button>

      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Empreendimentos</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {grupos.map((grupo) => (
            <tr key={grupo.id}>
              <td>{grupo.nome_grupo}</td>
              <td>{grupo.descricao}</td>
              <td>{grupo.total_empreendimentos}</td>
              <td>{grupo.ativo ? 'Ativo' : 'Inativo'}</td>
              <td>
                <button onClick={() => handleDelete(grupo.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de criação */}
    </div>
  );
}
```

---

### Passo 7: Vincular Empreendimentos a Grupos

```tsx
// components/EmpreendimentoGrupoForm.tsx
export function EmpreendimentoGrupoForm({ empreendimento }: { empreendimento: Empreendimento }) {
  const [grupoId, setGrupoId] = useState(empreendimento.empreendimento_grupo_id);

  async function handleSave() {
    await empreendimentoService.update(empreendimento.id, {
      empreendimento_grupo_id: grupoId,
    });
    // Feedback de sucesso
  }

  return (
    <div>
      <label>Grupo:</label>
      <GrupoSelect value={grupoId} onChange={setGrupoId} />
      <button onClick={handleSave}>Salvar</button>
    </div>
  );
}
```

---

### Passo 8: Criar Metas por Grupo

```tsx
// pages/Metas.tsx
export function MetasPage() {
  const [grupoId, setGrupoId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    mes: 1,
    ano: 2025,
    meta_vendas: 0,
    meta_unidades: 0,
  });

  async function handleCreate() {
    if (!grupoId) {
      alert('Selecione um grupo!');
      return;
    }

    await metaService.create({
      empreendimento_grupo_id: grupoId,  // ← OBRIGATÓRIO
      empreendimento_id: null,  // ← SEMPRE NULL
      ...formData,
    });
  }

  return (
    <div>
      <h2>Criar Meta (por Grupo)</h2>

      <GrupoSelect value={grupoId} onChange={setGrupoId} placeholder="Selecione o grupo *" />

      <input
        type="number"
        placeholder="Mês (1-12)"
        value={formData.mes}
        onChange={(e) => setFormData({ ...formData, mes: Number(e.target.value) })}
      />

      <input
        type="number"
        placeholder="Ano"
        value={formData.ano}
        onChange={(e) => setFormData({ ...formData, ano: Number(e.target.value) })}
      />

      <input
        type="number"
        placeholder="Meta de Vendas (R$)"
        value={formData.meta_vendas}
        onChange={(e) => setFormData({ ...formData, meta_vendas: Number(e.target.value) })}
      />

      <input
        type="number"
        placeholder="Meta de Unidades"
        value={formData.meta_unidades}
        onChange={(e) => setFormData({ ...formData, meta_unidades: Number(e.target.value) })}
      />

      <button onClick={handleCreate}>Criar Meta</button>
    </div>
  );
}
```

---

## ✅ Checklist de Implementação

### Backend (Já Implementado)
- [x] Migrations criadas e aplicadas
- [x] Models ajustados (Empreendimento, Meta, EmpreendimentoGrupo)
- [x] Schemas ajustados
- [x] Repository e Service criados
- [x] Endpoints CRUD criados
- [x] DashboardService ajustado (parcial - helper method criado)
- [x] Validações implementadas

### Frontend (A Fazer)
- [ ] Criar tipos TypeScript para `EmpreendimentoGrupo`
- [ ] Ajustar tipo `Empreendimento` (adicionar `empreendimento_grupo_id`)
- [ ] Ajustar tipo `Meta` (adicionar `empreendimento_grupo_id`)
- [ ] Criar `grupoService.ts`
- [ ] Ajustar `dashboardService.ts` (adicionar `grupo_id` nos métodos)
- [ ] Criar componente `GrupoSelect`
- [ ] Criar página de gerenciamento de grupos (admin)
- [ ] Ajustar página de Dashboard (adicionar filtro por grupo)
- [ ] Ajustar formulário de criação de metas (usar `grupo_id` ao invés de `empreendimento_id`)
- [ ] Ajustar visualização de empreendimentos (permitir vincular a grupo)
- [ ] Atualizar testes (se houver)

---

## 🚨 Pontos de Atenção

### 1. Metas Antigas (Migração de Dados)
**Problema:** Metas criadas antes da mudança têm `empreendimento_id` preenchido.

**Solução:**
- Backend aceita ambos (backward compatible)
- Frontend deve mostrar aviso ao admin para migrar metas antigas para grupos
- Criar ferramenta de migração (opcional)

### 2. Dashboard - Compatibilidade
**Opção 1 (Recomendada):** Migrar 100% para grupos
- Remover filtro por `empreendimento_id`
- Usar apenas `grupo_id`
- Criar grupos "individuais" para empreendimentos sem fase

**Opção 2 (Transição gradual):** Manter ambos
- Permitir filtro por `empreendimento_id` OU `grupo_id`
- Marcar `empreendimento_id` como deprecated
- Remover em versão futura

### 3. Sincronização (Mega API)
**Importante:** A sincronização NÃO preenche `empreendimento_grupo_id` automaticamente.

**Fluxo:**
1. Sync traz empreendimentos do Mega (sem grupo)
2. Admin cria grupos manualmente via interface
3. Admin vincula empreendimentos aos grupos

**TODO futuro:** Implementar lógica de auto-agrupamento por padrão no nome (opcional).

---

## 📞 Suporte

**Dúvidas ou problemas?**
- Consultar documentação completa em `/docs`
- Abrir issue no repositório
- Contatar equipe de backend

---

**Boa implementação! 🚀**
