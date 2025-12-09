import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { TopEmpreendimento } from '@/shared/types';

interface VendasPorEmpreendimentoChartProps {
  data: TopEmpreendimento[];
}

export const VendasPorEmpreendimentoChart = ({ data }: VendasPorEmpreendimentoChartProps) => {
  const chartData = data.map((item) => {
    const nome = item.grupo_nome || item.empreendimento_nome || 'Sem nome';
    return {
      nomeCompleto: nome,
      nomeAbreviado: nome.length > 15 ? `${nome.substring(0, 15)}...` : nome,
      propostas: item.total_propostas,
      vendas: item.total_vendas,
    };
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} margin={{ bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="nomeAbreviado"
          angle={-35}
          textAnchor="end"
          height={80}
          interval={0}
          tick={{ fontSize: 10 }}
        />
        <YAxis width={40} tick={{ fontSize: 11 }} />
        <Tooltip
          labelFormatter={(label) => {
            const item = chartData.find((d) => d.nomeAbreviado === label);
            return item?.nomeCompleto || label;
          }}
        />
        <Legend />
        <Bar dataKey="vendas" name="Vendas" fill="#20B187" stackId="a" />
        <Bar dataKey="propostas" name="Propostas" fill="#0B2D5C" stackId="a" />
      </BarChart>
    </ResponsiveContainer>
  );
};
