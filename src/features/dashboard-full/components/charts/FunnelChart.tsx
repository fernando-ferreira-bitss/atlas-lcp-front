import { ArrowRight } from 'lucide-react';

import { formatCurrency, formatPercentage } from '@/shared/utils/format';

interface FunnelChartProps {
  totalPropostas: number;
  totalVendas: number;
  taxaConversao: number;
  valorPropostas: number;
  valorVendas: number;
}

export const FunnelChart = ({
  totalPropostas,
  totalVendas,
  taxaConversao,
  valorPropostas,
  valorVendas,
}: FunnelChartProps) => {
  return (
    <div className="flex h-full items-center justify-center gap-6">
      {/* Propostas */}
      <div className="flex h-24 w-80 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
        <div className="text-center text-white">
          <p className="text-xs font-medium uppercase opacity-90">Propostas</p>
          <p className="text-3xl font-bold">{totalPropostas}</p>
          <p className="text-xs opacity-80">{formatCurrency(valorPropostas)}</p>
        </div>
      </div>

      {/* Seta com conversão */}
      <div className="flex flex-col items-center gap-1">
        <ArrowRight className="h-8 w-8 text-lcp-blue" />
        <div className="rounded bg-lcp-orange px-3 py-1">
          <p className="text-sm font-bold text-white">{formatPercentage(taxaConversao, 1)}</p>
        </div>
      </div>

      {/* Vendas */}
      <div className="flex h-24 w-80 items-center justify-center rounded-lg bg-gradient-to-r from-green-500 to-green-600 shadow-lg">
        <div className="text-center text-white">
          <p className="text-xs font-medium uppercase opacity-90">Vendas</p>
          <p className="text-3xl font-bold">{totalVendas}</p>
          <p className="text-xs opacity-80">{formatCurrency(valorVendas)}</p>
        </div>
      </div>
    </div>
  );
};
