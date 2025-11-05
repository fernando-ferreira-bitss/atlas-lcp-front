import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { formatCurrency } from '@/shared/utils/format';

interface ComparativoAnosChartProps {
  data: Array<{
    mes: string;
    vendas_2024: number;
    vendas_2025: number;
    valor_2024: number;
    valor_2025: number;
  }>;
}

export const ComparativoAnosChart = ({ data }: ComparativoAnosChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="mes" />
        <YAxis />
        <Tooltip
          formatter={(value: number, name: string) => {
            if (name.includes('vendas')) {
              return [value, name];
            }
            return [formatCurrency(value), name];
          }}
        />
        <Legend />
        <Bar dataKey="vendas_2024" name="Vendas 2024" fill="#3b82f6" />
        <Bar dataKey="vendas_2025" name="Vendas 2025" fill="#f97316" />
      </BarChart>
    </ResponsiveContainer>
  );
};
