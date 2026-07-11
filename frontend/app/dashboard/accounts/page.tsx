import { getCustomers } from '@/services/api';
import { CustomerTable } from '@/components/features/customer-table';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { GlassCard } from '@/components/ui/glass-card';
import { Users, TrendingDown, TrendingUp, ShieldAlert, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AccountsPage() {
  const customers = await getCustomers();

  const healthy = customers.filter((c) => c.health === 'Healthy').length;
  const atRisk = customers.filter((c) => c.health === 'At-Risk').length;
  const critical = customers.filter((c) => c.health === 'Critical').length;

  const summaryCards = [
    {
      label: 'Total accounts',
      value: customers.length,
      icon: Users,
      color: 'text-zinc-300',
      bg: 'border-zinc-400/10 from-zinc-500/10 to-transparent',
    },
    {
      label: 'Healthy',
      value: healthy,
      icon: TrendingUp,
      color: 'text-emerald-300',
      bg: 'border-emerald-400/20 from-emerald-500/10 to-transparent',
    },
    {
      label: 'At risk',
      value: atRisk,
      icon: ShieldAlert,
      color: 'text-amber-300',
      bg: 'border-amber-400/20 from-amber-500/10 to-transparent',
    },
    {
      label: 'Critical',
      value: critical,
      icon: TrendingDown,
      color: 'text-rose-300',
      bg: 'border-rose-400/20 from-rose-500/10 to-transparent',
    },
  ];

  return (
    <PageWrapper className="space-y-8 py-8 lg:py-10">
      <section className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-zinc-500 font-semibold">Portfolio directory</p>
          <h1 className="text-4xl font-bold tracking-tight text-white mt-1">Customer Accounts</h1>
          <p className="max-w-xl text-sm text-zinc-400 leading-relaxed mt-1">
            Browse and filter your complete accounts directory, check current churn status metrics, and drill down into individual profiles.
          </p>
        </div>

        {/* Summary grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {summaryCards.map(({ label, value, icon: Icon, color, bg }) => (
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
      </section>

      <CustomerTable customers={customers} />
    </PageWrapper>
  );
}
