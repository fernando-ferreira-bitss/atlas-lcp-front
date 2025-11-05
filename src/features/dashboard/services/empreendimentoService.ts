import type {
  Empreendimento,
  EmpreendimentoStats,
  PaginationParams,
} from '@/shared/types';

import { apiClient } from '@/shared/services/api/client';


/**
 * Service para gerenciar empreendimentos
 */
class EmpreendimentoService {
  private readonly baseURL = '/empreendimentos';

  /**
   * Lista todos os empreendimentos com paginação
   * @param params - Parâmetros de paginação (skip, limit)
   * @returns Lista de empreendimentos
   */
  async getAll(params?: PaginationParams): Promise<Empreendimento[]> {
    return apiClient.get<never, Empreendimento[]>(this.baseURL, { params });
  }

  /**
   * Busca um empreendimento específico por ID
   * @param id - ID do empreendimento
   * @returns Dados do empreendimento
   */
  async getById(id: number): Promise<Empreendimento> {
    return apiClient.get<never, Empreendimento>(`${this.baseURL}/${id}`);
  }

  /**
   * Busca estatísticas agregadas dos empreendimentos
   * @returns Estatísticas gerais
   */
  async getStats(): Promise<EmpreendimentoStats> {
    return apiClient.get<never, EmpreendimentoStats>(`${this.baseURL}/stats`);
  }

  /**
   * Exporta empreendimentos em formato Excel
   * @returns Blob do arquivo Excel
   */
  async exportExcel(): Promise<Blob> {
    return apiClient.get<never, Blob>('/export/empreendimentos/excel', {
      responseType: 'blob',
    });
  }

  /**
   * Exporta empreendimentos em formato CSV
   * @returns Blob do arquivo CSV
   */
  async exportCSV(): Promise<Blob> {
    return apiClient.get<never, Blob>('/export/empreendimentos/csv', {
      responseType: 'blob',
    });
  }
}

export const empreendimentoService = new EmpreendimentoService();
