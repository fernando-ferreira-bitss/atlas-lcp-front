import { AxiosError } from 'axios';
import { useState } from 'react';

import { syncService } from '../services/syncService';

import type { SyncApiError, SyncResponse, SyncVendasParams } from '../types';

/**
 * Hook customizado para gerenciar sincronizações de dados
 * Fornece estados de loading e error, além de funções para executar sincronizações
 */
export function useSync() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<SyncResponse | null>(null);

  /**
   * Trata erros de API e retorna mensagem amigável
   */
  const handleError = (err: unknown): string => {
    if (err instanceof AxiosError) {
      if (err.response?.status === 401) {
        return 'Sessão expirada. Faça login novamente.';
      }
      if (err.response?.status === 403) {
        return 'Apenas administradores podem executar sincronizações.';
      }
      if (err.response?.status === 504) {
        return 'Sincronização demorou muito. Verifique o status mais tarde.';
      }

      const apiError = err.response?.data as SyncApiError;
      return apiError?.detail || apiError?.message || 'Erro ao executar sincronização.';
    }

    return 'Erro inesperado ao executar sincronização.';
  };

  /**
   * Sincroniza empreendimentos
   */
  const syncEmpreendimentos = async (): Promise<SyncResponse | null> => {
    setIsSyncing(true);
    setError(null);

    try {
      const result = await syncService.syncEmpreendimentos();
      setLastResult(result);
      return result;
    } catch (err) {
      const errorMessage = handleError(err);
      setError(errorMessage);
      return null;
    } finally {
      setIsSyncing(false);
    }
  };

  /**
   * Sincroniza vendas
   */
  const syncVendas = async (params?: SyncVendasParams): Promise<SyncResponse | null> => {
    setIsSyncing(true);
    setError(null);

    try {
      const result = await syncService.syncVendas(params);
      setLastResult(result);
      return result;
    } catch (err) {
      const errorMessage = handleError(err);
      setError(errorMessage);
      return null;
    } finally {
      setIsSyncing(false);
    }
  };

  /**
   * Executa sincronização completa
   */
  const syncFull = async (): Promise<SyncResponse | null> => {
    setIsSyncing(true);
    setError(null);

    try {
      const result = await syncService.syncFull();
      setLastResult(result);
      return result;
    } catch (err) {
      const errorMessage = handleError(err);
      setError(errorMessage);
      return null;
    } finally {
      setIsSyncing(false);
    }
  };

  /**
   * Limpa o erro atual
   */
  const clearError = () => {
    setError(null);
  };

  /**
   * Limpa o último resultado
   */
  const clearLastResult = () => {
    setLastResult(null);
  };

  return {
    isSyncing,
    error,
    lastResult,
    syncEmpreendimentos,
    syncVendas,
    syncFull,
    clearError,
    clearLastResult,
  };
}
