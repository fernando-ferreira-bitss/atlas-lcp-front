import { useEffect, useState } from 'react';

import type { DashboardFilters as IFilters } from '@/shared/types';

import { GrupoSelect } from '@/shared/components/common/GrupoSelect';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';

interface DashboardFiltersProps {
  onFilterChange: (filters: IFilters) => void;
}

type PeriodoType = 'mensal' | 'ytd' | 'ultimos_12_meses' | 'personalizado';

const STORAGE_KEY = 'dashboard-filters';

export const DashboardFilters = ({ onFilterChange }: DashboardFiltersProps) => {
  // Recupera filtros salvos do localStorage
  const getSavedFilters = (): {
    periodo: PeriodoType;
    dataInicio: string;
    dataFim: string;
    grupoId: number | null;
  } => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Erro ao recuperar filtros salvos:', error);
    }
    return {
      periodo: 'mensal',
      dataInicio: '',
      dataFim: '',
      grupoId: null,
    };
  };

  const savedFilters = getSavedFilters();
  const [periodo, setPeriodo] = useState<PeriodoType>(savedFilters.periodo);
  const [dataInicio, setDataInicio] = useState(savedFilters.dataInicio);
  const [dataFim, setDataFim] = useState(savedFilters.dataFim);
  const [grupoId, setGrupoId] = useState<number | null>(savedFilters.grupoId);

  const calculateDates = (tipo: PeriodoType): { data_inicio?: string; data_fim?: string } => {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth();

    switch (tipo) {
      case 'mensal': {
        // Primeiro dia do mês atual até hoje
        return {
          data_inicio: new Date(ano, mes, 1).toISOString().split('T')[0],
          data_fim: hoje.toISOString().split('T')[0],
        };
      }
      case 'ytd': {
        // Primeiro dia do ano até hoje
        return {
          data_inicio: `${ano}-01-01`,
          data_fim: hoje.toISOString().split('T')[0],
        };
      }
      case 'ultimos_12_meses': {
        // 12 meses atrás até hoje
        const umAnoAtras = new Date(ano - 1, mes, hoje.getDate());
        return {
          data_inicio: umAnoAtras.toISOString().split('T')[0],
          data_fim: hoje.toISOString().split('T')[0],
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
      setDataInicio(dates.data_inicio || '');
      setDataFim(dates.data_fim || '');
    }
  };

  useEffect(() => {
    // Aplica filtros salvos ou filtro inicial (mensal) ao montar o componente
    const dates = calculateDates(periodo);
    if (!dataInicio || !dataFim) {
      setDataInicio(dates.data_inicio || '');
      setDataFim(dates.data_fim || '');
    }

    // Aplica os filtros salvos automaticamente
    onFilterChange({
      ...dates,
      grupo_id: grupoId ?? undefined,
      periodo,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApplyFilters = () => {
    const dates = calculateDates(periodo);

    // Salva filtros no localStorage
    const filtersToSave = {
      periodo,
      dataInicio,
      dataFim,
      grupoId,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtersToSave));

    onFilterChange({
      ...dates,
      grupo_id: grupoId ?? undefined,
      periodo,
    });
  };

  const handleClearFilters = () => {
    setPeriodo('mensal');
    setDataInicio('');
    setDataFim('');
    setGrupoId(null);

    // Limpa filtros do localStorage
    localStorage.removeItem(STORAGE_KEY);

    const dates = calculateDates('mensal');
    onFilterChange({
      ...dates,
      periodo: 'mensal',
    });
  };

  return (
    <div className="space-y-4 rounded-lg border bg-card p-4">
      {/* Filtro de Período */}
      <div>
        <Label className="mb-2 block">Período</Label>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={periodo === 'mensal' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handlePeriodoChange('mensal')}
          >
            Mensal
          </Button>
          <Button
            variant={periodo === 'ytd' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handlePeriodoChange('ytd')}
          >
            YTD
          </Button>
          <Button
            variant={periodo === 'ultimos_12_meses' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handlePeriodoChange('ultimos_12_meses')}
          >
            Últimos 12 meses
          </Button>
          <Button
            variant={periodo === 'personalizado' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handlePeriodoChange('personalizado')}
          >
            Personalizado
          </Button>
        </div>
      </div>

      {/* Datas e Empreendimento */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="dataInicio" className="mb-2 block">
            Data Início
          </Label>
          <div
            className="relative cursor-pointer"
            role="button"
            tabIndex={0}
            aria-label="Selecionar data de início"
            onClick={() => {
              if (periodo === 'personalizado') {
                const input = document.getElementById('dataInicio') as HTMLInputElement | null;
                input?.showPicker?.();
              }
            }}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ' ') && periodo === 'personalizado') {
                const input = document.getElementById('dataInicio') as HTMLInputElement | null;
                input?.showPicker?.();
              }
            }}
          >
            <input
              id="dataInicio"
              type="date"
              value={dataInicio}
              onChange={(e) => {
                setDataInicio(e.target.value);
                setPeriodo('personalizado');
              }}
              disabled={periodo !== 'personalizado'}
              className="w-full cursor-pointer rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="dataFim" className="mb-2 block">
            Data Fim
          </Label>
          <div
            className="relative cursor-pointer"
            role="button"
            tabIndex={0}
            aria-label="Selecionar data de fim"
            onClick={() => {
              if (periodo === 'personalizado') {
                const input = document.getElementById('dataFim') as HTMLInputElement | null;
                input?.showPicker?.();
              }
            }}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ' ') && periodo === 'personalizado') {
                const input = document.getElementById('dataFim') as HTMLInputElement | null;
                input?.showPicker?.();
              }
            }}
          >
            <input
              id="dataFim"
              type="date"
              value={dataFim}
              onChange={(e) => {
                setDataFim(e.target.value);
                setPeriodo('personalizado');
              }}
              disabled={periodo !== 'personalizado'}
              className="w-full cursor-pointer rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="grupo" className="mb-2 block">
            Grupo
          </Label>
          <GrupoSelect
            value={grupoId}
            onChange={setGrupoId}
            placeholder="Todos os grupos"
            showAllOption
          />
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex gap-2">
        <Button onClick={handleApplyFilters} className="flex-1 sm:flex-none">
          Filtrar
        </Button>
        <Button onClick={handleClearFilters} variant="outline" className="flex-1 sm:flex-none">
          Limpar
        </Button>
      </div>
    </div>
  );
};
