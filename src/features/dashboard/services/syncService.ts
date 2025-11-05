import type { SyncResponse, SyncStatusResponse } from '@/shared/types';

import { apiClient } from '@/shared/services/api/client';


/**
 * Service para gerenciar sincronização de dados
 */
class SyncService {
  private readonly baseURL = '/sync';

  /**
   * Sincroniza empreendimentos das APIs externas
   * @returns Resultado da sincronização
   */
  async syncEmpreendimentos(): Promise<SyncResponse> {
    return apiClient.post<never, SyncResponse>(`${this.baseURL}/empreendimentos`);
  }

  /**
   * Sincroniza propostas e vendas das APIs externas
   * @returns Resultado da sincronização
   */
  async syncPropostasVendas(): Promise<SyncResponse> {
    return apiClient.post<never, SyncResponse>(`${this.baseURL}/propostas-vendas`);
  }

  /**
   * Executa sincronização completa (empreendimentos + propostas + vendas)
   * @returns Resultado da sincronização completa
   */
  async syncFull(): Promise<SyncResponse> {
    return apiClient.post<never, SyncResponse>(`${this.baseURL}/full`);
  }

  /**
   * Busca status da última sincronização
   * @returns Logs de sincronização
   */
  async getStatus(): Promise<SyncStatusResponse> {
    return apiClient.get<never, SyncStatusResponse>(`${this.baseURL}/status`);
  }
}

export const syncService = new SyncService();
