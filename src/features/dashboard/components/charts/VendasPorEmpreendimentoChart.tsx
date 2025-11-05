import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import type { TopEmpreendimento } from '@/shared/types';

interface VendasPorEmpreendimentoChartProps {
  data: TopEmpreendimento[];
}

export const VendasPorEmpreendimentoChart = ({ data }: VendasPorEmpreendimentoChartProps) => {
  const chartData = data.map((item) => ({
    nomeCompleto: item.empreendimento_nome,
    nomeAbreviado: item.empreendimento_nome.length > 20
      ? `${item.empreendimento_nome.substring(0, 20)}...`
      : item.empreendimento_nome,
    propostas: Math.round(item.total_vendas * 1.5), // Mockado: estimativa de propostas
    vendas: item.total_vendas,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="nomeAbreviado" angle={-45} textAnchor="end" height={120} />
        <YAxis />
        <Tooltip
          labelFormatter={(label) => {
            const item = chartData.find((d) => d.nomeAbreviado === label);
            return item?.nomeCompleto || label;
          }}
        />
        <Legend />
        <Bar dataKey="propostas" name="Propostas" fill="#0B2D5C" stackId="a" />
        <Bar dataKey="vendas" name="Vendas" fill="#20B187" stackId="a" />
      </BarChart>
    </ResponsiveContainer>
  );
};
