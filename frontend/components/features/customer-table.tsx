'use client';

import { motion } from 'framer-motion';
import { ArrowUpDown, ChevronDown, ChevronUp, MoreHorizontal, Search, Users } from 'lucide-react';
import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

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
  Critical: 0,
  'At-Risk': 1,
  Healthy: 2,
};

const HEALTH_OPTIONS: (HealthStatus | 'All')[] = ['All', 'Healthy', 'At-Risk', 'Critical'];

export function CustomerTable({ customers }: { customers: CustomerRecord[] }) {
  const [query, setQuery] = useState('');
  const [healthFilter, setHealthFilter] = useState<HealthStatus | 'All'>('All');
  const [sortKey, setSortKey] = useState<SortKey>('churnProbability');
  const [ascending, setAscending] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

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

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setAscending((v) => !v);
    } else {
      setSortKey(key);
      setAscending(false);
    }
  }

  const columns: { key: SortKey; label: string }[] = [
    { key: 'company', label: 'Account' },
    { key: 'health', label: 'Health' },
    { key: 'churnProbability', label: 'Risk' },
    { key: 'monthlyRecurringRevenue', label: 'MRR' },
    { key: 'renewalDate', label: 'Renewal' },
  ];

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
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <label className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              className="pl-10 w-48"
              placeholder="Search accounts"
              value={query}
              onChange={(event) =>
                startTransition(() => setQuery(event.target.value))
              }
              aria-label="Search accounts"
            />
          </label>

          {/* Health filter pills */}
          <div className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-white/4 p-1">
            {HEALTH_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() => setHealthFilter(option)}
                className={cn(
                  'rounded-xl px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50',
                  healthFilter === option
                    ? 'bg-white/10 text-white shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-200'
                )}
                aria-pressed={healthFilter === option}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Sort direction toggle */}
          <button
            className="inline-flex h-11 items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-zinc-200 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
            onClick={() => setAscending((value) => !value)}
            aria-label={ascending ? 'Sort descending' : 'Sort ascending'}
          >
            <ArrowUpDown className="h-4 w-4" />
            {ascending ? 'Asc' : 'Desc'}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-[28px] border border-white/10">
        <table
          className="min-w-full divide-y divide-white/10 text-left text-sm"
          role="grid"
          aria-label="Customer account table"
          aria-rowcount={filtered.length + 1}
        >
          <thead className="bg-white/4 text-zinc-400">
            <tr role="row">
              {columns.map(({ key, label }) => (
                <th
                  key={key}
                  scope="col"
                  className="px-4 py-4 font-medium"
                  aria-sort={
                    sortKey === key
                      ? ascending
                        ? 'ascending'
                        : 'descending'
                      : 'none'
                  }
                >
                  <button
                    className="inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50 rounded"
                    onClick={() => handleSort(key)}
                  >
                    {label}
                    {sortKey === key ? (
                      ascending ? (
                        <ChevronUp className="h-3.5 w-3.5 text-emerald-300" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5 text-emerald-300" />
                      )
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5 opacity-30" />
                    )}
                  </button>
                </th>
              ))}
              <th scope="col" className="px-4 py-4 text-right font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <motion.tbody
            className="divide-y divide-white/10 bg-black/20"
            initial={false}
            animate={{ opacity: isPending ? 0.7 : 1 }}
            transition={{ duration: 0.15 }}
          >
            {filtered.map((customer, rowIndex) => (
              <motion.tr
                key={customer.id}
                role="row"
                aria-rowindex={rowIndex + 2}
                layout
                onClick={() => router.push(`/dashboard/customer/${customer.id}`)}
                className="cursor-pointer transition-colors hover:bg-white/4 group"
                whileHover={{ scale: 1.001 }}
              >
                <td className="px-4 py-4" role="gridcell">
                  <div>
                    <p className="font-medium text-white">{customer.company}</p>
                    <p className="text-xs text-zinc-500">
                      {customer.name} · {customer.segment} · {customer.plan}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-4" role="gridcell">
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
                <td className="px-4 py-4" role="gridcell">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/10">
                      <div
                        className={cn(
                          'h-full rounded-full',
                          customer.churnProbability >= 60
                            ? 'bg-rose-400'
                            : customer.churnProbability >= 30
                              ? 'bg-amber-400'
                              : 'bg-emerald-400'
                        )}
                        style={{ width: `${customer.churnProbability}%` }}
                      />
                    </div>
                    <span className="font-mono-numeric text-zinc-300">
                      {customer.churnProbability}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 font-mono-numeric text-zinc-300" role="gridcell">
                  ${customer.monthlyRecurringRevenue.toLocaleString()}
                </td>
                <td className="px-4 py-4 text-zinc-300" role="gridcell">
                  {new Date(customer.renewalDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: '2-digit',
                  })}
                </td>
                <td className="px-4 py-4 text-right" role="gridcell">
                  <button
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    aria-label={`More options for ${customer.company}`}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <Users className="h-5 w-5 text-zinc-500" />
            </div>
            <p className="font-medium text-white">No accounts found</p>
            <p className="text-sm text-zinc-500">
              Try a different search term or filter combination.
            </p>
            <button
              className="mt-2 text-sm text-emerald-300 hover:text-emerald-200 transition-colors"
              onClick={() => {
                setQuery('');
                setHealthFilter('All');
              }}
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-zinc-500">
        <p>
          Showing <span className="text-white font-medium">{filtered.length}</span> of{' '}
          <span className="text-white font-medium">{customers.length}</span> accounts
        </p>
        {filtered.length < customers.length && (
          <button
            className="text-emerald-300 hover:text-emerald-200 transition-colors"
            onClick={() => {
              setQuery('');
              setHealthFilter('All');
            }}
          >
            Show all
          </button>
        )}
      </div>
    </GlassCard>
  );
}
