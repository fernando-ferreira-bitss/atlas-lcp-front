import { useState } from 'react';
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

import { formatCurrency } from '@/shared/utils/format';

interface UnifiedSalesChartProps {
  data: GraficoVendasMes[];
}

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

const SERIES_LABELS: Record<string, string> = {
  realizadoVGV: 'Realizado VGV R$',
  distratoVGV: 'Distrato VGV R$',
  metaVGV: 'Meta VGV R$',
  realizadoLotes: 'Realizado #lotes',
  distratoLotes: 'Distrato #lotes',
  metaLotes: 'Meta #lotes',
};

export const UnifiedSalesChart = ({ data }: UnifiedSalesChartProps) => {
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set());

  const chartData = data
    .sort((a, b) => a.mes - b.mes)
    .map((item) => ({
      mes: MESES[item.mes - 1],
      // Valores em R$
      realizadoVGV: item.valor_vendas,
      distratoVGV: item.valor_distratos,
      metaVGV: item.valor_meta_vendas,
      // Quantidades
      realizadoLotes: item.total_vendas,
      distratoLotes: item.total_distratos,
      metaLotes: item.qtd_meta_vendas,
    }));

  const handleLegendClick = (dataKey: string) => {
    setHiddenSeries((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(dataKey)) {
        newSet.delete(dataKey);
      } else {
        newSet.add(dataKey);
      }
      return newSet;
    });
  };

  const isHidden = (dataKey: string) => hiddenSeries.has(dataKey);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="mes"
          className="text-xs"
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
        />
        {/* Eixo Y esquerdo - Valores em R$ */}
        <YAxis
          yAxisId="left"
          className="text-xs"
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
          tickFormatter={(value) => formatCurrency(value, 0)}
        />
        {/* Eixo Y direito - Quantidades (#lotes) */}
        <YAxis
          yAxisId="right"
          orientation="right"
          className="text-xs"
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            fontSize: '11px',
          }}
          formatter={(value: number, name: string) => {
            // Formatar como moeda para VGV
            const isVGV = name.includes('VGV');
            const formattedValue = isVGV ? formatCurrency(value) : value;
            return [formattedValue, SERIES_LABELS[name] || name];
          }}
        />
        <Legend
          wrapperStyle={{ paddingTop: '10px', fontSize: '10px', cursor: 'pointer' }}
          onClick={(e) => handleLegendClick(e.dataKey as string)}
          formatter={(value) => SERIES_LABELS[value] || value}
        />

        {/* Barras - Eixo Esquerdo (R$) */}
        <Bar
          yAxisId="left"
          dataKey="realizadoVGV"
          fill="#20B187"
          radius={[4, 4, 0, 0]}
          name="realizadoVGV"
          hide={isHidden('realizadoVGV')}
        />
        <Bar
          yAxisId="left"
          dataKey="metaVGV"
          fill="#0B2D5C"
          radius={[4, 4, 0, 0]}
          name="metaVGV"
          hide={isHidden('metaVGV')}
        />
        <Bar
          yAxisId="left"
          dataKey="distratoVGV"
          fill="#EF4444"
          radius={[4, 4, 0, 0]}
          name="distratoVGV"
          hide={isHidden('distratoVGV')}
        />

        {/* Linhas - Eixo Direito (Quantidade #lotes) */}
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="realizadoLotes"
          stroke="#10B981"
          strokeWidth={2}
          dot={{ r: 3 }}
          name="realizadoLotes"
          hide={isHidden('realizadoLotes')}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="metaLotes"
          stroke="#3B82F6"
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={{ r: 3 }}
          name="metaLotes"
          hide={isHidden('metaLotes')}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="distratoLotes"
          stroke="#F97316"
          strokeWidth={2}
          dot={{ r: 3 }}
          name="distratoLotes"
          hide={isHidden('distratoLotes')}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};
