import type { Venda, VendaFilters } from '@/shared/types';

import { apiClient } from '@/shared/services/api/client';

class VendaService {
  private baseURL = '/vendas';

  async getAll(filters?: VendaFilters): Promise<Venda[]> {
    return apiClient.get<never, Venda[]>(this.baseURL, { params: filters });
  }

  async getById(id: number): Promise<Venda> {
    return apiClient.get<never, Venda>(`${this.baseURL}/${id}`);
  }
}

export const vendaService = new VendaService();
