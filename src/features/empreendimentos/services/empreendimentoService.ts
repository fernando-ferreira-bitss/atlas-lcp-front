import type { Empreendimento, PaginationParams } from '@/shared/types';

import { apiClient } from '@/shared/services/api/client';

class EmpreendimentoService {
  private baseURL = '/empreendimentos';

  async getAll(params?: PaginationParams): Promise<Empreendimento[]> {
    return apiClient.get<never, Empreendimento[]>(this.baseURL, { params });
  }

  /**
   * Busca todos os empreendimentos sem paginação
   * Usa a rota /all que retorna todos os registros ativos
   */
  async getAllUnpaginated(): Promise<Empreendimento[]> {
    return apiClient.get<never, Empreendimento[]>(`${this.baseURL}/all`);
  }

  async getById(id: number): Promise<Empreendimento> {
    return apiClient.get<never, Empreendimento>(`${this.baseURL}/${id}`);
  }
}

export const empreendimentoService = new EmpreendimentoService();
