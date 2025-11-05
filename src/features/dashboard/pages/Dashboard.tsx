import { BarChart3, FileText, Target, TrendingUp } from 'lucide-react';

import { KPICard } from '../components/cards/KPICard';
import { useDashboardKPIs } from '../hooks/useDashboard';


import { formatCurrency, formatPercentage } from '@/shared/utils/format';

export const Dashboard = () => {
  const { data: kpis, isLoading, error } = useDashboardKPIs();

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-sm text-muted-foreground">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-600">Erro ao carregar dados</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Verifique se o backend está rodando
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral dos indicadores de vendas</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Vendas do Mês"
          value={kpis?.vendas_mes_atual.quantidade || 0}
          subtitle={formatCurrency(kpis?.vendas_mes_atual.valor_total || 0)}
          icon={TrendingUp}
          trend={
            (kpis?.vendas_mes_atual.variacao_mes_anterior || 0) > 0 ? 'up' : 'down'
          }
          trendValue={`${formatPercentage(
            kpis?.vendas_mes_atual.variacao_mes_anterior || 0,
            1
          )} vs mês anterior`}
        />

        <KPICard
          title="Propostas Abertas"
          value={kpis?.propostas_abertas.quantidade || 0}
          subtitle={formatCurrency(kpis?.propostas_abertas.valor_total || 0)}
          icon={FileText}
        />

        <KPICard
          title="Taxa de Conversão"
          value={formatPercentage(kpis?.taxa_conversao.percentual || 0, 1)}
          subtitle={`${kpis?.taxa_conversao.propostas_aprovadas || 0} de ${
            kpis?.taxa_conversao.total_propostas || 0
          } propostas`}
          icon={Target}
        />

        <KPICard
          title="Ticket Médio"
          value={formatCurrency(kpis?.ticket_medio.valor || 0)}
          icon={BarChart3}
          trend={
            (kpis?.ticket_medio.variacao_mes_anterior || 0) > 0 ? 'up' : 'down'
          }
          trendValue={`${formatPercentage(
            kpis?.ticket_medio.variacao_mes_anterior || 0,
            1
          )} vs mês anterior`}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Empreendimentos Ativos</h2>
          <p className="text-3xl font-bold">{kpis?.empreendimentos_ativos || 0}</p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Unidades Disponíveis</h2>
          <p className="text-3xl font-bold">{kpis?.unidades_disponiveis || 0}</p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Gráficos em breve...</h2>
        <p className="text-muted-foreground">
          Esta seção conterá gráficos de vendas, evolução e análises
        </p>
      </div>
    </div>
  );
};
