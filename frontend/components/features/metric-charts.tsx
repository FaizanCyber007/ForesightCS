'use client';

import { GlassCard } from '@/components/ui/glass-card';
import type { HealthDistribution, MonthlyTrend } from '@/services/api';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  Pie,
  PieChart,
} from 'recharts';

export function MetricCharts({
  trends,
  distribution,
}: {
  trends: MonthlyTrend[];
  distribution: HealthDistribution[];
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.5fr_0.9fr]">
      <GlassCard className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
              Signal trends
            </p>
            <h3 className="mt-2 text-xl font-semibold text-white">
              Revenue Momentum (ARR)
            </h3>
          </div>
        </div>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={trends}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRetained" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpansion" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="month" 
                stroke="#52525b" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke="#52525b" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(val) => `$${val}k`} 
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0a0a0a',
                  borderColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '16px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                }}
                itemStyle={{ color: '#fff' }}
              />
              <Area
                type="monotone"
                dataKey="retainedRevenue"
                name="Retained ARR"
                stroke="#34d399"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRetained)"
              />
              <Area
                type="monotone"
                dataKey="expansionRevenue"
                name="Expansion ARR"
                stroke="#a78bfa"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorExpansion)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
      
      <GlassCard className="space-y-5">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
            Health mix
          </p>
          <h3 className="mt-2 text-xl font-semibold text-white">
            Account state distribution
          </h3>
        </div>
        <div className="flex items-center justify-center h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={distribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {distribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#0a0a0a',
                  borderColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '16px',
                }}
                itemStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {distribution.map((item) => (
            <div key={item.label} className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-zinc-400">{item.label}</span>
              </div>
              <p className="text-lg font-semibold text-white">{item.value}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
