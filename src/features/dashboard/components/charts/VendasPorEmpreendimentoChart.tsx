import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import type { TopEmpreendimento } from '@/shared/types';
import { formatCurrency } from '@/shared/utils/format';

interface VendasPorEmpreendimentoChartProps {
  data: TopEmpreendimento[];
}

export const VendasPorEmpreendimentoChart = ({ data }: VendasPorEmpreendimentoChartProps) => {
  const chartData = data.map((item) => ({
    nome: item.empreendimento_nome.length > 30
      ? `${item.empreendimento_nome.substring(0, 30)}...`
      : item.empreendimento_nome,
    vendas: item.total_vendas,
    valor: item.valor_vendas,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="nome" angle={-45} textAnchor="end" height={120} />
        <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
        <YAxis yAxisId="right" orientation="right" stroke="#f97316" />
        <Tooltip
          formatter={(value: number, name: string) => {
            if (name === 'Valor (R$)') return [formatCurrency(value), name];
            return [value, name];
          }}
        />
        <Legend />
        <Bar yAxisId="left" dataKey="vendas" name="Quantidade" fill="#3b82f6" />
        <Bar yAxisId="right" dataKey="valor" name="Valor (R$)" fill="#f97316" />
      </BarChart>
    </ResponsiveContainer>
  );
};
