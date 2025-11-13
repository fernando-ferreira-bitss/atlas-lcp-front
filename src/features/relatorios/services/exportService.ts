import axios from 'axios';

import type {
  ExportBaseParams,
  ExportFormato,
  ExportPropostasParams,
  ExportRelatorioCompletoParams,
} from '../types';

// Re-exportar tipos para facilitar importação
export type { ExportFormato } from '../types';

/**
 * Service para gerenciar exportações de dados
 */
class ExportService {
  private readonly baseURL = '/export';

  /**
   * Realiza o download do blob recebido
   * @param blob - Blob de dados
   * @param filename - Nome do arquivo
   */
  private downloadBlob(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }

  /**
   * Gera nome de arquivo com timestamp
   * @param prefix - Prefixo do nome do arquivo
   * @param formato - Formato do arquivo (csv ou xlsx)
   * @returns Nome do arquivo com timestamp
   */
  private generateFilename(prefix: string, formato: ExportFormato = 'xlsx'): string {
    const timestamp = new Date().toISOString().split('T')[0];
    return `${prefix}_${timestamp}.${formato}`;
  }

  /**
   * Exporta vendas com filtros opcionais
   * @param params - Parâmetros de filtro
   * @returns Promise<void>
   */
  async exportVendas(params: ExportBaseParams = {}): Promise<void> {
    try {
      const formato = params.formato || 'xlsx';
      const token = localStorage.getItem('auth_token');

      // Usar axios diretamente para ter controle total da requisição
      const baseURL = import.meta.env.VITE_API_BASE_URL || '';
      const url = `${baseURL.startsWith('http') ? baseURL : `https://${baseURL}`}/api/v1${this.baseURL}/vendas/`;

      const response = await axios.get(url, {
        params: {
          formato,
          data_inicio: params.data_inicio,
          data_fim: params.data_fim,
          empreendimento_id: params.empreendimento_id,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      });

      const filename = this.generateFilename('vendas', formato);
      this.downloadBlob(response.data, filename);
    } catch (error) {
      console.error('Erro ao exportar vendas:', error);
      throw error;
    }
  }

  /**
   * Exporta propostas com filtros opcionais
   * @param params - Parâmetros de filtro
   * @returns Promise<void>
   */
  async exportPropostas(params: ExportPropostasParams = {}): Promise<void> {
    try {
      const formato = params.formato || 'xlsx';
      const token = localStorage.getItem('auth_token');

      // Usar axios diretamente para ter controle total da requisição
      const baseURL = import.meta.env.VITE_API_BASE_URL || '';
      const url = `${baseURL.startsWith('http') ? baseURL : `https://${baseURL}`}/api/v1${this.baseURL}/propostas/`;

      const response = await axios.get(url, {
        params: {
          formato,
          data_inicio: params.data_inicio,
          data_fim: params.data_fim,
          empreendimento_id: params.empreendimento_id,
          status: params.status,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      });

      const filename = this.generateFilename('propostas', formato);
      this.downloadBlob(response.data, filename);
    } catch (error) {
      console.error('Erro ao exportar propostas:', error);
      throw error;
    }
  }

  /**
   * Exporta relatório completo (3 abas: Vendas, Propostas, Empreendimentos)
   * @param params - Parâmetros de filtro
   * @returns Promise<void>
   */
  async exportRelatorioCompleto(params: ExportRelatorioCompletoParams = {}): Promise<void> {
    try {
      const token = localStorage.getItem('auth_token');

      // Usar axios diretamente para ter controle total da requisição
      const baseURL = import.meta.env.VITE_API_BASE_URL || '';
      const url = `${baseURL.startsWith('http') ? baseURL : `https://${baseURL}`}/api/v1${this.baseURL}/relatorio-completo/`;

      const response = await axios.get(url, {
        params: {
          data_inicio: params.data_inicio,
          data_fim: params.data_fim,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      });

      const filename = this.generateFilename('relatorio_completo', 'xlsx');
      this.downloadBlob(response.data, filename);
    } catch (error) {
      console.error('Erro ao exportar relatório completo:', error);
      throw error;
    }
  }
}

export const exportService = new ExportService();
