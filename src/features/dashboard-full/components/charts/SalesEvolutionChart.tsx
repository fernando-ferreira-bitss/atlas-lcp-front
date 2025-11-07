import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { GraficoVendasMes } from '@/shared/types';

interface SalesEvolutionChartProps {
  data: GraficoVendasMes[];
}

export const SalesEvolutionChart = ({ data }: SalesEvolutionChartProps) => {
  const mesesNomes = [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez',
  ];

  // Transforma os dados para o formato do Recharts
  const chartData = data.map((item) => ({
    mes: mesesNomes[item.mes - 1] || item.mes.toString(), // Jan, Fev, Mar...
    vendas: item.valor_vendas / 1000000, // Converte para milhões
    meta: item.meta_vendas / 1000000, // Converte para milhões
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis dataKey="mes" tick={{ fill: '#666', fontSize: 12 }} axisLine={{ stroke: '#ccc' }} />
        <YAxis
          tick={{ fill: '#666', fontSize: 12 }}
          axisLine={{ stroke: '#ccc' }}
          label={{
            value: 'Valor (MM)',
            angle: -90,
            position: 'insideLeft',
            style: { fill: '#666', fontSize: 12 },
          }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
          formatter={(value: number) => `R$ ${value.toFixed(2)}M`}
        />
        <Legend wrapperStyle={{ fontSize: '14px' }} iconType="line" />

        {/* Barras de Vendas */}
        <Bar
          dataKey="vendas"
          fill="#00A86B"
          name="Vendas Realizadas"
          radius={[4, 4, 0, 0]}
          opacity={0.8}
        />

        {/* Linha de Meta */}
        <Line
          dataKey="meta"
          stroke="#003366"
          strokeWidth={3}
          name="Meta"
          dot={{ fill: '#003366', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};
