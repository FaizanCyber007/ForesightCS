import { Bell, Bot, Crown, TrendingUp } from 'lucide-react';

import { DashboardMetrics } from '@/components/features/dashboard-metrics';
import { AIInsights } from '@/components/features/ai-insights';
import { CustomerTable } from '@/components/features/customer-table';
import { MetricCharts } from '@/components/features/metric-charts';
import { GlassCard } from '@/components/ui/glass-card';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { getDashboardSummary, getTopRiskAccounts } from '@/services/api';

export const dynamic = 'force-dynamic';

const headerActions = [
  { icon: Crown, label: 'Saved ARR' },
  { icon: TrendingUp, label: 'Upside' },
  { icon: Bell, label: 'Alerts' },
  { icon: Bot, label: 'AI summary' },
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
              one revenue intelligence surface. Start with the highest-risk
              customers, then work downward with precision.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {headerActions.map(({ icon: Icon, label }) => (
              <GlassCard
                key={label}
                className="flex items-center gap-3 rounded-3xl px-4 py-3 text-sm text-zinc-300"
              >
                <Icon className="h-4 w-4 text-emerald-300" />
                <span>{label}</span>
              </GlassCard>
            ))}
          </div>
        </div>
        <DashboardMetrics metrics={summary.metrics} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <MetricCharts
          trends={summary.monthlyTrends}
          distribution={summary.healthDistribution}
        />
        <AIInsights />
      </section>

      <CustomerTable customers={summary.customers} />
      <section className="grid gap-4 md:grid-cols-3">
        {risks.map((account) => (
          <GlassCard key={account.id} hoverable className="space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
              Priority watch
            </p>
            <h3 className="text-xl font-semibold text-white">
              {account.company}
            </h3>
            <p className="text-sm text-zinc-400">
              {account.name} · {account.health} · {account.churnProbability}%
              churn probability
            </p>
            <p className="text-sm text-zinc-500">
              Owned by {account.owner}. Prioritize outreach before the renewal
              window narrows.
            </p>
          </GlassCard>
        ))}
      </section>
    </PageWrapper>
  );
}
