import type { Venda, VendaFilters } from '@/shared/types';

import { apiClient } from '@/shared/services/api/client';


/**
 * Service para gerenciar vendas
 */
class VendaService {
  private readonly baseURL = '/vendas';

  /**
   * Lista todas as vendas com filtros
   * @param filters - Filtros de paginação, empreendimento, status e datas
   * @returns Lista de vendas
   */
  async getAll(filters?: VendaFilters): Promise<Venda[]> {
    return apiClient.get<never, Venda[]>(this.baseURL, { params: filters });
  }

  /**
   * Busca uma venda específica por ID
   * @param id - ID da venda
   * @returns Dados da venda
   */
  async getById(id: number): Promise<Venda> {
    return apiClient.get<never, Venda>(`${this.baseURL}/${id}`);
  }

  /**
   * Lista vendas de um empreendimento específico
   * @param empreendimentoId - ID do empreendimento
   * @returns Lista de vendas do empreendimento
   */
  async getByEmpreendimento(empreendimentoId: number): Promise<Venda[]> {
    return apiClient.get<never, Venda[]>(
      `${this.baseURL}/por-empreendimento/${empreendimentoId}`
    );
  }

  /**
   * Exporta vendas em formato Excel
   * @param filters - Filtros para exportação
   * @returns Blob do arquivo Excel
   */
  async exportExcel(filters?: VendaFilters): Promise<Blob> {
    return apiClient.get<never, Blob>('/export/vendas/excel', {
      params: filters,
      responseType: 'blob',
    });
  }
}

export const vendaService = new VendaService();
