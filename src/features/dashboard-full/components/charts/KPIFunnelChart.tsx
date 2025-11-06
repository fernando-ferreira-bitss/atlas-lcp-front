import { ArrowDown } from 'lucide-react';

import { formatCompactCurrency, formatPercentage } from '@/shared/utils/format';

interface KPIFunnelChartProps {
  totalReservas?: number;
  valorReservas?: number;
  totalPropostas: number;
  valorPropostas: number;
  totalVendas: number;
  valorVendas: number;
  taxaConversao: number;
  ticketMedio: number;
}

export const KPIFunnelChart = ({
  totalReservas = 0,
  valorReservas = 0,
  totalPropostas,
  valorPropostas,
  totalVendas,
  valorVendas,
  taxaConversao,
  ticketMedio,
}: KPIFunnelChartProps) => {
  return (
    <div className="flex h-full flex-col justify-between gap-3">
      {/* FUNIL: Apenas etapas sequenciais - Layout Vertical */}
      <div className="flex flex-1 flex-col items-center justify-center gap-2">
        {/* ETAPA 1 - Reservas */}
        <div className="w-full">
          <div
            className="mx-auto flex h-16 w-[95%] items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg"
            style={{ clipPath: 'polygon(5% 0, 95% 0, 90% 100%, 10% 100%)' }}
          >
            <div className="text-center text-white">
              <p className="text-[10px] font-medium uppercase opacity-90">Reservas</p>
              <p className="text-xl font-bold">{totalReservas}</p>
              <p className="text-[9px] opacity-80">{formatCompactCurrency(valorReservas)}</p>
            </div>
          </div>
        </div>

        {/* SETA */}
        <ArrowDown className="h-4 w-4 text-gray-400" />

        {/* ETAPA 2 - Propostas */}
        <div className="w-full">
          <div
            className="mx-auto flex h-16 w-[85%] items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg"
            style={{ clipPath: 'polygon(7% 0, 93% 0, 87% 100%, 13% 100%)' }}
          >
            <div className="text-center text-white">
              <p className="text-[10px] font-medium uppercase opacity-90">Propostas</p>
              <p className="text-xl font-bold">{totalPropostas}</p>
              <p className="text-[9px] opacity-80">{formatCompactCurrency(valorPropostas)}</p>
            </div>
          </div>
        </div>

        {/* SETA */}
        <ArrowDown className="h-4 w-4 text-gray-400" />

        {/* ETAPA 3 - Vendas */}
        <div className="w-full">
          <div
            className="mx-auto flex h-16 w-[75%] items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-green-600 shadow-lg"
            style={{ clipPath: 'polygon(10% 0, 90% 0, 83% 100%, 17% 100%)' }}
          >
            <div className="text-center text-white">
              <p className="text-[10px] font-medium uppercase opacity-90">Vendas</p>
              <p className="text-xl font-bold">{totalVendas}</p>
              <p className="text-[9px] opacity-80">{formatCompactCurrency(valorVendas)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* MÉTRICAS AUXILIARES - Fora do funil */}
      <div className="grid grid-cols-2 gap-2">
        {/* Card Conversão */}
        <div className="rounded-lg border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-2 text-center shadow-sm">
          <p className="text-[9px] font-medium uppercase text-purple-700">Taxa de Conversão</p>
          <p className="text-lg font-bold text-purple-900">{formatPercentage(taxaConversao, 1)}</p>
          <p className="text-[8px] text-purple-600">
            ({totalVendas}/{totalPropostas})
          </p>
        </div>

        {/* Card Ticket Médio */}
        <div className="rounded-lg border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 p-2 text-center shadow-sm">
          <p className="text-[9px] font-medium uppercase text-orange-700">Ticket Médio</p>
          <p className="text-lg font-bold text-orange-900">{formatCompactCurrency(ticketMedio)}</p>
          <p className="text-[8px] text-orange-600">por venda</p>
        </div>
      </div>
    </div>
  );
};
