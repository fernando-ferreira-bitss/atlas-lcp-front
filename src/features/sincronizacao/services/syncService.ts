import type { SyncResponse, SyncStatusGeral, SyncVendasParams } from '../types';

import { apiClient } from '@/shared/services/api/client';


/**
 * Service para gerenciar sincronizações de dados
 */
class SyncService {
  private readonly baseURL = '/sync';

  /**
   * Sincroniza todos os empreendimentos da API Mega
   * @returns Resultado da sincronização
   */
  async syncEmpreendimentos(): Promise<SyncResponse> {
    return apiClient.post<never, SyncResponse>(`${this.baseURL}/empreendimentos/`, {});
  }

  /**
   * Sincroniza vendas da API Carteira
   * @param params - Parâmetros opcionais (empreendimento_id)
   * @returns Resultado da sincronização
   */
  async syncVendas(params?: SyncVendasParams): Promise<SyncResponse> {
    return apiClient.post<never, SyncResponse>(`${this.baseURL}/vendas/`, {}, { params });
  }

  /**
   * Executa sincronização completa
   * Ordem: Empreendimentos → Contadores → Vendas
   * @returns Resultado da sincronização
   */
  async syncFull(): Promise<SyncResponse> {
    return apiClient.post<never, SyncResponse>(`${this.baseURL}/full/`, {});
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
