import { Calendar, Maximize, Minimize, RotateCcw, X } from 'lucide-react';
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
  useConversaoPorGrupo,
  useDashboardKPIs,
  useGraficoVendasMes,
  useTopGrupos,
} from '@/features/dashboard/hooks/useDashboard';
import { GrupoSelect } from '@/shared/components/common/GrupoSelect';
import { Loading } from '@/shared/components/common';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { formatCurrency } from '@/shared/utils/format';

type PeriodoType = 'mensal' | 'ytd' | 'ultimos_12_meses' | 'personalizado';

export const DashboardFull = () => {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = hoje.getMonth();

  // Função para obter filtros salvos do localStorage
  const getSavedFilters = (): {
    filters: IFilters;
    periodo: PeriodoType;
    dataInicio: string;
    dataFim: string;
    selectedGrupo: number | null;
  } => {
    try {
      const saved = localStorage.getItem('dashboardFullFilters');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          filters: parsed.filters || {},
          periodo: parsed.periodo || 'mensal',
          dataInicio: parsed.dataInicio || new Date(ano, mes, 1).toISOString().split('T')[0],
          dataFim: parsed.dataFim || hoje.toISOString().split('T')[0],
          selectedGrupo: parsed.selectedGrupo || null,
        };
      }
    } catch (error) {
      console.error('Erro ao recuperar filtros salvos:', error);
    }

    // Valores padrão se não houver salvos
    return {
      filters: {
        data_inicio: new Date(ano, mes, 1).toISOString().split('T')[0],
        data_fim: hoje.toISOString().split('T')[0],
        periodo: 'mensal',
      },
      periodo: 'mensal',
      dataInicio: new Date(ano, mes, 1).toISOString().split('T')[0],
      dataFim: hoje.toISOString().split('T')[0],
      selectedGrupo: null,
    };
  };

  const savedData = getSavedFilters();

  // Inicializar com filtros salvos ou período mensal
  const [filters, setFilters] = useState<IFilters>(savedData.filters);
  const [periodo, setPeriodo] = useState<PeriodoType>(savedData.periodo);
  const [dataInicio, setDataInicio] = useState(savedData.dataInicio);
  const [dataFim, setDataFim] = useState(savedData.dataFim);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [selectedGrupo, setSelectedGrupo] = useState<number | null>(savedData.selectedGrupo);
  const [showPeriodFilter, setShowPeriodFilter] = useState(false);

  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;

  // Hooks de dados
  const { data: kpis, isLoading } = useDashboardKPIs(filters);

  // Funções de manipulação de período
  const calculateDates = (tipo: PeriodoType): { data_inicio?: string; data_fim?: string } => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    switch (tipo) {
      case 'mensal': {
        return {
          data_inicio: new Date(year, month, 1).toISOString().split('T')[0],
          data_fim: today.toISOString().split('T')[0],
        };
      }
      case 'ytd': {
        return {
          data_inicio: `${year}-01-01`,
          data_fim: today.toISOString().split('T')[0],
        };
      }
      case 'ultimos_12_meses': {
        const oneYearAgo = new Date(year - 1, month, today.getDate());
        return {
          data_inicio: oneYearAgo.toISOString().split('T')[0],
          data_fim: today.toISOString().split('T')[0],
        };
      }
      case 'personalizado': {
        return {
          data_inicio: dataInicio || undefined,
          data_fim: dataFim || undefined,
        };
      }
      default:
        return {};
    }
  };

  const handlePeriodoChange = (novoPeriodo: PeriodoType) => {
    setPeriodo(novoPeriodo);
    if (novoPeriodo !== 'personalizado') {
      const dates = calculateDates(novoPeriodo);
      const newDataInicio = dates.data_inicio || '';
      const newDataFim = dates.data_fim || '';
      setDataInicio(newDataInicio);
      setDataFim(newDataFim);
      setFilters({
        ...filters,
        ...dates,
        periodo: novoPeriodo,
      });
    }
  };

  const handleApplyCustomDates = () => {
    if (dataInicio && dataFim) {
      setPeriodo('personalizado');
      setFilters({
        ...filters,
        data_inicio: dataInicio,
        data_fim: dataFim,
        periodo: 'personalizado',
      });
      setShowPeriodFilter(false);
    }
  };

  const handleClearFilters = () => {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth();
    const newDataInicio = new Date(ano, mes, 1).toISOString().split('T')[0];
    const newDataFim = hoje.toISOString().split('T')[0];

    setPeriodo('mensal');
    setDataInicio(newDataInicio);
    setDataFim(newDataFim);
    setSelectedGrupo(null);
    setFilters({
      data_inicio: newDataInicio,
      data_fim: newDataFim,
      periodo: 'mensal',
    });
  };

  const handleGrupoChange = (grupoId: number | null) => {
    setSelectedGrupo(grupoId);
    setFilters((prev) => ({
      ...prev,
      grupo_id: grupoId ?? undefined,
    }));
  };

  const { data: graficoData } = useGraficoVendasMes(currentYear, undefined, filters.grupo_id);

  // Buscar dados de grupos
  const { data: topGrupos } = useTopGrupos({
    data_inicio: filters.data_inicio,
    data_fim: filters.data_fim,
    limit: 5,
  });

  const { data: conversaoPorGrupo } = useConversaoPorGrupo({
    data_inicio: filters.data_inicio,
    data_fim: filters.data_fim,
    limit: 5,
  });

  const { data: comparativoAnos } = useComparativoAnos(
    currentYear,
    previousYear,
    undefined,
    filters.grupo_id
  );

  // Salva filtros no localStorage sempre que mudarem
  useEffect(() => {
    const filtersToSave = {
      filters,
      periodo,
      dataInicio,
      dataFim,
      selectedGrupo,
    };
    localStorage.setItem('dashboardFullFilters', JSON.stringify(filtersToSave));
  }, [filters, periodo, dataInicio, dataFim, selectedGrupo]);

  // Abre automaticamente o painel de datas se o período for personalizado
  useEffect(() => {
    if (periodo === 'personalizado') {
      setShowPeriodFilter(true);
    }
  }, [periodo]);

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
      return undefined;
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

  return (
    <div
      className={`bg-gray-50 ${isFullscreen ? 'h-screen overflow-hidden p-0' : 'min-h-screen overflow-y-auto p-2 sm:p-4'}`}
    >
      {/* Botão Fullscreen Flutuante */}
      <button
        type="button"
        onClick={toggleFullscreen}
        className={`fixed right-4 top-20 z-50 flex items-center gap-2 rounded-lg bg-lcp-blue px-3 py-2 text-xs text-white shadow-lg transition-all hover:bg-lcp-blue/90 sm:px-4 sm:text-sm ${
          isFullscreen && !showControls
            ? 'translate-y-[-200%] opacity-0'
            : 'translate-y-0 opacity-100'
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
        <div className="mb-3 flex flex-col gap-3 sm:mb-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-lg font-bold text-lcp-blue sm:text-xl">
              Dashboard LCP
            </h1>

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

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            {/* Filtro de Grupo */}
            <div className="min-w-[280px]">
              <GrupoSelect
                value={selectedGrupo}
                onChange={handleGrupoChange}
                placeholder="Todos os grupos"
                showAllOption
              />
            </div>

            {/* Botões de Período */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant={periodo === 'mensal' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handlePeriodoChange('mensal')}
                className="text-xs"
              >
                Mês Atual
              </Button>
              <Button
                variant={periodo === 'ytd' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handlePeriodoChange('ytd')}
                className="text-xs"
              >
                YTD
              </Button>
              <Button
                variant={periodo === 'ultimos_12_meses' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handlePeriodoChange('ultimos_12_meses')}
                className="text-xs"
              >
                12 Meses
              </Button>
              <Button
                variant={periodo === 'personalizado' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowPeriodFilter(!showPeriodFilter)}
                className="text-xs"
              >
                <Calendar className="mr-1 h-3 w-3" />
                Personalizado
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                className="text-xs"
                title="Limpar todos os filtros"
              >
                <RotateCcw className="mr-1 h-3 w-3" />
                Limpar
              </Button>
            </div>
          </div>

          {/* Filtro de Período Personalizado */}
          {showPeriodFilter && (
            <div className="rounded-lg border bg-white p-3 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <Label className="text-sm font-semibold">Período Personalizado</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPeriodFilter(false)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <Label htmlFor="dataInicio" className="mb-1 block text-xs">
                    Data Início
                  </Label>
                  <input
                    id="dataInicio"
                    type="date"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                    onClick={(e) => {
                      const input = e.target as HTMLInputElement;
                      input.showPicker?.();
                    }}
                    className="w-full cursor-pointer rounded-md border border-gray-300 bg-white px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-lcp-blue"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="dataFim" className="mb-1 block text-xs">
                    Data Fim
                  </Label>
                  <input
                    id="dataFim"
                    type="date"
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                    onClick={(e) => {
                      const input = e.target as HTMLInputElement;
                      input.showPicker?.();
                    }}
                    className="w-full cursor-pointer rounded-md border border-gray-300 bg-white px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-lcp-blue"
                  />
                </div>
                <Button size="sm" onClick={handleApplyCustomDates} className="text-xs">
                  Aplicar
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* LAYOUT GRID 3x3 para TV */}
      <div
        className={`grid gap-2 ${isFullscreen ? 'h-[calc(100vh-2rem)] p-3' : 'min-h-[500px] p-0'} lg:gap-3`}
        style={{
          gridTemplateRows: isFullscreen ? '1fr 1fr 1fr' : 'auto auto auto',
          gridTemplateColumns: '1fr 1fr 1fr',
        }}
      >
        {/* ============== LINHA 1 ============== */}

        {/* [1,1] - Funil de Vendas */}
        <div
          className={`flex flex-col overflow-hidden rounded-lg bg-white shadow-md ${isFullscreen ? 'p-4' : 'p-2 min-h-[200px]'} lg:p-4`}
        >
          <h2
            className={`mb-2 font-bold text-lcp-blue ${isFullscreen ? 'text-sm mb-3' : 'text-xs'} lg:text-sm lg:mb-3`}
          >
            Funil de Vendas
          </h2>
          <div className="flex-1 overflow-hidden">
            <KPIFunnelChart
              totalReservas={kpis.total_reservas || 0}
              valorReservas={kpis.valor_reservas || 0}
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
        <div
          className={`overflow-auto rounded-lg bg-white shadow-md ${isFullscreen ? 'p-4' : 'p-2 min-h-[200px]'} lg:p-4`}
        >
          <h2
            className={`mb-2 font-bold text-lcp-blue ${isFullscreen ? 'text-sm mb-3' : 'text-xs'} lg:text-sm lg:mb-3`}
          >
            Últimas Vendas
          </h2>
          <div
            className={`overflow-auto ${isFullscreen ? 'h-[calc(100%-2rem)]' : 'max-h-[180px]'}`}
          >
            <UltimasVendasCompactTable
              grupoId={filters.grupo_id}
              dataInicio={filters.data_inicio}
              dataFim={filters.data_fim}
            />
          </div>
        </div>

        {/* [1,3] - Top 5 Grupos */}
        <div
          className={`overflow-auto rounded-lg bg-white shadow-md ${isFullscreen ? 'p-4' : 'p-2 min-h-[300px]'} lg:p-4`}
        >
          <h2
            className={`mb-2 font-bold text-lcp-blue ${isFullscreen ? 'text-sm mb-3' : 'text-xs'} lg:text-sm lg:mb-3`}
          >
            Top 5 Grupos
          </h2>
          {topGrupos && topGrupos.length > 0 ? (
            <div className={isFullscreen ? 'h-[calc(100%-2rem)]' : 'h-[280px]'}>
              <VendasPorEmpreendimentoChart
                data={topGrupos.map((g) => ({
                  empreendimento_id: g.grupo_id,
                  empreendimento_nome: g.grupo_nome,
                  grupo_id: null,
                  grupo_nome: null,
                  total_propostas: 0,
                  total_vendas: g.total_vendas,
                  valor_propostas: 0,
                  valor_vendas: g.valor_vendas,
                }))}
              />
            </div>
          ) : (
            <div
              className={`flex items-center justify-center ${isFullscreen ? 'h-[calc(100%-2rem)]' : 'h-[280px]'}`}
            >
              <p className="text-xs text-gray-500">Nenhum dado disponível</p>
            </div>
          )}
        </div>

        {/* ============== LINHA 2 ============== */}

        {/* [2,1] - Vendas por Grupo + Taxa de Conversão */}
        <div
          className={`overflow-auto rounded-lg bg-white shadow-md ${isFullscreen ? 'p-4' : 'p-2 min-h-[200px]'} lg:p-4`}
        >
          <h2
            className={`mb-2 font-bold text-lcp-blue ${isFullscreen ? 'text-sm mb-3' : 'text-xs'} lg:text-sm lg:mb-3`}
          >
            Vendas por Grupo
          </h2>
          {conversaoPorGrupo && conversaoPorGrupo.length > 0 ? (
            <div className={`overflow-auto ${isFullscreen ? 'h-[calc(100%-2rem)]' : 'h-[180px]'}`}>
              <VendasConversaoBarChart
                data={conversaoPorGrupo.map((g) => ({
                  empreendimento_id: g.grupo_id,
                  empreendimento_nome: g.grupo_nome,
                  grupo_id: null,
                  grupo_nome: null,
                  total_propostas: g.total_propostas,
                  total_vendas: g.total_vendas,
                  taxa_conversao: g.taxa_conversao,
                  valor_propostas: g.valor_propostas,
                  valor_vendas: g.valor_vendas,
                }))}
              />
            </div>
          ) : (
            <div
              className={`flex items-center justify-center ${isFullscreen ? 'h-[calc(100%-2rem)]' : 'h-[180px]'}`}
            >
              <p className="text-xs text-gray-500">Nenhum dado disponível</p>
            </div>
          )}
        </div>

        {/* [2,2] - ⭐ MÉTRICAS ADICIONAIS (DESTAQUE CENTRAL) */}
        <div
          className={`flex flex-col overflow-hidden rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xl ring-2 ring-lcp-blue ring-opacity-30 ${isFullscreen ? 'p-4' : 'p-2 min-h-[200px]'} lg:p-4`}
        >
          <h2
            className={`text-center font-bold text-lcp-blue ${isFullscreen ? 'text-base mb-3' : 'text-xs mb-2'} lg:text-base lg:mb-3`}
          >
            Métricas Adicionais
          </h2>
          <div
            className={`flex flex-col items-center justify-center ${isFullscreen ? 'h-[calc(100%-2rem)] gap-4' : 'gap-2'} lg:gap-4`}
          >
            {/* Card Venda do Mês */}
            <div
              className={`w-full rounded-lg border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100 text-center shadow-sm ${isFullscreen ? 'p-4' : 'p-2'} lg:p-4`}
            >
              <p
                className={`font-medium uppercase text-green-700 ${isFullscreen ? 'text-xs' : 'text-[10px]'} lg:text-xs`}
              >
                Vendas do Mês
              </p>
              <p
                className={`font-bold text-green-900 ${isFullscreen ? 'text-3xl' : 'text-xl'} lg:text-3xl`}
              >
                {formatCurrency(kpis.valor_vendas_mensal)}
              </p>
              <p
                className={`text-green-600 ${isFullscreen ? 'text-sm' : 'text-[10px]'} lg:text-sm`}
              >
                Previsto: {formatCurrency(kpis.meta_vendas_mensal)}
              </p>
            </div>

            {/* Card Venda do Ano */}
            <div
              className={`w-full rounded-lg border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 text-center shadow-sm ${isFullscreen ? 'p-4' : 'p-2'} lg:p-4`}
            >
              <p
                className={`font-medium uppercase text-blue-700 ${isFullscreen ? 'text-xs' : 'text-[10px]'} lg:text-xs`}
              >
                Vendas do Ano
              </p>
              <p
                className={`font-bold text-blue-900 ${isFullscreen ? 'text-3xl' : 'text-xl'} lg:text-3xl`}
              >
                {formatCurrency(kpis.valor_vendas_ytd)}
              </p>
              <p className={`text-blue-600 ${isFullscreen ? 'text-sm' : 'text-[10px]'} lg:text-sm`}>
                Previsto: {formatCurrency(kpis.meta_vendas_ytd)}
              </p>
            </div>
          </div>
        </div>

        {/* [2,3] - Atendimento de Metas */}
        <div
          className={`flex flex-col overflow-hidden rounded-lg bg-white shadow-md ${isFullscreen ? 'p-4' : 'p-3 min-h-[320px]'} lg:p-4`}
        >
          <h2
            className={`text-center font-bold text-lcp-blue ${isFullscreen ? 'text-sm mb-2' : 'text-xs mb-1'} lg:text-sm lg:mb-2`}
          >
            🎯 Atendimento de Metas
          </h2>

          {/* Velocímetros lado a lado */}
          <div
            className={`flex flex-1 items-center justify-center overflow-hidden ${isFullscreen ? 'gap-4' : 'gap-2'} lg:gap-4`}
          >
            {/* Meta Mensal */}
            <div className="flex h-full flex-1">
              <MetaGaugeChart
                percentual={kpis.percentual_meta_mensal}
                title="Meta Mensal"
                subtitle={formatCurrency(kpis.meta_vendas_mensal)}
                isFullscreen={isFullscreen}
              />
            </div>

            {/* Meta YTD */}
            <div className="flex h-full flex-1">
              <MetaGaugeChart
                percentual={kpis.percentual_meta_ytd}
                title="Meta YTD"
                subtitle={formatCurrency(kpis.meta_vendas_ytd)}
                isFullscreen={isFullscreen}
              />
            </div>
          </div>
        </div>

        {/* ============== LINHA 3 (Largura Completa) ============== */}

        {/* [3,1-3] - Gráfico de Evolução (ocupa todas as 3 colunas) */}
        <div
          className={`overflow-auto rounded-lg bg-white shadow-md ${isFullscreen ? 'p-4' : 'p-2 min-h-[250px]'} lg:p-4`}
          style={{ gridColumn: '1 / 4' }}
        >
          <h2
            className={`mb-2 font-bold text-lcp-blue ${isFullscreen ? 'text-sm mb-3' : 'text-xs'} lg:text-sm lg:mb-3`}
          >
            📈 Evolução de Vendas - Meta vs Realizado ({previousYear} vs {currentYear})
          </h2>
          {graficoData &&
          graficoData.length > 0 &&
          comparativoAnos &&
          comparativoAnos.length > 0 ? (
            <div className={isFullscreen ? 'h-[calc(100%-2rem)]' : 'h-[220px]'}>
              <UnifiedSalesChart vendasMesData={graficoData} comparativoData={comparativoAnos} />
            </div>
          ) : (
            <div
              className={`flex items-center justify-center ${isFullscreen ? 'h-[calc(100%-2rem)]' : 'h-[220px]'}`}
            >
              <p className="text-xs text-gray-500">Nenhum dado disponível</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
