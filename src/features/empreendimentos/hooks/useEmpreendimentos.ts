import { useQuery } from '@tanstack/react-query';

import { empreendimentoService } from '../services/empreendimentoService';

import type { Empreendimento } from '@/shared/types';
import type { UseQueryResult } from '@tanstack/react-query';

export const useEmpreendimentos = (): UseQueryResult<Empreendimento[], Error> =>
  useQuery({
    queryKey: ['empreendimentos'],
    queryFn: () => empreendimentoService.getAll({ limit: 1000 }),
    staleTime: 1000 * 60 * 10, // 10 minutos
  });

/**
 * Hook para buscar todos os empreendimentos sem paginação
 * Usa a rota /api/v1/empreendimentos/all
 * @param enabled - Se true, executa a query. Útil para só buscar quando necessário.
 */
export const useAllEmpreendimentos = (enabled = true): UseQueryResult<Empreendimento[], Error> =>
  useQuery({
    queryKey: ['empreendimentos', 'all'],
    queryFn: () => empreendimentoService.getAllUnpaginated(),
    staleTime: 0, // Sempre buscar na API
    gcTime: 0, // Não manter em cache
    enabled,
  });

export const useEmpreendimento = (id: number): UseQueryResult<Empreendimento, Error> =>
  useQuery({
    queryKey: ['empreendimento', id],
    queryFn: () => empreendimentoService.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
  });
