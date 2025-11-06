# 📊 API de Metas - Documentação Frontend

> Documentação completa dos endpoints de gerenciamento de metas para integração com o frontend.

**Versão:** 1.0
**Base URL:** `/api/v1/metas`
**Autenticação:** Bearer Token (JWT) obrigatório em todos os endpoints

---

## 📑 Índice

1. [Overview](#overview)
2. [Endpoints CRUD](#endpoints-crud)
3. [Importação de Metas](#importação-de-metas)
4. [Download de Template](#download-de-template)
5. [Schemas](#schemas)
6. [Estrutura da Planilha](#estrutura-da-planilha)
7. [Exemplos de Integração](#exemplos-de-integração)
8. [Casos de Uso](#casos-de-uso)

---

## Overview

A API de Metas permite gerenciar metas de vendas (VGV) e unidades por empreendimento e por mês/ano.

### Características

- ✅ **CRUD completo** - Criar, ler, atualizar e deletar metas individuais
- ✅ **Importação em massa** - Upload de planilha Excel com múltiplas metas
- ✅ **Template gerado automaticamente** - Download de planilha pré-formatada
- ✅ **Metas consolidadas** - Suporte para metas gerais (sem empreendimento específico)
- ✅ **Validações** - Verifica duplicatas, empreendimentos inválidos, etc.

### Permissões

| Endpoint | Permissão Requerida |
|----------|-------------------|
| `GET /metas/` | Usuário autenticado |
| `GET /metas/{id}` | Usuário autenticado |
| `GET /metas/template/{ano}` | Usuário autenticado |
| `POST /metas/` | **Admin** |
| `POST /metas/importar` | **Admin** |
| `PUT /metas/{id}` | **Admin** |
| `DELETE /metas/{id}` | **Admin** |

---

## Endpoints CRUD

### 1. Listar Metas

Lista metas com filtros e paginação.

**Request:**
```http
GET /api/v1/metas/?skip=0&limit=100&empreendimento_id=5&ano=2025
Authorization: Bearer {token}
```

**Query Parameters:**

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `skip` | integer | Não | Offset para paginação (padrão: 0) |
| `limit` | integer | Não | Limite de resultados (padrão: 100, max: 100) |
| `empreendimento_id` | integer | Não | Filtrar por ID do empreendimento |
| `ano` | integer | Não | Filtrar por ano |

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "empreendimento_id": 5,
    "mes": 1,
    "ano": 2025,
    "meta_vendas": "500000.00",
    "meta_unidades": 10,
    "created_at": "2025-11-06T10:00:00Z",
    "updated_at": "2025-11-06T10:00:00Z"
  },
  {
    "id": 2,
    "empreendimento_id": null,
    "mes": 1,
    "ano": 2025,
    "meta_vendas": "2000000.00",
    "meta_unidades": 50,
    "created_at": "2025-11-06T10:00:00Z",
    "updated_at": "2025-11-06T10:00:00Z"
  }
]
```

**Nota:** `empreendimento_id: null` representa **meta consolidada** (geral).

---

### 2. Buscar Meta por ID

Retorna uma meta específica.

**Request:**
```http
GET /api/v1/metas/1
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "empreendimento_id": 5,
  "mes": 1,
  "ano": 2025,
  "meta_vendas": "500000.00",
  "meta_unidades": 10,
  "created_at": "2025-11-06T10:00:00Z",
  "updated_at": "2025-11-06T10:00:00Z"
}
```

**Errors:**
- `404 Not Found` - Meta não encontrada

---

### 3. Criar Meta

Cria uma nova meta. **Requer permissão de Admin.**

**Request:**
```http
POST /api/v1/metas/
Authorization: Bearer {token}
Content-Type: application/json

{
  "empreendimento_id": 5,
  "mes": 1,
  "ano": 2025,
  "meta_vendas": "500000.00",
  "meta_unidades": 10
}
```

**Request Body:**

| Campo | Tipo | Obrigatório | Validação |
|-------|------|-------------|-----------|
| `empreendimento_id` | integer \| null | Não | ID válido ou `null` para consolidado |
| `mes` | integer | Sim | 1-12 |
| `ano` | integer | Sim | 2020-2100 |
| `meta_vendas` | decimal | Sim | > 0 |
| `meta_unidades` | integer | Sim | > 0 |

**Response:** `201 Created`
```json
{
  "id": 1,
  "empreendimento_id": 5,
  "mes": 1,
  "ano": 2025,
  "meta_vendas": "500000.00",
  "meta_unidades": 10,
  "created_at": "2025-11-06T10:00:00Z",
  "updated_at": "2025-11-06T10:00:00Z"
}
```

**Errors:**
- `400 Bad Request` - Validação falhou ou meta já existe para este empreendimento/mês/ano
- `403 Forbidden` - Usuário não é admin

---

### 4. Atualizar Meta

Atualiza uma meta existente. **Requer permissão de Admin.**

**Request:**
```http
PUT /api/v1/metas/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "meta_vendas": "600000.00",
  "meta_unidades": 12
}
```

**Request Body:** (todos os campos são opcionais)

| Campo | Tipo | Validação |
|-------|------|-----------|
| `mes` | integer | 1-12 |
| `ano` | integer | 2020-2100 |
| `meta_vendas` | decimal | > 0 |
| `meta_unidades` | integer | > 0 |

**Response:** `200 OK`
```json
{
  "id": 1,
  "empreendimento_id": 5,
  "mes": 1,
  "ano": 2025,
  "meta_vendas": "600000.00",
  "meta_unidades": 12,
  "created_at": "2025-11-06T10:00:00Z",
  "updated_at": "2025-11-06T10:30:00Z"
}
```

**Errors:**
- `404 Not Found` - Meta não encontrada
- `403 Forbidden` - Usuário não é admin

---

### 5. Deletar Meta

Remove uma meta. **Requer permissão de Admin.**

**Request:**
```http
DELETE /api/v1/metas/1
Authorization: Bearer {token}
```

**Response:** `204 No Content`

**Errors:**
- `404 Not Found` - Meta não encontrada
- `403 Forbidden` - Usuário não é admin

---

## Importação de Metas

### Importar Planilha Excel

Importa múltiplas metas de uma planilha Excel. **Requer permissão de Admin.**

**Request:**
```http
POST /api/v1/metas/importar?ano=2025
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: [arquivo Excel]
```

**Query Parameters:**

| Parâmetro | Tipo | Obrigatório | Validação |
|-----------|------|-------------|-----------|
| `ano` | integer | Sim | 2020-2100 |

**Request Body:**
- `file`: Arquivo Excel (.xlsx ou .xls) seguindo o formato do template

**Response:** `200 OK`
```json
{
  "total_registros": 36,
  "importados": 30,
  "atualizados": 6,
  "erros": [
    "Empreendimento 'Lote Fantasma' não encontrado",
    "Erro ao processar 'Lote Verde' - Mês 13: Mês deve estar entre 1 e 12"
  ]
}
```

**Response Fields:**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `total_registros` | integer | Total de registros processados |
| `importados` | integer | Novas metas criadas com sucesso |
| `atualizados` | integer | Metas existentes atualizadas |
| `erros` | array[string] | Lista de erros encontrados (não bloqueia importação) |

**Comportamento:**
- ✅ **Cria** novas metas se não existirem
- ✅ **Atualiza** metas existentes (mesmo empreendimento/mês/ano)
- ✅ **Valida** empreendimentos antes de importar
- ✅ **Continua** processando mesmo com erros (não é transacional por seção)
- ⚠️ **Commit** só acontece se houver pelo menos 1 sucesso

**Errors:**
- `400 Bad Request` - Arquivo não é Excel, estrutura inválida
- `403 Forbidden` - Usuário não é admin
- `500 Internal Server Error` - Erro ao processar planilha

---

## Download de Template

### Gerar Template Excel

Gera uma planilha Excel pré-formatada com todos os empreendimentos ativos.

**Request:**
```http
GET /api/v1/metas/template?ano=2025
Authorization: Bearer {token}
```

**Query Parameters:**

| Parâmetro | Tipo | Obrigatório | Validação |
|-----------|------|-------------|-----------|
| `ano` | integer | Não | 2020-2100 (padrão: ano atual) |

**Response:** `200 OK`
```
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
Content-Disposition: attachment; filename=template_metas_2025.xlsx

[Binary Excel file]
```

**Estrutura do Template:**
- Seção "Consolidado" (meta geral)
- Seções para cada empreendimento ativo (ordenados por nome)
- Formato pronto para preenchimento e upload via `/importar`

**Comportamento:**
- ✅ **Com `ano`**: Nome do arquivo `template_metas_2025.xlsx` e aba `"Metas 2025"`
- ✅ **Sem `ano`**: Nome do arquivo `template_metas.xlsx` e aba `"Metas {ano_atual}"`

**Errors:**
- `500 Internal Server Error` - Erro ao gerar template

---

## Schemas

### MetaResponse

```typescript
interface MetaResponse {
  id: number;
  empreendimento_id: number | null;  // null = meta consolidada
  mes: number;                        // 1-12
  ano: number;                        // 2020-2100
  meta_vendas: string;                // Decimal como string
  meta_unidades: number;
  created_at: string;                 // ISO 8601
  updated_at: string;                 // ISO 8601
}
```

### MetaCreate

```typescript
interface MetaCreate {
  empreendimento_id?: number | null;  // Opcional, null = consolidado
  mes: number;                        // 1-12, obrigatório
  ano: number;                        // 2020-2100, obrigatório
  meta_vendas: string | number;       // > 0, obrigatório
  meta_unidades: number;              // > 0, obrigatório
}
```

### MetaUpdate

```typescript
interface MetaUpdate {
  mes?: number;                       // 1-12, opcional
  ano?: number;                       // 2020-2100, opcional
  meta_vendas?: string | number;      // > 0, opcional
  meta_unidades?: number;             // > 0, opcional
}
```

### MetaImportResult

```typescript
interface MetaImportResult {
  total_registros: number;            // Total processado
  importados: number;                 // Novos criados
  atualizados: number;                // Existentes atualizados
  erros: string[];                    // Lista de erros
}
```

---

## Estrutura da Planilha

### Formato Esperado

A planilha Excel deve seguir esta estrutura:

```
┌───────┬────────────────────┬─────┬─────┬─────┬─────┬─────┬─────┐
│   A   │         B          │  C  │  D  │  E  │ ... │  N  │
├───────┼────────────────────┼─────┼─────┼─────┼─────┼─────┼─────┤
│ Linha │                    │ Jan │ Fev │ Mar │ ... │ Dez │  1
├───────┼────────────────────┼─────┼─────┼─────┼─────┼─────┼─────┤
│       │ Consolidado        │     │     │     │     │     │  2
│       │ Meta VGV (R$)      │ 100 │ 200 │ 300 │ ... │ 500 │  3
│       │ Meta lotes (#)     │  10 │  20 │  30 │ ... │  50 │  4
├───────┼────────────────────┼─────┼─────┼─────┼─────┼─────┼─────┤
│       │ [vazio opcional]   │     │     │     │     │     │  5
├───────┼────────────────────┼─────┼─────┼─────┼─────┼─────┼─────┤
│       │ Lote Verde (123)   │     │     │     │     │     │  6
│       │ Meta VGV (R$)      │  50 │ 100 │ 150 │ ... │ 250 │  7
│       │ Meta lotes (#)     │   5 │  10 │  15 │ ... │  25 │  8
├───────┼────────────────────┼─────┼─────┼─────┼─────┼─────┼─────┤
│       │ [vazio opcional]   │     │     │     │     │     │  9
├───────┼────────────────────┼─────┼─────┼─────┼─────┼─────┼─────┤
│       │ Lote Azul (456)    │     │     │     │     │     │  10
│       │ Meta VGV (R$)      │  30 │  60 │  90 │ ... │ 150 │  11
│       │ Meta lotes (#)     │   3 │   6 │   9 │ ... │  15 │  12
└───────┴────────────────────┴─────┴─────┴─────┴─────┴─────┴─────┘
```

### Especificações

#### Linha 1 - Cabeçalho
- **Coluna A:** Vazia
- **Coluna B:** Vazia
- **Colunas C-N:** Nomes dos meses (Jan, Fev, Mar, ..., Dez)

#### Cada Seção (3 linhas)
1. **Linha N:** Nome do empreendimento
   - **Formato 1:** Nome do empreendimento (ex: "Lote Verde")
   - **Formato 2:** Código do empreendimento (ex: "123")
   - **Formato 3:** Nome + código (ex: "Lote Verde (123)")
   - **Especial:** "Consolidado" para meta geral

2. **Linha N+1:** Meta VGV (R$)
   - Coluna B: "Meta VGV (R$)"
   - Colunas C-N: Valores em Reais para cada mês

3. **Linha N+2:** Meta Lotes (#)
   - Coluna B: "Meta lotes (#)"
   - Colunas C-N: Quantidade de unidades para cada mês

#### Linhas Vazias (Opcional)
- Linhas em branco entre seções são **permitidas** e **ignoradas**
- Servem apenas para legibilidade visual

### Busca de Empreendimentos

O sistema identifica empreendimentos de duas formas:

| Valor na Coluna B | Como é Buscado |
|-------------------|----------------|
| Número (ex: `123`) | Busca por `codigo_mega` exato |
| String (ex: `"Lote Verde"`) | Busca por `nome` (case insensitive, ILIKE `%Lote Verde%`) |
| `"Consolidado"` | Meta geral (`empreendimento_id = NULL`) |

**Exemplos válidos:**
- ✅ `123` → Busca empreendimento com `codigo_mega = 123`
- ✅ `Lote Verde` → Busca empreendimento com nome contendo "Lote Verde"
- ✅ `Lote Verde (123)` → Tenta número primeiro (falha), depois busca por nome
- ✅ `Consolidado` → Meta geral sem empreendimento

### Validações

Durante a importação, o sistema valida:

- ✅ **Estrutura:** Mínimo 3 linhas e 14 colunas (A, B + 12 meses)
- ✅ **Empreendimento:** Deve existir no banco de dados
- ✅ **Valores numéricos:** Meta VGV e lotes devem ser números válidos
- ✅ **Mês:** Implicitamente validado pela estrutura (colunas fixas)

**Valores vazios ou zero:**
- Células vazias são tratadas como `0`
- Se ambos (VGV e lotes) forem `0`, o registro é **pulado** (não importado)

---

## Exemplos de Integração

### React + TypeScript

```typescript
import { useState } from 'react';

interface MetaImportResult {
  total_registros: number;
  importados: number;
  atualizados: number;
  erros: string[];
}

export function MetaImportForm() {
  const [ano, setAno] = useState<number>(2025);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<MetaImportResult | null>(null);
  const [loading, setLoading] = useState(false);

  // Download template
  const handleDownloadTemplate = async () => {
    const token = localStorage.getItem('token');

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/v1/metas/template?ano=${ano}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Erro ao baixar template');
    }

    // Trigger download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `template_metas_${ano}.xlsx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  // Upload planilha
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/metas/importar?ano=${ano}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Erro na importação');
      }

      const data: MetaImportResult = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao importar metas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="meta-import-form">
      <h2>Importar Metas</h2>

      {/* Seletor de ano */}
      <div>
        <label>Ano:</label>
        <select value={ano} onChange={(e) => setAno(Number(e.target.value))}>
          {Array.from({ length: 10 }, (_, i) => 2020 + i).map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* Download template */}
      <button onClick={handleDownloadTemplate}>
        Baixar Template {ano}
      </button>

      {/* Upload form */}
      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button type="submit" disabled={!file || loading}>
          {loading ? 'Importando...' : 'Importar'}
        </button>
      </form>

      {/* Resultado */}
      {result && (
        <div className="result">
          <h3>Resultado da Importação</h3>
          <p>Total processado: {result.total_registros}</p>
          <p>✅ Importados: {result.importados}</p>
          <p>🔄 Atualizados: {result.atualizados}</p>

          {result.erros.length > 0 && (
            <div className="errors">
              <h4>⚠️ Erros encontrados:</h4>
              <ul>
                {result.erros.map((erro, i) => (
                  <li key={i}>{erro}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

### Vue 3 + TypeScript

```vue
<template>
  <div class="meta-import">
    <h2>Importar Metas</h2>

    <!-- Seletor de ano -->
    <div class="form-group">
      <label>Ano:</label>
      <select v-model="ano">
        <option v-for="y in anos" :key="y" :value="y">{{ y }}</option>
      </select>
    </div>

    <!-- Download template -->
    <button @click="downloadTemplate" class="btn-primary">
      Baixar Template {{ ano }}
    </button>

    <!-- Upload form -->
    <form @submit.prevent="uploadMetas">
      <input
        type="file"
        accept=".xlsx,.xls"
        @change="handleFileChange"
        ref="fileInput"
      />
      <button type="submit" :disabled="!file || loading" class="btn-success">
        {{ loading ? 'Importando...' : 'Importar' }}
      </button>
    </form>

    <!-- Resultado -->
    <div v-if="result" class="result">
      <h3>Resultado da Importação</h3>
      <p>Total processado: {{ result.total_registros }}</p>
      <p>✅ Importados: {{ result.importados }}</p>
      <p>🔄 Atualizados: {{ result.atualizados }}</p>

      <div v-if="result.erros.length > 0" class="errors">
        <h4>⚠️ Erros encontrados:</h4>
        <ul>
          <li v-for="(erro, i) in result.erros" :key="i">{{ erro }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';

interface MetaImportResult {
  total_registros: number;
  importados: number;
  atualizados: number;
  erros: string[];
}

const authStore = useAuthStore();
const ano = ref(2025);
const file = ref<File | null>(null);
const result = ref<MetaImportResult | null>(null);
const loading = ref(false);

const anos = computed(() =>
  Array.from({ length: 10 }, (_, i) => 2020 + i)
);

const API_URL = import.meta.env.VITE_API_URL;

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  file.value = target.files?.[0] || null;
};

const downloadTemplate = async () => {
  try {
    const response = await fetch(
      `${API_URL}/api/v1/metas/template?ano=${ano.value}`,
      {
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      }
    );

    if (!response.ok) throw new Error('Erro ao baixar template');

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `template_metas_${ano.value}.xlsx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao baixar template');
  }
};

const uploadMetas = async () => {
  if (!file.value) return;

  loading.value = true;
  const formData = new FormData();
  formData.append('file', file.value);

  try {
    const response = await fetch(
      `${API_URL}/api/v1/metas/importar?ano=${ano.value}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        },
        body: formData
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Erro na importação');
    }

    result.value = await response.json();
  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao importar metas');
  } finally {
    loading.value = false;
  }
};
</script>
```

### JavaScript Vanilla

```javascript
// Download template
async function downloadTemplate(ano) {
  const token = localStorage.getItem('token');
  const url = ano
    ? `http://localhost:8000/api/v1/metas/template?ano=${ano}`
    : `http://localhost:8000/api/v1/metas/template`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Erro ao baixar template');
  }

  // Download
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `template_metas_${ano}.xlsx`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

// Upload planilha
async function uploadMetas(file, ano) {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(
    `http://localhost:8000/api/v1/metas/importar?ano=${ano}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Erro na importação');
  }

  return await response.json();
}

// Listar metas
async function listarMetas(filters = {}) {
  const token = localStorage.getItem('token');
  const params = new URLSearchParams(filters).toString();

  const response = await fetch(
    `http://localhost:8000/api/v1/metas/?${params}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    throw new Error('Erro ao listar metas');
  }

  return await response.json();
}

// Atualizar meta
async function atualizarMeta(metaId, data) {
  const token = localStorage.getItem('token');

  const response = await fetch(
    `http://localhost:8000/api/v1/metas/${metaId}`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Erro ao atualizar meta');
  }

  return await response.json();
}
```

---

## Casos de Uso

### 1. Tela de Importação de Metas

**Funcionalidade:**
- Seletor de ano (dropdown 2020-2100)
- Botão "Baixar Template"
- Upload de arquivo Excel
- Exibição de resultado (sucessos/erros)

**Fluxo:**
1. Usuário seleciona ano (ex: 2025)
2. Clica em "Baixar Template" → `GET /metas/template?ano=2025` (ano opcional)
3. Sistema gera Excel com empreendimentos ativos
4. Usuário preenche planilha offline
5. Usuário faz upload → `POST /metas/importar?ano=2025`
6. Sistema processa e retorna resultado
7. Frontend exibe: X importados, Y atualizados, Z erros

**UI Sugerida:**
```
┌─────────────────────────────────────────┐
│ 📊 Importar Metas                       │
├─────────────────────────────────────────┤
│                                         │
│ Ano: [2025 ▼]                          │
│                                         │
│ [📥 Baixar Template 2025]              │
│                                         │
│ Enviar planilha preenchida:            │
│ [Escolher arquivo...]  [Importar]      │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ ✅ Resultado da Importação          │ │
│ │                                     │ │
│ │ Total: 36 registros                 │ │
│ │ ✅ Importados: 30                   │ │
│ │ 🔄 Atualizados: 6                   │ │
│ │                                     │ │
│ │ ⚠️ Erros (2):                       │ │
│ │ • Empreendimento 'X' não encontrado │ │
│ │ • Mês 13 inválido para 'Y'          │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

### 2. Grid de Edição de Metas

**Funcionalidade:**
- Listar metas com filtros
- Editar metas individuais inline
- Criar nova meta manualmente

**Fluxo:**
1. Carregar metas → `GET /metas/?ano=2025&empreendimento_id=5`
2. Exibir grid com metas do empreendimento
3. Usuário clica para editar → modo inline edit
4. Salvar → `PUT /metas/{id}`

**UI Sugerida:**
```
┌──────────────────────────────────────────────────────────────┐
│ 📊 Metas - Lote Verde                                        │
├──────────────────────────────────────────────────────────────┤
│ Ano: [2025 ▼]  [+ Nova Meta]                                │
├─────┬─────┬─────────────────┬────────────────┬──────────────┤
│ Mês │ Ano │ Meta VGV (R$)   │ Meta Unidades  │ Ações        │
├─────┼─────┼─────────────────┼────────────────┼──────────────┤
│ Jan │2025 │ R$ 500.000,00   │ 10             │ [✏️] [🗑️]   │
│ Fev │2025 │ R$ 600.000,00   │ 12             │ [✏️] [🗑️]   │
│ Mar │2025 │ R$ 550.000,00   │ 11             │ [✏️] [🗑️]   │
└─────┴─────┴─────────────────┴────────────────┴──────────────┘
```

---

### 3. Dashboard com Metas vs Realizado

**Funcionalidade:**
- Comparar vendas realizadas vs meta
- Exibir progresso mensal/anual
- Calcular % de atingimento

**Fluxo:**
1. Carregar metas → `GET /metas/?ano=2025&empreendimento_id=5`
2. Carregar vendas → `GET /vendas/?ano=2025&empreendimento_id=5`
3. Calcular progresso:
   - `progresso = (vendas_realizadas / meta_vendas) * 100`
   - `status = progresso >= 100 ? 'atingiu' : 'abaixo'`

**UI Sugerida:**
```
┌────────────────────────────────────────┐
│ 📊 Desempenho vs Meta - Janeiro 2025  │
├────────────────────────────────────────┤
│                                        │
│ Meta:       R$ 500.000,00              │
│ Realizado:  R$ 480.000,00              │
│ Progresso:  96% [████████░░]          │
│                                        │
│ ⚠️ Faltam R$ 20.000,00 para a meta    │
└────────────────────────────────────────┘
```

---

### 4. Cópia de Metas de Ano Anterior

**Funcionalidade:**
- Copiar metas de 2024 para 2025
- Aplicar ajuste percentual opcional

**Fluxo:**
1. Listar metas de 2024 → `GET /metas/?ano=2024`
2. Para cada meta:
   - Criar nova com `ano=2025`
   - Aplicar ajuste: `nova_meta = meta_2024 * (1 + ajuste%)`
   - `POST /metas/` para cada

**Nota:** Este endpoint não existe ainda. Implementar se necessário.

---

## Notas Importantes

### Performance

- **Paginação:** Use `skip` e `limit` para grandes volumes
- **Filtros:** Sempre que possível, filtre por `ano` e `empreendimento_id`
- **Importação:** Planilhas grandes (>500 registros) podem levar alguns segundos

### Validações Frontend

Recomendações para validar no frontend antes de enviar:

- ✅ Arquivo é Excel (.xlsx ou .xls)
- ✅ Tamanho < 10MB
- ✅ Ano entre 2020-2100
- ✅ Mês entre 1-12
- ✅ Valores > 0

### Tratamento de Erros

**Códigos HTTP comuns:**

| Código | Significado | Ação Sugerida |
|--------|-------------|---------------|
| 200 | Sucesso | Exibir resultado |
| 201 | Criado | Confirmar criação |
| 204 | Deletado | Remover da lista |
| 400 | Validação falhou | Exibir erros ao usuário |
| 401 | Não autenticado | Redirecionar para login |
| 403 | Sem permissão | Exibir "Acesso negado" |
| 404 | Não encontrado | Exibir "Meta não encontrada" |
| 500 | Erro interno | Exibir "Erro no servidor" |

### Segurança

- ✅ **Sempre** incluir token JWT no header `Authorization: Bearer {token}`
- ✅ **Nunca** expor token em logs ou URLs
- ✅ **Validar** permissões de admin antes de exibir botões de admin
- ✅ **Sanitizar** inputs do usuário

---

## Suporte

Para dúvidas ou problemas com a API:

1. Verificar esta documentação
2. Testar endpoints no Swagger: `http://localhost:8000/docs`
3. Verificar logs do backend
4. Contatar equipe de desenvolvimento

---

**Última atualização:** 06/11/2025
**Versão da API:** v1
