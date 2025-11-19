import { ChevronDown, ChevronUp, FileSpreadsheet, Filter, Plus, RefreshCw } from 'lucide-react';
import { useState } from 'react';

import { MetaFormModal } from '../components/MetaFormModal';
import { MetaImportForm } from '../components/MetaImportForm';
import { MetasTable } from '../components/MetasTable';
import { useMetas } from '../hooks/useMetas';

import type { MetaFilters, MetaWithEmpreendimento } from '../types';

import { GrupoSelect } from '@/shared/components/common/GrupoSelect';
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
    empreendimento_grupo_id: undefined,
  });

  const [selectedGrupo, setSelectedGrupo] = useState<number | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isImportExpanded, setIsImportExpanded] = useState(false);

  const { data: metas, isLoading, refetch } = useMetas(filters);

  // Gerar array de anos (últimos 5 + próximos 5)
  const anos = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  // Metas já vêm com informações do grupo
  const metasWithEmp: MetaWithEmpreendimento[] = metas || [];

  const handleAnoChange = (value: string) => {
    setFilters((prev) => ({ ...prev, ano: value === 'all' ? undefined : Number(value) }));
  };

  const handleGrupoChange = (grupoId: number | null) => {
    setSelectedGrupo(grupoId);
    setFilters((prev) => ({
      ...prev,
      empreendimento_grupo_id: grupoId ?? undefined,
    }));
  };

  const handleClearFilters = () => {
    setSelectedGrupo(null);
    setFilters({
      ano: currentYear,
      empreendimento_grupo_id: undefined,
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
              <Label htmlFor="filter-grupo">Grupo</Label>
              <GrupoSelect
                value={selectedGrupo}
                onChange={handleGrupoChange}
                placeholder="Todos os grupos"
                showAllOption
              />
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
