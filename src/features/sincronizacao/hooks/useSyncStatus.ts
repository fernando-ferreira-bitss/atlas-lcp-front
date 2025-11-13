import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { syncService } from '../services/syncService';

import type { SyncStatusGeral } from '../types';

/**
 * Hook para buscar e monitorar o status das sincronizações
 * Atualiza automaticamente a cada 30 segundos
 */
export function useSyncStatus(autoRefresh = true) {
  const [refreshInterval, setRefreshInterval] = useState<number | false>(autoRefresh ? 30000 : false);

  const {
    data: status,
    isLoading,
    error,
    refetch,
  } = useQuery<SyncStatusGeral>({
    queryKey: ['sync-status'],
    queryFn: () => syncService.getStatus(),
    refetchInterval: refreshInterval,
    staleTime: 30000, // 30 segundos
  });

  /**
   * Ativa ou desativa o auto-refresh
   */
  const toggleAutoRefresh = (enabled: boolean) => {
    setRefreshInterval(enabled ? 30000 : false);
  };

  /**
   * Força atualização imediata
   */
  const refresh = () => {
    refetch();
  };

  return {
    status,
    isLoading,
    error,
    refresh,
    autoRefreshEnabled: refreshInterval !== false,
    toggleAutoRefresh,
  };
}
