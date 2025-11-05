import { apiClient } from '@/shared/services/api/client';
import type { Empreendimento, PaginationParams } from '@/shared/types';

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
