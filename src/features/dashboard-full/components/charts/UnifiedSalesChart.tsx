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

import type { ComparativoAnos } from '@/shared/types';

import { formatCurrency } from '@/shared/utils/format';

interface UnifiedSalesChartProps {
  vendasMesData: Array<{
    mes: number;
    total_vendas: number;
    valor_vendas: number;
    meta_vendas: number;
  }>;
  comparativoData: ComparativoAnos[];
}

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export const UnifiedSalesChart = ({ vendasMesData, comparativoData }: UnifiedSalesChartProps) => {
  // Combinar os dados - pegar apenas os meses que têm dados reais
  const mesesComDados = new Set([
    ...vendasMesData.map((v) => v.mes),
    ...comparativoData.map((c) => c.mes),
  ]);

  const chartData = Array.from(mesesComDados)
    .sort((a, b) => a - b)
    .map((mesNum) => {
      const vendaMes = vendasMesData.find((v) => v.mes === mesNum);
      const comparativo = comparativoData.find((c) => c.mes === mesNum);

      return {
        mes: MESES[mesNum - 1],
        meta: vendaMes?.meta_vendas || 0,
        realizado: vendaMes?.valor_vendas || 0,
        anoAnterior: comparativo?.vendas_ano_anterior || 0, // Quantidade
        anoAtual: comparativo?.vendas_ano_atual || 0, // Quantidade
      };
    });

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
        {/* Eixo Y direito - Quantidades */}
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
            const labels: Record<string, string> = {
              meta: 'Meta (R$)',
              realizado: 'Realizado (R$)',
              anoAnterior: 'Ano Anterior (Qtd)',
              anoAtual: 'Ano Atual (Qtd)',
            };
            // Only format as currency for meta and realizado
            const formattedValue = (name === 'meta' || name === 'realizado')
              ? formatCurrency(value)
              : value;
            return [formattedValue, labels[name] || name];
          }}
        />
        <Legend
          wrapperStyle={{ paddingTop: '10px', fontSize: '10px' }}
          formatter={(value) => {
            const labels: Record<string, string> = {
              meta: 'Meta',
              realizado: 'Realizado',
              anoAnterior: 'Ano Anterior',
              anoAtual: 'Ano Atual',
            };
            return labels[value] || value;
          }}
        />
        {/* Barras para Meta e Realizado - Eixo Esquerdo (R$) */}
        <Bar yAxisId="left" dataKey="realizado" fill="#20B187" radius={[4, 4, 0, 0]} name="Realizado (R$)" />
        <Bar yAxisId="left" dataKey="meta" fill="#0B2D5C" radius={[4, 4, 0, 0]} name="Meta (R$)" />
        {/* Linhas para comparativo de anos - Eixo Direito (Quantidade) */}
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="anoAnterior"
          stroke="#F45B32"
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={{ r: 2 }}
          name="Ano Anterior (Qtd)"
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="anoAtual"
          stroke="#9333EA"
          strokeWidth={2}
          dot={{ r: 2 }}
          name="Ano Atual (Qtd)"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};
