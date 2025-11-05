import type {
  DashboardKPIs,
  DashboardResumo,
  TopEmpreendimento,
  VendasPorPeriodo,
  VendasPorPeriodoFilters,
} from '@/shared/types';

import { apiClient } from '@/shared/services/api/client';


/**
 * Service para gerenciar dados do dashboard
 */
class DashboardService {
  private readonly baseURL = '/dashboard';

  /**
   * Busca indicadores chave de performance (KPIs)
   * @returns KPIs gerais do dashboard
   */
  async getKPIs(): Promise<DashboardKPIs> {
    return apiClient.get<never, DashboardKPIs>(`${this.baseURL}/kpis`);
  }

  /**
   * Busca resumo completo do dashboard
   * @returns Resumo com KPIs, top empreendimentos e vendas por mês
   */
  async getResumo(): Promise<DashboardResumo> {
    return apiClient.get<never, DashboardResumo>(this.baseURL);
  }

  /**
   * Busca empreendimentos com mais vendas
   * @param limit - Limite de registros (padrão: 10)
   * @returns Lista dos top empreendimentos
   */
  async getTopEmpreendimentos(limit = 10): Promise<TopEmpreendimento[]> {
    return apiClient.get<never, TopEmpreendimento[]>(
      `${this.baseURL}/top-empreendimentos`,
      { params: { limit } }
    );
  }

  /**
   * Busca vendas agrupadas por período
   * @param filters - Filtros de data e agrupamento (dia/semana/mês)
   * @returns Vendas agrupadas por período
   */
  async getVendasPorPeriodo(
    filters?: VendasPorPeriodoFilters
  ): Promise<VendasPorPeriodo[]> {
    return apiClient.get<never, VendasPorPeriodo[]>(
      `${this.baseURL}/vendas-por-periodo`,
      { params: filters }
    );
  }
}

export const dashboardService = new DashboardService();
