# 📡 API de Sincronização (ETL) - Documentação Frontend

> **Versão:** 1.0  
> **Data:** 13/11/2024  
> **Base URL:** `http://localhost:8000/api/v1/sync`

---

## 📋 Visão Geral

A API de sincronização permite executar jobs de ETL (Extract, Transform, Load) **manualmente** e consultar o **status/histórico** das sincronizações automáticas.

### Características

✅ **Execução Manual:** Trigger de sincronizações sob demanda  
✅ **Jobs Automáticos:** Scheduler executa sincronizações periódicas  
✅ **Histórico:** Consulta de execuções passadas  
✅ **Admin Only:** Todos os endpoints requerem permissão de administrador  

---

## 🔐 Autenticação

**Todos os endpoints requerem autenticação de ADMINISTRADOR.**

### Exemplo de Header

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Obter Token Admin

1. Fazer login com usuário admin: `POST /api/v1/auth/login`
2. Usuário deve ter `is_admin: true`
3. Usar o `access_token` retornado

---

## 📅 Jobs Automáticos Agendados

O scheduler executa jobs automaticamente:

| Job | Frequência | Horário | Descrição |
|-----|------------|---------|-----------|
| **Sync Full** | Diário | 02:00 | Empreendimentos + Contadores + Vendas |
| **Sync Vendas** | A cada 2h | 06:00, 08:00, ..., 22:00 | Vendas e propostas retroativas |
| **Sync Contadores** | A cada 2h | 06:15, 08:15, ..., 22:15 | Contadores de unidades |

**Não é necessário disparar manualmente**, exceto:
- Após mudanças críticas na API Mega
- Para forçar atualização imediata
- Para testes/validação

---

## 📡 Endpoints Disponíveis

### 1. Sincronizar Empreendimentos

**Endpoint:** `POST /api/v1/sync/empreendimentos`

Sincroniza todos os empreendimentos da API Mega e atualiza contadores de unidades.

#### Request

```http
POST /api/v1/sync/empreendimentos
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Não requer body.**

#### Response

```json
{
  "tipo": "empreendimentos",
  "inicio": "2024-11-13T15:30:00.000Z",
  "fim": "2024-11-13T15:32:15.000Z",
  "duracao_total_segundos": 135.5,
  "resultados": [
    {
      "entidade": "empreendimento",
      "empreendimento_id": null,
      "empreendimento_nome": null,
      "total_processados": 45,
      "novos": 3,
      "atualizados": 42,
      "erros": 0,
      "sucesso": true,
      "mensagem": null,
      "duracao_segundos": 120.2
    }
  ],
  "total_registros_processados": 45,
  "total_novos": 3,
  "total_atualizados": 42,
  "total_erros": 0,
  "sucesso_geral": true
}
```

#### Exemplo React/Next.js

```typescript
import axios from 'axios';

interface SyncResponse {
  tipo: string;
  inicio: string;
  fim: string;
  duracao_total_segundos: number;
  resultados: Array<{
    entidade: string;
    total_processados: number;
    novos: number;
    atualizados: number;
    erros: number;
    sucesso: boolean;
    mensagem?: string;
  }>;
  total_registros_processados: number;
  total_novos: number;
  total_atualizados: number;
  total_erros: number;
  sucesso_geral: boolean;
}

async function syncEmpreendimentos(): Promise<SyncResponse> {
  const token = localStorage.getItem('admin_token');

  try {
    const response = await axios.post<SyncResponse>(
      'http://localhost:8000/api/v1/sync/empreendimentos',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    if (error.response?.status === 403) {
      throw new Error('Apenas administradores podem executar sincronizações');
    }
    throw error;
  }
}

// Uso:
const resultado = await syncEmpreendimentos();
console.log(`Sincronizados: ${resultado.total_processados}`);
console.log(`Novos: ${resultado.total_novos}, Atualizados: ${resultado.total_atualizados}`);
```

---

### 2. Sincronizar Vendas

**Endpoint:** `POST /api/v1/sync/vendas`

Sincroniza vendas da API Carteira e cria propostas retroativas automaticamente.

#### Query Parameters

| Parâmetro | Tipo | Obrigatório | Default | Descrição |
|-----------|------|-------------|---------|-----------|
| `empreendimento_id` | integer | Não | `null` | ID do empreendimento (null = todos) |

#### Request

```http
POST /api/v1/sync/vendas?empreendimento_id=5
Authorization: Bearer {admin_token}
```

#### Response

```json
{
  "tipo": "vendas",
  "inicio": "2024-11-13T15:35:00.000Z",
  "fim": "2024-11-13T15:38:45.000Z",
  "duracao_total_segundos": 225.3,
  "resultados": [
    {
      "entidade": "venda",
      "empreendimento_id": 5,
      "empreendimento_nome": "Loteamento Revoar",
      "total_processados": 150,
      "novos": 10,
      "atualizados": 140,
      "erros": 0,
      "sucesso": true,
      "mensagem": "Propostas retroativas: 8",
      "duracao_segundos": 225.3
    }
  ],
  "total_registros_processados": 150,
  "total_novos": 10,
  "total_atualizados": 140,
  "total_erros": 0,
  "sucesso_geral": true
}
```

#### Exemplo React Hook

```typescript
import { useState } from 'react';
import axios from 'axios';

export function useSyncVendas() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const syncVendas = async (empreendimentoId?: number) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('admin_token');

      const response = await axios.post<SyncResponse>(
        'http://localhost:8000/api/v1/sync/vendas',
        {},
        {
          params: {
            empreendimento_id: empreendimentoId || null,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLoading(false);
      return response.data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'Erro ao sincronizar vendas';
      setError(errorMsg);
      setLoading(false);
      throw new Error(errorMsg);
    }
  };

  return { syncVendas, loading, error };
}

// Uso no componente:
function AdminSyncPanel() {
  const { syncVendas, loading, error } = useSyncVendas();

  const handleSyncAll = async () => {
    const result = await syncVendas(); // Todos os empreendimentos
    alert(`Sincronizado: ${result.total_registros_processados} vendas`);
  };

  const handleSyncEmpreendimento = async (id: number) => {
    const result = await syncVendas(id); // Empreendimento específico
    alert(`Sincronizado: ${result.total_novos} novas vendas`);
  };

  return (
    <div>
      <button onClick={handleSyncAll} disabled={loading}>
        {loading ? 'Sincronizando...' : 'Sincronizar Todas Vendas'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
```

---

### 3. Sincronização Completa (Full Sync)

**Endpoint:** `POST /api/v1/sync/full`

Executa sincronização completa em ordem: Empreendimentos → Contadores → Vendas.

#### Request

```http
POST /api/v1/sync/full
Authorization: Bearer {admin_token}
```

#### Response

```json
{
  "tipo": "full",
  "inicio": "2024-11-13T16:00:00.000Z",
  "fim": "2024-11-13T16:08:30.000Z",
  "duracao_total_segundos": 510.5,
  "resultados": [
    {
      "entidade": "empreendimento",
      "total_processados": 45,
      "novos": 0,
      "atualizados": 45,
      "erros": 0,
      "sucesso": true,
      "duracao_segundos": 120.0
    },
    {
      "entidade": "venda",
      "total_processados": 850,
      "novos": 15,
      "atualizados": 835,
      "erros": 0,
      "sucesso": true,
      "mensagem": "Propostas retroativas: 12",
      "duracao_segundos": 390.5
    }
  ],
  "total_registros_processados": 895,
  "total_novos": 15,
  "total_atualizados": 880,
  "total_erros": 0,
  "sucesso_geral": true
}
```

#### Exemplo TypeScript

```typescript
async function fullSync(): Promise<void> {
  const token = localStorage.getItem('admin_token');

  try {
    console.log('Iniciando sincronização completa...');
    
    const response = await axios.post<SyncResponse>(
      'http://localhost:8000/api/v1/sync/full',
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 600000, // 10 minutos (sync pode demorar)
      }
    );

    const { resultados, duracao_total_segundos } = response.data;

    console.log(`✅ Sync concluída em ${duracao_total_segundos}s`);
    
    resultados.forEach(r => {
      console.log(`- ${r.entidade}: ${r.total_processados} processados, ${r.novos} novos`);
    });

  } catch (error: any) {
    console.error('❌ Erro na sincronização:', error.message);
    throw error;
  }
}
```

---

### 4. Status da Sincronização

**Endpoint:** `GET /api/v1/sync/status`

Retorna status atual e última sincronização de cada tipo.

#### Request

```http
GET /api/v1/sync/status
Authorization: Bearer {admin_token}
```

#### Response

```json
{
  "ultima_sync_empreendimentos": "2024-11-13T02:00:15.000Z",
  "ultima_sync_propostas": "2024-11-13T14:15:30.000Z",
  "ultima_sync_vendas": "2024-11-13T14:00:00.000Z",
  "total_empreendimentos": 45,
  "total_propostas": 320,
  "total_vendas": 850,
  "sync_em_andamento": false
}
```

#### Exemplo React Component

```typescript
import { useEffect, useState } from 'react';
import axios from 'axios';

interface SyncStatus {
  ultima_sync_empreendimentos: string | null;
  ultima_sync_propostas: string | null;
  ultima_sync_vendas: string | null;
  total_empreendimentos: number;
  total_propostas: number;
  total_vendas: number;
  sync_em_andamento: boolean;
}

function SyncStatusPanel() {
  const [status, setStatus] = useState<SyncStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    const token = localStorage.getItem('admin_token');
    
    try {
      const response = await axios.get<SyncStatus>(
        'http://localhost:8000/api/v1/sync/status',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStatus(response.data);
    } catch (error) {
      console.error('Erro ao buscar status:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    
    // Auto-refresh a cada 30 segundos
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>Carregando status...</p>;
  if (!status) return <p>Erro ao carregar status</p>;

  const formatDate = (date: string | null) => {
    if (!date) return 'Nunca executado';
    return new Date(date).toLocaleString('pt-BR');
  };

  return (
    <div>
      <h2>Status de Sincronização</h2>
      
      <div>
        <h3>Última Sincronização:</h3>
        <ul>
          <li>Empreendimentos: {formatDate(status.ultima_sync_empreendimentos)}</li>
          <li>Propostas: {formatDate(status.ultima_sync_propostas)}</li>
          <li>Vendas: {formatDate(status.ultima_sync_vendas)}</li>
        </ul>
      </div>

      <div>
        <h3>Totais no Banco:</h3>
        <ul>
          <li>Empreendimentos: {status.total_empreendimentos}</li>
          <li>Propostas: {status.total_propostas}</li>
          <li>Vendas: {status.total_vendas}</li>
        </ul>
      </div>

      {status.sync_em_andamento && (
        <p style={{ color: 'orange' }}>⚠️ Sincronização em andamento...</p>
      )}
    </div>
  );
}
```

---

## 🎨 Componente Completo de Admin

Exemplo de painel admin completo com todas as funcionalidades:

```typescript
import { useState } from 'react';
import axios from 'axios';

export function AdminSyncDashboard() {
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState<SyncResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const executeSync = async (
    endpoint: string,
    params?: Record<string, any>
  ) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('admin_token');

      const response = await axios.post<SyncResponse>(
        `http://localhost:8000/api/v1/sync/${endpoint}`,
        {},
        {
          params,
          headers: { Authorization: `Bearer ${token}` },
          timeout: 600000, // 10 minutos
        }
      );

      setLastResult(response.data);
      alert(`✅ Sincronização concluída!\nProcessados: ${response.data.total_registros_processados}`);
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'Erro na sincronização';
      setError(errorMsg);
      alert(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Painel de Sincronização (Admin)</h1>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={() => executeSync('empreendimentos')}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          🏢 Sync Empreendimentos
        </button>

        <button
          onClick={() => executeSync('vendas')}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          💰 Sync Vendas
        </button>

        <button
          onClick={() => executeSync('full')}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#FF9800',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          🔄 Sync Completo
        </button>
      </div>

      {loading && (
        <div style={{ padding: '20px', backgroundColor: '#FFF3CD' }}>
          <p>⏳ Sincronizando... Isso pode levar alguns minutos.</p>
        </div>
      )}

      {error && (
        <div style={{ padding: '20px', backgroundColor: '#F8D7DA', color: '#721C24' }}>
          <p>❌ {error}</p>
        </div>
      )}

      {lastResult && (
        <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#D4EDDA' }}>
          <h3>✅ Último Resultado:</h3>
          <p><strong>Tipo:</strong> {lastResult.tipo}</p>
          <p><strong>Duração:</strong> {lastResult.duracao_total_segundos.toFixed(2)}s</p>
          <p><strong>Processados:</strong> {lastResult.total_registros_processados}</p>
          <p><strong>Novos:</strong> {lastResult.total_novos}</p>
          <p><strong>Atualizados:</strong> {lastResult.total_atualizados}</p>
          <p><strong>Erros:</strong> {lastResult.total_erros}</p>
        </div>
      )}
    </div>
  );
}
```

---

## ⚠️ Tratamento de Erros

### Possíveis Códigos de Erro

| Status | Significado | Ação Recomendada |
|--------|-------------|------------------|
| 200 | Sucesso | Processar response |
| 401 | Não autenticado | Redirecionar para login |
| 403 | Não é admin | Mostrar mensagem de permissão negada |
| 500 | Erro interno | Mostrar erro e tentar novamente |
| 504 | Timeout | Aumentar timeout do request |

### Exemplo de Tratamento

```typescript
try {
  await syncFull();
} catch (error: any) {
  if (error.response?.status === 401) {
    // Token expirado
    localStorage.removeItem('admin_token');
    window.location.href = '/login';
  } else if (error.response?.status === 403) {
    alert('Apenas administradores podem executar sincronizações');
  } else if (error.code === 'ECONNABORTED') {
    alert('Sincronização demorou muito. Verifique o status mais tarde.');
  } else {
    alert('Erro na sincronização. Tente novamente.');
  }
}
```

---

## 📊 Logs e Monitoramento

### Logs Estruturados (Backend)

Todos os jobs geram logs estruturados (JSON):

```json
{
  "event": "sync_vendas_concluida",
  "total_processados": 850,
  "novos_vendas": 15,
  "propostas_retroativas": 12,
  "duracao_segundos": 390.5,
  "timestamp": "2024-11-13T16:05:30.000Z"
}
```

### Monitorar no Console do Servidor

```bash
# Filtrar logs de sync
docker logs lcp-api | grep "sync_"

# Ou se rodando localmente:
poetry run uvicorn app.main:app | grep "sync_"
```

---

## 🔄 Fluxo Recomendado no Frontend

### Dashboard Admin - Sugestão de Workflow

```
1. Página carrega → Buscar status (`GET /sync/status`)
   └─> Mostrar última sincronização e totais

2. Admin clica "Sincronizar"
   ├─> Mostrar loading/spinner
   ├─> Executar `POST /sync/full`
   └─> Aguardar resposta (pode demorar 5-10min)

3. Resposta recebida
   ├─> Sucesso: Mostrar resumo (processados, novos, erros)
   ├─> Erro: Mostrar mensagem de erro
   └─> Atualizar status (`GET /sync/status`)

4. Auto-refresh a cada 30s
   └─> Atualizar status automaticamente
```

---

## 📞 Suporte

**Dúvidas ou problemas:**

- **Documentação da API:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`

---

**Última Atualização:** 13/11/2024  
**Versão:** 1.0  
**Mantido por:** Equipe Backend LCP Dashboard
