import type {
  Meta,
  MetaCreate,
  MetaFilters,
  MetaImportParams,
  MetaImportResult,
  MetaUpdate,
} from '../types';

import { apiClient } from '@/shared/services/api/client';

/**
 * Service para gerenciamento de metas de vendas
 * Base URL: /metas (apiClient já inclui /api/v1)
 */
class MetaService {
  private readonly baseURL = '/metas';

  /**
   * Lista metas com filtros e paginação
   * @param filters - Filtros opcionais (empreendimento_id, ano, skip, limit)
   * @returns Array de metas
   */
  async list(filters?: MetaFilters): Promise<Meta[]> {
    return apiClient.get(this.baseURL, { params: filters });
  }

  /**
   * Busca uma meta por ID
   * @param id - ID da meta
   * @returns Meta encontrada
   */
  async getById(id: number): Promise<Meta> {
    return apiClient.get(`${this.baseURL}/${id}`);
  }

  /**
   * Cria uma nova meta
   * Requer permissão de Admin
   * @param data - Dados da meta a criar
   * @returns Meta criada
   */
  async create(data: MetaCreate): Promise<Meta> {
    return apiClient.post(this.baseURL, data);
  }

  /**
   * Atualiza uma meta existente
   * Requer permissão de Admin
   * @param id - ID da meta
   * @param data - Dados para atualizar
   * @returns Meta atualizada
   */
  async update(id: number, data: MetaUpdate): Promise<Meta> {
    return apiClient.put(`${this.baseURL}/${id}`, data);
  }

  /**
   * Deleta uma meta
   * Requer permissão de Admin
   * @param id - ID da meta
   */
  async delete(id: number): Promise<void> {
    return apiClient.delete(`${this.baseURL}/${id}`);
  }

  /**
   * Importa metas de uma planilha Excel
   * Requer permissão de Admin
   * @param params - Ano e arquivo Excel
   * @returns Resultado da importação (total, importados, atualizados, erros)
   */
  async import({ ano, file }: MetaImportParams): Promise<MetaImportResult> {
    const formData = new FormData();
    formData.append('file', file);

    return apiClient.post(`${this.baseURL}/importar`, formData, {
      params: { ano },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000, // 60 segundos para importação
    });
  }

  /**
   * Baixa template Excel para preenchimento de metas
   * @param ano - Ano do template (opcional, padrão: ano atual)
   * @returns Blob do arquivo Excel
   */
  async downloadTemplate(ano?: number): Promise<Blob> {
    // O interceptor já retorna response.data, então response já é o Blob
    return apiClient.get(`${this.baseURL}/template`, {
      params: ano ? { ano } : undefined,
      responseType: 'blob',
    });
  }

  /**
   * Helper para fazer download do template no navegador
   * @param ano - Ano do template (opcional)
   */
  async triggerTemplateDownload(ano?: number): Promise<void> {
    const blob = await this.downloadTemplate(ano);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = ano ? `template_metas_${ano}.xlsx` : 'template_metas.xlsx';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}

export const metaService = new MetaService();
