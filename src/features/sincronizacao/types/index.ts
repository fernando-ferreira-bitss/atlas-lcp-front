/**
 * Tipos e interfaces para o módulo de Sincronização
 */

/**
 * Tipo de sincronização
 */
export type SyncTipo = 'full';

/**
 * Status de uma sincronização
 */
export type SyncStatus = 'idle' | 'running' | 'success' | 'error';

/**
 * Resultado de uma entidade sincronizada
 */
export interface SyncResultado {
  entidade: string;
  empreendimento_id?: number | null;
  empreendimento_nome?: string | null;
  total_processados: number;
  novos: number;
  atualizados: number;
  erros: number;
  sucesso: boolean;
  mensagem?: string | null;
  duracao_segundos: number;
}

/**
 * Response de sincronização inicial (dispatch)
 */
export interface SyncDispatchResponse {
  message: string;
  sync_id?: string;
}

/**
 * Log de sincronização individual (retornado pela API)
 */
export interface SyncLog {
  id: number;
  user_id: number;
  created_at: string;
  tipo_sync: string;
  status: 'em_progresso' | 'concluido' | 'sucesso' | 'erro' | 'falha';
  total_registros: number;
  registros_criados: number;
  registros_atualizados: number;
  registros_erro: number;
  tempo_execucao_segundos: number | null;
  mensagem: string | null;
  detalhes_erro: string | null;
  data_inicio: string;
  data_fim: string | null;
}

/**
 * Response da listagem de logs
 */
export interface SyncLogsResponse {
  logs: SyncLog[];
  total: number;
}

/**
 * Parâmetros para buscar logs
 */
export interface GetLogsParams {
  limit?: number;
  offset?: number;
}

/**
 * Status geral das sincronizações
 */
export interface SyncStatusGeral {
  ultima_sync_empreendimentos: string | null;
  ultima_sync_propostas: string | null;
  ultima_sync_vendas: string | null;
  total_empreendimentos: number;
  total_propostas: number;
  total_vendas: number;
  sync_em_andamento: boolean;
}

/**
 * Estado de erro da API de sincronização
 */
export interface SyncApiError {
  detail?: string;
  message?: string;
  status?: number;
}

/**
 * Histórico de execução de sincronização
 */
export interface SyncHistorico extends SyncLog {
  data_execucao: string;
  usuario?: string;
}
