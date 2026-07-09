import { Badge } from '@/components/ui/badge';
import { GlassCard } from '@/components/ui/glass-card';
import { formatCurrency } from '@/lib/formatters';
import type { CustomerDetail } from '@/services/api';

export function Customer360({ customer }: { customer: CustomerDetail }) {
  return (
    <div className="space-y-6">
      <GlassCard className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">
              Customer 360
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-white">
              {customer.company}
            </h1>
            <p className="mt-2 text-zinc-400">
              {customer.name} · Owned by {customer.owner}. View health, renewal
              context, and the latest engagement signals in one place.
            </p>
          </div>
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
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[
            ['MRR', formatCurrency(customer.monthlyRecurringRevenue)],
            ['ACV', formatCurrency(customer.annualContractValue)],
            ['Billing', customer.billingStatus],
            ['Churn risk', `${customer.churnProbability}%`],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-3xl border border-white/10 bg-black/20 p-4"
            >
              <p className="text-sm text-zinc-500">{label}</p>
              <p className="mt-2 text-xl font-semibold text-white">{value}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <GlassCard className="space-y-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
              Telemetry
            </p>
            <h2 className="mt-2 text-xl font-semibold text-white">
              Account engagement signals and adoption depth
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {Object.entries(customer.technologySignals).map(
              ([label, value]) => (
                <div
                  key={label}
                  className="rounded-3xl border border-white/10 bg-white/5 p-4"
                >
                  <p className="text-sm capitalize text-zinc-500">
                    {label.replace(/([A-Z])/g, ' $1')}
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    {value}
                  </p>
                </div>
              )
            )}
          </div>
        </GlassCard>
        <GlassCard className="space-y-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
              Account notes
            </p>
            <h2 className="mt-2 text-xl font-semibold text-white">
              Context summary and next steps
            </h2>
          </div>
          <div className="space-y-3 text-sm text-zinc-300">
            {customer.notes.map((note) => (
              <p
                key={note}
                className="rounded-2xl border border-white/10 bg-black/20 p-4"
              >
                {note}
              </p>
            ))}
          </div>
        </GlassCard>
      </div>

      <GlassCard className="space-y-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
            Timeline
          </p>
          <h2 className="mt-2 text-xl font-semibold text-white">
            Recent events and signal shifts
          </h2>
        </div>
        <div className="space-y-3">
          {customer.timeline.map((event) => (
            <div
              key={event.id}
              className="rounded-3xl border border-white/10 bg-black/20 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-medium text-white">{event.title}</p>
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                  {event.category}
                </p>
              </div>
              <p className="mt-2 text-sm text-zinc-400">{event.detail}</p>
              <p className="mt-3 text-xs text-zinc-500">
                {new Date(event.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
