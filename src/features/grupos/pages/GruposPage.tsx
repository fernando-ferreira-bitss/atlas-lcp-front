import { Building, Edit, Loader2, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { GrupoFormModal } from '../components/GrupoFormModal';
import { UnidadesModal } from '../components/UnidadesModal';
import { useDeleteGrupo, useGrupos } from '../hooks/useGrupos';

import type { EmpreendimentoGrupoWithMembros } from '@/shared/types';

import { Loading } from '@/shared/components/common';
import { Button } from '@/shared/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';

export const GruposPage = () => {
  const [selectedGrupo, setSelectedGrupo] = useState<EmpreendimentoGrupoWithMembros | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingGrupoId, setLoadingGrupoId] = useState<number | null>(null);

  // Estado para modal de unidades
  const [selectedGrupoForUnidades, setSelectedGrupoForUnidades] =
    useState<EmpreendimentoGrupoWithMembros | null>(null);
  const [isUnidadesModalOpen, setIsUnidadesModalOpen] = useState(false);

  const { data: grupos, isLoading, error } = useGrupos();
  const deleteGrupo = useDeleteGrupo();

  const handleDelete = async (id: number, nome: string) => {
    if (
      // eslint-disable-next-line no-alert
      !window.confirm(
        `Tem certeza que deseja excluir o grupo "${nome}"?\n\nEmpreendimentos vinculados serão desvinculados.`
      )
    ) {
      return;
    }

    setLoadingGrupoId(id);
    try {
      await deleteGrupo.mutateAsync(id);
      toast.success('Grupo excluído com sucesso');
    } catch (err) {
      console.error('Erro ao excluir grupo:', err);
      toast.error('Erro ao excluir grupo');
    } finally {
      setLoadingGrupoId(null);
    }
  };

  const handleEdit = (grupo: EmpreendimentoGrupoWithMembros) => {
    setSelectedGrupo(grupo);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedGrupo(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedGrupo(null);
  };

  const handleOpenUnidadesModal = (grupo: EmpreendimentoGrupoWithMembros) => {
    setSelectedGrupoForUnidades(grupo);
    setIsUnidadesModalOpen(true);
  };

  const handleCloseUnidadesModal = () => {
    setIsUnidadesModalOpen(false);
    setSelectedGrupoForUnidades(null);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-600">Erro ao carregar grupos</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {error instanceof Error ? error.message : 'Ocorreu um erro desconhecido'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Grupos de Empreendimentos</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Gerencie os grupos de empreendimentos
          </p>
        </div>
        <Button onClick={handleCreate} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Novo Grupo
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do Grupo</TableHead>
                <TableHead className="hidden sm:table-cell">Descrição</TableHead>
                <TableHead className="hidden md:table-cell">Empreendimentos</TableHead>
                <TableHead className="hidden lg:table-cell">Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grupos && grupos.length > 0 ? (
                grupos.map((grupo) => (
                  <TableRow key={grupo.id}>
                    <TableCell className="font-medium">{grupo.nome_grupo}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span className="line-clamp-2 text-sm text-muted-foreground">
                        {grupo.descricao || '-'}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="text-sm">
                        {grupo.total_empreendimentos}{' '}
                        {grupo.total_empreendimentos === 1 ? 'empreendimento' : 'empreendimentos'}
                      </span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          grupo.ativo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {grupo.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenUnidadesModal(grupo)}
                          disabled={loadingGrupoId === grupo.id}
                          title="Configurar unidades"
                        >
                          <Building className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(grupo)}
                          disabled={loadingGrupoId === grupo.id}
                          title="Editar grupo"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(grupo.id, grupo.nome_grupo)}
                          disabled={loadingGrupoId === grupo.id}
                          className="text-red-600 hover:text-red-700"
                          title="Excluir grupo"
                        >
                          {loadingGrupoId === grupo.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-muted-foreground">Nenhum grupo cadastrado</p>
                      <Button variant="link" onClick={handleCreate} className="mt-2">
                        Criar primeiro grupo
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <GrupoFormModal isOpen={isModalOpen} onClose={handleCloseModal} grupo={selectedGrupo} />

      <UnidadesModal
        isOpen={isUnidadesModalOpen}
        onClose={handleCloseUnidadesModal}
        grupo={selectedGrupoForUnidades}
      />
    </div>
  );
};
