import type { Proposta, PropostaFilters } from '@/shared/types';

import { apiClient } from '@/shared/services/api/client';


/**
 * Service para gerenciar propostas
 */
class PropostaService {
  private readonly baseURL = '/propostas';

  /**
   * Lista todas as propostas com filtros
   * @param filters - Filtros de paginação e busca
   * @returns Lista de propostas
   */
  async getAll(filters?: PropostaFilters): Promise<Proposta[]> {
    return apiClient.get<never, Proposta[]>(this.baseURL, { params: filters });
  }

  /**
   * Busca uma proposta específica por ID
   * @param id - ID da proposta
   * @returns Dados da proposta
   */
  async getById(id: number): Promise<Proposta> {
    return apiClient.get<never, Proposta>(`${this.baseURL}/${id}`);
  }

  /**
   * Lista propostas de um empreendimento específico
   * @param empreendimentoId - ID do empreendimento
   * @returns Lista de propostas do empreendimento
   */
  async getByEmpreendimento(empreendimentoId: number): Promise<Proposta[]> {
    return apiClient.get<never, Proposta[]>(
      `${this.baseURL}/por-empreendimento/${empreendimentoId}`
    );
  }

  /**
   * Exporta propostas em formato Excel
   * @param filters - Filtros para exportação
   * @returns Blob do arquivo Excel
   */
  async exportExcel(filters?: PropostaFilters): Promise<Blob> {
    return apiClient.get<never, Blob>('/export/propostas/excel', {
      params: filters,
      responseType: 'blob',
    });
  }
}

export const propostaService = new PropostaService();
