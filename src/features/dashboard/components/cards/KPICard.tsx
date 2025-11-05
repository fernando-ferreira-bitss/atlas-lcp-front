import { LucideIcon } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
}

export const KPICard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend = 'neutral',
  trendValue,
  className,
}: KPICardProps) => (
  <Card className={cn('border-none shadow-md', className)}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-lcp-gray">{title}</CardTitle>
      {Icon && <Icon className="h-4 w-4 text-lcp-gray" />}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-lcp-blue">{value}</div>
      {subtitle && <p className="text-xs text-lcp-gray">{subtitle}</p>}
      {trendValue && (
        <p
          className={cn('mt-1 text-xs font-medium', {
            'text-lcp-green': trend === 'up',
            'text-lcp-orange': trend === 'down',
            'text-lcp-gray': trend === 'neutral',
          })}
        >
          {trend === 'up' && '↑ '}
          {trend === 'down' && '↓ '}
          {trendValue}
        </p>
      )}
    </CardContent>
  </Card>
);
