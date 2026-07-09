'use client';

import { motion } from 'framer-motion';
import { ArrowUpDown, ChevronDown, Search } from 'lucide-react';
import { useMemo, useState, useTransition } from 'react';

import { Badge } from '@/components/ui/badge';
import { GlassCard } from '@/components/ui/glass-card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/cn';
import type { CustomerRecord, HealthStatus } from '@/services/api';

type SortKey =
  | 'company'
  | 'health'
  | 'churnProbability'
  | 'monthlyRecurringRevenue'
  | 'renewalDate';

const healthOrder: Record<HealthStatus, number> = {
  Healthy: 0,
  'At-Risk': 1,
  Critical: 2,
};

export function CustomerTable({ customers }: { customers: CustomerRecord[] }) {
  const [query, setQuery] = useState('');
  const [healthFilter, setHealthFilter] = useState<HealthStatus | 'All'>('All');
  const [sortKey, setSortKey] = useState<SortKey>('churnProbability');
  const [ascending, setAscending] = useState(false);
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return customers
      .filter((customer) =>
        healthFilter === 'All' ? true : customer.health === healthFilter
      )
      .filter((customer) => {
        if (!normalized) return true;
        return [
          customer.company,
          customer.name,
          customer.owner,
          customer.plan,
          customer.segment,
        ].some((field) => field.toLowerCase().includes(normalized));
      })
      .sort((a, b) => {
        let comparison = 0;

        if (sortKey === 'health') {
          comparison = healthOrder[a.health] - healthOrder[b.health];
        } else if (sortKey === 'renewalDate') {
          comparison =
            new Date(a.renewalDate).getTime() -
            new Date(b.renewalDate).getTime();
        } else {
          comparison =
            (a[sortKey] as number | string) > (b[sortKey] as number | string)
              ? 1
              : -1;
        }

        return ascending ? comparison : -comparison;
      });
  }, [customers, healthFilter, query, sortKey, ascending]);

  return (
    <GlassCard className="space-y-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
            Accounts
          </p>
          <h3 className="mt-2 text-xl font-semibold text-white">
            Account intelligence table
          </h3>
        </div>
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              className="pl-10"
              placeholder="Search accounts"
              value={query}
              onChange={(event) =>
                startTransition(() => setQuery(event.target.value))
              }
            />
          </label>
          <select
            className="h-11 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none"
            value={healthFilter}
            onChange={(event) =>
              setHealthFilter(event.target.value as HealthStatus | 'All')
            }
          >
            <option className="bg-black" value="All">
              All health
            </option>
            <option className="bg-black" value="Healthy">
              Healthy
            </option>
            <option className="bg-black" value="At-Risk">
              At-Risk
            </option>
            <option className="bg-black" value="Critical">
              Critical
            </option>
          </select>
          <button
            className="inline-flex h-11 items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-zinc-200 transition hover:bg-white/10"
            onClick={() => setAscending((value) => !value)}
          >
            <ArrowUpDown className="h-4 w-4" />
            {ascending ? 'Asc' : 'Desc'}
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-white/10">
        <table className="min-w-full divide-y divide-white/10 text-left text-sm">
          <thead className="bg-white/4 text-zinc-400">
            <tr>
              {[
                ['company', 'Account'],
                ['health', 'Health'],
                ['churnProbability', 'Risk'],
                ['monthlyRecurringRevenue', 'MRR'],
                ['renewalDate', 'Renewal'],
              ].map(([key, label]) => (
                <th key={key} className="px-4 py-4 font-medium">
                  <button
                    className="inline-flex items-center gap-2"
                    onClick={() => {
                      setSortKey(key as SortKey);
                      setAscending((value) =>
                        sortKey === key ? !value : false
                      );
                    }}
                  >
                    {label}
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 transition-transform',
                        sortKey === key && ascending && 'rotate-180'
                      )}
                    />
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <motion.tbody
            className="divide-y divide-white/10 bg-black/20"
            initial={false}
            animate={{ opacity: isPending ? 0.85 : 1 }}
          >
            {filtered.map((customer) => (
              <motion.tr
                key={customer.id}
                layout
                className="cursor-pointer transition-colors hover:bg-white/4"
                whileHover={{ scale: 1.002 }}
              >
                <td className="px-4 py-4">
                  <div>
                    <p className="font-medium text-white">{customer.company}</p>
                    <p className="text-xs text-zinc-500">
                      {customer.name} · {customer.segment}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <Badge
                    variant={
                      customer.health === 'Healthy'
                        ? 'success'
                        : customer.health === 'At-Risk'
                          ? 'warning'
                          : 'danger'
                    }
                  >
                    {customer.health}
                  </Badge>
                </td>
                <td className="px-4 py-4 text-zinc-300">
                  {customer.churnProbability}%
                </td>
                <td className="px-4 py-4 text-zinc-300">
                  ${customer.monthlyRecurringRevenue.toLocaleString()}
                </td>
                <td className="px-4 py-4 text-zinc-300">
                  {new Date(customer.renewalDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </div>
      <p className="text-sm text-zinc-500">
        Showing {filtered.length} of {customers.length} accounts.
      </p>
    </GlassCard>
  );
}
