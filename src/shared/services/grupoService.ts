import type {
  EmpreendimentoGrupo,
  EmpreendimentoGrupoSimple,
  EmpreendimentoGrupoWithMembros,
  EmpreendimentoSimple,
  CreateEmpreendimentoGrupoData,
  UpdateEmpreendimentoGrupoData,
} from '@/shared/types';

import { apiClient } from '@/shared/services/api/client';

class GrupoService {
  private baseURL = '/empreendimento-grupos';

  /**
   * Lista grupos simplificados (apenas id e nome) - OTIMIZADO para selects
   * @returns Lista simplificada de grupos ativos
   */
  async listSimple(): Promise<EmpreendimentoGrupoSimple[]> {
    return apiClient.get<never, EmpreendimentoGrupoSimple[]>(`${this.baseURL}/simple`);
  }

  /**
   * Lista todos os grupos com contagem de membros
   * @param apenasAtivos - Se true, retorna apenas grupos ativos
   * @param skip - Paginação: registros a pular
   * @param limit - Paginação: limite de registros
   */
  async list(
    apenasAtivos = false,
    skip = 0,
    limit = 100
  ): Promise<EmpreendimentoGrupoWithMembros[]> {
    return apiClient.get<never, EmpreendimentoGrupoWithMembros[]>(this.baseURL, {
      params: { apenas_ativos: apenasAtivos, skip, limit },
    });
  }

  /**
   * Busca um grupo por ID
   * @param id - ID do grupo
   */
  async getById(id: number): Promise<EmpreendimentoGrupo> {
    return apiClient.get<never, EmpreendimentoGrupo>(`${this.baseURL}/${id}`);
  }

  /**
   * Cria um novo grupo (apenas admin)
   * @param data - Dados do grupo
   */
  async create(data: CreateEmpreendimentoGrupoData): Promise<EmpreendimentoGrupo> {
    return apiClient.post<CreateEmpreendimentoGrupoData, EmpreendimentoGrupo>(
      this.baseURL,
      data
    );
  }

  /**
   * Atualiza um grupo existente (apenas admin)
   * @param id - ID do grupo
   * @param data - Dados a atualizar
   */
  async update(
    id: number,
    data: UpdateEmpreendimentoGrupoData
  ): Promise<EmpreendimentoGrupo> {
    return apiClient.put<UpdateEmpreendimentoGrupoData, EmpreendimentoGrupo>(
      `${this.baseURL}/${id}`,
      data
    );
  }

  /**
   * Deleta um grupo (apenas admin)
   * Empreendimentos vinculados terão empreendimento_grupo_id = NULL
   * @param id - ID do grupo
   */
  async delete(id: number): Promise<void> {
    return apiClient.delete<never, void>(`${this.baseURL}/${id}`);
  }

  /**
   * Lista IDs de empreendimentos vinculados ao grupo
   * @param id - ID do grupo
   */
  async getEmpreendimentos(id: number): Promise<number[]> {
    return apiClient.get<never, number[]>(`${this.baseURL}/${id}/empreendimentos`);
  }

  /**
   * Lista empreendimentos disponíveis (sem grupo) para vincular
   * @returns Lista de empreendimentos não vinculados a nenhum grupo
   */
  async getEmpreendimentosDisponiveis(): Promise<EmpreendimentoSimple[]> {
    return apiClient.get<never, EmpreendimentoSimple[]>(
      `${this.baseURL}/disponiveis/empreendimentos`
    );
  }
}

export const grupoService = new GrupoService();
