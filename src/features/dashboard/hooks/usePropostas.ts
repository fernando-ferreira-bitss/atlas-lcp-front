import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { propostaService } from '../services/propostaService';

import type { Proposta, PropostaFilters } from '@/shared/types';

/**
 * Hook para buscar todas as propostas
 * @param filters - Filtros de paginação, empreendimento e status
 * @returns Query result com lista de propostas
 */
export const usePropostas = (filters?: PropostaFilters): UseQueryResult<Proposta[], Error> =>
  useQuery({
    queryKey: ['propostas', filters],
    queryFn: () => propostaService.getAll(filters),
    staleTime: 1000 * 60 * 2, // 2 minutos
  });

/**
 * Hook para buscar uma proposta específica
 * @param id - ID da proposta
 * @param enabled - Se a query deve ser executada
 * @returns Query result com dados da proposta
 */
export const useProposta = (id: number, enabled = true): UseQueryResult<Proposta, Error> =>
  useQuery({
    queryKey: ['proposta', id],
    queryFn: () => propostaService.getById(id),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

/**
 * Hook para buscar propostas de um empreendimento
 * @param empreendimentoId - ID do empreendimento
 * @param enabled - Se a query deve ser executada
 * @returns Query result com propostas do empreendimento
 */
export const usePropostasPorEmpreendimento = (
  empreendimentoId: number,
  enabled = true
): UseQueryResult<Proposta[], Error> =>
  useQuery({
    queryKey: ['propostas-empreendimento', empreendimentoId],
    queryFn: () => propostaService.getByEmpreendimento(empreendimentoId),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
