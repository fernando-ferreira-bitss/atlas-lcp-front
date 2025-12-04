import { Eye } from 'lucide-react';
import { useState } from 'react';

import type { Venda } from '@/shared/types';

import { useVendas } from '@/features/dashboard/hooks/useVendas';
import { Loading } from '@/shared/components/common';
import { Button } from '@/shared/components/ui/button';
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
          <p className="text-sm text-gray-500">Grupo</p>
          <p className="font-medium">{venda.grupo_nome || 'Não informado'}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Empreendimento</p>
          <p className="font-medium">{venda.empreendimento_nome || 'Não informado'}</p>
        </div>

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

interface UltimasVendasCompactTableProps {
  empreendimentoId?: number;
  grupoId?: number;
  dataInicio?: string;
  dataFim?: string;
}

export const UltimasVendasCompactTable = ({
  empreendimentoId,
  grupoId,
  dataInicio,
  dataFim,
}: UltimasVendasCompactTableProps = {}) => {
  const [selectedVenda, setSelectedVenda] = useState<Venda | null>(null);

  const {
    data: vendas,
    isLoading,
    error,
  } = useVendas({
    limit: 100,
    empreendimento_id: empreendimentoId,
    grupo_id: grupoId,
    data_inicio: dataInicio,
    data_fim: dataFim,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <p className="text-xs text-red-600">Erro ao carregar vendas</p>
      </div>
    );
  }

  if (!vendas || vendas.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-xs text-gray-500">Nenhuma venda encontrada</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex h-full flex-col">
        {/* Header fixo */}
        <div className="flex-shrink-0 border-b bg-white">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="py-1 text-left font-semibold">Grupo</th>
                <th className="w-24 py-1 text-right font-semibold">VGV</th>
                <th className="w-20 py-1 text-right font-semibold">Data</th>
                <th className="w-8 py-1" aria-label="Ações" />
              </tr>
            </thead>
          </table>
        </div>

        {/* Body com scroll */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-xs">
            <tbody>
              {vendas.map((venda: Venda) => (
                <tr
                  key={venda.id}
                  className="cursor-pointer border-b hover:bg-gray-50"
                  onDoubleClick={() => setSelectedVenda(venda)}
                >
                  <td className="py-1 font-medium">
                    {venda.grupo_nome ||
                      venda.empreendimento_nome ||
                      `ID: ${venda.empreendimento_id}`}
                  </td>
                  <td className="w-24 py-1 text-right">{formatCurrency(venda.valor_venda)}</td>
                  <td className="w-20 py-1 text-right">{formatDate(venda.data_venda)}</td>
                  <td className="w-8 py-1 text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => setSelectedVenda(venda)}
                      title="Ver detalhes"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedVenda && (
        <VendaDetalhesModal venda={selectedVenda} onClose={() => setSelectedVenda(null)} />
      )}
    </>
  );
};
