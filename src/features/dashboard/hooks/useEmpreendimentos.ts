import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { empreendimentoService } from '../services/empreendimentoService';

import type { Empreendimento, EmpreendimentoStats, PaginationParams } from '@/shared/types';

/**
 * Hook para buscar todos os empreendimentos
 * @param params - Parâmetros de paginação
 * @returns Query result com lista de empreendimentos
 */
export const useEmpreendimentos = (
  params?: PaginationParams
): UseQueryResult<Empreendimento[], Error> =>
  useQuery({
    queryKey: ['empreendimentos', params],
    queryFn: () => empreendimentoService.getAll(params),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

/**
 * Hook para buscar um empreendimento específico
 * @param id - ID do empreendimento
 * @param enabled - Se a query deve ser executada
 * @returns Query result com dados do empreendimento
 */
export const useEmpreendimento = (
  id: number,
  enabled = true
): UseQueryResult<Empreendimento, Error> =>
  useQuery({
    queryKey: ['empreendimento', id],
    queryFn: () => empreendimentoService.getById(id),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

/**
 * Hook para buscar estatísticas dos empreendimentos
 * @returns Query result com estatísticas
 */
export const useEmpreendimentoStats = (): UseQueryResult<EmpreendimentoStats, Error> =>
  useQuery({
    queryKey: ['empreendimento-stats'],
    queryFn: () => empreendimentoService.getStats(),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
