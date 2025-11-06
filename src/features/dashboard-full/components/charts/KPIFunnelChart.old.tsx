import { ArrowDown } from 'lucide-react';

import { formatCompactCurrency, formatPercentage } from '@/shared/utils/format';

interface KPIFunnelChartProps {
  totalPropostas: number;
  valorPropostas: number;
  totalVendas: number;
  valorVendas: number;
  taxaConversao: number;
  ticketMedio: number;
}

export const KPIFunnelChart = ({
  totalPropostas,
  valorPropostas,
  totalVendas,
  valorVendas,
  taxaConversao,
  ticketMedio,
}: KPIFunnelChartProps) => {
  return (
    <div className="flex items-center justify-center gap-3 overflow-x-auto">
      {/* ETAPA 1 - Propostas */}
      <div className="flex flex-col items-center">
        <div
          className="flex h-20 w-60 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg"
          style={{ clipPath: 'polygon(0 0, 100% 0, 90% 100%, 10% 100%)' }}
        >
          <div className="text-center text-white">
            <p className="text-[10px] font-medium uppercase opacity-90">Propostas</p>
            <p className="text-2xl font-bold">{totalPropostas}</p>
            <p className="text-[10px] opacity-80">{formatCompactCurrency(valorPropostas)}</p>
          </div>
        </div>
      </div>

      {/* SETA 1 */}
      <div className="flex flex-col items-center">
        <ArrowDown className="h-5 w-5 text-gray-400" />
      </div>

      {/* ETAPA 2 - Vendas */}
      <div className="flex flex-col items-center">
        <div
          className="flex h-20 w-56 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-green-600 shadow-lg"
          style={{ clipPath: 'polygon(5% 0, 95% 0, 85% 100%, 15% 100%)' }}
        >
          <div className="text-center text-white">
            <p className="text-[10px] font-medium uppercase opacity-90">Vendas</p>
            <p className="text-2xl font-bold">{totalVendas}</p>
            <p className="text-[10px] opacity-80">{formatCompactCurrency(valorVendas)}</p>
          </div>
        </div>
      </div>

      {/* SETA 2 */}
      <div className="flex flex-col items-center">
        <ArrowDown className="h-5 w-5 text-gray-400" />
      </div>

      {/* ETAPA 3 - Conversão */}
      <div className="flex flex-col items-center">
        <div
          className="flex h-20 w-52 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg"
          style={{ clipPath: 'polygon(8% 0, 92% 0, 82% 100%, 18% 100%)' }}
        >
          <div className="text-center text-white">
            <p className="text-[10px] font-medium uppercase opacity-90">Conversão</p>
            <p className="text-2xl font-bold">{formatPercentage(taxaConversao, 1)}</p>
            <p className="text-[10px] opacity-80">
              {totalVendas} de {totalPropostas}
            </p>
          </div>
        </div>
      </div>

      {/* SETA 3 */}
      <div className="flex flex-col items-center">
        <ArrowDown className="h-5 w-5 text-gray-400" />
      </div>

      {/* ETAPA 4 - Ticket Médio */}
      <div className="flex flex-col items-center">
        <div
          className="flex h-20 w-48 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg"
          style={{ clipPath: 'polygon(12% 0, 88% 0, 78% 100%, 22% 100%)' }}
        >
          <div className="text-center text-white">
            <p className="text-[10px] font-medium uppercase opacity-90">Ticket Médio</p>
            <p className="text-xl font-bold">{formatCompactCurrency(ticketMedio)}</p>
            <p className="text-[10px] opacity-80">Por venda</p>
          </div>
        </div>
      </div>
    </div>
  );
};
