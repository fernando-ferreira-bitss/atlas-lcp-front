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

  /**
   * Busca comparativo de vendas entre dois anos
   * @param ano_atual - Ano atual para comparação
   * @param ano_anterior - Ano anterior para comparação
   * @param empreendimento_id - ID do empreendimento (opcional)
   * @returns Lista com comparativo por mês
   */
  async getComparativoAnos(
    ano_atual: number,
    ano_anterior: number,
    empreendimento_id?: number
  ): Promise<ComparativoAnos[]> {
    return apiClient.get<never, ComparativoAnos[]>(
      `${this.baseURL}/comparativo-anos`,
      {
        params: { ano_atual, ano_anterior, empreendimento_id },
      }
    );
  }

  /**
   * Busca taxa de conversão por empreendimento
   * @param filters - Filtros opcionais de data e limite
   * @returns Lista de empreendimentos com taxa de conversão
   */
  async getConversaoPorEmpreendimento(filters?: {
    data_inicio?: string;
    data_fim?: string;
    limit?: number;
  }): Promise<ConversaoPorEmpreendimento[]> {
    return apiClient.get<never, ConversaoPorEmpreendimento[]>(
      `${this.baseURL}/conversao-por-empreendimento`,
      { params: filters }
    );
  }

  /**
   * Busca evolução mensal do ticket médio
   * @param ano - Ano para análise
   * @param empreendimento_id - ID do empreendimento (opcional)
   * @returns Lista com evolução do ticket médio por mês
   */
  async getEvolucaoTicketMedio(
    ano: number,
    empreendimento_id?: number
  ): Promise<EvolucaoTicketMedio[]> {
    return apiClient.get<never, EvolucaoTicketMedio[]>(
      `${this.baseURL}/evolucao-ticket-medio`,
      {
        params: { ano, empreendimento_id },
      }
    );
  }
}

export const dashboardService = new DashboardService();
