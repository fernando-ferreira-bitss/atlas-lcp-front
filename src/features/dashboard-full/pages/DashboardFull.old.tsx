import { Maximize, Minimize } from 'lucide-react';
import { useEffect, useState } from 'react';

import { KPIFunnelChart } from '../components/charts/KPIFunnelChart';
import { UnifiedSalesChart } from '../components/charts/UnifiedSalesChart';
import { VendasConversaoBarChart } from '../components/charts/VendasConversaoBarChart';
import { UltimasVendasCompactTable } from '../components/tables/UltimasVendasCompactTable';
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

import type { DashboardFilters as IFilters } from '@/shared/types';

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

  // Auto-refresh a cada 1 hora
  useEffect(() => {
    const interval = setInterval(() => {
      window.location.reload();
    }, 60 * 60 * 1000); // 1 hora

    return () => clearInterval(interval);
  }, []);

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
      // Adiciona classe ao body para ocultar sidebar
      document.body.classList.add('hide-sidebar');
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
      // Remove classe do body
      document.body.classList.remove('hide-sidebar');
    }
  };

  // Listener para detectar saída do fullscreen (ESC)
  useEffect(() => {
    const handleFullscreenChange = () => {
      const inFullscreen = !!document.fullscreenElement;
      setIsFullscreen(inFullscreen);

      // Gerencia classe do body
      if (inFullscreen) {
        document.body.classList.add('hide-sidebar');
      } else {
        document.body.classList.remove('hide-sidebar');
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    // Cleanup ao desmontar
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
      }, 3000); // Oculta após 3 segundos de inatividade
    };

    document.addEventListener('mousemove', handleMouseMove);

    // Inicia o timer para ocultar
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
      {/* Botão Fullscreen Flutuante (auto-hide em fullscreen) */}
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
            {/* Dropdown Empreendimento */}
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

      {/* Layout para TV - TUDO EM UMA TELA */}
      <div className={`space-y-3 ${isFullscreen ? 'h-screen overflow-hidden p-3' : 'p-4'}`}>
        {/* LINHA 1 - Funil de KPIs */}
        <div className="rounded-lg bg-white p-4 shadow-md">
          <KPIFunnelChart
            totalPropostas={kpis.total_propostas}
            valorPropostas={kpis.valor_total_propostas || 0}
            totalVendas={kpis.total_vendas}
            valorVendas={kpis.valor_total_vendas}
            taxaConversao={kpis.taxa_conversao}
            ticketMedio={kpis.ticket_medio}
          />
        </div>

        {/* LINHA 2 - Grid Principal: Gráfico Unificado + Gauges */}
        <div className="grid gap-2 lg:grid-cols-3">
          {/* COLUNA 1 - Gráfico Unificado (Meta vs Realizado + Comparativo Anos) */}
          <div className="rounded-lg bg-white p-3 shadow-md lg:col-span-2">
            <h2 className="mb-2 text-xs font-bold text-lcp-blue">
              Meta vs. Realizado + Evolução ({previousYear} vs {currentYear})
            </h2>
            {graficoData && graficoData.length > 0 && comparativoAnos && comparativoAnos.length > 0 ? (
              <div className="h-56">
                <UnifiedSalesChart vendasMesData={graficoData} comparativoData={comparativoAnos} />
              </div>
            ) : (
              <div className="flex h-56 items-center justify-center">
                <p className="text-xs text-gray-500">Nenhum dado disponível</p>
              </div>
            )}
          </div>

          {/* COLUNA 2 - Gauges de Metas */}
          <div className="rounded-lg bg-white p-3 shadow-md">
            <h2 className="mb-2 text-center text-xs font-bold text-lcp-blue">Atendimento de Metas</h2>

            {/* Meta Mensal */}
            <div className="mb-2">
              <MetaGaugeChart
                percentual={kpis.percentual_meta_mensal}
                title="Meta Mensal"
                subtitle={formatCurrency(kpis.meta_vendas_mensal)}
              />
            </div>

            {/* Meta YTD */}
            <div className="-mt-4">
              <MetaGaugeChart
                percentual={kpis.percentual_meta_ytd}
                title="Meta YTD"
                subtitle={formatCurrency(kpis.meta_vendas_ytd)}
              />
            </div>
          </div>
        </div>

        {/* LINHA 3 - Vendas + Conversão por Empreendimento (Barras Horizontais) */}
        <div className="rounded-lg bg-white p-3 shadow-md">
          <h2 className="mb-2 text-xs font-bold text-lcp-blue">
            Vendas por Empreendimento + Taxa de Conversão
          </h2>
          {conversaoPorEmp && conversaoPorEmp.length > 0 ? (
            <div className="h-48 overflow-auto">
              <VendasConversaoBarChart data={conversaoPorEmp} />
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center">
              <p className="text-xs text-gray-500">Nenhum dado disponível</p>
            </div>
          )}
        </div>

        {/* LINHA 4 - Grid: Top 5 Empreendimentos + Últimas Vendas */}
        <div className="grid gap-2 lg:grid-cols-2">
          {/* Top 5 Empreendimentos (Pizza) */}
          <div className="rounded-lg bg-white p-3 shadow-md">
            <h2 className="mb-2 text-xs font-bold text-lcp-blue">Top 5 Empreendimentos - Vendas</h2>
            {topEmpreendimentos && topEmpreendimentos.length > 0 ? (
              <div className="h-48">
                <VendasPorEmpreendimentoChart data={topEmpreendimentos} />
              </div>
            ) : (
              <div className="flex h-48 items-center justify-center">
                <p className="text-xs text-gray-500">Nenhum dado disponível</p>
              </div>
            )}
          </div>

          {/* Últimas Vendas */}
          <div className="rounded-lg bg-white p-3 shadow-md">
            <h2 className="mb-2 text-xs font-bold text-lcp-blue">Últimas Vendas</h2>
            <div className="h-48 overflow-auto">
              <UltimasVendasCompactTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
