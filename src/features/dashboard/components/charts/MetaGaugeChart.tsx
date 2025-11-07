import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

interface MetaGaugeChartProps {
  percentual: number;
  title: string;
  subtitle?: string;
  isFullscreen?: boolean;
}

export const MetaGaugeChart = ({ percentual, title, subtitle, isFullscreen = false }: MetaGaugeChartProps) => {
  const value = Math.min(Math.max(percentual, 0), 100);
  const data = [
    { name: 'Atingido', value },
    { name: 'Restante', value: 100 - value },
  ];

  const COLORS = ['#20B187', '#e5e7eb']; // Verde LCP e gray-200

  // Aumenta 40% em fullscreen
  const minHeight = isFullscreen ? 224 : 160; // 160 * 1.4 = 224
  const innerRadius = isFullscreen ? 70 : 50; // 50 * 1.4 = 70
  const outerRadius = isFullscreen ? 105 : 75; // 75 * 1.4 = 105
  const marginTop = isFullscreen ? '-mt-11' : '-mt-8'; // ajustado proporcionalmente

  return (
    <div className="flex h-full w-full flex-col items-center justify-center py-2">
      <ResponsiveContainer width="100%" height="100%" minHeight={minHeight}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="60%"
            startAngle={180}
            endAngle={0}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={0}
            dataKey="value"
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={COLORS[entry.name === 'Atingido' ? 0 : 1]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className={`${marginTop} text-center`}>
        <p className={`font-bold text-lcp-green ${isFullscreen ? 'text-4xl lg:text-5xl' : 'text-2xl sm:text-3xl lg:text-4xl'}`}>
          {value.toFixed(1)}%
        </p>
        <p className={`font-semibold text-lcp-blue ${isFullscreen ? 'text-base lg:text-lg' : 'text-xs sm:text-sm lg:text-base'}`}>{title}</p>
        {subtitle && <p className={`text-lcp-gray ${isFullscreen ? 'text-sm lg:text-base' : 'text-[10px] sm:text-xs lg:text-sm'}`}>{subtitle}</p>}
      </div>
    </div>
  );
};
