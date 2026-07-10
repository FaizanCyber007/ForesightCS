import { getHealthSnapshot, getDashboardSummary } from '@/services/api';
import { GlassCard } from '@/components/ui/glass-card';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { MetricCharts } from '@/components/features/metric-charts';
import { BarChart3, TrendingUp, Users, Activity } from 'lucide-react';

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
      bg: 'border-zinc-400/15',
    },
    {
      label: 'Healthy accounts',
      value: snapshot.healthy,
      icon: TrendingUp,
      color: 'text-emerald-300',
      bg: 'border-emerald-400/20',
    },
    {
      label: 'At-Risk accounts',
      value: snapshot.atRisk,
      icon: Activity,
      color: 'text-amber-300',
      bg: 'border-amber-400/20',
    },
    {
      label: 'Critical accounts',
      value: snapshot.critical,
      icon: BarChart3,
      color: 'text-rose-300',
      bg: 'border-rose-400/20',
    },
  ];

  const monthlyTrends = summary.monthlyTrends;
  const latestMonth = monthlyTrends[monthlyTrends.length - 1];
  const prevMonth = monthlyTrends[monthlyTrends.length - 2];
  const churnTrend = latestMonth.churnRisk - prevMonth.churnRisk;
  const retentionTrend = latestMonth.retainedRevenue - prevMonth.retainedRevenue;

  return (
    <PageWrapper className="space-y-8 py-8 lg:py-10">
      {/* Header */}
      <section className="space-y-1">
        <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">Insights</p>
        <h1 className="text-3xl font-semibold tracking-tight text-white">Analytics</h1>
        <p className="text-zinc-400">
          Portfolio health trends, churn velocity, and revenue signals — updated daily.
        </p>
      </section>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {insightCards.map(({ label, value, icon: Icon, color, bg }) => (
          <GlassCard key={label} hoverable className={`flex items-center gap-4 border ${bg}`}>
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${bg} bg-white/4`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <div>
              <p className="text-xs text-zinc-500">{label}</p>
              <p className={`font-mono-numeric text-2xl font-semibold ${color}`}>{value}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Trend highlights */}
      <div className="grid gap-4 sm:grid-cols-2">
        <GlassCard className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Churn risk trend (MoM)</p>
          <p className="font-mono-numeric text-3xl font-semibold text-white">
            {latestMonth.churnRisk}
            <span className="text-base font-normal text-zinc-500">%</span>
          </p>
          <p className={`text-sm ${churnTrend < 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {churnTrend < 0 ? '↓' : '↑'} {Math.abs(churnTrend)}pp vs. last month
          </p>
          <p className="text-xs text-zinc-600">Lower is better. Calculated from weighted signal model.</p>
        </GlassCard>
        <GlassCard className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Retained revenue trend (MoM)</p>
          <p className="font-mono-numeric text-3xl font-semibold text-white">
            {latestMonth.retainedRevenue}
            <span className="text-base font-normal text-zinc-500">%</span>
          </p>
          <p className={`text-sm ${retentionTrend > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {retentionTrend > 0 ? '↑' : '↓'} {Math.abs(retentionTrend)}pp vs. last month
          </p>
          <p className="text-xs text-zinc-600">Share of ARR retained after save-plays and renewals.</p>
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
