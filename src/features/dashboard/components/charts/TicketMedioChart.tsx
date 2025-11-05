import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { formatCurrency } from '@/shared/utils/format';

interface TicketMedioChartProps {
  data: Array<{
    mes: string;
    ticket_proposta: number;
    ticket_venda: number;
  }>;
}

export const TicketMedioChart = ({ data }: TicketMedioChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="mes" />
        <YAxis tickFormatter={(value) => formatCurrency(value, 0)} />
        <Tooltip formatter={(value: number) => formatCurrency(value)} />
        <Legend />
        <Line
          type="monotone"
          dataKey="ticket_proposta"
          name="Ticket Médio Proposta"
          stroke="#3b82f6"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="ticket_venda"
          name="Ticket Médio Venda"
          stroke="#f97316"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
