import type { Empreendimento, PaginationParams } from '@/shared/types';

import { apiClient } from '@/shared/services/api/client';

class EmpreendimentoService {
  private baseURL = '/empreendimentos';

  async getAll(params?: PaginationParams): Promise<Empreendimento[]> {
    return apiClient.get<never, Empreendimento[]>(this.baseURL, { params });
  }

  async getById(id: number): Promise<Empreendimento> {
    return apiClient.get<never, Empreendimento>(`${this.baseURL}/${id}`);
  }
}

export const empreendimentoService = new EmpreendimentoService();
