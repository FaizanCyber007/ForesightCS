import { GlassCard } from '@/components/ui/glass-card';
import type { HealthDistribution, MonthlyTrend } from '@/services/api';

export function MetricCharts({
  trends,
  distribution,
}: {
  trends: MonthlyTrend[];
  distribution: HealthDistribution[];
}) {
  const highestTrend = Math.max(
    ...trends.map((trend) =>
      Math.max(trend.churnRisk, trend.retainedRevenue, trend.expansionRevenue)
    )
  );
  const highestDistribution = Math.max(
    ...distribution.map((item) => item.value),
    1
  );

  return (
    <div className="grid gap-4 xl:grid-cols-[1.5fr_0.9fr]">
      <GlassCard className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
              Signal trends
            </p>
            <h3 className="mt-2 text-xl font-semibold text-white">
              Momentum across the quarter
            </h3>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { key: 'churnRisk', label: 'Risk' },
            { key: 'retainedRevenue', label: 'Retained' },
            { key: 'expansionRevenue', label: 'Expansion' },
          ].map((series) => (
            <div
              key={series.key}
              className="space-y-3 rounded-3xl border border-white/10 bg-black/20 p-4"
            >
              <p className="text-sm text-zinc-400">{series.label}</p>
              <div className="flex h-48 items-end gap-2">
                {trends.map((trend) => {
                  const value = trend[
                    series.key as keyof MonthlyTrend
                  ] as number;
                  const height = Math.max(16, (value / highestTrend) * 100);
                  return (
                    <div
                      key={`${series.label}-${trend.month}`}
                      className="flex flex-1 flex-col items-center gap-2"
                    >
                      <div className="w-full rounded-2xl bg-white/5 p-1">
                        <div
                          className="rounded-2xl bg-gradient-to-t from-emerald-400 to-violet-400"
                          style={{ height: `${height}%` }}
                        />
                      </div>
                      <span className="text-xs text-zinc-500">
                        {trend.month}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
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
        <div className="space-y-4">
          {distribution.map((item) => (
            <div key={item.label} className="space-y-2">
              <div className="flex items-center justify-between text-sm text-zinc-400">
                <span>{item.label}</span>
                <span>{item.value}</span>
              </div>
              <div className="h-3 rounded-full bg-white/5">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(item.value / highestDistribution) * 100}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
