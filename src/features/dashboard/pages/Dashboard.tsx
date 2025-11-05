import { BarChart3, Download, FileText, Percent, Target, TrendingUp } from 'lucide-react';
import { useState } from 'react';

import { KPICard } from '../components/cards/KPICard';
import { ComparativoAnosChart } from '../components/charts/ComparativoAnosChart';
import { ConversaoPorEmpreendimentoChart } from '../components/charts/ConversaoPorEmpreendimentoChart';
import { MetaGaugeChart } from '../components/charts/MetaGaugeChart';
import { TicketMedioChart } from '../components/charts/TicketMedioChart';
import { VendasMesChart } from '../components/charts/VendasMesChart';
import { VendasPorEmpreendimentoChart } from '../components/charts/VendasPorEmpreendimentoChart';
import { DashboardFilters } from '../components/filters/DashboardFilters';
import { UltimasVendasTable } from '../components/tables/UltimasVendasTable';
import { useDashboardKPIs, useGraficoVendasMes, useTopEmpreendimentos } from '../hooks/useDashboard';
import {
  enhanceKPIsWithMockData,
  getMockComparativoAnos,
  getMockConversaoPorEmpreendimento,
  getMockEvolucaoTicketMedio,
} from '../utils/mockData';

import { Loading } from '@/shared/components/common';
import { Button } from '@/shared/components/ui/button';
import type { DashboardFilters as IFilters } from '@/shared/types';
import { formatCurrency, formatPercentage } from '@/shared/utils/format';

export const Dashboard = () => {
  const [filters, setFilters] = useState<IFilters>({});

  const currentYear = new Date().getFullYear();

  const { data: kpisRaw, isLoading, error } = useDashboardKPIs(filters);
  const { data: graficoData, isLoading: isLoadingGrafico } = useGraficoVendasMes(
    currentYear,
    filters.empreendimento_id
  );
  const { data: topEmpreendimentos, isLoading: isLoadingTop } = useTopEmpreendimentos({
    data_inicio: filters.data_inicio,
    data_fim: filters.data_fim,
    limit: 5,
  });

  // Dados mockados
  const comparativoAnos = getMockComparativoAnos();
  const conversaoPorEmp = getMockConversaoPorEmpreendimento();
  const evolucaoTicket = getMockEvolucaoTicketMedio();

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-600">Erro ao carregar dados</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {error instanceof Error ? error.message : 'Verifique se o backend está rodando'}
          </p>
        </div>
      </div>
    );
  }

  if (!kpisRaw) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-600">Dados não disponíveis</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Não foi possível carregar os indicadores
          </p>
        </div>
      </div>
    );
  }

  // Adiciona dados mockados aos KPIs
  const kpis = enhanceKPIsWithMockData(kpisRaw);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Dashboard</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Visão geral dos indicadores de vendas
          </p>
        </div>
        <Button className="w-full bg-green-600 hover:bg-green-700 sm:w-auto">
          <Download className="mr-2 h-4 w-4" />
          Exportar CSV/XLSX
        </Button>
      </div>

      {/* Filtros */}
      <DashboardFilters onFilterChange={setFilters} />

      {/* 8 Cards de Indicadores Principais */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* 1. Volume de Propostas */}
        <KPICard
          title="Volume de Propostas"
          value={kpis.total_propostas}
          subtitle={formatCurrency(kpis.valor_total_propostas || 0)}
          icon={FileText}
        />

        {/* 2. Volume de Vendas */}
        <KPICard
          title="Volume de Vendas"
          value={kpis.total_vendas}
          subtitle={formatCurrency(kpis.valor_total_vendas)}
          icon={TrendingUp}
        />

        {/* 3. Conversão (Qtd) */}
        <KPICard
          title="Conversão (Qtd)"
          value={formatPercentage(kpis.taxa_conversao, 1)}
          subtitle={`${kpis.total_vendas} de ${kpis.total_propostas} propostas`}
          icon={Target}
        />

        {/* 4. Conversão (R$) - MOCKADO */}
        <KPICard
          title="Conversão (R$)"
          value={formatPercentage(kpis.taxa_conversao_valor || 0, 1)}
          subtitle="Relação financeira"
          icon={Percent}
        />

        {/* 5. Ticket Médio (Proposta) - MOCKADO */}
        <KPICard
          title="Ticket Médio (Proposta)"
          value={formatCurrency(kpis.ticket_medio_proposta || 0)}
          icon={BarChart3}
        />

        {/* 6. Ticket Médio (Venda) */}
        <KPICard
          title="Ticket Médio (Venda)"
          value={formatCurrency(kpis.ticket_medio)}
          icon={BarChart3}
        />

        {/* 7. Meta VGV Mensal - MOCKADO */}
        <KPICard
          title="Meta VGV Mensal"
          value={formatPercentage(kpis.percentual_meta_mensal || 0, 1)}
          subtitle={formatCurrency(kpis.meta_vendas_mensal || 0)}
          icon={Target}
        />

        {/* 8. Meta VGV YTD - MOCKADO */}
        <KPICard
          title="Meta VGV YTD"
          value={formatPercentage(kpis.percentual_meta_ytd || 0, 1)}
          subtitle={formatCurrency(kpis.meta_vendas_ytd || 0)}
          icon={Target}
        />
      </div>

      {/* Atendimento de Metas (Gauges) - MOCKADO */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-4 sm:p-6">
          <h2 className="mb-4 text-base font-semibold sm:text-lg">Atendimento de Metas</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <MetaGaugeChart
              percentual={kpis.percentual_meta_mensal || 0}
              title="Meta Mensal"
              subtitle={formatCurrency(kpis.meta_vendas_mensal || 0)}
            />
            <MetaGaugeChart
              percentual={kpis.percentual_meta_ytd || 0}
              title="Meta YTD"
              subtitle={formatCurrency(kpis.meta_vendas_ytd || 0)}
            />
          </div>
        </div>

        {/* Performance de Vendas */}
        <div className="rounded-lg border bg-card p-4 sm:p-6">
          <h2 className="mb-4 text-base font-semibold sm:text-lg">Performance de Vendas</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Realizado:</span>
              <span className="font-medium">{formatCurrency(kpis.valor_total_vendas)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Meta:</span>
              <span className="font-medium">{formatCurrency(kpis.meta_vendas)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Propostas:</span>
              <span className="font-medium">{kpis.total_propostas}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Taxa Conversão:</span>
              <span className="font-medium">{formatPercentage(kpis.taxa_conversao, 1)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Meta vs Realizado (Mensal) */}
      <div className="rounded-lg border bg-card p-4 sm:p-6">
        <h2 className="mb-4 text-base font-semibold sm:text-lg">
          Meta vs Realizado - {currentYear}
        </h2>
        {isLoadingGrafico && (
          <div className="flex h-80 items-center justify-center">
            <Loading />
          </div>
        )}
        {!isLoadingGrafico && graficoData && graficoData.length > 0 && (
          <div className="h-80">
            <VendasMesChart data={graficoData} />
          </div>
        )}
        {!isLoadingGrafico && (!graficoData || graficoData.length === 0) && (
          <div className="flex h-80 items-center justify-center">
            <p className="text-sm text-muted-foreground">Nenhum dado disponível</p>
          </div>
        )}
      </div>

      {/* Evolução de Vendas (2024 vs 2025) - MOCKADO */}
      <div className="rounded-lg border bg-card p-4 sm:p-6">
        <h2 className="mb-4 text-base font-semibold sm:text-lg">
          Evolução de Vendas (2024 vs 2025)
          <span className="ml-2 text-xs font-normal text-orange-600">[DADOS MOCKADOS]</span>
        </h2>
        <div className="h-80">
          <ComparativoAnosChart data={comparativoAnos} />
        </div>
      </div>

      {/* Taxa de Conversão por Empreendimento - MOCKADO */}
      <div className="rounded-lg border bg-card p-4 sm:p-6">
        <h2 className="mb-4 text-base font-semibold sm:text-lg">
          Taxa de Conversão por Empreendimento
          <span className="ml-2 text-xs font-normal text-orange-600">[DADOS MOCKADOS]</span>
        </h2>
        <div className="h-80">
          <ConversaoPorEmpreendimentoChart data={conversaoPorEmp} />
        </div>
      </div>

      {/* Vendas por Empreendimento */}
      <div className="rounded-lg border bg-card p-4 sm:p-6">
        <h2 className="mb-4 text-base font-semibold sm:text-lg">
          Top 5 Empreendimentos
        </h2>
        {isLoadingTop && (
          <div className="flex h-80 items-center justify-center">
            <Loading />
          </div>
        )}
        {!isLoadingTop && topEmpreendimentos && topEmpreendimentos.length > 0 && (
          <div className="h-80">
            <VendasPorEmpreendimentoChart data={topEmpreendimentos} />
          </div>
        )}
        {!isLoadingTop && (!topEmpreendimentos || topEmpreendimentos.length === 0) && (
          <div className="flex h-80 items-center justify-center">
            <p className="text-sm text-muted-foreground">Nenhum dado disponível</p>
          </div>
        )}
      </div>

      {/* Evolução do Ticket Médio - MOCKADO */}
      <div className="rounded-lg border bg-card p-4 sm:p-6">
        <h2 className="mb-4 text-base font-semibold sm:text-lg">
          Evolução do Ticket Médio
          <span className="ml-2 text-xs font-normal text-orange-600">[DADOS MOCKADOS]</span>
        </h2>
        <div className="h-80">
          <TicketMedioChart data={evolucaoTicket} />
        </div>
      </div>

      {/* Tabela de Últimas Vendas */}
      <div className="rounded-lg border bg-card p-4 sm:p-6">
        <h2 className="mb-4 text-base font-semibold sm:text-lg">Últimas Vendas</h2>
        <UltimasVendasTable />
      </div>
    </div>
  );
};
