import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

interface MetaGaugeChartProps {
  percentual: number;
  title: string;
  subtitle?: string;
}

export const MetaGaugeChart = ({ percentual, title, subtitle }: MetaGaugeChartProps) => {
  const value = Math.min(Math.max(percentual, 0), 100);
  const data = [
    { name: 'Atingido', value },
    { name: 'Restante', value: 100 - value },
  ];

  const COLORS = ['#20B187', '#e5e7eb']; // Verde LCP e gray-200

  return (
    <div className="flex flex-col items-center">
      <ResponsiveContainer width="100%" height={140}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            startAngle={180}
            endAngle={0}
            innerRadius={45}
            outerRadius={60}
            paddingAngle={0}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-[-50px] text-center">
        <p className="text-2xl font-bold text-lcp-green">
          {value.toFixed(1)}%
        </p>
        <p className="text-xs font-medium text-lcp-blue">{title}</p>
        {subtitle && <p className="text-[10px] text-lcp-gray">{subtitle}</p>}
      </div>
    </div>
  );
};
