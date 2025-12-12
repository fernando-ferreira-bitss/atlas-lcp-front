import { ChevronDown, ChevronRight, Loader2, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { useUnidadesByGrupo, useUpdateUnidadesPropriedade } from '../hooks/useUnidades';

import type { EmpreendimentoGrupoWithMembros, Unidade } from '@/shared/types';

import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';

interface UnidadesModalProps {
  isOpen: boolean;
  onClose: () => void;
  grupo: EmpreendimentoGrupoWithMembros | null;
}

interface BlocoGroup {
  bloco_nome: string;
  bloco_codigo: number | null;
  unidades: Unidade[];
}

interface EmpreendimentoGroup {
  empreendimento_id: number;
  empreendimento_nome: string;
  blocos: BlocoGroup[];
}

export const UnidadesModal = ({ isOpen, onClose, grupo }: UnidadesModalProps) => {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedEmps, setExpandedEmps] = useState<Set<number>>(new Set());
  const [expandedBlocos, setExpandedBlocos] = useState<Set<string>>(new Set());

  const { data: unidadesData, isLoading: isLoadingUnidades } = useUnidadesByGrupo(grupo?.id || 0);
  const updatePropriedade = useUpdateUnidadesPropriedade();

  const unidades = useMemo(() => unidadesData?.items || [], [unidadesData?.items]);
  const totalUnidades = unidadesData?.total || 0;
  const isLoading = updatePropriedade.isPending;

  // Inicializar seleção com unidades que já pertencem ao cliente
  useEffect(() => {
    if (unidades.length > 0) {
      const pertence = unidades.filter((u) => u.pertence_cliente).map((u) => u.id);
      setSelectedIds(new Set(pertence));
      // Expandir todos por padrão
      const empIds = new Set(unidades.map((u) => u.empreendimento_id));
      setExpandedEmps(empIds);
      const blocoKeys = new Set(
        unidades.map((u) => `${u.empreendimento_id}-${u.bloco_codigo || 'sem-bloco'}`)
      );
      setExpandedBlocos(blocoKeys);
    }
  }, [unidades]);

  // Agrupar por empreendimento e bloco
  const agrupados = useMemo(() => {
    const grupos: EmpreendimentoGroup[] = [];
    const empMap = new Map<number, EmpreendimentoGroup>();

    unidades.forEach((unidade) => {
      const empId = unidade.empreendimento_id;
      const empNome = unidade.empreendimento_nome || 'Sem empreendimento';
      const blocoNome = unidade.bloco_nome || 'Sem bloco';
      const blocoCodigo = unidade.bloco_codigo;

      if (!empMap.has(empId)) {
        const emp: EmpreendimentoGroup = {
          empreendimento_id: empId,
          empreendimento_nome: empNome,
          blocos: [],
        };
        empMap.set(empId, emp);
        grupos.push(emp);
      }

      const emp = empMap.get(empId)!;
      let bloco = emp.blocos.find((b) => b.bloco_codigo === blocoCodigo);
      if (!bloco) {
        bloco = { bloco_nome: blocoNome, bloco_codigo: blocoCodigo, unidades: [] };
        emp.blocos.push(bloco);
      }
      bloco.unidades.push(unidade);
    });

    // Ordenar blocos e unidades
    grupos.forEach((emp) => {
      emp.blocos.sort((a, b) => (a.bloco_nome || '').localeCompare(b.bloco_nome || ''));
      emp.blocos.forEach((bloco) => {
        bloco.unidades.sort((a, b) => a.nome.localeCompare(b.nome));
      });
    });

    return grupos.sort((a, b) => a.empreendimento_nome.localeCompare(b.empreendimento_nome));
  }, [unidades]);

  // Filtrar por busca
  const agrupadosFiltrados = useMemo(() => {
    if (!searchTerm.trim()) return agrupados;

    const term = searchTerm.toLowerCase();
    return agrupados
      .map((emp) => ({
        ...emp,
        blocos: emp.blocos
          .map((bloco) => ({
            ...bloco,
            unidades: bloco.unidades.filter(
              (u) =>
                u.nome.toLowerCase().includes(term) ||
                (u.bloco_nome?.toLowerCase() || '').includes(term) ||
                (u.empreendimento_nome?.toLowerCase() || '').includes(term) ||
                (u.tipologia?.toLowerCase() || '').includes(term)
            ),
          }))
          .filter((bloco) => bloco.unidades.length > 0),
      }))
      .filter((emp) => emp.blocos.length > 0);
  }, [agrupados, searchTerm]);

  const handleToggleUnidade = (unidadeId: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(unidadeId)) {
        next.delete(unidadeId);
      } else {
        next.add(unidadeId);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    setSelectedIds(new Set(unidades.map((u) => u.id)));
  };

  const handleDeselectAll = () => {
    setSelectedIds(new Set());
  };

  const handleSelectEmpreendimento = (empId: number) => {
    const empUnidades = unidades.filter((u) => u.empreendimento_id === empId);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      empUnidades.forEach((u) => next.add(u.id));
      return next;
    });
  };

  const handleDeselectEmpreendimento = (empId: number) => {
    const empUnidades = unidades.filter((u) => u.empreendimento_id === empId);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      empUnidades.forEach((u) => next.delete(u.id));
      return next;
    });
  };

  const handleSelectBloco = (empId: number, blocoCodigo: number | null) => {
    const blocoUnidades = unidades.filter(
      (u) => u.empreendimento_id === empId && u.bloco_codigo === blocoCodigo
    );
    setSelectedIds((prev) => {
      const next = new Set(prev);
      blocoUnidades.forEach((u) => next.add(u.id));
      return next;
    });
  };

  const handleDeselectBloco = (empId: number, blocoCodigo: number | null) => {
    const blocoUnidades = unidades.filter(
      (u) => u.empreendimento_id === empId && u.bloco_codigo === blocoCodigo
    );
    setSelectedIds((prev) => {
      const next = new Set(prev);
      blocoUnidades.forEach((u) => next.delete(u.id));
      return next;
    });
  };

  const toggleEmpExpanded = (empId: number) => {
    setExpandedEmps((prev) => {
      const next = new Set(prev);
      if (next.has(empId)) {
        next.delete(empId);
      } else {
        next.add(empId);
      }
      return next;
    });
  };

  const toggleBlocoExpanded = (key: string) => {
    setExpandedBlocos((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const getEmpCount = (empId: number) => {
    const empUnidades = unidades.filter((u) => u.empreendimento_id === empId);
    const selected = empUnidades.filter((u) => selectedIds.has(u.id)).length;
    return { selected, total: empUnidades.length };
  };

  const getBlocoCount = (empId: number, blocoCodigo: number | null) => {
    const blocoUnidades = unidades.filter(
      (u) => u.empreendimento_id === empId && u.bloco_codigo === blocoCodigo
    );
    const selected = blocoUnidades.filter((u) => selectedIds.has(u.id)).length;
    return { selected, total: blocoUnidades.length };
  };

  const handleClose = () => {
    setSearchTerm('');
    onClose();
  };

  const handleSave = async () => {
    if (!grupo) return;

    try {
      const result = await updatePropriedade.mutateAsync({
        grupoId: grupo.id,
        unidadeIds: Array.from(selectedIds),
      });
      toast.success(result.mensagem);
      handleClose();
    } catch (error) {
      console.error('Erro ao atualizar propriedade de unidades:', error);
      toast.error('Erro ao atualizar propriedade de unidades');
    }
  };

  const formatCurrency = (value: number | string | null | undefined) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (numValue == null || Number.isNaN(numValue)) return '-';
    return numValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Configurar Unidades</DialogTitle>
          <DialogDescription>
            {grupo?.nome_grupo} - Selecione as unidades que pertencem a você
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          {/* Botões globais */}
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              disabled={isLoading || isLoadingUnidades}
            >
              Selecionar Todas
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDeselectAll}
              disabled={isLoading || isLoadingUnidades}
            >
              Desmarcar Todas
            </Button>
          </div>

          {/* Campo de busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar por unidade, bloco, empreendimento, tipologia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              disabled={isLoading || isLoadingUnidades}
            />
          </div>

          {/* Lista de unidades agrupadas */}
          <div className="flex-1 overflow-y-auto rounded-md border max-h-[400px]">
            {(() => {
              if (isLoadingUnidades) {
                return (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                    <span className="ml-2 text-sm text-gray-500">Carregando unidades...</span>
                  </div>
                );
              }

              if (unidades.length === 0) {
                return (
                  <div className="flex items-center justify-center py-8">
                    <span className="text-sm text-gray-500">
                      Nenhuma unidade encontrada para este grupo
                    </span>
                  </div>
                );
              }

              if (agrupadosFiltrados.length === 0) {
                return (
                  <div className="flex items-center justify-center py-8">
                    <span className="text-sm text-gray-500">
                      Nenhuma unidade encontrada para &quot;{searchTerm}&quot;
                    </span>
                  </div>
                );
              }

              return (
                <div className="divide-y">
                  {agrupadosFiltrados.map((emp) => {
                    const empCount = getEmpCount(emp.empreendimento_id);
                    const isEmpExpanded = expandedEmps.has(emp.empreendimento_id);

                    return (
                      <div key={emp.empreendimento_id} className="bg-white">
                        {/* Header do empreendimento */}
                        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 sticky top-0">
                          <button
                            type="button"
                            onClick={() => toggleEmpExpanded(emp.empreendimento_id)}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            {isEmpExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </button>
                          <span className="font-medium flex-1">{emp.empreendimento_nome}</span>
                          <span className="text-sm text-gray-500">
                            ({empCount.selected}/{empCount.total})
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSelectEmpreendimento(emp.empreendimento_id)}
                            disabled={isLoading}
                            className="text-xs h-7"
                          >
                            Selecionar
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeselectEmpreendimento(emp.empreendimento_id)}
                            disabled={isLoading}
                            className="text-xs h-7"
                          >
                            Desmarcar
                          </Button>
                        </div>

                        {/* Blocos do empreendimento */}
                        {isEmpExpanded && (
                          <div className="pl-6">
                            {emp.blocos.map((bloco) => {
                              const blocoKey = `${emp.empreendimento_id}-${bloco.bloco_codigo || 'sem-bloco'}`;
                              const blocoCount = getBlocoCount(
                                emp.empreendimento_id,
                                bloco.bloco_codigo
                              );
                              const isBlocoExpanded = expandedBlocos.has(blocoKey);

                              return (
                                <div key={blocoKey} className="border-l border-gray-200">
                                  {/* Header do bloco */}
                                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50/50">
                                    <button
                                      type="button"
                                      onClick={() => toggleBlocoExpanded(blocoKey)}
                                      className="p-1 hover:bg-gray-200 rounded"
                                    >
                                      {isBlocoExpanded ? (
                                        <ChevronDown className="h-3 w-3" />
                                      ) : (
                                        <ChevronRight className="h-3 w-3" />
                                      )}
                                    </button>
                                    <span className="text-sm font-medium flex-1">
                                      {bloco.bloco_nome}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      ({blocoCount.selected}/{blocoCount.total})
                                    </span>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        handleSelectBloco(emp.empreendimento_id, bloco.bloco_codigo)
                                      }
                                      disabled={isLoading}
                                      className="text-xs h-6 px-2"
                                    >
                                      Selecionar
                                    </Button>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        handleDeselectBloco(
                                          emp.empreendimento_id,
                                          bloco.bloco_codigo
                                        )
                                      }
                                      disabled={isLoading}
                                      className="text-xs h-6 px-2"
                                    >
                                      Desmarcar
                                    </Button>
                                  </div>

                                  {/* Unidades do bloco */}
                                  {isBlocoExpanded && (
                                    <div className="pl-4">
                                      {bloco.unidades.map((unidade) => {
                                        const isSelected = selectedIds.has(unidade.id);
                                        return (
                                          <div
                                            key={unidade.id}
                                            className={`flex items-center gap-3 px-3 py-1.5 border-b border-gray-100 transition-colors ${
                                              isSelected ? 'bg-green-50' : 'hover:bg-gray-50'
                                            }`}
                                          >
                                            <input
                                              type="checkbox"
                                              checked={isSelected}
                                              onChange={() => handleToggleUnidade(unidade.id)}
                                              disabled={isLoading}
                                              className="h-4 w-4 rounded border-gray-300"
                                              aria-label={`Selecionar unidade ${unidade.nome}`}
                                            />
                                            <span
                                              className={`text-sm min-w-[60px] ${isSelected ? 'font-medium text-green-800' : ''}`}
                                            >
                                              {unidade.nome}
                                            </span>
                                            <span className="text-xs text-gray-500 hidden sm:inline">
                                              {unidade.status}
                                            </span>
                                            <span className="text-xs text-gray-500 hidden md:inline">
                                              {formatCurrency(unidade.valor)}
                                            </span>
                                            <span className="text-xs text-gray-500 hidden lg:inline">
                                              {unidade.tipologia || '-'}
                                            </span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>

          {/* Contador */}
          <p className="text-sm text-gray-500">
            {selectedIds.size} de {totalUnidades} unidades marcadas como suas
          </p>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isLoading || isLoadingUnidades}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
