import { useEffect, useState } from 'react';

import { useEmpreendimentos } from '@/features/empreendimentos/hooks/useEmpreendimentos';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import type { DashboardFilters as IFilters } from '@/shared/types';

interface DashboardFiltersProps {
  onFilterChange: (filters: IFilters) => void;
}

type PeriodoType = 'mensal' | 'ytd' | 'ultimos_12_meses' | 'personalizado';

export const DashboardFilters = ({ onFilterChange }: DashboardFiltersProps) => {
  const [periodo, setPeriodo] = useState<PeriodoType>('mensal');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [empreendimentoId, setEmpreendimentoId] = useState<number | undefined>();
  const [empSearch, setEmpSearch] = useState('');
  const [showEmpList, setShowEmpList] = useState(false);

  const { data: empreendimentos } = useEmpreendimentos();

  // Filtra empreendimentos baseado na busca
  const empreendimentosFiltrados = empreendimentos?.filter((emp) =>
    emp.nome.toLowerCase().includes(empSearch.toLowerCase())
  );

  const calculateDates = (tipo: PeriodoType): { data_inicio?: string; data_fim?: string } => {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth();

    switch (tipo) {
      case 'mensal':
        // Primeiro dia do mês atual até hoje
        return {
          data_inicio: new Date(ano, mes, 1).toISOString().split('T')[0],
          data_fim: hoje.toISOString().split('T')[0],
        };
      case 'ytd':
        // Primeiro dia do ano até hoje
        return {
          data_inicio: `${ano}-01-01`,
          data_fim: hoje.toISOString().split('T')[0],
        };
      case 'ultimos_12_meses':
        // 12 meses atrás até hoje
        const umAnoAtras = new Date(ano - 1, mes, hoje.getDate());
        return {
          data_inicio: umAnoAtras.toISOString().split('T')[0],
          data_fim: hoje.toISOString().split('T')[0],
        };
      case 'personalizado':
        return {
          data_inicio: dataInicio || undefined,
          data_fim: dataFim || undefined,
        };
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
    // Aplica filtro inicial (mensal) ao montar o componente
    const dates = calculateDates('mensal');
    setDataInicio(dates.data_inicio || '');
    setDataFim(dates.data_fim || '');
  }, []);

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('#empreendimento-search') && !target.closest('.absolute')) {
        setShowEmpList(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleApplyFilters = () => {
    const dates = calculateDates(periodo);
    onFilterChange({
      ...dates,
      empreendimento_id: empreendimentoId,
      periodo,
    });
  };

  const handleClearFilters = () => {
    setPeriodo('mensal');
    setDataInicio('');
    setDataFim('');
    setEmpreendimentoId(undefined);
    setEmpSearch('');
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
          <input
            id="dataInicio"
            type="date"
            value={dataInicio}
            onChange={(e) => {
              setDataInicio(e.target.value);
              setPeriodo('personalizado');
            }}
            disabled={periodo !== 'personalizado'}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div>
          <Label htmlFor="dataFim" className="mb-2 block">
            Data Fim
          </Label>
          <input
            id="dataFim"
            type="date"
            value={dataFim}
            onChange={(e) => {
              setDataFim(e.target.value);
              setPeriodo('personalizado');
            }}
            disabled={periodo !== 'personalizado'}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div>
          <Label htmlFor="empreendimento" className="mb-2 block">
            Empreendimento
          </Label>
          <div className="relative">
            <input
              id="empreendimento-search"
              type="text"
              placeholder="Buscar empreendimento..."
              value={empSearch}
              onChange={(e) => setEmpSearch(e.target.value)}
              onFocus={() => setShowEmpList(true)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            {showEmpList && (
              <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-background shadow-lg">
                <div
                  className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-100"
                  onClick={() => {
                    setEmpreendimentoId(undefined);
                    setEmpSearch('');
                    setShowEmpList(false);
                  }}
                >
                  Todos
                </div>
                {empreendimentosFiltrados?.map((emp) => (
                  <div
                    key={emp.id}
                    className={`cursor-pointer px-3 py-2 text-sm hover:bg-gray-100 ${
                      empreendimentoId === emp.id ? 'bg-blue-100' : ''
                    }`}
                    onClick={() => {
                      setEmpreendimentoId(emp.id);
                      setEmpSearch(emp.nome);
                      setShowEmpList(false);
                    }}
                  >
                    {emp.nome}
                  </div>
                ))}
                {empreendimentosFiltrados?.length === 0 && (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    Nenhum empreendimento encontrado
                  </div>
                )}
              </div>
            )}
          </div>
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
