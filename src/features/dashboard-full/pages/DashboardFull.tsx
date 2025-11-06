import { Maximize, Minimize } from 'lucide-react';
import { useEffect, useState } from 'react';

import { FunnelChart } from '../components/charts/FunnelChart';
import { SalesEvolutionChart } from '../components/charts/SalesEvolutionChart';
import { SalesByPropertyFunnelChart } from '../components/charts/SalesByPropertyFunnelChart';
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
import { formatCurrency, formatPercentage } from '@/shared/utils/format';

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
  const { data: comparativoAnos } = useComparativoAnos(
    currentYear,
    previousYear,
    filters.empreendimento_id
  );
  const { data: conversaoPorEmp } = useConversaoPorEmpreendimento({
    data_inicio: filters.data_inicio,
    data_fim: filters.data_fim,
    limit: 5,
  });

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

      {/* Layout Responsivo */}
      <div className={`${isFullscreen ? 'space-y-2 p-2' : 'space-y-3'}`}>
        {/* LINHA 1 - Funil de Vendas */}
        <div className="rounded-lg bg-white p-3 shadow-md sm:p-4">
          <h2 className="mb-2 text-center text-sm font-bold text-lcp-blue sm:text-lg">
            Funil de Vendas - Propostas → Vendas
          </h2>
          <FunnelChart
            totalPropostas={kpis.total_propostas}
            totalVendas={kpis.total_vendas}
            taxaConversao={kpis.taxa_conversao}
            valorPropostas={kpis.valor_total_propostas || 0}
            valorVendas={kpis.valor_total_vendas}
          />
        </div>

        {/* LINHA 2 - Cards de KPIs (8 cards em 2 linhas mobile, 4 colunas desktop) */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
          {/* Propostas */}
          <div className="rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 p-3 text-white shadow-md">
            <p className="text-xs font-medium opacity-90">Propostas</p>
            <p className="mt-1 text-xl font-bold sm:text-2xl">{kpis.total_propostas}</p>
            <p className="mt-1 text-xs opacity-80">{formatCurrency(kpis.valor_total_propostas || 0)}</p>
          </div>

          {/* Vendas */}
          <div className="rounded-lg bg-gradient-to-br from-green-500 to-green-600 p-3 text-white shadow-md">
            <p className="text-xs font-medium opacity-90">Vendas</p>
            <p className="mt-1 text-xl font-bold sm:text-2xl">{kpis.total_vendas}</p>
            <p className="mt-1 text-xs opacity-80">{formatCurrency(kpis.valor_total_vendas)}</p>
          </div>

          {/* Conversão (Qtd) */}
          <div className="rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 p-3 text-white shadow-md">
            <p className="text-xs font-medium opacity-90">Conversão (Qtd)</p>
            <p className="mt-1 text-xl font-bold sm:text-2xl">{formatPercentage(kpis.taxa_conversao, 1)}</p>
            <p className="mt-1 text-xs opacity-80">
              {kpis.total_vendas} de {kpis.total_propostas}
            </p>
          </div>

          {/* Conversão (R$) */}
          <div className="rounded-lg bg-gradient-to-br from-pink-500 to-pink-600 p-3 text-white shadow-md">
            <p className="text-xs font-medium opacity-90">Conversão (R$)</p>
            <p className="mt-1 text-xl font-bold sm:text-2xl">{formatPercentage(kpis.taxa_conversao_valor, 1)}</p>
            <p className="mt-1 text-xs opacity-80">Financeira</p>
          </div>

          {/* Ticket Médio Proposta */}
          <div className="rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 p-3 text-white shadow-md">
            <p className="text-xs font-medium opacity-90">Ticket Médio (Prop.)</p>
            <p className="mt-1 text-xl font-bold sm:text-2xl">{formatCurrency(kpis.ticket_medio_proposta)}</p>
            <p className="mt-1 text-xs opacity-80">Por proposta</p>
          </div>

          {/* Ticket Médio Venda */}
          <div className="rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 p-3 text-white shadow-md">
            <p className="text-xs font-medium opacity-90">Ticket Médio (Venda)</p>
            <p className="mt-1 text-xl font-bold sm:text-2xl">{formatCurrency(kpis.ticket_medio)}</p>
            <p className="mt-1 text-xs opacity-80">Por venda</p>
          </div>

          {/* Meta Mensal */}
          <div className="rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 p-3 text-white shadow-md">
            <p className="text-xs font-medium opacity-90">Meta Mensal</p>
            <p className="mt-1 text-xl font-bold sm:text-2xl">
              {formatPercentage(kpis.percentual_meta_mensal, 1)}
            </p>
            <p className="mt-1 text-xs opacity-80">{formatCurrency(kpis.meta_vendas_mensal)}</p>
          </div>

          {/* Meta YTD */}
          <div className="rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 p-3 text-white shadow-md">
            <p className="text-xs font-medium opacity-90">Meta YTD</p>
            <p className="mt-1 text-xl font-bold sm:text-2xl">
              {formatPercentage(kpis.percentual_meta_ytd, 1)}
            </p>
            <p className="mt-1 text-xs opacity-80">{formatCurrency(kpis.meta_vendas_ytd)}</p>
          </div>
        </div>

        {/* LINHA 3 - Gráficos */}
        <div className="grid gap-3 lg:grid-cols-3">
          {/* Evolução de Vendas + Metas */}
          <div className="rounded-lg bg-white p-3 shadow-md lg:col-span-2">
            <h2 className="mb-3 text-sm font-bold text-lcp-blue sm:text-lg">
              Evolução de Vendas vs Metas ({currentYear})
            </h2>
            {graficoData && graficoData.length > 0 ? (
              <div className="h-64 sm:h-80">
                <SalesEvolutionChart data={graficoData} />
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center sm:h-80">
                <p className="text-sm text-gray-500">Nenhum dado disponível</p>
              </div>
            )}
          </div>

          {/* Vendas por Empreendimento + Conversão */}
          <div className="rounded-lg bg-white p-3 shadow-md">
            <h2 className="mb-3 text-sm font-bold text-lcp-blue sm:text-lg">
              Vendas por Empreendimento + Conversão
            </h2>
            {conversaoPorEmp && conversaoPorEmp.length > 0 ? (
              <div className="h-64 sm:h-80">
                <SalesByPropertyFunnelChart data={conversaoPorEmp} />
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center sm:h-80">
                <p className="text-sm text-gray-500">Nenhum dado disponível</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
