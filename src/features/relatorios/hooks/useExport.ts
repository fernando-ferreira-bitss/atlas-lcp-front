import { AxiosError } from 'axios';
import { useState } from 'react';

import { exportService } from '../services/exportService';

import type {
  ExportApiError,
  ExportBaseParams,
  ExportPropostasParams,
  ExportRelatorioCompletoParams,
} from '../types';

/**
 * Hook customizado para gerenciar exportações de dados
 * Fornece estados de loading e error, além de funções para exportar diferentes tipos de dados
 */
export function useExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Trata erros de API e retorna mensagem amigável
   */
  const handleError = (err: unknown): string => {
    if (err instanceof AxiosError) {
      if (err.response?.status === 401) {
        return 'Sessão expirada. Faça login novamente.';
      }
      if (err.response?.status === 403) {
        return 'Você não tem permissão para exportar dados.';
      }
      if (err.response?.status === 422) {
        return 'Filtros inválidos. Verifique os dados e tente novamente.';
      }

      const apiError = err.response?.data as ExportApiError;
      return apiError?.message || apiError?.detail || 'Erro ao exportar dados.';
    }

    return 'Erro inesperado ao exportar dados.';
  };

  /**
   * Exporta vendas com filtros opcionais
   */
  const exportVendas = async (params: ExportBaseParams = {}): Promise<boolean> => {
    setIsExporting(true);
    setError(null);

    try {
      await exportService.exportVendas(params);
      return true;
    } catch (err) {
      const errorMessage = handleError(err);
      setError(errorMessage);
      return false;
    } finally {
      setIsExporting(false);
    }
  };

  /**
   * Exporta propostas com filtros opcionais
   */
  const exportPropostas = async (params: ExportPropostasParams = {}): Promise<boolean> => {
    setIsExporting(true);
    setError(null);

    try {
      await exportService.exportPropostas(params);
      return true;
    } catch (err) {
      const errorMessage = handleError(err);
      setError(errorMessage);
      return false;
    } finally {
      setIsExporting(false);
    }
  };

  /**
   * Exporta relatório completo (3 abas: Vendas, Propostas, Empreendimentos)
   */
  const exportRelatorioCompleto = async (
    params: ExportRelatorioCompletoParams = {}
  ): Promise<boolean> => {
    setIsExporting(true);
    setError(null);

    try {
      await exportService.exportRelatorioCompleto(params);
      return true;
    } catch (err) {
      const errorMessage = handleError(err);
      setError(errorMessage);
      return false;
    } finally {
      setIsExporting(false);
    }
  };

  /**
   * Limpa o erro atual
   */
  const clearError = () => {
    setError(null);
  };

  return {
    isExporting,
    error,
    exportVendas,
    exportPropostas,
    exportRelatorioCompleto,
    clearError,
  };
}
