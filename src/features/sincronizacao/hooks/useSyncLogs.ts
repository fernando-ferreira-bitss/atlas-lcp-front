import { useQuery } from '@tanstack/react-query';

import { syncService } from '../services/syncService';

import type { GetLogsParams } from '../types';

/**
 * Hook para buscar histórico de logs de sincronização
 * @param params - Parâmetros de paginação (limit, offset)
 * @returns Query com lista de logs
 */
export function useSyncLogs(params?: GetLogsParams) {
  return useQuery({
    queryKey: ['sync-logs', params],
    queryFn: () => syncService.getLogs(params),
    staleTime: 1000 * 30, // 30 segundos
    gcTime: 1000 * 60 * 5, // 5 minutos
    refetchInterval: false, // Não refetch automático (apenas manual)
  });
}
