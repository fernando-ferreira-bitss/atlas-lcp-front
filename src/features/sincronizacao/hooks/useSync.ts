import { AxiosError } from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';

import { syncService } from '../services/syncService';

import type { SyncApiError, SyncLog } from '../types';

/**
 * Hook customizado para gerenciar sincronizações de dados
 * Implementa padrão assíncrono: dispara sync + polling de logs
 */
export function useSync() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<SyncLog | null>(null);
  const [syncProgress, setSyncProgress] = useState<string | null>(null);

  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const syncStartTimeRef = useRef<Date | null>(null);

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
      if (err.response?.status === 409) {
        return 'Já existe uma sincronização em andamento.';
      }

      const apiError = err.response?.data as SyncApiError;
      return apiError?.detail || apiError?.message || 'Erro ao executar sincronização.';
    }

    return 'Erro inesperado ao executar sincronização.';
  };

  /**
   * Para o polling de logs
   */
  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  /**
   * Busca o log mais recente para verificar status
   */
  const pollLogs = useCallback(async () => {
    try {
      const response = await syncService.getLogs({ limit: 1, offset: 0 });

      if (response.logs.length === 0) {
        return;
      }

      const latestLog = response.logs[0];

      // Verifica se é o log da sync atual (iniciada após syncStartTimeRef)
      if (syncStartTimeRef.current && new Date(latestLog.data_inicio) < syncStartTimeRef.current) {
        return;
      }

      // Atualiza progresso
      if (latestLog.status === 'em_progresso') {
        const processados = latestLog.total_registros || 0;
        setSyncProgress(`Processando... ${processados} registros processados`);
      } else if (latestLog.status === 'concluido' || latestLog.status === 'sucesso') {
        // Sincronização concluída
        setLastResult(latestLog);
        setSyncProgress(null);
        setIsSyncing(false);
        stopPolling();
      } else if (latestLog.status === 'erro' || latestLog.status === 'falha') {
        // Sincronização com erro
        setError(latestLog.detalhes_erro || latestLog.mensagem || 'Erro durante a sincronização');
        setLastResult(latestLog);
        setSyncProgress(null);
        setIsSyncing(false);
        stopPolling();
      }
    } catch (err) {
      // Erro ao buscar logs - não interrompe o polling
      console.error('Erro ao buscar logs:', err);
    }
  }, [stopPolling]);

  /**
   * Inicia polling de logs
   */
  const startPolling = useCallback(() => {
    stopPolling();

    // Poll imediato
    pollLogs();

    // Poll a cada 1 minuto
    pollingIntervalRef.current = setInterval(pollLogs, 60000);
  }, [pollLogs, stopPolling]);

  /**
   * Executa sincronização completa
   * Dispara a sincronização e inicia polling para monitorar progresso
   */
  const syncFull = async (): Promise<boolean> => {
    setIsSyncing(true);
    setError(null);
    setLastResult(null);
    setSyncProgress('Iniciando sincronização...');
    syncStartTimeRef.current = new Date();

    try {
      // Dispara a sincronização (retorna imediatamente)
      await syncService.syncFull();

      setSyncProgress('Sincronização em andamento...');

      // Inicia polling para monitorar progresso
      startPolling();

      return true;
    } catch (err) {
      const errorMessage = handleError(err);
      setError(errorMessage);
      setIsSyncing(false);
      setSyncProgress(null);
      syncStartTimeRef.current = null;
      return false;
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

  /**
   * Cleanup: para polling ao desmontar componente
   */
  useEffect(
    () => () => {
      stopPolling();
    },
    [stopPolling]
  );

  return {
    isSyncing,
    error,
    lastResult,
    syncProgress,
    syncFull,
    clearError,
    clearLastResult,
  };
}
