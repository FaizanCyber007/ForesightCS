import { Bell, Bot, Crown, TrendingUp } from 'lucide-react';

import { DashboardMetrics } from '@/components/features/dashboard-metrics';
import { AIInsights } from '@/components/features/ai-insights';
import { CustomerTable } from '@/components/features/customer-table';
import { MetricCharts } from '@/components/features/metric-charts';
import { SignalFeed } from '@/components/features/signal-feed';
import { GlassCard } from '@/components/ui/glass-card';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { getDashboardSummary, getTopRiskAccounts } from '@/services/api';

export const dynamic = 'force-dynamic';

const headerActions = [
  { icon: Crown, label: 'Saved ARR', value: '$1.84M' },
  { icon: TrendingUp, label: 'Expansion', value: '$420K' },
  { icon: Bell, label: 'Alerts', value: '3' },
  { icon: Bot, label: 'AI summary', value: 'Ready' },
];

export default async function DashboardPage() {
  const [summary, risks] = await Promise.all([
    getDashboardSummary(),
    getTopRiskAccounts(3),
  ]);

  return (
    <PageWrapper className="space-y-8 py-8 lg:py-10">
      <section className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">
              Command Center
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">
              Predictive account health
            </h1>
            <p className="mt-3 max-w-2xl text-zinc-400">
              Live accounts, risk clusters, and expansion signals captured in
              one revenue intelligence surface.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {headerActions.map(({ icon: Icon, label, value }) => (
              <GlassCard
                key={label}
                hoverable
                className="flex items-center gap-3 rounded-3xl px-4 py-3 text-sm"
              >
                <Icon className="h-4 w-4 text-emerald-300" />
                <div>
                  <p className="text-zinc-500 text-xs">{label}</p>
                  <p className="font-mono-numeric font-semibold text-white text-sm">{value}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
        <DashboardMetrics metrics={summary.metrics} />
      </section>

      {/* Charts + Signal Feed */}
      <section className="grid gap-4 xl:grid-cols-[1fr_340px]">
        <MetricCharts
          trends={summary.monthlyTrends}
          distribution={summary.healthDistribution}
        />
        <div className="space-y-4">
          <AIInsights />
          <SignalFeed />
        </div>
      </section>

      {/* Customer Table */}
      <CustomerTable customers={summary.customers} />

      {/* Priority watch */}
      <section className="grid gap-4 md:grid-cols-3">
        {risks.map((account) => (
          <GlassCard key={account.id} hoverable className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
              Priority watch
            </p>
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xl font-semibold text-white">
                {account.company}
              </h3>
              <span
                className={
                  account.churnProbability >= 60
                    ? 'rounded-full bg-rose-500/20 px-2 py-1 text-xs text-rose-300 border border-rose-500/30'
                    : 'rounded-full bg-amber-500/20 px-2 py-1 text-xs text-amber-300 border border-amber-500/30'
                }
              >
                {account.churnProbability}% risk
              </span>
            </div>
            <p className="text-sm text-zinc-400">
              {account.name} · {account.health} health
            </p>
            <p className="text-sm text-zinc-500">
              Owned by <span className="text-zinc-300">{account.owner}</span>. Renewal{' '}
              {new Date(account.renewalDate).toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric',
              })}
              .
            </p>
          </GlassCard>
        ))}
      </section>
    </PageWrapper>
  );
}
