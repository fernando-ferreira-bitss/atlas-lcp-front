import { formatPercentage } from '@/shared/utils/format';

interface VendasConversaoBarChartProps {
  data: Array<{
    empreendimento_id: number;
    empreendimento_nome: string;
    total_propostas: number;
    total_vendas: number;
    taxa_conversao: number;
  }>;
}

const COLORS = ['#0B2D5C', '#20B187', '#F45B32', '#9333EA', '#F59E0B'];

export const VendasConversaoBarChart = ({ data }: VendasConversaoBarChartProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-xs text-gray-500">Nenhum dado disponível</p>
      </div>
    );
  }

  const maxVendas = Math.max(...data.map((item) => item.total_vendas));

  return (
    <div className="space-y-3">
      {data.map((item, index) => {
        const widthPercentage = (item.total_vendas / maxVendas) * 100;

        return (
          <div key={item.empreendimento_id} className="flex items-center gap-3">
            {/* Nome do Empreendimento */}
            <div className="w-32 flex-shrink-0">
              <p
                className="truncate text-xs font-medium text-gray-700"
                title={item.empreendimento_nome}
              >
                {item.empreendimento_nome}
              </p>
            </div>

            {/* Barra de Vendas */}
            <div className="relative flex-1">
              <div
                className="h-8 rounded transition-all duration-300"
                style={{
                  width: `${widthPercentage}%`,
                  backgroundColor: COLORS[index % COLORS.length],
                  minWidth: '40px',
                }}
              >
                <div className="flex h-full items-center justify-center">
                  <span className="text-xs font-semibold text-white">{item.total_vendas}</span>
                </div>
              </div>
            </div>

            {/* Taxa de Conversão */}
            <div className="w-16 flex-shrink-0 text-right">
              <span className="text-xs font-bold text-lcp-green">
                {formatPercentage(item.taxa_conversao, 1)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
