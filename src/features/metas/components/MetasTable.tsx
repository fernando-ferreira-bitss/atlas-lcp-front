import { Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { useDeleteMeta } from '../hooks/useMetas';

import { MetaFormModal } from './MetaFormModal';

import type { MetaWithEmpreendimento } from '../types';

import { Button } from '@/shared/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { formatCurrency } from '@/shared/utils/format';

const MESES = [
  '', // índice 0 não usado
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

interface MetasTableProps {
  metas: MetaWithEmpreendimento[];
  isLoading?: boolean;
}

export const MetasTable = ({ metas, isLoading }: MetasTableProps) => {
  const [metaToEdit, setMetaToEdit] = useState<MetaWithEmpreendimento | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const deleteMeta = useDeleteMeta();

  const handleEdit = (meta: MetaWithEmpreendimento) => {
    setMetaToEdit(meta);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number, descricao: string) => {
    // eslint-disable-next-line no-alert, no-restricted-globals
    if (!confirm(`Confirma a exclusão da meta ${descricao}?`)) {
      return;
    }

    try {
      await deleteMeta.mutateAsync(id);
      toast.success('Meta excluída com sucesso!');
    } catch (error: unknown) {
      console.error('Erro ao excluir meta:', error);
      const errorMessage =
        error && typeof error === 'object' && 'response' in error
          ? (error as { response?: { data?: { detail?: string } } }).response?.data?.detail
          : 'Erro ao excluir meta';
      toast.error(errorMessage || 'Erro ao excluir meta');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setMetaToEdit(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-lcp-blue border-t-transparent" />
      </div>
    );
  }

  if (!metas || metas.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
        <p className="text-sm text-gray-600">Nenhuma meta encontrada</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Empreendimento</TableHead>
              <TableHead>Mês</TableHead>
              <TableHead>Ano</TableHead>
              <TableHead className="text-right">Meta VGV</TableHead>
              <TableHead className="text-right">Meta Unidades</TableHead>
              <TableHead className="w-[100px] text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {metas.map((meta) => {
              const empNome = meta.empreendimento_nome || 'Consolidado';
              const descricao = `${empNome} - ${MESES[meta.mes]}/${meta.ano}`;
              const isConsolidado = !meta.empreendimento_id;

              return (
                <TableRow
                  key={meta.id}
                  className={isConsolidado ? 'bg-blue-50 hover:bg-blue-100' : ''}
                >
                  <TableCell className="font-medium">
                    {meta.empreendimento_id ? (
                      meta.empreendimento_nome || `ID: ${meta.empreendimento_id}`
                    ) : (
                      <span className="flex items-center gap-2 font-bold text-lcp-blue">
                        <span className="flex h-2 w-2 rounded-full bg-lcp-blue" />
                        Consolidado (Geral)
                      </span>
                    )}
                  </TableCell>
                  <TableCell className={isConsolidado ? 'font-semibold' : ''}>
                    {MESES[meta.mes]}
                  </TableCell>
                  <TableCell className={isConsolidado ? 'font-semibold' : ''}>{meta.ano}</TableCell>
                  <TableCell
                    className={`text-right font-medium ${isConsolidado ? 'text-lg font-bold text-lcp-green' : 'text-lcp-green'}`}
                  >
                    {formatCurrency(Number(meta.meta_vendas))}
                  </TableCell>
                  <TableCell
                    className={`text-right ${isConsolidado ? 'text-lg font-bold' : 'font-medium'}`}
                  >
                    {meta.meta_unidades}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(meta)}
                        title="Editar"
                      >
                        <Edit className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(meta.id, descricao)}
                        disabled={deleteMeta.isPending}
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Modal de Edição */}
      <MetaFormModal open={isModalOpen} onOpenChange={handleModalClose} meta={metaToEdit} />
    </>
  );
};
