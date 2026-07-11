import { getHealthSnapshot, getDashboardSummary } from '@/services/api';
import { GlassCard } from '@/components/ui/glass-card';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { MetricCharts } from '@/components/features/metric-charts';
import { BarChart3, TrendingUp, Users, Activity, Sparkles, TrendingDown } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  const [snapshot, summary] = await Promise.all([
    getHealthSnapshot(),
    getDashboardSummary(),
  ]);

  const insightCards = [
    {
      label: 'Total accounts tracked',
      value: snapshot.totalAccounts,
      icon: Users,
      color: 'text-zinc-300',
      bg: 'border-zinc-400/10 from-zinc-500/10 to-transparent',
    },
    {
      label: 'Healthy accounts',
      value: snapshot.healthy,
      icon: TrendingUp,
      color: 'text-emerald-300',
      bg: 'border-emerald-400/20 from-emerald-500/10 to-transparent',
    },
    {
      label: 'At-Risk accounts',
      value: snapshot.atRisk,
      icon: Activity,
      color: 'text-amber-300',
      bg: 'border-amber-400/20 from-amber-500/10 to-transparent',
    },
    {
      label: 'Critical accounts',
      value: snapshot.critical,
      icon: BarChart3,
      color: 'text-rose-300',
      bg: 'border-rose-400/20 from-rose-500/10 to-transparent',
    },
  ];

  const monthlyTrends = summary.monthlyTrends;
  const latestMonth = monthlyTrends[monthlyTrends.length - 1];
  const prevMonth = monthlyTrends[monthlyTrends.length - 2];
  const churnTrend = latestMonth.churnRisk - prevMonth.churnRisk;
  
  // ARR retained metric trend calculations
  const retainedTrendValue = latestMonth.retainedRevenue;
  const prevRetainedValue = prevMonth.retainedRevenue;
  const retentionTrend = retainedTrendValue - prevRetainedValue;

  return (
    <PageWrapper className="space-y-8 py-8 lg:py-10">
      {/* Header */}
      <section className="space-y-2">
        <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">Analytics ledger</p>
        <h1 className="text-4xl font-bold tracking-tight text-white">Revenue &amp; Portfolio Analytics</h1>
        <p className="max-w-2xl text-sm text-zinc-400 leading-relaxed">
          Portfolio health metrics, churn risk patterns, and expansion velocities — computed in real-time.
        </p>
      </section>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {insightCards.map(({ label, value, icon: Icon, color, bg }) => (
          <GlassCard key={label} hoverable className="flex items-center gap-4 group">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/5 bg-gradient-to-b ${bg} ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">{label}</p>
              <p className={`font-mono-numeric text-3xl font-bold tracking-tight mt-0.5 ${color}`}>{value}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Trend highlights */}
      <div className="grid gap-4 sm:grid-cols-2">
        <GlassCard className="space-y-4 relative overflow-hidden group">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500/20 via-transparent to-transparent" />
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-semibold">Average portfolio churn risk</p>
            <span className={`flex items-center gap-1 text-xs font-semibold rounded-full px-2 py-0.5 ${
              churnTrend <= 0 ? 'bg-emerald-500/10 text-emerald-300' : 'bg-rose-500/10 text-rose-300'
            }`}>
              {churnTrend <= 0 ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
              {churnTrend <= 0 ? '' : '+'}{churnTrend}pts
            </span>
          </div>
          <div className="space-y-1">
            <p className="font-mono-numeric text-4xl font-bold tracking-tight text-white">
              {latestMonth.churnRisk}%
            </p>
            <p className="text-xs text-zinc-500 leading-normal">
              Portfolio churn pressure is {churnTrend <= 0 ? 'declining' : 'increasing'} compared to last month.
            </p>
          </div>
        </GlassCard>

        <GlassCard className="space-y-4 relative overflow-hidden group">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-500/20 via-transparent to-transparent" />
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-semibold">Retained ARR Percentage</p>
            <span className={`flex items-center gap-1 text-xs font-semibold rounded-full px-2 py-0.5 ${
              retentionTrend >= 0 ? 'bg-emerald-500/10 text-emerald-300' : 'bg-rose-500/10 text-rose-300'
            }`}>
              {retentionTrend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {retentionTrend >= 0 ? '+' : ''}{retentionTrend}pts
            </span>
          </div>
          <div className="space-y-1">
            <p className="font-mono-numeric text-4xl font-bold tracking-tight text-white">
              {latestMonth.retainedRevenue}%
            </p>
            <p className="text-xs text-zinc-500 leading-normal">
              Share of ARR successfully retained after playbooks and renewal contracts.
            </p>
          </div>
        </GlassCard>
      </div>

      {/* Charts */}
      <MetricCharts
        trends={summary.monthlyTrends}
        distribution={summary.healthDistribution}
      />
    </PageWrapper>
  );
}
