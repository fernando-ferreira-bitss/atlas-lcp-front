import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { vendaService } from '../services/vendaService';

import type { Venda, VendaFilters } from '@/shared/types';

/**
 * Hook para buscar todas as vendas
 * @param filters - Filtros de paginação, empreendimento, status e datas
 * @returns Query result com lista de vendas
 */
export const useVendas = (filters?: VendaFilters): UseQueryResult<Venda[], Error> =>
  useQuery({
    queryKey: ['vendas', filters],
    queryFn: () => vendaService.getAll(filters),
    staleTime: 1000 * 60, // 1 minuto
    refetchInterval: 1000 * 60 * 10, // Atualiza a cada 10 minutos
  });

/**
 * Hook para buscar uma venda específica
 * @param id - ID da venda
 * @param enabled - Se a query deve ser executada
 * @returns Query result com dados da venda
 */
export const useVenda = (id: number, enabled = true): UseQueryResult<Venda, Error> =>
  useQuery({
    queryKey: ['venda', id],
    queryFn: () => vendaService.getById(id),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

/**
 * Hook para buscar vendas de um empreendimento
 * @param empreendimentoId - ID do empreendimento
 * @param enabled - Se a query deve ser executada
 * @returns Query result com vendas do empreendimento
 */
export const useVendasPorEmpreendimento = (
  empreendimentoId: number,
  enabled = true
): UseQueryResult<Venda[], Error> =>
  useQuery({
    queryKey: ['vendas-empreendimento', empreendimentoId],
    queryFn: () => vendaService.getByEmpreendimento(empreendimentoId),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
