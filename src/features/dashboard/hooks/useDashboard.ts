import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { dashboardService } from '../services/dashboardService';

import type {
  ComparativoAnos,
  ConversaoPorEmpreendimento,
  DashboardKPIs,
  DashboardResumo,
  EvolucaoTicketMedio,
  GraficoVendasMes,
  TopEmpreendimento,
  VendasPorPeriodo,
  VendasPorPeriodoFilters,
} from '@/shared/types';

interface DashboardFilters {
  data_inicio?: string;
  data_fim?: string;
  empreendimento_id?: number;
}

/**
 * Hook para buscar KPIs do dashboard
 * @param filters - Filtros opcionais
 * @returns Query result com KPIs
 */
export const useDashboardKPIs = (
  filters?: DashboardFilters
): UseQueryResult<DashboardKPIs, Error> =>
  useQuery({
    queryKey: ['dashboard-kpis', filters],
    queryFn: () => dashboardService.getKPIs(filters),
    staleTime: 1000 * 60 * 2, // 2 minutos
    refetchInterval: 1000 * 60 * 5, // Atualiza a cada 5 minutos
  });

/**
 * Hook para buscar gráfico de vendas por mês
 * @param ano - Ano para filtrar
 * @param empreendimento_id - ID do empreendimento (opcional)
 * @returns Query result com dados do gráfico
 */
export const useGraficoVendasMes = (
  ano: number,
  empreendimento_id?: number
): UseQueryResult<GraficoVendasMes[], Error> =>
  useQuery({
    queryKey: ['grafico-vendas-mes', ano, empreendimento_id],
    queryFn: () => dashboardService.getGraficoVendasMes(ano, empreendimento_id),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

/**
 * Hook para buscar resumo completo do dashboard
 * @returns Query result com resumo
 */
export const useDashboardResumo = (): UseQueryResult<DashboardResumo, Error> =>
  useQuery({
    queryKey: ['dashboard-resumo'],
    queryFn: () => dashboardService.getResumo(),
    staleTime: 1000 * 60 * 2, // 2 minutos
  });

/**
 * Hook para buscar top empreendimentos
 * @param filters - Filtros opcionais
 * @returns Query result com top empreendimentos
 */
export const useTopEmpreendimentos = (filters?: {
  data_inicio?: string;
  data_fim?: string;
  limit?: number;
}): UseQueryResult<TopEmpreendimento[], Error> =>
  useQuery({
    queryKey: ['top-empreendimentos', filters],
    queryFn: () => dashboardService.getTopEmpreendimentos(filters),
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

/**
 * Hook para buscar comparativo de vendas entre dois anos
 * @param ano_atual - Ano atual para comparação
 * @param ano_anterior - Ano anterior para comparação
 * @param empreendimento_id - ID do empreendimento (opcional)
 * @returns Query result com comparativo por mês
 */
export const useComparativoAnos = (
  ano_atual: number,
  ano_anterior: number,
  empreendimento_id?: number
): UseQueryResult<ComparativoAnos[], Error> =>
  useQuery({
    queryKey: ['comparativo-anos', ano_atual, ano_anterior, empreendimento_id],
    queryFn: () => dashboardService.getComparativoAnos(ano_atual, ano_anterior, empreendimento_id),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

/**
 * Hook para buscar taxa de conversão por empreendimento
 * @param filters - Filtros opcionais de data e limite
 * @returns Query result com conversão por empreendimento
 */
export const useConversaoPorEmpreendimento = (filters?: {
  data_inicio?: string;
  data_fim?: string;
  limit?: number;
}): UseQueryResult<ConversaoPorEmpreendimento[], Error> =>
  useQuery({
    queryKey: ['conversao-por-empreendimento', filters],
    queryFn: () => dashboardService.getConversaoPorEmpreendimento(filters),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

/**
 * Hook para buscar evolução mensal do ticket médio
 * @param ano - Ano para análise
 * @param empreendimento_id - ID do empreendimento (opcional)
 * @returns Query result com evolução do ticket médio
 */
export const useEvolucaoTicketMedio = (
  ano: number,
  empreendimento_id?: number
): UseQueryResult<EvolucaoTicketMedio[], Error> =>
  useQuery({
    queryKey: ['evolucao-ticket-medio', ano, empreendimento_id],
    queryFn: () => dashboardService.getEvolucaoTicketMedio(ano, empreendimento_id),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
