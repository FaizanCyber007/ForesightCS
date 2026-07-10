import { getCustomers } from '@/services/api';
import { CustomerTable } from '@/components/features/customer-table';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { GlassCard } from '@/components/ui/glass-card';
import { Users, TrendingDown, TrendingUp, ShieldAlert } from 'lucide-react';

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
      bg: 'bg-zinc-400/10 border-zinc-400/20',
    },
    {
      label: 'Healthy',
      value: healthy,
      icon: TrendingUp,
      color: 'text-emerald-300',
      bg: 'bg-emerald-400/10 border-emerald-400/20',
    },
    {
      label: 'At risk',
      value: atRisk,
      icon: ShieldAlert,
      color: 'text-amber-300',
      bg: 'bg-amber-400/10 border-amber-400/20',
    },
    {
      label: 'Critical',
      value: critical,
      icon: TrendingDown,
      color: 'text-rose-300',
      bg: 'bg-rose-400/10 border-rose-400/20',
    },
  ];

  return (
    <PageWrapper className="space-y-8 py-8 lg:py-10">
      <section className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">Dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Accounts</h1>
          <p className="mt-1.5 text-zinc-400">
            Your complete customer portfolio — filter, sort, and drill into any account.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {summaryCards.map(({ label, value, icon: Icon, color, bg }) => (
            <GlassCard key={label} hoverable className={`flex items-center gap-4 border ${bg}`}>
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bg}`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <div>
                <p className="text-xs text-zinc-500">{label}</p>
                <p className={`font-mono-numeric text-2xl font-semibold ${color}`}>{value}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      <CustomerTable customers={customers} />
    </PageWrapper>
  );
}
