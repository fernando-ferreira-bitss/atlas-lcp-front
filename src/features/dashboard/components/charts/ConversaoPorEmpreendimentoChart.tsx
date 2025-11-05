import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface ConversaoPorEmpreendimentoChartProps {
  data: Array<{
    nome: string;
    taxa_conversao: number;
    total_propostas: number;
    total_vendas: number;
  }>;
}

export const ConversaoPorEmpreendimentoChart = ({ data }: ConversaoPorEmpreendimentoChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" unit="%" />
        <YAxis dataKey="nome" type="category" width={150} />
        <Tooltip
          formatter={(value: number) => `${value.toFixed(1)}%`}
          labelFormatter={(label: string) => {
            const item = data.find((d) => d.nome === label);
            return item
              ? `${label}\nPropostas: ${item.total_propostas} | Vendas: ${item.total_vendas}`
              : label;
          }}
        />
        <Bar dataKey="taxa_conversao" name="Taxa de Conversão" fill="#22c55e" />
      </BarChart>
    </ResponsiveContainer>
  );
};
