# 📡 API de Sincronização (ETL) - Documentação Frontend

> **Versão:** 2.0
> **Data:** 13/11/2024
> **Base URL:** `http://localhost:8000/api/v1/sync`

---

## 📋 Visão Geral

A API de sincronização permite executar jobs de ETL (Extract, Transform, Load) **manualmente** e consultar o **status/histórico** das sincronizações automáticas.

### ✨ Novidades v2.0

- ✅ **Endpoint Unificado:** Agora existe apenas `/sync/full` para todas as sincronizações
- ✅ **Código Centralizado:** Sincronização manual e agendada usam a mesma lógica
- ✅ **Execução Assíncrona:** Frontend não aguarda resposta, monitora via polling
- ✅ **Logs Completos:** Todas as execuções (manuais e automáticas) registradas em `sync_logs`
- ✅ **Lock System:** Evita execuções simultâneas com sistema de locks
- ❌ **Removidos:** Endpoints `/sync/empreendimentos` e `/sync/vendas` (redundantes)

### Características

✅ **Execução Manual:** Trigger de sincronizações sob demanda via `/sync/full`
✅ **Jobs Automáticos:** Scheduler executa sincronizações a cada 2 horas
✅ **Monitoramento em Tempo Real:** Polling via `/sync/logs` para acompanhar progresso
✅ **Histórico:** Consulta de execuções passadas via `/sync/logs`
✅ **Admin Only:** Todos os endpoints requerem permissão de administrador

---

## 🔄 Fluxo de Execução (Assíncrono)

```
┌─────────────┐                   ┌─────────────┐                   ┌─────────────┐
│  Frontend   │                   │   Backend   │                   │  Database   │
│   (Admin)   │                   │   (API)     │                   │ (sync_logs) │
└──────┬──────┘                   └──────┬──────┘                   └──────┬──────┘
       │                                 │                                 │
       │ 1. POST /sync/full              │                                 │
       │────────────────────────────────>│                                 │
       │                                 │                                 │
       │                                 │ 2. Criar log (status=em_progresso)
       │                                 │────────────────────────────────>│
       │                                 │                                 │
       │ 3. HTTP 200 (imediato)          │                                 │
       │<────────────────────────────────│                                 │
       │                                 │                                 │
       │                                 │ 4. Executar sync em background  │
       │                                 │    (5-10 minutos)               │
       │                                 │                                 │
       │ 5. Polling (a cada 3s)          │                                 │
       │ GET /sync/logs?limit=1          │                                 │
       │────────────────────────────────>│                                 │
       │                                 │                                 │
       │                                 │ 6. Buscar último log            │
       │                                 │────────────────────────────────>│
       │                                 │                                 │
       │                                 │ 7. Log (status=em_progresso)    │
       │                                 │<────────────────────────────────│
       │                                 │                                 │
       │ 8. Dados do log                 │                                 │
       │<────────────────────────────────│                                 │
       │                                 │                                 │
       │ (Mostrar progresso na UI)       │                                 │
       │                                 │                                 │
       │ ... (polling continua) ...      │                                 │
       │                                 │                                 │
       │                                 │ 9. Sync finalizada              │
       │                                 │    Atualizar log (status=concluido)
       │                                 │────────────────────────────────>│
       │                                 │                                 │
       │ 10. GET /sync/logs?limit=1      │                                 │
       │────────────────────────────────>│                                 │
       │                                 │                                 │
       │                                 │ 11. Buscar último log           │
       │                                 │────────────────────────────────>│
       │                                 │                                 │
       │                                 │ 12. Log (status=concluido)      │
       │                                 │<────────────────────────────────│
       │                                 │                                 │
       │ 13. Dados finais                │                                 │
       │<────────────────────────────────│                                 │
       │                                 │                                 │
       │ (Parar polling + Mostrar sucesso)                                 │
       │                                 │                                 │
```

**Vantagens deste fluxo:**
- ⚡ Frontend não fica bloqueado
- 📊 Progresso visível em tempo real
- ⏱️ Sem problemas de timeout HTTP
- 🔄 Usuário pode navegar pela aplicação durante sync

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
| **Sync Full** | A cada 2h | 06:00, 08:00, ..., 22:00 | Empreendimentos → Contadores → Vendas → Propostas |

**Não é necessário disparar manualmente**, exceto:
- Após mudanças críticas na API Mega
- Para forçar atualização imediata
- Para testes/validação

---

## 📡 Endpoints Disponíveis

### 1. Sincronização Completa (Full Sync)

**Endpoint:** `POST /api/v1/sync/full`

Executa sincronização completa em ordem sequencial:
1. **Empreendimentos** - Dados da API REST Mega
2. **Contadores** - Unidades disponíveis/reservadas/vendidas via SOAP
3. **Vendas** - Contratos da API Carteira
4. **Propostas** - Retroativas criadas automaticamente para vendas sem proposta

#### Query Parameters

| Parâmetro | Tipo | Obrigatório | Default | Descrição |
|-----------|------|-------------|---------|-----------|
| `empreendimento_id` | integer | Não | `null` | ID do empreendimento (null = todos) |

#### Request

```http
POST /api/v1/sync/full
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Sincronizar TODOS os empreendimentos:**
```http
POST /api/v1/sync/full
```

**Sincronizar UM empreendimento específico:**
```http
POST /api/v1/sync/full?empreendimento_id=93
```

#### Response (Sucesso - 200)

```json
{
  "tipo": "full",
  "inicio": "2024-11-13T20:00:00.000Z",
  "fim": "2024-11-13T20:05:30.000Z",
  "duracao_total_segundos": 330.5,
  "resultados": [
    {
      "entidade": "empreendimentos",
      "empreendimento_id": null,
      "empreendimento_nome": null,
      "total_processados": 45,
      "novos": 2,
      "atualizados": 43,
      "erros": 0,
      "sucesso": true,
      "mensagem": null,
      "duracao_segundos": 85.2
    },
    {
      "entidade": "contadores",
      "empreendimento_id": null,
      "empreendimento_nome": null,
      "total_processados": 45,
      "novos": 0,
      "atualizados": 45,
      "erros": 0,
      "sucesso": true,
      "mensagem": null,
      "duracao_segundos": 120.5
    },
    {
      "entidade": "vendas",
      "empreendimento_id": null,
      "empreendimento_nome": null,
      "total_processados": 850,
      "novos": 15,
      "atualizados": 835,
      "erros": 0,
      "sucesso": true,
      "mensagem": "Propostas retroativas: 12",
      "duracao_segundos": 124.8
    }
  ],
  "total_registros_processados": 940,
  "total_novos": 17,
  "total_atualizados": 923,
  "total_erros": 0,
  "sucesso_geral": true
}
```

#### Response (Erro - Sincronização em Andamento - 409)

```json
{
  "detail": "Sincronização de full já está em andamento"
}
```

#### Response (Erro - Não Autorizado - 401)

```json
{
  "detail": "Not authenticated"
}
```

#### Response (Erro - Não é Admin - 403)

```json
{
  "detail": "Permissão negada. Apenas administradores podem acessar este recurso"
}
```

#### Exemplo TypeScript/React

```typescript
import axios from 'axios';

interface SyncResultado {
  entidade: string;
  empreendimento_id: number | null;
  empreendimento_nome: string | null;
  total_processados: number;
  novos: number;
  atualizados: number;
  erros: number;
  sucesso: boolean;
  mensagem: string | null;
  duracao_segundos: number;
}

interface SyncResponse {
  tipo: string;
  inicio: string;
  fim: string;
  duracao_total_segundos: number;
  resultados: SyncResultado[];
  total_registros_processados: number;
  total_novos: number;
  total_atualizados: number;
  total_erros: number;
  sucesso_geral: boolean;
}

async function syncFull(empreendimentoId?: number): Promise<SyncResponse> {
  const token = localStorage.getItem('admin_token');

  try {
    console.log('Iniciando sincronização completa...');

    const response = await axios.post<SyncResponse>(
      'http://localhost:8000/api/v1/sync/full',
      {},
      {
        params: empreendimentoId ? { empreendimento_id: empreendimentoId } : undefined,
        headers: { Authorization: `Bearer ${token}` },
        timeout: 600000, // 10 minutos (sync pode demorar)
      }
    );

    const { resultados, duracao_total_segundos, total_novos, total_atualizados } = response.data;

    console.log(`✅ Sync concluída em ${duracao_total_segundos}s`);
    console.log(`📊 Total: ${total_novos} novos, ${total_atualizados} atualizados`);

    resultados.forEach(r => {
      console.log(`  - ${r.entidade}: ${r.total_processados} processados`);
    });

    return response.data;

  } catch (error: any) {
    if (error.response?.status === 409) {
      throw new Error('Sincronização já em andamento. Aguarde a conclusão.');
    } else if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/login';
      throw new Error('Sessão expirada');
    } else if (error.response?.status === 403) {
      throw new Error('Apenas administradores podem executar sincronizações');
    } else {
      throw new Error('Erro na sincronização. Tente novamente.');
    }
  }
}

// Uso:
// Sincronizar todos os empreendimentos
const resultado = await syncFull();

// Sincronizar um empreendimento específico
const resultadoUnico = await syncFull(93);
```

#### Exemplo React Hook (Async com Polling)

```typescript
import { useState, useCallback, useRef } from 'react';
import axios from 'axios';

interface SyncLog {
  id: number;
  tipo_sync: string;
  status: 'em_progresso' | 'concluido' | 'erro';
  total_registros: number;
  registros_criados: number;
  registros_atualizados: number;
  registros_erro: number;
  tempo_execucao_segundos: number | null;
  mensagem: string;
  data_inicio: string;
  data_fim: string | null;
}

export function useSyncFull() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>('');
  const [currentLog, setCurrentLog] = useState<SyncLog | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  const fetchLatestLog = useCallback(async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.get<{ logs: SyncLog[] }>(
        'http://localhost:8000/api/v1/sync/logs',
        {
          params: { limit: 1 },
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const latestLog = response.data.logs[0];
      if (latestLog) {
        setCurrentLog(latestLog);

        // Atualizar mensagem de progresso
        if (latestLog.status === 'em_progresso') {
          setProgress(`Sincronizando... ${latestLog.total_registros} registros processados`);
        } else if (latestLog.status === 'concluido') {
          setProgress('✅ Sincronização concluída!');
          setLoading(false);
          stopPolling();
        } else if (latestLog.status === 'erro') {
          setError(latestLog.mensagem);
          setProgress('');
          setLoading(false);
          stopPolling();
        }
      }

      return latestLog;
    } catch (err) {
      console.error('Erro ao buscar logs:', err);
      return null;
    }
  }, [stopPolling]);

  const startPolling = useCallback(() => {
    stopPolling(); // Garantir que não há polling anterior
    pollingIntervalRef.current = setInterval(fetchLatestLog, 3000); // Poll a cada 3s
  }, [fetchLatestLog, stopPolling]);

  const executeSync = async (empreendimentoId?: number) => {
    setLoading(true);
    setError(null);
    setProgress('Iniciando sincronização...');
    setCurrentLog(null);

    try {
      const token = localStorage.getItem('admin_token');

      // Disparar sincronização (NÃO aguardar conclusão)
      axios.post(
        'http://localhost:8000/api/v1/sync/full',
        {},
        {
          params: empreendimentoId ? { empreendimento_id: empreendimentoId } : undefined,
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000, // Timeout curto apenas para confirmar que iniciou
        }
      ).catch(err => {
        // Se der timeout, ignorar (sync continua em background)
        if (err.code !== 'ECONNABORTED') {
          throw err;
        }
      });

      // Aguardar 2s para garantir que log foi criado
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Iniciar polling para monitorar progresso
      startPolling();

    } catch (err: any) {
      if (err.response?.status === 409) {
        setError('Sincronização já em andamento. Aguarde a conclusão.');
      } else {
        setError(err.response?.data?.detail || 'Erro ao iniciar sincronização');
      }
      setProgress('');
      setLoading(false);
    }
  };

  return {
    executeSync,
    loading,
    error,
    progress,
    currentLog,
    stopPolling,
  };
}

// Uso no componente:
function AdminSyncPanel() {
  const { executeSync, loading, error, progress, currentLog, stopPolling } = useSyncFull();

  const handleSync = async () => {
    try {
      await executeSync(); // Dispara e começa polling
    } catch (err: any) {
      console.error('Erro ao iniciar sync:', err);
    }
  };

  // Cleanup ao desmontar componente
  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Sincronização Manual</h2>

      <button
        onClick={handleSync}
        disabled={loading}
        style={{
          padding: '12px 24px',
          backgroundColor: loading ? '#ccc' : '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '16px',
        }}
      >
        {loading ? '⏳ Sincronizando...' : '🔄 Sincronizar Tudo'}
      </button>

      {loading && (
        <div style={{ marginTop: '10px', color: '#FF9800' }}>
          <p>🔄 {progress}</p>
          {currentLog && (
            <div style={{ fontSize: '14px', marginTop: '5px' }}>
              <p>⏱️ Tempo decorrido: {currentLog.tempo_execucao_segundos || 0}s</p>
              <p>📊 Processados: {currentLog.total_registros}</p>
              <p>➕ Criados: {currentLog.registros_criados}</p>
              <p>🔄 Atualizados: {currentLog.registros_atualizados}</p>
            </div>
          )}
        </div>
      )}

      {error && (
        <p style={{ marginTop: '10px', color: '#f44336' }}>
          ❌ {error}
        </p>
      )}

      {!loading && currentLog && currentLog.status === 'concluido' && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#E8F5E9', borderRadius: '5px' }}>
          <h3>✅ Última Sincronização Concluída:</h3>
          <p><strong>Tipo:</strong> {currentLog.tipo_sync}</p>
          <p><strong>Duração:</strong> {currentLog.tempo_execucao_segundos}s</p>
          <p><strong>Processados:</strong> {currentLog.total_registros}</p>
          <p><strong>Novos:</strong> {currentLog.registros_criados}</p>
          <p><strong>Atualizados:</strong> {currentLog.registros_atualizados}</p>
          <p><strong>Erros:</strong> {currentLog.registros_erro}</p>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
            Início: {new Date(currentLog.data_inicio).toLocaleString('pt-BR')}
          </p>
          <p style={{ fontSize: '12px', color: '#666' }}>
            Fim: {currentLog.data_fim ? new Date(currentLog.data_fim).toLocaleString('pt-BR') : '-'}
          </p>
        </div>
      )}
    </div>
  );
}
```

---

### 2. Status da Sincronização

**Endpoint:** `GET /api/v1/sync/status`

Retorna status atual e última sincronização.

#### Request

```http
GET /api/v1/sync/status
Authorization: Bearer {admin_token}
```

#### Response

```json
{
  "ultima_sync": "2024-11-13T20:05:30.000Z",
  "total_empreendimentos": 45,
  "total_propostas": 320,
  "total_vendas": 850,
  "sync_em_andamento": false
}
```

---

### 3. Histórico de Sincronizações

**Endpoint:** `GET /api/v1/sync/logs`

Retorna histórico de todas as sincronizações (manuais e automáticas).

**⚡ USO PRINCIPAL:** Polling para monitorar progresso da sincronização em tempo real.

#### Query Parameters

| Parâmetro | Tipo | Default | Descrição |
|-----------|------|---------|-----------|
| `limit` | integer | 50 | Quantidade de logs a retornar |
| `offset` | integer | 0 | Paginação |

#### Request

```http
GET /api/v1/sync/logs?limit=10&offset=0
Authorization: Bearer {admin_token}
```

#### Response

```json
{
  "total": 150,
  "logs": [
    {
      "id": 42,
      "tipo_sync": "full",
      "status": "concluido",
      "user_id": 1,
      "total_registros": 940,
      "registros_criados": 17,
      "registros_atualizados": 923,
      "registros_erro": 0,
      "tempo_execucao_segundos": 330,
      "mensagem": "Sincronização concluída: 940 processados",
      "data_inicio": "2024-11-13T20:00:00.000Z",
      "data_fim": "2024-11-13T20:05:30.000Z"
    },
    {
      "id": 41,
      "tipo_sync": "full_scheduled",
      "status": "concluido",
      "user_id": null,
      "total_registros": 938,
      "registros_criados": 5,
      "registros_atualizados": 933,
      "registros_erro": 0,
      "tempo_execucao_segundos": 315,
      "mensagem": "Sincronização completa automática concluída: 938 processados",
      "data_inicio": "2024-11-13T18:00:00.000Z",
      "data_fim": "2024-11-13T18:05:15.000Z"
    }
  ]
}
```

#### Status Possíveis

| Status | Descrição |
|--------|-----------|
| `em_progresso` | Sincronização em andamento |
| `concluido` | Sincronização finalizada com sucesso |
| `erro` | Sincronização falhou |

#### Tipos de Sincronização

| Tipo | Descrição |
|------|-----------|
| `full` | Sincronização **manual** (iniciada por admin via API) |
| `full_scheduled` | Sincronização **automática** (iniciada pelo scheduler) |

#### Exemplo TypeScript - Polling

```typescript
// Buscar último log para monitorar progresso
async function fetchLatestSyncLog() {
  const token = localStorage.getItem('admin_token');

  const response = await axios.get(
    'http://localhost:8000/api/v1/sync/logs',
    {
      params: { limit: 1 }, // Apenas o mais recente
      headers: { Authorization: `Bearer ${token}` }
    }
  );

  const latestLog = response.data.logs[0];

  if (latestLog) {
    console.log(`Status: ${latestLog.status}`);
    console.log(`Processados: ${latestLog.total_registros}`);

    if (latestLog.status === 'em_progresso') {
      console.log('⏳ Sincronização em andamento...');
      return 'IN_PROGRESS';
    } else if (latestLog.status === 'concluido') {
      console.log('✅ Sincronização concluída!');
      return 'COMPLETED';
    } else if (latestLog.status === 'erro') {
      console.error('❌ Erro:', latestLog.mensagem);
      return 'ERROR';
    }
  }

  return 'NO_LOG';
}
```

---

## 🎨 Componente Completo de Admin

Exemplo de painel admin completo com todas as funcionalidades:

```typescript
import { useState, useEffect } from 'react';
import axios from 'axios';

interface SyncStatus {
  ultima_sync: string | null;
  total_empreendimentos: number;
  total_propostas: number;
  total_vendas: number;
  sync_em_andamento: boolean;
}

export function AdminSyncDashboard() {
  const { executeSync, loading, error, progress, currentLog, stopPolling } = useSyncFull();
  const [status, setStatus] = useState<SyncStatus | null>(null);

  // Buscar status a cada 30s
  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  // Cleanup ao desmontar
  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  const fetchStatus = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.get<SyncStatus>(
        'http://localhost:8000/api/v1/sync/status',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus(response.data);
    } catch (error) {
      console.error('Erro ao buscar status:', error);
    }
  };

  const handleSync = async () => {
    try {
      await executeSync(); // Dispara sync e inicia polling
    } catch (err) {
      console.error('Erro ao iniciar sync:', err);
    }
  };

  // Atualizar status quando sync completar
  useEffect(() => {
    if (currentLog && currentLog.status === 'concluido') {
      fetchStatus();
    }
  }, [currentLog]);

  const formatDate = (date: string | null) => {
    if (!date) return 'Nunca executado';
    return new Date(date).toLocaleString('pt-BR');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px' }}>
      <h1>🔄 Painel de Sincronização (Admin)</h1>

      {/* Status Atual */}
      {status && (
        <div style={{
          padding: '15px',
          backgroundColor: '#F5F5F5',
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          <h3>📊 Status Atual</h3>
          <p><strong>Última Sincronização:</strong> {formatDate(status.ultima_sync)}</p>
          <p><strong>Empreendimentos:</strong> {status.total_empreendimentos}</p>
          <p><strong>Propostas:</strong> {status.total_propostas}</p>
          <p><strong>Vendas:</strong> {status.total_vendas}</p>

          {status.sync_em_andamento && (
            <p style={{ color: '#FF9800', fontWeight: 'bold' }}>
              ⚠️ Sincronização em andamento...
            </p>
          )}
        </div>
      )}

      {/* Botão de Sincronização */}
      <button
        onClick={handleSync}
        disabled={loading || status?.sync_em_andamento}
        style={{
          padding: '15px 30px',
          backgroundColor: loading ? '#ccc' : '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '18px',
          fontWeight: 'bold',
        }}
      >
        {loading ? '⏳ Sincronizando...' : '🔄 Sincronizar Agora'}
      </button>

      {/* Progresso em Tempo Real */}
      {loading && currentLog && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#FFF3E0',
          borderRadius: '5px'
        }}>
          <h3>🔄 Sincronização em Andamento</h3>
          <p style={{ color: '#FF9800', fontWeight: 'bold' }}>{progress}</p>
          <div style={{ marginTop: '10px', fontSize: '14px' }}>
            <p>⏱️ <strong>Tempo:</strong> {currentLog.tempo_execucao_segundos || 0}s</p>
            <p>📊 <strong>Processados:</strong> {currentLog.total_registros}</p>
            <p>➕ <strong>Criados:</strong> {currentLog.registros_criados}</p>
            <p>🔄 <strong>Atualizados:</strong> {currentLog.registros_atualizados}</p>
            {currentLog.registros_erro > 0 && (
              <p style={{ color: '#f44336' }}>❌ <strong>Erros:</strong> {currentLog.registros_erro}</p>
            )}
          </div>
        </div>
      )}

      {/* Erro */}
      {error && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#FFEBEE',
          color: '#C62828',
          borderRadius: '5px'
        }}>
          <p>❌ <strong>{error}</strong></p>
        </div>
      )}

      {/* Último Resultado Concluído */}
      {!loading && currentLog && currentLog.status === 'concluido' && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#E8F5E9',
          borderRadius: '5px'
        }}>
          <h3>✅ Última Sincronização Concluída</h3>
          <p><strong>Tipo:</strong> {currentLog.tipo_sync}</p>
          <p><strong>Duração:</strong> {currentLog.tempo_execucao_segundos}s</p>
          <p><strong>Processados:</strong> {currentLog.total_registros}</p>
          <p><strong>Novos:</strong> {currentLog.registros_criados}</p>
          <p><strong>Atualizados:</strong> {currentLog.registros_atualizados}</p>
          <p><strong>Erros:</strong> {currentLog.registros_erro}</p>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
            Concluído em: {currentLog.data_fim ? new Date(currentLog.data_fim).toLocaleString('pt-BR') : '-'}
          </p>
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
| 409 | Sync em andamento | Aguardar conclusão, tentar novamente depois |
| 500 | Erro interno | Mostrar erro e tentar novamente |
| 504 | Timeout | Aumentar timeout do request (10min+) |

### Exemplo de Tratamento Completo

```typescript
try {
  const result = await syncFull();
  console.log('Sucesso:', result);

} catch (error: any) {
  if (error.response?.status === 401) {
    // Token expirado
    localStorage.removeItem('admin_token');
    window.location.href = '/login';

  } else if (error.response?.status === 403) {
    // Não é admin
    alert('Apenas administradores podem executar sincronizações');

  } else if (error.response?.status === 409) {
    // Sync já em andamento
    alert('Uma sincronização já está em andamento. Aguarde a conclusão.');

  } else if (error.code === 'ECONNABORTED') {
    // Timeout
    alert('Sincronização demorou muito. Verifique o status mais tarde.');

  } else {
    // Erro genérico
    console.error('Erro:', error);
    alert('Erro na sincronização. Tente novamente.');
  }
}
```

---

## 📊 Monitoramento

### Logs Estruturados (Backend)

Todos os jobs geram logs estruturados (JSON):

```json
{
  "event": "sync_full_concluido",
  "tipo": "full",
  "total_processados": 940,
  "total_criados": 17,
  "total_atualizados": 923,
  "total_erros": 0,
  "timestamp": "2024-11-13T20:05:30.000Z"
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

### ⚡ Execução Assíncrona (Background Processing)

**IMPORTANTE:** O frontend **NÃO deve esperar** a resposta do `POST /sync/full`. A sincronização roda em **background** e o progresso é monitorado via polling.

### Dashboard Admin - Workflow

```
1. Página carrega
   └─> Buscar status (`GET /sync/status`)
       └─> Mostrar última sincronização e totais
   └─> Buscar últimos logs (`GET /sync/logs?limit=5`)
       └─> Mostrar histórico recente

2. Admin clica "Sincronizar"
   ├─> Verificar se sync já está em andamento (GET /sync/logs?limit=1)
   │   └─> Se status="em_progresso": Informar e bloquear botão
   ├─> Disparar `POST /sync/full` (NÃO aguardar resposta completa)
   │   └─> Timeout baixo (5-10s) apenas para confirmar que iniciou
   └─> Iniciar polling a cada 2-5s

3. Polling de Progresso (a cada 2-5s)
   └─> Buscar último log (`GET /sync/logs?limit=1`)
       ├─> Se status="em_progresso": Mostrar spinner e mensagem
       ├─> Se status="concluido": Mostrar sucesso e parar polling
       ├─> Se status="erro": Mostrar erro e parar polling
       └─> Atualizar UI com métricas (total_registros, registros_criados, etc.)

4. Sync Concluída
   ├─> Parar polling
   ├─> Atualizar status geral (`GET /sync/status`)
   ├─> Mostrar resumo final (processados, novos, erros)
   └─> Reabilitar botão de sincronização
```

### 🎯 Por Que Assíncrono?

- **Performance:** Sync pode demorar 5-10 minutos
- **UX:** Usuário não fica travado esperando
- **Timeout:** Evita problemas de timeout HTTP
- **Monitoramento:** Progresso em tempo real via polling

---

## 🚀 Migração da v1.0 para v2.0

### Mudanças Necessárias

Se você estava usando os endpoints antigos, faça as seguintes mudanças:

#### ❌ ANTES (v1.0) - Síncrono

```typescript
// Três endpoints separados + espera completa da resposta
await axios.post('/api/v1/sync/empreendimentos', {}, { timeout: 600000 });
await axios.post('/api/v1/sync/vendas', {}, { timeout: 600000 });
await axios.post('/api/v1/sync/full', {}, { timeout: 600000 });

// Problema: Frontend trava esperando resposta (5-10min)
```

#### ✅ AGORA (v2.0) - Assíncrono com Polling

```typescript
// 1. Disparar sincronização (não aguardar conclusão)
await axios.post('/api/v1/sync/full', {}, { timeout: 10000 });

// 2. Polling para monitorar progresso
const interval = setInterval(async () => {
  const response = await axios.get('/api/v1/sync/logs?limit=1');
  const log = response.data.logs[0];

  if (log.status === 'concluido' || log.status === 'erro') {
    clearInterval(interval);
    console.log('Sync finalizada!', log);
  } else {
    console.log('Em progresso...', log.total_registros, 'processados');
  }
}, 3000); // Poll a cada 3s
```

### Benefícios da v2.0

- ✅ **Mais Simples:** Um único endpoint para tudo
- ✅ **Mais Consistente:** Mesma lógica para manual e scheduler
- ✅ **Mais Rastreável:** Todos os syncs registrados em `sync_logs`
- ✅ **Mais Seguro:** Lock system evita conflitos
- ✅ **Menos Código:** Redução de ~150 linhas no backend
- ✅ **UX Melhor:** Frontend não trava, progresso em tempo real
- ✅ **Sem Timeout:** Não há limite de tempo HTTP

---

## 📚 Resumo - Melhores Práticas

### ✅ Como Implementar Corretamente

1. **Disparar Sincronização:**
   ```typescript
   // Timeout curto (10s) apenas para confirmar que iniciou
   POST /api/v1/sync/full (timeout: 10000ms)
   ```

2. **Monitorar Progresso via Polling:**
   ```typescript
   // Buscar último log a cada 3-5s
   GET /api/v1/sync/logs?limit=1
   ```

3. **Verificar Status:**
   ```typescript
   if (log.status === 'em_progresso') {
     // Mostrar spinner + métricas
   } else if (log.status === 'concluido') {
     // Parar polling + mostrar sucesso
   } else if (log.status === 'erro') {
     // Parar polling + mostrar erro
   }
   ```

4. **Cleanup:**
   ```typescript
   // Sempre limpar polling ao desmontar componente
   useEffect(() => {
     return () => clearInterval(pollingInterval);
   }, []);
   ```

### ❌ O Que NÃO Fazer

- ❌ **NÃO** aguardar resposta completa do `POST /sync/full`
- ❌ **NÃO** usar timeout alto (600s) no POST
- ❌ **NÃO** travar UI esperando sync completar
- ❌ **NÃO** fazer polling muito rápido (< 2s)
- ❌ **NÃO** esquecer de parar polling ao desmontar componente
- ❌ **NÃO** fazer múltiplas requisições POST simultâneas (usar lock system)

### 🎯 Intervalo de Polling Recomendado

| Cenário | Intervalo | Motivo |
|---------|-----------|--------|
| **Desenvolvimento** | 2-3s | Feedback rápido para testes |
| **Produção** | 3-5s | Equilíbrio entre UX e carga no servidor |
| **Alta Carga** | 5-10s | Reduzir carga quando muitos usuários online |

**Importante:** Sync pode demorar 5-10 minutos. O polling deve continuar até status mudar para `concluido` ou `erro`.

---

## 📞 Suporte

**Dúvidas ou problemas:**

- **Documentação da API:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`

---

**Última Atualização:** 13/11/2025 (v2.0 - Padrão Assíncrono)
**Versão:** 2.0
**Mantido por:** Equipe Backend LCP Dashboard

---

## 📝 Changelog

### v2.0 (13/11/2025)
- ✅ Endpoint unificado: Apenas `/sync/full` (removidos `/empreendimentos` e `/vendas`)
- ✅ Código centralizado: Manual e scheduler usam mesma função
- ✅ Padrão assíncrono: Frontend não aguarda resposta completa
- ✅ Polling via `/sync/logs`: Monitoramento de progresso em tempo real
- ✅ Lock system: Previne execuções simultâneas
- ✅ Logging completo: Todas as execuções registradas em `sync_logs`

### v1.0 (04/11/2025)
- Versão inicial com 3 endpoints separados
- Execução síncrona (timeout de 10min)
