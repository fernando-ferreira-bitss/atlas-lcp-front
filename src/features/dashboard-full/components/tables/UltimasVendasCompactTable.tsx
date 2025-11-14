import type { Venda } from '@/shared/types';

import { useVendas } from '@/features/dashboard/hooks/useVendas';
import { Loading } from '@/shared/components/common';
import { formatCurrency, formatDate } from '@/shared/utils/format';

interface UltimasVendasCompactTableProps {
  empreendimentoId?: number;
}

export const UltimasVendasCompactTable = ({
  empreendimentoId,
}: UltimasVendasCompactTableProps = {}) => {
  const {
    data: vendas,
    isLoading,
    error,
  } = useVendas({
    limit: 5,
    empreendimento_id: empreendimentoId,
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
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b">
            <th className="py-1 text-left font-semibold">Empreendimento</th>
            <th className="py-1 text-right font-semibold">VGV</th>
            <th className="py-1 text-right font-semibold">Data</th>
          </tr>
        </thead>
        <tbody>
          {vendas.map((venda: Venda) => (
            <tr key={venda.id} className="border-b hover:bg-gray-50">
              <td className="py-1 font-medium">
                {venda.empreendimento_nome || `ID: ${venda.empreendimento_id}`}
              </td>
              <td className="py-1 text-right">{formatCurrency(venda.valor_venda)}</td>
              <td className="py-1 text-right">{formatDate(venda.data_venda)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
