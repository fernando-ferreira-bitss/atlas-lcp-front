import { ChevronDown, ChevronUp, FileSpreadsheet, Filter, Plus, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';

import { MetaFormModal } from '../components/MetaFormModal';
import { MetaImportForm } from '../components/MetaImportForm';
import { MetasTable } from '../components/MetasTable';
import { useMetas } from '../hooks/useMetas';

import type { MetaFilters, MetaWithEmpreendimento } from '../types';

import { useAllEmpreendimentos } from '@/features/empreendimentos/hooks/useEmpreendimentos';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Label } from '@/shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';

export const Metas = () => {
  const currentYear = new Date().getFullYear();

  const [filters, setFilters] = useState<MetaFilters>({
    ano: currentYear,
    empreendimento_id: undefined,
  });

  const [selectedEmp, setSelectedEmp] = useState<string>('all');
  const [empSearch, setEmpSearch] = useState('');
  const [showEmpList, setShowEmpList] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isImportExpanded, setIsImportExpanded] = useState(false);

  const { data: metas, isLoading, refetch } = useMetas(filters);
  const { data: empreendimentos } = useAllEmpreendimentos();

  // Gerar array de anos (últimos 5 + próximos 5)
  const anos = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  // Filtra empreendimentos baseado na busca - sempre mostra todos se não houver busca
  const empreendimentosFiltrados = empSearch
    ? empreendimentos?.filter((emp) => emp.nome.toLowerCase().includes(empSearch.toLowerCase()))
    : empreendimentos;

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('#emp-search-metas') && !target.closest('.emp-dropdown-metas')) {
        setShowEmpList(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Enriquecer metas com nome do empreendimento
  const metasWithEmp: MetaWithEmpreendimento[] =
    metas?.map((meta) => {
      const emp = empreendimentos?.find((e) => e.id === meta.empreendimento_id);
      return {
        ...meta,
        empreendimento_nome: emp?.nome,
      };
    }) || [];

  const handleAnoChange = (value: string) => {
    setFilters((prev) => ({ ...prev, ano: value === 'all' ? undefined : Number(value) }));
  };

  const handleEmpChange = (value: string) => {
    setSelectedEmp(value);

    if (value === 'all') {
      // Todos os empreendimentos (incluindo consolidado)
      setFilters((prev) => ({
        ...prev,
        empreendimento_id: undefined,
        apenas_consolidado: undefined,
      }));
    } else if (value === 'consolidado') {
      // Apenas consolidado (empreendimento_id = null no backend)
      setFilters((prev) => ({
        ...prev,
        empreendimento_id: undefined,
        apenas_consolidado: true,
      }));
    } else {
      // Empreendimento específico
      setFilters((prev) => ({
        ...prev,
        empreendimento_id: Number(value),
        apenas_consolidado: undefined,
      }));
    }
  };

  const handleClearFilters = () => {
    setSelectedEmp('all');
    setEmpSearch('');
    setFilters({
      ano: currentYear,
      empreendimento_id: undefined,
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-lcp-blue">Gerenciar Metas</h1>
          <p className="text-sm text-gray-600">
            Defina e acompanhe metas de vendas por empreendimento e período
          </p>
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
            <FileSpreadsheet className="h-4 w-4" />
            <span>Dica: Você pode importar várias metas de uma vez usando uma planilha</span>
          </div>
        </div>

        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Meta
        </Button>
      </div>

      {/* Importação em Massa */}
      <Card className="border-dashed border-2 border-gray-300 bg-gray-50/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2">
                <FileSpreadsheet className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-base">Importação em Massa</CardTitle>
                <CardDescription className="text-xs">
                  Importe múltiplas metas a partir de uma planilha Excel
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsImportExpanded(!isImportExpanded)}
              className="gap-1"
            >
              {isImportExpanded ? (
                <>
                  Ocultar <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  Expandir <ChevronDown className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardHeader>

        {isImportExpanded && (
          <CardContent className="pt-0">
            <MetaImportForm />
          </CardContent>
        )}
      </Card>

      {/* Filtros e Listagem */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-lcp-blue" />
            Metas Cadastradas
          </CardTitle>
          <CardDescription>Visualize e gerencie todas as metas cadastradas</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Filtros */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="filter-ano">Ano</Label>
              <Select value={filters.ano?.toString() || 'all'} onValueChange={handleAnoChange}>
                <SelectTrigger id="filter-ano">
                  <SelectValue placeholder="Todos os anos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os anos</SelectItem>
                  {anos.map((a) => (
                    <SelectItem key={a} value={String(a)}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filter-emp">Empreendimento</Label>
              <div className="relative">
                <input
                  id="emp-search-metas"
                  type="text"
                  placeholder="Buscar empreendimento..."
                  value={empSearch}
                  onChange={(e) => setEmpSearch(e.target.value)}
                  onFocus={() => {
                    setEmpSearch(''); // Limpa o campo ao focar
                    setShowEmpList(true);
                  }}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                {showEmpList && (
                  <div className="emp-dropdown-metas absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-background shadow-lg">
                    <div
                      role="button"
                      tabIndex={0}
                      className={`cursor-pointer px-3 py-2 text-sm hover:bg-gray-100 ${
                        selectedEmp === 'all' ? 'bg-blue-100' : ''
                      }`}
                      onClick={() => {
                        handleEmpChange('all');
                        setEmpSearch('Todos os empreendimentos');
                        setShowEmpList(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleEmpChange('all');
                          setEmpSearch('Todos os empreendimentos');
                          setShowEmpList(false);
                        }
                      }}
                    >
                      Todos os empreendimentos
                    </div>
                    <div
                      role="button"
                      tabIndex={0}
                      className={`cursor-pointer px-3 py-2 text-sm hover:bg-gray-100 ${
                        selectedEmp === 'consolidado' ? 'bg-blue-100' : ''
                      }`}
                      onClick={() => {
                        handleEmpChange('consolidado');
                        setEmpSearch('Consolidado');
                        setShowEmpList(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleEmpChange('consolidado');
                          setEmpSearch('Consolidado');
                          setShowEmpList(false);
                        }
                      }}
                    >
                      Consolidado
                    </div>
                    {empreendimentosFiltrados?.map((emp) => (
                      <div
                        key={emp.id}
                        role="button"
                        tabIndex={0}
                        className={`cursor-pointer px-3 py-2 text-sm hover:bg-gray-100 ${
                          selectedEmp === String(emp.id) ? 'bg-blue-100' : ''
                        }`}
                        onClick={() => {
                          handleEmpChange(String(emp.id));
                          setEmpSearch(emp.nome);
                          setShowEmpList(false);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleEmpChange(String(emp.id));
                            setEmpSearch(emp.nome);
                            setShowEmpList(false);
                          }
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

            <div className="flex items-end gap-2">
              <Button variant="outline" onClick={handleClearFilters} className="flex-1">
                Limpar
              </Button>
              <Button variant="outline" onClick={() => refetch()}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Tabela */}
          <MetasTable metas={metasWithEmp} isLoading={isLoading} />
        </CardContent>
      </Card>

      {/* Modal de Criação */}
      <MetaFormModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} meta={null} />
    </div>
  );
};
