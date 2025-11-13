/**
 * Tipos e interfaces para o módulo de Sincronização
 */

/**
 * Tipo de sincronização
 */
export type SyncTipo = 'empreendimentos' | 'vendas' | 'full';

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
 * Response de uma sincronização executada
 */
export interface SyncResponse {
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
 * Parâmetros para sincronização de vendas
 */
export interface SyncVendasParams {
  empreendimento_id?: number | null;
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
export interface SyncHistorico extends SyncResponse {
  id: string;
  data_execucao: string;
  usuario?: string;
}
