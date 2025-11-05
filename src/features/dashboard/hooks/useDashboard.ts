import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { dashboardService } from '../services/dashboardService';

import type {
  DashboardKPIs,
  DashboardResumo,
  TopEmpreendimento,
  VendasPorPeriodo,
  VendasPorPeriodoFilters,
} from '@/shared/types';

/**
 * Hook para buscar KPIs do dashboard
 * @returns Query result com KPIs
 */
export const useDashboardKPIs = (): UseQueryResult<DashboardKPIs, Error> => useQuery({
    queryKey: ['dashboard-kpis'],
    queryFn: () => dashboardService.getKPIs(),
    staleTime: 1000 * 60 * 2, // 2 minutos
    refetchInterval: 1000 * 60 * 5, // Atualiza a cada 5 minutos
  });

/**
 * Hook para buscar resumo completo do dashboard
 * @returns Query result com resumo
 */
export const useDashboardResumo = (): UseQueryResult<DashboardResumo, Error> => useQuery({
    queryKey: ['dashboard-resumo'],
    queryFn: () => dashboardService.getResumo(),
    staleTime: 1000 * 60 * 2, // 2 minutos
  });

/**
 * Hook para buscar top empreendimentos
 * @param limit - Limite de resultados
 * @returns Query result com top empreendimentos
 */
export const useTopEmpreendimentos = (
  limit = 10
): UseQueryResult<TopEmpreendimento[], Error> => useQuery({
    queryKey: ['top-empreendimentos', limit],
    queryFn: () => dashboardService.getTopEmpreendimentos(limit),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

/**
 * Hook para buscar vendas por período
 * @param filters - Filtros de data e agrupamento
 * @returns Query result com vendas agrupadas
 */
export const useVendasPorPeriodo = (
  filters?: VendasPorPeriodoFilters
): UseQueryResult<VendasPorPeriodo[], Error> => useQuery({
    queryKey: ['vendas-por-periodo', filters],
    queryFn: () => dashboardService.getVendasPorPeriodo(filters),
    staleTime: 1000 * 60 * 5, // 5 minutos
    enabled: !!filters, // Só executa se houver filtros
  });
