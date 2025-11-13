import type {
  GetLogsParams,
  SyncDispatchResponse,
  SyncLogsResponse,
  SyncStatusGeral,
} from '../types';

import { apiClient } from '@/shared/services/api/client';

/**
 * Service para gerenciar sincronizações de dados
 */
class SyncService {
  private readonly baseURL = '/sync';

  /**
   * Dispara sincronização completa (assíncrona)
   * Ordem: Empreendimentos → Contadores → Vendas
   *
   * IMPORTANTE: Este endpoint apenas dispara a sincronização e retorna imediatamente.
   * Use getLogs() para monitorar o progresso da sincronização.
   *
   * @returns Mensagem de confirmação do início da sincronização
   */
  async syncFull(): Promise<SyncDispatchResponse> {
    return apiClient.post<never, SyncDispatchResponse>(`${this.baseURL}/full/`, {});
  }

  /**
   * Busca logs de sincronização para monitorar progresso
   *
   * Recomendação: Fazer polling a cada 3-5 segundos para acompanhar
   * o status da sincronização em andamento.
   *
   * @param params - Parâmetros de paginação (limit, offset)
   * @returns Lista de logs de sincronização
   */
  async getLogs(params?: GetLogsParams): Promise<SyncLogsResponse> {
    return apiClient.get<never, SyncLogsResponse>(`${this.baseURL}/logs/`, { params });
  }

  /**
   * Busca status geral das sincronizações
   * @returns Status geral
   */
  async getStatus(): Promise<SyncStatusGeral> {
    return apiClient.get<never, SyncStatusGeral>(`${this.baseURL}/status/`);
  }
}

export const syncService = new SyncService();
