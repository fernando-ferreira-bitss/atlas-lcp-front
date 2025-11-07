import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { ConversaoPorEmpreendimento } from '@/shared/types';

interface SalesByPropertyFunnelChartProps {
  data: ConversaoPorEmpreendimento[];
}

const COLORS = ['#003366', '#00A86B', '#0066CC', '#33AA77', '#0055AA'];

export const SalesByPropertyFunnelChart = ({ data }: SalesByPropertyFunnelChartProps) => {
  // Ordena por total de vendas (decrescente) para efeito funil
  const sortedData = [...data].sort((a, b) => b.total_vendas - a.total_vendas);

  const chartData = sortedData.map((item, index) => ({
    nome:
      item.empreendimento_nome.length > 20
        ? `${item.empreendimento_nome.substring(0, 20)}...`
        : item.empreendimento_nome,
    vendas: item.total_vendas,
    conversao: item.taxa_conversao,
    color: COLORS[index % COLORS.length],
  }));

  // Custom label para mostrar vendas + taxa de conversão
  const renderCustomLabel = (props: {
    x?: string | number;
    y?: string | number;
    width?: string | number;
    value?: string | number;
    index?: string | number;
  }) => {
    const { x, y, width, value, index } = props;
    if (
      x === undefined ||
      y === undefined ||
      width === undefined ||
      value === undefined ||
      index === undefined
    ) {
      return null;
    }
    const xNum = typeof x === 'string' ? parseFloat(x) : x;
    const yNum = typeof y === 'string' ? parseFloat(y) : y;
    const widthNum = typeof width === 'string' ? parseFloat(width) : width;
    const valueNum = typeof value === 'string' ? parseFloat(value) : value;
    const indexNum = typeof index === 'string' ? parseInt(index, 10) : index;

    const item = chartData[indexNum];
    if (!item) return null;

    return (
      <text
        x={xNum + widthNum + 10}
        y={yNum + 12}
        fill="#333"
        fontSize={12}
        fontWeight="bold"
        textAnchor="start"
      >
        {valueNum} vendas ({item.conversao.toFixed(1)}%)
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 10, right: 120, left: 10, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" horizontal vertical={false} />
        <XAxis type="number" hide />
        <YAxis type="category" dataKey="nome" tick={{ fill: '#666', fontSize: 11 }} width={150} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
          formatter={(value: number, name: string, props) => {
            if (name === 'vendas' && props?.payload?.conversao) {
              return [
                `${value} vendas (${props.payload.conversao.toFixed(1)}% conversão)`,
                'Total',
              ];
            }
            return value;
          }}
        />

        <Bar dataKey="vendas" radius={[0, 4, 4, 0]}>
          {chartData.map((entry) => (
            <Cell key={entry.nome} fill={entry.color} />
          ))}
          <LabelList dataKey="vendas" content={renderCustomLabel} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
