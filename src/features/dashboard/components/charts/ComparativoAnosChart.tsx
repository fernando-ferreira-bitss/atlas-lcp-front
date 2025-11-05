import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import type { ComparativoAnos } from '@/shared/types';

interface ComparativoAnosChartProps {
  data: ComparativoAnos[];
}

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export const ComparativoAnosChart = ({ data }: ComparativoAnosChartProps) => {
  const chartData = data.map((item) => ({
    mes: MESES[item.mes - 1],
    'Ano Anterior': item.vendas_ano_anterior,
    'Ano Atual': item.vendas_ano_atual,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="mes" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="Ano Anterior" stroke="#f97316" strokeWidth={2} />
        <Line type="monotone" dataKey="Ano Atual" stroke="#1f9f7a" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};
