import type { CreateMetaData, Meta, UpdateMetaData } from '@/shared/types';

import { apiClient } from '@/shared/services/api/client';

/**
 * Service para gerenciar metas
 */
class MetaService {
  private readonly baseURL = '/metas';

  /**
   * Lista todas as metas
   * @param ativo - Filtrar apenas metas ativas (opcional)
   * @returns Lista de metas
   */
  async getAll(ativo?: boolean): Promise<Meta[]> {
    return apiClient.get<never, Meta[]>(this.baseURL, {
      params: ativo !== undefined ? { ativo } : undefined,
    });
  }

  /**
   * Cria uma nova meta
   * @param data - Dados da nova meta
   * @returns Meta criada
   */
  async create(data: CreateMetaData): Promise<Meta> {
    return apiClient.post<never, Meta>(this.baseURL, data);
  }

  /**
   * Atualiza uma meta existente
   * @param id - ID da meta
   * @param data - Dados a serem atualizados
   * @returns Meta atualizada
   */
  async update(id: number, data: UpdateMetaData): Promise<Meta> {
    return apiClient.put<never, Meta>(`${this.baseURL}/${id}`, data);
  }

  /**
   * Remove uma meta
   * @param id - ID da meta
   */
  async delete(id: number): Promise<void> {
    return apiClient.delete<never, void>(`${this.baseURL}/${id}`);
  }
}

export const metaService = new MetaService();
