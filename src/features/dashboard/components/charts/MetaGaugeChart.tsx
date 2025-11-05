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

  const COLORS = ['#1f9f7a', '#e5e7eb']; // Verde e gray-200

  return (
    <div className="flex flex-col items-center">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            startAngle={180}
            endAngle={0}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={0}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-[-60px] text-center">
        <p className="text-3xl font-bold" style={{ color: '#1f9f7a' }}>
          {value.toFixed(1)}%
        </p>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
    </div>
  );
};
