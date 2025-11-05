import type {
  DashboardKPIs,
  DashboardResumo,
  GraficoVendasMes,
  TopEmpreendimento,
  VendasPorPeriodo,
  VendasPorPeriodoFilters,
} from '@/shared/types';

import { apiClient } from '@/shared/services/api/client';

interface DashboardFilters {
  data_inicio?: string;
  data_fim?: string;
  empreendimento_id?: number;
}

/**
 * Service para gerenciar dados do dashboard
 */
class DashboardService {
  private readonly baseURL = '/dashboard';

  /**
   * Busca indicadores chave de performance (KPIs)
   * @param filters - Filtros opcionais de data e empreendimento
   * @returns KPIs gerais do dashboard
   */
  async getKPIs(filters?: DashboardFilters): Promise<DashboardKPIs> {
    return apiClient.get<never, DashboardKPIs>(`${this.baseURL}/indicadores`, {
      params: filters,
    });
  }

  /**
   * Busca dados de vendas por mês para gráficos
   * @param ano - Ano para filtrar
   * @param empreendimento_id - ID do empreendimento (opcional)
   * @returns Lista de vendas por mês
   */
  async getGraficoVendasMes(
    ano: number,
    empreendimento_id?: number
  ): Promise<GraficoVendasMes[]> {
    return apiClient.get<never, GraficoVendasMes[]>(
      `${this.baseURL}/grafico-vendas-mes`,
      {
        params: { ano, empreendimento_id },
      }
    );
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
   * @param filters - Filtros opcionais de data e limite
   * @returns Lista dos top empreendimentos
   */
  async getTopEmpreendimentos(filters?: {
    data_inicio?: string;
    data_fim?: string;
    limit?: number;
  }): Promise<TopEmpreendimento[]> {
    return apiClient.get<never, TopEmpreendimento[]>(
      `${this.baseURL}/top-empreendimentos`,
      { params: filters }
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
