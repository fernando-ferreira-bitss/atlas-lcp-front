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
import {
  useComparativoAnos,
  useConversaoPorEmpreendimento,
  useDashboardKPIs,
  useEvolucaoTicketMedio,
  useGraficoVendasMes,
  useTopEmpreendimentos,
} from '../hooks/useDashboard';

import { Loading } from '@/shared/components/common';
import { Button } from '@/shared/components/ui/button';
import type { DashboardFilters as IFilters } from '@/shared/types';
import { formatCurrency, formatPercentage } from '@/shared/utils/format';

export const Dashboard = () => {
  const [filters, setFilters] = useState<IFilters>({});

  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;

  const { data: kpis, isLoading, error } = useDashboardKPIs(filters);
  const { data: graficoData, isLoading: isLoadingGrafico } = useGraficoVendasMes(
    currentYear,
    filters.empreendimento_id
  );
  const { data: topEmpreendimentos, isLoading: isLoadingTop } = useTopEmpreendimentos({
    data_inicio: filters.data_inicio,
    data_fim: filters.data_fim,
    limit: 5,
  });

  // Novos hooks para dados reais
  const { data: comparativoAnos, isLoading: isLoadingComparativo } = useComparativoAnos(
    currentYear,
    previousYear,
    filters.empreendimento_id
  );
  const { data: conversaoPorEmp, isLoading: isLoadingConversao } = useConversaoPorEmpreendimento({
    data_inicio: filters.data_inicio,
    data_fim: filters.data_fim,
    limit: 10,
  });
  const { data: evolucaoTicket, isLoading: isLoadingTicket } = useEvolucaoTicketMedio(
    currentYear,
    filters.empreendimento_id
  );

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

  if (!kpis) {
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

        {/* 4. Conversão (R$) */}
        <KPICard
          title="Conversão (R$)"
          value={formatPercentage(kpis.taxa_conversao_valor, 1)}
          subtitle="Relação financeira"
          icon={Percent}
        />

        {/* 5. Ticket Médio (Proposta) */}
        <KPICard
          title="Ticket Médio (Proposta)"
          value={formatCurrency(kpis.ticket_medio_proposta)}
          icon={BarChart3}
        />

        {/* 6. Ticket Médio (Venda) */}
        <KPICard
          title="Ticket Médio (Venda)"
          value={formatCurrency(kpis.ticket_medio)}
          icon={BarChart3}
        />

        {/* 7. Meta VGV Mensal */}
        <KPICard
          title="Meta VGV Mensal"
          value={formatPercentage(kpis.percentual_meta_mensal, 1)}
          subtitle={formatCurrency(kpis.meta_vendas_mensal)}
          icon={Target}
        />

        {/* 8. Meta VGV YTD */}
        <KPICard
          title="Meta VGV YTD"
          value={formatPercentage(kpis.percentual_meta_ytd, 1)}
          subtitle={formatCurrency(kpis.meta_vendas_ytd)}
          icon={Target}
        />
      </div>

      {/* Primeira linha: Atendimento de Metas | Meta vs. Realizado (Mensal) */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Atendimento de Metas (Gauges) */}
        <div className="rounded-lg border bg-card p-4 sm:p-6">
          <h2 className="mb-4 text-base font-semibold sm:text-lg">Atendimento de Metas</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <MetaGaugeChart
              percentual={kpis.percentual_meta_mensal}
              title="Meta Mensal"
              subtitle={formatCurrency(kpis.meta_vendas_mensal)}
            />
            <MetaGaugeChart
              percentual={kpis.percentual_meta_ytd}
              title="Meta YTD"
              subtitle={formatCurrency(kpis.meta_vendas_ytd)}
            />
          </div>
        </div>

        {/* Meta vs. Realizado (Mensal) */}
        <div className="rounded-lg border bg-card p-4 sm:p-6">
          <h2 className="mb-4 text-base font-semibold sm:text-lg">
            Meta vs. Realizado (Mensal)
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
      </div>

      {/* Segunda linha: Evolução de Vendas | Taxa de Conversão */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Evolução de Vendas (2024 vs 2025) */}
        <div className="rounded-lg border bg-card p-4 sm:p-6">
          <h2 className="mb-4 text-base font-semibold sm:text-lg">
            Evolução de Vendas ({previousYear} vs {currentYear})
          </h2>
          {isLoadingComparativo && (
            <div className="flex h-80 items-center justify-center">
              <Loading />
            </div>
          )}
          {!isLoadingComparativo && comparativoAnos && comparativoAnos.length > 0 && (
            <div className="h-80">
              <ComparativoAnosChart data={comparativoAnos} />
            </div>
          )}
          {!isLoadingComparativo && (!comparativoAnos || comparativoAnos.length === 0) && (
            <div className="flex h-80 items-center justify-center">
              <p className="text-sm text-muted-foreground">Nenhum dado disponível</p>
            </div>
          )}
        </div>

        {/* Taxa de Conversão por Empreendimento */}
        <div className="rounded-lg border bg-card p-4 sm:p-6">
          <h2 className="mb-4 text-base font-semibold sm:text-lg">
            Taxa de Conversão por Empreendimento
          </h2>
          {isLoadingConversao && (
            <div className="flex h-80 items-center justify-center">
              <Loading />
            </div>
          )}
          {!isLoadingConversao && conversaoPorEmp && conversaoPorEmp.length > 0 && (
            <div className="h-80">
              <ConversaoPorEmpreendimentoChart data={conversaoPorEmp} />
            </div>
          )}
          {!isLoadingConversao && (!conversaoPorEmp || conversaoPorEmp.length === 0) && (
            <div className="flex h-80 items-center justify-center">
              <p className="text-sm text-muted-foreground">Nenhum dado disponível</p>
            </div>
          )}
        </div>
      </div>

      {/* Terceira linha: Vendas por Empreendimento | Evolução do Ticket Médio */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Vendas por Empreendimento */}
        <div className="rounded-lg border bg-card p-4 sm:p-6">
          <h2 className="mb-4 text-base font-semibold sm:text-lg">
            Vendas por Empreendimento
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

        {/* Evolução do Ticket Médio */}
        <div className="rounded-lg border bg-card p-4 sm:p-6">
          <h2 className="mb-4 text-base font-semibold sm:text-lg">
            Evolução do Ticket Médio (k)
          </h2>
          {isLoadingTicket && (
            <div className="flex h-80 items-center justify-center">
              <Loading />
            </div>
          )}
          {!isLoadingTicket && evolucaoTicket && evolucaoTicket.length > 0 && (
            <div className="h-80">
              <TicketMedioChart data={evolucaoTicket} />
            </div>
          )}
          {!isLoadingTicket && (!evolucaoTicket || evolucaoTicket.length === 0) && (
            <div className="flex h-80 items-center justify-center">
              <p className="text-sm text-muted-foreground">Nenhum dado disponível</p>
            </div>
          )}
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
