import { Maximize, Minimize } from 'lucide-react';
import { useEffect, useState } from 'react';

import { KPIFunnelChart } from '../components/charts/KPIFunnelChart';
import { UnifiedSalesChart } from '../components/charts/UnifiedSalesChart';
import { VendasConversaoBarChart } from '../components/charts/VendasConversaoBarChart';
import { UltimasVendasCompactTable } from '../components/tables/UltimasVendasCompactTable';

import type { DashboardFilters as IFilters } from '@/shared/types';

import { MetaGaugeChart } from '@/features/dashboard/components/charts/MetaGaugeChart';
import { VendasPorEmpreendimentoChart } from '@/features/dashboard/components/charts/VendasPorEmpreendimentoChart';
import {
  useComparativoAnos,
  useConversaoPorEmpreendimento,
  useDashboardKPIs,
  useGraficoVendasMes,
  useTopEmpreendimentos,
} from '@/features/dashboard/hooks/useDashboard';
import { useEmpreendimentos } from '@/features/empreendimentos/hooks/useEmpreendimentos';
import { Loading } from '@/shared/components/common';
import { formatCurrency } from '@/shared/utils/format';

export const DashboardFull = () => {
  const [filters, setFilters] = useState<IFilters>({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;

  // Hooks de dados
  const { data: kpis, isLoading } = useDashboardKPIs(filters);
  const { data: empreendimentos } = useEmpreendimentos();
  const { data: graficoData } = useGraficoVendasMes(currentYear, filters.empreendimento_id);
  const { data: topEmpreendimentos } = useTopEmpreendimentos({
    data_inicio: filters.data_inicio,
    data_fim: filters.data_fim,
    limit: 5,
  });
  const { data: conversaoPorEmp } = useConversaoPorEmpreendimento({
    data_inicio: filters.data_inicio,
    data_fim: filters.data_fim,
    limit: 5,
  });
  const { data: comparativoAnos } = useComparativoAnos(
    currentYear,
    previousYear,
    filters.empreendimento_id
  );


  // Atualiza relógio a cada minuto
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60 * 1000); // 1 minuto

    return () => clearInterval(interval);
  }, []);

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
      localStorage.setItem('dashboardFullscreen', 'true');
      document.body.classList.add('hide-sidebar');
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
      localStorage.setItem('dashboardFullscreen', 'false');
      document.body.classList.remove('hide-sidebar');
    }
  };

  // Listener para detectar saída do fullscreen (ESC)
  useEffect(() => {
    const handleFullscreenChange = () => {
      const inFullscreen = !!document.fullscreenElement;
      setIsFullscreen(inFullscreen);

      // Atualizar localStorage quando usuário sair via ESC
      localStorage.setItem('dashboardFullscreen', String(inFullscreen));

      if (inFullscreen) {
        document.body.classList.add('hide-sidebar');
      } else {
        document.body.classList.remove('hide-sidebar');
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.body.classList.remove('hide-sidebar');
    };
  }, []);

  // Auto-hide dos controles em fullscreen
  useEffect(() => {
    if (!isFullscreen) {
      setShowControls(true);
      return;
    }

    let timeout: NodeJS.Timeout;

    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };

    document.addEventListener('mousemove', handleMouseMove);

    timeout = setTimeout(() => {
      setShowControls(false);
    }, 3000);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, [isFullscreen]);

  if (isLoading) {
    return <Loading />;
  }

  if (!kpis) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-xl text-red-600">Erro ao carregar dados</p>
      </div>
    );
  }

  const selectedEmp = empreendimentos?.find((emp) => emp.id === filters.empreendimento_id);

  return (
    <div className={`min-h-screen overflow-auto bg-gray-50 ${isFullscreen ? 'p-0' : 'p-2 sm:p-4'}`}>
      {/* Botão Fullscreen Flutuante */}
      <button
        onClick={toggleFullscreen}
        className={`fixed right-4 top-20 z-50 flex items-center gap-2 rounded-lg bg-lcp-blue px-3 py-2 text-xs text-white shadow-lg transition-all hover:bg-lcp-blue/90 sm:px-4 sm:text-sm ${
          isFullscreen && !showControls ? 'translate-y-[-200%] opacity-0' : 'translate-y-0 opacity-100'
        }`}
        title={isFullscreen ? 'Sair do modo tela cheia (ESC)' : 'Ativar tela cheia (F11)'}
      >
        {isFullscreen ? (
          <>
            <Minimize className="h-4 w-4" />
            <span className="hidden sm:inline">Sair</span>
          </>
        ) : (
          <>
            <Maximize className="h-4 w-4" />
            <span className="hidden sm:inline">Tela Cheia</span>
          </>
        )}
      </button>

      {/* Header - oculta em fullscreen */}
      {!isFullscreen && (
        <div className="mb-3 flex flex-col gap-3 sm:mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <select
              value={filters.empreendimento_id || ''}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  empreendimento_id: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-lcp-blue sm:px-4 sm:text-sm"
            >
              <option value="">Geral - Todos os Empreendimentos</option>
              {empreendimentos?.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.nome}
                </option>
              ))}
            </select>

            <h1 className="text-lg font-bold text-lcp-blue sm:text-xl">
              Dashboard LCP {selectedEmp ? `- ${selectedEmp.nome}` : ''}
            </h1>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-xs text-gray-600 sm:text-sm">
              {currentTime.toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <p className="text-base font-semibold text-lcp-blue sm:text-lg">
              {currentTime.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
      )}

      {/* LAYOUT GRID 3x3 para TV */}
      <div
        className={`grid h-[calc(100vh-2rem)] gap-3 ${isFullscreen ? 'p-3' : 'p-0'}`}
        style={{
          gridTemplateRows: '1fr 1fr 1fr',
          gridTemplateColumns: '1fr 1fr 1fr',
        }}
      >
        {/* ============== LINHA 1 ============== */}

        {/* [1,1] - Funil de Vendas */}
        <div className="flex flex-col overflow-hidden rounded-lg bg-white p-4 shadow-md">
          <h2 className="mb-3 text-sm font-bold text-lcp-blue">Funil de Vendas</h2>
          <div className="flex-1 overflow-hidden">
            <KPIFunnelChart
              totalReservas={0} // TODO: Adicionar dados de reservas do backend
              valorReservas={0}
              totalPropostas={kpis.total_propostas}
              valorPropostas={kpis.valor_total_propostas || 0}
              totalVendas={kpis.total_vendas}
              valorVendas={kpis.valor_total_vendas}
              taxaConversao={kpis.taxa_conversao}
              ticketMedio={kpis.ticket_medio}
            />
          </div>
        </div>

        {/* [1,2] - Últimas Vendas */}
        <div className="overflow-auto rounded-lg bg-white p-4 shadow-md">
          <h2 className="mb-3 text-sm font-bold text-lcp-blue">Últimas Vendas</h2>
          <div className="h-[calc(100%-2rem)] overflow-auto">
            <UltimasVendasCompactTable />
          </div>
        </div>

        {/* [1,3] - Top 5 Empreendimentos */}
        <div className="overflow-auto rounded-lg bg-white p-4 shadow-md">
          <h2 className="mb-3 text-sm font-bold text-lcp-blue">Top 5 Empreendimentos</h2>
          {topEmpreendimentos && topEmpreendimentos.length > 0 ? (
            <div className="h-[calc(100%-2rem)]">
              <VendasPorEmpreendimentoChart data={topEmpreendimentos} />
            </div>
          ) : (
            <div className="flex h-[calc(100%-2rem)] items-center justify-center">
              <p className="text-xs text-gray-500">Nenhum dado disponível</p>
            </div>
          )}
        </div>

        {/* ============== LINHA 2 ============== */}

        {/* [2,1] - Vendas por Empreendimento + Taxa de Conversão */}
        <div className="overflow-auto rounded-lg bg-white p-4 shadow-md">
          <h2 className="mb-3 text-sm font-bold text-lcp-blue">Vendas por Empreendimento</h2>
          {conversaoPorEmp && conversaoPorEmp.length > 0 ? (
            <div className="h-[calc(100%-2rem)] overflow-auto">
              <VendasConversaoBarChart data={conversaoPorEmp} />
            </div>
          ) : (
            <div className="flex h-[calc(100%-2rem)] items-center justify-center">
              <p className="text-xs text-gray-500">Nenhum dado disponível</p>
            </div>
          )}
        </div>

        {/* [2,2] - ⭐ MÉTRICAS ADICIONAIS (DESTAQUE CENTRAL) */}
        <div className="flex flex-col overflow-hidden rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 p-4 shadow-xl ring-2 ring-lcp-blue ring-opacity-30">
          <h2 className="mb-3 text-center text-base font-bold text-lcp-blue">Métricas Adicionais</h2>
          <div className="flex h-[calc(100%-2rem)] flex-col items-center justify-center gap-4">
            {/* Card Venda do Mês */}
            <div className="w-full rounded-lg border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100 p-4 text-center shadow-sm">
              <p className="text-xs font-medium uppercase text-green-700">Venda do Mês</p>
              <p className="text-3xl font-bold text-green-900">
                {formatCurrency(kpis.valor_vendas_mensal)}
              </p>
              <p className="text-sm text-green-600">
                Previsto: {formatCurrency(kpis.meta_vendas_mensal)}
              </p>
            </div>

            {/* Card Venda do Ano */}
            <div className="w-full rounded-lg border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-4 text-center shadow-sm">
              <p className="text-xs font-medium uppercase text-blue-700">Venda do Ano</p>
              <p className="text-3xl font-bold text-blue-900">
                {formatCurrency(kpis.valor_vendas_ytd)}
              </p>
              <p className="text-sm text-blue-600">
                Previsto: {formatCurrency(kpis.meta_vendas_ytd)}
              </p>
            </div>
          </div>
        </div>

        {/* [2,3] - Atendimento de Metas */}
        <div className="overflow-auto rounded-lg bg-white p-4 shadow-md">
          <h2 className="mb-4 text-center text-sm font-bold text-lcp-blue">
            🎯 Atendimento de Metas
          </h2>

          {/* Velocímetros lado a lado */}
          <div className="flex flex-1 items-center justify-center gap-4">
            {/* Meta Mensal */}
            <div className="flex-1">
              <MetaGaugeChart
                percentual={kpis.percentual_meta_mensal}
                title="Meta Mensal"
                subtitle={formatCurrency(kpis.meta_vendas_mensal)}
              />
            </div>

            {/* Meta YTD */}
            <div className="flex-1">
              <MetaGaugeChart
                percentual={kpis.percentual_meta_ytd}
                title="Meta YTD"
                subtitle={formatCurrency(kpis.meta_vendas_ytd)}
              />
            </div>
          </div>
        </div>

        {/* ============== LINHA 3 (Largura Completa) ============== */}

        {/* [3,1-3] - Gráfico de Evolução (ocupa todas as 3 colunas) */}
        <div
          className="overflow-auto rounded-lg bg-white p-4 shadow-md"
          style={{ gridColumn: '1 / 4' }}
        >
          <h2 className="mb-3 text-sm font-bold text-lcp-blue">
            📈 Evolução de Vendas - Meta vs Realizado ({previousYear} vs {currentYear})
          </h2>
          {graficoData && graficoData.length > 0 && comparativoAnos && comparativoAnos.length > 0 ? (
            <div className="h-[calc(100%-2rem)]">
              <UnifiedSalesChart vendasMesData={graficoData} comparativoData={comparativoAnos} />
            </div>
          ) : (
            <div className="flex h-[calc(100%-2rem)] items-center justify-center">
              <p className="text-xs text-gray-500">Nenhum dado disponível</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
