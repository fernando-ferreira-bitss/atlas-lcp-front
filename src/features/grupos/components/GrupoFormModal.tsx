import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { useCreateGrupo, useUpdateGrupo } from '../hooks/useGrupos';

import type { EmpreendimentoGrupoWithMembros } from '@/shared/types';

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

  const isLoading = createGrupo.isPending || updateGrupo.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GrupoFormData>({
    resolver: zodResolver(grupoSchema),
    defaultValues: {
      nome_grupo: '',
      descricao: '',
      ativo: true,
    },
  });

  useEffect(() => {
    if (grupo) {
      reset({
        nome_grupo: grupo.nome_grupo,
        descricao: grupo.descricao || '',
        ativo: grupo.ativo,
      });
    } else {
      reset({
        nome_grupo: '',
        descricao: '',
        ativo: true,
      });
    }
  }, [grupo, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: GrupoFormData) => {
    try {
      if (grupo) {
        await updateGrupo.mutateAsync({
          id: grupo.id,
          data,
        });
        toast.success('Grupo atualizado com sucesso');
      } else {
        await createGrupo.mutateAsync(data);
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
