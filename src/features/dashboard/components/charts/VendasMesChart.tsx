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

import { formatCurrency } from '@/shared/utils/format';

interface VendasMesChartProps {
  data: Array<{
    mes: number;
    total_vendas: number;
    valor_vendas: number;
    meta_vendas: number;
  }>;
}

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

export const VendasMesChart = ({ data }: VendasMesChartProps) => {
  const chartData = data.map((item) => ({
    mes: mesesNomes[item.mes - 1],
    vendas: item.valor_vendas,
    meta: item.meta_vendas,
    quantidade: item.total_vendas,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="mes"
          className="text-xs"
          tick={{ fill: 'hsl(var(--muted-foreground))' }}
        />
        <YAxis
          className="text-xs"
          tick={{ fill: 'hsl(var(--muted-foreground))' }}
          tickFormatter={(value) => formatCurrency(value, 0)}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
          }}
          formatter={(value: number, name: string) => {
            if (name === 'quantidade') return [value, 'Qtd Vendas'];
            return [formatCurrency(value), name === 'vendas' ? 'Realizado' : 'Meta'];
          }}
        />
        <Legend
          wrapperStyle={{ paddingTop: '20px' }}
          formatter={(value) => {
            if (value === 'vendas') return 'Vendas Realizadas';
            if (value === 'meta') return 'Meta';
            return value;
          }}
        />
        <Bar dataKey="vendas" fill="#1f9f7a" radius={[8, 8, 0, 0]} />
        <Bar dataKey="meta" fill="#0b2d5c" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};
