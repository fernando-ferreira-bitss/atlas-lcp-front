import type { Unidade, UnidadeListResponse, UpdateUnidadesResponse } from '@/shared/types';

import { apiClient } from '@/shared/services/api/client';

const PAGE_SIZE = 500;

class UnidadeService {
  private baseURL = '/unidades';

  /**
   * Lista unidades de um grupo com paginação
   * @param grupoId - ID do grupo
   * @param skip - Paginação: registros a pular
   * @param limit - Paginação: limite de registros
   */
  async listByGrupo(grupoId: number, skip = 0, limit = PAGE_SIZE): Promise<UnidadeListResponse> {
    return apiClient.get<never, UnidadeListResponse>(`${this.baseURL}/grupos/${grupoId}`, {
      params: { skip, limit },
    });
  }

  /**
   * Lista TODAS as unidades de um grupo, fazendo múltiplas requisições se necessário
   * @param grupoId - ID do grupo
   * @returns Objeto com total e array completo de unidades
   */
  async listAllByGrupo(grupoId: number): Promise<{ total: number; items: Unidade[] }> {
    const allItems: Unidade[] = [];
    let skip = 0;
    let total = 0;

    // Primeira requisição para saber o total
    const firstPage = await this.listByGrupo(grupoId, skip, PAGE_SIZE);
    total = firstPage.total;
    allItems.push(...firstPage.items);

    // Se tiver mais páginas, buscar todas (sequencial para não sobrecarregar o servidor)
    while (allItems.length < total) {
      skip += PAGE_SIZE;
      // eslint-disable-next-line no-await-in-loop
      const nextPage = await this.listByGrupo(grupoId, skip, PAGE_SIZE);
      allItems.push(...nextPage.items);
    }

    return { total, items: allItems };
  }

  /**
   * Atualiza quais unidades do grupo pertencem ao cliente
   * @param grupoId - ID do grupo
   * @param unidadeIdsPertence - Lista de IDs das unidades que pertencem ao cliente
   */
  async updatePropriedade(
    grupoId: number,
    unidadeIdsPertence: number[]
  ): Promise<UpdateUnidadesResponse> {
    return apiClient.put<{ unidade_ids_pertence: number[] }, UpdateUnidadesResponse>(
      `${this.baseURL}/grupos/${grupoId}`,
      { unidade_ids_pertence: unidadeIdsPertence }
    );
  }
}

export const unidadeService = new UnidadeService();
