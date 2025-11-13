# 📊 API de Exportação CSV/XLSX - Documentação Frontend

> **Versão:** 1.0
> **Data:** 13/11/2024
> **Base URL:** `http://localhost:8000/api/v1/export`

---

## 📋 Visão Geral

A API de exportação permite baixar dados de **Vendas** e **Propostas** nos formatos **CSV** ou **XLSX** (Excel), com filtros compatíveis com o dashboard.

### Características

✅ Autenticação obrigatória (Bearer token JWT)
✅ Suporte a CSV e XLSX
✅ Filtros por período (data_inicio, data_fim)
✅ Filtro por empreendimento (opcional - None exporta todos)
✅ Todos os campos dos modelos incluídos
✅ Datas formatadas em padrão brasileiro (DD/MM/YYYY HH:MM)
✅ Streaming de arquivos para download

---

## 🔐 Autenticação

**Todos os endpoints requerem autenticação via Bearer Token JWT.**

### Exemplo de Header

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Como obter o token

1. Fazer login na API: `POST /api/v1/auth/login`
2. Receber o `access_token` na resposta
3. Incluir no header `Authorization: Bearer {access_token}`

---

## 📡 Endpoints Disponíveis

### 1. Exportar Vendas

**Endpoint:** `GET /api/v1/export/vendas`

Exporta todas as vendas com filtros opcionais.

#### Query Parameters

| Parâmetro | Tipo | Obrigatório | Default | Descrição |
|-----------|------|-------------|---------|-----------|
| `formato` | string | Não | `xlsx` | Formato do arquivo (`csv` ou `xlsx`) |
| `data_inicio` | datetime | Não | `null` | Data inicial (ISO 8601). Filtra `data_venda >= data_inicio` |
| `data_fim` | datetime | Não | `null` | Data final (ISO 8601). Filtra `data_venda <= data_fim` |
| `empreendimento_id` | integer | Não | `null` | ID do empreendimento. `null` = todos |

#### Campos Exportados (17 colunas)

| # | Nome da Coluna | Tipo | Descrição |
|---|----------------|------|-----------|
| 1 | ID | int | ID interno da venda |
| 2 | Código Mega | int | Código da venda no sistema Mega ERP |
| 3 | Empreendimento ID | int | ID do empreendimento |
| 4 | Empreendimento | string | Nome do empreendimento |
| 5 | Proposta ID | int | ID da proposta relacionada (pode estar vazio) |
| 6 | Cliente | string | Nome completo do cliente |
| 7 | CPF | string | CPF do cliente |
| 8 | Unidade | string | Número/código da unidade |
| 9 | Bloco | string | Bloco/torre |
| 10 | Valor | float | Valor da venda (R$) |
| 11 | Data Venda | string | Data da venda (formato: DD/MM/YYYY HH:MM) |
| 12 | Status | string | Status da venda (Ativa, Distratada, Quitada) |
| 13 | Forma Pagamento | string | Forma de pagamento |
| 14 | Vendedor | string | Nome do vendedor |
| 15 | Observações | string | Observações adicionais |
| 16 | Criado Em | string | Data de criação do registro (DD/MM/YYYY HH:MM) |
| 17 | Atualizado Em | string | Data de última atualização (DD/MM/YYYY HH:MM) |

#### Exemplos de Uso

##### JavaScript (Fetch API)

```javascript
// Exportar todas as vendas em XLSX
async function exportarVendas() {
  const token = localStorage.getItem('access_token');

  const response = await fetch(
    'http://localhost:8000/api/v1/export/vendas?formato=xlsx',
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  if (response.ok) {
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vendas_${new Date().toISOString().split('T')[0]}.xlsx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } else {
    console.error('Erro ao exportar:', response.statusText);
  }
}
```

##### React/Next.js com Axios

```typescript
import axios from 'axios';

interface ExportVendasParams {
  formato?: 'csv' | 'xlsx';
  data_inicio?: string; // ISO 8601: "2024-01-01T00:00:00"
  data_fim?: string;
  empreendimento_id?: number;
}

async function exportarVendas(params: ExportVendasParams) {
  const token = localStorage.getItem('access_token');

  try {
    const response = await axios.get(
      'http://localhost:8000/api/v1/export/vendas',
      {
        params: {
          formato: params.formato || 'xlsx',
          data_inicio: params.data_inicio,
          data_fim: params.data_fim,
          empreendimento_id: params.empreendimento_id,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob', // IMPORTANTE: define tipo de resposta como blob
      }
    );

    // Criar link de download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;

    // Nome do arquivo com timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const extension = params.formato === 'csv' ? 'csv' : 'xlsx';
    link.setAttribute('download', `vendas_${timestamp}.${extension}`);

    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erro ao exportar vendas:', error);
    throw error;
  }
}

// Uso:
// Exportar todas as vendas
await exportarVendas({ formato: 'csv' });

// Exportar vendas de um empreendimento específico
await exportarVendas({
  formato: 'xlsx',
  empreendimento_id: 5
});

// Exportar vendas de um período
await exportarVendas({
  formato: 'csv',
  data_inicio: '2024-01-01T00:00:00',
  data_fim: '2024-03-31T23:59:59',
});

// Exportar vendas de um empreendimento em um período
await exportarVendas({
  formato: 'xlsx',
  data_inicio: '2024-01-01T00:00:00',
  data_fim: '2024-03-31T23:59:59',
  empreendimento_id: 3,
});
```

##### cURL (Terminal)

```bash
# Exportar todas as vendas em CSV
curl -X GET "http://localhost:8000/api/v1/export/vendas?formato=csv" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  --output vendas.csv

# Exportar vendas filtradas por período em XLSX
curl -X GET "http://localhost:8000/api/v1/export/vendas?formato=xlsx&data_inicio=2024-01-01T00:00:00&data_fim=2024-03-31T23:59:59" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  --output vendas.xlsx

# Exportar vendas de um empreendimento específico
curl -X GET "http://localhost:8000/api/v1/export/vendas?formato=xlsx&empreendimento_id=5" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  --output vendas_empreendimento_5.xlsx
```

---

### 2. Exportar Propostas

**Endpoint:** `GET /api/v1/export/propostas`

Exporta todas as propostas com filtros opcionais.

#### Query Parameters

| Parâmetro | Tipo | Obrigatório | Default | Descrição |
|-----------|------|-------------|---------|-----------|
| `formato` | string | Não | `xlsx` | Formato do arquivo (`csv` ou `xlsx`) |
| `data_inicio` | datetime | Não | `null` | Data inicial (ISO 8601). Filtra `data_proposta >= data_inicio` |
| `data_fim` | datetime | Não | `null` | Data final (ISO 8601). Filtra `data_proposta <= data_fim` |
| `empreendimento_id` | integer | Não | `null` | ID do empreendimento. `null` = todos |
| `status` | string | Não | `null` | Status da proposta (ex: "Aberta", "Aprovada", "Rejeitada") |

#### Campos Exportados (16 colunas)

| # | Nome da Coluna | Tipo | Descrição |
|---|----------------|------|-----------|
| 1 | ID | int | ID interno da proposta |
| 2 | Código Mega | int | Código da proposta no sistema Mega ERP |
| 3 | Empreendimento ID | int | ID do empreendimento |
| 4 | Empreendimento | string | Nome do empreendimento |
| 5 | Cliente | string | Nome completo do cliente |
| 6 | CPF | string | CPF do cliente |
| 7 | Unidade | string | Número/código da unidade |
| 8 | Bloco | string | Bloco/torre |
| 9 | Valor | float | Valor da proposta (R$) |
| 10 | Data Proposta | string | Data da proposta (formato: DD/MM/YYYY HH:MM) |
| 11 | Status | string | Status (Aberta, Aprovada, Rejeitada, Convertida) |
| 12 | Origem | string | Origem da proposta (Online, Presencial, etc.) |
| 13 | Vendedor | string | Nome do vendedor |
| 14 | Observações | string | Observações adicionais |
| 15 | Criado Em | string | Data de criação do registro (DD/MM/YYYY HH:MM) |
| 16 | Atualizado Em | string | Data de última atualização (DD/MM/YYYY HH:MM) |

#### Exemplos de Uso

##### React Hook Customizado

```typescript
import { useState } from 'react';
import axios from 'axios';

interface ExportPropostasParams {
  formato?: 'csv' | 'xlsx';
  data_inicio?: string;
  data_fim?: string;
  empreendimento_id?: number;
  status?: string;
}

export function useExportPropostas() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportar = async (params: ExportPropostasParams = {}) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('access_token');

      const response = await axios.get(
        'http://localhost:8000/api/v1/export/propostas',
        {
          params: {
            formato: params.formato || 'xlsx',
            data_inicio: params.data_inicio,
            data_fim: params.data_fim,
            empreendimento_id: params.empreendimento_id,
            status: params.status,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob',
        }
      );

      // Download automático
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      const timestamp = new Date().toISOString().split('T')[0];
      const extension = params.formato === 'csv' ? 'csv' : 'xlsx';
      link.setAttribute('download', `propostas_${timestamp}.${extension}`);

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setLoading(false);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao exportar propostas');
      setLoading(false);
      return false;
    }
  };

  return { exportar, loading, error };
}

// Uso no componente:
function DashboardPropostas() {
  const { exportar, loading, error } = useExportPropostas();

  const handleExport = async () => {
    await exportar({
      formato: 'xlsx',
      status: 'Aprovada',
      data_inicio: '2024-01-01T00:00:00',
      data_fim: '2024-12-31T23:59:59',
    });
  };

  return (
    <button onClick={handleExport} disabled={loading}>
      {loading ? 'Exportando...' : 'Exportar Propostas'}
    </button>
  );
}
```

##### JavaScript Vanilla com Tratamento de Erros

```javascript
async function exportarPropostas(params = {}) {
  const token = localStorage.getItem('access_token');

  if (!token) {
    alert('Você precisa estar autenticado para exportar dados.');
    return;
  }

  // Construir URL com query params
  const url = new URL('http://localhost:8000/api/v1/export/propostas');

  if (params.formato) url.searchParams.append('formato', params.formato);
  if (params.data_inicio) url.searchParams.append('data_inicio', params.data_inicio);
  if (params.data_fim) url.searchParams.append('data_fim', params.data_fim);
  if (params.empreendimento_id) url.searchParams.append('empreendimento_id', params.empreendimento_id);
  if (params.status) url.searchParams.append('status', params.status);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Sessão expirada. Faça login novamente.');
      }
      if (response.status === 403) {
        throw new Error('Você não tem permissão para exportar dados.');
      }
      throw new Error(`Erro ao exportar: ${response.statusText}`);
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;

    const timestamp = new Date().toISOString().split('T')[0];
    const extension = params.formato === 'csv' ? 'csv' : 'xlsx';
    a.download = `propostas_${timestamp}.${extension}`;

    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(downloadUrl);

    console.log('Exportação concluída com sucesso!');
  } catch (error) {
    console.error('Erro na exportação:', error);
    alert(error.message);
  }
}

// Exemplos de uso:

// Exportar todas as propostas abertas
exportarPropostas({ formato: 'csv', status: 'Aberta' });

// Exportar propostas de um período específico
exportarPropostas({
  formato: 'xlsx',
  data_inicio: '2024-01-01T00:00:00',
  data_fim: '2024-03-31T23:59:59',
});
```

---

### 3. Exportar Relatório Completo

**Endpoint:** `GET /api/v1/export/relatorio-completo`

Exporta um arquivo Excel (XLSX) com **3 abas**: Vendas, Propostas e Empreendimentos.

#### Query Parameters

| Parâmetro | Tipo | Obrigatório | Default | Descrição |
|-----------|------|-------------|---------|-----------|
| `data_inicio` | datetime | Não | `null` | Data inicial para filtrar vendas e propostas |
| `data_fim` | datetime | Não | `null` | Data final para filtrar vendas e propostas |

**Nota:** Este endpoint **não** filtra por `empreendimento_id`. Exporta dados consolidados de todos os empreendimentos.

#### Estrutura do Arquivo

| Aba | Conteúdo | Filtros Aplicados |
|-----|----------|-------------------|
| **Vendas** | Todas as vendas | Filtradas por `data_inicio` e `data_fim` |
| **Propostas** | Todas as propostas | Filtradas por `data_inicio` e `data_fim` |
| **Empreendimentos** | Lista completa de empreendimentos | Sem filtros (todos) |

#### Exemplo de Uso

##### TypeScript com Axios

```typescript
async function exportarRelatorioCompleto(
  data_inicio?: string,
  data_fim?: string
) {
  const token = localStorage.getItem('access_token');

  try {
    const response = await axios.get(
      'http://localhost:8000/api/v1/export/relatorio-completo',
      {
        params: {
          data_inicio,
          data_fim,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;

    const timestamp = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `relatorio_completo_${timestamp}.xlsx`);

    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erro ao exportar relatório completo:', error);
    throw error;
  }
}

// Uso:
// Exportar relatório completo do ano de 2024
await exportarRelatorioCompleto(
  '2024-01-01T00:00:00',
  '2024-12-31T23:59:59'
);

// Exportar relatório completo sem filtros (todos os dados)
await exportarRelatorioCompleto();
```

---

## 🎯 Casos de Uso Comuns

### 1. Exportar Dados do Dashboard Atual

```typescript
// Sincronizar filtros do dashboard com a exportação
interface DashboardFilters {
  empreendimento_id: number | null;
  data_inicio: string;
  data_fim: string;
}

async function exportarDadosDashboard(
  tipo: 'vendas' | 'propostas',
  filtros: DashboardFilters,
  formato: 'csv' | 'xlsx' = 'xlsx'
) {
  const endpoint = `http://localhost:8000/api/v1/export/${tipo}`;
  const token = localStorage.getItem('access_token');

  const response = await axios.get(endpoint, {
    params: {
      formato,
      data_inicio: filtros.data_inicio,
      data_fim: filtros.data_fim,
      empreendimento_id: filtros.empreendimento_id, // null = todos
    },
    headers: { Authorization: `Bearer ${token}` },
    responseType: 'blob',
  });

  // Download
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.download = `${tipo}_${new Date().toISOString().split('T')[0]}.${formato}`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
```

### 2. Botão de Exportação com Loading

```tsx
import { useState } from 'react';

function ExportButton({ filtros }: { filtros: DashboardFilters }) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async (tipo: 'vendas' | 'propostas') => {
    setExporting(true);
    try {
      await exportarDadosDashboard(tipo, filtros, 'xlsx');
      alert('Exportação concluída!');
    } catch (error) {
      alert('Erro ao exportar dados.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => handleExport('vendas')}
        disabled={exporting}
      >
        {exporting ? 'Exportando...' : 'Exportar Vendas'}
      </button>

      <button
        onClick={() => handleExport('propostas')}
        disabled={exporting}
      >
        {exporting ? 'Exportando...' : 'Exportar Propostas'}
      </button>
    </div>
  );
}
```

### 3. Dropdown de Formato (CSV vs XLSX)

```tsx
import { useState } from 'react';

function ExportControls() {
  const [formato, setFormato] = useState<'csv' | 'xlsx'>('xlsx');

  return (
    <div>
      <label>
        Formato:
        <select value={formato} onChange={e => setFormato(e.target.value as any)}>
          <option value="xlsx">Excel (XLSX)</option>
          <option value="csv">CSV</option>
        </select>
      </label>

      <button onClick={() => exportar({ formato })}>
        Exportar
      </button>
    </div>
  );
}
```

---

## ⚠️ Tratamento de Erros

### Possíveis Códigos de Erro

| Status | Significado | Ação Recomendada |
|--------|-------------|------------------|
| 200 | Sucesso | Download do arquivo |
| 401 | Não autenticado | Redirecionar para login |
| 403 | Sem permissão | Mostrar mensagem de acesso negado |
| 422 | Parâmetros inválidos | Validar filtros antes de enviar |
| 500 | Erro interno | Tentar novamente ou contatar suporte |

### Exemplo de Tratamento

```typescript
try {
  await exportarVendas(params);
} catch (error: any) {
  if (error.response?.status === 401) {
    // Token expirado - redirecionar para login
    localStorage.removeItem('access_token');
    window.location.href = '/login';
  } else if (error.response?.status === 403) {
    alert('Você não tem permissão para exportar dados.');
  } else if (error.response?.status === 422) {
    alert('Filtros inválidos. Verifique as datas e tente novamente.');
  } else {
    alert('Erro ao exportar dados. Tente novamente mais tarde.');
  }
}
```

---

## 📝 Formato de Datas

### Entrada (Query Params)

**ISO 8601:** `YYYY-MM-DDTHH:MM:SS`

Exemplos:
- `2024-01-01T00:00:00` - 1º de janeiro de 2024 às 00:00
- `2024-12-31T23:59:59` - 31 de dezembro de 2024 às 23:59

### Saída (CSV/XLSX)

**Formato Brasileiro:** `DD/MM/YYYY HH:MM`

Exemplos:
- `01/01/2024 10:30`
- `15/06/2024 14:45`

### Conversão no Frontend (JavaScript)

```javascript
// Date -> ISO 8601 para enviar na API
function toISO8601(date: Date): string {
  return date.toISOString().split('.')[0]; // Remove milissegundos
}

// Exemplo de uso
const dataInicio = new Date('2024-01-01');
const dataFim = new Date('2024-03-31');

await exportarVendas({
  data_inicio: toISO8601(dataInicio),
  data_fim: toISO8601(dataFim),
});
```

---

## 🧪 Testando os Endpoints

### Usando FastAPI Swagger UI

1. Acesse: `http://localhost:8000/docs`
2. Clique no cadeado 🔒 (Authorize)
3. Cole seu Bearer token: `Bearer SEU_TOKEN`
4. Navegue até `/api/v1/export/vendas` ou `/api/v1/export/propostas`
5. Clique em "Try it out"
6. Preencha os parâmetros desejados
7. Clique em "Execute"
8. Baixe o arquivo no botão "Download"

---

## 📊 Performance e Limitações

### Recomendações

- ✅ **Sempre filtre por período:** Evite exportar todos os dados sem filtros
- ✅ **Prefira XLSX para grandes volumes:** Melhor compressão que CSV
- ✅ **Use loading states:** Exportações podem demorar alguns segundos
- ⚠️ **Timeout:** Exportações muito grandes (>100k registros) podem dar timeout
- ⚠️ **Memória:** XLSX consome mais memória no servidor

### Limites Sugeridos (Backend)

Não há limites implementados atualmente, mas considere:
- Máximo de 50.000 registros por exportação
- Timeout de 60 segundos
- Adicionar paginação se necessário

---

## 🔍 Debug e Logs

### Backend (FastAPI)

Os logs estruturados podem ser visualizados no console do servidor:

```
exportando_vendas formato=xlsx data_inicio=2024-01-01T00:00:00 data_fim=2024-03-31T23:59:59 empreendimento_id=None
vendas_exportadas total=450 formato=xlsx
```

### Frontend (Browser Console)

Adicione logs para debug:

```javascript
console.log('Iniciando exportação:', params);
console.log('Response headers:', response.headers);
console.log('Blob size:', blob.size, 'bytes');
```

---

## 📞 Suporte

Dúvidas ou problemas?

- **Documentação FastAPI:** `http://localhost:8000/docs`
- **Redoc:** `http://localhost:8000/redoc`
- **Issues:** Reportar bugs na equipe de backend

---

**Última Atualização:** 13/11/2024
**Versão da API:** 1.0
**Mantido por:** Equipe Backend LCP Dashboard
