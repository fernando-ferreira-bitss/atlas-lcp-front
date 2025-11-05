import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import type { EvolucaoTicketMedio } from '@/shared/types';

import { formatCurrency } from '@/shared/utils/format';

interface TicketMedioChartProps {
  data: EvolucaoTicketMedio[];
}

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

const formatThousands = (value: number): string => `R$ ${(value / 1000).toFixed(0)}k`;

export const TicketMedioChart = ({ data }: TicketMedioChartProps) => {
  const chartData = data.map((item) => ({
    mes: MESES[item.mes - 1],
    'Ticket Médio Proposta': item.ticket_medio_proposta,
    'Ticket Médio Venda': item.ticket_medio_venda,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="mes" />
        <YAxis tickFormatter={formatThousands} />
        <Tooltip formatter={(value: number) => formatCurrency(value)} />
        <Legend />
        <Line
          type="monotone"
          dataKey="Ticket Médio Proposta"
          stroke="#0B2D5C"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="Ticket Médio Venda"
          stroke="#20B187"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
