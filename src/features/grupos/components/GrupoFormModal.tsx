import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import {
  useCreateGrupo,
  useUpdateGrupo,
  useGrupoEmpreendimentos,
  useEmpreendimentosDisponiveis,
} from '../hooks/useGrupos';

import type { EmpreendimentoGrupoWithMembros, EmpreendimentoSimple } from '@/shared/types';

import { useAllEmpreendimentos } from '@/features/empreendimentos/hooks/useEmpreendimentos';

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
import { Label } from '@/shared/components/ui/label';

const grupoSchema = z.object({
  nome_grupo: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  descricao: z.string().optional(),
  ativo: z.boolean(),
  empreendimento_ids: z.array(z.number()).optional(),
});

type GrupoFormData = z.infer<typeof grupoSchema>;

interface GrupoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  grupo?: EmpreendimentoGrupoWithMembros | null;
}

export function GrupoFormModal({ isOpen, onClose, grupo }: GrupoFormModalProps) {
  const createGrupo = useCreateGrupo();
  const updateGrupo = useUpdateGrupo();

  const [selectedEmpreendimentos, setSelectedEmpreendimentos] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Buscar TODOS os empreendimentos (para obter dados completos dos vinculados)
  const { data: todosEmpreendimentos, isLoading: isLoadingTodos } = useAllEmpreendimentos();

  // Buscar empreendimentos disponíveis (sem grupo)
  const { data: empreendimentosDisponiveis, isLoading: isLoadingDisponiveis } =
    useEmpreendimentosDisponiveis();

  // Buscar IDs dos empreendimentos já vinculados ao grupo (apenas se editando)
  const { data: empreendimentosVinculadosIds, isLoading: isLoadingVinculados } =
    useGrupoEmpreendimentos(grupo?.id || 0);

  const isLoading = createGrupo.isPending || updateGrupo.isPending;

  // Combinar todos os empreendimentos (disponíveis + vinculados com dados completos)
  const todosEmpreendimentosParaExibir = useMemo(() => {
    const lista: EmpreendimentoSimple[] = [];

    // Adicionar empreendimentos vinculados (com dados completos de todosEmpreendimentos)
    if (grupo && empreendimentosVinculadosIds && todosEmpreendimentos) {
      empreendimentosVinculadosIds.forEach((id) => {
        const emp = todosEmpreendimentos.find((e) => e.id === id);
        if (emp) {
          lista.push({
            id: emp.id,
            codigo_mega: emp.codigo_mega,
            nome: emp.nome,
          });
        }
      });
    }

    // Adicionar empreendimentos disponíveis
    if (empreendimentosDisponiveis) {
      lista.push(...empreendimentosDisponiveis);
    }

    return lista;
  }, [grupo, empreendimentosVinculadosIds, todosEmpreendimentos, empreendimentosDisponiveis]);

  // Filtrar e ordenar empreendimentos (selecionados primeiro)
  const empreendimentosFiltrados = useMemo(() => {
    let lista = todosEmpreendimentosParaExibir;

    // Aplicar filtro de busca
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      lista = lista.filter(
        (emp) =>
          emp.nome.toLowerCase().includes(term) || emp.codigo_mega.toString().includes(term)
      );
    }

    // Ordenar: selecionados primeiro, depois alfabético
    return lista.sort((a, b) => {
      const aSelected = selectedEmpreendimentos.includes(a.id);
      const bSelected = selectedEmpreendimentos.includes(b.id);

      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;

      // Ambos selecionados ou ambos não selecionados: ordenar alfabeticamente
      return a.nome.localeCompare(b.nome);
    });
  }, [todosEmpreendimentosParaExibir, searchTerm, selectedEmpreendimentos]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<GrupoFormData>({
    resolver: zodResolver(grupoSchema),
    defaultValues: {
      nome_grupo: '',
      descricao: '',
      ativo: true,
      empreendimento_ids: [],
    },
  });

  // Carrega empreendimentos vinculados quando editar
  useEffect(() => {
    if (grupo && empreendimentosVinculadosIds) {
      setSelectedEmpreendimentos(empreendimentosVinculadosIds);
      setValue('empreendimento_ids', empreendimentosVinculadosIds);
    }
  }, [grupo, empreendimentosVinculadosIds, setValue]);

  useEffect(() => {
    if (grupo) {
      reset({
        nome_grupo: grupo.nome_grupo,
        descricao: grupo.descricao || '',
        ativo: grupo.ativo,
        empreendimento_ids: empreendimentosVinculadosIds || [],
      });
    } else {
      reset({
        nome_grupo: '',
        descricao: '',
        ativo: true,
        empreendimento_ids: [],
      });
      setSelectedEmpreendimentos([]);
    }
  }, [grupo, reset, empreendimentosVinculadosIds]);

  const handleClose = () => {
    reset();
    setSelectedEmpreendimentos([]);
    setSearchTerm('');
    onClose();
  };

  const handleToggleEmpreendimento = (empId: number) => {
    setSelectedEmpreendimentos((prev) => {
      const newSelection = prev.includes(empId)
        ? prev.filter((id) => id !== empId)
        : [...prev, empId];

      setValue('empreendimento_ids', newSelection);
      return newSelection;
    });
  };

  const onSubmit = async (data: GrupoFormData) => {
    try {
      const payload = {
        ...data,
        empreendimento_ids: selectedEmpreendimentos,
      };

      if (grupo) {
        await updateGrupo.mutateAsync({
          id: grupo.id,
          data: payload,
        });
        toast.success('Grupo atualizado com sucesso');
      } else {
        await createGrupo.mutateAsync(payload);
        toast.success('Grupo criado com sucesso');
      }
      handleClose();
    } catch (error) {
      console.error('Erro ao salvar grupo:', error);
      toast.error(grupo ? 'Erro ao atualizar grupo' : 'Erro ao criar grupo');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{grupo ? 'Editar Grupo' : 'Novo Grupo'}</DialogTitle>
          <DialogDescription>
            {grupo
              ? 'Atualize as informações do grupo de empreendimentos'
              : 'Crie um novo grupo de empreendimentos'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome_grupo">
              Nome do Grupo <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nome_grupo"
              {...register('nome_grupo')}
              disabled={isLoading}
              placeholder="Ex: CONDOMINIO INDUSTRIAL STOCKCARGO"
            />
            {errors.nome_grupo && (
              <p className="text-sm text-red-500">{errors.nome_grupo.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Input
              id="descricao"
              {...register('descricao')}
              disabled={isLoading}
              placeholder="Ex: Todas as fases do empreendimento"
            />
            {errors.descricao && (
              <p className="text-sm text-red-500">{errors.descricao.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="ativo"
              {...register('ativo')}
              disabled={isLoading}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="ativo" className="cursor-pointer">
              Grupo ativo
            </Label>
          </div>

          {/* Seletor de Empreendimentos */}
          <div className="space-y-2">
            <Label>Empreendimentos</Label>

            {/* Campo de busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por nome ou código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                disabled={isLoading || isLoadingDisponiveis || isLoadingVinculados}
              />
            </div>

            <div className="rounded-md border p-3 max-h-60 overflow-y-auto">
              {isLoadingDisponiveis || isLoadingVinculados || isLoadingTodos ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                  <span className="ml-2 text-sm text-gray-500">Carregando...</span>
                </div>
              ) : empreendimentosFiltrados.length > 0 ? (
                <div className="space-y-1">
                  {empreendimentosFiltrados.map((emp) => {
                    const isSelected = selectedEmpreendimentos.includes(emp.id);
                    return (
                      <div
                        key={emp.id}
                        className={`flex items-center space-x-2 py-1.5 px-2 rounded transition-colors ${
                          isSelected ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          id={`emp-${emp.id}`}
                          checked={isSelected}
                          onChange={() => handleToggleEmpreendimento(emp.id)}
                          disabled={isLoading}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <label
                          htmlFor={`emp-${emp.id}`}
                          className="text-sm cursor-pointer flex-1"
                        >
                          <span className={isSelected ? 'font-medium text-blue-900' : ''}>
                            {emp.nome}
                          </span>
                          <span className="text-gray-500 ml-1">({emp.codigo_mega})</span>
                        </label>
                      </div>
                    );
                  })}
                </div>
              ) : searchTerm ? (
                <p className="text-sm text-gray-500 text-center py-2">
                  Nenhum empreendimento encontrado para "{searchTerm}"
                </p>
              ) : (
                <p className="text-sm text-gray-500 text-center py-2">
                  Nenhum empreendimento disponível
                </p>
              )}
            </div>
            <p className="text-xs text-gray-500">
              {selectedEmpreendimentos.length} empreendimento(s) selecionado(s)
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : grupo ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
