import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import type { ConversaoPorEmpreendimento } from '@/shared/types';

interface ConversaoPorEmpreendimentoChartProps {
  data: ConversaoPorEmpreendimento[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      nomeCompleto: string;
      taxa_conversao: number;
      total_propostas: number;
      total_vendas: number;
    };
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;

  return (
    <div className="max-w-[200px] rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
      <p className="mb-1 break-words text-xs font-semibold text-gray-900">{data.nomeCompleto}</p>
      <p className="text-xs text-gray-600">Taxa de Conversão: {data.taxa_conversao.toFixed(1)}%</p>
      <p className="text-xs text-gray-600">Propostas: {data.total_propostas}</p>
      <p className="text-xs text-gray-600">Vendas: {data.total_vendas}</p>
    </div>
  );
};

export const ConversaoPorEmpreendimentoChart = ({ data }: ConversaoPorEmpreendimentoChartProps) => {
  const chartData = data.map((item) => {
    const nome = item.grupo_nome || item.empreendimento_nome || 'Sem nome';
    return {
      nomeCompleto: nome,
      nome: nome.length > 15 ? `${nome.substring(0, 15)}...` : nome,
      taxa_conversao: item.taxa_conversao,
      total_propostas: item.total_propostas,
      total_vendas: item.total_vendas,
    };
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" unit="%" tick={{ fontSize: 11 }} />
        <YAxis dataKey="nome" type="category" width={100} tick={{ fontSize: 10 }} />
        <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 100 }} />
        <Bar dataKey="taxa_conversao" name="Taxa de Conversão" fill="#0B2D5C" />
      </BarChart>
    </ResponsiveContainer>
  );
};
