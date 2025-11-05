import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import type { ConversaoPorEmpreendimento } from '@/shared/types';

interface ConversaoPorEmpreendimentoChartProps {
  data: ConversaoPorEmpreendimento[];
}

export const ConversaoPorEmpreendimentoChart = ({ data }: ConversaoPorEmpreendimentoChartProps) => {
  const chartData = data.map((item) => ({
    nome: item.empreendimento_nome.length > 30
      ? `${item.empreendimento_nome.substring(0, 30)}...`
      : item.empreendimento_nome,
    taxa_conversao: item.taxa_conversao,
    total_propostas: item.total_propostas,
    total_vendas: item.total_vendas,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" unit="%" />
        <YAxis dataKey="nome" type="category" width={150} />
        <Tooltip
          formatter={(value: number) => `${value.toFixed(1)}%`}
          labelFormatter={(label: string) => {
            const item = chartData.find((d) => d.nome === label);
            return item
              ? `${label}\nPropostas: ${item.total_propostas} | Vendas: ${item.total_vendas}`
              : label;
          }}
        />
        <Bar dataKey="taxa_conversao" name="Taxa de Conversão" fill="#0B2D5C" />
      </BarChart>
    </ResponsiveContainer>
  );
};
