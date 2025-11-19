import { Eye } from 'lucide-react';
import { useState } from 'react';

import type { Venda } from '@/shared/types';

import { useVendas } from '@/features/dashboard/hooks/useVendas';
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
import { formatCurrency, formatDate } from '@/shared/utils/format';

const getStatusClassName = (status: string) => {
  if (status === 'Ativa') return 'bg-green-100 text-green-700';
  if (status === 'Cancelada') return 'bg-red-100 text-red-700';
  return 'bg-yellow-100 text-yellow-700';
};

interface VendaDetalhesModalProps {
  venda: Venda;
  onClose: () => void;
}

const VendaDetalhesModal = ({ venda, onClose }: VendaDetalhesModalProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
      <h2 className="mb-4 text-2xl font-bold">Detalhes da Venda</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-sm text-gray-500">Cliente</p>
          <p className="font-medium">{venda.cliente_nome}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Código Mega</p>
          <p className="font-medium">{venda.codigo_mega}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Unidade</p>
          <p className="font-medium">{venda.unidade}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Bloco</p>
          <p className="font-medium">{venda.bloco}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Valor (VGV)</p>
          <p className="font-medium">{formatCurrency(venda.valor_venda)}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Data da Venda</p>
          <p className="font-medium">{formatDate(venda.data_venda)}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Status</p>
          <p className="font-medium">
            <span
              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusClassName(venda.status)}`}
            >
              {venda.status}
            </span>
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Forma de Pagamento</p>
          <p className="font-medium">{venda.forma_pagamento || 'Não informado'}</p>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={onClose} variant="outline">
          Fechar
        </Button>
      </div>
    </div>
  </div>
);

interface UltimasVendasTableProps {
  empreendimentoId?: number;
}

export const UltimasVendasTable = ({ empreendimentoId }: UltimasVendasTableProps = {}) => {
  const [selectedVenda, setSelectedVenda] = useState<Venda | null>(null);

  const {
    data: vendas,
    isLoading,
    error,
  } = useVendas({
    limit: 10,
    empreendimento_id: empreendimentoId,
  });

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="text-center">
        <p className="text-red-600">Erro ao carregar vendas</p>
        <p className="text-sm text-gray-500">
          {error instanceof Error ? error.message : 'Erro desconhecido'}
        </p>
      </div>
    );
  }

  if (!vendas || vendas.length === 0) {
    return (
      <div className="text-center">
        <p className="text-gray-500">Nenhuma venda encontrada</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Grupo</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>VGV</TableHead>
              <TableHead className="hidden sm:table-cell">Data</TableHead>
              <TableHead className="text-right">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendas.map((venda) => (
              <TableRow key={venda.id}>
                <TableCell className="font-medium">
                  {venda.grupo_nome || venda.empreendimento_nome || `ID: ${venda.empreendimento_id}`}
                </TableCell>
                <TableCell>{venda.cliente_nome}</TableCell>
                <TableCell>{formatCurrency(venda.valor_venda)}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  {formatDate(venda.data_venda)}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedVenda(venda)}>
                    <Eye className="h-4 w-4" />
                    <span className="ml-2 hidden sm:inline">Detalhes</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedVenda && (
        <VendaDetalhesModal venda={selectedVenda} onClose={() => setSelectedVenda(null)} />
      )}
    </>
  );
};
